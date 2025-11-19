/**
 * Performance monitoring utilities for OpenTUI
 * Tracks execution times, memory usage, and call frequencies for optimization insights
 *
 * Features:
 * - Time tracking: track() and measure() for execution time
 * - Memory tracking: trackMemory() for heap usage analysis
 * - Bottleneck detection: detectBottlenecks() to find slow functions (>100ms)
 * - Memory reports: memoryReport() to identify memory allocators
 * - Full diagnostics: fullReport() for comprehensive analysis
 *
 * Enable with: OPENCODE_PERF=1
 *
 * @example
 * // Track execution time only
 * const myFunc = Perf.track("my-function", (x) => x * 2)
 *
 * // Track execution time AND memory usage
 * const memFunc = Perf.trackMemory("memory-intensive", () => {
 *   return new Array(1000000).fill(0)
 * })
 *
 * // Detect bottlenecks (>100ms avg)
 * const bottlenecks = Perf.detectBottlenecks()
 *
 * // View memory allocations
 * Perf.memoryReport()
 *
 * // Complete performance and memory report
 * Perf.fullReport()
 */

import { Log } from "./log"

export namespace Perf {
  interface Metric {
    name: string
    count: number
    totalTime: number
    avgTime: number
    minTime: number
    maxTime: number
    lastCall: number
  }

  interface ExtendedMetric extends Metric {
    memoryDelta?: number
    asyncWaitTime?: number
    cpuTime?: number
  }

  const metrics = new Map<string, ExtendedMetric>()
  const enabled = process.env.OPENCODE_PERF === "1"
  const log = Log.create({ service: "perf" })

  /**
   * Wrap a function with performance tracking
   */
  export function track<T extends (...args: any[]) => any>(name: string, fn: T): T {
    if (!enabled) return fn

    return ((...args: any[]) => {
      const start = performance.now()
      try {
        const result = fn(...args)

        // Handle async functions
        if (result instanceof Promise) {
          return result.finally(() => {
            recordMetric(name, performance.now() - start)
          })
        }

        recordMetric(name, performance.now() - start)
        return result
      } catch (error) {
        recordMetric(name, performance.now() - start)
        throw error
      }
    }) as T
  }

  /**
   * Track a code block execution time
   */
  export function measure(name: string): { stop: () => void; [Symbol.dispose]: () => void } {
    if (!enabled) {
      return {
        stop: () => {},
        [Symbol.dispose]: () => {},
      }
    }

    const start = performance.now()
    const stop = () => {
      recordMetric(name, performance.now() - start)
    }

    return {
      stop,
      [Symbol.dispose]: stop,
    }
  }

  /**
   * Record a metric measurement
   */
  function recordMetric(name: string, duration: number, memoryDelta?: number) {
    const existing = metrics.get(name)

    if (existing) {
      existing.count++
      existing.totalTime += duration
      existing.avgTime = existing.totalTime / existing.count
      existing.minTime = Math.min(existing.minTime, duration)
      existing.maxTime = Math.max(existing.maxTime, duration)
      existing.lastCall = Date.now()
      if (memoryDelta !== undefined) {
        existing.memoryDelta = (existing.memoryDelta || 0) + memoryDelta
      }
    } else {
      metrics.set(name, {
        name,
        count: 1,
        totalTime: duration,
        avgTime: duration,
        minTime: duration,
        maxTime: duration,
        lastCall: Date.now(),
        memoryDelta,
      })
    }
  }

  /**
   * Get current metrics snapshot
   */
  export function getMetrics(): ExtendedMetric[] {
    return Array.from(metrics.values()).sort((a, b) => b.totalTime - a.totalTime)
  }

  /**
   * Get a specific metric
   */
  export function getMetric(name: string): ExtendedMetric | undefined {
    return metrics.get(name)
  }

  /**
   * Clear all metrics
   */
  export function clear() {
    metrics.clear()
  }

  /**
   * Print metrics summary to console
   */
  export function report() {
    if (!enabled) {
      log.info("Performance monitoring disabled. Set OPENCODE_PERF=1 to enable.")
      return
    }

    const sorted = getMetrics()

    log.info("\n=== OpenTUI Performance Report ===\n")
    log.info("Name".padEnd(40) + "Calls".padEnd(10) + "Avg(ms)".padEnd(12) + "Total(ms)".padEnd(12) + "Min/Max(ms)")
    log.info("-".repeat(100))

    for (const metric of sorted) {
      log.info(
        metric.name.padEnd(40) +
          metric.count.toString().padEnd(10) +
          metric.avgTime.toFixed(2).padEnd(12) +
          metric.totalTime.toFixed(2).padEnd(12) +
          `${metric.minTime.toFixed(2)} / ${metric.maxTime.toFixed(2)}`,
      )
    }

    log.info("-".repeat(100))
    log.info(`Total tracked operations: ${sorted.reduce((sum, m) => sum + m.count, 0)}`)
    log.info(`Total time: ${sorted.reduce((sum, m) => sum + m.totalTime, 0).toFixed(2)}ms`)
    log.info("\n")
  }

  /**
   * Format bytes into human-readable string
   */
  function formatBytes(bytes: number): string {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(Math.abs(bytes)) / Math.log(k))
    const value = bytes / Math.pow(k, i)
    const sign = bytes < 0 ? "-" : ""
    return `${sign}${value.toFixed(2)} ${sizes[i]}`
  }

  /**
   * Wrap a function with memory tracking
   */
  export function trackMemory<T extends (...args: any[]) => any>(name: string, fn: T): T {
    if (!enabled) return fn

    return ((...args: any[]) => {
      const startMem = process.memoryUsage().heapUsed
      const start = performance.now()

      try {
        const result = fn(...args)

        // Handle async functions
        if (result instanceof Promise) {
          return result.finally(() => {
            const endMem = process.memoryUsage().heapUsed
            const memoryDelta = endMem - startMem
            recordMetric(name, performance.now() - start, memoryDelta)
          })
        }

        const endMem = process.memoryUsage().heapUsed
        const memoryDelta = endMem - startMem
        recordMetric(name, performance.now() - start, memoryDelta)
        return result
      } catch (error) {
        const endMem = process.memoryUsage().heapUsed
        const memoryDelta = endMem - startMem
        recordMetric(name, performance.now() - start, memoryDelta)
        throw error
      }
    }) as T
  }

  /**
   * Detect performance bottlenecks (functions with avgTime > 100ms)
   */
  export function detectBottlenecks(threshold = 100): ExtendedMetric[] {
    if (!enabled) {
      log.info("Performance monitoring disabled. Set OPENCODE_PERF=1 to enable.")
      return []
    }

    return getMetrics()
      .filter((metric) => metric.avgTime > threshold)
      .sort((a, b) => b.avgTime - a.avgTime)
  }

  /**
   * Generate memory allocation report
   * Shows top memory allocators sorted by total memory delta
   */
  export function memoryReport(topN = 10) {
    if (!enabled) {
      log.info("Performance monitoring disabled. Set OPENCODE_PERF=1 to enable.")
      return
    }

    const memoryMetrics = getMetrics()
      .filter((m) => m.memoryDelta !== undefined && m.memoryDelta !== 0)
      .sort((a, b) => Math.abs(b.memoryDelta || 0) - Math.abs(a.memoryDelta || 0))
      .slice(0, topN)

    if (memoryMetrics.length === 0) {
      log.info("\n=== Memory Report ===")
      log.info("No memory tracking data available. Use trackMemory() to track memory usage.")
      log.info("\n")
      return
    }

    log.info("\n=== Memory Allocation Report ===\n")
    log.info("Name".padEnd(40) + "Calls".padEnd(10) + "Total Delta".padEnd(15) + "Avg Delta")
    log.info("-".repeat(100))

    for (const metric of memoryMetrics) {
      const avgDelta = (metric.memoryDelta || 0) / metric.count
      log.info(
        metric.name.padEnd(40) +
          metric.count.toString().padEnd(10) +
          formatBytes(metric.memoryDelta || 0).padEnd(15) +
          formatBytes(avgDelta),
      )
    }

    log.info("-".repeat(100))
    const totalDelta = memoryMetrics.reduce((sum, m) => sum + (m.memoryDelta || 0), 0)
    log.info(`Total memory delta: ${formatBytes(totalDelta)}`)
    log.info("\n")
  }

  /**
   * Comprehensive performance and memory report
   */
  export function fullReport() {
    if (!enabled) {
      log.info("Performance monitoring disabled. Set OPENCODE_PERF=1 to enable.")
      return
    }

    report()

    const bottlenecks = detectBottlenecks()
    if (bottlenecks.length > 0) {
      log.info("\n=== Performance Bottlenecks (>100ms avg) ===\n")
      log.info("Name".padEnd(40) + "Calls".padEnd(10) + "Avg(ms)".padEnd(12) + "Total(ms)")
      log.info("-".repeat(100))

      for (const metric of bottlenecks) {
        log.info(
          metric.name.padEnd(40) +
            metric.count.toString().padEnd(10) +
            metric.avgTime.toFixed(2).padEnd(12) +
            metric.totalTime.toFixed(2),
        )
      }
      log.info("\n")
    }

    memoryReport()
  }

  /**
   * Automatically log report on process exit
   */
  if (enabled) {
    process.on("exit", () => {
      report()
    })
  }
}
