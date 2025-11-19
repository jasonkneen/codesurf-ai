import { For, Show, createMemo, createSignal, createEffect } from "solid-js"
import { createStore } from "solid-js/store"
import { useTheme } from "@tui/context/theme"
import { useKanban, type KanbanCard } from "@tui/context/kanban"
import { useDialog } from "@tui/ui/dialog"
import { TextAttributes } from "@opentui/core"
import { useKeyboard, useRenderer, useTerminalDimensions } from "@opentui/solid"
import { DialogPrompt } from "../ui/dialog-prompt"
import { DialogAlert } from "../ui/dialog-alert"

const LINK_ATTRS = TextAttributes.UNDERLINE

const INSTRUCTION_TEXT =
  "Navigate with ←/→, focus cards with ↑/↓, move cards with ctrl+←/→, press a to capture a new slice of work."

export function DialogKanban() {
  const dialog = useDialog()
  const { theme } = useTheme()
  const term = useTerminalDimensions()
  const renderer = useRenderer()
  const { board, actions, ready } = useKanban()

  const layoutBounds = {
    minWidth: 80,
    maxWidth: 200,
    minHeight: 18,
    maxHeight: 40,
    step: 2,
  }
  const [layout, setLayout] = createStore({ width: 130, height: 29 })
  let dragging = false,
    startX = 0,
    startY = 0,
    baseLeft = 0,
    baseTop = 0
  const applyFrame = (w: number, h: number, opts?: { preservePosition?: boolean }) => {
    const dims = term()
    const frameW = w + 4
    const frameH = h + 12
    const preserve = Boolean(opts?.preservePosition)
    let left = 0
    let top = 0
    if (preserve && (dialog as any).frame) {
      const f = (dialog as any).frame as { left?: number | null; top?: number | null }
      left = Math.max(0, Math.min(f.left ?? 0, Math.max(0, dims.width - frameW)))
      top = Math.max(1, Math.min(f.top ?? 1, Math.max(1, dims.height - frameH)))
    } else {
      left = Math.max(0, Math.floor((dims.width - frameW) / 2))
      top = Math.max(1, Math.floor((dims.height - frameH) / 3))
    }
    dialog.setFrame?.({ width: frameW, height: frameH, left, top })
  }
  const adjustWidth = (delta: number) => {
    const next = Math.min(layoutBounds.maxWidth, Math.max(layoutBounds.minWidth, layout.width + delta))
    setLayout("width", next)
    applyFrame(next, layout.height, { preservePosition: true })
  }
  const adjustHeight = (delta: number) => {
    const next = Math.min(layoutBounds.maxHeight, Math.max(layoutBounds.minHeight, layout.height + delta))
    setLayout("height", next)
    applyFrame(layout.width, next, { preservePosition: true })
  }

  const columnWidth = createMemo(() => {
    const columns = Math.max(1, board.columns.length)
    const gaps = Math.max(0, columns - 1) * 2
    const padding = 8
    const available = Math.max(layoutBounds.minWidth, layout.width - padding - gaps)
    return Math.max(18, Math.floor(available / columns))
  })

  const scrollHeight = createMemo(() => Math.max(8, layout.height - 11))

  const [compact, setCompact] = createSignal(false)
  const [dragDebug, setDragDebug] = createSignal("idle")

  createEffect(() => {
    dialog.setSize("large")
    applyFrame(layout.width, layout.height)
  })

  const activeColumn = createMemo(() => board.columns[board.focus.column])
  const activeCard = createMemo(() => {
    const column = activeColumn()
    if (!column) return undefined
    if (column.cards.length === 0) return undefined
    if (board.focus.card < 0) return column.cards[0]
    return column.cards[board.focus.card]
  })

  const createCard = async (targetColumnIndex?: number) => {
    const column =
      typeof targetColumnIndex === "number" ? board.columns[targetColumnIndex] : board.columns[board.focus.column]
    if (!column) return
    const value = await DialogPrompt.show(dialog, `New card for ${column.title}`)
    if (value) {
      actions.createCard(column.id, { title: value })
    }
    dialog.replace(() => <DialogKanban />)
  }

  const editCard = async () => {
    const card = activeCard()
    if (!card) return
    const value = await DialogPrompt.show(dialog, "Edit card", card.title)
    if (value) {
      actions.updateCard(card.id, { title: value })
    }
    dialog.replace(() => <DialogKanban />)
  }

  const deleteCard = async () => {
    const card = activeCard()
    if (!card) return
    const confirmed = await DialogAlert.show(
      dialog,
      "Confirm Delete",
      `Are you sure you want to delete "${card.title}"?`,
    )
    if (confirmed) {
      actions.deleteCard(card.id)
    }
    dialog.replace(() => <DialogKanban />)
  }

  useKeyboard(async (evt) => {
    if (evt.defaultPrevented) return
    if (evt.ctrl && evt.name === "left") {
      evt.preventDefault()
      actions.shiftCard(-1)
      return
    }
    if (evt.ctrl && evt.name === "right") {
      evt.preventDefault()
      actions.shiftCard(1)
      return
    }
    if (evt.name === "left" && !evt.ctrl) {
      evt.preventDefault()
      actions.moveColumn(-1)
      return
    }
    if (evt.name === "right" && !evt.ctrl) {
      evt.preventDefault()
      actions.moveColumn(1)
      return
    }
    if (evt.name === "up") {
      evt.preventDefault()
      actions.moveCardSelection(-1)
      return
    }
    if (evt.name === "down") {
      evt.preventDefault()
      actions.moveCardSelection(1)
      return
    }
    if ((evt.name === "a" || evt.name === "n") && !evt.ctrl && !evt.meta) {
      evt.preventDefault()
      await createCard()
      return
    }
    if (evt.name === "return") {
      evt.preventDefault()
      await editCard()
      return
    }
    if (evt.name === "d" && !evt.ctrl && !evt.meta) {
      evt.preventDefault()
      await deleteCard()
      return
    }
    if (evt.name === "c" && !evt.ctrl && !evt.meta) {
      evt.preventDefault()
      setCompact((value) => !value)
    }
  })

  return (
    <box
      width={layout.width + 4}
      paddingLeft={2}
      paddingRight={2}
      paddingBottom={1}
      paddingTop={1}
      flexDirection="column"
      alignItems="center"
      gap={1}
      backgroundColor={theme.background}
    >
      <box width={layout.width} flexDirection="column" gap={1}>
        <box
          flexDirection="row"
          justifyContent="space-between"
          renderBefore={function () {
            const el = this as any
            const handleDown = (e: any) => {
              dragging = true
              startX = e?.x ?? 0
              startY = e?.y ?? 0
              e?.preventDefault?.()
              renderer.clearSelection?.()
              setDragDebug(`start x:${startX} y:${startY}`)
              const frame = dialog.frame
              const dims = term()
              const w = layout.width + 4
              const h = layout.height + 12
              baseLeft = frame.left ?? Math.max(0, Math.floor((dims.width - w) / 2))
              baseTop = frame.top ?? Math.max(1, Math.floor((dims.height - h) / 3))
            }
            const handleMove = (e: any) => {
              if (!dragging) return
              const dims = term()
              const w = layout.width + 4
              const h = layout.height + 12
              const dx = (e?.x ?? startX) - startX
              const dy = (e?.y ?? startY) - startY
              const nextLeft = Math.max(0, Math.min(baseLeft + dx, Math.max(0, dims.width - w)))
              const nextTop = Math.max(1, Math.min(baseTop + dy, Math.max(1, dims.height - h)))
              setDragDebug(`drag dx:${dx} dy:${dy} pos:${nextLeft},${nextTop}`)
              dialog.setFrame?.({ width: w, height: h, left: nextLeft, top: nextTop })
            }
            const handleUp = () => {
              dragging = false
              setDragDebug("release")
            }
            const handleLeave = () => {
              dragging = false
              setDragDebug("cancel")
            }
            el.on("mousedown", handleDown)
            el.on("mousemove", handleMove)
            el.on("mouseup", handleUp)
            el.on("mouseleave", handleLeave)
          }}
        >
          <text fg={theme.text} attributes={TextAttributes.BOLD}>
            Kanban Control Room
          </text>
          <text fg={theme.textMuted}>esc</text>
        </box>

        <text fg={theme.textMuted} wrapMode="word">
          {dragDebug() === "idle" ? INSTRUCTION_TEXT : `${INSTRUCTION_TEXT}     drag debug: ${dragDebug()}`}
        </text>
        <box flexDirection="row" gap={1} alignItems="center" flexWrap="wrap">
          <box flexDirection="row" gap={0} alignItems="center">
            <text
              fg={layout.width > layoutBounds.minWidth ? theme.textMuted : theme.border}
              attributes={LINK_ATTRS}
              onMouseUp={() => adjustWidth(-layoutBounds.step)}
            >
              −
            </text>
            <text fg={theme.textMuted}>{layout.width}c</text>
            <text
              fg={layout.width < layoutBounds.maxWidth ? theme.textMuted : theme.border}
              attributes={LINK_ATTRS}
              onMouseUp={() => adjustWidth(layoutBounds.step)}
            >
              +
            </text>
          </box>
          <box flexDirection="row" gap={0} alignItems="center">
            <text
              fg={layout.height > layoutBounds.minHeight ? theme.textMuted : theme.border}
              attributes={LINK_ATTRS}
              onMouseUp={() => adjustHeight(-layoutBounds.step)}
            >
              −
            </text>
            <text fg={theme.textMuted}>{layout.height}l</text>
            <text
              fg={layout.height < layoutBounds.maxHeight ? theme.textMuted : theme.border}
              attributes={LINK_ATTRS}
              onMouseUp={() => adjustHeight(layoutBounds.step)}
            >
              +
            </text>
          </box>
          <text fg={theme.textMuted} attributes={LINK_ATTRS} onMouseUp={() => setCompact((value) => !value)}>
            {compact() ? "expand cards" : "compact cards"} (c)
          </text>
        </box>
        <box minHeight={layout.height} flexDirection="row" gap={1} justifyContent="center" flexWrap="no-wrap">
          <For each={board.columns}>
            {(column, idxAccessor) => {
              const idx = idxAccessor()
              const isActive = createMemo(() => board.focus.column === idx)
              return (
                <box
                  flexDirection="column"
                  width={columnWidth()}
                  flexGrow={0}
                  flexShrink={0}
                  backgroundColor={isActive() ? theme.backgroundElement : theme.backgroundPanel}
                  paddingLeft={1}
                  paddingRight={1}
                  paddingTop={1}
                  gap={1}
                >
                  <box flexDirection="row" justifyContent="space-between" alignItems="center">
                    <text fg={theme[column.accent] ?? theme.primary} attributes={TextAttributes.BOLD}>
                      {column.title}
                    </text>
                    <text fg={theme.textMuted}>
                      {column.wip.current}/{column.wip.limit}
                    </text>
                  </box>
                  <text fg={theme.textMuted} wrapMode="word">
                    {column.subtitle}
                  </text>
                  <text
                    fg={theme[column.accent] ?? theme.primary}
                    attributes={LINK_ATTRS}
                    onMouseUp={() => createCard(idx)}
                  >
                    + Add
                  </text>
                  <Show
                    when={column.cards.length > 0}
                    fallback={
                      <box padding={1} backgroundColor={theme.background}>
                        <text fg={theme.textMuted}>No work tracked</text>
                      </box>
                    }
                  >
                    <scrollbox height={scrollHeight()} scrollbarOptions={{ visible: false }}>
                      <For each={column.cards}>
                        {(card, cardIdxAccessor) => {
                          const cardIdx = cardIdxAccessor()
                          const isCardActive = createMemo(() => isActive() && board.focus.card === cardIdx)
                          return (
                            <box
                              flexDirection="column"
                              gap={compact() ? 0 : 1}
                              marginBottom={compact() ? 0 : 1}
                              paddingLeft={1}
                              paddingRight={1}
                              paddingTop={compact() ? 0 : 1}
                              paddingBottom={compact() ? 0 : 1}
                              backgroundColor={
                                isCardActive() ? (theme[column.accent] ?? theme.primary) : theme.background
                              }
                              onMouseUp={() => {
                                actions.focusCard(idx, cardIdx)
                              }}
                            >
                              <text
                                fg={isCardActive() ? theme.background : theme.text}
                                attributes={TextAttributes.BOLD}
                                wrapMode="word"
                              >
                                {card.title}
                              </text>
                              <Show when={!compact()}>
                                <text fg={isCardActive() ? theme.background : theme.textMuted} wrapMode="word">
                                  {card.summary}
                                </text>
                              </Show>
                              <Show when={!compact()}>
                                <box flexDirection="row" gap={1} alignItems="center" flexWrap="wrap">
                                  <text fg={isCardActive() ? theme.background : theme.textMuted}>@{card.owner}</text>
                                  <text fg={isCardActive() ? theme.background : theme.textMuted}>{card.eta}</text>
                                  <text fg={riskColor(theme, card.risk, isCardActive())}>{card.points} pts</text>
                                  <Show when={card.blocked}>
                                    <text fg={theme.error}>blocked</text>
                                  </Show>
                                </box>
                              </Show>
                              <box flexDirection="row" gap={1} flexWrap="wrap">
                                <For each={card.tags}>
                                  {(tag) => (
                                    <box
                                      backgroundColor={isCardActive() ? theme.background : theme.backgroundElement}
                                      paddingLeft={1}
                                      paddingRight={1}
                                    >
                                      <text
                                        fg={isCardActive() ? (theme[column.accent] ?? theme.primary) : theme.textMuted}
                                      >
                                        #{tag}
                                      </text>
                                    </box>
                                  )}
                                </For>
                              </box>
                            </box>
                          )
                        }}
                      </For>
                    </scrollbox>
                  </Show>
                  <Show when={column.cards.length > 0}>
                    <box flexDirection="row" gap={1} justifyContent="flex-end">
                      <Show when={idx > 0}>
                        <box backgroundColor={theme.backgroundElement} paddingLeft={1} paddingRight={1}>
                          <text
                            fg={theme.text}
                            attributes={TextAttributes.BOLD}
                            onMouseUp={() => actions.shiftCard(-1)}
                          >
                            ← move
                          </text>
                        </box>
                      </Show>
                      <Show when={idx < board.columns.length - 1}>
                        <box backgroundColor={theme.backgroundElement} paddingLeft={1} paddingRight={1}>
                          <text fg={theme.text} attributes={TextAttributes.BOLD} onMouseUp={() => actions.shiftCard(1)}>
                            move →
                          </text>
                        </box>
                      </Show>
                    </box>
                  </Show>
                </box>
              )
            }}
          </For>
        </box>
        <Show when={activeCard()}>
          {(card) => (
            <box
              flexDirection="column"
              gap={1}
              paddingLeft={1}
              paddingRight={1}
              paddingBottom={1}
              backgroundColor={theme.background}
            >
              <text fg={theme.text} attributes={TextAttributes.BOLD}>
                {card().title}
              </text>
              <text fg={theme.textMuted}>{card().summary}</text>
              <box flexDirection="row" gap={2}>
                <text fg={theme.textMuted}>
                  Owner: <span style={{ fg: theme.text }}>{card().owner}</span>
                </text>
                <text fg={theme.textMuted}>
                  ETA: <span style={{ fg: theme.text }}>{card().eta}</span>
                </text>
                <text fg={riskColor(theme, card().risk, false)}>Risk: {card().risk.toUpperCase()}</text>
              </box>
              <box flexDirection="row" gap={1} flexWrap="wrap">
                <For each={card().tags}>
                  {(tag) => (
                    <box backgroundColor={theme.backgroundElement} paddingLeft={1} paddingRight={1}>
                      <text fg={theme.accent}>#{tag}</text>
                    </box>
                  )}
                </For>
              </box>
              <box flexDirection="row" gap={2} marginTop={1}>
                <box backgroundColor={theme.accent} paddingLeft={1} paddingRight={1} onMouseUp={() => editCard()}>
                  <text fg={theme.background} attributes={TextAttributes.BOLD}>
                    Edit (enter)
                  </text>
                </box>
                <box backgroundColor={theme.error} paddingLeft={1} paddingRight={1} onMouseUp={() => deleteCard()}>
                  <text fg={theme.background} attributes={TextAttributes.BOLD}>
                    Delete (d)
                  </text>
                </box>
              </box>
            </box>
          )}
        </Show>
        <box flexDirection="row" justifyContent="space-between" paddingLeft={1} paddingRight={1}>
          <text fg={theme.textMuted}>ctrl+←/→ move · enter edit · d delete · c compact · a add</text>
        </box>
      </box>
    </box>
  )
}

function riskColor(theme: ReturnType<typeof useTheme>["theme"], risk: KanbanCard["risk"], inverted: boolean) {
  if (risk === "high") return inverted ? theme.background : theme.error
  if (risk === "medium") return inverted ? theme.background : theme.warning
  return inverted ? theme.background : theme.success
}
