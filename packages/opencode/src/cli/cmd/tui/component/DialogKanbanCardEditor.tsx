import { createSignal, createEffect, onMount } from "solid-js"
import { createStore, produce } from "solid-js/store"
import { useTheme } from "@tui/context/theme"
import { useDialog, type DialogContext } from "@tui/ui/dialog"
import { TextAttributes, TextareaRenderable } from "@opentui/core"
import { useKeyboard } from "@opentui/solid"
import { type KanbanCard } from "@tui/context/kanban"

export type DialogKanbanCardEditorProps = {
  card?: Partial<KanbanCard>
  title: string
  onConfirm: (cardData: Partial<KanbanCard>) => void
  onCancel: () => void
}

export function DialogKanbanCardEditor(props: DialogKanbanCardEditorProps) {
  const dialog = useDialog()
  const { theme } = useTheme()
  const [form, setForm] = createStore({
    title: props.card?.title ?? "",
    summary: props.card?.summary ?? " ",
    tags: props.card?.tags?.join(", ") ?? "",
    points: props.card?.points?.toString() ?? "1",
  })

  const fields: { label: string; ref: TextareaRenderable }[] = []
  const [focusedIndex, setFocusedIndex] = createSignal(0)

  onMount(() => {
    dialog.setSize("large")
    setTimeout(() => {
      fields[focusedIndex()]?.ref.focus()
    }, 1)
  })

  const handleConfirm = () => {
    const points = parseInt(form.points, 10)
    props.onConfirm({
      title: form.title,
      summary: form.summary,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      points: isNaN(points) ? 1 : points,
    })
  }

  useKeyboard((evt) => {
    if (evt.name === "tab" || evt.name === "down") {
      evt.preventDefault()
      const next = (focusedIndex() + 1) % fields.length
      setFocusedIndex(next)
      fields[next]?.ref.focus()
      return
    }
    if (evt.name === "up") {
      evt.preventDefault()
      const next = (focusedIndex() - 1 + fields.length) % fields.length
      setFocusedIndex(next)
      fields[next]?.ref.focus()
      return
    }
    if (evt.name === "return" && evt.ctrl) {
      evt.preventDefault()
      handleConfirm()
    }
  })

  return (
    <box flexDirection="column" gap={1} paddingLeft={2} paddingRight={2} paddingTop={1} paddingBottom={1}>
      <box flexDirection="row" justifyContent="space-between">
        <text attributes={TextAttributes.BOLD}>{props.title}</text>
        <text fg={theme.textMuted}>esc to cancel</text>
      </box>

      <box flexDirection="column" gap={1}>
        <box flexDirection="row" gap={2} alignItems="center">
          <text width={8}>Title</text>
          <textarea
            ref={(r: TextareaRenderable) => (fields[0] = { label: "Title", ref: r })}
            initialValue={form.title}
            onTextChange={(text) => setForm("title", text)}
            placeholder="Card title"
          />
        </box>
        <box flexDirection="row" gap={2} alignItems="center">
          <text width={8}>Summary</text>
          <textarea
            ref={(r: TextareaRenderable) => (fields[1] = { label: "Summary", ref: r })}
            initialValue={form.summary}
            onTextChange={(text) => setForm("summary", text)}
            placeholder="Card summary"
          />
        </box>
        <box flexDirection="row" gap={2} alignItems="center">
          <text width={8}>Tags</text>
          <textarea
            ref={(r: TextareaRenderable) => (fields[2] = { label: "Tags", ref: r })}
            initialValue={form.tags}
            onTextChange={(text) => setForm("tags", text)}
            placeholder="comma, separated, tags"
          />
        </box>
        <box flexDirection="row" gap={2} alignItems="center">
          <text width={8}>Points</text>
          <textarea
            ref={(r: TextareaRenderable) => (fields[3] = { label: "Points", ref: r })}
            initialValue={form.points}
            onTextChange={(text) => setForm("points", text)}
            placeholder="1"
          />
        </box>
      </box>

      <box flexDirection="row" gap={2} marginTop={1}>
        <box backgroundColor={theme.accent} paddingLeft={1} paddingRight={1} onMouseUp={handleConfirm}>
          <text fg={theme.background} attributes={TextAttributes.BOLD}>
            Save (ctrl+enter)
          </text>
        </box>
        <box
          backgroundColor={theme.backgroundElement}
          paddingLeft={1}
          paddingRight={1}
          onMouseUp={() => props.onCancel()}
        >
          <text fg={theme.text} attributes={TextAttributes.BOLD}>
            Cancel (esc)
          </text>
        </box>
      </box>
    </box>
  )
}

DialogKanbanCardEditor.show = (dialog: DialogContext, title: string, card?: Partial<KanbanCard>) => {
  return new Promise<Partial<KanbanCard> | null>((resolve) => {
    const handleClose = () => resolve(null)
    dialog.replace(
      () => (
        <DialogKanbanCardEditor
          title={title}
          card={card}
          onConfirm={(data) => {
            dialog.clear()
            resolve(data)
          }}
          onCancel={() => {
            dialog.clear()
            resolve(null)
          }}
        />
      ),
      handleClose,
    )
  })
}
