import type {
  Message,
  Agent,
  Provider,
  Session,
  Part,
  Config,
  Todo,
  Command,
  Permission,
  LspStatus,
  McpStatus,
  FormatterStatus,
  SessionStatus,
  ProviderListResponse,
  ProviderAuthMethod,
  VcsInfo,
} from "@opencode-ai/sdk"
import { createStore, produce, reconcile } from "solid-js/store"
import { useSDK } from "@tui/context/sdk"
import { Binary } from "@/util/binary"
import { createSimpleContext } from "./helper"
import type { Snapshot } from "@/snapshot"
import { useExit } from "./exit"
import { batch, createEffect } from "solid-js"
import { Log } from "@/util/log"

export const { use: useSync, provider: SyncProvider } = createSimpleContext({
  name: "Sync",
  init: () => {
    const [store, setStore] = createStore<{
      ready: boolean
      status: "loading" | "partial" | "complete"
      provider: Provider[]
      provider_default: Record<string, string>
      provider_next: { all: Provider[] }
      provider_auth: Record<string, Array<{ type: string; label: string }>>
      agent: Agent[]
      command: Command[]
      permission: {
        [sessionID: string]: Permission[]
      }
      config: Config
      session: Session[]
      session_status: {
        [sessionID: string]: SessionStatus
      }
      session_diff: {
        [sessionID: string]: Snapshot.FileDiff[]
      }
      todo: {
        [sessionID: string]: Todo[]
      }
      message: {
        [sessionID: string]: Message[]
      }
      part: {
        [messageID: string]: Part[]
      }
      lsp: LspStatus[]
      mcp: {
        [key: string]: McpStatus
      }
      formatter: FormatterStatus[]
      plugin: Array<{
        name: string
        path: string
        status: "loaded"
      }>
      vcs: VcsInfo | undefined
    }>({
      config: {},
      ready: false,
      status: "loading",
      agent: [],
      permission: {},
      command: [],
      provider: [],
      provider_default: {},
      provider_next: { all: [] },
      provider_auth: {},
      session: [],
      session_status: {},
      session_diff: {},
      todo: {},
      message: {},
      part: {},
      lsp: [],
      mcp: {},
      formatter: [],
      plugin: [],
      vcs: undefined,
    })

    // Throttle part updates to prevent excessive re-renders during streaming
    const pendingPartUpdates = new Map<string, Part>()
    let partUpdateTimer: NodeJS.Timeout | null = null
    const PART_UPDATE_THROTTLE_MS = 50 // Reduce flicker during streaming

    const flushPartUpdates = () => {
      if (pendingPartUpdates.size === 0) return
      batch(() => {
        for (const [key, part] of pendingPartUpdates.entries()) {
          const parts = store.part[part.messageID]
          if (!parts) {
            setStore("part", part.messageID, [part])
            continue
          }
          const result = Binary.search(parts, part.id, (p) => p.id)
          if (result.found) {
            setStore("part", part.messageID, result.index, reconcile(part))
          } else {
            setStore(
              "part",
              part.messageID,
              produce((draft) => {
                draft.splice(result.index, 0, part)
              }),
            )
          }
        }
      })
      pendingPartUpdates.clear()
    }

    const sdk = useSDK()

    sdk.event.listen((e) => {
      const event = e.details
      try {
      switch (event.type) {
        case "permission.updated": {
          // Sanitize permission to ensure title is a string
          const sanitizedPermission = {
            ...event.properties,
            title: String(event.properties.title || ""),
          }

          const permissions = store.permission[event.properties.sessionID]
          if (!permissions) {
            setStore("permission", event.properties.sessionID, [sanitizedPermission])
            break
          }
          const match = Binary.search(permissions, event.properties.id, (p) => p.id)
          setStore(
            "permission",
            event.properties.sessionID,
            produce((draft) => {
              if (match.found) {
                draft[match.index] = sanitizedPermission
                return
              }
              draft.push(sanitizedPermission)
            }),
          )
          break
        }

        case "permission.replied": {
          const permissions = store.permission[event.properties.sessionID]
          const match = Binary.search(permissions, event.properties.permissionID, (p) => p.id)
          if (!match.found) break
          setStore(
            "permission",
            event.properties.sessionID,
            produce((draft) => {
              draft.splice(match.index, 1)
            }),
          )
          break
        }

        case "todo.updated": {
          const validTodos = (event.properties.todos || []).map((todo) => ({
            ...todo,
            content: String(todo.content || ""),
          }))
          setStore("todo", event.properties.sessionID, validTodos)
          break
        }

        case "session.diff":
          setStore("session_diff", event.properties.sessionID, event.properties.diff)
          break

        case "session.deleted": {
          const result = Binary.search(store.session, event.properties.info.id, (s) => s.id)
          if (result.found) {
            setStore(
              "session",
              produce((draft) => {
                draft.splice(result.index, 1)
              }),
            )
          }
          break
        }
        case "session.updated": {
          const result = Binary.search(store.session, event.properties.info.id, (s) => s.id)
          if (result.found) {
            setStore("session", result.index, reconcile(event.properties.info))
            break
          }
          setStore(
            "session",
            produce((draft) => {
              draft.splice(result.index, 0, event.properties.info)
            }),
          )
          break
        }

        case "session.status": {
          setStore("session_status", event.properties.sessionID, event.properties.status)
          break
        }
        case "message.updated": {
          const messages = store.message[event.properties.info.sessionID]
          if (!messages) {
            setStore("message", event.properties.info.sessionID, [event.properties.info])
            break
          }
          const result = Binary.search(messages, event.properties.info.id, (m) => m.id)
          if (result.found) {
            // Batch message updates to reduce re-renders
            batch(() => {
              setStore("message", event.properties.info.sessionID, result.index, reconcile(event.properties.info))
            })
            break
          }
          batch(() => {
            setStore(
              "message",
              event.properties.info.sessionID,
              produce((draft) => {
                draft.splice(result.index, 0, event.properties.info)
                if (draft.length > 100) draft.shift()
              }),
            )
          })
          break
        }
        case "message.removed": {
          const messages = store.message[event.properties.sessionID]
          if (!messages) break
          const result = Binary.search(messages, event.properties.messageID, (m) => m.id)
          if (result.found) {
            setStore(
              "message",
              event.properties.sessionID,
              produce((draft) => {
                draft.splice(result.index, 1)
              }),
            )
          }
          break
        }
        case "message.part.updated": {
          // Throttle part updates to prevent flickering during fast streaming
          const part = event.properties.part
          const key = `${part.messageID}:${part.id}`
          pendingPartUpdates.set(key, part)

          if (partUpdateTimer) {
            clearTimeout(partUpdateTimer)
          }

          partUpdateTimer = setTimeout(() => {
            flushPartUpdates()
            partUpdateTimer = null
          }, PART_UPDATE_THROTTLE_MS)
          break
        }

        case "message.part.removed": {
          const parts = store.part[event.properties.messageID]
          if (!parts) break
          const result = Binary.search(parts, event.properties.partID, (p) => p.id)
          if (result.found)
            setStore(
              "part",
              event.properties.messageID,
              produce((draft) => {
                draft.splice(result.index, 1)
              }),
            )
          break
        }

        case "lsp.updated": {
          sdk.client.lsp.status().then((x) => setStore("lsp", x.data!))
          break
        }

        case "vcs.branch.updated": {
          setStore("vcs", { branch: event.properties.branch })
          break
        }
      }
      } catch (err) {
        console.error("[Sync] Event handler error:", event.type, err)
      }
    })

    const exit = useExit()

    createEffect(() => {
      Promise.all([
        sdk.client.config.providers({ throwOnError: true }).then((x) => {
          batch(() => {
            setStore("provider", x.data!.providers)
            setStore("provider_default", x.data!.default)
            setStore("provider_next", { all: x.data!.providers })
          })
        }),
        sdk.client.app.agents({ throwOnError: true }).then((x) => setStore("agent", x.data ?? [])),
        sdk.client.config.get({ throwOnError: true }).then((x) => setStore("config", x.data!)),
      ])
        .then(() => {
          setStore("status", "partial")
          setStore("ready", true)
          return Promise.all([
            sdk.client.session.list().then((x) => {
              const sessions = Array.isArray(x.data) ? x.data : []
              setStore(
                "session",
                sessions.toSorted((a, b) => a.id.localeCompare(b.id)),
              )
            }),
            sdk.client.command.list().then((x) => setStore("command", x.data ?? [])),
            sdk.client.lsp.status().then((x) => setStore("lsp", x.data!)),
            sdk.client.mcp.status().then((x) => setStore("mcp", x.data!)),
            sdk.client.formatter.status().then((x) => setStore("formatter", x.data!)),
            sdk.client.session.status().then((x) => setStore("session_status", x.data!)),
            sdk.client.provider.auth().then((x) => setStore("provider_auth", x.data ?? {})),
            sdk.client.vcs.get().then((x) => setStore("vcs", x.data)),
            fetch(`${sdk.url}/plugins`)
              .then((r) => r.json())
              .then((x) => setStore("plugin", x ?? []))
              .catch(() => setStore("plugin", [])),
          ]).then(() => {
            setStore("status", "complete")
          })
        })
        .catch(async (e) => {
          Log.Default.error("tui bootstrap failed", {
            error: e instanceof Error ? e.message : String(e),
            name: e instanceof Error ? e.name : undefined,
            stack: e instanceof Error ? e.stack : undefined,
          })
          await exit(e)
        })
    })

    const fullSyncedSessions = new Set<string>()
    const result = {
      data: store,
      set: setStore,
      get ready() {
        return store.ready
      },
      session: {
        get(sessionID: string) {
          const match = Binary.search(store.session, sessionID, (s) => s.id)
          if (match.found) return store.session[match.index]
          return undefined
        },
        status(sessionID: string) {
          const session = result.session.get(sessionID)
          if (!session) return "idle"
          if (session.time.compacting) return "compacting"
          const messages = store.message[sessionID] ?? []
          const last = messages.at(-1)
          if (!last) return "idle"
          if (last.role === "user") return "working"
          return last.time.completed ? "idle" : "working"
        },
        async sync(sessionID: string, options?: { force?: boolean }) {
          if (fullSyncedSessions.has(sessionID) && !options?.force) return
          const [session, messages, todo, diff] = await Promise.all([
            sdk.client.session.get({ path: { id: sessionID }, throwOnError: true }),
            sdk.client.session.messages({ path: { id: sessionID }, query: { limit: 100 } }),
            sdk.client.session.getTodo({ path: { id: sessionID } }),
            sdk.client.session.diff({ path: { id: sessionID } }),
          ])
          // Use batch to ensure atomic update and prevent "Anchor does not exist" errors
          batch(() => {
            setStore(
              produce((draft) => {
                const match = Binary.search(draft.session, sessionID, (s) => s.id)
                if (match.found) draft.session[match.index] = session.data!
                if (!match.found) draft.session.splice(match.index, 0, session.data!)
                draft.todo[sessionID] = todo.data ?? []

                // Only update messages if we got data back (prevent clearing on empty response)
                if (messages.data && messages.data.length >= 0) {
                  draft.message[sessionID] = messages.data.map((x) => x.info)
                  for (const message of messages.data) {
                    draft.part[message.info.id] = message.parts
                  }
                }
                draft.session_diff[sessionID] = diff.data ?? []
              }),
            )
          })
          fullSyncedSessions.add(sessionID)
        },
      },
    }
    return result
  },
})
