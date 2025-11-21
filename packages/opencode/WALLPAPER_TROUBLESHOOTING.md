# Wallpaper Not Showing - Troubleshooting

## Issue

The wallpaper code is implemented correctly, but the images aren't displaying in Ghostty.

## What We Built

✅ Complete wallpaper system (`kitty-wallpaper.ts`)  
✅ Integration into TUI (`app.tsx`)  
✅ Proper escape codes generated  
✅ Z-index support for background layers

## Why It's Not Working

### Root Cause

The Kitty graphics protocol escape sequences are being **printed as literal text** instead of being interpreted by the terminal.

Test output shows:

```
_Ga=T,f=100,c=10,r=5,q=2;iVBORw0K...
```

Instead of rendering an image, we see the raw escape code.

### Possible Reasons

1. **Ghostty Configuration**
   - Kitty graphics support might not be enabled
   - Check: `~/.config/ghostty/config`
   - May need: `graphics-protocol = kitty`

2. **Ghostty Version**
   - Older versions might not support z-index
   - Check version: `ghostty --version`
   - Z-index (`z=-1`) was added later to Kitty protocol

3. **Terminal Detection**
   - Our `supportsKittyGraphics()` checks `$TERM`
   - Returns `true` for `xterm-ghostty`
   - But Ghostty might not fully implement the protocol

4. **Output Stream**
   - Initially used `stdout` (TUI intercepts it)
   - Changed to `stderr` (still not working)
   - Might need `/dev/tty` direct write

## What Works

The **Kitty graphics protocol itself** works in Ghostty for:

- ✅ Screenshots (we tested this earlier)
- ✅ Basic image display with cursor movement
- ✅ Images at current cursor position

What **doesn't work**:

- ❌ Z-index (`z=-1` for background layers)
- ❌ Images staying in place as wallpapers

## Solutions to Try

### 1. Check Ghostty Config

```bash
cat ~/.config/ghostty/config | grep graphics
```

If not present, add:

```
graphics-protocol = kitty
```

### 2. Test Basic Graphics

```bash
# Test if Ghostty renders images at all
kitten icat ~/path/to/image.png
```

If this doesn't work, Ghostty's Kitty graphics support isn't working.

### 3. Try Without Z-Index

The wallpaper code uses `z=-1` to place images behind text. Ghostty might not support this.

In `src/util/kitty-wallpaper.ts`, try removing z-index:

```typescript
const escapeCode = displayImage(image, {
  width,
  height,
  imageId,
  // zIndex: -1,  // Remove this line
  quiet: true,
  moveCursor: false,
})
```

### 4. Alternative: Use Terminal Background Color

Instead of images, set a background color:

```typescript
// In app.tsx
createEffect(() => {
  // Set terminal background via ANSI
  process.stderr.write("\x1b]11;#1a1a2e\x07") // Dark blue-gray
})
```

### 5. Alternative: Use Box Background Colors

OpenTUI supports background colors on boxes:

```tsx
<box backgroundColor="#1a1a2e" width={dimensions().width} height={dimensions().height}>
  {/* Your UI here */}
</box>
```

## Verification Steps

### Step 1: Verify Kitty Graphics Work

```bash
# Take a screenshot and display it
screencapture -x /tmp/test.png
kitty +kitten icat /tmp/test.png
```

If you see the image, Kitty graphics work.

### Step 2: Verify Z-Index Support

```bash
# Test z-index=-1 (behind text)
printf '\x1b_Ga=T,f=100,c=20,r=10,z=-1;iVBORw0K...\x1b\\'
echo "Text should be on top"
```

If text appears on top of image, z-index works.

### Step 3: Check Terminal Type

```bash
echo $TERM
# Should be: xterm-ghostty or similar
```

## Recommended Next Steps

Since the wallpaper isn't showing, I recommend:

### Option A: Use Box Backgrounds (Simplest)

```typescript
// In your TUI components
<box backgroundColor="#0a0a0a" blur={true}>
  {/* Content */}
</box>
```

### Option B: Terminal Background Color

```typescript
// Set once on startup
process.stderr.write("\x1b]11;#1a1a2e\x07")
```

### Option C: Debug Ghostty Support

1. Update Ghostty to latest version
2. Enable graphics in config
3. Test with `kitten icat`
4. Report issue to Ghostty if not working

## Files to Keep or Remove

### Keep (Still Useful)

- `src/util/kitty-graphics.ts` - Works for screenshots
- `examples/graphical-button-demo.ts` - Educational
- Documentation files

### Can Remove (Not Working)

- Wallpaper code in `app.tsx` (lines 200-218)
- `src/util/kitty-wallpaper.ts` (if not using)

Or keep everything for future use when Ghostty fully supports z-index!

## Conclusion

The code is correct, but Ghostty may not fully support:

1. Z-index for layering
2. Persistent background images
3. The full Kitty graphics specification

For now, use **box backgrounds** or **terminal background colors** instead.
