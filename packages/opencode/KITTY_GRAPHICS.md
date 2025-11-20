# Kitty Graphics Protocol Support

OpenCode now supports the **Kitty Graphics Protocol** for displaying images inline in the terminal!

## What is it?

The Kitty graphics protocol allows terminal emulators to display images directly in the terminal output, without needing to open external viewers. Images integrate with text, can scroll with terminal content, and support advanced features like:

- Positioning control (pixel-perfect placement)
- Z-index layering (images above/below text)
- Animation support
- Efficient transmission (compression, chunking)

## Supported Terminals

Terminals that support the Kitty graphics protocol:

- **Kitty** (original implementation)
- **Ghostty** ✅ (you're using this!)
- **Konsole**
- **WezTerm**
- **Wayst**
- **st** (with patch)
- **Warp**

## Features

### Screenshot Display

The `cc_computer_use` tool now automatically displays screenshots inline when you take them:

```typescript
// Screenshots are automatically displayed in supported terminals
await tool.execute({ action: "screenshot" })
```

### Manual Image Display

You can also display images programmatically:

```typescript
import { displayImageWithCursor, displayImageFile } from "./src/util/kitty-graphics"

// Display from Buffer with automatic cursor movement
// This ensures the image is visible in the terminal
const imageBuffer = await Bun.file("screenshot.png").arrayBuffer()
const escapeCode = displayImageWithCursor(Buffer.from(imageBuffer), {
  width: 60, // Display width in terminal columns
  height: 20, // Display height in terminal rows (optional, auto-calculated if omitted)
  zIndex: 0, // Stack order (negative = behind text)
  imageId: 1, // Unique image ID for referencing
  placementId: 1, // Placement ID (for multiple placements)
  quiet: true, // Suppress terminal responses
})

// Write to stdout
process.stdout.write(escapeCode)

// Or display from file path
const escapeCode2 = await displayImageFile("./image.png", { width: 40 })
process.stdout.write(escapeCode2)
```

**Note:** Use `displayImageWithCursor()` for easy visibility - it automatically moves the cursor down so you can see the image. Use `displayImage()` if you need more control over cursor positioning.

### Check Terminal Support

```typescript
import { supportsKittyGraphics } from "./src/util/kitty-graphics"

const supported = await supportsKittyGraphics()
if (supported) {
  console.log("Your terminal supports Kitty graphics!")
}
```

### Get Window Size

```typescript
import { getWindowSize } from "./src/util/kitty-graphics"

const size = await getWindowSize()
if (size) {
  console.log(`Terminal: ${size.cols}x${size.rows} cells`)
  console.log(`Window: ${size.widthPx}x${size.heightPx} pixels`)
  console.log(`Cell size: ${size.cellWidth}x${size.cellHeight} pixels`)
}
```

### Delete Images

```typescript
import { deleteImages } from "./src/util/kitty-graphics"

// Delete all visible images
process.stdout.write(deleteImages({ deleteAll: true }))

// Delete specific image
process.stdout.write(deleteImages({ imageId: 1 }))

// Delete by z-index
process.stdout.write(deleteImages({ zIndex: -1 }))
```

## Implementation Details

### Image Transmission

Images are transmitted using escape codes in the format:

```
\x1b_G<control data>;<base64 payload>\x1b\\
```

Large images are automatically chunked into 4096-byte pieces for reliable transmission.

### Supported Formats

- **RGB** (24-bit, `f=24`)
- **RGBA** (32-bit with alpha, `f=32`)
- **PNG** (any PNG image, `f=100`) - **Recommended**

PNG format is recommended as it supports compression and is self-describing (width/height embedded).

### Performance

- Images are transmitted efficiently using base64 encoding
- Chunking ensures reliable transmission of large images
- Terminal caches image data for re-display
- Compression supported via zlib deflate

## Testing

Run the test scripts to verify it works in your terminal:

```bash
# Full test with window size detection
bun test-kitty-graphics.ts

# Simple test writing to /dev/tty
bun test-kitty-simple.ts
```

## How It Works

1. **Detection**: Check if terminal supports protocol via `$TERM` or `$TERM_PROGRAM`
2. **Encoding**: Convert image to PNG format (if not already)
3. **Base64**: Encode image data as base64
4. **Chunking**: Split into 4KB chunks for transmission
5. **Escape Codes**: Wrap in Kitty graphics protocol escape sequences
6. **Display**: Terminal renders image at current cursor position

## References

- [Kitty Graphics Protocol Spec](https://sw.kovidgoyal.net/kitty/graphics-protocol/)
- [Implementation in OpenCode](/src/util/kitty-graphics.ts)
- [Computer Use Tool Integration](/src/tool/cc-computer-use.ts)

## Benefits

✅ **No External Viewers**: Images display directly in terminal  
✅ **Scrollback Integration**: Images scroll with terminal content  
✅ **Text Integration**: Images can appear above/below text  
✅ **High Quality**: Full-color, high-resolution display  
✅ **Fast**: Efficient transmission and caching  
✅ **Standard**: Works across multiple terminal emulators

## Example Output

When you run `cc_computer_use` with action="screenshot", you'll see:

```
Screenshot captured

[IMAGE DISPLAYS HERE INLINE]

Screenshot captured (2048KB)
```

The actual screenshot appears directly in your terminal output!
