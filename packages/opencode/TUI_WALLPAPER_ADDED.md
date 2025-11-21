# ✅ Wallpaper Added to OpenCode TUI!

I've successfully integrated a subtle background wallpaper into your OpenCode TUI using the Kitty graphics protocol.

## What Was Added

### Modified File

- `src/cli/cmd/tui/app.tsx` - Main TUI app

### New Imports

```typescript
import { setWallpaper, clearWallpaper, generateGradientWallpaper } from "@/util/kitty-wallpaper"
```

### Wallpaper Initialization

```typescript
// 🎨 Set subtle background wallpaper (Kitty graphics protocol)
createEffect(async () => {
  const { width, height } = dimensions()

  // Generate a subtle dark gradient background
  const wallpaper = await generateGradientWallpaper(width, height, "dark", "blue")

  await setWallpaper({
    image: wallpaper,
    width,
    height,
    imageId: 1000, // Unique ID for main wallpaper
  })
})

// Clear wallpaper on unmount
onCleanup(() => {
  clearWallpaper(1000)
})
```

## What You'll See

When you run OpenCode in **Ghostty** (or other Kitty-compatible terminals), you'll see:

1. **Subtle dark background** behind all text
2. **Blue-tinted gradient** for a modern look
3. **Responsive** - adjusts to terminal size
4. **Non-intrusive** - text remains fully readable

## Terminal Support

### ✅ Will Show Wallpaper

- Ghostty (your terminal!)
- Kitty
- WezTerm
- Konsole

### ❌ Will Not Show Wallpaper (But No Errors)

- iTerm2
- Standard terminals
- VS Code terminal

The code gracefully degrades - if the terminal doesn't support Kitty graphics, it simply doesn't render the wallpaper (no errors, no visual artifacts).

## Customization

Want to change the wallpaper? Edit these lines in `app.tsx`:

### Change Colors

```typescript
// Current: dark blue gradient
const wallpaper = await generateGradientWallpaper(width, height, "dark", "blue")

// Try: dark purple
const wallpaper = await generateGradientWallpaper(width, height, "dark", "purple")

// Try: subtle (almost invisible)
const wallpaper = await generateGradientWallpaper(width, height, "dark", "dark")
```

Available colors: `"blue"`, `"purple"`, `"dark"`

### Use Custom Image

```typescript
import { loadWallpaperFromFile } from "@/util/kitty-wallpaper"

// Load your own PNG
const wallpaper = await loadWallpaperFromFile("./assets/background.png")

await setWallpaper({
  image: wallpaper,
  width,
  height,
})
```

### Disable Wallpaper

If you want to turn it off:

```typescript
// Comment out or remove the createEffect block:
/*
createEffect(async () => {
  const { width, height } = dimensions()
  const wallpaper = await generateGradientWallpaper(width, height, "dark", "blue")
  await setWallpaper({ image: wallpaper, width, height, imageId: 1000 })
})
*/
```

Or add a feature flag:

```typescript
const ENABLE_WALLPAPER = false // Set to true to enable

createEffect(async () => {
  if (!ENABLE_WALLPAPER) return
  // ... rest of wallpaper code
})
```

## How It Works

1. **On Mount**: TUI starts, detects terminal dimensions
2. **Generate**: Creates a subtle gradient image matching terminal size
3. **Send**: Uses Kitty graphics protocol with `z-index: -1` to place image **behind** text
4. **Render**: Terminal displays image as background, text renders on top
5. **On Unmount**: Clears the wallpaper when TUI exits

## Performance

The wallpaper:

- ✅ Generated once on mount
- ✅ Small file size (1x1 pixel stretched)
- ✅ No ongoing performance impact
- ✅ Cleared on exit

## Next Steps

Want to do more with wallpapers?

- **Different backgrounds per section** - Use different imageIds for sidebar vs main area
- **Theme-aware** - Different wallpaper for dark/light themes
- **Custom branding** - Load your logo/image as wallpaper
- **Dynamic wallpapers** - Change based on session state

See `WALLPAPER.md` for the complete guide!

---

**Result**: Your OpenCode TUI now has a beautiful, subtle background wallpaper! 🎨✨
