---
status: complete
priority: p2
issue_id: "005"
tags: [code-review, performance, ci-cd, reliability]
dependencies: []
completed: 2025-12-01
---

# Missing Timeout and Retry Logic in Publish Script

## Problem Statement

The publish script makes network requests (npm registry, AI model inference) without timeout or retry logic. If any service is unreachable, the publish process hangs indefinitely, blocking CI/CD pipelines.

**Why it matters:** Release pipelines can fail silently or hang for 30+ minutes, wasting CI resources and delaying releases.

## Findings

### Performance Oracle Analysis
- **Location:** `/script/publish.ts` (lines 12-90)
- **Impact:** CI/CD pipeline hangs on service degradation

### Vulnerable Code
```typescript
// No timeout on npm registry fetch
const previous = await fetch("https://registry.npmjs.org/codesurf-ai/latest")
  .then(res => res.ok ? res.json() : null)

// No timeout on AI inference (can take 2-10 seconds, or hang)
const raw = await opencode.client.session.prompt({
  body: { model: { providerID: "opencode", modelID: "claude-haiku-4-5" }, ... }
})
```

### Performance Bottlenecks
| Operation | Typical Time | Worst Case |
|-----------|--------------|------------|
| npm registry fetch | 200-500ms | Hang indefinitely |
| Git tag check | 50-200ms | ~1 second |
| AI inference | 2-10 seconds | Hang indefinitely |
| GitHub release | 1-3 seconds | ~30 seconds |

## Proposed Solutions

### Solution 1: Add Timeouts with Promise.race (Recommended)
```typescript
const fetchWithTimeout = async (url: string, timeout = 5000) => {
  return Promise.race([
    fetch(url),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Fetch timeout: ${url}`)), timeout)
    )
  ])
}

const previous = await fetchWithTimeout("https://registry.npmjs.org/codesurf-ai/latest")
  .then(res => res.ok ? res.json() : null)
  .catch(() => null)

// AI inference with timeout and fallback
const changelogPromise = Promise.race([
  opencode.client.session.prompt({...}),
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Changelog generation timeout")), 30000)
  )
]).catch(() => {
  console.warn("Changelog generation failed, using fallback")
  notes.push("See commit history for detailed changes")
  return null
})
```
- **Pros:** Prevents hangs, provides fallback
- **Cons:** May miss changelog on slow AI responses
- **Effort:** Small (20 minutes)
- **Risk:** Low

### Solution 2: Add Retry Logic
```typescript
async function withRetry<T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn()
    } catch (e) {
      if (i === retries - 1) throw e
      console.warn(`Retry ${i + 1}/${retries} after error:`, e)
      await new Promise(r => setTimeout(r, delay * (i + 1)))
    }
  }
  throw new Error('Unreachable')
}

const previous = await withRetry(() =>
  fetch("https://registry.npmjs.org/codesurf-ai/latest").then(r => r.json())
)
```
- **Pros:** Handles transient failures gracefully
- **Cons:** Adds complexity, extends total time
- **Effort:** Small (15 minutes)
- **Risk:** Low

## Recommended Action

**Solution 1 + Solution 2** - Add both timeouts AND retry logic for critical operations.

## Technical Details

**Affected Files:**
- `/script/publish.ts` (lines 12-90)

## Acceptance Criteria

- [ ] npm registry fetch has 5-second timeout
- [ ] AI inference has 30-second timeout with fallback
- [ ] Git operations have 10-second timeout
- [ ] GitHub release has 60-second timeout
- [ ] All timeouts logged for debugging

## Work Log

| Date | Action | Outcome |
|------|--------|---------|
| 2025-12-01 | Code review identified issue | P2 Important finding |

## Resources

- File: `/script/publish.ts`
