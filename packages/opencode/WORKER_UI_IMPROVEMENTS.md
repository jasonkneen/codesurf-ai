# Background Workers UI Improvements

## Date: November 19, 2025

## Changes Made

### 1. Enhanced Footer Status Indicators

**File:** `src/cli/cmd/tui/routes/session/footer.tsx`

#### Improvements:
- **Richer Status Information**: Footer now shows detailed worker state including queue length, cache stats, and last validation result
- **Better Visual Feedback**: 
  - `Val●` - Validation running (green)
  - `Val✗` - Validation failed (red)
  - `Val(3)` - 3 items queued (accent)
  - `Val○` - Idle (muted)
- **Real-time Updates**: Status subscribes to Bus events and updates immediately
- **Click to Open**: Both indicators are clickable and open the improved WorkerDialog

#### Status Signals:
```typescript
validationStatus: {
  status: "idle" | "running" | "queued"
  queueLength: number
  lastResult?: "success" | "error"
}

prefetchStatus: {
  status: "idle" | "loading" | "queued"
  queueLength: number
  cacheSize: number
  cacheHits: number
}
```

### 2. Improved Background Workers Dialog

**File:** `src/cli/cmd/tui/routes/session/footer.tsx` (WorkerDialog component)

#### Features Added:

1. **Real-time Log Streaming**
   - Auto-refreshes every 500ms
   - Shows last 100 log lines
   - Toggleable auto-scroll mode

2. **Live Statistics Bar**
   - **Validation**: Queue length, total runs, success rate
   - **Prefetch**: Queue length, cache size, cache hits

3. **Enhanced Scrolling**
   - Scroll up/down by 5 lines at a time
   - Auto-scroll toggle `[Auto●]` / `[Auto○]`
   - Position indicator showing current view

4. **More Control Actions**
   - **Validation Tab**:
     - `[Enable/Disable]` - Toggle worker
     - `[Run Now]` - Execute validation immediately
     - `[Clear Queue]` - Empty pending tasks
   - **Prefetch Tab**:
     - `[Enable/Disable]` - Toggle worker
     - `[Clear Cache]` - Purge prefetch cache

5. **Configuration Display**
   - Shows active commands/strategies at bottom
   - Validation: displays `bun run lint, bun run typecheck, bun run codereview`
   - Prefetch: displays active strategies like `import, related`

6. **Better Visual Design**
   - Increased height from 16 to 20 lines
   - Status indicators show enabled state (●/○)
   - Color-coded tabs with bold highlighting
   - Stats display in header

### 3. Visual Indicators

#### Footer Status Icons:
| Icon | Meaning |
|------|---------|
| `Val●` | Validation actively running |
| `Val✗` | Last validation failed |
| `Val(N)` | N items in validation queue |
| `Val○` | Validation idle |
| `Pre●` | Prefetch actively loading |
| `Pre(N)` | N items in prefetch queue |
| `Pre✓` | Prefetch has cache hits |
| `Pre○` | Prefetch idle |

#### Dialog Color Coding:
- **Green (●)**: Active/enabled/success
- **Red (✗)**: Error/failed
- **Accent**: Queued/clickable actions
- **Muted**: Disabled/idle

### 4. User Experience Improvements

1. **No More Static Logs**: Dialog updates in real-time without reopening
2. **Queue Visibility**: Can see exactly how many tasks are pending
3. **Performance Metrics**: Success rate and cache hit stats visible at a glance
4. **Quick Actions**: Toggle workers, clear queues/cache without closing dialog
5. **Better Navigation**: ESC to close, scroll controls, auto-scroll toggle

## How to Use

### Opening the Dialog
Click on either `Val` or `Pre` indicator in the footer status bar.

### Tab Navigation
- Click `Validation` or `Prefetch` tab headers to switch views
- Each tab shows relevant logs and controls

### Scrolling Logs
- `[↓]` - Scroll down 5 lines (older logs)
- `[↑]` - Scroll up 5 lines (newer logs)
- `[Auto●]` - Auto-scroll enabled (always show latest)
- `[Auto○]` - Auto-scroll disabled (manual control)

### Controls
- `[Enable/Disable]` - Toggle current worker on/off
- `[Run Now]` - Force validation to run immediately (validation only)
- `[Clear Queue]` - Remove pending validation tasks
- `[Clear Cache]` - Purge prefetch cache
- `[ESC to Close]` - Close dialog

## Performance Impact

- **Minimal**: Dialog only updates when visible
- **500ms refresh**: Strikes balance between real-time and performance
- **Cleanup on close**: Interval cleared when dialog is dismissed
- **Efficient rendering**: Only visible log lines are rendered

## Future Enhancements

Potential improvements for next iteration:
- [ ] Filterable logs by log level (info/error/debug)
- [ ] Export logs to file
- [ ] Pause/resume workers without disabling
- [ ] Configurable debounce/refresh intervals
- [ ] Graph view of success rate over time
- [ ] Cache size visualizations
