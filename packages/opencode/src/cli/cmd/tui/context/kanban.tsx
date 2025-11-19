import { createSimpleContext } from "./helper"
import { createStore, produce } from "solid-js/store"
import { createEffect, createSignal, untrack } from "solid-js"
import path from "path"
import fs from "fs/promises"
import { randomUUID } from "node:crypto"

export type AccentKey = "primary" | "secondary" | "accent" | "warning" | "success" | "info" | "error"

export type KanbanCard = {
  id: string
  title: string
  summary: string
  owner: string
  eta: string
  tags: string[]
  points: number
  risk: "low" | "medium" | "high"
  blocked?: boolean
}

export type KanbanColumn = {
  id: string
  title: string
  subtitle: string
  accent: AccentKey
  focus: string
  wip: {
    current: number
    limit: number
  }
  cards: KanbanCard[]
}

export type BoardState = {
  columns: KanbanColumn[]
  focus: {
    column: number
    card: number
  }
}

const DEFAULT_COLUMNS: KanbanColumn[] = [
  {
    id: "ideas",
    title: "Backlog",
    subtitle: "Signals + research",
    accent: "info",
    focus: "Collect raw ideas",
    wip: { current: 0, limit: 6 },
    cards: [],
  },
  {
    id: "doing",
    title: "In Flight",
    subtitle: "Active focus streams",
    accent: "warning",
    focus: "Protect cadence, unblock fast",
    wip: { current: 0, limit: 4 },
    cards: [],
  },
  {
    id: "verify",
    title: "Review",
    subtitle: "QA + polish",
    accent: "accent",
    focus: "Guard rails + delight",
    wip: { current: 0, limit: 3 },
    cards: [],
  },
  {
    id: "done",
    title: "Shipped",
    subtitle: "Celebrations + learnings",
    accent: "success",
    focus: "Archive the work, capture lessons",
    wip: { current: 0, limit: 99 },
    cards: [],
  },
]

export const { use: useKanban, provider: KanbanProvider } = createSimpleContext({
  name: "Kanban",
  init: () => {
    const [board, setBoard] = createStore<BoardState>({
      columns: DEFAULT_COLUMNS,
      focus: { column: 1, card: 0 },
    })
    const [ready, setReady] = createSignal(false)

    // Project-local persistence
    const projectRoot = process.cwd()
    const hiddenDir = path.join(projectRoot, ".opencode")
    const dbPath = path.join(hiddenDir, "kanban.json")

    // Load data
    createEffect(async () => {
      try {
        // Ensure directory exists
        await fs.mkdir(hiddenDir, { recursive: true })

        const exists = await fs
          .access(dbPath)
          .then(() => true)
          .catch(() => false)

        if (exists) {
          const content = await fs.readFile(dbPath, "utf-8")
          const data = JSON.parse(content)
          if (data && data.columns) {
            setBoard("columns", data.columns)
            // Recalculate WIP limits just in case
            setBoard(
              produce((draft) => {
                draft.columns.forEach((col) => {
                  col.wip.current = col.cards.length
                })
              }),
            )
          }
        }
      } catch (e) {
        console.error("Failed to load kanban board:", e)
      } finally {
        setReady(true)
      }
    })

    // Save data on change (debounced slightly or just direct for now since FS is fast enough for this scale)
    const save = async (columns: KanbanColumn[]) => {
      try {
        await fs.mkdir(hiddenDir, { recursive: true })
        // Deep clone to remove proxies before stringifying
        const columnsData = JSON.parse(JSON.stringify(columns))
        await fs.writeFile(
          dbPath,
          JSON.stringify(
            {
              columns: columnsData,
            },
            null,
            2,
          ),
        )
      } catch (e) {
        console.error("Failed to save kanban board:", e)
      }
    }

    // Effect to trigger save
    createEffect(() => {
      if (!ready()) return
      // Access state to track dependency, untrack the save call itself
      // Use a specific key or map to avoid deep tracking issues
      const columns = board.columns
      // We need to ensure we're not saving while loading, but ready() handles that.
      // The issue might be accessing proxy objects inside async function or JSON.stringify
      // so we pass the data to save()
      save(columns)
    })

    const actions = {
      moveColumn: (delta: number) => {
        setBoard(
          produce((draft) => {
            if (draft.columns.length === 0) return
            const max = draft.columns.length
            const next = (draft.focus.column + delta + max) % max
            draft.focus.column = next
            const target = draft.columns[next]
            if (!target) return
            draft.focus.card = target.cards.length
              ? Math.min(Math.max(draft.focus.card, 0), target.cards.length - 1)
              : -1
          }),
        )
      },

      moveCardSelection: (delta: number) => {
        setBoard(
          produce((draft) => {
            const column = draft.columns[draft.focus.column]
            if (!column) return
            if (!column.cards.length) {
              draft.focus.card = -1
              return
            }
            const next = draft.focus.card + delta
            if (next < 0) {
              draft.focus.card = 0
              return
            }
            if (next >= column.cards.length) {
              draft.focus.card = column.cards.length - 1
              return
            }
            draft.focus.card = next
          }),
        )
      },

      shiftCard: (direction: number) => {
        setBoard(
          produce((draft) => {
            const fromColumn = draft.columns[draft.focus.column]
            if (!fromColumn) return
            if (!fromColumn.cards.length) return

            // Check bounds
            const targetIndex = draft.focus.column + direction
            if (targetIndex < 0) return
            if (targetIndex >= draft.columns.length) return

            // Move card - use explicit array filtering to ensure reactivity triggers
            const cardProxy = fromColumn.cards[draft.focus.card]
            if (!cardProxy) return

            // Clone to detach from proxy
            const card = JSON.parse(JSON.stringify(cardProxy))

            // Remove from source by creating new array
            fromColumn.cards = fromColumn.cards.filter((_, i) => i !== draft.focus.card)

            const toColumn = draft.columns[targetIndex]
            // Add to target
            toColumn.cards.unshift(card)

            // Update WIP
            fromColumn.wip.current = fromColumn.cards.length
            toColumn.wip.current = toColumn.cards.length

            // Follow focus
            draft.focus.column = targetIndex
            draft.focus.card = 0
          }),
        )
      },

      createCard: (columnId: string, card: Partial<KanbanCard>) => {
        setBoard(
          produce((draft) => {
            const colIndex = draft.columns.findIndex((c) => c.id === columnId)
            if (colIndex === -1) return
            const col = draft.columns[colIndex]

            col.cards.unshift({
              id: randomUUID(),
              title: card.title || "New Task",
              summary: card.summary || "",
              owner: card.owner || "You",
              eta: card.eta || "TBD",
              tags: card.tags || [],
              points: card.points || 1,
              risk: card.risk || "low",
              blocked: card.blocked || false,
            })
            col.wip.current = col.cards.length

            // Set focus to the new card
            draft.focus.column = colIndex
            draft.focus.card = 0
          }),
        )
      },

      focusCard: (columnIdx: number, cardIdx: number) => {
        setBoard(
          produce((draft) => {
            if (columnIdx >= 0 && columnIdx < draft.columns.length) {
              draft.focus.column = columnIdx
              const col = draft.columns[columnIdx]
              if (cardIdx >= 0 && cardIdx < col.cards.length) {
                draft.focus.card = cardIdx
              }
            }
          }),
        )
      },

      updateCard: (cardId: string, updates: Partial<KanbanCard>) => {
        setBoard(
          produce((draft) => {
            for (const col of draft.columns) {
              const card = col.cards.find((c) => c.id === cardId)
              if (card) {
                Object.assign(card, updates)
                return
              }
            }
          }),
        )
      },

      deleteCard: (cardId: string) => {
        setBoard(
          produce((draft) => {
            for (const col of draft.columns) {
              const idx = col.cards.findIndex((c) => c.id === cardId)
              if (idx !== -1) {
                col.cards.splice(idx, 1)
                col.wip.current = col.cards.length
                return
              }
            }
          }),
        )
      },
    }

    return {
      board,
      setBoard,
      actions,
      ready,
    }
  },
})
