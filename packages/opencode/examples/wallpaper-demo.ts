#!/usr/bin/env bun
/**
 * Kitty Graphics Wallpaper Demo
 *
 * Shows how to set a background wallpaper in your terminal using Kitty graphics.
 * Run with: bun examples/wallpaper-demo.ts
 */

import { setWallpaper, clearWallpaper, generateGradientWallpaper } from "../src/util/kitty-wallpaper"
import { supportsKittyGraphics } from "../src/util/kitty-graphics"

console.log("🖼️  Kitty Graphics Wallpaper Demo\n")

async function main() {
  // Check terminal support
  const supported = await supportsKittyGraphics()
  console.log(`Terminal support: ${supported ? "✓" : "✗"}`)
  console.log(`TERM: ${process.env.TERM}\n`)

  if (!supported) {
    console.log("⚠️  Your terminal doesn't support Kitty graphics")
    console.log("Continuing anyway for demonstration...\n")
  }

  console.log("Setting a background wallpaper...")
  console.log("The wallpaper will appear BEHIND this text!\n")

  // Generate a simple wallpaper (dark blue-ish)
  const wallpaper = await generateGradientWallpaper(100, 40, "dark", "blue")

  // Set it as wallpaper
  await setWallpaper({
    image: wallpaper,
    width: 80, // 80 columns wide
    height: 30, // 30 rows tall
    imageId: 999,
    mode: "fill",
  })

  console.log("✓ Wallpaper set!\n")
  console.log("╔═══════════════════════════════════════════════════════╗")
  console.log("║                                                       ║")
  console.log("║  You should see a subtle background color            ║")
  console.log("║  BEHIND this text box!                               ║")
  console.log("║                                                       ║")
  console.log("║  The magic is in the z-index: -1                     ║")
  console.log("║  This places the image BEHIND terminal text          ║")
  console.log("║                                                       ║")
  console.log("║  In OpenCode TUI, you could use this for:           ║")
  console.log("║  • Subtle branding (logo in corner)                  ║")
  console.log("║  • Theme backgrounds                                  ║")
  console.log("║  • Visual sections (different bg per panel)          ║")
  console.log("║  • Loading screens with graphics                     ║")
  console.log("║                                                       ║")
  console.log("╚═══════════════════════════════════════════════════════╝\n")

  console.log("Press Ctrl+C to exit (wallpaper will clear)\n")

  // Wait for user to see it
  await new Promise((resolve) => setTimeout(resolve, 30000))

  console.log("\nClearing wallpaper...")
  clearWallpaper(999)
  console.log("✓ Done!")
}

main().catch(console.error)
