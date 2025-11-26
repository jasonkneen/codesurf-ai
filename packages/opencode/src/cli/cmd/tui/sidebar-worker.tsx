import { createSignal, createEffect, onCleanup } from "solid-js"
import { Sidebar } from "./routes/session/sidebar"
import { Rpc } from "@/util/rpc"
import { useSDK } from "./context/sdk"
import { useSync } from "./context/sync"
import type { rpc as SidebarRpc } from "./workers/sidebar.worker"

interface WorkerState {
  todos: Array<{
    id: string
    content: string
    status: "pending" | "in_progress" | "completed"
  }>
  gitStatus: {
    branch: string
    ahead: number
    behind: number
    modified: number
    staged: number
    untracked: number
  }
  context: Array<{
    id: string
    name: string
    type: string
    active: boolean
  }>
  systemPromptTokens: number
  messageStats: {
    totalCost: number
    savedCost: number
    toolCounts: Record<string, number>
    lastTokenUsage: number
    lastTokenLimit: number
  }
  diffStats: {
    totalFiles: number
    additions: number
    deletions: number
    modified: number
  }
  lastUpdated: number
}

export default function SidebarWorker(props: {
  sessionID: string
  width: number
  onToggle: () => void
  onResize: (delta: number) => void
}) {
  const sdk = useSDK()
  const sync = useSync()
  const [workerReady, setWorkerReady] = createSignal(false)
  const [workerState, setWorkerState] = createSignal<WorkerState | null>(null)
  const [useWorker] = createSignal(true) // Enable worker mode

  let worker: Worker | null = null
  let client: ReturnType<typeof Rpc.client<typeof SidebarRpc>> | null = null

  createEffect(async () => {
    if (!useWorker()) return

    try {
      // Spawn sidebar worker
      worker = new Worker(new URL("./workers/sidebar.worker.ts", import.meta.url))

      worker.onerror = (err) => {
        console.error("Sidebar worker error:", err)
        // Fallback to direct rendering
        setWorkerReady(false)
      }

      // Handle state updates from worker
      worker.onmessage = (evt) => {
        try {
          const msg = JSON.parse(evt.data)
          if (msg.type === "state.update") {
            setWorkerState(msg.state)
          }
        } catch {
          // Not our message format
        }
      }

      client = Rpc.client<typeof SidebarRpc>(worker)

      // Initialize worker with timeout
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Worker init timeout")), 15000),
      )

      const result = (await Promise.race([
        client.call("init", {
          serverUrl: sdk.url,
          sessionID: props.sessionID,
        }),
        timeoutPromise,
      ])) as unknown as { ready: boolean; state: WorkerState }

      setWorkerState(result.state)
      setWorkerReady(true)
    } catch (err) {
      console.error("Failed to init sidebar worker:", err)
      // Worker failed, will fallback to direct rendering
      worker?.terminate()
      worker = null
      client = null
    }
  })

  onCleanup(() => {
    if (client) {
      client.call("shutdown", undefined)
    }
    worker?.terminate()
  })

  // Periodically refresh git status
  createEffect(() => {
    if (!workerReady() || !client) return

    const interval = setInterval(() => {
      client!.call("refreshGitStatus", undefined)
    }, 10000)

    onCleanup(() => clearInterval(interval))
  })

  // Push messages to worker for stats computation
  createEffect(() => {
    if (!workerReady() || !client) return
    const messages = sync.data.message[props.sessionID] || []
    const providers = sync.data.provider || []

    // Debounce to avoid spamming worker
    const timer = setTimeout(() => {
      client!.call("computeMessageStats", { messages, providers })
    }, 500)

    onCleanup(() => clearTimeout(timer))
  })

  // Push diffs to worker
  createEffect(() => {
    if (!workerReady() || !client) return
    const diffs = sync.data.session_diff[props.sessionID] || []

    const timer = setTimeout(() => {
      client!.call("computeDiffStats", diffs)
    }, 500)

    onCleanup(() => clearTimeout(timer))
  })

  // Always render sidebar - worker enhances but doesn't block
  return (
    <Sidebar
      sessionID={props.sessionID}
      onToggle={props.onToggle}
      width={props.width}
      minWidth={30}
      maxWidth={60}
      widthStep={2}
      onResize={props.onResize}
      workerState={workerReady() ? workerState() : undefined}
    />
  )
}
