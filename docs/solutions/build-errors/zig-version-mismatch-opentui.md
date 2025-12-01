---
title: Zig Version Mismatch Between build.zig and build.zig.zon
category: build-errors
component: opentui/zig
symptoms:
  - Build fails with "no field named 'root_source_file' in struct 'Build.TestOptions'"
  - ArrayList API compatibility errors
  - "callconv(.C) is invalid" errors
  - BufferedWriter API mismatches
  - Error message "Unsupported Zig version X.X.X"
root_cause: build.zig modified for Zig 0.15 API while build.zig.zon references Zig 0.14 dependencies
severity: medium
resolved: true
date_resolved: 2025-12-01
tags:
  - zig
  - build-system
  - version-mismatch
  - api-compatibility
  - opentui
  - homebrew
---

# Zig Version Mismatch: OpenTUI Build Failure

## Problem Summary

OpenTUI project failed to build due to Zig version mismatch. The `build.zig` file was accidentally modified to use Zig 0.15 API while `build.zig.zon` still referenced Zig 0.14 dependencies.

## Symptoms

1. Build fails immediately with API errors
2. Error: `no field named 'root_source_file' in struct 'Build.TestOptions'`
3. Error: `struct 'array_list.Aligned(u8,null)' has no member named 'init'`
4. Version check fails: "Unsupported Zig version 0.15.2"

## Root Cause

**Mismatch between build files:**
- `build.zig` → Modified for Zig 0.15 API (createModule, root_module pattern)
- `build.zig.zon` → Still references Zig 0.14 dependencies

**Why full migration failed:**
Zig 0.15 has massive breaking changes affecting 100+ files:
- `ArrayList.init()` no longer takes allocator parameter
- `ArrayList.deinit()/append()` now require allocator as parameter
- `callconv(.C)` changed to `.c`
- `BufferedWriter` API changed completely

## Solution

### Step 1: Revert build.zig to Zig 0.14 API

```bash
cd /path/to/opentui
git checkout HEAD -- packages/core/src/zig/build.zig
```

Or manually ensure `build.zig` has:

```zig
const SUPPORTED_ZIG_VERSIONS = [_]SupportedZigVersion{
    .{ .major = 0, .minor = 14, .patch = 0 },
    .{ .major = 0, .minor = 14, .patch = 1 },
    // .{ .major = 0, .minor = 15, .patch = 0 },  // NOT supported
};
```

And uses the Zig 0.14 test API:

```zig
// Zig 0.14 style (correct)
const test_exe = b.addTest(.{
    .root_source_file = b.path("test.zig"),
    .target = test_target,
    .filter = b.option([]const u8, "test-filter", "..."),
});

// NOT Zig 0.15 style (wrong for this project)
// const test_module = b.createModule(.{ ... });
// const test_exe = b.addTest(.{ .root_module = test_module, ... });
```

### Step 2: Install Zig 0.14

```bash
# macOS with Homebrew
brew install zig@0.14

# Verify installation
/opt/homebrew/opt/zig@0.14/bin/zig version
# Output: 0.14.1
```

### Step 3: Build with Correct Zig Version

```bash
# Option 1: Temporary PATH override
PATH="/opt/homebrew/opt/zig@0.14/bin:$PATH" npm run build

# Option 2: Add to shell config (~/.zshrc or ~/.bashrc)
export PATH="/opt/homebrew/opt/zig@0.14/bin:$PATH"

# Option 3: Force link (overrides system zig)
brew link zig@0.14 --force
```

### Step 4: Install JS Dependencies

```bash
bun install
# or
npm install
```

### Step 5: Verify Build

```bash
PATH="/opt/homebrew/opt/zig@0.14/bin:$PATH" npm run build

# Expected: All 6 platforms build successfully
# - Linux x86_64
# - macOS x86_64 (Intel)
# - macOS aarch64 (Apple Silicon)
# - Windows x86_64
# - Windows aarch64
# - Linux aarch64
```

## Key Zig 0.14 vs 0.15 API Differences

| Feature | Zig 0.14 | Zig 0.15 |
|---------|----------|----------|
| ArrayList.init | `ArrayList.init(allocator)` | `ArrayList{}` (no param) |
| ArrayList.deinit | `list.deinit()` | `list.deinit(allocator)` |
| ArrayList.append | `list.append(item)` | `list.append(allocator, item)` |
| callconv | `callconv(.C)` | `callconv(.c)` |
| addTest | `.root_source_file` | `.root_module` |

## Prevention

### Quick Version Check

```bash
# Check installed version
zig version

# Check required version in project
grep "minimum_zig_version" build.zig.zon
grep "SUPPORTED_ZIG_VERSIONS" build.zig
```

### Best Practice: Version File

Create `.zig-version` in project root:
```
0.14.1
```

Then use in build scripts:
```bash
export PATH="/opt/homebrew/opt/zig@$(cat .zig-version)/bin:$PATH"
```

### Pre-commit Hook

```bash
#!/bin/bash
# .git/hooks/pre-commit
REQUIRED=$(grep -oP 'minimum_zig_version = "\K[^"]+' build.zig.zon)
INSTALLED=$(zig version)
if [[ "$INSTALLED" != "$REQUIRED"* ]]; then
    echo "Error: Zig version mismatch. Required: $REQUIRED, Installed: $INSTALLED"
    exit 1
fi
```

## Related

- OpenTUI repository: Zig-based terminal UI library
- Zig 0.15 release notes: Major API breaking changes
- Homebrew versioned formulae: `brew install pkg@version`

## Lessons Learned

1. **Always check both files**: `build.zig` and `build.zig.zon` must be in sync
2. **Zig upgrades are invasive**: Major versions require touching many files
3. **Use versioned installs**: `brew install zig@0.14` allows multiple versions
4. **PATH override is safe**: Doesn't affect system-wide zig installation
