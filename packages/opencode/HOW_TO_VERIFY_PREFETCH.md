# How and When Do We Know Prefetch Concurrency Works?

## Quick Answer

**How to know it works:** Watch `/tmp/opencode-prefetch-worker.log` and look for lines like:

```
Starting task file1.ts (2/3 concurrent, 8 queued)
Starting task file2.ts (3/3 concurrent, 7 queued)
```

If you see `(2/3)` or `(3/3)` → **It's working!** ✅

If you only see `(1/1)` or `(1/3)` → **Not working** ❌

---

## Step-by-Step Verification

### Terminal 1: Start OpenCode

```bash
> /tmp/opencode-prefetch-worker.log  # Clear old logs
bun dev
```

### Terminal 2: Watch the Log

```bash
tail -f /tmp/opencode-prefetch-worker.log
```

### Terminal 1: Trigger Prefetching

Type something that will cause file access:

```
"Show me the session management code"
"List files in src/"
"Explain how the tool system works"
```

### Terminal 2: Observe the Output

**✅ Working (Concurrent):**

```
[2025-01-15T12:34:56.100Z] Starting task src/file1.ts (1/3 concurrent, 9 queued)
[2025-01-15T12:34:56.102Z] Starting task src/file2.ts (2/3 concurrent, 8 queued)
[2025-01-15T12:34:56.103Z] Starting task src/file3.ts (3/3 concurrent, 7 queued)
[2025-01-15T12:34:56.150Z] Completed task src/file1.ts (2 still running, 7 queued)
[2025-01-15T12:34:56.151Z] Starting task src/file4.ts (3/3 concurrent, 6 queued)
```

**Key indicators:**

- Timestamps are milliseconds apart (not 50+ ms)
- Counter shows `(2/3)` or `(3/3)` - multiple tasks running
- Tasks start before others complete

**❌ Not Working (Sequential):**

```
[2025-01-15T12:34:56.100Z] Starting task src/file1.ts (1/1 concurrent, 9 queued)
[2025-01-15T12:34:56.150Z] Completed task src/file1.ts (0 still running, 8 queued)
[2025-01-15T12:34:56.200Z] Starting task src/file2.ts (1/1 concurrent, 8 queued)
[2025-01-15T12:34:56.250Z] Completed task src/file2.ts (0 still running, 7 queued)
```

**Key indicators:**

- Timestamps are 50+ ms apart
- Counter always shows `(1/1)` - one task at a time
- Tasks start only after previous completes

---

## When Will You See the Benefits?

### Immediate Benefits (Every Session)

1. **Opening Files with Imports**
   - You open `Login.tsx` which imports 10 components
   - Worker prefetches all 10 imports
   - **Before**: 500ms total (sequential)
   - **After**: ~200ms total (3 at a time)
   - **Feel**: Navigation feels snappier

2. **Navigating Related Files**
   - Moving between component, test, and style files
   - Worker prefetches related files ahead of time
   - **Before**: Noticeable lag when opening each file
   - **After**: Files appear instantly (already cached)

3. **Exploring Codebases**
   - Asking "Show me authentication code"
   - Worker prefetches 20+ auth-related files
   - **Before**: 1 second loading time
   - **After**: 0.3 seconds loading time

### Bigger Benefits (Large Projects)

| Files to Prefetch | Sequential (Old) | Concurrent (maxConcurrent=3) | Speedup |
| ----------------- | ---------------- | ---------------------------- | ------- |
| 3 files           | 150ms            | 50ms                         | 3x      |
| 10 files          | 500ms            | 200ms                        | 2.5x    |
| 30 files          | 1500ms           | 500ms                        | 3x      |
| 100 files         | 5000ms           | 1700ms                       | 3x      |

**Real-world impact:**

- Small projects (10-20 files): **Barely noticeable**
- Medium projects (100-500 files): **Noticeable improvement**
- Large projects (1000+ files): **Significant speedup**

---

## When You WON'T See Benefits

1. **Files Already Cached**
   - No prefetching needed
   - Cache hits are instant anyway

2. **Very Small Projects**
   - < 10 files total
   - Not enough files to queue up

3. **Slow I/O**
   - Network drives
   - Very slow HDDs
   - Bottleneck is disk speed, not concurrency

4. **Low maxConcurrent**
   - If set to 1, it's sequential
   - If set to 2, gains are minimal

---

## Performance Metrics

### How to Measure

Look at the log and calculate:

```bash
# Extract timing data
grep "Starting task" /tmp/opencode-prefetch-worker.log > starts.txt
grep "Completed task" /tmp/opencode-prefetch-worker.log > completions.txt

# Check first timestamp and last timestamp
head -1 starts.txt  # First task started
tail -1 completions.txt  # Last task completed
# Calculate difference = total time
```

### Expected Results

For 10 files @ 50ms each:

**Sequential:**

- Total time: 500ms
- Avg concurrent: 1
- Pattern: 1,0,1,0,1,0...

**Concurrent (maxConcurrent=3):**

- Total time: ~200ms
- Avg concurrent: 2-3
- Pattern: 1,2,3,2,3,2,1,0

---

## Troubleshooting

### "I don't see any concurrent tasks"

**Check 1: Config**

```bash
grep -A5 "prefetchWorker" ~/.opencode/config.json
```

Look for: `"maxConcurrent": 3` (or higher)

**Check 2: Queue Size**

```bash
grep "queued)" /tmp/opencode-prefetch-worker.log
```

If queue is always 0-1, there aren't enough files to show concurrency.

**Check 3: Worker Running**

```bash
grep "Prefetch worker initialized" /tmp/opencode-prefetch-worker.log
```

Should see initialization message.

### "Performance is worse"

1. **Too much concurrency for slow disk:**
   - Reduce `maxConcurrent` to 1 or 2
   - HDDs struggle with concurrent I/O

2. **Cache thrashing:**
   - Increase `maxCacheSize`
   - Check for frequent evictions in log

3. **Too many strategies:**
   - Disable some strategies: `["import"]` only
   - Reduces cascade of related file prefetches

---

## Visual Timeline

### Sequential (Old)

```
Time →  0ms    50ms   100ms  150ms  200ms  250ms  300ms
File1:  |████|
File2:         |████|
File3:                |████|
File4:                       |████|
File5:                              |████|
File6:                                     |████|
        ═══════════════════════════════════════════
Total:                                        300ms
```

### Concurrent (New, maxConcurrent=3)

```
Time →  0ms    50ms   100ms  150ms  200ms
File1:  |████|
File2:  |████|
File3:  |████|
File4:         |████|
File5:         |████|
File6:         |████|
        ═══════════════════════════
Total:                   150ms ← 2x faster!
```

---

## Summary

### ✅ It's Working If You See:

- Multiple tasks with `(2/3)` or `(3/3)` concurrent
- Timestamps within milliseconds of each other
- Tasks starting before previous ones complete
- Faster overall prefetch times

### ❌ It's Not Working If You See:

- All tasks show `(1/1)` or `(1/3)` concurrent
- Timestamps 50+ ms apart
- Tasks only start after previous completes
- No speed improvement

### 🎯 Best Test:

1. Clear log: `> /tmp/opencode-prefetch-worker.log`
2. Start session: `bun dev`
3. Watch log: `tail -f /tmp/opencode-prefetch-worker.log`
4. Trigger: Ask about files in a large directory
5. Check: Look for `(2/3)` or `(3/3)` in the output

If you see concurrent counts > 1, **it's working!** 🚀
