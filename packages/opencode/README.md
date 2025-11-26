# CodeSurf

AI coding agent for the terminal with advanced UI, parallel workflows, and deep Anthropic integration.

Based on [OpenCode](https://github.com/sst/opencode) - enhanced with additional features, UI improvements, and workflow optimizations.

![CodeSurf Screenshot](screenshot.png)

## Installation

```bash
npm install -g codesurf-ai
```

## Usage

```bash
codesurf
```

Or use the short alias:

```bash
surf
```

---

## Key Features

### Dual Sidebar System

- **Left Sidebar** - Session list with quick switching (`Cmd/Ctrl+[`)
- **Right Sidebar** - Context panels for Tools, Todos, and Files (`Cmd/Ctrl+]`)
- **Tab Navigation** - Press `1`, `2`, `3` to switch right sidebar tabs
- **Tool Favorites** - Star frequently used tools for quick access

### Parallel Mode

Run multiple isolated coding sessions simultaneously:

```bash
codesurf run --parallel "Add authentication"
codesurf run --parallel "Implement dark mode"
codesurf run --parallel "Write unit tests"
```

Each session gets its own git worktree with automatic branch creation, commits, and merge instructions.

### Claude Code Tools (`cc_*` prefix)

Anthropic-native tools optimized for Claude:

| Tool              | Purpose                    |
| ----------------- | -------------------------- |
| `cc_bash`         | Execute shell commands     |
| `cc_read`         | Read files with pagination |
| `cc_write`        | Write/create files         |
| `cc_edit`         | Exact string replacements  |
| `cc_glob`         | Pattern-based file search  |
| `cc_grep`         | Content-based file search  |
| `cc_webfetch`     | Fetch web content          |
| `cc_computer_use` | Desktop automation         |

### Computer Use

Full desktop automation with screenshot, mouse, and keyboard control:

```typescript
// Take a screenshot
await cc_computer_use({ action: "screenshot" })

// Click at coordinates
await cc_computer_use({ action: "mouse_move", coordinate: [500, 300] })
await cc_computer_use({ action: "left_click" })

// Type text
await cc_computer_use({ action: "type", text: "Hello World" })
```

Requires permissions on macOS (Screen Recording + Accessibility).

### Steering Questions & Interactive Forms

AI can ask interactive questions inline in the conversation:

```xml
<steering-question id="setup">
{
  "title": "Project Setup",
  "questions": [
    {
      "id": "framework",
      "label": "Frontend Framework",
      "type": "single-choice",
      "options": ["React", "Vue", "Svelte"],
      "required": true
    }
  ]
}
</steering-question>
```

### Kitty Graphics Protocol

Display images inline in supported terminals (Kitty, Ghostty, WezTerm):

- Screenshots from `cc_computer_use` display inline
- Graphical buttons with click detection
- Rich visual feedback in the TUI

### Smart Model Selection

Automatic cost optimization (~80% savings for coordination tasks):

- **Read-only agents** (orchestrator, plan) use smaller, cheaper models
- **Edit-enabled agents** (general) use flagship models
- Configurable via `small_model` in config

### Background Workers

Real-time validation and prefetch workers:

- **Validation Worker** - Runs lint/typecheck automatically
- **Prefetch Worker** - Pre-loads likely-needed files
- Live status in footer with detailed dialog (`Val●`, `Pre●`)

### Anthropic API Features

Deep integration with Anthropic's advanced capabilities:

```jsonc
{
  "anthropic": {
    "promptCaching": true, // Reduce costs up to 90%
    "extendedThinking": true, // Show reasoning process
    "citations": true, // Source attribution
    "contextEditing": true, // Smart context compaction
    "tokenEfficientToolUse": true, // Optimized tool calls
  },
}
```

### Knowledge Base (KB)

Persistent memory with AI-powered RAG:

- `kb_ingest` - Add documents with auto-sharding
- `kb_query` - Query with intelligent shard routing
- `kb_search` - Full-text search with BM25 ranking

### Specialized Agents

- **@orchestrator** - Breaks down complex tasks and delegates
- **@general** - Full implementation with all tools
- **@plan** - Read-only planning and analysis

---

## Configuration

Create `opencode.jsonc` or `codesurf.jsonc` in your project:

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "model": "anthropic/claude-sonnet-4",
  "small_model": "anthropic/claude-haiku-4.5",
  "anthropic": {
    "promptCaching": true,
    "extendedThinking": true,
  },
  "favorites": {
    "project": ["bash", "read", "write"],
    "global": ["grep", "glob"],
  },
  "keybinds": {
    "sidebar_left_toggle": "cmd+[",
    "sidebar_right_toggle": "cmd+]",
  },
}
```

---

## Differences from OpenCode

All OpenCode features remain intact. CodeSurf adds:

| Feature                | Description                                    |
| ---------------------- | ---------------------------------------------- |
| Dual Sidebars          | Left (sessions) + Right (tools/todos/files)    |
| Tool Favorites         | Star tools for quick access                    |
| Quick Commit           | Commit from Files tab with auto-messages       |
| Parallel Mode          | Isolated git worktrees for concurrent work     |
| Claude Code Tools      | `cc_*` Anthropic-native tool wrappers          |
| Computer Use           | Desktop automation (screenshot/mouse/keyboard) |
| Kitty Graphics         | Inline images in supported terminals           |
| Steering Questions     | Interactive forms in chat                      |
| Smart Model Selection  | Auto cost optimization                         |
| Background Workers     | Live validation and prefetch                   |
| Enhanced Mouse Support | Better click/scroll handling                   |

---

## Keybinds

| Key           | Action                    |
| ------------- | ------------------------- |
| `Cmd/Ctrl+[`  | Toggle left sidebar       |
| `Cmd/Ctrl+]`  | Toggle right sidebar      |
| `Cmd/Ctrl+B`  | Toggle both sidebars      |
| `1`, `2`, `3` | Switch right sidebar tabs |
| `Esc`         | Close dialogs/cancel      |

---

## Development

To install dependencies:

```bash
bun install
```

To run in development mode:

```bash
bun run dev
```

To build:

```bash
bun run build
```

To run tests:

```bash
bun test
```

To run typecheck:

```bash
bun run typecheck
```

---

## Documentation

- [Parallel Mode](./PARALLEL_MODE.md)
- [Claude Code Tools](./CLAUDE_CODE_TOOLS.md)
- [Computer Use](./COMPUTER_USE.md)
- [Anthropic Features](./ANTHROPIC_FEATURES.md)
- [CodeSurf Features](./CODESURF_FEATURES.md)
- [Kitty Graphics](./KITTY_GRAPHICS.md)
- [Graphical Buttons](./GRAPHICAL_BUTTONS.md)
- [Model Selection](./MODEL_SELECTION.md)
- [Steering Questions](./STEERING_QUESTIONS_INTEGRATION.md)
- [Worker UI](./WORKER_UI_IMPROVEMENTS.md)

---

## Requirements

- **Runtime**: Bun or Node.js 18+
- **Terminals** (for full features):
  - Kitty, Ghostty, WezTerm (graphics protocol)
  - Any terminal (text fallbacks available)
- **macOS extras** (for computer use):
  - `cliclick` (`brew install cliclick`)
  - Screen Recording + Accessibility permissions

---

## License

MIT
