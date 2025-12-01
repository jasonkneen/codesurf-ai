---
status: pending
priority: p2
issue_id: "006"
tags: [code-review, data-integrity, ci-cd, reliability]
dependencies: []
---

# No Idempotent Guarantees on Publish Operations

## Problem Statement

The publish script creates git commits, tags, and releases without checking for existing versions or providing rollback support. Re-running the script can cause duplicate releases or leave the repository in an inconsistent state.

**Why it matters:** Accidental double-runs of publish can create duplicate tags, duplicate GitHub releases, and leave partial publishes that confuse users.

## Findings

### Data Integrity Guardian Analysis
- **Location:** `/script/publish.ts` (lines 127-134)
- **Impact:** Data inconsistency, duplicate releases

### Problematic Code
```typescript
// No check if version already exists
await $`git commit -am "release: v${Script.version}"`
await $`git tag v${Script.version}`
await $`git push origin HEAD --tags --no-verify --force-with-lease`
await $`gh release create v${Script.version} ...`
```

### Failure Scenarios
1. **Version already published:** Script fails mid-way, partial state remains
2. **Tag already exists:** Git tag creation fails, but npm packages may be published
3. **Double-run:** Creates duplicate GitHub releases
4. **Network failure mid-publish:** Some packages published, others not

## Proposed Solutions

### Solution 1: Pre-flight Checks (Recommended)
```typescript
// Check if version already exists before any publish
const existingTags = await $`git tag -l v${Script.version}`.text()
if (existingTags.trim()) {
  console.error(`Version ${Script.version} already has a git tag. Use different version.`)
  process.exit(1)
}

const npmExists = await fetch(`https://registry.npmjs.org/codesurf-ai/${Script.version}`)
if (npmExists.ok) {
  console.error(`Version ${Script.version} already published to npm.`)
  process.exit(1)
}
```
- **Pros:** Prevents most double-publish scenarios
- **Cons:** Race condition still possible
- **Effort:** Small (15 minutes)
- **Risk:** Low

### Solution 2: Transaction-like Wrapper with Rollback
```typescript
async function publishWithRollback() {
  const changes = { published: [], tagged: false, released: false }
  try {
    // Track all changes
    for (const pkg of packages) {
      await $`bun publish ...`
      changes.published.push(pkg)
    }
    await $`git tag v${Script.version}`
    changes.tagged = true
    await $`gh release create ...`
    changes.released = true
  } catch (e) {
    // Rollback on failure
    if (changes.released) {
      await $`gh release delete v${Script.version} -y`.nothrow()
    }
    if (changes.tagged) {
      await $`git tag -d v${Script.version}`.nothrow()
    }
    for (const pkg of changes.published) {
      await $`npm unpublish ${pkg}@${Script.version}`.nothrow()
    }
    throw e
  }
}
```
- **Pros:** Full atomicity guarantee
- **Cons:** npm unpublish has restrictions, complex logic
- **Effort:** Medium (1 hour)
- **Risk:** Medium (npm unpublish limitations)

## Recommended Action

**Solution 1** - Add pre-flight checks before any publishing. Simple and effective.

## Technical Details

**Affected Files:**
- `/script/publish.ts` (lines 127-134)

## Acceptance Criteria

- [ ] Check for existing git tag before publish
- [ ] Check for existing npm version before publish
- [ ] Clear error message if version exists
- [ ] Document re-publish procedure if needed

## Work Log

| Date | Action | Outcome |
|------|--------|---------|
| 2025-12-01 | Code review identified issue | P2 Important finding |

## Resources

- File: `/script/publish.ts`
