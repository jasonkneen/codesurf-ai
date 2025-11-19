# Performance Monitoring Utilities

OpenCode includes comprehensive performance monitoring utilities to track execution time, memory usage, and identify bottlenecks in your code.

## Quick Start

Enable performance monitoring by setting the environment variable:

```bash
export OPENCODE_PERF=1
```

Or run commands with the flag:

```bash
OPENCODE_PERF=1 bun run index.ts
```

## Features

### 1. **Execution Time Tracking**

Track how long functions take to execute:

```typescript
import { Perf } from "./util/perf"

// Wrap any function
const myFunction = Perf.track("my-function", (x: number) => {
  return x * 2
})

myFunction(5) // Automatically tracked
```

**Async functions** are fully supported:

```typescript
const fetchData = Perf.track("fetch-data", async (url: string) => {
  const response = await fetch(url)
  return response.json()
})

await fetchData("https://api.example.com/data")
```

### 2. **Memory Usage Tracking**

Track heap memory allocations:

```typescript
const processLargeArray = Perf.trackMemory("process-array", () => {
  const arr = new Array(1000000).fill(0)
  return arr.map((x) => x * 2)
})

processLargeArray() // Tracks time AND memory delta
```

Memory tracking also supports async functions:

```typescript
const loadData = Perf.trackMemory("load-data", async () => {
  const data = await fetchLargeDataset()
  return processData(data)
})
```

### 3. **Manual Measurement**

Measure code blocks without wrapping functions:

```typescript
// Traditional stop() method
const timer = Perf.measure("complex-calculation")
// ... your code here
timer.stop()

// Or use modern 'using' statement
{
  using timer = Perf.measure("auto-cleanup")
  // ... your code here
} // Automatically stopped when scope exits
```

### 4. **Bottleneck Detection**

Find functions that are taking too long:

```typescript
// Find all functions averaging > 100ms
const bottlenecks = Perf.detectBottlenecks()

bottlenecks.forEach((metric) => {
  console.log(`${metric.name}: ${metric.avgTime.toFixed(2)}ms avg`)
})

// Use custom threshold (e.g., 50ms)
const fastBottlenecks = Perf.detectBottlenecks(50)
```

### 5. **Memory Reports**

Identify which functions are allocating the most memory:

```typescript
// Show top 10 memory allocators
Perf.memoryReport()

// Show top 5
Perf.memoryReport(5)
```

Output example:

```
=== Memory Allocation Report ===

Name                                    Calls     Total Delta    Avg Delta
----------------------------------------------------------------------------------------------------
process-large-file                      3         125.42 MB      41.81 MB
load-configuration                      10        15.23 MB       1.52 MB
parse-json                              50        8.91 MB        182.50 KB
```

### 6. **Performance Reports**

View comprehensive performance data:

```typescript
// Basic timing report
Perf.report()

// Full report with bottlenecks and memory
Perf.fullReport()
```

Output example:

```
=== OpenTUI Performance Report ===

Name                                    Calls     Avg(ms)     Total(ms)   Min/Max(ms)
----------------------------------------------------------------------------------------------------
database-query                          150       245.32      36798.00    120.45 / 890.23
api-request                             89        112.67      10027.63    45.12 / 456.78
parse-config                            5         2.34        11.70       1.23 / 4.56

Total tracked operations: 244
Total time: 46837.33ms


=== Performance Bottlenecks (>100ms avg) ===

Name                                    Calls     Avg(ms)     Total(ms)
----------------------------------------------------------------------------------------------------
database-query                          150       245.32      36798.00
api-request                             89        112.67      10027.63


=== Memory Allocation Report ===

Name                                    Calls     Total Delta    Avg Delta
----------------------------------------------------------------------------------------------------
database-query                          150       2.45 GB        16.72 MB
```

## API Reference

### Core Functions

#### `Perf.track<T>(name: string, fn: T): T`

Wrap a function to track its execution time. Returns the wrapped function.

**Parameters:**

- `name`: Unique identifier for this metric
- `fn`: Function to wrap (sync or async)

**Returns:** Wrapped function with same signature

#### `Perf.trackMemory<T>(name: string, fn: T): T`

Wrap a function to track execution time AND memory usage.

**Parameters:**

- `name`: Unique identifier for this metric
- `fn`: Function to wrap (sync or async)

**Returns:** Wrapped function with same signature

#### `Perf.measure(name: string): { stop: () => void }`

Manually measure a code block.

**Parameters:**

- `name`: Unique identifier for this metric

**Returns:** Object with `stop()` method and `Symbol.dispose` for `using` statements

### Reporting Functions

#### `Perf.report(): void`

Print execution time report for all tracked functions.

#### `Perf.memoryReport(topN?: number): void`

Print memory allocation report.

**Parameters:**

- `topN`: Number of top allocators to show (default: 10)

#### `Perf.fullReport(): void`

Print comprehensive report including execution times, bottlenecks, and memory.

#### `Perf.detectBottlenecks(threshold?: number): ExtendedMetric[]`

Get array of functions exceeding the time threshold.

**Parameters:**

- `threshold`: Minimum average time in milliseconds (default: 100)

**Returns:** Array of metrics sorted by average time (descending)

### Data Access

#### `Perf.getMetrics(): ExtendedMetric[]`

Get all metrics sorted by total execution time.

**Returns:** Array of all metrics

#### `Perf.getMetric(name: string): ExtendedMetric | undefined`

Get a specific metric by name.

**Parameters:**

- `name`: Metric identifier

**Returns:** Metric object or undefined

#### `Perf.clear(): void`

Clear all collected metrics.

## Metric Interface

```typescript
interface ExtendedMetric {
  name: string // Metric identifier
  count: number // Number of calls
  totalTime: number // Total execution time (ms)
  avgTime: number // Average execution time (ms)
  minTime: number // Fastest execution (ms)
  maxTime: number // Slowest execution (ms)
  lastCall: number // Timestamp of last call
  memoryDelta?: number // Total memory delta (bytes) - only if trackMemory() used
}
```

## Best Practices

### 1. **Use Meaningful Names**

```typescript
// ✅ Good
Perf.track("user-authentication", authenticateUser)
Perf.trackMemory("parse-large-json", parseJSON)

// ❌ Bad
Perf.track("fn1", myFunction)
Perf.track("test", anotherFunction)
```

### 2. **Track at Strategic Points**

Focus on:

- Database queries
- API requests
- File I/O operations
- Complex computations
- Data transformations

### 3. **Use trackMemory() Sparingly**

Memory tracking has overhead. Use it for functions that:

- Process large datasets
- Create many objects
- Are suspected of memory leaks

### 4. **Regular Bottleneck Checks**

```typescript
// In development, check for bottlenecks periodically
if (process.env.NODE_ENV === "development") {
  setInterval(() => {
    const bottlenecks = Perf.detectBottlenecks()
    if (bottlenecks.length > 0) {
      console.warn("⚠️  Performance bottlenecks detected:")
      Perf.report()
    }
  }, 60000) // Every minute
}
```

### 5. **Auto-Report on Exit**

Performance data is automatically logged on process exit when `OPENCODE_PERF=1`.

## Production Usage

⚠️ **Performance monitoring has minimal overhead but should generally be disabled in production.**

If you need production monitoring:

1. Use sampling (track every Nth call)
2. Focus on critical paths only
3. Consider using lightweight alternatives
4. Monitor the monitoring overhead

```typescript
// Example: Sample 1% of requests
const shouldTrack = Math.random() < 0.01

const handler = shouldTrack ? Perf.track("api-handler", apiHandler) : apiHandler
```

## Testing

Run the test suite:

```bash
# With monitoring enabled
OPENCODE_PERF=1 bun test test/util/perf.test.ts

# With monitoring disabled (tests still pass)
bun test test/util/perf.test.ts
```

Run the demo script:

```bash
OPENCODE_PERF=1 bun test-perf.ts
```

## Troubleshooting

### Metrics not appearing?

- Ensure `OPENCODE_PERF=1` is set
- Check that functions are actually being called
- Verify the metric name is correct

### Memory deltas seem wrong?

- JavaScript garbage collection affects measurements
- Memory is tracked per-call, not total allocated
- Negative deltas are possible if GC runs during execution

### High overhead?

- Reduce the number of tracked functions
- Use `track()` instead of `trackMemory()` where possible
- Consider sampling in high-frequency code paths

## Examples

See `test-perf.ts` for complete working examples.

## License

Part of OpenCode project.
