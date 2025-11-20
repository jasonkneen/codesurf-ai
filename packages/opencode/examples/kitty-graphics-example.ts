#!/usr/bin/env bun
/**
 * Example: Using Kitty Graphics Protocol in OpenCode
 *
 * This demonstrates how to display images inline using the
 * Kitty graphics protocol in terminals that support it.
 */

import { displayImage, supportsKittyGraphics, getWindowSize } from "../src/util/kitty-graphics"

async function example() {
  // 1. Check if terminal supports Kitty graphics
  console.log("=== Kitty Graphics Protocol Example ===\n")

  const supported = await supportsKittyGraphics()
  console.log(`Terminal support: ${supported ? "✓" : "✗"}`)
  console.log(`TERM: ${process.env.TERM}`)
  console.log(`TERM_PROGRAM: ${process.env.TERM_PROGRAM}\n`)

  // 2. Get terminal dimensions
  const size = await getWindowSize()
  if (size) {
    console.log(`Terminal: ${size.cols}x${size.rows} cells`)
    console.log(`Window: ${size.widthPx}x${size.heightPx} pixels\n`)
  }

  // 3. Create a simple test image (1x1 red pixel PNG)
  // This is the smallest valid PNG file
  const redPixelPNG = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==",
    "base64",
  )

  console.log("Displaying a red pixel...\n")

  // 4. Display it (10 columns wide will stretch the 1x1 pixel)
  const escapeCode = displayImage(redPixelPNG, {
    width: 10,
    height: 5,
    quiet: true,
  })

  // 5. Write to stdout
  process.stdout.write(escapeCode)
  process.stdout.write("\n\n")

  console.log("✓ If you saw a red rectangle above, it worked!")
  console.log("\nTo use in your code:")
  console.log("  import { displayImage } from './src/util/kitty-graphics'")
  console.log("  const escape = displayImage(imageBuffer, { width: 60 })")
  console.log("  process.stdout.write(escape)")
}

example()
