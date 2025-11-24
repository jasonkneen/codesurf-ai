import { createMemo, createSignal } from "solid-js"
import { useLocal } from "@tui/context/local"
import { useSync } from "@tui/context/sync"
import { map, pipe, flatMap, entries, filter, isDeepEqual, sortBy, take } from "remeda"
import { DialogSelect, type DialogSelectRef } from "@tui/ui/dialog-select"
import { useDialog } from "@tui/ui/dialog"
import { createDialogProviderOptions, DialogProvider } from "./dialog-provider"

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

  const showRecent = createMemo(() => !ref()?.filter && local.model.recent().length > 0 && connected())
  const providers = createDialogProviderOptions()

  const allOptions = createMemo(() => {
    return [
      ...(showRecent()
        ? local.model.recent().flatMap((item) => {
            const provider = sync.data.provider.find((x) => x.id === item.providerID)!
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
        : []),
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
            map(([model, info]) => ({
              value: {
                providerID: provider.id,
                modelID: model,
              },
              title: info.name ?? model,
              description: connected() ? provider.name : undefined,
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
            })),
            filter((x) => !showRecent() || !local.model.recent().find((y) => isDeepEqual(y, x.value))),
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
          title: connected() ? "Connect provider" : "More providers",
          onTrigger() {
            dialog.replace(() => <DialogProvider />)
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
