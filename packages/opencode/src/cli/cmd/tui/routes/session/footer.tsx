import { useTheme } from "@tui/context/theme"
import { useDialog } from "@tui/ui/dialog"
import { useRenderer } from "@opentui/solid"
import { TextAttributes } from "@opentui/core"
import { useLocal } from "../../context/local"
import { Show, For, createSignal, onCleanup, createEffect, createMemo } from "solid-js"
import { Installation } from "@/installation"
import { Global } from "@/global"
import { DialogAgent } from "@tui/component/dialog-agent"
import { useRoute, type SessionRoute } from "@tui/context/route"
import { useSync } from "@tui/context/sync"
import { useUIExtensions } from "../../context/ui-extensions"
import { PluginComponent } from "../../component/plugin-component"
import { useServerStatus } from "../../context/server-status"
import { DialogSelect, type DialogSelectOption } from "@tui/ui/dialog-select"
import { Bus } from "@/bus"
import z from "zod"
import { BackgroundWorkers } from "@/worker/background-workers"
import { readFileSync } from "fs"

function WorkerDialog(props: { onClose: () => void }) {
  const { theme } = useTheme()
  const [validationLogs, setValidationLogs] = createSignal<string[]>([])
  const [prefetchLogs, setPrefetchLogs] = createSignal<string[]>([])
  const [validationState, setValidationState] = createSignal<any>(null)
  const [prefetchState, setPrefetchState] = createSignal<any>(null)
  const [activeTab, setActiveTab] = createSignal<"validation" | "prefetch">("validation")
  const [scrollOffset, setScrollOffset] = createSignal(0)
  const [autoScroll, setAutoScroll] = createSignal(true)

  // Load logs and refresh every 500ms for real-time updates
  const loadLogs = () => {
    try {
      const content = readFileSync("/tmp/opencode-validation-worker.log", "utf-8")
      const lines = content
        .split("\n")
        .filter((line) => line.trim())
        .slice(-100) // Last 100 lines
      setValidationLogs(lines)
      if (autoScroll()) setScrollOffset(0)
    } catch (e) {
      setValidationLogs(["No validation logs yet"])
    }

    try {
      const content = readFileSync("/tmp/opencode-prefetch-worker.log", "utf-8")
      const lines = content
        .split("\n")
        .filter((line) => line.trim())
        .slice(-100) // Last 100 lines
      setPrefetchLogs(lines)
      if (autoScroll()) setScrollOffset(0)
    } catch (e) {
      setPrefetchLogs(["No prefetch logs yet"])
    }

    // Load worker states
    BackgroundWorkers.getValidationState().then((state) => setValidationState(state))
    BackgroundWorkers.getPrefetchState().then((state) => setPrefetchState(state))
  }

  // Initial load
  loadLogs()

  // Auto-refresh every 500ms
  const interval = setInterval(loadLogs, 500)
  onCleanup(() => clearInterval(interval))

  const workerConfig = BackgroundWorkers.getConfig()
  const logs = createMemo(() => (activeTab() === "validation" ? validationLogs() : prefetchLogs()))
  const isEnabled = createMemo(() =>
    activeTab() === "validation" ? workerConfig?.validation.enabled : workerConfig?.prefetch.enabled,
  )

  // Visible logs with scrolling
  const logHeight = 15 // Fixed height for log area
  const visibleLogs = createMemo(() => {
    const allLogs = logs()
    const offset = scrollOffset()
    return allLogs.slice(Math.max(0, allLogs.length - logHeight - offset), allLogs.length - offset)
  })

  const currentState = createMemo(() => (activeTab() === "validation" ? validationState() : prefetchState()))

  return (
    <box flexDirection="column" gap={1} paddingLeft={2} paddingRight={2} paddingBottom={1}>
      {/* Header */}
      <box flexDirection="row" justifyContent="space-between">
        <text fg={theme.text} attributes={TextAttributes.BOLD}>
          Background Workers
        </text>
        <text fg={theme.textMuted}>esc</text>
      </box>

      {/* Tabs */}
      <box flexDirection="row" gap={3}>
        <text
          fg={activeTab() === "validation" ? theme.accent : theme.textMuted}
          onMouseUp={() => {
            setActiveTab("validation")
            setScrollOffset(0)
          }}
          attributes={activeTab() === "validation" ? TextAttributes.BOLD : undefined}
        >
          Validation{" "}
          <span
            style={{
              fg: workerConfig?.validation.enabled ? theme.success : theme.textMuted,
            }}
          >
            {workerConfig?.validation.enabled ? "●" : "○"}
          </span>
        </text>
        <text
          fg={activeTab() === "prefetch" ? theme.accent : theme.textMuted}
          onMouseUp={() => {
            setActiveTab("prefetch")
            setScrollOffset(0)
          }}
          attributes={activeTab() === "prefetch" ? TextAttributes.BOLD : undefined}
        >
          Prefetch{" "}
          <span
            style={{
              fg: workerConfig?.prefetch.enabled ? theme.success : theme.textMuted,
            }}
          >
            {workerConfig?.prefetch.enabled ? "●" : "○"}
          </span>
        </text>
      </box>

      {/* Stats */}
      <Show when={currentState()}>
        <text fg={theme.textMuted}>
          {activeTab() === "validation" ? (
            <>
              Queue: {currentState()?.queue?.length ?? 0} | Runs: {currentState()?.stats?.totalRuns ?? 0} | Success:{" "}
              {((currentState()?.stats?.successRate ?? 0) * 100).toFixed(0)}%
            </>
          ) : (
            <>
              Queue: {currentState()?.queue?.length ?? 0} | Cache: {currentState()?.cache?.length ?? 0} | Hits:{" "}
              {currentState()?.stats?.cacheHits ?? 0}
            </>
          )}
        </text>
      </Show>

      {/* Log area - fixed height with scrolling */}
      <box
        flexDirection="column"
        height={logHeight}
        backgroundColor={theme.backgroundElement}
        paddingLeft={2}
        paddingRight={2}
        paddingTop={1}
        paddingBottom={1}
      >
        <For each={visibleLogs()}>
          {(line) => (
            <text fg={theme.textMuted} wrapMode="none">
              {line.length > 270 ? line.substring(0, 270) + "…" : line}
            </text>
          )}
        </For>
      </box>

      {/* Scroll controls */}
      <box flexDirection="row" gap={2} justifyContent="space-between" height={1}>
        <box flexDirection="row" gap={1}>
          <text
            bg={scrollOffset() < logs().length - logHeight ? theme.primary : theme.backgroundElement}
            fg={scrollOffset() < logs().length - logHeight ? theme.background : theme.textMuted}
            onMouseUp={() => {
              setScrollOffset(Math.min(scrollOffset() + 5, logs().length - logHeight))
              setAutoScroll(false)
            }}
          >
            {" "}
            ↓{" "}
          </text>
          <text
            bg={scrollOffset() > 0 ? theme.primary : theme.backgroundElement}
            fg={scrollOffset() > 0 ? theme.background : theme.textMuted}
            onMouseUp={() => {
              setScrollOffset(Math.max(scrollOffset() - 5, 0))
              setAutoScroll(false)
            }}
          >
            {" "}
            ↑{" "}
          </text>
          <text
            bg={autoScroll() ? theme.primary : theme.backgroundElement}
            fg={autoScroll() ? theme.background : theme.textMuted}
            onMouseUp={() => {
              setAutoScroll(!autoScroll())
              if (!autoScroll()) setScrollOffset(0)
            }}
          >
            {" "}
            {autoScroll() ? "Auto●" : "Auto○"}{" "}
          </text>
        </box>
        <text fg={theme.textMuted}>
          {Math.max(0, logs().length - logHeight - scrollOffset())}-{logs().length - scrollOffset()} / {logs().length}
        </text>
      </box>

      {/* Controls */}
      <box flexDirection="row" gap={2} justifyContent="flex-start">
        <text
          bg={theme.primary}
          fg={theme.background}
          onMouseUp={() => {
            const currentEnabled = isEnabled() ?? false
            if (activeTab() === "validation") {
              BackgroundWorkers.updateConfig({
                validation: { enabled: !currentEnabled },
              })
            } else {
              BackgroundWorkers.updateConfig({
                prefetch: { enabled: !currentEnabled },
              })
            }
          }}
        >
          {" "}
          {isEnabled() ? "Disable" : "Enable"}{" "}
        </text>
        <Show when={activeTab() === "validation"}>
          <text
            bg={theme.primary}
            fg={theme.background}
            onMouseUp={() => {
              BackgroundWorkers.runValidationNow()
            }}
          >
            {" "}
            Run Now{" "}
          </text>
          <text
            bg={theme.primary}
            fg={theme.background}
            onMouseUp={() => {
              BackgroundWorkers.clearValidationQueue()
            }}
          >
            {" "}
            Clear Queue{" "}
          </text>
        </Show>
        <Show when={activeTab() === "prefetch"}>
          <text
            bg={theme.primary}
            fg={theme.background}
            onMouseUp={() => {
              BackgroundWorkers.clearPrefetchCache()
            }}
          >
            {" "}
            Clear Cache{" "}
          </text>
        </Show>
      </box>

      {/* Config display */}
      <box flexDirection="row">
        <text fg={theme.textMuted}>
          {activeTab() === "validation"
            ? `Commands: ${workerConfig?.validation.commands.join(", ") ?? "none"}`
            : `Strategies: ${workerConfig?.prefetch.strategies.join(", ") ?? "none"}`}
        </text>
      </box>
    </box>
  )
}

export function Footer() {
  const { theme } = useTheme()
  const dialog = useDialog()
  const renderer = useRenderer()
  const local = useLocal()
  const route = useRoute()
  const sync = useSync()
  const uiExtensions = useUIExtensions()
  const serverStatus = useServerStatus()
  const [validationStatus, setValidationStatus] = createSignal<{
    status: "idle" | "running" | "queued"
    queueLength: number
    lastResult?: "success" | "error"
  }>({ status: "idle", queueLength: 0 })

  const [prefetchStatus, setPrefetchStatus] = createSignal<{
    status: "idle" | "loading" | "queued"
    queueLength: number
    cacheSize: number
    cacheHits: number
  }>({ status: "idle", queueLength: 0, cacheSize: 0, cacheHits: 0 })

  // Subscribe to worker state updates
  const validationUnsub = Bus.subscribe(Bus.event("validation.state.updated", z.any()), (event) => {
    const state = event.properties
    const status = state.running ? "running" : state.queue?.length > 0 ? "queued" : "idle"
    const lastResult = state.lastResults?.[0]?.exitCode === 0 ? "success" : state.lastResults?.[0] ? "error" : undefined
    setValidationStatus({
      status,
      queueLength: state.queue?.length ?? 0,
      lastResult,
    })
  })

  const prefetchUnsub = Bus.subscribe(Bus.event("prefetch.state.updated", z.any()), (event) => {
    const state = event.properties
    const status = state.running ? "loading" : state.queue?.length > 0 ? "queued" : "idle"
    setPrefetchStatus({
      status,
      queueLength: state.queue?.length ?? 0,
      cacheSize: state.stats?.cacheSize ?? 0,
      cacheHits: state.stats?.cacheHits ?? 0,
    })
  })

  onCleanup(() => {
    validationUnsub()
    prefetchUnsub()
  })

  const showServerDialog = () => {
    const options: DialogSelectOption<string>[] = [
      {
        title: "Restart Server",
        value: "restart",
        description: "Restart the OpenCode server",
        onSelect: async (ctx) => {
          ctx.clear()
          try {
            await fetch(`${serverStatus.url()}/server/restart`, { method: "POST" })
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
          Promise.resolve(serverStatus.copyUrl()).finally(() => ctx.clear())
        },
      },
    ]

    dialog.replace(() => <DialogSelect title="Server Management" options={options} />)
  }

  const showWorkerDialog = () => {
    dialog.setFrame({ width: 280 })
    dialog.replace(() => <WorkerDialog onClose={() => dialog.clear()} />)
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
        {/* <text fg={theme.textMuted}>
          Server:{" "}
          <span
            style={{
              fg: serverStatus.status() === "connected" ? theme.success : theme.error,
              attributes: TextAttributes.BOLD,
            }}
          >
            {serverStatus.status() === "connected" ? "●" : "○"}
          </span>{" "}
          Port {serverStatus.port()}
        </text>
        <text
          fg={theme.accent}
          onMouseUp={() => {
            if (renderer.getSelection()?.getSelectedText()) return
            showServerDialog()
          }}
        >
          [Manage]
        </text> */}
        <box flexDirection="row" gap={1} alignItems="center">
          <text
            fg={
              validationStatus().status === "running"
                ? theme.success
                : validationStatus().lastResult === "error"
                  ? theme.error
                  : validationStatus().status === "queued"
                    ? theme.accent
                    : theme.textMuted
            }
            onMouseUp={() => {
              if (renderer.getSelection()?.getSelectedText()) return
              showWorkerDialog()
            }}
            attributes={validationStatus().status === "running" ? TextAttributes.BOLD : undefined}
          >
            {validationStatus().status === "running"
              ? "Val● "
              : validationStatus().lastResult === "error"
                ? "Val✗ "
                : validationStatus().status === "queued"
                  ? `Val(${validationStatus().queueLength}) `
                  : "Val○ "}
          </text>
          <text> </text>
          <text
            fg={
              prefetchStatus().status === "loading"
                ? theme.accent
                : prefetchStatus().status === "queued"
                  ? theme.warning
                  : prefetchStatus().cacheHits > 0
                    ? theme.success
                    : theme.textMuted
            }
            onMouseUp={() => {
              if (renderer.getSelection()?.getSelectedText()) return
              showWorkerDialog()
            }}
            attributes={prefetchStatus().status === "loading" ? TextAttributes.BOLD : undefined}
          >
            {prefetchStatus().status === "loading"
              ? "Pre●"
              : prefetchStatus().status === "queued"
                ? `Pre(${prefetchStatus().queueLength})`
                : prefetchStatus().cacheHits > 0
                  ? "Pre✓"
                  : "Pre○"}
          </text>
        </box>
        <box flexDirection="row" gap={1} alignItems="center">
          <text fg={theme.textMuted}>tab</text>

          {(() => {
            const currentRoute = route.data
            const session =
              currentRoute?.type === "session"
                ? sync.data.session.find((s: any) => s.id === (currentRoute as SessionRoute).sessionID)
                : undefined
            const rootAgent = (session as any)?.orchestration?.rootAgent
            const currentAgent = (session as any)?.orchestration?.currentAgent

            // Determine which agent to use for color
            const agentForColor =
              currentAgent && rootAgent && currentAgent !== rootAgent
                ? currentAgent
                : (local.agent.current()?.name ?? "")

            const agentName = (() => {
              if (currentAgent && rootAgent && currentAgent !== rootAgent) {
                return `${rootAgent.toUpperCase()} > ${currentAgent.toUpperCase()}`
              }
              const agent = local.agent.current()
              return agent?.name.toUpperCase() ?? "LOADING"
            })()

            return (
              <box flexDirection="row" gap={0}>
                <text fg={local.agent.color(agentForColor)}></text>
                <text
                  bg={local.agent.color(agentForColor)}
                  fg={theme.background}
                  wrapMode="none"
                  attributes={TextAttributes.BOLD}
                  onMouseUp={() => {
                    if (renderer.getSelection()?.getSelectedText()) return
                    dialog.replace(() => <DialogAgent />)
                  }}
                >
                  {` ${agentName} `}
                </text>
                <text
                  bg={local.agent.color(agentForColor)}
                  fg={theme.background}
                  wrapMode="none"
                  onMouseUp={() => {
                    if (renderer.getSelection()?.getSelectedText()) return
                    dialog.replace(() => <DialogAgent />)
                  }}
                >
                  AGENT{" "}
                </text>
              </box>
            )
          })()}
        </box>
      </box>
    </box>
  )
}
