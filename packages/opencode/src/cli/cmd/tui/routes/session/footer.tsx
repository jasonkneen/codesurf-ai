import { useTheme } from "@tui/context/theme"
import { TextAttributes } from "@opentui/core"
import { Show, For } from "solid-js"
import { Installation } from "@/installation"
import { Global } from "@/global"
import { useUIExtensions } from "../../context/ui-extensions"
import { PluginComponent } from "../../component/plugin-component"

export function Footer() {
  const { theme } = useTheme()
  const uiExtensions = useUIExtensions()

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
          <text fg={theme.textMuted}>{process.cwd().replace(Global.Path.home, "~")}</text>
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
        {/* Server status removed - can be re-added if needed */}
      </box>
    </box>
  )
}
