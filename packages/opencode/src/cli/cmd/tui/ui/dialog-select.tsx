import { InputRenderable, RGBA, ScrollBoxRenderable, TextAttributes } from "@opentui/core"
import { useTheme, selectedForeground } from "@tui/context/theme"
import { entries, filter, flatMap, groupBy, pipe, take } from "remeda"
import { batch, createEffect, createMemo, For, Show, type JSX } from "solid-js"
import { createStore } from "solid-js/store"
import { useTerminalDimensions, useKeyboard } from "@opentui/solid"
import * as fuzzysort from "fuzzysort"
import { isDeepEqual } from "remeda"
import { useDialog, type DialogContext } from "@tui/ui/dialog"
import { useKeybind } from "@tui/context/keybind"
import { Keybind } from "@/util/keybind"
import { Locale } from "@/util/locale"

export interface DialogSelectProps<T> {
  title: string
  options: DialogSelectOption<T>[]
  ref?: (ref: DialogSelectRef<T>) => void
  onMove?: (option: DialogSelectOption<T>) => void
  onFilter?: (query: string) => void
  onSelect?: (option: DialogSelectOption<T>) => void
  keybind?: {
    keybind: Keybind.Info
    title: string
    onTrigger: (option: DialogSelectOption<T>) => void
  }[]
  limit?: number
  current?: T
  collapsibleDescriptions?: boolean
  onLoadMore?: () => void
  hasMore?: boolean
}

export interface DialogSelectOption<T = any> {
  title: string
  value: T
  description?: string
  footer?: string
  category?: string
  disabled?: boolean
  bg?: RGBA
  onSelect?: (ctx: DialogContext, trigger?: "prompt") => void
}

export type DialogSelectRef<T> = {
  filter: string
  filtered: DialogSelectOption<T>[]
}

export function DialogSelect<T>(props: DialogSelectProps<T>) {
  const dialog = useDialog()
  const { theme } = useTheme()
  const [store, setStore] = createStore({
    selected: 0,
    filter: "",
    expandedValue: null as T | null,
  })

  let input: InputRenderable

  const filtered = createMemo(() => {
    const needle = store.filter.toLowerCase()
    // Use HEAD version: allow disabled items (headers) to pass through for display
    const result = pipe(props.options, (x) =>
      !needle ? x : fuzzysort.go(needle, x, { keys: ["title", "category"] }).map((x) => x.obj),
    )
    return result
  })

  const grouped = createMemo(() => {
    const result = pipe(
      filtered(),
      groupBy((x) => x.category ?? ""),
      entries(),
    )
    return result
  })

  const flat = createMemo(() => {
    return pipe(
      grouped(),
      flatMap(([_, options]) => options),
    )
  })

  const dimensions = useTerminalDimensions()
  const height = createMemo(() =>
    Math.min(flat().length + grouped().length * 2 - 1, Math.floor(dimensions().height / 2) - 6),
  )

  const selected = createMemo(() => flat()[store.selected])

  // Initialize selection to current item ONCE on mount (not reactive)
  // Using untrack to prevent this from re-running when selection changes
  if (props.current) {
    const index = flat().findIndex((x) => isDeepEqual(x.value, props.current))
    if (index !== -1) {
      setStore("selected", index)
    }
  }

  createEffect(() => {
    store.filter
    setStore("selected", 0)
    if (scroll) scroll.scrollTo(0)
  })

  function move(direction: number) {
    if (flat().length === 0) return
    let next = store.selected + direction
    if (next < 0) next = flat().length - 1
    if (next >= flat().length) next = 0
    moveTo(next)
  }

  function moveTo(next: number) {
    setStore("selected", next)
    const sel = selected()
    if (sel) {
      props.onMove?.(sel)
    }
    if (!scroll) return
    const target = scroll.getChildren().find((child) => {
      return child.id === JSON.stringify(selected()?.value)
    })
    if (!target) return
    const y = target.y - scroll.y
    if (y >= scroll.height) {
      scroll.scrollBy(y - scroll.height + 1)
    }
    if (y < 0) {
      scroll.scrollBy(y)
      if (flat().length > 0 && isDeepEqual(flat()[0].value, selected()?.value)) {
        scroll.scrollTo(0)
      }
    }
  }

  const keybind = useKeybind()

  useKeyboard((evt) => {
    const name = evt.name?.toLowerCase()

    // Handle navigation keys first - they take priority
    if (name === "up" || (evt.ctrl && name === "k") || (evt.ctrl && name === "p")) {
      evt.preventDefault()
      move(-1)
      return
    }
    if (name === "down" || (evt.ctrl && name === "j") || (evt.ctrl && name === "n")) {
      evt.preventDefault()
      move(1)
      return
    }
    if (name === "pageup" || (evt.ctrl && name === "u")) {
      evt.preventDefault()
      move(-10)
      return
    }
    if (name === "pagedown" || (evt.ctrl && name === "d")) {
      evt.preventDefault()
      move(10)
      return
    }
    if (props.collapsibleDescriptions && (name === "right" || name === "space")) {
      evt.preventDefault()
      const option = selected()
      if (option) {
        setStore("expandedValue", (prev) => (isDeepEqual(prev, option.value) ? null : option.value))
      }
      return
    }
    if (props.collapsibleDescriptions && name === "left") {
      evt.preventDefault()
      setStore("expandedValue", null)
      return
    }
    if (name === "return") {
      evt.preventDefault()
      const option = selected()
      if (option) {
        if (option.onSelect) option.onSelect(dialog)
        props.onSelect?.(option)
      }
      return
    }

    // Check custom keybinds
    for (const item of props.keybind ?? []) {
      const parsedEvt = { ...evt, source: "raw" as const }
      const parsed = keybind.parse(parsedEvt)
      if (Keybind.match(item.keybind, parsed)) {
        const s = selected()
        if (s) {
          evt.preventDefault()
          item.onTrigger(s)
        }
        return
      }
    }

    // Refocus input for typing events (not navigation keys)
    if (evt.sequence && !evt.ctrl && !evt.meta) {
      if (input && !input.isDestroyed && !input.focused) {
        input.focus()
      }
    }
  })

  let scroll: ScrollBoxRenderable

  const ref: DialogSelectRef<T> = {
    get filter() {
      return store.filter
    },
    get filtered() {
      return filtered()
    },
  }
  props.ref?.(ref)

  createEffect(() => {
    if (!props.onLoadMore || !props.hasMore || !scroll) return
    const scrollPercentage = (scroll.y + scroll.height) / scroll.scrollHeight
    if (scrollPercentage > 0.8) {
      props.onLoadMore()
    }
  })

  return (
    <box gap={1}>
      <box paddingLeft={3} paddingRight={2}>
        <box flexDirection="row" justifyContent="space-between">
          <text fg={theme.text} attributes={TextAttributes.BOLD}>
            {props.title}
          </text>
          <text fg={theme.textMuted}>esc</text>
        </box>
        <box paddingTop={1} paddingBottom={1}>
          <input
            onInput={(e) => {
              batch(() => {
                setStore("filter", e)
                props.onFilter?.(e)
              })
            }}
            onKeyDown={(evt) => {
              const name = evt.name?.toLowerCase()
              // Handle navigation keys directly from input - don't wait for global handler
              if (name === "up" || (evt.ctrl && (name === "k" || name === "p"))) {
                evt.preventDefault()
                move(-1)
                return
              }
              if (name === "down" || (evt.ctrl && (name === "j" || name === "n"))) {
                evt.preventDefault()
                move(1)
                return
              }
              if (name === "pageup" || (evt.ctrl && name === "u")) {
                evt.preventDefault()
                move(-10)
                return
              }
              if (name === "pagedown" || (evt.ctrl && name === "d")) {
                evt.preventDefault()
                move(10)
                return
              }
              if (name === "return") {
                evt.preventDefault()
                const option = selected()
                if (option) {
                  if (option.onSelect) option.onSelect(dialog)
                  props.onSelect?.(option)
                }
                return
              }
            }}
            focusedBackgroundColor={theme.backgroundPanel}
            cursorColor={theme.primary}
            focusedTextColor={theme.textMuted}
            ref={(r) => {
              input = r
              // Ensure input gets focus after render is complete
              queueMicrotask(() => {
                if (input && !input.isDestroyed) {
                  input.focus()
                }
              })
            }}
            placeholder="Enter search term"
          />
        </box>
      </box>
      <scrollbox
        paddingLeft={2}
        paddingRight={2}
        scrollbarOptions={{ visible: false }}
        ref={(r: ScrollBoxRenderable) => (scroll = r)}
        maxHeight={height()}
      >
        <For each={grouped()}>
          {([category, options], index) => (
            <>
              <Show when={category}>
                <box paddingTop={index() > 0 ? 1 : 0} paddingLeft={1}>
                  <text fg={theme.accent} attributes={TextAttributes.BOLD}>
                    {category}
                  </text>
                </box>
              </Show>
              <For each={options}>
                {(option) => {
                  const active = createMemo(() => isDeepEqual(option.value, selected()?.value))
                  return (
                    <box
                      id={JSON.stringify(option.value)}
                      flexDirection="row"
                      onMouseUp={() => {
                        option.onSelect?.(dialog)
                        props.onSelect?.(option)
                      }}
                      onMouseOver={() => {
                        const index = flat().findIndex((x) => isDeepEqual(x.value, option.value))
                        if (index === -1) return
                        moveTo(index)
                        // Blur input to hide cursor when using mouse
                        if (input) input.blur()
                      }}
                      backgroundColor={active() ? (option.bg ?? theme.primary) : RGBA.fromInts(0, 0, 0, 0)}
                      paddingLeft={1}
                      paddingRight={1}
                      gap={0}
                    >
                      <Option
                        title={option.title}
                        footer={option.footer}
                        description={option.description !== category ? option.description : undefined}
                        active={active()}
                        current={isDeepEqual(option.value, props.current)}
                      />
                    </box>
                  )
                }}
              </For>
            </>
          )}
        </For>
      </scrollbox>
      <box paddingRight={2} paddingLeft={3} flexDirection="row" paddingBottom={1} gap={1}>
        <For each={props.keybind ?? []}>
          {(item) => (
            <box flexDirection="row">
              <text fg={theme.text} attributes={TextAttributes.BOLD}>
                {Keybind.toString(item.keybind)}
              </text>
              <text fg={theme.textMuted}> {item.title}</text>
            </box>
          )}
        </For>
      </box>
    </box>
  )
}

function Option(props: {
  title: string
  description?: string
  active?: boolean
  current?: boolean
  footer?: JSX.Element | string
  onMouseOver?: () => void
}) {
  const { theme } = useTheme()
  const fg = selectedForeground(theme)

  return (
    <>
      {/* Fixed-width indicator column - always reserves space */}
      <text flexShrink={0} width={2} fg={props.current ? theme.primary : RGBA.fromInts(0, 0, 0, 0)}>
        {props.current ? "●" : " "}
      </text>
      <text
        flexGrow={1}
        fg={props.active ? fg : theme.text}
        attributes={props.active ? TextAttributes.BOLD : undefined}
        overflow="hidden"
        wrapMode="none"
      >
        {Locale.truncate(props.title, 62)}
        <span style={{ fg: props.active ? fg : theme.textMuted }}> {props.description}</span>
      </text>
      <Show when={props.footer}>
        <box flexShrink={0}>
          <text fg={props.active ? fg : theme.textMuted}>{props.footer}</text>
        </box>
      </Show>
    </>
  )
}
