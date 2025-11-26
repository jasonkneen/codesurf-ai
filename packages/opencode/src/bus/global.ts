import { EventEmitter } from "events"

export const GlobalBus = new EventEmitter<{
  event: [
    {
      directory: string
      payload: any
    },
  ]
}>()

// Increase max listeners to prevent memory leak warnings
// Multiple TUI components subscribe to the event bus
GlobalBus.setMaxListeners(100)
