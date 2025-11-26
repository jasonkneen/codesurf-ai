# Worker Architecture

The app uses **Bun workers** (isolated threads) to offload heavy computation from the main TUI thread, keeping the UI responsive.

## Workers Overview

### 1. Background Validation Worker
**File**: `src/cli/cmd/tui/workers/background-validation.worker.ts`

**Role**: Runs lint/typecheck/tests on file changes

**Features**:
- Watches for file changes via FileWatcher events
- Debounces validation to avoid spam
- Runs commands in parallel with fail-fast (aborts remaining on first failure)
- Filters files by include/exclude patterns
- Tracks stats: success rate, avg duration, total runs

**Managed by**: `BackgroundWorkers.init()`

---

### 2. Prefetch Worker
**File**: `src/cli/cmd/tui/workers/prefetch.worker.ts`

**Role**: Preloads likely-next files based on context patterns

**Features**:
- Caches file contents for instant retrieval
- Strategies: import analysis, test files, component patterns, related files
- LRU cache eviction when hitting max size
- Concurrent task processing
- Tracks cache hits/misses

**Managed by**: `BackgroundWorkers.init()`

---

### 3. Sidebar Worker
**File**: `src/cli/cmd/tui/workers/sidebar.worker.ts`

**Role**: Computes sidebar state (heavy computations off main thread)

**Features**:
- Git status fetching
- Token counting
- Message stats (costs, saved cost from cache, token usage)
- Diff stats computation (additions/deletions/modified)
- Todo list management

---

### 4. Left Sidebar Worker
**File**: `src/cli/cmd/tui/workers/left-sidebar.worker.ts`

**Role**: Session list management

**Features**:
- Fetches and categorizes sessions by date (today/yesterday/this week/last week/older)
- Session search
- Periodic recategorization

---

### 5. Subagent Worker
**File**: `src/cli/cmd/tui/workers/subagent.worker.ts`

**Role**: Runs subagent sessions in isolated threads for true parallelism

**Features**:
- Each subagent gets its own worker
- Creates child session via API
- Monitors progress (tool calls, tokens, cost)
- Supports model override
- Abort capability

---

## How Workers are Started

From `src/worker/background-workers.ts`:

```typescript
if (config.validation.enabled) {
  startValidationWorker()
}
if (config.prefetch.enabled) {
  startPrefetchWorker()
}
```

- **Validation** and **Prefetch** workers are optional and enabled via config
- **Sidebar** workers are started when the TUI needs them
- **Subagent** workers are spawned dynamically when tasks are delegated

## Worker Communication

All workers use the `Rpc` utility (`src/util/rpc.ts`) for communication:
- Main thread creates `Rpc.client(worker)` to call worker methods
- Workers call `Rpc.listen(rpc)` to expose their RPC handlers
- State updates are broadcast via `postMessage()` with JSON payloads

## Logging

Workers log to files since `console.log` doesn't show in TUI:
- `/tmp/opencode-validation-worker.log`
- `/tmp/opencode-prefetch-worker.log`
- `/tmp/opencode-sidebar-worker.log`
- `/tmp/opencode-left-sidebar-worker.log`
- `/tmp/opencode-subagent-worker.log`
