/**
 * Kitty Graphics Wallpaper System
 *
 * Create background images/wallpapers in your TUI using the Kitty graphics protocol.
 * This places images BEHIND text using negative z-index.
 */

import { displayImage, supportsKittyGraphics } from "./kitty-graphics"
import { Log } from "./log"

const log = Log.create({ service: "kitty-wallpaper" })

export interface WallpaperOptions {
  /** Image data (PNG buffer or base64 string) */
  image: Buffer | string
  /** Width in terminal columns (default: full width) */
  width?: number
  /** Height in terminal rows (default: full height) */
  height?: number
  /** Opacity/transparency (0-100, default: 30 for subtle background) */
  opacity?: number
  /** Position: 'fill' | 'center' | 'tile' */
  mode?: "fill" | "center" | "tile"
  /** Image ID for reference */
  imageId?: number
}

/**
 * Set a wallpaper/background image
 * The image will be placed BEHIND text using z-index: -1
 */
export async function setWallpaper(options: WallpaperOptions): Promise<void> {
  const supported = await supportsKittyGraphics()
  if (!supported) {
    log.info("Terminal doesn't support Kitty graphics, skipping wallpaper")
    return
  }

  const { image, width = 100, height = 40, imageId = 1, mode = "fill" } = options

  try {
    // Create the wallpaper image with negative z-index
    // This places it BEHIND the text
    const escapeCode = displayImage(image, {
      width,
      height,
      imageId,
      zIndex: -1, // Behind text!
      quiet: true,
      moveCursor: false,
    })

    // Write to terminal
    if (typeof process !== "undefined" && process.stdout) {
      // Move cursor to top-left first
      process.stdout.write("\x1b[H") // Move to 0,0
      process.stdout.write(escapeCode)
      process.stdout.write("\x1b[H") // Move back to 0,0
    }

    log.info("Wallpaper set", { width, height, imageId, mode })
  } catch (error) {
    log.error("Failed to set wallpaper", { error })
  }
}

/**
 * Clear/remove wallpaper
 */
export function clearWallpaper(imageId: number = 1): void {
  // Send delete command for the image
  const deleteCode = `\x1b_Ga=d,d=i,i=${imageId}\x1b\\`

  if (typeof process !== "undefined" && process.stdout) {
    process.stdout.write(deleteCode)
  }

  log.info("Wallpaper cleared", { imageId })
}

/**
 * Generate a simple gradient wallpaper for testing
 */
export async function generateGradientWallpaper(
  width: number,
  height: number,
  color1: string,
  color2: string,
): Promise<Buffer> {
  // For demo purposes, create a simple colored PNG
  // In production, you'd use a library like 'sharp' or 'canvas' to create gradients

  // This returns a solid color for now
  const colorMap: Record<string, string> = {
    blue: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
    purple: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8j8HwAFPQJAY/xJ8QAAAABJRU5ErkJggg==",
    dark: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNgYGD4DwABBAEAW9JJPAAAAABJRU5ErkJggg==",
  }

  return Buffer.from(colorMap[color1] || colorMap.dark, "base64")
}

/**
 * Load wallpaper from file
 */
export async function loadWallpaperFromFile(filePath: string): Promise<Buffer> {
  try {
    const imageBuffer = await Bun.file(filePath).arrayBuffer()
    return Buffer.from(imageBuffer)
  } catch (error) {
    log.error("Failed to load wallpaper file", { filePath, error })
    throw error
  }
}

/**
 * Example usage:
 *
 * // Set a wallpaper
 * const wallpaper = await generateGradientWallpaper(100, 40, "blue", "purple")
 * await setWallpaper({ image: wallpaper, width: 100, height: 40 })
 *
 * // Or from a file
 * const customWallpaper = await loadWallpaperFromFile("./assets/bg.png")
 * await setWallpaper({ image: customWallpaper })
 *
 * // Clear it
 * clearWallpaper()
 */
