export namespace Flag {
  // CodeSurf Migration
  export const CODESURF_FOLDER = process.env["CODESURF_FOLDER"] || ".codesurf"
  export const CODESURF_COMPATIBILITY_MODE = CODESURF_FOLDER === ".opencode"

  export const OPENCODE_AUTO_SHARE = truthy("OPENCODE_AUTO_SHARE")
  export const OPENCODE_CONFIG = process.env["OPENCODE_CONFIG"]
  export const OPENCODE_CONFIG_DIR = process.env["OPENCODE_CONFIG_DIR"]
  export const OPENCODE_CONFIG_CONTENT = process.env["OPENCODE_CONFIG_CONTENT"]
  // CodeSurf: Auto-update disabled by default until we set up our own update system
  export const OPENCODE_DISABLE_AUTOUPDATE = process.env["OPENCODE_DISABLE_AUTOUPDATE"]?.toLowerCase() === "false" ? false : true
  export const OPENCODE_DISABLE_PRUNE = truthy("OPENCODE_DISABLE_PRUNE")
  export const OPENCODE_PERMISSION = process.env["OPENCODE_PERMISSION"]
  export const OPENCODE_DISABLE_DEFAULT_PLUGINS = truthy("OPENCODE_DISABLE_DEFAULT_PLUGINS")
  export const OPENCODE_DISABLE_LSP_DOWNLOAD = truthy("OPENCODE_DISABLE_LSP_DOWNLOAD")
  export const OPENCODE_ENABLE_EXPERIMENTAL_MODELS = truthy("OPENCODE_ENABLE_EXPERIMENTAL_MODELS")
  export const OPENCODE_DISABLE_AUTOCOMPACT = truthy("OPENCODE_DISABLE_AUTOCOMPACT")
  export const OPENCODE_ENABLE_AUTOCOMPACT = truthy("OPENCODE_ENABLE_AUTOCOMPACT")
  export const OPENCODE_ENABLE_PRUNE = truthy("OPENCODE_ENABLE_PRUNE")
  export const OPENCODE_FAKE_VCS = process.env["OPENCODE_FAKE_VCS"]
  export const OPENCODE_EXPERIMENTAL_BASH_MAX_OUTPUT_LENGTH =
    process.env["OPENCODE_EXPERIMENTAL_BASH_MAX_OUTPUT_LENGTH"]

  // Experimental
  export const OPENCODE_EXPERIMENTAL = truthy("OPENCODE_EXPERIMENTAL")
  export const OPENCODE_EXPERIMENTAL_WATCHER = OPENCODE_EXPERIMENTAL || truthy("OPENCODE_EXPERIMENTAL_WATCHER")
  export const OPENCODE_EXPERIMENTAL_DISABLE_COPY_ON_SELECT = truthy("OPENCODE_EXPERIMENTAL_DISABLE_COPY_ON_SELECT")
  export const OPENCODE_ENABLE_EXA =
    truthy("OPENCODE_ENABLE_EXA") || OPENCODE_EXPERIMENTAL || truthy("OPENCODE_EXPERIMENTAL_EXA")

  // Intelligent Context Management (enabled by default - use env var to disable)
  export const OPENCODE_INTELLIGENT_CONTEXT = process.env["OPENCODE_INTELLIGENT_CONTEXT"]?.toLowerCase() === "false" ? false : true
  export const OPENCODE_CONTEXT_THRESHOLD = parseFloat(process.env["OPENCODE_CONTEXT_THRESHOLD"] ?? "0.7") // 70% default
  export const OPENCODE_CONTEXT_DECAY_RATE = parseFloat(process.env["OPENCODE_CONTEXT_DECAY_RATE"] ?? "0.1") // 10% decay per turn
  export const OPENCODE_CONTEXT_CACHE_TTL = parseInt(process.env["OPENCODE_CONTEXT_CACHE_TTL"] ?? "300000", 10) // 5 min default

  function truthy(key: string) {
    const value = process.env[key]?.toLowerCase()
    return value === "true" || value === "1"
  }
}
