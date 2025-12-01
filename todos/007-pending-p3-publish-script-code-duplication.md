---
status: pending
priority: p3
issue_id: "007"
tags: [code-review, code-quality, dry]
dependencies: []
---

# Code Duplication in Publish Script Fallback Logic

## Problem Statement

The publish script has identical git log command strings in multiple branches, violating DRY principle. This makes maintenance harder and the fallback intent unclear.

**Why it matters:** Code duplication makes bugs harder to fix and changes harder to propagate consistently.

## Findings

### Code Simplicity Reviewer Analysis
- **Location:** `/script/publish.ts` (lines 25, 28, 32)
- **Impact:** Maintainability, clarity

### Duplicated Code
```typescript
if (tagExists.exitCode === 0) {
  logCmd = `git log v${previous}..HEAD --oneline --format="%h %s" -- packages/opencode packages/sdk packages/plugin`
} else {
  logCmd = `git log -50 --oneline --format="%h %s" -- packages/opencode packages/sdk packages/plugin`  // DUPLICATE
}
} else {
  logCmd = `git log -50 --oneline --format="%h %s" -- packages/opencode packages/sdk packages/plugin`  // IDENTICAL
}
```

Three branches, two produce identical output. The nested if/else is over-engineered.

## Proposed Solutions

### Solution 1: Use Ternary (Recommended)
```typescript
const packages = "packages/opencode packages/sdk packages/plugin"
const logCmd = (previous && tagExists.exitCode === 0)
  ? `git log v${previous}..HEAD --oneline --format="%h %s" -- ${packages}`
  : `git log -50 --oneline --format="%h %s" -- ${packages}`
```
- **Pros:** 40% code reduction, clearer intent
- **Cons:** Slightly less explicit fallback reasoning
- **Effort:** Small (10 minutes)
- **Risk:** Low

### Solution 2: Extract Constants
```typescript
const packages = "packages/opencode packages/sdk packages/plugin"
const format = `--oneline --format="%h %s" -- ${packages}`
const FALLBACK_LOG_CMD = `git log -50 ${format}`

let logCmd: string
if (previous) {
  const tagExists = await $`git rev-parse v${previous}`.nothrow()
  logCmd = tagExists.exitCode === 0
    ? `git log v${previous}..HEAD ${format}`
    : FALLBACK_LOG_CMD
} else {
  logCmd = FALLBACK_LOG_CMD
}
```
- **Pros:** Eliminates all duplication, self-documenting
- **Cons:** More verbose
- **Effort:** Small (15 minutes)
- **Risk:** Low

## Recommended Action

**Solution 1** - Use ternary with extracted packages constant. Best balance of clarity and brevity.

## Technical Details

**Affected Files:**
- `/script/publish.ts` (lines 21-33)

## Acceptance Criteria

- [ ] No duplicate command strings
- [ ] Fallback logic is clear from code structure
- [ ] Tests pass after refactoring

## Work Log

| Date | Action | Outcome |
|------|--------|---------|
| 2025-12-01 | Code review identified issue | P3 Nice-to-have |

## Resources

- File: `/script/publish.ts`
