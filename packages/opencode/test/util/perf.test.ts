import { describe, it, expect, beforeEach } from "bun:test"
import { Perf } from "../../src/util/perf"

describe("Perf", () => {
  beforeEach(() => {
    Perf.clear()
  })

  describe("track()", () => {
    it("should track synchronous function execution", () => {
      const fn = Perf.track("test-sync", (x: number) => x * 2)
      const result = fn(5)

      expect(result).toBe(10)

      const metric = Perf.getMetric("test-sync")
      if (process.env.OPENCODE_PERF === "1") {
        expect(metric).toBeDefined()
        expect(metric?.count).toBe(1)
        expect(metric?.avgTime).toBeGreaterThanOrEqual(0)
      }
    })

    it("should track async function execution", async () => {
      const fn = Perf.track("test-async", async (x: number) => {
        await new Promise((resolve) => setTimeout(resolve, 10))
        return x * 2
      })

      const result = await fn(5)
      expect(result).toBe(10)

      const metric = Perf.getMetric("test-async")
      if (process.env.OPENCODE_PERF === "1") {
        expect(metric).toBeDefined()
        expect(metric?.count).toBe(1)
        expect(metric?.avgTime).toBeGreaterThanOrEqual(10)
      }
    })

    it("should track multiple calls and update metrics", () => {
      const fn = Perf.track("test-multiple", (x: number) => x * 2)

      fn(1)
      fn(2)
      fn(3)

      const metric = Perf.getMetric("test-multiple")
      if (process.env.OPENCODE_PERF === "1") {
        expect(metric?.count).toBe(3)
        expect(metric?.minTime).toBeLessThanOrEqual(metric?.maxTime || 0)
      }
    })

    it("should track errors and rethrow", () => {
      const fn = Perf.track("test-error", () => {
        throw new Error("test error")
      })

      expect(() => fn()).toThrow("test error")

      const metric = Perf.getMetric("test-error")
      if (process.env.OPENCODE_PERF === "1") {
        expect(metric?.count).toBe(1)
      }
    })
  })

  describe("trackMemory()", () => {
    it("should track memory usage for synchronous functions", () => {
      const fn = Perf.trackMemory("test-memory-sync", () => {
        // Allocate some memory
        const arr = new Array(1000).fill("test")
        return arr.length
      })

      const result = fn()
      expect(result).toBe(1000)

      const metric = Perf.getMetric("test-memory-sync")
      if (process.env.OPENCODE_PERF === "1") {
        expect(metric).toBeDefined()
        expect(metric?.count).toBe(1)
        expect(metric?.memoryDelta).toBeDefined()
      }
    })

    it("should track memory usage for async functions", async () => {
      const fn = Perf.trackMemory("test-memory-async", async () => {
        await new Promise((resolve) => setTimeout(resolve, 10))
        const arr = new Array(1000).fill("test")
        return arr.length
      })

      const result = await fn()
      expect(result).toBe(1000)

      const metric = Perf.getMetric("test-memory-async")
      if (process.env.OPENCODE_PERF === "1") {
        expect(metric).toBeDefined()
        expect(metric?.memoryDelta).toBeDefined()
      }
    })

    it("should accumulate memory delta across multiple calls", () => {
      const fn = Perf.trackMemory("test-memory-accumulate", () => {
        const arr = new Array(100).fill(1)
        return arr.length
      })

      fn()
      fn()
      fn()

      const metric = Perf.getMetric("test-memory-accumulate")
      if (process.env.OPENCODE_PERF === "1") {
        expect(metric?.count).toBe(3)
        expect(metric?.memoryDelta).toBeDefined()
      }
    })
  })

  describe("measure()", () => {
    it("should measure code block execution time", () => {
      const timer = Perf.measure("test-measure")
      let sum = 0
      for (let i = 0; i < 1000; i++) {
        sum += i
      }
      timer.stop()

      const metric = Perf.getMetric("test-measure")
      if (process.env.OPENCODE_PERF === "1") {
        expect(metric).toBeDefined()
        expect(metric?.count).toBe(1)
      }
    })

    it("should work with using statement", () => {
      {
        using _timer = Perf.measure("test-using")
        let sum = 0
        for (let i = 0; i < 1000; i++) {
          sum += i
        }
      }

      const metric = Perf.getMetric("test-using")
      if (process.env.OPENCODE_PERF === "1") {
        expect(metric).toBeDefined()
        expect(metric?.count).toBe(1)
      }
    })
  })

  describe("detectBottlenecks()", () => {
    it("should detect functions exceeding threshold", () => {
      // Create a slow function
      const slowFn = Perf.track("slow-function", () => {
        const start = Date.now()
        while (Date.now() - start < 150) {
          // Busy wait
        }
        return true
      })

      const fastFn = Perf.track("fast-function", () => {
        return true
      })

      slowFn()
      fastFn()

      const bottlenecks = Perf.detectBottlenecks(100)

      if (process.env.OPENCODE_PERF === "1") {
        expect(bottlenecks.length).toBeGreaterThan(0)
        expect(bottlenecks[0].name).toBe("slow-function")
        expect(bottlenecks[0].avgTime).toBeGreaterThan(100)
      } else {
        expect(bottlenecks.length).toBe(0)
      }
    })

    it("should use custom threshold", () => {
      const fn = Perf.track("custom-threshold", () => {
        const start = Date.now()
        while (Date.now() - start < 50) {
          // Busy wait for 50ms
        }
      })

      fn()

      const bottlenecks50 = Perf.detectBottlenecks(50)
      const bottlenecks100 = Perf.detectBottlenecks(100)

      if (process.env.OPENCODE_PERF === "1") {
        expect(bottlenecks50.length).toBeGreaterThanOrEqual(bottlenecks100.length)
      }
    })
  })

  describe("getMetrics()", () => {
    it("should return all metrics sorted by total time", () => {
      const fn1 = Perf.track("metric-1", () => {
        const start = Date.now()
        while (Date.now() - start < 10) {}
      })
      const fn2 = Perf.track("metric-2", () => {
        const start = Date.now()
        while (Date.now() - start < 20) {}
      })

      fn1()
      fn2()

      const metrics = Perf.getMetrics()

      if (process.env.OPENCODE_PERF === "1") {
        expect(metrics.length).toBe(2)
        // Sorted by total time descending
        expect(metrics[0].totalTime).toBeGreaterThanOrEqual(metrics[1].totalTime)
      }
    })
  })

  describe("clear()", () => {
    it("should clear all metrics", () => {
      const fn = Perf.track("test-clear", () => true)
      fn()

      if (process.env.OPENCODE_PERF === "1") {
        expect(Perf.getMetric("test-clear")).toBeDefined()

        Perf.clear()

        expect(Perf.getMetric("test-clear")).toBeUndefined()
      } else {
        expect(Perf.getMetric("test-clear")).toBeUndefined()
      }
    })
  })

  describe("when disabled", () => {
    it("should return original function when OPENCODE_PERF is not set", () => {
      const original = (x: number) => x * 2
      const tracked = Perf.track("disabled-test", original)

      // Should still work
      expect(tracked(5)).toBe(10)

      if (process.env.OPENCODE_PERF !== "1") {
        // When disabled, should return original function
        expect(tracked).toBe(original)
      }
    })

    it("should return noop measure when disabled", () => {
      const timer = Perf.measure("disabled-measure")
      timer.stop()

      if (process.env.OPENCODE_PERF !== "1") {
        expect(Perf.getMetric("disabled-measure")).toBeUndefined()
      }
    })
  })
})
