# TUI Wallpaper Feature Removed

## Summary

The Kitty graphics wallpaper feature has been **temporarily removed** from `app.tsx` because z-index layering isn't working in Ghostty terminal.

## What Worked

- ✅ Kitty graphics protocol (screenshots display inline perfectly)
- ✅ `displayImage()` function in `src/util/kitty-graphics.ts`
- ✅ `cc-computer-use` tool shows screenshots inline

## What Didn't Work

- ❌ Background wallpapers using `z-index: -1`
- ❌ Images behind text (images displayed but blocked clicks or didn't layer properly)

## Root Cause

Ghostty may not fully support the Kitty graphics protocol's **z-index** parameter for layering. The protocol spec says:

```
z=<int> - Z-index for stacking (negative = behind text)
```

But this appears to not be working in Ghostty yet.

## Code Removed

From `src/cli/cmd/tui/app.tsx`:

```typescript
// ❌ REMOVED (lines 200-218)
createEffect(async () => {
  const { width, height } = dimensions()
  const wallpaper = await generateGradientWallpaper(width, height, "dark", "blue")
  await setWallpaper({
    image: wallpaper,
    width,
    height,
    imageId: 1000,
  })
})

onCleanup(() => {
  clearWallpaper(1000)
})
```

## Alternative Solutions

### Option 1: Terminal Background Color (Simplest)

Set the terminal background directly:

```typescript
// In app.tsx, add to createEffect
process.stderr.write("\x1b]11;#0a0a0a\x07") // Dark background
```

Pros:

- ✅ Works in all terminals
- ✅ No protocol dependencies
- ✅ Instant effect

Cons:

- ❌ Changes entire terminal, not just TUI
- ❌ Only solid colors, no gradients/images

### Option 2: OpenTUI Box Background

Wrap the app in a colored box:

```tsx
<box width="100%" height="100%" backgroundColor="#0a0a0a">
  {/* Your app content */}
</box>
```

Pros:

- ✅ Works perfectly in OpenTUI
- ✅ TUI-scoped (doesn't affect entire terminal)
- ✅ Can use any color

Cons:

- ❌ Only solid colors
- ❌ No gradients or images

### Option 3: Wait for Ghostty Support

Keep the wallpaper code but commented out, test periodically:

```typescript
// TODO: Re-enable when Ghostty supports z-index
// const wallpaper = await generateGradientWallpaper(...)
// await setWallpaper({ ... })
```

Test with:

```bash
kitten icat --z-index=-1 image.png
```

## Files That Still Exist

These files are still in the codebase and can be used in the future:

- ✅ `src/util/kitty-graphics.ts` - Core graphics protocol (working!)
- ✅ `src/util/kitty-wallpaper.ts` - Wallpaper system (z-index broken)
- ✅ `src/util/kitty-icon-button.ts` - Graphical buttons (complex, not recommended)

## Documentation

- `KITTY_GRAPHICS.md` - How Kitty graphics work
- `WALLPAPER.md` - Wallpaper API documentation
- `WALLPAPER_TROUBLESHOOTING.md` - Debug guide
- `GRAPHICAL_BUTTONS.md` - Button system guide

## Recommendation

**Use Option 1 or 2** for backgrounds. Stick with what works:

1. ✅ Terminal background color escape codes
2. ✅ OpenTUI box backgroundColor
3. ✅ Keep using Kitty graphics for **screenshots** (already working)

Revisit wallpapers when Ghostty adds full z-index support.

## Testing

To verify if z-index works in your terminal:

```bash
# Test z-index support directly
printf '\x1b_Ga=T,f=100,z=-1;test\x1b\\'
echo "Does text appear ABOVE the image?"
```

If you see "test" as literal text instead of an image behind the text, z-index isn't supported.

## When to Re-enable

Re-enable wallpapers when:

1. Ghostty documents z-index support
2. `kitten icat --z-index=-1` works correctly
3. Test script `examples/wallpaper-demo.ts` displays properly
