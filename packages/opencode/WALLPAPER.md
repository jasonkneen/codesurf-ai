## Background Wallpapers in TUI using Kitty Graphics

Create beautiful background images/wallpapers in your terminal UI using the Kitty graphics protocol!

## Overview

The key to wallpapers is the **z-index** parameter:

- `z-index: -1` = Image appears **BEHIND** text
- `z-index: 0` = Image at same level as text
- `z-index: 1+` = Image appears **IN FRONT** of text

For wallpapers, use **negative z-index** to place the image behind all text.

## Quick Start

```typescript
import { setWallpaper, clearWallpaper, generateGradientWallpaper } from "@/util/kitty-wallpaper"

// Generate a simple background
const wallpaper = await generateGradientWallpaper(100, 40, "dark", "blue")

// Set it as wallpaper
await setWallpaper({
  image: wallpaper,
  width: 100, // Terminal columns
  height: 40, // Terminal rows
})

// Later, clear it
clearWallpaper()
```

## API Reference

### `setWallpaper(options)`

Set a background wallpaper image.

```typescript
await setWallpaper({
  image: Buffer | string,      // PNG image data
  width?: number,              // Width in columns (default: 100)
  height?: number,             // Height in rows (default: 40)
  opacity?: number,            // 0-100 (default: 30 for subtle)
  mode?: "fill" | "center" | "tile",  // Positioning mode
  imageId?: number,            // Unique ID (default: 1)
})
```

**Parameters:**

- `image` - PNG buffer or base64 string
- `width` - How many terminal columns wide
- `height` - How many terminal rows tall
- `mode` - How to position the image (currently just uses fill)
- `imageId` - Unique identifier for this wallpaper

### `clearWallpaper(imageId?)`

Remove the wallpaper.

```typescript
clearWallpaper(1) // Clear wallpaper with ID 1
```

### `generateGradientWallpaper(width, height, color1, color2)`

Generate a simple colored background for testing.

```typescript
const bg = await generateGradientWallpaper(100, 40, "dark", "blue")
```

**Colors:** `"blue"`, `"purple"`, `"dark"`

### `loadWallpaperFromFile(filePath)`

Load a custom PNG image as wallpaper.

```typescript
const customBg = await loadWallpaperFromFile("./assets/background.png")
await setWallpaper({ image: customBg })
```

## Use Cases

### 1. Subtle Branding

```typescript
// Show logo in corner
const logo = await loadWallpaperFromFile("./assets/logo.png")
await setWallpaper({
  image: logo,
  width: 20,
  height: 10,
  // Will appear at top-left behind text
})
```

### 2. Theme Backgrounds

```typescript
// Dark theme with subtle texture
const darkBg = await generateGradientWallpaper(100, 40, "dark", "purple")
await setWallpaper({ image: darkBg, opacity: 20 })
```

### 3. Different Backgrounds Per Panel

```typescript
// Left panel: blue background
const leftBg = await generateGradientWallpaper(50, 40, "dark", "blue")
await setWallpaper({ image: leftBg, width: 50, imageId: 1 })

// Right panel: green background
const rightBg = await generateGradientWallpaper(50, 40, "dark", "green")
await setWallpaper({ image: rightBg, width: 50, imageId: 2 })
```

### 4. Loading Screens

```typescript
// Full-screen loading graphic
const loader = await loadWallpaperFromFile("./assets/loading.png")
await setWallpaper({ image: loader, width: 100, height: 40 })

// ... do loading work ...

clearWallpaper()
```

## Integration with OpenCode TUI

### In a Component (e.g., app.tsx)

```typescript
import { createEffect, onCleanup } from "solid-js"
import { setWallpaper, clearWallpaper, generateGradientWallpaper } from "@/util/kitty-wallpaper"

export function App() {
  createEffect(async () => {
    // Set wallpaper on mount
    const bg = await generateGradientWallpaper(100, 40, "dark", "blue")
    await setWallpaper({
      image: bg,
      width: 100,
      height: 40,
      imageId: 100,
    })

    // Clear on unmount
    onCleanup(() => {
      clearWallpaper(100)
    })
  })

  return (
    <box>
      {/* Your UI here - will appear on top of wallpaper */}
    </box>
  )
}
```

### Responsive Wallpaper

```typescript
import { createSignal, createEffect } from "solid-js"

export function ResponsiveWallpaper() {
  const [termSize, setTermSize] = createSignal({ width: 100, height: 40 })

  createEffect(async () => {
    const { width, height } = termSize()

    // Generate wallpaper to fit terminal
    const bg = await generateGradientWallpaper(width, height, "dark", "blue")
    await setWallpaper({ image: bg, width, height })
  })

  // Update size when terminal resizes
  // (hook into terminal resize events)
}
```

## Advanced: Custom Graphics

To create custom wallpapers with gradients, patterns, or images:

```typescript
import sharp from "sharp"

// Create a gradient using sharp
async function createGradient(width: number, height: number): Promise<Buffer> {
  const pixelWidth = width * 8 // 8 pixels per cell
  const pixelHeight = height * 16 // 16 pixels per cell

  // Create SVG gradient
  const svg = `
    <svg width="${pixelWidth}" height="${pixelHeight}">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1e3a8a;stop-opacity:0.3" />
          <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:0.1" />
        </linearGradient>
      </defs>
      <rect width="${pixelWidth}" height="${pixelHeight}" fill="url(#grad)" />
    </svg>
  `

  // Render to PNG
  return await sharp(Buffer.from(svg)).png().toBuffer()
}

// Use it
const customBg = await createGradient(100, 40)
await setWallpaper({ image: customBg })
```

## How It Works

```
┌───────────────────────────────────────┐
│  Terminal with Wallpaper              │
├───────────────────────────────────────┤
│                                       │
│  z-index: -1 (Background layer)       │
│  ┌─────────────────────────────────┐  │
│  │ [Wallpaper image rendered here] │  │
│  │ (Subtle, behind everything)     │  │
│  └─────────────────────────────────┘  │
│                                       │
│  z-index: 0 (Text layer)              │
│  ┌─────────────────────────────────┐  │
│  │ Your TUI content here           │  │
│  │ Text appears ON TOP of wallpaper│  │
│  │                                 │  │
│  └─────────────────────────────────┘  │
│                                       │
└───────────────────────────────────────┘
```

1. **Send image** with `z-index: -1`
2. Terminal places it **behind text layer**
3. All text renders **on top** of the image
4. Image stays in place as text scrolls/updates

## Limitations

### 1. Terminal Support

Only works in Kitty-compatible terminals:

- ✅ Ghostty
- ✅ Kitty
- ✅ WezTerm
- ✅ Konsole
- ❌ Others

### 2. No Transparency Control

The Kitty protocol doesn't have built-in opacity control. To make wallpapers subtle:

- Use darker/desaturated colors
- Pre-process images with low opacity
- Use semi-transparent PNGs

### 3. Fixed Positioning

Images are placed at cursor position, not absolute coordinates. Workaround:

- Move cursor to (0,0) before sending image
- Image fills from top-left

### 4. Performance

Large images can be slow. Optimize by:

- Using small, simple images
- Generating images once, reusing them
- Keeping PNG file size small

## Testing

Run the demo to see it in action:

```bash
bun examples/wallpaper-demo.ts
```

You'll see:

1. Wallpaper being set
2. Text appearing on top of it
3. Instructions for use
4. Wallpaper clearing after 30 seconds

## Tips for Best Results

### 1. Keep It Subtle

Wallpapers should enhance, not distract:

```typescript
// Too bright - hard to read text
const bad = await generateGradientWallpaper(100, 40, "red", "yellow")

// Subtle - easy to read
const good = await generateGradientWallpaper(100, 40, "dark", "blue")
```

### 2. Match Your Theme

Coordinate wallpaper colors with your TUI theme:

```typescript
const isDarkTheme = theme() === "dark"
const bg = await generateGradientWallpaper(100, 40, isDarkTheme ? "dark" : "white", isDarkTheme ? "blue" : "gray")
```

### 3. Use for Structure

Different wallpapers for different panels helps users understand layout:

```typescript
// Sidebar: slightly different shade
await setWallpaper({ image: sidebarBg, width: 30, imageId: 1 })

// Main area: another shade
await setWallpaper({ image: mainBg, width: 70, imageId: 2 })
```

### 4. Loading States

Use wallpapers for full-screen loading/splash screens:

```typescript
// Show logo while loading
const splash = await loadWallpaperFromFile("./assets/splash.png")
await setWallpaper({ image: splash })

// ... load app ...

clearWallpaper()
// Now show normal UI
```

## Example: OpenCode Splash Screen

```typescript
// Show OpenCode logo while initializing
export async function showSplashScreen() {
  const logo = await loadWallpaperFromFile("./assets/opencode-logo.png")

  await setWallpaper({
    image: logo,
    width: 100,
    height: 40,
    imageId: 999,
  })

  // Clear after app loads
  setTimeout(() => clearWallpaper(999), 2000)
}
```

## Summary

**Pros:**

- ✨ Beautiful background graphics
- 🎨 Full control over visuals
- 📐 Can cover entire terminal or just sections
- 🖼️ Use any PNG image

**Cons:**

- ⚠️ Only works in Kitty-compatible terminals
- 🎭 No built-in opacity control
- 📏 Limited positioning control
- 🐌 Large images can be slow

**Best for:**

- Subtle theme enhancements
- Branding/logos
- Visual section dividers
- Splash screens

**Not recommended for:**

- Primary visual content (use text/boxes)
- Detailed graphics (will be behind text)
- Terminals without Kitty support

Use wallpapers sparingly for maximum impact!
