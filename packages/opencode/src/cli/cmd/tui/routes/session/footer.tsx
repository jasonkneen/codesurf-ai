import { createMemo, Match, Show, Switch, For } from "solid-js"
import { useTheme } from "@tui/context/theme"
import { TextAttributes } from "@opentui/core"
import { Installation } from "@/installation"
import { Global } from "@/global"
import { useUIExtensions } from "../../context/ui-extensions"
import { PluginComponent } from "../../component/plugin-component"
import { useSync } from "../../context/sync"
import { useDirectory } from "../../context/directory"

export function Footer() {
  const { theme } = useTheme()
  const uiExtensions = useUIExtensions()
  const sync = useSync()
  const mcp = createMemo(() => Object.keys(sync.data.mcp))
  const mcpError = createMemo(() => Object.values(sync.data.mcp).some((x) => x.status === "failed"))
  const lsp = createMemo(() => Object.keys(sync.data.lsp))
  const directory = useDirectory()

  return (
    <box
      height={1}
      backgroundColor={theme.backgroundPanel}
      flexDirection="row"
      justifyContent="space-between"
      flexShrink={0}
    >
      <box flexDirection="row">
        <box flexDirection="row" backgroundColor={theme.backgroundElement} paddingLeft={1} paddingRight={1}>
          <text fg={theme.textMuted}>code</text>
          <text fg={theme.text} attributes={TextAttributes.BOLD}>
            surf{" "}
          </text>
          <text fg={theme.textMuted}>v{Installation.VERSION}</text>
        </box>
        <box paddingLeft={1} paddingRight={1}>
          <text fg={theme.textMuted}>{directory() ?? process.cwd().replace(Global.Path.home, "~")}</text>
        </box>
        <Show when={uiExtensions.extensions()?.statusItems}>
          <For each={uiExtensions.extensions()?.statusItems ?? []}>
            {(statusItem) => (
              <box paddingLeft={1} paddingRight={1}>
                <PluginComponent componentId={statusItem.id} context={{}} />
              </box>
            )}
          </For>
        </Show>
      </box>
      <box flexDirection="row" flexShrink={0} gap={2} alignItems="center">
        <text fg={theme.text}>
          <span style={{ fg: theme.success }}>•</span> {lsp().length} LSP
        </text>
        <Show when={mcp().length}>
          <text fg={theme.text}>
            <Switch>
              <Match when={mcpError()}>
                <span style={{ fg: theme.error }}>⊙ </span>
              </Match>
              <Match when={true}>
                <span style={{ fg: theme.success }}>⊙ </span>
              </Match>
            </Switch>
            {mcp().length} MCP
          </text>
        </Show>
        <text fg={theme.textMuted}>/status</text>
      </box>
    </box>
  )
}
