import { createMemo } from "solid-js"
import { useLocal } from "@tui/context/local"
import { DialogSelect } from "@tui/ui/dialog-select"
import { useDialog } from "@tui/ui/dialog"
import { useTheme } from "@tui/context/theme"

export function DialogAgent() {
  const local = useLocal()
  const dialog = useDialog()
  const { theme } = useTheme()

  const options = createMemo(() => {
    const allAgents = local.agent.list()
    const primaryAgents = allAgents.filter((x) => x.mode !== "subagent")
    const subagents = allAgents.filter((x) => x.mode === "subagent")

    const primaryOptions = primaryAgents.map((item) => ({
      value: item.name,
      title: item.name,
      description: item.builtIn ? "native" : item.description,
      category: "Primary Agents",
    }))

    const subagentOptions = subagents.map((item) => ({
      value: item.name,
      title: item.name,
      description: item.builtIn ? "native" : item.description,
      category: "Subagents (non-selectable)",
      disabled: true,
      bg: theme.backgroundPanel,
    }))

    return [...primaryOptions, ...subagentOptions]
  })

  return (
    <DialogSelect
      title="Select agent"
      current={local.agent.current().name}
      options={options()}
      collapsibleDescriptions={true}
      onSelect={(option) => {
        local.agent.set(option.value)
        dialog.clear()
      }}
    />
  )
}
