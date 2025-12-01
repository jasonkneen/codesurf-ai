import { createMemo, Match, Show, Switch, For } from "solid-js"
import { useTheme } from "@tui/context/theme"
import { TextAttributes } from "@opentui/core"
import { Installation } from "@/installation"
import { Global } from "@/global"
import { useUIExtensions } from "../../context/ui-extensions"
import { PluginComponent } from "../../component/plugin-component"
import { useSync } from "../../context/sync"
import { useDirectory } from "../../context/directory"
import { useServerStatus } from "../../context/server-status"
import { useDialog } from "../../ui/dialog"
import { DialogSelect, type DialogSelectOption } from "../../ui/dialog-select"
import { useRenderer } from "@opentui/solid"
import { useSDK } from "../../context/sdk"

export function Footer() {
  const { theme } = useTheme()
  const uiExtensions = useUIExtensions()
  const sync = useSync()
  const mcp = createMemo(() => Object.keys(sync.data.mcp))
  const mcpError = createMemo(() => Object.values(sync.data.mcp).some((x) => x.status === "failed"))
  const lsp = createMemo(() => Object.keys(sync.data.lsp))
  const directory = useDirectory()
  const serverStatus = useServerStatus()
  const dialog = useDialog()
  const renderer = useRenderer()
  const sdk = useSDK()

  const showServerDialog = () => {
    const options: DialogSelectOption<string>[] = [
      {
        title: "Restart Server",
        value: "restart",
        description: "Restart the CodeSurf server",
        onSelect: async (ctx) => {
          ctx.clear()
          try {
            await fetch(`${sdk.url}/server/restart`, { method: "POST" })
          } catch (error) {
            console.error("Failed to restart server:", error)
          }
        },
      },
      {
        title: "Copy Server URL",
        value: "copy",
        description: `Copy ${serverStatus.url()} to clipboard`,
        onSelect: (ctx) => {
          ctx.clear()
          Promise.resolve(serverStatus.copyUrl()).catch((error) => {
            console.error("Failed to copy URL:", error)
          })
        },
      },
    ]
    dialog.replace(() => <DialogSelect title={`Server :${serverStatus.port()}`} options={options} />)
  }

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
        <text
          fg={theme.text}
          onMouseUp={() => {
            if (renderer.getSelection()?.getSelectedText()) return
            showServerDialog()
          }}
        >
          <span style={{ fg: theme.success }}>•</span> SERVER
        </text>
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
