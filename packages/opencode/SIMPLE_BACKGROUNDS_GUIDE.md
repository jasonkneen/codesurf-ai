# Simple TUI Backgrounds Guide

Quick reference for adding backgrounds to your OpenTUI application.

## Method 1: Box Background Color (Recommended)

Wrap your app content in a colored box:

```tsx
// In src/cli/cmd/tui/app.tsx or any component

<box
  width="100%"
  height="100%"
  backgroundColor="#0a0a0a" // Dark background
>
  {/* Your app content here */}
</box>
```

### Color Examples

```tsx
// Dark themes
backgroundColor = "#0a0a0a" // Very dark gray
backgroundColor = "#1a1a2e" // Dark blue-gray
backgroundColor = "#16161d" // Almost black

// Subtle colored backgrounds
backgroundColor = "#1a1a2e" // Dark blue
backgroundColor = "#1a2e1a" // Dark green
backgroundColor = "#2e1a1a" // Dark red

// Light themes (if needed)
backgroundColor = "#f8f9fa" // Light gray
backgroundColor = "#ffffff" // White
```

### Pros/Cons

✅ Pros:

- Works in all terminals
- TUI-scoped (doesn't affect entire terminal)
- Simple, reliable
- No dependencies on graphics protocols

❌ Cons:

- Solid colors only
- No gradients or images
- No transparency

## Method 2: Terminal Background Color

Set the terminal's background directly with escape codes:

```typescript
// At app startup (in createEffect or onMount)
process.stderr.write("\x1b]11;#0a0a0a\x07") // Set dark background

// To reset to default on exit:
process.stderr.write("\x1b]111\x07")
```

### Color Format

```typescript
// Hex colors
process.stderr.write("\x1b]11;#1a1a2e\x07")

// RGB colors
process.stderr.write("\x1b]11;rgb:1a/1a/2e\x07")

// Named colors (limited support)
process.stderr.write("\x1b]11;black\x07")
```

### Pros/Cons

✅ Pros:

- Works in all modern terminals
- Very simple
- Instant effect

❌ Cons:

- Affects ENTIRE terminal (not just TUI)
- Persists after TUI exits (need cleanup)
- Only solid colors

## Method 3: Gradient Background (CSS-like)

Use multiple boxes with different background colors:

```tsx
<box width="100%" height="100%" flexDirection="column">
  <box backgroundColor="#1a1a2e" height={10} /> {/* Top: dark blue */}
  <box backgroundColor="#16213e" height={15} /> {/* Middle: medium blue */}
  <box backgroundColor="#0f3460" flexGrow={1} /> {/* Bottom: lighter blue */}
</box>
```

Creates a subtle gradient effect by stacking colored boxes.

## Method 4: Pattern Background (ASCII)

Create texture with repeated characters:

```tsx
<box width="100%" height="100%">
  <text color="#333333">{Array(terminalHeight).fill("░").join("\n")}</text>
  {/* Your content overlay */}
</box>
```

ASCII characters for patterns:

- `░` - Light shade
- `▒` - Medium shade
- `▓` - Dark shade
- `·` - Middle dot
- `…` - Ellipsis

## Complete Example

```tsx
// src/cli/cmd/tui/app.tsx

function App() {
  const dimensions = useTerminalDimensions()

  return (
    <box
      width="100%"
      height="100%"
      backgroundColor="#0a0a0a" // Dark background
      flexDirection="column"
    >
      {/* Header */}
      <box
        height={3}
        backgroundColor="#1a1a2e" // Slightly lighter
        borderStyle="single"
        borderColor="gray"
      >
        <text bold>My Application</text>
      </box>

      {/* Main content area */}
      <box flexGrow={1} padding={1}>
        {/* Your app content */}
      </box>

      {/* Footer */}
      <box height={2} backgroundColor="#1a1a2e" justifyContent="center">
        <text color="gray">Press Ctrl+C to exit</text>
      </box>
    </box>
  )
}
```

## Best Practices

### Do's ✅

- Use dark colors for better text contrast
- Test with different terminal color schemes
- Provide adequate padding for readability
- Use box borders to separate sections

### Don'ts ❌

- Don't use bright/saturated backgrounds (hurts eyes)
- Don't forget about terminal theme users
- Don't rely on graphics protocols (not universal)
- Don't set terminal background without cleanup

## Accessibility

```tsx
// Good contrast ratios
<box backgroundColor="#0a0a0a">
  <text color="#ffffff">High contrast text</text>
</box>

// Bad - low contrast
<box backgroundColor="#333333">
  <text color="#444444">Hard to read!</text>
</box>
```

Minimum contrast ratios:

- Normal text: 4.5:1
- Large text: 3:1
- UI elements: 3:1

## Testing

```bash
# Build and run
bun run build
bun run index.ts

# Test in different terminals
# - Native Terminal.app
# - iTerm2
# - Kitty
# - Ghostty
# - WezTerm
```

## Troubleshooting

**Background not showing?**

- Check if box has width/height set
- Verify backgroundColor syntax (hex with #)
- Ensure box is parent of content

**Colors look wrong?**

- Terminal might override colors
- Check terminal's theme settings
- Test with `TERM=xterm-256color`

**Background flickers?**

- Don't recreate boxes on every render
- Use memo/cache for static backgrounds
- Avoid unnecessary re-renders

## Future: Image Backgrounds

When Kitty graphics z-index support becomes universal:

```typescript
// Will work in the future
import { setWallpaper } from "@/util/kitty-wallpaper"

await setWallpaper({
  image: gradientImage,
  width: 100,
  height: 40,
  zIndex: -1, // Behind text
})
```

Currently not supported in most terminals. Stick with solid colors for now.

## Summary

**For production:** Use Method 1 (box backgroundColor)  
**For quick tests:** Use Method 2 (terminal escape codes)  
**For fancy effects:** Use Method 3 (gradient boxes)  
**For texture:** Use Method 4 (ASCII patterns)

**Recommended:**

```tsx
<box width="100%" height="100%" backgroundColor="#0a0a0a">
  {/* Your app */}
</box>
```

Simple, reliable, works everywhere.
