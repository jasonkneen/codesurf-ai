# Graphical Buttons in TUI using Kitty Graphics Protocol

This guide shows how to create clickable graphical buttons in OpenCode's TUI using the Kitty graphics protocol.

## Overview

The system combines three technologies:

1. **Kitty Graphics Protocol** - Displays PNG images inline in the terminal
2. **Cell-based Click Detection** - Maps mouse clicks to terminal cell coordinates
3. **Button Manager** - Tracks button positions and handles click events

## How It Works

```
┌─────────────────────────────────────────────┐
│  Terminal Display                           │
│                                             │
│  ┌────────┐  ┌────────┐  ┌────────┐       │
│  │  Save  │  │  Run   │  │  Stop  │       │ ← Graphical buttons (PNG)
│  └────────┘  └────────┘  └────────┘       │
│     ↑ (5,3)     ↑ (10,3)    ↑ (15,3)      │ ← Cell coordinates
│                                             │
│  Mouse Click at (6, 3) → "Save" clicked!   │
└─────────────────────────────────────────────┘
```

### Step 1: Create the Button Image

```typescript
import { generateButtonImage } from "@/util/kitty-icon-button"

// Generate a simple colored button (in practice, render an SVG icon to PNG)
const buttonPNG = await generateButtonImage(32, 16, "blue")
```

### Step 2: Send to Terminal via Kitty Protocol

```typescript
import { displayImage } from "@/util/kitty-graphics"

const escapeCode = displayImage(buttonPNG, {
  width: 4, // 4 terminal cells wide
  height: 2, // 2 terminal cells tall
  imageId: 100, // Unique ID
  quiet: true,
})

// Write to terminal
process.stdout.write(escapeCode)
```

### Step 3: Track Button Position & Handle Clicks

```typescript
import { buttonManager } from "@/util/kitty-icon-button"

// Register the button
const buttonId = await buttonManager.addButton({
  x: 5, // Column 5
  y: 3, // Row 3
  width: 4,
  height: 2,
  color: "blue",
  label: "Save",
  onClick: () => console.log("Save clicked!"),
})

// Handle mouse events in your TUI
function onMouseClick(col: number, row: number) {
  if (buttonManager.handleClick(col, row)) {
    return // Button was clicked, handled
  }
  // Handle other clicks...
}
```

## Button Manager API

### `buttonManager.addButton(options)`

Create and register a new graphical button.

```typescript
const buttonId = await buttonManager.addButton({
  x: number,           // Column position
  y: number,           // Row position
  width: number,       // Width in cells
  height: number,      // Height in cells
  color: string,       // "blue" | "green" | "red" | "yellow"
  label: string,       // Accessibility label
  onClick: () => void, // Click handler
})
```

Returns: Unique button ID (number)

### `buttonManager.removeButton(id)`

Remove a button by ID.

```typescript
buttonManager.removeButton(buttonId)
```

### `buttonManager.handleClick(col, row)`

Check if a click at (col, row) hits any button. Returns `true` if handled.

```typescript
const handled = buttonManager.handleClick(6, 3)
```

### `buttonManager.getButtonAt(col, row)`

Get the button at a position (useful for hover effects).

```typescript
const button = buttonManager.getButtonAt(6, 3)
if (button) {
  console.log(`Hovering over: ${button.label}`)
}
```

### `buttonManager.getAllButtons()`

Get all registered buttons.

```typescript
const buttons = buttonManager.getAllButtons()
for (const button of buttons) {
  console.log(`${button.label} at (${button.x}, ${button.y})`)
}
```

## Integration with TUI Components

### In a Solid.js Component (sidebar.tsx)

```typescript
import { createEffect, onCleanup } from "solid-js"
import { buttonManager } from "@/util/kitty-icon-button"

export function Sidebar() {
  let saveButtonId: number | undefined

  // Create button on mount
  createEffect(async () => {
    saveButtonId = await buttonManager.addButton({
      x: 2,
      y: 5,
      width: 4,
      height: 2,
      color: "blue",
      label: "Save",
      onClick: () => handleSave()
    })
  })

  // Cleanup on unmount
  onCleanup(() => {
    if (saveButtonId) {
      buttonManager.removeButton(saveButtonId)
    }
  })

  // Render placeholder for non-Kitty terminals
  return (
    <box>
      <text x={2} y={5}>[Save]</text>
    </box>
  )
}
```

### Handling Mouse Events

```typescript
import { useRenderer } from "@opentui/solid"

const renderer = useRenderer()

// Listen for mouse events
renderer.onMouse((event) => {
  if (event.type === "click") {
    const col = event.col
    const row = event.row

    if (buttonManager.handleClick(col, row)) {
      return // Button handled the click
    }

    // Handle other clicks...
  }

  if (event.type === "move") {
    // Update hover state
    const button = buttonManager.getButtonAt(event.col, event.row)
    if (button) {
      // Show hover effect
    }
  }
})
```

## Limitations

### 1. Terminal Support

Only works in terminals that support the Kitty graphics protocol:

- ✅ Ghostty
- ✅ Kitty
- ✅ WezTerm
- ✅ Konsole
- ❌ iTerm2 (uses different protocol)
- ❌ Standard terminals

Always provide a text fallback for compatibility.

### 2. Cell-based Positioning

Buttons must align to terminal cell boundaries. A cell is typically:

- Width: 8-10 pixels
- Height: 16-20 pixels

You can't position a button at arbitrary pixel coordinates.

### 3. No Native Click Events

The Kitty protocol doesn't report clicks on images. You must:

1. Track button positions yourself
2. Map mouse clicks to cell coordinates
3. Check if click overlaps a button region

### 4. Refresh on Every Render

TUI redraws can clear the screen. You may need to:

- Re-emit image escape codes on each render
- Or use persistent image IDs and placements

### 5. Performance

Sending large PNG images on every render can be slow. Optimizations:

- Use small, simple images
- Cache image data
- Use virtual placements with Unicode placeholders

## Advanced: Using Real SVG Icons

To use actual Lucide icons or other SVGs:

```typescript
import { readFileSync } from "fs"
import sharp from "sharp"

async function renderSVGIcon(svgPath: string, width: number, height: number): Promise<Buffer> {
  const svgBuffer = readFileSync(svgPath)

  // Render SVG to PNG at the desired size
  const pngBuffer = await sharp(svgBuffer)
    .resize(width * 8, height * 16) // Scale to cell size
    .png()
    .toBuffer()

  return pngBuffer
}

// Usage
const saveIconPNG = await renderSVGIcon("./icons/save.svg", 4, 2)
const escapeCode = displayImage(saveIconPNG, {
  width: 4,
  height: 2,
  imageId: 100,
  quiet: true,
})
```

## Example: Sidebar Action Buttons

```typescript
export function SidebarWithButtons() {
  createEffect(async () => {
    // Create a row of action buttons
    await buttonManager.addButton({
      x: 2, y: 2,
      width: 3, height: 2,
      color: "blue",
      label: "New",
      onClick: () => createNewFile()
    })

    await buttonManager.addButton({
      x: 6, y: 2,
      width: 3, height: 2,
      color: "green",
      label: "Save",
      onClick: () => saveFile()
    })

    await buttonManager.addButton({
      x: 10, y: 2,
      width: 3, height: 2,
      color: "red",
      label: "Close",
      onClick: () => closeFile()
    })
  })

  return (
    <box border="single" width={20} height={10}>
      <text x={1} y={1}>Actions:</text>
      {/* Placeholders for non-Kitty terminals */}
      <text x={2} y={2}>[New]</text>
      <text x={6} y={2}>[Save]</text>
      <text x={10} y={2}>[Close]</text>
    </box>
  )
}
```

## Testing

Run the demo to see it in action:

```bash
bun examples/graphical-button-demo.ts
```

This will:

1. Check terminal support
2. Create 3 colored buttons
3. Show the layout
4. Test click detection
5. Display integration instructions

## Summary

**Pros:**

- ✨ True graphical buttons in the terminal
- 🎨 Can display any PNG image (SVG icons, logos, etc.)
- 🖱️ Clickable via mouse
- 🎯 Positioned precisely at cell coordinates

**Cons:**

- ⚠️ Only works in Kitty-compatible terminals
- 📐 Must align to cell grid
- 🔧 Requires manual click detection
- 🐌 Can be slow if overused

**Best for:**

- Specialized visualizations
- Icon-heavy interfaces in Kitty/Ghostty
- Adding visual flair to TUIs

**Not recommended for:**

- Primary navigation (use text-based UI)
- Production apps (limited terminal support)
- Performance-critical UIs

For most TUI applications, stick with box-drawing characters, colors, and Nerd Fonts for maximum compatibility!
