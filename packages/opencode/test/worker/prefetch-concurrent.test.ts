import { describe, test, expect, beforeEach } from "bun:test"
import { Worker } from "worker_threads"
import path from "path"
import { unlink } from "fs/promises"

const LOG_FILE = "/tmp/opencode-prefetch-test.log"

async function clearLog() {
  try {
    await unlink(LOG_FILE)
  } catch {
    // File doesn't exist, that's fine
  }
}

async function readLog(): Promise<string> {
  try {
    const file = Bun.file(LOG_FILE)
    return await file.text()
  } catch {
    return ""
  }
}

describe("Prefetch Worker Concurrent Processing", () => {
  beforeEach(async () => {
    await clearLog()
  })

  test("should process up to maxConcurrent files simultaneously", async () => {
    const workerPath = path.join(import.meta.dir, "../../src/cli/cmd/tui/workers/prefetch.worker.ts")

    // Create test files
    const testDir = "/tmp/prefetch-test"
    await Bun.write(`${testDir}/file1.ts`, "export const a = 1")
    await Bun.write(`${testDir}/file2.ts`, "export const b = 2")
    await Bun.write(`${testDir}/file3.ts`, "export const c = 3")
    await Bun.write(`${testDir}/file4.ts`, "export const d = 4")
    await Bun.write(`${testDir}/file5.ts`, "export const e = 5")

    const worker = new Worker(workerPath)

    // Initialize worker
    await new Promise<void>((resolve) => {
      worker.postMessage({
        type: "init",
        config: {
          serverUrl: "http://localhost:3000",
          sessionID: "test-session",
          maxConcurrent: 3,
          maxCacheSize: 1024 * 1024 * 10, // 10MB
          strategies: ["import", "related"],
          workingDirectory: testDir,
        },
      })

      worker.on("message", (msg) => {
        if (msg.ready) resolve()
      })
    })

    // Queue multiple files
    const startTime = Date.now()
    worker.postMessage({
      type: "prefetch",
      filePaths: [
        `${testDir}/file1.ts`,
        `${testDir}/file2.ts`,
        `${testDir}/file3.ts`,
        `${testDir}/file4.ts`,
        `${testDir}/file5.ts`,
      ],
    })

    // Wait for completion
    await new Promise((resolve) => setTimeout(resolve, 2000))
    const duration = Date.now() - startTime

    // Read the log
    const log = await readLog()

    // Verify concurrent execution
    const startLines = log.split("\n").filter((line) => line.includes("Starting task"))
    const completedLines = log.split("\n").filter((line) => line.includes("Completed task"))

    console.log("\n=== Prefetch Worker Log ===")
    console.log(log)
    console.log("===========================\n")

    // Should see evidence of concurrent processing
    expect(startLines.length).toBeGreaterThan(0)
    expect(completedLines.length).toBeGreaterThan(0)

    // Parse concurrent counts from log
    const concurrentCounts = startLines
      .map((line) => {
        const match = line.match(/\((\d+)\/(\d+) concurrent/)
        return match ? parseInt(match[1]) : 0
      })
      .filter((n) => n > 0)

    // At some point, we should have had 2 or 3 files running concurrently
    const maxConcurrent = Math.max(...concurrentCounts)
    expect(maxConcurrent).toBeGreaterThanOrEqual(2)

    console.log(`\n✅ Max concurrent tasks observed: ${maxConcurrent}`)
    console.log(`✅ Total duration: ${duration}ms`)
    console.log(`✅ Files processed: ${completedLines.length}`)

    worker.terminate()
  }, 10000) // 10 second timeout

  test("should respect maxConcurrent limit", async () => {
    const workerPath = path.join(import.meta.dir, "../../src/cli/cmd/tui/workers/prefetch.worker.ts")

    const testDir = "/tmp/prefetch-test-limit"
    await Bun.write(`${testDir}/file1.ts`, "export const a = 1")
    await Bun.write(`${testDir}/file2.ts`, "export const b = 2")
    await Bun.write(`${testDir}/file3.ts`, "export const c = 3")

    const worker = new Worker(workerPath)

    // Initialize with maxConcurrent=1 (should be sequential)
    await new Promise<void>((resolve) => {
      worker.postMessage({
        type: "init",
        config: {
          serverUrl: "http://localhost:3000",
          sessionID: "test-session-limit",
          maxConcurrent: 1, // Force sequential
          maxCacheSize: 1024 * 1024 * 10,
          strategies: ["import"],
          workingDirectory: testDir,
        },
      })

      worker.on("message", (msg) => {
        if (msg.ready) resolve()
      })
    })

    worker.postMessage({
      type: "prefetch",
      filePaths: [`${testDir}/file1.ts`, `${testDir}/file2.ts`, `${testDir}/file3.ts`],
    })

    await new Promise((resolve) => setTimeout(resolve, 1000))

    const log = await readLog()
    const concurrentCounts = log
      .split("\n")
      .filter((line) => line.includes("Starting task"))
      .map((line) => {
        const match = line.match(/\((\d+)\/(\d+) concurrent/)
        return match ? parseInt(match[1]) : 0
      })

    // Should never exceed maxConcurrent=1
    const maxObserved = Math.max(...concurrentCounts)
    expect(maxObserved).toBeLessThanOrEqual(1)

    console.log(`\n✅ Max concurrent with limit=1: ${maxObserved}`)

    worker.terminate()
  }, 10000)
})
