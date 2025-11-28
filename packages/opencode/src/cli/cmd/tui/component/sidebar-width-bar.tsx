import { createMemo } from "solid-js"
import { useTheme } from "../context/theme"
import { useRenderer } from "@opentui/solid"
import { RGBA } from "@opentui/core"

const BAR_CHAR = "▔" // Upper One Eighth Block - thin top bar

interface SidebarWidthBarProps {
  width: number
  minWidth: number
  maxWidth: number
  onShrink: () => void
  onGrow: () => void
  /** Which side the sidebar is on - affects click zones */
  side: "left" | "right"
}

export function SidebarWidthBar(props: SidebarWidthBarProps) {
  const { theme } = useTheme()
  const renderer = useRenderer()

  // Very dim color for inactive zones - much darker than border
  const dimColor = createMemo(() => {
    const border = theme.border
    if (border instanceof RGBA) {
      return RGBA.fromValues(border.r, border.g, border.b, border.a * 0.3)
    }
    return border
  })

  // Calculate proportions
  const range = createMemo(() => props.maxWidth - props.minWidth)
  const currentOffset = createMemo(() => props.width - props.minWidth)
  const percentage = createMemo(() => (range() > 0 ? currentOffset() / range() : 0.5))

  // The bar fills the full width, colored portion shows current % centered
  const coloredChars = createMemo(() => {
    const total = props.width
    const colored = Math.round(total * percentage())
    const dimmedEachSide = Math.floor((total - colored) / 2)
    return {
      leftDimmed: dimmedEachSide,
      colored: colored,
      rightDimmed: total - colored - dimmedEachSide,
    }
  })

  const canShrink = createMemo(() => props.width > props.minWidth)
  const canGrow = createMemo(() => props.width < props.maxWidth)

  const handleClick = (zone: "left" | "right") => {
    if (renderer.getSelection()?.getSelectedText()) return

    if (props.side === "left") {
      // Left sidebar: left zone = shrink, right zone = grow
      if (zone === "left" && canShrink()) props.onShrink()
      if (zone === "right" && canGrow()) props.onGrow()
    } else {
      // Right sidebar: left zone = grow, right zone = shrink
      if (zone === "left" && canGrow()) props.onGrow()
      if (zone === "right" && canShrink()) props.onShrink()
    }
  }

  const leftZoneActive = createMemo(() => (props.side === "left" ? canShrink() : canGrow()))
  const rightZoneActive = createMemo(() => (props.side === "left" ? canGrow() : canShrink()))

  // Dimmed zone color - slightly visible when active, very dim when inactive
  const leftDimColor = createMemo(() => (leftZoneActive() ? theme.border : dimColor()))
  const rightDimColor = createMemo(() => (rightZoneActive() ? theme.border : dimColor()))

  return (
    <box flexDirection="row" height={1} width={props.width}>
      {/* Left dimmed zone - clickable */}
      <text fg={leftDimColor()} onMouseUp={() => handleClick("left")}>
        {BAR_CHAR.repeat(coloredChars().leftDimmed)}
      </text>

      {/* Colored center zone - shows current width proportion */}
      <text fg={theme.accent}>{BAR_CHAR.repeat(coloredChars().colored)}</text>

      {/* Right dimmed zone - clickable */}
      <text fg={rightDimColor()} onMouseUp={() => handleClick("right")}>
        {BAR_CHAR.repeat(coloredChars().rightDimmed)}
      </text>
    </box>
  )
}
