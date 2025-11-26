# Changelog

All notable changes to CodeSurf will be documented in this file.

## [1.0.110] - 2025-11-26

### Added
- **Context Intelligence**: Persistent learning data saved to disk
- **Subagent Worker Pool**: Concurrency limits for better performance
- **Surprise & Delight UI**: New UI improvements and polish
- **Knight Rider Loading Bar**: Swappable loading indicator variant
- **Opus 4.5 Support**: Added Claude Opus 4.5 model
- **Auto-update Notifications**: `autoupdate: notify` option
- **Ollama Cloud Provider**: Documentation for Ollama Cloud setup

### Changed
- Session panel content aligned with consistent left padding
- Standard middle dot separator for better terminal compatibility
- MCPs now displayed in alphabetical order in sidebar
- Modified files sidebar improvements
- Textarea highlight cursor color improvements
- Non-corporate loading spinner style

### Fixed
- **Dialog Navigation**: Fixed scroll-to-current that was locking dialog navigation
- **Dialog Select**: Improved focus, timing, and keyboard handling
- **Session Sync**: Batch updates to prevent render race conditions
- **Null Safety**: Added null checks for session, message, and part handling
- **Favorite Tools**: Resilient handling with improved error recovery
- **File Drop/Paste**: Prevent duplicate path text
- **Hash Compatibility**: Replace Bun.hash.xxHash32 with wyhash for compatibility
- **Light/Dark Mode**: Persist theme preference correctly
- **Duration Calculation**: Add null check for user.time
- **Color Buffer**: Fix undefined object evaluation error
- **Google API**: Resolve API key detection and shell initialization
- **Retry Module**: Add missing IIFE import to prevent runtime crash
- **Fallback Model**: Add explicit fallback and prevent direct provider calls

### Performance
- Prevent re-fetching already synced sessions when switching
- Improved session sync event handling with try-catch wrappers

### Infrastructure
- Bumped opentui to v0.1.50
- Updated Nix flake.lock and hashes
- Bundle JS dist with Bun and patch tree-sitter WASM paths

## [1.0.109] - 2025-11-22

### Added
- Gemini BYOK (Bring Your Own Key) support
- `--refresh` flag for models command
- Reasoning tokens display

### Changed
- Removed hardcoded OpenRouter provider
- Adjusted bundled provider logic and tree shaking

### Fixed
- Desktop layout improvements
- Console favicon issues

## [1.0.108] - 2025-11-21

### Changed
- Loading spinner style update
- Textarea highlight improvements

## [1.0.107] - 2025-11-20

### Fixed
- Copilot plugin improvements with better error messages
- Color buffer undefined error fix

---

Based on [OpenCode](https://github.com/sst/opencode) - Enhanced with CodeSurf features.
