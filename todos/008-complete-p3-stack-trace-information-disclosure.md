---
status: complete
priority: p3
issue_id: "008"
tags: [code-review, security, information-disclosure]
dependencies: []
completed: 2025-12-01
---

# Information Disclosure via Error Stack Traces

## Problem Statement

Error messages including full stack traces are returned to API clients. Stack traces reveal internal file paths, dependency names, and implementation details that assist attackers.

**Why it matters:** Stack traces help attackers understand your system architecture and identify potential vulnerabilities in specific library versions.

## Findings

### Security Sentinel Analysis
- **Location:** `/packages/opencode/src/server/server.ts` (lines 99-114)
- **CVSS Score:** 5.3 (Medium)

### Problematic Code
```typescript
.onError((err, c) => {
  log.error("failed", { error: err })
  // ...
  const message = err instanceof Error && err.stack ? err.stack : err.toString()
  return c.json(new NamedError.Unknown({ message }).toObject(), { status: 500 })
  //                                    ^^^^^^^ FULL STACK TRACE RETURNED
})
```

### Information Leaked
- Internal file paths: `/Users/developer/projects/opencode/...`
- Node module versions: `at Hono@4.7.10/src/...`
- Code structure: Function names, class hierarchies
- Potential vulnerabilities: Known CVEs in revealed library versions

## Proposed Solutions

### Solution 1: Generic Error Messages (Recommended)
```typescript
.onError((err, c) => {
  // Always log full error internally
  log.error("failed", { error: err, stack: err.stack })

  if (err instanceof NamedError) {
    // Named errors are safe to return
    return c.json(err.toObject(), { status: ... })
  }

  // Generic message for unknown errors
  return c.json(
    new NamedError.Unknown({ message: 'Internal server error' }).toObject(),
    { status: 500 }
  )
})
```
- **Pros:** Secure, simple change
- **Cons:** Harder to debug client-side
- **Effort:** Small (15 minutes)
- **Risk:** Low

### Solution 2: Environment-Based Detail Level
```typescript
const isDev = process.env.NODE_ENV === 'development'

.onError((err, c) => {
  log.error("failed", { error: err })

  const message = isDev
    ? (err.stack ?? err.toString())
    : 'Internal server error'

  return c.json(new NamedError.Unknown({ message }).toObject(), { status: 500 })
})
```
- **Pros:** Full details in dev, secure in prod
- **Cons:** Requires proper NODE_ENV configuration
- **Effort:** Small (10 minutes)
- **Risk:** Low

## Recommended Action

**Solution 1** - Always return generic messages. Log details server-side for debugging.

## Technical Details

**Affected Files:**
- `/packages/opencode/src/server/server.ts` (lines 99-114)

## Acceptance Criteria

- [ ] No stack traces in production API responses
- [ ] Full error details logged server-side
- [ ] Error correlation ID returned for support requests

## Work Log

| Date | Action | Outcome |
|------|--------|---------|
| 2025-12-01 | Code review identified issue | P3 Nice-to-have |

## Resources

- [OWASP Error Handling](https://owasp.org/www-community/Improper_Error_Handling)
- File: `/packages/opencode/src/server/server.ts`
