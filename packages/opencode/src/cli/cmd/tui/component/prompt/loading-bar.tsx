import { createSignal, onMount, onCleanup } from "solid-js"
import { useTheme } from "@tui/context/theme"

export function LoadingBar() {
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
