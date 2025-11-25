import { Rpc } from "@/util/rpc"
import type { rpc as SubagentRpc } from "./workers/subagent.worker"
import { appendFile } from "fs/promises"

interface SubagentWorkerInfo {
  worker: Worker
  client: ReturnType<typeof Rpc.client<typeof SubagentRpc>>
  state: {
    sessionID: string
    agentName: string
    status: "initializing" | "running" | "completed" | "failed"
    progress: {
      toolCalls: number
      tokensUsed: number
      cost: number
    }
    result?: string
    error?: string
  }
  startedAt: number
  completionPromise?: {
    resolve: (result: string) => void
    reject: (error: Error) => void
  }
}

interface QueuedTask {
  options: SpawnOptions
  resolve: (workerId: string) => void
  reject: (error: Error) => void
}

interface SpawnOptions {
  serverUrl: string
  parentSessionID: string
  agentName: string
  prompt: string
  description: string
  parallel?: boolean
}

// Configuration for worker pool
const POOL_CONFIG = {
  maxConcurrent: 6, // Maximum concurrent subagents
  queueWarningSize: 10, // Warn when queue exceeds this
}

const activeWorkers = new Map<string, SubagentWorkerInfo>()
const pendingQueue: QueuedTask[] = []
let poolStats = {
  totalSpawned: 0,
  totalCompleted: 0,
  totalFailed: 0,
  peakConcurrent: 0,
}

async function log(msg: string) {
  const timestamp = new Date().toISOString()
  await appendFile("/tmp/opencode-subagent-manager.log", `[${timestamp}] ${msg}\n`)
}

// Count currently running workers (not completed/failed)
function getRunningCount(): number {
  let count = 0
  for (const info of activeWorkers.values()) {
    if (info.state.status === "initializing" || info.state.status === "running") {
      count++
    }
  }
  return count
}

// Process next queued task if capacity available
async function processQueue(): Promise<void> {
  while (pendingQueue.length > 0 && getRunningCount() < POOL_CONFIG.maxConcurrent) {
    const task = pendingQueue.shift()
    if (!task) break

    try {
      const workerId = await spawnInternal(task.options)
      task.resolve(workerId)
    } catch (error) {
      task.reject(error instanceof Error ? error : new Error(String(error)))
    }
  }
}

// Handle worker completion - process queue and resolve promises
async function onWorkerComplete(workerId: string, info: SubagentWorkerInfo): Promise<void> {
  if (info.state.status === "completed") {
    poolStats.totalCompleted++
    info.completionPromise?.resolve(info.state.result || "Task completed")
  } else if (info.state.status === "failed") {
    poolStats.totalFailed++
    info.completionPromise?.reject(new Error(info.state.error || "Worker failed"))
  }

  // Process any queued tasks now that we have capacity
  await processQueue()
}

// Internal spawn function (bypasses queue)
async function spawnInternal(options: SpawnOptions): Promise<string> {
  const workerId = `subagent-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

  await log(`Spawning subagent worker: ${workerId} for ${options.agentName} (running: ${getRunningCount()}/${POOL_CONFIG.maxConcurrent})`)

  poolStats.totalSpawned++
  const currentRunning = getRunningCount() + 1
  if (currentRunning > poolStats.peakConcurrent) {
    poolStats.peakConcurrent = currentRunning
  }

  const worker = new Worker(new URL("./workers/subagent.worker.ts", import.meta.url))

  const info: SubagentWorkerInfo = {
    worker,
    client: null as any,
    state: {
      sessionID: "",
      agentName: options.agentName,
      status: "initializing",
      progress: { toolCalls: 0, tokensUsed: 0, cost: 0 },
    },
    startedAt: Date.now(),
  }

  // Handle state updates from worker - event-driven completion
  worker.onmessage = async (evt) => {
    try {
      const msg = JSON.parse(evt.data)
      if (msg.type === "state.update") {
        const previousStatus = info.state.status
        info.state = msg.state
        await log(`Worker ${workerId} state update: ${msg.state.status}`)

        // Event-driven completion detection (no polling needed!)
        if (
          (previousStatus === "initializing" || previousStatus === "running") &&
          (msg.state.status === "completed" || msg.state.status === "failed")
        ) {
          await onWorkerComplete(workerId, info)
        }
      }
    } catch {
      // Not our message format
    }
  }

  worker.onerror = async (err) => {
    await log(`Worker ${workerId} error: ${err}`)
    info.state.status = "failed"
    info.state.error = String(err)
    await onWorkerComplete(workerId, info)
  }

  info.client = Rpc.client<typeof SubagentRpc>(worker)
  activeWorkers.set(workerId, info)

  // Initialize worker
  const result = (await info.client.call("init", {
    serverUrl: options.serverUrl,
    parentSessionID: options.parentSessionID,
    agentName: options.agentName,
    prompt: options.prompt,
    description: options.description,
    parallel: options.parallel ?? false,
  })) as unknown as { ready: boolean; state: SubagentWorkerInfo["state"] }

  info.state = result.state
  await log(`Worker ${workerId} initialized: ${info.state.sessionID}`)

  return workerId
}

export namespace SubagentManager {
  /**
   * Spawn a new subagent in an isolated worker thread.
   * If max concurrency is reached, the task is queued.
   */
  export async function spawn(options: SpawnOptions): Promise<string> {
    // Check if we have capacity
    if (getRunningCount() < POOL_CONFIG.maxConcurrent) {
      return spawnInternal(options)
    }

    // Queue the task and wait for capacity
    await log(`Queue full (${getRunningCount()}/${POOL_CONFIG.maxConcurrent}), queuing task for ${options.agentName}`)

    if (pendingQueue.length >= POOL_CONFIG.queueWarningSize) {
      await log(`WARNING: Queue size (${pendingQueue.length}) exceeds warning threshold`)
    }

    return new Promise((resolve, reject) => {
      pendingQueue.push({ options, resolve, reject })
    })
  }

  /**
   * Get status of a subagent worker
   */
  export function getStatus(workerId: string): SubagentWorkerInfo["state"] | null {
    const info = activeWorkers.get(workerId)
    return info?.state ?? null
  }

  /**
   * Get all active workers
   */
  export function listActive(): Array<{ id: string; state: SubagentWorkerInfo["state"] }> {
    return Array.from(activeWorkers.entries()).map(([id, info]) => ({
      id,
      state: info.state,
    }))
  }

  /**
   * Wait for a subagent to complete using event-driven notification.
   * No polling - uses Promise resolved by worker message handler.
   */
  export async function waitForCompletion(workerId: string, timeoutMs = 300000): Promise<string> {
    const info = activeWorkers.get(workerId)
    if (!info) throw new Error(`Worker ${workerId} not found`)

    // Already completed?
    if (info.state.status === "completed") {
      return info.state.result || "Task completed"
    }
    if (info.state.status === "failed") {
      throw new Error(info.state.error || "Worker failed")
    }

    // Event-driven: create promise that will be resolved by onWorkerComplete
    return new Promise((resolve, reject) => {
      // Store the promise handlers for event-driven resolution
      info.completionPromise = { resolve, reject }

      // Set timeout for safety
      const timeout = setTimeout(() => {
        delete info.completionPromise
        reject(new Error(`Worker ${workerId} timed out after ${timeoutMs}ms`))
      }, timeoutMs)

      // Wrap resolve/reject to clear timeout
      const originalResolve = resolve
      const originalReject = reject
      info.completionPromise.resolve = (result: string) => {
        clearTimeout(timeout)
        originalResolve(result)
      }
      info.completionPromise.reject = (error: Error) => {
        clearTimeout(timeout)
        originalReject(error)
      }
    })
  }

  /**
   * Get pool statistics
   */
  export function getPoolStats() {
    return {
      ...poolStats,
      currentRunning: getRunningCount(),
      queueLength: pendingQueue.length,
      maxConcurrent: POOL_CONFIG.maxConcurrent,
      activeWorkerCount: activeWorkers.size,
    }
  }

  /**
   * Configure pool settings
   */
  export function configure(config: Partial<typeof POOL_CONFIG>) {
    if (config.maxConcurrent !== undefined) {
      POOL_CONFIG.maxConcurrent = config.maxConcurrent
    }
    if (config.queueWarningSize !== undefined) {
      POOL_CONFIG.queueWarningSize = config.queueWarningSize
    }
  }

  /**
   * Abort a running subagent
   */
  export async function abort(workerId: string): Promise<void> {
    const info = activeWorkers.get(workerId)
    if (!info) return

    await log(`Aborting worker ${workerId}`)
    await info.client.call("abort", undefined)
  }

  /**
   * Terminate a worker and clean up
   */
  export async function terminate(workerId: string): Promise<void> {
    const info = activeWorkers.get(workerId)
    if (!info) return

    await log(`Terminating worker ${workerId}`)
    await info.client.call("shutdown", undefined)
    info.worker.terminate()
    activeWorkers.delete(workerId)
  }

  /**
   * Terminate all workers
   */
  export async function terminateAll(): Promise<void> {
    await log(`Terminating all ${activeWorkers.size} workers`)
    for (const [id] of activeWorkers) {
      await terminate(id)
    }
  }
}
