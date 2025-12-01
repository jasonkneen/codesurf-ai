---
status: complete
priority: p1
issue_id: "001"
tags: [code-review, security, cors, critical]
dependencies: []
completed: 2025-12-01
---

# Unconfigured CORS Middleware - Security Risk

## Problem Statement

The CORS middleware is added with default configuration `cors()` which allows requests from **ANY origin**. This is a critical security vulnerability that enables:

- Cross-Site Request Forgery (CSRF) attacks on all endpoints
- Session hijacking via cross-origin requests
- Unauthorized API access from malicious websites
- OAuth token theft via cross-origin requests

**Why it matters:** Any website can make authenticated requests to the API, potentially executing shell commands, modifying sessions, or stealing credentials.

## Findings

### Security Sentinel Analysis
- **Location:** `/packages/opencode/src/server/server.ts:98`
- **Code:** `.use(cors())` - No configuration specified
- **CVSS Score:** 7.5 (High)
- **OWASP Category:** A05:2021 - Security Misconfiguration

### Attack Vector
```javascript
// From attacker's website
fetch('http://localhost:PORT/session/my-session-id/shell', {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ command: 'rm -rf /' })
})
```

### Vulnerable Endpoints
| Endpoint | Risk Level | Impact |
|----------|------------|--------|
| POST `/session/:id/shell` | CRITICAL | Remote code execution |
| POST `/session/:id/message` | CRITICAL | Arbitrary code generation |
| DELETE `/session/:id` | HIGH | Data destruction |
| POST `/provider/:id/oauth/callback` | HIGH | Account takeover |

## Proposed Solutions

### Solution 1: Environment-Based Origins (Recommended)
```typescript
.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  allowMethods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: [],
}))
```
- **Pros:** Configurable per environment, secure by default
- **Cons:** Requires environment variable setup
- **Effort:** Small (15 minutes)
- **Risk:** Low

### Solution 2: Localhost-Only (Strictest)
```typescript
.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
}))
```
- **Pros:** Maximum security for CLI-only tool
- **Cons:** May break web UI if deployed
- **Effort:** Small (5 minutes)
- **Risk:** Low

### Solution 3: Remove CORS Entirely
```typescript
// Remove .use(cors()) - rely on same-origin policy
```
- **Pros:** Most secure, no cross-origin access
- **Cons:** Breaks any legitimate cross-origin clients
- **Effort:** Minimal (2 minutes)
- **Risk:** Medium (may break functionality)

## Recommended Action

**Solution 1** - Configure CORS with environment-based origins. This provides flexibility for different deployment scenarios while maintaining security.

## Technical Details

**Affected Files:**
- `/packages/opencode/src/server/server.ts` (line 98)

**Components:**
- Hono server middleware chain
- All API endpoints

## Acceptance Criteria

- [ ] CORS middleware configured with explicit origin whitelist
- [ ] Default origins restricted to localhost only
- [ ] Environment variable `ALLOWED_ORIGINS` documented
- [ ] OPTIONS preflight requests return correct headers
- [ ] Cross-origin requests from unknown origins are rejected

## Work Log

| Date | Action | Outcome |
|------|--------|---------|
| 2025-12-01 | Code review identified issue | P1 Critical finding |

## Resources

- [Hono CORS Documentation](https://hono.dev/docs/middleware/builtin/cors)
- [OWASP CORS Guide](https://owasp.org/www-community/attacks/csrf)
- PR: Current branch `dev-codesurf`
