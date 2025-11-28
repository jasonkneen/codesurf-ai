import { createMemo, createSignal } from "solid-js"
import { useLocal } from "@tui/context/local"
import { useSync } from "@tui/context/sync"
import { map, pipe, flatMap, entries, filter, sortBy, take } from "remeda"
import { DialogSelect, type DialogSelectRef } from "@tui/ui/dialog-select"
import { useDialog } from "@tui/ui/dialog"
import { createDialogProviderOptions, DialogProvider } from "./dialog-provider"
import { Keybind } from "@/util/keybind"
import { iife } from "@/util/iife"

const MODELS_PER_PAGE = 20

export function DialogModel() {
  const local = useLocal()
  const sync = useSync()
  const dialog = useDialog()
  const [ref, setRef] = createSignal<DialogSelectRef<unknown>>()
  const [loadedCount, setLoadedCount] = createSignal(MODELS_PER_PAGE)
  const [searchActive, setSearchActive] = createSignal(false)

  // Show loading if providers haven't been fetched yet
  if (sync.data.provider.length === 0 && !sync.data.ready) {
    return (
      <DialogSelect title="Loading models..." options={[{ title: "Loading...", value: "loading", disabled: true }]} />
    )
  }

  const connected = createMemo(() =>
    sync.data.provider.some((x) => x.id !== "opencode" || Object.values(x.models).some((y) => y.cost?.input !== 0)),
  )

  const providers = createDialogProviderOptions()

  const allOptions = createMemo(() => {
    const query = ref()?.filter
    const favorites = connected() ? local.model.favorite() : []
    const recents = local.model.recent()

    const recentList = recents
      .filter((item) => !favorites.some((fav) => fav.providerID === item.providerID && fav.modelID === item.modelID))
      .slice(0, 5)

    const favoriteOptions = !query
      ? favorites.flatMap((item) => {
          const provider = sync.data.provider.find((x) => x.id === item.providerID)
          if (!provider) return []
          const model = provider.models[item.modelID]
          if (!model) return []
          return [
            {
              key: item,
              value: {
                providerID: provider.id,
                modelID: model.id,
              },
              title: model.name ?? item.modelID,
              description: provider.name,
              category: "Favorites",
              disabled: provider.id === "opencode" && model.id.includes("-nano"),
              footer: model.cost?.input === 0 && provider.id === "opencode" ? "Free" : undefined,
              onSelect: () => {
                dialog.clear()
                local.model.set(
                  {
                    providerID: provider.id,
                    modelID: model.id,
                  },
                  { recent: true },
                )
              },
            },
          ]
        })
      : []

    const recentOptions = !query
      ? recentList.flatMap((item) => {
          const provider = sync.data.provider.find((x) => x.id === item.providerID)
          if (!provider) return []
          const model = provider.models[item.modelID]
          if (!model) return []
          return [
            {
              key: item,
              value: {
                providerID: provider.id,
                modelID: model.id,
              },
              title: model.name ?? item.modelID,
              description: provider.name,
              category: "Recent",
              disabled: provider.id === "opencode" && model.id.includes("-nano"),
              footer: model.cost?.input === 0 && provider.id === "opencode" ? "Free" : undefined,
              onSelect: () => {
                dialog.clear()
                local.model.set(
                  {
                    providerID: provider.id,
                    modelID: model.id,
                  },
                  { recent: true },
                )
              },
            },
          ]
        })
      : []

    return [
      ...favoriteOptions,
      ...recentOptions,
      ...pipe(
        sync.data.provider,
        sortBy(
          (provider) => provider.id !== "opencode",
          (provider) => provider.name,
        ),
        flatMap((provider) =>
          pipe(
            provider.models,
            entries(),
            map(([model, info]) => {
              const value = {
                providerID: provider.id,
                modelID: model,
              }
              return {
                value,
                title: info.name ?? model,
                description: favorites.some(
                  (item) => item.providerID === value.providerID && item.modelID === value.modelID,
                )
                  ? "(Favorite)"
                  : undefined,
                category: connected() ? provider.name : undefined,
                disabled: provider.id === "opencode" && model.includes("-nano"),
                footer: info.cost?.input === 0 && provider.id === "opencode" ? "Free" : undefined,
                onSelect() {
                  dialog.clear()
                  local.model.set(
                    {
                      providerID: provider.id,
                      modelID: model,
                    },
                    { recent: true },
                  )
                },
              }
            }),
            filter((x) => {
              if (query) return true
              const value = x.value
              const inFavorites = favorites.some(
                (item) => item.providerID === value.providerID && item.modelID === value.modelID,
              )
              if (inFavorites) return false
              const inRecents = recents.some(
                (item) => item.providerID === value.providerID && item.modelID === value.modelID,
              )
              if (inRecents) return false
              return true
            }),
            sortBy((x) => x.title),
          ),
        ),
      ),
      ...(!connected()
        ? pipe(
            providers(),
            map((option) => {
              return {
                ...option,
                category: "Popular providers",
              }
            }),
            take(6),
          )
        : []),
    ]
  })

  const options = createMemo(() => {
    const filter = ref()?.filter || ""
    const isSearching = filter.length > 0

    // Show error if ready but no options available
    if (sync.data.ready && allOptions().length === 0) {
      return [{ title: "No models available. Connect a provider using Ctrl+A.", value: "none", disabled: true }]
    }

    if (isSearching) {
      setSearchActive(true)
      return allOptions()
    }

    setSearchActive(false)
    setLoadedCount(MODELS_PER_PAGE)
    return allOptions().slice(0, loadedCount())
  })

  return (
    <DialogSelect
      keybind={[
        {
          keybind: { ctrl: true, name: "a", meta: false, shift: false, leader: false },
          title: connected() ? "Connect provider" : "View more providers",
          onTrigger() {
            dialog.replace(() => <DialogProvider />)
          },
        },
        {
          keybind: Keybind.parse("ctrl+f")[0],
          title: "Favorite",
          disabled: !connected(),
          onTrigger: (option) => {
            local.model.toggleFavorite(option.value as { providerID: string; modelID: string })
          },
        },
      ]}
      ref={setRef}
      title="Select model"
      current={local.model.current()}
      options={options()}
      onLoadMore={() => {
        if (!searchActive()) {
          setLoadedCount((c) => c + MODELS_PER_PAGE)
        }
      }}
      hasMore={!searchActive() && loadedCount() < allOptions().length}
    />
  )
}
