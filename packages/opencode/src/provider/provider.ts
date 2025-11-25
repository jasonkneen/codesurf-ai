import z from "zod"
import path from "path"
import { Config } from "../config/config"
import { mergeDeep, sortBy } from "remeda"
import { NoSuchModelError, type LanguageModel, type Provider as AIProvider } from "ai"
import { Log } from "../util/log"
import { BunProc } from "../bun"
import { Plugin } from "../plugin"
import { ModelsDev } from "./models"
import { NamedError } from "@opencode-ai/util/error"
import { Auth } from "../auth"
import { Instance } from "../project/instance"
import { Global } from "../global"
import { Flag } from "../flag/flag"
import { iife } from "@/util/iife"

// Direct imports for bundled providers
import { createAmazonBedrock } from "@ai-sdk/amazon-bedrock"
import { createAnthropic } from "@ai-sdk/anthropic"
import { createAzure } from "@ai-sdk/azure"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { createVertex } from "@ai-sdk/google-vertex"
import { createVertexAnthropic } from "@ai-sdk/google-vertex/anthropic"
import { createOpenAI } from "@ai-sdk/openai"
import { createOpenAICompatible } from "@ai-sdk/openai-compatible"
import { createOpenRouter } from "@openrouter/ai-sdk-provider"

export namespace Provider {
  const log = Log.create({ service: "provider" })

  const BUNDLED_PROVIDERS: Record<string, (options: any) => SDK> = {
    "@ai-sdk/amazon-bedrock": createAmazonBedrock,
    "@ai-sdk/anthropic": createAnthropic,
    "@ai-sdk/azure": createAzure,
    "@ai-sdk/google": createGoogleGenerativeAI,
    "@ai-sdk/google-vertex": createVertex,
    "@ai-sdk/google-vertex/anthropic": createVertexAnthropic,
    "@ai-sdk/openai": createOpenAI,
    "@ai-sdk/openai-compatible": createOpenAICompatible,
    "@openrouter/ai-sdk-provider": createOpenRouter,
  }

  /**
   * Extended SDK interface that accounts for provider-specific methods.
   * Different AI SDK providers expose different methods:
   * - Standard: `sdk.languageModel(id)`
   * - OpenAI: `sdk.responses(id)` or `sdk.chat(id)`
   * - OpenRouter: Callable as `sdk(id)`
   */
  interface ProviderSDK extends AIProvider {
    /** OpenAI-specific: Returns response-based language model */
    responses?: (modelId: string) => LanguageModel
    /** OpenAI-specific: Returns chat-based language model */
    chat?: (modelId: string) => LanguageModel
    /** Some providers are callable directly (e.g., OpenRouter) */
    (modelId: string): LanguageModel
  }

  /**
   * Common options passed to provider SDK initialization and model retrieval.
   */
  interface ProviderOptions {
    apiKey?: string
    baseURL?: string
    timeout?: number | false
    headers?: Record<string, string>
    cacheControl?: boolean
    region?: string
    project?: string
    location?: string
    credentialProvider?: () => Promise<unknown>
    includeUsage?: boolean
    fetch?: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>
    useCompletionUrls?: boolean
    [key: string]: unknown
  }

  /**
   * Return type for custom provider loaders.
   */
  interface CustomLoaderResult {
    autoload: boolean
    getModel?: (sdk: ProviderSDK, modelID: string, options?: ProviderOptions) => Promise<LanguageModel>
    options?: ProviderOptions
  }

  type CustomLoader = (provider: ModelsDev.Provider) => Promise<CustomLoaderResult>

  type Source = "env" | "config" | "custom" | "api"

  const CUSTOM_LOADERS: Record<string, CustomLoader> = {
    async anthropic() {
      const config = await Config.get()
      const anthropicConfig = config.anthropic ?? {}

      // Default all flags to true if not explicitly set
      const promptCaching = anthropicConfig.promptCaching ?? true
      const contextEditing = anthropicConfig.contextEditing ?? true
      const extendedThinking = anthropicConfig.extendedThinking ?? true
      const citations = anthropicConfig.citations ?? true
      const tokenEfficientToolUse = anthropicConfig.tokenEfficientToolUse ?? true
      const fineGrainedToolStreaming = anthropicConfig.fineGrainedToolStreaming ?? true

      // Build beta headers array based on enabled features
      const betaFeatures: string[] = []

      // Always include the core claude-code beta
      betaFeatures.push("claude-code-20250219")

      if (promptCaching) betaFeatures.push("prompt-caching-2024-07-31")
      if (contextEditing) betaFeatures.push("context-editing-2025-05-14")
      if (extendedThinking) betaFeatures.push("interleaved-thinking-2025-05-14")
      if (citations) betaFeatures.push("citations-2025-05-14")
      if (tokenEfficientToolUse) betaFeatures.push("token-efficient-tool-use-2024-11-01")
      if (fineGrainedToolStreaming) betaFeatures.push("fine-grained-tool-streaming-2025-05-14")

      return {
        autoload: false,
        options: {
          headers: {
            "anthropic-beta": betaFeatures.join(","),
          },
          ...(promptCaching ? { cacheControl: true } : {}),
        },
      }
    },
    async codesurf() {
      const { Freemium } = await import("./freemium")

      return {
        autoload: true, // Always autoload - no API key required
        options: {
          headers: {
            "HTTP-Referer": "https://codesurf.ai/",
            "X-Title": "Codesurf Auto",
          },
        },
        async getModel(sdk: ProviderSDK, modelID: string): Promise<LanguageModel> {
          log.info("codesurf routing", { modelID })

          // All three auto models use smart free model selection from OpenRouter
          const freeModels = await Freemium.getFreeModels()
          const selected = Freemium.selectBestModel(freeModels)
          if (!selected) throw new Error("No free models available")

          log.info("codesurf selected model", { from: modelID, to: selected.id })
          return sdk(selected.id)
        },
      }
    },
    async opencode(input) {
      const hasKey = await (async () => {
        if (input.env.some((item) => process.env[item])) return true
        if (await Auth.get(input.id)) return true
        return false
      })()

      if (!hasKey) {
        for (const [key, value] of Object.entries(input.models)) {
          if (value.cost.input === 0) continue
          delete input.models[key]
        }
      }

      return {
        autoload: Object.keys(input.models).length > 0,
        options: hasKey ? {} : { apiKey: "public" },
      }
    },
    openai: async () => {
      return {
        autoload: false,
        async getModel(sdk: ProviderSDK, modelID: string, _options?: ProviderOptions): Promise<LanguageModel> {
          if (!sdk.responses) {
            throw new Error("OpenAI SDK does not support responses method")
          }
          return sdk.responses(modelID)
        },
        options: {},
      }
    },
    azure: async () => {
      return {
        autoload: false,
        async getModel(sdk: ProviderSDK, modelID: string, options?: ProviderOptions): Promise<LanguageModel> {
          if (options?.useCompletionUrls) {
            if (!sdk.chat) {
              throw new Error("Azure SDK does not support chat method")
            }
            return sdk.chat(modelID)
          } else {
            if (!sdk.responses) {
              throw new Error("Azure SDK does not support responses method")
            }
            return sdk.responses(modelID)
          }
        },
        options: {},
      }
    },
    "amazon-bedrock": async () => {
      if (!process.env["AWS_PROFILE"] && !process.env["AWS_ACCESS_KEY_ID"] && !process.env["AWS_BEARER_TOKEN_BEDROCK"])
        return { autoload: false }

      const region = process.env["AWS_REGION"] ?? "us-east-1"

      const { fromNodeProviderChain } = await import(await BunProc.install("@aws-sdk/credential-providers"))
      return {
        autoload: true,
        options: {
          region,
          credentialProvider: fromNodeProviderChain(),
        },
        async getModel(sdk: ProviderSDK, modelID: string, _options?: ProviderOptions): Promise<LanguageModel> {
          let regionPrefix = region.split("-")[0]

          switch (regionPrefix) {
            case "us": {
              const modelRequiresPrefix = [
                "nova-micro",
                "nova-lite",
                "nova-pro",
                "nova-premier",
                "claude",
                "deepseek",
              ].some((m) => modelID.includes(m))
              const isGovCloud = region.startsWith("us-gov")
              if (modelRequiresPrefix && !isGovCloud) {
                modelID = `${regionPrefix}.${modelID}`
              }
              break
            }
            case "eu": {
              const regionRequiresPrefix = [
                "eu-west-1",
                "eu-west-2",
                "eu-west-3",
                "eu-north-1",
                "eu-central-1",
                "eu-south-1",
                "eu-south-2",
              ].some((r) => region.includes(r))
              const modelRequiresPrefix = ["claude", "nova-lite", "nova-micro", "llama3", "pixtral"].some((m) =>
                modelID.includes(m),
              )
              if (regionRequiresPrefix && modelRequiresPrefix) {
                modelID = `${regionPrefix}.${modelID}`
              }
              break
            }
            case "ap": {
              const isAustraliaRegion = ["ap-southeast-2", "ap-southeast-4"].includes(region)
              if (
                isAustraliaRegion &&
                ["anthropic.claude-sonnet-4-5", "anthropic.claude-haiku"].some((m) => modelID.includes(m))
              ) {
                regionPrefix = "au"
                modelID = `${regionPrefix}.${modelID}`
              } else {
                const modelRequiresPrefix = ["claude", "nova-lite", "nova-micro", "nova-pro"].some((m) =>
                  modelID.includes(m),
                )
                if (modelRequiresPrefix) {
                  regionPrefix = "apac"
                  modelID = `${regionPrefix}.${modelID}`
                }
              }
              break
            }
          }

          return sdk.languageModel(modelID)
        },
      }
    },
    openrouter: async () => {
      return {
        autoload: false,
        options: {
          headers: {
            "HTTP-Referer": "https://opencode.ai/",
            "X-Title": "opencode",
          },
        },
      }
    },
    freemium: async () => {
      const { Freemium } = await import("./freemium")

      return {
        autoload: true,
        options: {
          headers: {
            "HTTP-Referer": "https://opencode.ai/",
            "X-Title": "OpenCode Freemium",
          },
        },
        async getModel(sdk: ProviderSDK, modelID: string): Promise<LanguageModel> {
          const freeModels = await Freemium.getFreeModels()
          const selected = Freemium.selectBestModel(freeModels)
          if (!selected) throw new Error("No free models available")

          log.info("freemium routing", { from: modelID, to: selected.id })
          return sdk(selected.id)
        },
      }
    },
    vercel: async () => {
      return {
        autoload: false,
        options: {
          headers: {
            "http-referer": "https://opencode.ai/",
            "x-title": "opencode",
          },
        },
      }
    },
    "google-vertex": async () => {
      const project = process.env["GOOGLE_CLOUD_PROJECT"] ?? process.env["GCP_PROJECT"] ?? process.env["GCLOUD_PROJECT"]
      const location = process.env["GOOGLE_CLOUD_LOCATION"] ?? process.env["VERTEX_LOCATION"] ?? "us-east5"
      const autoload = Boolean(project)
      if (!autoload) return { autoload: false }
      return {
        autoload: true,
        options: {
          project,
          location,
        },
        async getModel(sdk: ProviderSDK, modelID: string): Promise<LanguageModel> {
          const id = String(modelID).trim()
          return sdk.languageModel(id)
        },
      }
    },
    "google-vertex-anthropic": async () => {
      const project = process.env["GOOGLE_CLOUD_PROJECT"] ?? process.env["GCP_PROJECT"] ?? process.env["GCLOUD_PROJECT"]
      const location = process.env["GOOGLE_CLOUD_LOCATION"] ?? process.env["VERTEX_LOCATION"] ?? "global"
      const autoload = Boolean(project)
      if (!autoload) return { autoload: false }
      return {
        autoload: true,
        options: {
          project,
          location,
        },
        async getModel(sdk: ProviderSDK, modelID: string): Promise<LanguageModel> {
          const id = String(modelID).trim()
          return sdk.languageModel(id)
        },
      }
    },
    kilocode: async (provider) => {
      // Check for API key in env or auth
      const auth = await Auth.get(provider.id)
      const apiKey = process.env["KILOCODE_API_KEY"] || (auth?.type === "api" ? auth.key : undefined)
      if (!apiKey) return { autoload: false }

      try {
        // Fetch models from kilocode API
        const response = await fetch("https://api.kilocode.ai/api/openrouter/models", {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
          signal: AbortSignal.timeout(10 * 1000),
        })

        if (!response.ok) {
          log.error("Failed to fetch kilocode models", { status: response.status })
          return { autoload: false }
        }

        const data = (await response.json()) as {
          data: Array<{
            id: string
            name: string
            created: number
            context_length: number
            pricing: {
              prompt: string
              completion: string
            }
            top_provider?: {
              max_completion_tokens?: number
            }
          }>
        }

        // Populate models from API
        for (const model of data.data) {
          provider.models[model.id] = {
            id: model.id,
            name: model.name,
            release_date: new Date(model.created * 1000).toISOString().split("T")[0],
            attachment: true,
            reasoning: true,
            temperature: true,
            tool_call: true,
            cost: {
              input: parseFloat(model.pricing.prompt) * 1000000, // Convert to per-million-token pricing
              output: parseFloat(model.pricing.completion) * 1000000,
              cache_read: 0,
              cache_write: 0,
            },
            limit: {
              context: model.context_length,
              output: model.top_provider?.max_completion_tokens || 4096,
            },
            options: {},
          }
        }

        return {
          autoload: true,
          options: {
            apiKey,
            baseURL: "https://api.kilocode.ai/api/openrouter",
            headers: {
              "HTTP-Referer": "https://opencode.ai/",
              "X-Title": "OpenCode",
            },
          },
        }
      } catch (error) {
        log.error("Error loading kilocode models", { error })
        return { autoload: false }
      }
    },
  }

  const state = Instance.state(async () => {
    using _ = log.time("state")
    const config = await Config.get()
    const database = await ModelsDev.get()

    // Add Claude Sonnet 4.5 1M context model variants
    if (database["anthropic"]?.models["claude-sonnet-4-5-20250929"]) {
      const baseModel = database["anthropic"].models["claude-sonnet-4-5-20250929"]
      // Add versioned 1M model (maps [1m] suffix to base model ID for API)
      database["anthropic"].models["claude-sonnet-4-5-20250929[1m]"] = {
        ...baseModel,
        id: "claude-sonnet-4-5-20250929",
        name: "Claude Sonnet 4.5 (1M context)",
        limit: {
          context: 1000000,
          output: 64000,
        },
      }
      // Add latest alias 1M model (maps [1m] suffix to base model ID for API)
      database["anthropic"].models["claude-sonnet-4-5[1m]"] = {
        ...baseModel,
        id: "claude-sonnet-4-5-20250929",
        name: "Claude Sonnet 4.5 latest (1M context)",
        limit: {
          context: 1000000,
          output: 64000,
        },
      }
    }

    /**
     * Internal representation of a loaded provider with its configuration.
     */
    interface LoadedProvider {
      source: Source
      info: ModelsDev.Provider
      getModel?: (sdk: ProviderSDK, modelID: string, options?: ProviderOptions) => Promise<LanguageModel>
      options: ProviderOptions
    }

    const providers: Record<string, LoadedProvider> = {}
    const models = new Map<
      string,
      {
        providerID: string
        modelID: string
        info: ModelsDev.Model
        language: LanguageModel
        npm?: string
      }
    >()
    const sdk = new Map<number, AIProvider>()
    // Maps `${provider}/${key}` to the provider's actual model ID for custom aliases.
    const realIdByKey = new Map<string, string>()

    log.info("init")

    function mergeProvider(
      id: string,
      options: ProviderOptions,
      source: Source,
      getModel?: (sdk: ProviderSDK, modelID: string, options?: ProviderOptions) => Promise<LanguageModel>,
    ): void {
      const provider = providers[id]
      if (!provider) {
        const info = database[id]
        if (!info) return
        if (info.api && !options.baseURL) options.baseURL = info.api
        providers[id] = {
          source,
          info,
          options,
          getModel,
        }
        return
      }
      provider.options = mergeDeep(provider.options, options) as ProviderOptions
      provider.source = source
      provider.getModel = getModel ?? provider.getModel
    }

    const configProviders = Object.entries(config.provider ?? {})

    // Add GitHub Copilot Enterprise provider that inherits from GitHub Copilot
    if (database["github-copilot"]) {
      const githubCopilot = database["github-copilot"]
      database["github-copilot-enterprise"] = {
        ...githubCopilot,
        id: "github-copilot-enterprise",
        name: "GitHub Copilot Enterprise",
        // Enterprise uses a different API endpoint - will be set dynamically based on auth
        api: undefined,
      }
    }

    for (const [providerID, provider] of configProviders) {
      const existing = database[providerID]
      const parsed: ModelsDev.Provider = {
        id: providerID,
        npm: provider.npm ?? existing?.npm,
        name: provider.name ?? existing?.name ?? providerID,
        env: provider.env ?? existing?.env ?? [],
        api: provider.api ?? existing?.api,
        models: existing?.models ?? {},
      }

      for (const [modelID, model] of Object.entries(provider.models ?? {})) {
        const existing = parsed.models[model.id ?? modelID]
        const name = iife(() => {
          if (model.name) return model.name
          if (model.id && model.id !== modelID) return modelID
          return existing?.name ?? modelID
        })
        const parsedModel: ModelsDev.Model = {
          id: modelID,
          name,
          release_date: model.release_date ?? existing?.release_date,
          attachment: model.attachment ?? existing?.attachment ?? false,
          reasoning: model.reasoning ?? existing?.reasoning ?? false,
          temperature: model.temperature ?? existing?.temperature ?? false,
          tool_call: model.tool_call ?? existing?.tool_call ?? true,
          cost:
            !model.cost && !existing?.cost
              ? {
                  input: 0,
                  output: 0,
                  cache_read: 0,
                  cache_write: 0,
                }
              : {
                  cache_read: 0,
                  cache_write: 0,
                  ...existing?.cost,
                  ...model.cost,
                },
          options: {
            ...existing?.options,
            ...model.options,
          },
          limit: model.limit ??
            existing?.limit ?? {
              context: 0,
              output: 0,
            },
          modalities: model.modalities ??
            existing?.modalities ?? {
              input: ["text"],
              output: ["text"],
            },
          headers: model.headers,
          provider: model.provider ?? existing?.provider,
        }
        if (model.id && model.id !== modelID) {
          realIdByKey.set(`${providerID}/${modelID}`, model.id)
        }
        parsed.models[modelID] = parsedModel
      }
      database[providerID] = parsed
    }

    const disabled = await Config.get().then((cfg) => new Set(cfg.disabled_providers ?? []))

    // Add freemium provider synthetically
    if (!disabled.has("freemium") && process.env["OPENROUTER_API_KEY"]) {
      database["freemium"] = {
        id: "freemium",
        name: "Freemium",
        npm: "@ai-sdk/openai-compatible",
        env: ["OPENROUTER_API_KEY"],
        api: "https://openrouter.ai/api/v1",
        models: {
          auto: {
            id: "auto",
            name: "Freemium (Auto-Rotating Free Models)",
            release_date: "2025-01-01",
            attachment: false,
            reasoning: false,
            temperature: true,
            tool_call: true,
            cost: { input: 0, output: 0, cache_read: 0, cache_write: 0 },
            limit: { context: 256000, output: 16000 },
            options: {},
          },
        },
      }
    }

    // Add Codesurf provider with Auto models
    if (!disabled.has("codesurf")) {
      database["codesurf"] = {
        id: "codesurf",
        name: "Codesurf",
        npm: "@ai-sdk/openai-compatible",
        env: [], // No API key required - uses free models
        api: "https://openrouter.ai/api/v1",
        models: {
          auto: {
            id: "auto",
            name: "Auto (Smart Selection)",
            release_date: "2025-01-01",
            attachment: true,
            reasoning: true,
            temperature: true,
            tool_call: true,
            cost: { input: 0, output: 0, cache_read: 0, cache_write: 0 },
            limit: { context: 256000, output: 16000 },
            options: {},
          },
          "auto-free": {
            id: "auto-free",
            name: "Auto-Free (Only Free Models)",
            release_date: "2025-01-01",
            attachment: true,
            reasoning: true,
            temperature: true,
            tool_call: true,
            cost: { input: 0, output: 0, cache_read: 0, cache_write: 0 },
            limit: { context: 256000, output: 16000 },
            options: {},
          },
          "auto-hybrid": {
            id: "auto-hybrid",
            name: "Auto-Hybrid (Mostly Free, Paid When Needed)",
            release_date: "2025-01-01",
            attachment: true,
            reasoning: true,
            temperature: true,
            tool_call: true,
            cost: { input: 0.0005, output: 0.0015, cache_read: 0, cache_write: 0 },
            limit: { context: 256000, output: 16000 },
            options: {},
          },
        },
      }
    }

    // Add kilocode provider
    if (!disabled.has("kilocode")) {
      database["kilocode"] = {
        id: "kilocode",
        name: "Kilocode",
        npm: "@ai-sdk/openai-compatible",
        env: ["KILOCODE_API_KEY"],
        api: "https://api.kilocode.ai/api/openrouter",
        models: {
          "anthropic/claude-sonnet-4.5": {
            id: "anthropic/claude-sonnet-4.5",
            name: "Claude Sonnet 4.5",
            release_date: "2025-01-01",
            attachment: true,
            reasoning: true,
            temperature: true,
            tool_call: true,
            cost: { input: 0.000003, output: 0.000015, cache_read: 0.0000003, cache_write: 0.00000375 },
            limit: { context: 1000000, output: 64000 },
            modalities: { input: ["text", "image"], output: ["text"] },
            options: {},
          },
          "anthropic/claude-haiku-4.5": {
            id: "anthropic/claude-haiku-4.5",
            name: "Claude Haiku 4.5",
            release_date: "2025-01-01",
            attachment: true,
            reasoning: true,
            temperature: true,
            tool_call: true,
            cost: { input: 0.000001, output: 0.000005, cache_read: 0.0000001, cache_write: 0.00000125 },
            limit: { context: 200000, output: 64000 },
            modalities: { input: ["text", "image"], output: ["text"] },
            options: {},
          },
          "openai/gpt-5.1": {
            id: "openai/gpt-5.1",
            name: "GPT-5.1",
            release_date: "2025-01-01",
            attachment: true,
            reasoning: true,
            temperature: true,
            tool_call: true,
            cost: { input: 0.00000125, output: 0.00001, cache_read: 0.000000125, cache_write: 0 },
            limit: { context: 400000, output: 128000 },
            modalities: { input: ["text", "image"], output: ["text"] },
            options: {},
          },
          "openai/gpt-5.1-codex": {
            id: "openai/gpt-5.1-codex",
            name: "GPT-5.1 Codex",
            release_date: "2025-01-01",
            attachment: true,
            reasoning: true,
            temperature: true,
            tool_call: true,
            cost: { input: 0.00000125, output: 0.00001, cache_read: 0.000000125, cache_write: 0 },
            limit: { context: 400000, output: 128000 },
            modalities: { input: ["text", "image"], output: ["text"] },
            options: {},
          },
          "google/gemini-3-pro-preview": {
            id: "google/gemini-3-pro-preview",
            name: "Gemini 3 Pro Preview",
            release_date: "2025-01-01",
            attachment: true,
            reasoning: true,
            temperature: true,
            tool_call: true,
            cost: { input: 0.000002, output: 0.000012, cache_read: 0.0000002, cache_write: 0.000002375 },
            limit: { context: 1048576, output: 65536 },
            modalities: { input: ["text", "image", "audio", "video"], output: ["text"] },
            options: {},
          },
          "google/gemini-2.5-flash": {
            id: "google/gemini-2.5-flash",
            name: "Gemini 2.5 Flash",
            release_date: "2025-01-01",
            attachment: true,
            reasoning: true,
            temperature: true,
            tool_call: true,
            cost: { input: 0.0000003, output: 0.0000025, cache_read: 0.00000003, cache_write: 0.0000003833 },
            limit: { context: 1048576, output: 65535 },
            modalities: { input: ["text", "image", "audio", "video"], output: ["text"] },
            options: {},
          },
          "x-ai/grok-code-fast-1": {
            id: "x-ai/grok-code-fast-1",
            name: "Grok Code Fast 1 (free)",
            release_date: "2025-01-01",
            attachment: false,
            reasoning: true,
            temperature: true,
            tool_call: true,
            cost: { input: 0, output: 0, cache_read: 0, cache_write: 0 },
            limit: { context: 256000, output: 10000 },
            modalities: { input: ["text"], output: ["text"] },
            options: {},
          },
          "x-ai/grok-4.1-fast": {
            id: "x-ai/grok-4.1-fast",
            name: "Grok 4.1 Fast (free)",
            release_date: "2025-01-01",
            attachment: true,
            reasoning: true,
            temperature: true,
            tool_call: true,
            cost: { input: 0, output: 0, cache_read: 0, cache_write: 0 },
            limit: { context: 2000000, output: 30000 },
            modalities: { input: ["text", "image"], output: ["text"] },
            options: {},
          },
        },
      }
    }

    // load env
    for (const [providerID, provider] of Object.entries(database)) {
      if (disabled.has(providerID)) continue
      const apiKey = provider.env.map((item) => process.env[item]).find((item) => !!item)
      if (!apiKey) continue
      mergeProvider(
        providerID,
        // only include apiKey if there's only one potential option
        provider.env.length === 1 || providerID === "google" ? { apiKey } : {},
        "env",
      )
    }

    // load apikeys
    for (const [providerID, provider] of Object.entries(await Auth.all())) {
      if (disabled.has(providerID)) continue
      if (provider.type === "api") {
        mergeProvider(providerID, { apiKey: provider.key }, "api")
      }
    }

    // load custom
    for (const [providerID, fn] of Object.entries(CUSTOM_LOADERS)) {
      if (disabled.has(providerID)) continue
      const result = await fn(database[providerID])
      if (result && (result.autoload || providers[providerID])) {
        mergeProvider(providerID, result.options ?? {}, "custom", result.getModel)
      }
    }

    for (const plugin of await Plugin.list()) {
      if (!plugin.auth) continue
      const providerID = plugin.auth.provider
      if (disabled.has(providerID)) continue

      // For github-copilot plugin, check if auth exists for either github-copilot or github-copilot-enterprise
      let hasAuth = false
      const auth = await Auth.get(providerID)
      if (auth) hasAuth = true

      // Special handling for github-copilot: also check for enterprise auth
      if (providerID === "github-copilot" && !hasAuth) {
        const enterpriseAuth = await Auth.get("github-copilot-enterprise")
        if (enterpriseAuth) hasAuth = true
      }

      if (!hasAuth) continue
      if (!plugin.auth.loader) continue

      // Load for the main provider if auth exists
      if (auth) {
        const options = await plugin.auth.loader(() => Auth.get(providerID) as any, database[plugin.auth.provider])
        mergeProvider(plugin.auth.provider, options ?? {}, "custom")
      }

      // If this is github-copilot plugin, also register for github-copilot-enterprise if auth exists
      if (providerID === "github-copilot") {
        const enterpriseProviderID = "github-copilot-enterprise"
        if (!disabled.has(enterpriseProviderID)) {
          const enterpriseAuth = await Auth.get(enterpriseProviderID)
          if (enterpriseAuth) {
            const enterpriseOptions = await plugin.auth.loader(
              () => Auth.get(enterpriseProviderID) as any,
              database[enterpriseProviderID],
            )
            mergeProvider(enterpriseProviderID, enterpriseOptions ?? {}, "custom")
          }
        }
      }
    }

    // load config
    for (const [providerID, provider] of configProviders) {
      mergeProvider(providerID, provider.options ?? {}, "config")
    }

    for (const [providerID, provider] of Object.entries(providers)) {
      const filteredModels = Object.fromEntries(
        Object.entries(provider.info.models)
          // Filter out blacklisted models
          .filter(
            ([modelID]) =>
              modelID !== "gpt-5.1-chat-latest" && !(providerID === "openrouter" && modelID === "openai/gpt-5.1-chat"),
          )
          // Filter out experimental models
          .filter(
            ([, model]) =>
              ((!model.experimental && model.status !== "alpha") || Flag.OPENCODE_ENABLE_EXPERIMENTAL_MODELS) &&
              model.status !== "deprecated",
          ),
      )
      provider.info.models = filteredModels

      if (Object.keys(provider.info.models).length === 0) {
        delete providers[providerID]
        continue
      }
      log.info("found", { providerID, npm: provider.info.npm })
    }

    return {
      models,
      providers,
      sdk,
      realIdByKey,
    }
  })

  export async function list() {
    return state().then((state) => state.providers)
  }

  async function getSDK(provider: ModelsDev.Provider, model: ModelsDev.Model): Promise<AIProvider> {
    return (async () => {
      using _ = log.time("getSDK", {
        providerID: provider.id,
      })
      const s = await state()
      const pkg = model.provider?.npm ?? provider.npm ?? provider.id
      const options: ProviderOptions = { ...s.providers[provider.id]?.options }
      if (pkg.includes("@ai-sdk/openai-compatible") && options.includeUsage === undefined) {
        options.includeUsage = true
      }
      const key = Bun.hash.xxHash32(JSON.stringify({ pkg, options }))
      const existing = s.sdk.get(key)
      if (existing) return existing

      // Setup custom fetch with timeout handling if needed
      if (options.timeout !== undefined && options.timeout !== null) {
        const customFetch = options.fetch
        options.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
          const { signal, ...rest } = init ?? {}

          const signals: AbortSignal[] = []
          if (signal) signals.push(signal)
          if (options.timeout !== false && typeof options.timeout === "number") {
            signals.push(AbortSignal.timeout(options.timeout))
          }

          const combined = signals.length > 1 ? AbortSignal.any(signals) : signals[0]

          const fetchFn = customFetch ?? fetch
          return fetchFn(input, {
            ...rest,
            signal: combined,
            // @ts-ignore see here: https://github.com/oven-sh/bun/issues/16682
            timeout: false,
          })
        }
      }

      // Special case: google-vertex-anthropic uses a subpath import
      const bundledKey = provider.id === "google-vertex-anthropic" ? "@ai-sdk/google-vertex/anthropic" : pkg
      const bundledFn = BUNDLED_PROVIDERS[bundledKey]
      if (bundledFn) {
        log.info("using bundled provider", { providerID: provider.id, pkg: bundledKey })
        const loaded = bundledFn({
          name: provider.id,
          ...options,
        })
        s.sdk.set(key, loaded)
        return loaded as SDK
      }

      let installedPath: string
      if (!pkg.startsWith("file://")) {
        installedPath = await BunProc.install(pkg, "latest")
      } else {
        log.info("loading local provider", { pkg })
        installedPath = pkg
      }

      const mod = await import(installedPath)

      const fn = mod[Object.keys(mod).find((key) => key.startsWith("create"))!]
      const loaded = fn({
        name: provider.id,
        ...options,
      })
      s.sdk.set(key, loaded)
      return loaded
    })().catch((e) => {
      throw new InitError({ providerID: provider.id }, { cause: e })
    })
  }

  export async function getProvider(providerID: string) {
    return state().then((s) => s.providers[providerID])
  }

  export async function getModel(providerID: string, modelID: string) {
    const key = `${providerID}/${modelID}`
    const s = await state()
    if (s.models.has(key)) return s.models.get(key)!

    log.info("getModel", {
      providerID,
      modelID,
    })

    const provider = s.providers[providerID]
    if (!provider) throw new ModelNotFoundError({ providerID, modelID })
    const info = provider.info.models[modelID]
    if (!info) throw new ModelNotFoundError({ providerID, modelID })
    const sdk = await getSDK(provider.info, info)

    try {
      const keyReal = `${providerID}/${modelID}`
      const realID = s.realIdByKey.get(keyReal) ?? info.id
      const language = provider.getModel
        ? await provider.getModel(sdk as ProviderSDK, realID, provider.options)
        : sdk.languageModel(realID)
      log.info("found", { providerID, modelID })
      s.models.set(key, {
        providerID,
        modelID,
        info,
        language,
        npm: info.provider?.npm ?? provider.info.npm,
      })
      return {
        modelID,
        providerID,
        info,
        language,
        npm: info.provider?.npm ?? provider.info.npm,
      }
    } catch (e) {
      if (e instanceof NoSuchModelError)
        throw new ModelNotFoundError(
          {
            modelID: modelID,
            providerID,
          },
          { cause: e },
        )
      throw e
    }
  }

  /**
   * Selects the most appropriate small/cheap model for cost-effective operations.
   *
   * Used for read-only agents (orchestrator, plan) that need reasoning but don't edit code.
   * Small models cost ~80% less than flagship models while maintaining quality for coordination tasks.
   *
   * Selection Priority:
   * 1. User-configured `small_model` from config (if set)
   * 2. Auto-selection based on provider's available models:
   *    - Claude Haiku 4.5 (anthropic)
   *    - Gemini 2.5 Flash (google)
   *    - GPT-5 Nano (openai)
   *
   * @param providerID - The provider to select a small model from
   * @returns The selected small model, or undefined if no suitable model found
   *
   * @example
   * ```typescript
   * // With user config set: config.small_model = "anthropic/claude-haiku-4.5"
   * const model = await getSmallModel("anthropic")
   * // Returns: { providerID: "anthropic", modelID: "claude-haiku-4.5" }
   *
   * // Without config, auto-selects from available models
   * const model = await getSmallModel("google")
   * // Returns: { providerID: "google", modelID: "gemini-2.5-flash-latest" }
   * ```
   */
  export async function getSmallModel(providerID: string) {
    const cfg = await Config.get()

    // Priority 1: Use explicitly configured small model
    if (cfg.small_model) {
      const parsed = parseModel(cfg.small_model)
      return getModel(parsed.providerID, parsed.modelID)
    }

    // Priority 2: Auto-select from provider's available models
    const provider = await state().then((state) => state.providers[providerID])
    if (provider) {
      let priority = [
        "claude-haiku-4-5",
        "claude-haiku-4.5",
        "3-5-haiku",
        "3.5-haiku",
        "gemini-2.5-flash",
        "gpt-5-nano",
      ]
      // claude-haiku-4.5 is considered a premium model in github copilot, we shouldn't use premium requests for title gen
      if (providerID === "github-copilot") {
        priority = priority.filter((m) => m !== "claude-haiku-4.5")
      }
      if (providerID.startsWith("opencode")) {
        priority = ["gpt-5-nano"]
      }
      for (const item of priority) {
        for (const model of Object.keys(provider.info.models)) {
          if (model.includes(item)) return getModel(providerID, model)
        }
      }
    }

    // No small model found - caller should fall back to default
    return undefined
  }

  const priority = ["gpt-5.1", "claude-sonnet-4.5[1m]", "big-pickle", "gemini-3-pro"]
  export function sort(models: ModelsDev.Model[]) {
    return sortBy(
      models,
      [(model) => priority.findIndex((filter) => model.id.includes(filter)), "desc"],
      [(model) => (model.id.includes("latest") ? 0 : 1), "asc"],
      [(model) => model.id, "desc"],
    )
  }

  export async function defaultModel() {
    const cfg = await Config.get()
    if (cfg.model) return parseModel(cfg.model)

    const provider = await list()
      .then((val) => Object.values(val))
      .then((x) => x.find((p) => !cfg.provider || Object.keys(cfg.provider).includes(p.info.id)))
    if (!provider) throw new Error("no providers found")
    const [model] = sort(Object.values(provider.info.models))
    if (!model) throw new Error("no models found")
    return {
      providerID: provider.info.id,
      modelID: model.id,
    }
  }

  export function parseModel(model: string) {
    const [providerID, ...rest] = model.split("/")
    return {
      providerID: providerID,
      modelID: rest.join("/"),
    }
  }

  export const ModelNotFoundError = NamedError.create(
    "ProviderModelNotFoundError",
    z.object({
      providerID: z.string(),
      modelID: z.string(),
    }),
  )

  export const InitError = NamedError.create(
    "ProviderInitError",
    z.object({
      providerID: z.string(),
    }),
  )
}
