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

  let titleRef!: TextareaRenderable
  let summaryRef!: TextareaRenderable
  let tagsRef!: TextareaRenderable
  let pointsRef!: TextareaRenderable

  const fields: TextareaRenderable[] = []
  const [focusedIndex, setFocusedIndex] = createSignal(0)

  onMount(() => {
    dialog.setSize("large")
    setTimeout(() => {
      fields[focusedIndex()]?.focus()
    }, 1)
  })

  const handleConfirm = () => {
    const title = titleRef?.plainText || ""
    const summary = summaryRef?.plainText || ""
    const tags = tagsRef?.plainText || ""
    const pointsText = pointsRef?.plainText || "1"
    const points = parseInt(pointsText, 10)

    props.onConfirm({
      title,
      summary,
      tags: tags
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
      fields[next]?.focus()
      return
    }
    if (evt.name === "up") {
      evt.preventDefault()
      const next = (focusedIndex() - 1 + fields.length) % fields.length
      setFocusedIndex(next)
      fields[next]?.focus()
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
            ref={(r: TextareaRenderable) => {
              titleRef = r
              fields[0] = r
            }}
            initialValue={props.card?.title ?? ""}
            placeholder="Card title"
          />
        </box>
        <box flexDirection="row" gap={2} alignItems="center">
          <text width={8}>Summary</text>
          <textarea
            ref={(r: TextareaRenderable) => {
              summaryRef = r
              fields[1] = r
            }}
            initialValue={props.card?.summary ?? ""}
            placeholder="Card summary"
          />
        </box>
        <box flexDirection="row" gap={2} alignItems="center">
          <text width={8}>Tags</text>
          <textarea
            ref={(r: TextareaRenderable) => {
              tagsRef = r
              fields[2] = r
            }}
            initialValue={props.card?.tags?.join(", ") ?? ""}
            placeholder="comma, separated, tags"
          />
        </box>
        <box flexDirection="row" gap={2} alignItems="center">
          <text width={8}>Points</text>
          <textarea
            ref={(r: TextareaRenderable) => {
              pointsRef = r
              fields[3] = r
            }}
            initialValue={props.card?.points?.toString() ?? "1"}
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
            resolve(data)
          }}
          onCancel={() => {
            resolve(null)
          }}
        />
      ),
      handleClose,
    )
  })
}
