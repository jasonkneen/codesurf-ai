import { TextAttributes } from "@opentui/core"
import { createSignal, onMount, Show } from "solid-js"
import { useTheme } from "@tui/context/theme"
import { useDialog } from "@tui/ui/dialog"
import { useLocal } from "@tui/context/local"
import { useKeyboard } from "@opentui/solid"

type SettingField = "enabled" | "threshold" | "decayRate" | "cacheTTL"

export function DialogContextSettings() {
  const { theme } = useTheme()
  const dialog = useDialog()
  const local = useLocal()
  const [selected, setSelected] = createSignal<SettingField>("enabled")
  const [editing, setEditing] = createSignal(false)
  const [editValue, setEditValue] = createSignal("")

  const fields: { key: SettingField; label: string; description: string }[] = [
    {
      key: "enabled",
      label: "Intelligent Context",
      description: "Enable intelligent context management for optimized token usage",
    },
    {
      key: "threshold",
      label: "Threshold",
      description: "Start cleanup when context reaches this % of limit (10-95%)",
    },
    {
      key: "decayRate",
      label: "Decay Rate",
      description: "Relevance decay per turn for older context items (1-50%)",
    },
    {
      key: "cacheTTL",
      label: "Cache TTL",
      description: "Token estimate cache duration (1-30 minutes)",
    },
  ]

  function getCurrentValue(field: SettingField): string {
    switch (field) {
      case "enabled":
        return local.contextSettings.enabled() ? "On" : "Off"
      case "threshold":
        return `${Math.round(local.contextSettings.threshold() * 100)}%`
      case "decayRate":
        return `${Math.round(local.contextSettings.decayRate() * 100)}%`
      case "cacheTTL":
        return `${Math.round(local.contextSettings.cacheTTL() / 60000)} min`
    }
  }

  function move(direction: number) {
    if (editing()) return
    const currentIndex = fields.findIndex((f) => f.key === selected())
    let next = currentIndex + direction
    if (next < 0) next = fields.length - 1
    if (next >= fields.length) next = 0
    setSelected(fields[next].key)
  }

  function toggle() {
    const field = selected()
    if (field === "enabled") {
      local.contextSettings.setEnabled(!local.contextSettings.enabled())
    } else {
      setEditing(true)
      if (field === "threshold") {
        setEditValue(String(Math.round(local.contextSettings.threshold() * 100)))
      } else if (field === "decayRate") {
        setEditValue(String(Math.round(local.contextSettings.decayRate() * 100)))
      } else if (field === "cacheTTL") {
        setEditValue(String(Math.round(local.contextSettings.cacheTTL() / 60000)))
      }
    }
  }

  function confirmEdit() {
    const field = selected()
    const value = parseFloat(editValue())
    if (isNaN(value)) {
      setEditing(false)
      return
    }

    if (field === "threshold") {
      local.contextSettings.setThreshold(value / 100)
    } else if (field === "decayRate") {
      local.contextSettings.setDecayRate(value / 100)
    } else if (field === "cacheTTL") {
      local.contextSettings.setCacheTTL(value * 60000)
    }
    setEditing(false)
  }

  function cancelEdit() {
    setEditing(false)
  }

  function adjustValue(direction: number) {
    const field = selected()
    if (field === "enabled") {
      local.contextSettings.setEnabled(!local.contextSettings.enabled())
      return
    }

    if (field === "threshold") {
      const current = local.contextSettings.threshold()
      local.contextSettings.setThreshold(current + direction * 0.05)
    } else if (field === "decayRate") {
      const current = local.contextSettings.decayRate()
      local.contextSettings.setDecayRate(current + direction * 0.01)
    } else if (field === "cacheTTL") {
      const current = local.contextSettings.cacheTTL()
      local.contextSettings.setCacheTTL(current + direction * 60000)
    }
  }

  useKeyboard((evt) => {
    if (editing()) {
      if (evt.name === "return") {
        evt.preventDefault()
        confirmEdit()
      } else if (evt.name === "escape") {
        evt.preventDefault()
        cancelEdit()
      } else if (evt.name === "backspace") {
        setEditValue((v) => v.slice(0, -1))
      } else if (/^[0-9]$/.test(evt.name || "")) {
        setEditValue((v) => v + evt.name)
      }
      return
    }

    if (evt.name === "up" || (evt.ctrl && evt.name === "p")) {
      evt.preventDefault()
      move(-1)
    }
    if (evt.name === "down" || (evt.ctrl && evt.name === "n")) {
      evt.preventDefault()
      move(1)
    }
    if (evt.name === "left") {
      evt.preventDefault()
      adjustValue(-1)
    }
    if (evt.name === "right") {
      evt.preventDefault()
      adjustValue(1)
    }
    if (evt.name === "return" || evt.name === " ") {
      evt.preventDefault()
      toggle()
    }
    if (evt.name === "r" && !evt.ctrl && !evt.meta) {
      evt.preventDefault()
      local.contextSettings.reset()
    }
  })

  onMount(() => {
    dialog.setSize("medium")
  })

  return (
    <box paddingLeft={2} paddingRight={2} gap={1} paddingBottom={1}>
      <box flexDirection="row" justifyContent="space-between">
        <text fg={theme.text} attributes={TextAttributes.BOLD}>
          Context Settings
        </text>
        <text fg={theme.textMuted}>esc</text>
      </box>

      <box paddingTop={1} gap={1}>
        {fields.map((field) => {
          const isSelected = () => selected() === field.key
          const isEditing = () => isSelected() && editing()
          return (
            <box
              flexDirection="row"
              backgroundColor={isSelected() ? theme.primary : undefined}
              paddingLeft={2}
              paddingRight={2}
            >
              <box flexGrow={1}>
                <text
                  fg={isSelected() ? theme.background : theme.text}
                  attributes={isSelected() ? TextAttributes.BOLD : undefined}
                >
                  {field.label}
                </text>
                <text fg={isSelected() ? theme.background : theme.textMuted}>
                  {field.description}
                </text>
              </box>
              <box minWidth={12} justifyContent="flex-end">
                <Show
                  when={isEditing()}
                  fallback={
                    <text
                      fg={isSelected() ? theme.background : theme.accent}
                      attributes={TextAttributes.BOLD}
                    >
                      {getCurrentValue(field.key)}
                    </text>
                  }
                >
                  <text fg={theme.background} attributes={TextAttributes.BOLD}>
                    {editValue()}
                    <span style={{ attributes: TextAttributes.BLINK }}>_</span>
                  </text>
                </Show>
              </box>
            </box>
          )
        })}
      </box>

      <box paddingTop={1} flexDirection="row" gap={2}>
        <text fg={theme.textMuted}>
          <span style={{ fg: theme.text }}>↑/↓</span> select{" "}
          <span style={{ fg: theme.text }}>←/→</span> adjust{" "}
          <span style={{ fg: theme.text }}>enter</span> edit{" "}
          <span style={{ fg: theme.text }}>r</span> reset
        </text>
      </box>
    </box>
  )
}
