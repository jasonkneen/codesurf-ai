export const AVAILABLE_TOOLS = [
  "bash",
  "read",
  "write",
  "edit",
  "list",
  "glob",
  "grep",
  "webfetch",
  "task",
  "todowrite",
  "todoread",
] as const

export type AvailableTool = typeof AVAILABLE_TOOLS[number]
