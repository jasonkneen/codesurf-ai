import { createEffect, createSignal, onCleanup } from "solid-js"
import { useTheme } from "@tui/context/theme"

export function LoadingBar(props: { width?: number }) {
  const { theme } = useTheme()
  const barWidth = props.width ?? 16
  const [progress, setProgress] = createSignal(0)

  createEffect(() => {
    let intervalId: ReturnType<typeof setInterval>
    let startTime = Date.now()

    const tick = () => {
      const elapsed = Date.now() - startTime
      const cycle = 2000
      const position = (elapsed % cycle) / cycle
      const filledWidth = Math.floor(position * barWidth)
      setProgress(filledWidth)
    }

    intervalId = setInterval(tick, 50)

    onCleanup(() => {
      clearInterval(intervalId)
    })
  })

  const filled = Math.max(0, progress())
  const empty = Math.max(0, barWidth - filled)

  return (
    <text fg={theme.accent} wrapMode="none">
      {"=".repeat(filled)}
      {"□".repeat(empty)}
    </text>
  )
}
