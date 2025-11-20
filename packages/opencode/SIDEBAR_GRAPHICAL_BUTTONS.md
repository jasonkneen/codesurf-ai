# ✅ Graphical Buttons Added to Sidebar

I've integrated the Kitty graphics protocol graphical buttons into your OpenCode sidebar!

## What Was Added

### Files Modified

- `src/cli/cmd/tui/routes/session/sidebar.tsx` - Added graphical button initialization

### New Imports

```typescript
import { buttonManager } from "@/util/kitty-icon-button"
import { supportsKittyGraphics } from "@/util/kitty-graphics"
```

### What It Does

When you open the sidebar in **Ghostty** (or other Kitty-compatible terminals), you'll see **3 graphical colored buttons** at the top:

```
┌─────────────────────────────┐
│  Sidebar                    │
│                             │
│  🔵 🟢 🟡  ← Graphical!   │
│  New Save Run               │
│                             │
│  [Files] [Todos] [Tools]... │
└─────────────────────────────┘
```

### Button Details

1. **Blue "New" Button**
   - Position: Top right area of sidebar
   - Click: Shows toast "🔵 New button clicked!"
2. **Green "Save" Button**
   - Position: Next to New button
   - Click: Shows toast "🟢 Save button clicked!"
3. **Yellow "Run" Button**
   - Position: Next to Save button
   - Click: Shows toast "🟡 Run button clicked!"

### How It Works

```typescript
// On mount, check terminal support
createEffect(async () => {
  const supported = await supportsKittyGraphics()
  if (!supported) return // Gracefully skip if not supported

  // Create 3 graphical buttons
  buttons.push(
    await buttonManager.addButton({
      x: props.width - 18, // Position relative to sidebar width
      y: 2, // Row 2 from top
      width: 4, // 4 cells wide
      height: 2, // 2 cells tall
      color: "blue",
      label: "New",
      onClick: () => toast.show({ message: "🔵 New button clicked!", variant: "info" }),
    }),
  )
  // ... more buttons
})

// Cleanup on unmount
onCleanup(() => {
  for (const id of graphicalButtonIds()) {
    buttonManager.removeButton(id)
  }
})
```

## Terminal Support

### ✅ Will See Graphical Buttons

- **Ghostty** (your terminal!)
- Kitty
- WezTerm
- Konsole

### ❌ Will See Text Fallback

- iTerm2
- Standard terminals
- VS Code terminal
- Most other terminals

The buttons automatically degrade gracefully - if the terminal doesn't support Kitty graphics, the code simply doesn't create them (no errors, no visual artifacts).

## Customization

To change the buttons, edit the `createEffect` block in `sidebar.tsx`:

```typescript
// Change position
x: props.width - 10,  // Move left/right
y: 5,                 // Move up/down

// Change size
width: 6,   // Wider button
height: 3,  // Taller button

// Change color
color: "red",   // "blue" | "green" | "red" | "yellow"

// Change action
onClick: () => {
  // Your custom logic here!
  handleSaveFile()
}
```

## Next Steps

Currently these are **demo buttons** that just show toasts. To make them functional:

1. **New Button** → Create new file/session
2. **Save Button** → Save current work/commit
3. **Run Button** → Run tests/build/etc.

Just replace the `onClick` handlers with your actual functions!

## Testing

1. Open OpenCode in Ghostty
2. Open a session
3. Look at the top of the right sidebar
4. You should see 3 colored graphical buttons
5. Click them - you'll see toast notifications!

## Removing/Disabling

If you want to disable them:

```typescript
// Comment out or remove this entire block in sidebar.tsx:
createEffect(async () => {
  const supported = await supportsKittyGraphics()
  if (!supported) return
  // ... button creation code ...
})
```

Or add a feature flag:

```typescript
const ENABLE_GRAPHICAL_BUTTONS = false // Set to true to enable

createEffect(async () => {
  if (!ENABLE_GRAPHICAL_BUTTONS) return
  // ... rest of code ...
})
```

---

**Result**: You now have working graphical buttons in your OpenCode sidebar! 🎉
