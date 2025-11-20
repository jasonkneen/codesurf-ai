import { Log } from "./log"

const log = Log.create({ service: "kitty-graphics" })

/**
 * Kitty Graphics Protocol implementation
 * See: https://sw.kovidgoyal.net/kitty/graphics-protocol/
 */

interface KittyDisplayOptions {
  width?: number // columns
  height?: number // rows
  zIndex?: number
  imageId?: number
  placementId?: number
  quiet?: boolean // suppress terminal responses
  moveCursor?: boolean // move cursor after image (default: false)
}

/**
 * Check if terminal supports Kitty graphics protocol
 */
export async function supportsKittyGraphics(): Promise<boolean> {
  // Check TERM environment variable for known supporting terminals
  const term = process.env.TERM || ""
  const termProgram = process.env.TERM_PROGRAM || ""

  // Known terminals that support the protocol
  const supportedTerms = ["xterm-kitty", "xterm-ghostty", "kitty", "ghostty", "konsole", "wezterm", "wayst"]

  if (supportedTerms.some((t) => term.includes(t) || termProgram.toLowerCase().includes(t))) {
    return true
  }

  // Could also send a query action, but that requires async stdin reading
  // For now, we'll just check the TERM variable
  return false
}

/**
 * Display an image using Kitty graphics protocol
 *
 * @param imageData - PNG image data as Buffer or base64 string
 * @param options - Display options
 * @returns The escape codes to display the image
 */
export function displayImage(imageData: Buffer | string, options: KittyDisplayOptions = {}): string {
  const { width, height, zIndex = 0, imageId = 0, placementId = 0, quiet = false, moveCursor = false } = options

  // Convert Buffer to base64 if needed
  const base64Data = Buffer.isBuffer(imageData) ? imageData.toString("base64") : imageData

  // Build control data
  const controlParts: string[] = [
    "a=T", // transmit and display
    "f=100", // PNG format
  ]

  if (imageId > 0) controlParts.push(`i=${imageId}`)
  if (placementId > 0) controlParts.push(`p=${placementId}`)
  if (width) controlParts.push(`c=${width}`)
  if (height) controlParts.push(`r=${height}`)
  if (zIndex !== 0) controlParts.push(`z=${zIndex}`)
  if (quiet) controlParts.push("q=2") // suppress all responses

  // Control cursor movement after placement
  if (!moveCursor) {
    controlParts.push("C=1") // Don't move cursor
  }

  const chunks = chunkBase64(base64Data, 4096)
  const escapeSequences: string[] = []

  for (let i = 0; i < chunks.length; i++) {
    const isLast = i === chunks.length - 1
    const m = isLast ? 0 : 1

    if (i === 0) {
      // First chunk includes all control data
      escapeSequences.push(`\x1b_G${controlParts.join(",")},m=${m};${chunks[i]}\x1b\\`)
    } else {
      // Subsequent chunks only have m and payload
      escapeSequences.push(`\x1b_Gm=${m};${chunks[i]}\x1b\\`)
    }
  }

  let result = escapeSequences.join("")

  // If we disabled cursor movement but still want to see the image,
  // move cursor down manually
  if (!moveCursor && height) {
    // Move cursor down by the number of rows
    result += `\x1b[${height}B`
  }

  return result
}

/**
 * Display an image from a file path
 */
export async function displayImageFile(filePath: string, options: KittyDisplayOptions = {}): Promise<string> {
  try {
    const imageBuffer = await Bun.file(filePath).arrayBuffer()
    return displayImage(Buffer.from(imageBuffer), options)
  } catch (error) {
    log.error("failed to load image file", { filePath, error })
    throw error
  }
}

/**
 * Display an image with automatic cursor movement
 * This ensures the image is visible by moving the cursor down
 */
export function displayImageWithCursor(imageData: Buffer | string, options: KittyDisplayOptions = {}): string {
  const imageEscape = displayImage(imageData, { ...options, moveCursor: false })

  // Calculate approximate rows needed
  // If height specified, use that; otherwise estimate based on width
  // For screenshots, we need more vertical space
  const rows = options.height || Math.ceil((options.width || 60) * 0.6)

  // Move cursor down and add multiple newlines to ensure visibility
  return imageEscape + `\x1b[${rows}B` + "\n\n\n"
}

/**
 * Delete images
 */
export function deleteImages(options: {
  imageId?: number
  placementId?: number
  deleteAll?: boolean
  zIndex?: number
}): string {
  const { imageId, placementId, deleteAll, zIndex } = options

  const controlParts = ["a=d"]

  if (deleteAll) {
    controlParts.push("d=a")
  } else if (imageId !== undefined) {
    controlParts.push(`d=i,i=${imageId}`)
    if (placementId !== undefined) {
      controlParts.push(`p=${placementId}`)
    }
  } else if (zIndex !== undefined) {
    controlParts.push(`d=z,z=${zIndex}`)
  }

  return `\x1b_G${controlParts.join(",")}\x1b\\`
}

/**
 * Chunk base64 data into pieces suitable for transmission
 * Chunks must be multiples of 4 except the last one
 */
function chunkBase64(base64: string, maxChunkSize: number): string[] {
  const chunks: string[] = []
  let pos = 0

  while (pos < base64.length) {
    let chunkSize = Math.min(maxChunkSize, base64.length - pos)

    // Ensure chunk size is multiple of 4, except for the last chunk
    if (pos + chunkSize < base64.length) {
      chunkSize = Math.floor(chunkSize / 4) * 4
    }

    chunks.push(base64.substring(pos, pos + chunkSize))
    pos += chunkSize
  }

  return chunks
}

/**
 * Get terminal window size in pixels
 * Uses TIOCGWINSZ ioctl
 */
export async function getWindowSize(): Promise<{
  rows: number
  cols: number
  widthPx: number
  heightPx: number
  cellWidth: number
  cellHeight: number
} | null> {
  try {
    // Use stty to get terminal size
    const proc = Bun.spawn(["stty", "size"], {
      stdin: "inherit",
      stdout: "pipe",
    })
    const output = await new Response(proc.stdout).text()
    const [rows, cols] = output.trim().split(" ").map(Number)

    // Try to get pixel size using kitty icat
    try {
      const pixelProc = Bun.spawn(["kitten", "icat", "--print-window-size"], {
        stdout: "pipe",
      })
      const pixelOutput = await new Response(pixelProc.stdout).text()
      const [widthPx, heightPx] = pixelOutput.trim().split("x").map(Number)

      return {
        rows,
        cols,
        widthPx,
        heightPx,
        cellWidth: Math.floor(widthPx / cols),
        cellHeight: Math.floor(heightPx / rows),
      }
    } catch {
      // Fallback: assume common cell sizes
      return {
        rows,
        cols,
        widthPx: cols * 9,
        heightPx: rows * 18,
        cellWidth: 9,
        cellHeight: 18,
      }
    }
  } catch (error) {
    log.error("failed to get window size", { error })
    return null
  }
}
