/**
 * Kitty Graphics Icon Button System
 *
 * Demonstrates how to create clickable graphical buttons using:
 * 1. Kitty graphics protocol for the visual
 * 2. Unicode placeholders to embed in TUI
 * 3. Mouse event handlers for clicks
 */

import { displayImage } from "./kitty-graphics"

/**
 * Generate a simple button PNG (for demo purposes)
 * In production, you'd use actual SVG icons rendered to PNG
 */
export async function generateButtonImage(width: number, height: number, color: string): Promise<Buffer> {
  // For demo, we use a minimal 1x1 colored pixel PNG
  // The terminal will stretch it to fill the width/height
  const colorMap: Record<string, string> = {
    blue: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
    green: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    red: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==",
    yellow: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8j4HwAFPQJAY/xJ8QAAAABJRU5ErkJggg==",
  }

  return Buffer.from(colorMap[color] || colorMap.blue, "base64")
}

/**
 * Send a graphical button image to the terminal
 * Returns the escape code sequence
 */
export async function createGraphicalButton(options: {
  width: number
  height: number
  color: string
  imageId: number
}): Promise<string> {
  const { width, height, color, imageId } = options

  const imageBuffer = await generateButtonImage(width * 8, height * 16, color)

  // Create the image with a specific ID so we can reference it
  const escapeCode = displayImage(imageBuffer, {
    width,
    height,
    imageId,
    placementId: imageId,
    quiet: true,
  })

  return escapeCode
}

/**
 * Button state tracker for click detection
 */
export interface GraphicalButton {
  id: number
  x: number
  y: number
  width: number
  height: number
  color: string
  label: string
  onClick: () => void
}

export class GraphicalButtonManager {
  private buttons: Map<number, GraphicalButton> = new Map()
  private nextId = 100 // Start at 100 to avoid conflicts

  /**
   * Register a new graphical button
   */
  async addButton(button: Omit<GraphicalButton, "id">): Promise<number> {
    const id = this.nextId++
    const fullButton = { ...button, id }

    this.buttons.set(id, fullButton)

    // Generate and send the image
    const escapeCode = await createGraphicalButton({
      width: button.width,
      height: button.height,
      color: button.color,
      imageId: id,
    })

    // Write to terminal
    if (typeof process !== "undefined" && process.stdout) {
      process.stdout.write(escapeCode)
    }

    return id
  }

  /**
   * Remove a button
   */
  removeButton(id: number): void {
    this.buttons.delete(id)
    // Could send delete command to terminal here
  }

  /**
   * Handle a mouse click at cell coordinates
   * Returns true if a button was clicked
   */
  handleClick(col: number, row: number): boolean {
    for (const button of this.buttons.values()) {
      if (col >= button.x && col < button.x + button.width && row >= button.y && row < button.y + button.height) {
        button.onClick()
        return true
      }
    }
    return false
  }

  /**
   * Get button at position (for hover effects, etc)
   */
  getButtonAt(col: number, row: number): GraphicalButton | undefined {
    for (const button of this.buttons.values()) {
      if (col >= button.x && col < button.x + button.width && row >= button.y && row < button.y + button.height) {
        return button
      }
    }
    return undefined
  }

  /**
   * Get all buttons
   */
  getAllButtons(): GraphicalButton[] {
    return Array.from(this.buttons.values())
  }
}

/**
 * Global button manager instance
 */
export const buttonManager = new GraphicalButtonManager()

/**
 * Render placeholder text for a button
 * This is what gets rendered in the TUI at the button's position
 */
export function renderButtonPlaceholder(button: GraphicalButton): string {
  // For now, render the label as fallback
  // In a full implementation, this would render Unicode placeholders
  return `[${button.label}]`
}
