import { createMemo } from "solid-js"
import { useSync } from "@tui/context/sync"
import { map, pipe, sortBy } from "remeda"
import { DialogSelect } from "@tui/ui/dialog-select"
import { useDialog } from "@tui/ui/dialog"
import { useTheme } from "../context/theme"
import { TextAttributes } from "@opentui/core"
import { DialogModel } from "./dialog-model"

const PROVIDER_PRIORITY: Record<string, number> = {
  opencode: 0,
  anthropic: 1,
  "github-copilot": 2,
  openai: 3,
  google: 4,
  kilocode: 5,
  openrouter: 6,
}

export function createDialogProviderOptions() {
  const sync = useSync()
  const dialog = useDialog()
  const options = createMemo(() => {
    return pipe(
      sync.data.provider_next.all,
      map((provider) => ({
        title: provider.name,
        value: provider.id,
        footer: {
          opencode: "Recommended",
          anthropic: "Claude Max or API key",
        }[provider.id],
        onSelect() {
          dialog.replace(() => <ApiMethodInfo title={provider.name} />)
        },
      })),
      sortBy((x) => PROVIDER_PRIORITY[x.value] ?? 99),
    )
  })
  return options
}

export function DialogProvider() {
  const options = createDialogProviderOptions()
  return <DialogSelect title="Connect a provider" options={options()} />
}

interface ApiMethodInfoProps {
  title: string
}
function ApiMethodInfo(props: ApiMethodInfoProps) {
  const { theme } = useTheme()

  return (
    <box paddingLeft={2} paddingRight={2} gap={1} paddingBottom={1}>
      <box flexDirection="row" justifyContent="space-between">
        <text attributes={TextAttributes.BOLD}>{props.title}</text>
        <text fg={theme.textMuted}>esc</text>
      </box>
      <box gap={1}>
        <text fg={theme.textMuted}>Provider setup is handled through configuration files.</text>
        <text fg={theme.primary}>Please configure your API key in ~/.opencode/config.json</text>
        <text fg={theme.textMuted}>Then restart the application.</text>
      </box>
    </box>
  )
}
