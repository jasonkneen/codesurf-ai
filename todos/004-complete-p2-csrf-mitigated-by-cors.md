---
status: complete
priority: p2
issue_id: "004"
tags: [code-review, security, csrf]
dependencies: ["001"]
completed: 2025-12-01
resolution: "Mitigated by CORS origin restrictions - cross-origin requests blocked"
---

# Missing CSRF Protection on State-Changing Operations

## Problem Statement

None of the state-changing endpoints (POST, PUT, PATCH, DELETE) implement CSRF protection mechanisms. Combined with permissive CORS, attackers can modify sensitive data from malicious websites.

**Why it matters:** User credentials can be overwritten, sessions can be modified, and permissions can be changed without user knowledge or consent.

## Findings

### Security Sentinel Analysis
- **Location:** `/packages/opencode/src/server/server.ts` (lines 48-200)
- **CVSS Score:** 7.0 (High)
- **Affected Operations:** All state-changing endpoints

### Vulnerable Endpoints
```typescript
// No CSRF check on any of these:
.put("/:id", ..., async (c) => {
  await Auth.set(id, info)  // Credential modification
})

.delete("/session/:id", ..., async (c) => {
  await Session.remove(sessionID)  // Session deletion
})

.post("/session/:id/permissions/:permissionID", ..., async (c) => {
  Permission.respond({ ... })  // Permission approval
})
```

### Attack Scenario
1. User is logged into opencode locally
2. User visits attacker's website
3. Attacker's page makes cross-origin request to modify auth credentials
4. User's API keys are replaced with attacker-controlled ones

## Proposed Solutions

### Solution 1: Double-Submit Cookie Pattern (Recommended)
```typescript
import { setCookie, getCookie } from 'hono/cookie'
import crypto from 'crypto'

// Generate CSRF token on session start
app.use('/session/*', async (c, next) => {
  let token = getCookie(c, 'XSRF-TOKEN')
  if (!token) {
    token = crypto.randomBytes(32).toString('hex')
    setCookie(c, 'XSRF-TOKEN', token, { httpOnly: false, sameSite: 'Strict' })
  }
  await next()
})

// Validate on state-changing requests
app.use(async (c, next) => {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(c.req.method)) {
    const headerToken = c.req.header('X-XSRF-TOKEN')
    const cookieToken = getCookie(c, 'XSRF-TOKEN')

    if (!headerToken || headerToken !== cookieToken) {
      return c.json({ error: 'CSRF token invalid' }, 403)
    }
  }
  await next()
})
```
- **Pros:** Standard pattern, no server-side state
- **Cons:** Requires client to send header
- **Effort:** Medium (1 hour)
- **Risk:** Low

### Solution 2: SameSite Cookie Attribute
```typescript
// Rely on SameSite=Strict cookies
setCookie(c, 'session', value, {
  httpOnly: true,
  sameSite: 'Strict',  // Prevents cross-origin cookie sending
  secure: true,
})
```
- **Pros:** Simple, browser-native protection
- **Cons:** Doesn't work for all browsers/scenarios
- **Effort:** Small (15 minutes)
- **Risk:** Medium (incomplete protection)

## Recommended Action

**Solution 1** - Implement double-submit cookie CSRF protection. This is the industry standard and works across all browsers.

## Technical Details

**Affected Files:**
- `/packages/opencode/src/server/server.ts`
- All route files with state-changing operations

## Acceptance Criteria

- [ ] CSRF token generated on session initialization
- [ ] All POST/PUT/PATCH/DELETE requests validate token
- [ ] 403 response for invalid/missing tokens
- [ ] Client updated to send X-XSRF-TOKEN header

## Work Log

| Date | Action | Outcome |
|------|--------|---------|
| 2025-12-01 | Code review identified issue | P2 Important finding |

## Resources

- [OWASP CSRF Prevention](https://owasp.org/www-community/attacks/csrf)
