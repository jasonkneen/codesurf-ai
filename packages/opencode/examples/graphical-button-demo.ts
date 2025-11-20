#!/usr/bin/env bun
/**
 * Graphical Button Demo using Kitty Graphics Protocol
 *
 * This demonstrates how to create clickable graphical buttons
 * in a TUI using the Kitty graphics protocol.
 *
 * Run with: bun examples/graphical-button-demo.ts
 */

import { buttonManager } from "../src/util/kitty-icon-button"
import { supportsKittyGraphics } from "../src/util/kitty-graphics"

console.log("🎨 Graphical Button Demo\n")

async function main() {
  // Check terminal support
  const supported = await supportsKittyGraphics()
  console.log(`Terminal support: ${supported ? "✓" : "✗"}`)
  console.log(`TERM: ${process.env.TERM}\n`)

  if (!supported) {
    console.log("⚠️  Your terminal doesn't support Kitty graphics")
    console.log("Continuing anyway for demonstration...\n")
  }

  // Create some graphical buttons
  console.log("Creating graphical buttons...\n")

  const button1 = await buttonManager.addButton({
    x: 5,
    y: 3,
    width: 4,
    height: 2,
    color: "blue",
    label: "Save",
    onClick: () => console.log("\n✓ Save button clicked!"),
  })

  const button2 = await buttonManager.addButton({
    x: 10,
    y: 3,
    width: 4,
    height: 2,
    color: "green",
    label: "Run",
    onClick: () => console.log("\n✓ Run button clicked!"),
  })

  const button3 = await buttonManager.addButton({
    x: 15,
    y: 3,
    width: 4,
    height: 2,
    color: "red",
    label: "Stop",
    onClick: () => console.log("\n✓ Stop button clicked!"),
  })

  console.log("Created 3 graphical buttons:")
  console.log(`  - Blue "Save" button at (5, 3) - ID: ${button1}`)
  console.log(`  - Green "Run" button at (10, 3) - ID: ${button2}`)
  console.log(`  - Red "Stop" button at (15, 3) - ID: ${button3}`)
  console.log()

  // Simulate the terminal layout
  console.log("Terminal layout:")
  console.log("┌─────────────────────────────────┐")
  console.log("│                                 │")
  console.log("│                                 │")
  console.log("│    [Save] [Run]  [Stop]         │  ← Row 3")
  console.log("│     ^ 5    ^ 10   ^ 15          │")
  console.log("│                                 │")
  console.log("└─────────────────────────────────┘")
  console.log()

  // Show how click detection works
  console.log("Click detection examples:")

  const testClicks = [
    { col: 6, row: 3, expected: "Save" },
    { col: 11, row: 3, expected: "Run" },
    { col: 16, row: 3, expected: "Stop" },
    { col: 0, row: 0, expected: "none" },
  ]

  for (const test of testClicks) {
    const button = buttonManager.getButtonAt(test.col, test.row)
    const result = button ? button.label : "none"
    const icon = result === test.expected ? "✓" : "✗"
    console.log(`  ${icon} Click at (${test.col}, ${test.row}) → ${result}`)
  }

  console.log()

  // Show how to integrate with a TUI
  console.log("Integration with TUI:")
  console.log("─────────────────────────────────")
  console.log(`
In your TUI component (e.g., sidebar.tsx):

1. Import the button manager:
   import { buttonManager } from '@/util/kitty-icon-button'

2. Create buttons on mount:
   createEffect(async () => {
     await buttonManager.addButton({
       x: 2, y: 5,
       width: 4, height: 2,
       color: "blue",
       label: "Action",
       onClick: () => handleAction()
     })
   })

3. Handle mouse events:
   const handleMouseClick = (col: number, row: number) => {
     if (buttonManager.handleClick(col, row)) {
       return // Button was clicked
     }
     // Handle other clicks...
   }

4. Render placeholder (for terminals without Kitty support):
   <text x={button.x} y={button.y}>
     [{button.label}]
   </text>

The actual graphical button will overlay the placeholder
in terminals that support Kitty graphics!
  `)

  console.log("─────────────────────────────────\n")

  // Show all registered buttons
  console.log("Registered buttons:")
  for (const button of buttonManager.getAllButtons()) {
    console.log(`  ID ${button.id}: "${button.label}" at (${button.x}, ${button.y}) - ${button.color}`)
  }
}

main()
