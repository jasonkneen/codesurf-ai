import { createSignal, onMount, onCleanup, createMemo } from "solid-js"
import { useTheme } from "@tui/context/theme"
import { createFrames, createColors, type KnightRiderOptions } from "@tui/ui/spinner"

export type LoadingBarVariant = "simple" | "knight-rider"

export interface LoadingBarProps {
  variant?: LoadingBarVariant
  /** Knight Rider options - only used when variant is "knight-rider" */
  knightRiderOptions?: KnightRiderOptions
}

/**
 * Simple loading bar - slides filled blocks across
 */
function SimpleLoadingBar() {
  const FRAMES = [
    "▱▱▱▱▱▱▱",
    "▱▱▱▱▱▱▱",
    "▱▱▱▱▱▱▱",
    "▱▱▱▱▱▱▱",
    "▰▱▱▱▱▱▱",
    "▰▰▱▱▱▱▱",
    "▰▰▰▱▱▱▱",
    "▱▰▰▰▱▱▱",
    "▱▱▰▰▰▱▱",
    "▱▱▱▰▰▰▱",
    "▱▱▱▱▰▰▰",
    "▱▱▱▱▱▰▰",
    "▱▱▱▱▱▱▰",
    "▱▱▱▱▱▱▱",
    "▱▱▱▱▱▱▱",
    "▱▱▱▱▱▱▱",
    "▱▱▱▱▱▱▱",
  ]
  const [frame, setFrame] = createSignal(0)

  onMount(() => {
    const timer = setInterval(() => {
      setFrame((frame() + 1) % FRAMES.length)
    }, 100)
    onCleanup(() => {
      clearInterval(timer)
    })
  })

  const { theme } = useTheme()
  return <text fg={theme.diffAdded}>{FRAMES[frame()]}</text>
}

/**
 * Knight Rider loading bar - sweeping animation with gradient trail
 *
 * Style options:
 * - "blocks": Pulsing square blocks (■ ⬝) - dev default, smoother animation
 * - "diamonds": Diamond shapes (⬥ ◆ ⬩ ⬪) - codesurf original style
 */
function KnightRiderLoadingBar(props: { options?: KnightRiderOptions }) {
  const { theme } = useTheme()

  const options = createMemo(() => ({
    width: 8,
    // Use "blocks" style (pulsing squares) from dev branch
    // Change to "diamonds" for original codesurf style (⬥ ◆ ⬩ ⬪)
    style: "blocks" as const,
    holdStart: 30,
    holdEnd: 9,
    // Original codesurf diamond style:
    // style: "diamonds" as const,
    inactiveFactor: 0.6,
    minAlpha: 0.3,
    ...props.options,
  }))

  const frames = createMemo(() => createFrames(options()))
  const colorGenerator = createMemo(() => createColors(options()))

  const [frameIndex, setFrameIndex] = createSignal(0)

  onMount(() => {
    const timer = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % frames().length)
    }, 50)
    onCleanup(() => clearInterval(timer))
  })

  const currentFrame = createMemo(() => frames()[frameIndex()])
  const totalFrames = createMemo(() => frames().length)

  return (
    <text>
      {currentFrame()
        .split("")
        .map((char, charIndex) => {
          const color = colorGenerator()(frameIndex(), charIndex, totalFrames(), currentFrame().length)
          return (
            <span style={{ fg: color }}>
              {char}
            </span>
          )
        })}
    </text>
  )
}

/**
 * Swappable LoadingBar component
 * - "simple": Original sliding blocks animation (green)
 * - "knight-rider": Red sweeping Knight Rider style animation
 */
export function LoadingBar(props: LoadingBarProps = {}) {
  const variant = () => props.variant ?? "knight-rider"

  return (
    <>
      {variant() === "simple" ? (
        <SimpleLoadingBar />
      ) : (
        <KnightRiderLoadingBar options={props.knightRiderOptions} />
      )}
    </>
  )
}

// Export individual components for direct use
export { SimpleLoadingBar, KnightRiderLoadingBar }
