import { DialogSelect, type DialogSelectRef } from "../ui/dialog-select"
import { useTheme } from "../context/theme"
import { useDialog } from "../ui/dialog"
import { onCleanup, createEffect } from "solid-js"

export function DialogThemeList() {
  const theme = useTheme()
  const options = Object.keys(theme.all()).map((value) => {
    const isCodesurf = value.includes("(codesurf)")
    return {
      title: isCodesurf ? value.replace(" (codesurf)", "") : value,
      value: value,
      category: isCodesurf ? "Codesurf" : "Legacy Themes",
    }
  })
  const dialog = useDialog()
  let confirmed = false
  let ref: DialogSelectRef<string>
  const initial = theme.selected

  return (
    <DialogSelect
      title="Themes"
      current={initial}
      options={options}
      onSelect={(opt) => {
        theme.set(opt.value)
        dialog.clear()
      }}
    />
  )
}
