# Prefetch Worker Concurrent Processing - Verification Guide

## What Changed

The prefetch worker now processes up to `maxConcurrent` files simultaneously instead of one at a time.

**Default Configuration**: `maxConcurrent: 3`

## How to Verify It Works

### Method 1: Watch the Worker Log (Easiest)

1. **Clear the log and start a session:**

   ```bash
   > /tmp/opencode-prefetch-worker.log
   bun dev
   ```

2. **In another terminal, watch the log:**

   ```bash
   tail -f /tmp/opencode-prefetch-worker.log
   ```

3. **Trigger prefetching** by asking about files in your project:

   ```
   "Show me the files in src/session/"
   ```

4. **Look for concurrent execution patterns:**

   ```
   Starting task src/file1.ts (1/3 concurrent, 5 queued)
   Starting task src/file2.ts (2/3 concurrent, 4 queued)  ← Started immediately!
   Starting task src/file3.ts (3/3 concurrent, 3 queued)  ← Started immediately!
   Completed task src/file1.ts (2 still running, 3 queued)
   Starting task src/file4.ts (3/3 concurrent, 2 queued)  ← Next one starts right away
   ```

   **Before (Sequential):**

   ```
   Starting task src/file1.ts (1/1 concurrent, 5 queued)
   Completed task src/file1.ts (0 still running, 4 queued)
   Starting task src/file2.ts (1/1 concurrent, 4 queued)  ← Waited for file1 to finish
   ```

### Method 2: Check Timing

**Sequential (Old):**

- 10 files × 50ms each = **500ms**

**Concurrent with maxConcurrent=3 (New):**

- Batch 1: Files 1-3 in parallel = 50ms
- Batch 2: Files 4-6 in parallel = 50ms
- Batch 3: Files 7-9 in parallel = 50ms
- Batch 4: File 10 alone = 50ms
- **Total: ~200ms** (2.5x faster!)

Look for these patterns in the log:

```
[timestamp] Starting task file1.ts (1/3 concurrent, 9 queued)
[timestamp] Starting task file2.ts (2/3 concurrent, 8 queued)  ← Same timestamp!
[timestamp] Starting task file3.ts (3/3 concurrent, 7 queued)  ← Same timestamp!
```

### Method 3: Monitor State Updates

The worker broadcasts state updates. You can monitor them in the TUI footer (if implemented) or via worker events:

```typescript
worker.on("message", (msg) => {
  if (msg.type === "prefetch.state.update") {
    console.log("Running tasks:", msg.state.runningTasks)
    // Should see values like: 1, 2, 3, 2, 3, 2, 1, 0
    // Not just: 1, 0, 1, 0, 1, 0 (sequential pattern)
  }
})
```

## When You'll See the Benefits

### Scenarios Where It Helps

1. **Opening files with many imports:**
   - File has 10 import statements
   - Worker prefetches all 10 imported files
   - **Before**: 10 × 50ms = 500ms
   - **After**: ~200ms (3 at a time)

2. **Navigating between related files:**
   - Login.tsx → Dashboard.tsx → Profile.tsx
   - Worker prefetches test files, styles, related components
   - **Before**: Sequential loading feels sluggish
   - **After**: Files arrive faster, smoother navigation

3. **Large codebases:**
   - More files to prefetch = bigger wins
   - 30 files: 1.5s → 0.5s (3x faster!)

### Scenarios Where It Doesn't Matter

1. **Small projects** (< 5 files)
2. **Slow file system** (network drives) - bottleneck is I/O, not concurrency
3. **Files already cached** - no prefetching needed

## Configuration

To adjust concurrency, modify your OpenCode config:

```jsonc
{
  "prefetchWorker": {
    "enabled": true,
    "maxConcurrent": 5, // Increase for faster prefetching
    "maxCacheSize": 10485760, // 10MB
    "strategies": ["import", "related"],
  },
}
```

**Recommendations:**

- **Fast SSD**: `maxConcurrent: 5-10`
- **Normal disk**: `maxConcurrent: 3` (default)
- **Network drive**: `maxConcurrent: 1-2`

## Visual Evidence

### Log Pattern (Concurrent)

```
[12:34:56.100] Starting task file1.ts (1/3 concurrent, 9 queued)
[12:34:56.101] Starting task file2.ts (2/3 concurrent, 8 queued)
[12:34:56.102] Starting task file3.ts (3/3 concurrent, 7 queued)
[12:34:56.150] Completed task file1.ts (2 still running, 7 queued)
[12:34:56.151] Starting task file4.ts (3/3 concurrent, 6 queued)
[12:34:56.155] Completed task file2.ts (2 still running, 6 queued)
[12:34:56.156] Starting task file5.ts (3/3 concurrent, 5 queued)
```

**Notice**: Tasks start within milliseconds of each other!

### Log Pattern (Sequential - Old)

```
[12:34:56.100] Starting task file1.ts (1/1 concurrent, 9 queued)
[12:34:56.150] Completed task file1.ts (0 still running, 8 queued)
[12:34:56.200] Starting task file2.ts (1/1 concurrent, 8 queued)
[12:34:56.250] Completed task file2.ts (0 still running, 7 queued)
[12:34:56.300] Starting task file3.ts (1/1 concurrent, 7 queued)
```

**Notice**: Tasks start 50ms apart (after previous completes)

## Troubleshooting

**Not seeing concurrent execution?**

1. Check config: `maxConcurrent` might be set to 1
2. Check queue: Need enough files in queue to see concurrency
3. Check log: Verify worker is actually running
4. Check timing: Very fast files might complete before next starts

**Performance worse?**

1. Reduce `maxConcurrent` - too much concurrency on slow disks hurts
2. Check cache size - might be thrashing
3. Check strategies - might be prefetching too many files

## Summary

✅ **It works if you see:** Multiple "Starting task" lines with timestamps within milliseconds of each other

✅ **It works if you see:** Concurrent counts > 1 (e.g., "2/3 concurrent")

✅ **It works if you see:** Faster overall prefetch times for multiple files

❌ **It's not working if:** All tasks show "1/1 concurrent" or start 50ms+ apart
