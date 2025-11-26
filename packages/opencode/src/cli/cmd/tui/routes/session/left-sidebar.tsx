import { createMemo, createSignal, For, Show, createEffect, onCleanup } from "solid-js"
import { useTheme } from "../../context/theme"
import { useKV } from "../../context/kv"

import { useSync } from "@tui/context/sync"
import { Locale } from "@/util/locale"
import { TextAttributes } from "@opentui/core"
import { useRenderer } from "@opentui/solid"
import { useDialog } from "../../ui/dialog"
import { DialogPrompt } from "../../ui/dialog-prompt"

const HIDDEN_CATEGORY = "Hidden"
const CLOCK_REFRESH_INTERVAL_MS = 60 * 1000
const HIDDEN_SESSIONS_KV_KEY = "leftSidebar.hiddenSessions"
const DAY_IN_MS = 24 * 60 * 60 * 1000
const DATE_CATEGORY_ORDER = ["Today", "Yesterday", "This week", "Last week", "Older"] as const
const RUNNING_SPINNER_FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"] as const
const RUNNING_SPINNER_INTERVAL_MS = 200

// Isolated spinner component to prevent reactivity cascade
function SessionSpinner() {
  const [index, setIndex] = createSignal(0)
  createEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % RUNNING_SPINNER_FRAMES.length)
    }, RUNNING_SPINNER_INTERVAL_MS)
    onCleanup(() => clearInterval(interval))
  })
  return <text>{RUNNING_SPINNER_FRAMES[index()]}</text>
}
const STALE_SPINNER_TIMEOUT_MS = 15_000
const HIDE_ICON = "⊖"
const SHOW_ICON = "⊕"
const OLDER_INITIAL_LIMIT = 12
const OLDER_INCREMENT = 12

type DateCategory = (typeof DATE_CATEGORY_ORDER)[number]

function shiftDays(base: Date, days: number) {
  return new Date(base.getTime() + days * DAY_IN_MS)
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function getDateCategory(
  date: Date,
  refs: {
    todayStart: Date
    yesterdayStart: Date
    weekStart: Date
    lastWeekStart: Date
  },
): DateCategory {
  if (date >= refs.todayStart) return "Today"
  if (date >= refs.yesterdayStart) return "Yesterday"
  if (date >= refs.weekStart) return "This week"
  if (date >= refs.lastWeekStart) return "Last week"
  return "Older"
}

interface WorkerState {
  sessions: Array<{
    id: string
    title: string
    createdAt: number
    updatedAt: number
    parentID?: string
  }>
  categorized: {
    today: any[]
    yesterday: any[]
    thisWeek: any[]
    lastWeek: any[]
    older: any[]
  }
  searchResults: any[]
  lastUpdated: number
}

export function LeftSidebar(props: {
  sessionID: string
  onToggle: () => void
  onSelect: (sessionID: string) => void
  onNewSession: () => void
  openTabs: string[]
  onClose: (sessionID: string) => void | Promise<void>
  width: number
  minWidth: number
  maxWidth: number
  widthStep: number
  onResize: (delta: number) => void
  workerState?: WorkerState | null
  onSearch?: (query: string) => void
}) {
  const sync = useSync()
  const { theme } = useTheme()
  const renderer = useRenderer()
  const dialog = useDialog()
  const kv = useKV()

  const [hiddenSessionIDs, setHiddenSessionIDs] = createSignal<string[]>(kv.get(HIDDEN_SESSIONS_KV_KEY, []))
  const hiddenSessionSet = createMemo(() => new Set(hiddenSessionIDs()))

  const persistHiddenSessions = (editor: (draft: Set<string>) => void) => {
    const next = new Set(hiddenSessionSet())
    editor(next)
    const nextList = Array.from(next)
    setHiddenSessionIDs(nextList)
    kv.set(HIDDEN_SESSIONS_KV_KEY, nextList)
  }

  const hideSession = (sessionID: string) => {
    if (hiddenSessionSet().has(sessionID)) return
    persistHiddenSessions((draft) => {
      draft.add(sessionID)
    })
  }

  const showSession = (sessionID: string) => {
    if (!hiddenSessionSet().has(sessionID)) return
    persistHiddenSessions((draft) => {
      draft.delete(sessionID)
    })
  }

  const isSessionHidden = (sessionID: string) => hiddenSessionSet().has(sessionID)

  const [displayLimit, setDisplayLimit] = createSignal(20)
  const [expandedCategories, setExpandedCategories] = createSignal<Set<string>>(new Set([DATE_CATEGORY_ORDER[0]]))
  const [searchQuery, setSearchQuery] = createSignal("")
  const isSearching = createMemo(() => searchQuery().trim().length > 0)

  const [clock, setClock] = createSignal(Date.now())
  const [olderLimit, setOlderLimit] = createSignal(OLDER_INITIAL_LIMIT)

  createEffect(() => {
    const interval = setInterval(() => setClock(Date.now()), CLOCK_REFRESH_INTERVAL_MS)
    onCleanup(() => clearInterval(interval))
  })

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    props.onSearch?.(query)
  }

  const openSearchDialog = () => {
    dialog.replace(() => (
      <DialogPrompt
        title="Search Sessions"
        value={searchQuery()}
        onConfirm={(value: string) => {
          handleSearch(value)
          dialog.clear()
        }}
        onCancel={() => dialog.clear()}
      />
    ))
  }

  const allSessions = createMemo(() => {
    // Use worker results for search if available
    if (props.workerState && isSearching()) {
      return props.workerState.searchResults
    }

    const query = searchQuery().toLowerCase().trim()

    return sync.data.session
      .filter((x) => x.parentID === undefined)
      .filter((x) => {
        const title = x.title.toLowerCase()
        return (
          !title.includes("clarifying") &&
          !title.includes("parsing") &&
          !title.includes("invalid input") &&
          !title.includes("discussing adsad") &&
          !title.startsWith("new session -")
        )
      })
      .filter((x) => {
        if (!query) return true
        return x.title.toLowerCase().includes(query)
      })
      .sort((a, b) => b.time.updated - a.time.updated)
  })

  const visibleSessions = createMemo(() => {
    if (isSearching()) return allSessions()
    const hidden = hiddenSessionSet()
    return allSessions().filter((session) => !hidden.has(session.id))
  })

  const hiddenSessions = createMemo(() => {
    const hidden = hiddenSessionSet()
    return allSessions().filter((session) => hidden.has(session.id))
  })

  const sessionsByCategory = createMemo(() => {
    // Use worker results for categorization if available and not searching
    if (props.workerState && !isSearching()) {
      const grouped = new Map<string, any[]>()
      const cat = props.workerState.categorized

      // Helper to filter hidden sessions from worker data
      const filterVisible = (sessions: any[]) => sessions.filter((s) => !isSessionHidden(s.id))

      grouped.set("Today", filterVisible(cat.today))
      grouped.set("Yesterday", filterVisible(cat.yesterday))
      grouped.set("This week", filterVisible(cat.thisWeek))
      grouped.set("Last week", filterVisible(cat.lastWeek))
      grouped.set("Older", filterVisible(cat.older))
      return grouped
    }

    const grouped = new Map<string, any[]>()
    DATE_CATEGORY_ORDER.forEach((category) => grouped.set(category, []))

    const now = clock()
    const nowDate = new Date(now)
    const todayStart = startOfDay(nowDate)
    const yesterdayStart = shiftDays(todayStart, -1)
    const weekStart = shiftDays(todayStart, -todayStart.getDay())
    const lastWeekStart = shiftDays(weekStart, -7)

    visibleSessions().forEach((session) => {
      const sessionDate = new Date(session.time.updated)
      const category = getDateCategory(sessionDate, {
        todayStart,
        yesterdayStart,
        weekStart,
        lastWeekStart,
      })
      grouped.get(category)!.push(session)
    })

    return grouped
  })

  const allCategories = createMemo(() => {
    const categories: string[] = []
    DATE_CATEGORY_ORDER.forEach((category) => {
      if ((sessionsByCategory().get(category)?.length ?? 0) > 0) {
        categories.push(category)
      }
    })
    if (!isSearching() && hiddenSessions().length) {
      categories.push(HIDDEN_CATEGORY)
    }
    return categories
  })

  // Toggle category expansion
  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(category)) {
        newSet.delete(category)
      } else {
        newSet.add(category)
      }
      return newSet
    })
  }

  const sessions = createMemo(() => allSessions().slice(0, displayLimit()))
  const hasMore = createMemo(() => allSessions().length > displayLimit())
  const currentSession = createMemo(() => sync.session.get(props.sessionID)!)
  const canShrink = () => props.width > props.minWidth
  const canGrow = () => props.width < props.maxWidth

  type SessionIndicatorState = "idle" | "active" | "attention" | "error"

  const getSessionIndicatorState = (session: {
    id: string
    orchestration?: { status?: string }
    time?: { updated?: number }
  }): SessionIndicatorState => {
    if (isSessionHidden(session.id)) return "idle"
    const orchestrationStatus = session.orchestration?.status
    if (orchestrationStatus === "archived") return "idle"
    if (orchestrationStatus === "failed") return "error"
    if (orchestrationStatus === "paused") return "attention"

    const pendingPermissions = (sync.data.permission?.[session.id]?.length ?? 0) > 0
    if (pendingPermissions) return "attention"

    const messages = sync.data.message?.[session.id] ?? []
    const lastMessage = messages[messages.length - 1] as
      | { error?: unknown; role?: string; time?: { completed?: number } }
      | undefined
    if (lastMessage?.error) return "error"

    const derivedStatus = sync.session.status(session.id)
    if (derivedStatus === "working" || derivedStatus === "compacting") return "active"

    if (orchestrationStatus === "active") {
      const lastUpdated = session.time?.updated ?? 0
      if (clock() - lastUpdated < STALE_SPINNER_TIMEOUT_MS) {
        return "active"
      }
    }

    return "idle"
  }

  const getSessionStatusColor = (session: { id: string; orchestration?: { status?: string } }) => {
    const state = getSessionIndicatorState(session)
    if (state === "error" || state === "attention") return theme.error
    if (state === "active") return theme.warning
    return theme.textMuted
  }

  const isSessionActive = (session: { id: string; orchestration?: { status?: string } }) =>
    getSessionIndicatorState(session) === "active"

  return (
    <Show when={currentSession()}>
      <box flexShrink={0} gap={1} width={props.width}>
        <box flexDirection="row" justifyContent="space-between" paddingRight={1} alignItems="center">
          <box flexDirection="row" gap={1} alignItems="center">
            <box flexDirection="row" gap={0} alignItems="center">
              <text
                fg={canShrink() ? theme.textMuted : theme.border}
                wrapMode="none"
                onMouseUp={(evt) => {
                  if (renderer.getSelection()?.getSelectedText()) return
                  if (!canShrink()) return
                  props.onResize(-props.widthStep)
                  evt.stopPropagation?.()
                }}
              >
                -
              </text>
              <text fg={theme.textMuted} wrapMode="none">
                {props.width}c
              </text>
              <text
                fg={canGrow() ? theme.textMuted : theme.border}
                wrapMode="none"
                onMouseUp={(evt) => {
                  if (renderer.getSelection()?.getSelectedText()) return
                  if (!canGrow()) return
                  props.onResize(props.widthStep)
                  evt.stopPropagation?.()
                }}
              >
                +
              </text>
            </box>
            <text fg={theme.textMuted} attributes={TextAttributes.BOLD}>
              SESSIONS
            </text>
          </box>
          <text
            fg={theme.textMuted}
            onMouseUp={() => {
              if (renderer.getSelection()?.getSelectedText()) return
              props.onToggle()
            }}
          >
            ◀
          </text>
        </box>

        {/* Search Field */}
        <box
          flexDirection="row"
          gap={1}
          paddingLeft={1}
          paddingRight={1}
          paddingBottom={1}
          border={["bottom"]}
          borderColor={theme.border}
          backgroundColor={theme.backgroundPanel}
          flexShrink={0}
          onMouseUp={() => {
            if (renderer.getSelection()?.getSelectedText()) return
            openSearchDialog()
          }}
        >
          <box flexGrow={1}>
            <Show when={searchQuery()} fallback={<text fg={theme.textMuted}>Click to search...</text>}>
              <text fg={theme.text}>{searchQuery()}</text>
            </Show>
          </box>
          <Show when={searchQuery()}>
            <text
              fg={theme.textMuted}
              onMouseUp={(e) => {
                e.stopPropagation?.()
                handleSearch("")
              }}
            >
              ×
            </text>
          </Show>
        </box>

        <scrollbox flexGrow={1} height="100%" scrollbarOptions={{ visible: false }} paddingTop={1} paddingBottom={1}>
          <For each={allCategories()}>
            {(category) => {
              const isExpanded = () => expandedCategories().has(category)
              const categorySessions = () => {
                if (category === HIDDEN_CATEGORY) {
                  return hiddenSessions()
                }
                const sessions = sessionsByCategory().get(category) || []
                if (!isSearching() && category === "Older") {
                  return sessions.slice(0, olderLimit())
                }
                return sessions
              }

              return (
                <box marginBottom={1}>
                  <text
                    fg={theme.textMuted}
                    attributes={TextAttributes.BOLD}
                    wrapMode="none"
                    height={1}
                    onMouseUp={() => {
                      if (renderer.getSelection()?.getSelectedText()) return
                      toggleCategory(category)
                    }}
                  >
                    {isExpanded() ? "▼" : "▶"} {category} ({categorySessions().length})
                  </text>
                  <Show when={isExpanded()}>
                    <For each={categorySessions()}>
                      {(session) => {
                        const [hover, setHover] = createSignal(false)
                        const isOpen = () => props.openTabs.includes(session.id)
                        const sessionColor = () =>
                          session.id === props.sessionID ? theme.accent : getSessionStatusColor(session)

                        const title = () =>
                          Locale.truncate(Locale.stripMarkdown(session.title), isOpen() && hover() ? 33 : 37)
                        const suffix = () => (isOpen() && hover() ? " ×" : "")
                        const staticPrefix = () => {
                          return ""
                        }
                        const lineText = () => `${staticPrefix()}${title()}${suffix()}`
                        const showSpinner = () => {
                          const status = sync.session.status(session.id)
                          return status === "working" || status === "compacting"
                        }

                        const hidden = () => isSessionHidden(session.id)
                        const hideIcon = () => (hidden() ? SHOW_ICON : HIDE_ICON)
                        const hideColor = () => (hidden() ? theme.success : theme.textMuted)

                        return (
                          <box
                            flexDirection="row"
                            alignItems="center"
                            gap={0}
                            height={1}
                            renderBefore={function () {
                              const el = this as any
                              el.on("mouseenter", () => setHover(true))
                              el.on("mouseleave", () => setHover(false))
                            }}
                            onMouseUp={(evt) => {
                              if (renderer.getSelection()?.getSelectedText()) return
                              const target = (evt as any).target
                              if (target?.textContent?.includes("×")) {
                                props.onClose(session.id)
                                return
                              }
                              if (session.id !== props.sessionID) {
                                props.onSelect(session.id)
                              }
                            }}
                          >
                            {/* Fixed-width spinner column - always reserves space */}
                            <box width={2} flexShrink={0}>
                              <Show when={showSpinner()} fallback={<text> </text>}>
                                <SessionSpinner />
                              </Show>
                            </box>
                            <box flexGrow={1} overflow="hidden" flexDirection="row">
                              <text
                                fg={sessionColor()}
                                attributes={session.id === props.sessionID ? TextAttributes.BOLD : undefined}
                                wrapMode="none"
                                height={1}
                              >
                                {lineText()}
                              </text>
                            </box>
                            <text
                              fg={hideColor()}
                              wrapMode="none"
                              height={1}
                              onMouseUp={(evt) => {
                                evt.stopPropagation?.()
                                const currentlyHidden = hidden()
                                if (currentlyHidden) {
                                  showSession(session.id)
                                  return
                                }
                                hideSession(session.id)
                              }}
                            >
                              {hideIcon()}
                            </text>
                          </box>
                        )
                      }}
                    </For>
                    <Show
                      when={
                        !isSearching() &&
                        category === "Older" &&
                        (sessionsByCategory().get("Older")?.length ?? 0) > olderLimit()
                      }
                    >
                      <box marginTop={1} paddingLeft={4}>
                        <text
                          fg={theme.textMuted}
                          onMouseUp={() => {
                            if (renderer.getSelection()?.getSelectedText()) return
                            setOlderLimit((prev) => prev + OLDER_INCREMENT)
                          }}
                        >
                          load more ({sessionsByCategory().get("Older")!.length - olderLimit()})
                        </text>
                      </box>
                    </Show>
                  </Show>
                </box>
              )
            }}
          </For>
        </scrollbox>

        <box marginTop={1}>
          <text
            fg={theme.accent}
            attributes={TextAttributes.BOLD}
            onMouseUp={() => {
              if (renderer.getSelection()?.getSelectedText()) return
              props.onNewSession()
            }}
          >
            New Session
          </text>
        </box>
      </box>
    </Show>
  )
}
