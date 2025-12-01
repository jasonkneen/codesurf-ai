import { createStore } from "solid-js/store"
import { batch, createEffect, createMemo } from "solid-js"
import { useSync } from "@tui/context/sync"
import { useTheme } from "@tui/context/theme"
import { uniqueBy } from "remeda"
import path from "path"
import { Global } from "@/global"
import { iife } from "@/util/iife"
import { createSimpleContext } from "./helper"
import { useToast } from "../ui/toast"
import { Provider } from "@/provider/provider"
import { useArgs } from "./args"
import { RGBA } from "@opentui/core"
import { Flag } from "@/flag/flag"

export const { use: useLocal, provider: LocalProvider } = createSimpleContext({
  name: "Local",
  init: () => {
    const sync = useSync()
    const toast = useToast()

    function isModelValid(model: { providerID: string; modelID: string }) {
      const provider = sync.data.provider.find((x) => x.id === model.providerID)
      return !!provider?.models[model.modelID]
    }

    function getFirstValidModel(...modelFns: (() => { providerID: string; modelID: string } | undefined)[]) {
      for (const modelFn of modelFns) {
        const model = modelFn()
        if (!model) continue
        if (isModelValid(model)) return model
      }
    }

    // Automatically update model when agent changes
    createEffect(() => {
      const value = agent.current()
      if (!value) return
      if (value.model) {
        if (isModelValid(value.model))
          model.set({
            providerID: value.model.providerID,
            modelID: value.model.modelID,
          })
        else
          toast.show({
            variant: "warning",
            message: `Agent ${value.name}'s configured model ${value.model.providerID}/${value.model.modelID} is not valid`,
            duration: 3000,
          })
      }
    })

    const agent = iife(() => {
      const agents = createMemo(() => sync.data.agent.filter((x) => x.mode !== "subagent"))
      const [agentStore, setAgentStore] = createStore<{
        current: string
      }>({
        current: agents()[0]?.name ?? "",
      })
      const { theme } = useTheme()
      const colors = createMemo(() => [
        theme.secondary,
        theme.accent,
        theme.success,
        theme.warning,
        theme.primary,
        theme.error,
      ])
      return {
        list() {
          return agents()
        },
        current() {
          return agents().find((x) => x.name === agentStore.current) ?? agents()[0]
        },
        set(name: string) {
          if (!agents().some((x) => x.name === name))
            return toast.show({
              variant: "warning",
              message: `Agent not found: ${name}`,
              duration: 3000,
            })
          setAgentStore("current", name)
        },
        move(direction: 1 | -1) {
          batch(() => {
            let next = agents().findIndex((x) => x.name === agentStore.current) + direction
            if (next < 0) next = agents().length - 1
            if (next >= agents().length) next = 0
            const value = agents()[next]
            setAgentStore("current", value.name)
          })
        },
        color(name: string) {
          const agent = agents().find((x) => x.name === name)
          if (agent?.color) return RGBA.fromHex(agent.color)
          const index = agents().findIndex((x) => x.name === name)
          if (index === -1) return colors()[0]
          return colors()[index % colors().length]
        },
      }
    })

    const model = iife(() => {
      const [modelStore, setModelStore] = createStore<{
        ready: boolean
        model: Record<
          string,
          {
            providerID: string
            modelID: string
          }
        >
        recent: {
          providerID: string
          modelID: string
        }[]
        favorite: {
          providerID: string
          modelID: string
        }[]
      }>({
        ready: false,
        model: {},
        recent: [],
        favorite: [],
      })

      const file = Bun.file(path.join(Global.Path.state, "model.json"))

      function save() {
        Bun.write(
          file,
          JSON.stringify({
            recent: modelStore.recent,
            favorite: modelStore.favorite,
          }),
        )
      }

      file
        .json()
        .then((x) => {
          if (Array.isArray(x.recent)) setModelStore("recent", x.recent)
          if (Array.isArray(x.favorite)) setModelStore("favorite", x.favorite)
        })
        .catch(() => {})
        .finally(() => {
          setModelStore("ready", true)
        })

      const args = useArgs()
      const fallbackModel = createMemo(() => {
        if (args.model) {
          const { providerID, modelID } = Provider.parseModel(args.model)
          if (isModelValid({ providerID, modelID })) {
            return {
              providerID,
              modelID,
            }
          }
        }

        if (sync.data.config.model) {
          const { providerID, modelID } = Provider.parseModel(sync.data.config.model)
          if (isModelValid({ providerID, modelID })) {
            return {
              providerID,
              modelID,
            }
          }
        }

        for (const item of modelStore.recent) {
          if (isModelValid(item)) {
            return item
          }
        }
        const provider = sync.data.provider[0]
        if (!provider) return undefined
        const model = sync.data.provider_default[provider.id] ?? Object.values(provider.models)[0].id
        if (!model) return undefined
        return {
          providerID: provider.id,
          modelID: model,
        }
      })

      const currentModel = createMemo(() => {
        const a = agent.current()
        if (!a) return fallbackModel()
        return getFirstValidModel(
          () => modelStore.model[a.name],
          () => a.model,
          fallbackModel,
        )!
      })

      return {
        current: currentModel,
        get ready() {
          return modelStore.ready
        },
        recent() {
          return modelStore.recent
        },
        favorite() {
          return modelStore.favorite
        },
        parsed: createMemo(() => {
          const value = currentModel()
          if (!value) return undefined
          const provider = sync.data.provider.find((x) => x.id === value.providerID)
          if (!provider) return undefined
          const model = provider.models[value.modelID]
          return {
            provider: provider.name ?? value.providerID,
            model: model?.name ?? value.modelID,
          }
        }),
        cycle(direction: 1 | -1) {
          const current = currentModel()
          if (!current) return
          const recent = modelStore.recent
          const index = recent.findIndex((x) => x.providerID === current.providerID && x.modelID === current.modelID)
          if (index === -1) return
          let next = index + direction
          if (next < 0) next = recent.length - 1
          if (next >= recent.length) next = 0
          const val = recent[next]
          if (!val) return
          const currentAgent = agent.current()
          if (!currentAgent) return
          setModelStore("model", currentAgent.name, { ...val })
        },
        cycleFavorite(direction: 1 | -1) {
          const favorites = modelStore.favorite.filter((item) => isModelValid(item))
          if (!favorites.length) {
            toast.show({
              variant: "info",
              message: "Add a favorite model to use this shortcut",
              duration: 3000,
            })
            return
          }
          const current = currentModel()
          let index = favorites.findIndex((x) => x.providerID === current.providerID && x.modelID === current.modelID)
          if (index === -1) {
            index = direction === 1 ? 0 : favorites.length - 1
          } else {
            index += direction
            if (index < 0) index = favorites.length - 1
            if (index >= favorites.length) index = 0
          }
          const next = favorites[index]
          if (!next) return
          setModelStore("model", agent.current().name, { ...next })
          const uniq = uniqueBy([next, ...modelStore.recent], (x) => x.providerID + x.modelID)
          if (uniq.length > 10) uniq.pop()
          setModelStore("recent", uniq)
          save()
        },
        set(model: { providerID: string; modelID: string }, options?: { recent?: boolean }) {
          batch(() => {
            if (!isModelValid(model)) {
              toast.show({
                message: `Model ${model.providerID}/${model.modelID} is not valid`,
                variant: "warning",
                duration: 3000,
              })
              return
            }
            const currentAgent = agent.current()
            if (!currentAgent) return
            setModelStore("model", currentAgent.name, model)
            if (options?.recent) {
              const uniq = uniqueBy([model, ...modelStore.recent], (x) => x.providerID + x.modelID)
              if (uniq.length > 10) uniq.pop()
              setModelStore("recent", uniq)
              save()
            }
          })
        },
        toggleFavorite(model: { providerID: string; modelID: string }) {
          batch(() => {
            if (!isModelValid(model)) {
              toast.show({
                message: `Model ${model.providerID}/${model.modelID} is not valid`,
                variant: "warning",
                duration: 3000,
              })
              return
            }
            const exists = modelStore.favorite.some(
              (x) => x.providerID === model.providerID && x.modelID === model.modelID,
            )
            const next = exists
              ? modelStore.favorite.filter((x) => x.providerID !== model.providerID || x.modelID !== model.modelID)
              : [model, ...modelStore.favorite]
            setModelStore("favorite", next)
            save()
          })
        },
      }
    })

    // Intelligent Context Settings
    const contextSettings = iife(() => {
      const [contextStore, setContextStore] = createStore<{
        ready: boolean
        enabled: boolean
        threshold: number // 0.0 - 1.0
        decayRate: number // 0.0 - 1.0
        cacheTTL: number // ms
      }>({
        ready: false,
        enabled: Flag.OPENCODE_INTELLIGENT_CONTEXT,
        threshold: Flag.OPENCODE_CONTEXT_THRESHOLD,
        decayRate: Flag.OPENCODE_CONTEXT_DECAY_RATE,
        cacheTTL: Flag.OPENCODE_CONTEXT_CACHE_TTL,
      })

      const file = Bun.file(path.join(Global.Path.state, "context-settings.json"))

      function save() {
        Bun.write(
          file,
          JSON.stringify({
            enabled: contextStore.enabled,
            threshold: contextStore.threshold,
            decayRate: contextStore.decayRate,
            cacheTTL: contextStore.cacheTTL,
          }),
        )
      }

      file
        .json()
        .then((x) => {
          if (typeof x.enabled === "boolean") setContextStore("enabled", x.enabled)
          if (typeof x.threshold === "number") setContextStore("threshold", x.threshold)
          if (typeof x.decayRate === "number") setContextStore("decayRate", x.decayRate)
          if (typeof x.cacheTTL === "number") setContextStore("cacheTTL", x.cacheTTL)
        })
        .catch(() => {})
        .finally(() => {
          setContextStore("ready", true)
        })

      return {
        get ready() {
          return contextStore.ready
        },
        enabled() {
          return contextStore.enabled
        },
        threshold() {
          return contextStore.threshold
        },
        decayRate() {
          return contextStore.decayRate
        },
        cacheTTL() {
          return contextStore.cacheTTL
        },
        setEnabled(value: boolean) {
          setContextStore("enabled", value)
          save()
        },
        setThreshold(value: number) {
          const clamped = Math.max(0.1, Math.min(0.95, value))
          setContextStore("threshold", clamped)
          save()
        },
        setDecayRate(value: number) {
          const clamped = Math.max(0.01, Math.min(0.5, value))
          setContextStore("decayRate", clamped)
          save()
        },
        setCacheTTL(value: number) {
          const clamped = Math.max(60000, Math.min(1800000, value))
          setContextStore("cacheTTL", clamped)
          save()
        },
        reset() {
          batch(() => {
            setContextStore("enabled", true)
            setContextStore("threshold", 0.7)
            setContextStore("decayRate", 0.1)
            setContextStore("cacheTTL", 300000)
          })
          save()
        },
      }
    })

    const result = {
      model,
      agent,
      contextSettings,
    }
    return result
  },
})
