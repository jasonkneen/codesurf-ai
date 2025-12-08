import z from "zod"
import path from "path"
import { Config } from "../config/config"
import { mergeDeep, sortBy, mapValues } from "remeda"
import { NoSuchModelError, type LanguageModel, type Provider as AIProvider } from "ai"
import { Log } from "../util/log"
import { BunProc } from "../bun"
import { Plugin } from "../plugin"
import { ModelsDev } from "./models"
import { NamedError } from "@opencode-ai/util/error"
import { Auth } from "../auth"
import { Env } from "../env"
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
import { createOpenRouter, type LanguageModelV2 } from "@openrouter/ai-sdk-provider"
import { createOpenaiCompatible as createGitHubCopilotOpenAICompatible } from "./sdk/openai-compatible/src"

export namespace Provider {
  const log = Log.create({ service: "provider" })

  const BUNDLED_PROVIDERS: Record<string, (options: any) => AIProvider> = {
    "@ai-sdk/amazon-bedrock": createAmazonBedrock,
    "@ai-sdk/anthropic": createAnthropic,
    "@ai-sdk/azure": createAzure,
    "@ai-sdk/google": createGoogleGenerativeAI,
    "@ai-sdk/google-vertex": createVertex,
    "@ai-sdk/google-vertex/anthropic": createVertexAnthropic,
    "@ai-sdk/openai": createOpenAI,
    "@ai-sdk/openai-compatible": createOpenAICompatible,
    "@openrouter/ai-sdk-provider": createOpenRouter,
    // @ts-ignore (TODO: kill this code so we dont have to maintain it)
    "@ai-sdk/github-copilot": createGitHubCopilotOpenAICompatible,
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

  type CustomLoader = (provider: Info) => Promise<CustomLoaderResult>

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
        const env = Env.all()
        if (input.env.some((item) => env[item])) return true
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
    "github-copilot": async () => {
      return {
        autoload: false,
        async getModel(sdk: any, modelID: string, _options?: Record<string, any>) {
          if (modelID.includes("codex")) {
            return sdk.responses(modelID)
          }
          return sdk.chat(modelID)
        },
        options: {},
      }
    },
    "github-copilot-enterprise": async () => {
      return {
        autoload: false,
        async getModel(sdk: any, modelID: string, _options?: Record<string, any>) {
          if (modelID.includes("codex")) {
            return sdk.responses(modelID)
          }
          return sdk.chat(modelID)
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
    "azure-cognitive-services": async () => {
      const resourceName = Env.get("AZURE_COGNITIVE_SERVICES_RESOURCE_NAME")
      return {
        autoload: false,
        async getModel(sdk: any, modelID: string, options?: Record<string, any>) {
          if (options?.["useCompletionUrls"]) {
            return sdk.chat(modelID)
          } else {
            return sdk.responses(modelID)
          }
        },
        options: {
          baseURL: resourceName ? `https://${resourceName}.cognitiveservices.azure.com/openai` : undefined,
        },
      }
    },
    "amazon-bedrock": async () => {
      const [awsProfile, awsAccessKeyId, awsBearerToken, awsRegion] = await Promise.all([
        Env.get("AWS_PROFILE"),
        Env.get("AWS_ACCESS_KEY_ID"),
        Env.get("AWS_BEARER_TOKEN_BEDROCK"),
        Env.get("AWS_REGION"),
      ])
      if (!awsProfile && !awsAccessKeyId && !awsBearerToken) return { autoload: false }

      const region = awsRegion ?? "us-east-1"

      const { fromNodeProviderChain } = await import(await BunProc.install("@aws-sdk/credential-providers"))
      return {
        autoload: true,
        options: {
          region,
          credentialProvider: fromNodeProviderChain(),
        },
        async getModel(sdk: ProviderSDK, modelID: string, _options?: ProviderOptions): Promise<LanguageModel> {
          // Skip region prefixing if model already has global prefix
          if (modelID.startsWith("global.")) {
            return sdk.languageModel(modelID)
          }

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
      const project = Env.get("GOOGLE_CLOUD_PROJECT") ?? Env.get("GCP_PROJECT") ?? Env.get("GCLOUD_PROJECT")
      const location = Env.get("GOOGLE_CLOUD_LOCATION") ?? Env.get("VERTEX_LOCATION") ?? "us-east5"
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
      const project = Env.get("GOOGLE_CLOUD_PROJECT") ?? Env.get("GCP_PROJECT") ?? Env.get("GCLOUD_PROJECT")
      const location = Env.get("GOOGLE_CLOUD_LOCATION") ?? Env.get("VERTEX_LOCATION") ?? "global"
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
            providerID: provider.id,
            api: {
              id: model.id,
              url: "https://api.kilocode.ai/api/openrouter",
              npm: provider.id,
            },
            name: model.name,
            release_date: new Date(model.created * 1000).toISOString().split("T")[0],
            attachment: true,
            reasoning: true,
            temperature: true,
            tool_call: true,
            status: "active",
            cost: {
              input: parseFloat(model.pricing.prompt) * 1000000, // Convert to per-million-token pricing
              output: parseFloat(model.pricing.completion) * 1000000,
              cache: {
                read: 0,
                write: 0,
              },
            },
            limit: {
              context: model.context_length,
              output: model.top_provider?.max_completion_tokens || 4096,
            },
            capabilities: {
              temperature: true,
              reasoning: true,
              attachment: true,
              toolcall: true,
              input: {
                text: true,
                audio: false,
                image: false,
                video: false,
                pdf: false,
              },
              output: {
                text: true,
                audio: false,
                image: false,
                video: false,
                pdf: false,
              },
            },
            options: {},
            headers: {},
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
    "sap-ai-core": async () => {
      const auth = await Auth.get("sap-ai-core")
      const serviceKey = Env.get("SAP_AI_SERVICE_KEY") || (auth?.type === "api" ? auth.key : undefined)
      const deploymentId = Env.get("SAP_AI_DEPLOYMENT_ID") || "d65d81e7c077e583"
      const resourceGroup = Env.get("SAP_AI_RESOURCE_GROUP") || "default"

      return {
        autoload: !!serviceKey,
        options: serviceKey ? { serviceKey, deploymentId, resourceGroup } : {},
        async getModel(sdk: any, modelID: string) {
          return sdk(modelID)
        },
      }
    },
    zenmux: async () => {
      return {
        autoload: false,
        options: {
          headers: {
            "HTTP-Referer": "https://opencode.ai/",
            "X-Title": "OpenCode",
          },
        },
      }
    },
  }

  export const Model = z
    .object({
      id: z.string(),
      providerID: z.string(),
      api: z.object({
        id: z.string(),
        url: z.string(),
        npm: z.string(),
      }),
      name: z.string(),
      // Fields expected by ModelsDev.Model (to allow interoperability or manual population)
      release_date: z.string().optional(),
      attachment: z.boolean().optional(),
      reasoning: z.boolean().optional(),
      temperature: z.boolean().optional(),
      tool_call: z.boolean().optional(),
      capabilities: z.object({
        temperature: z.boolean(),
        reasoning: z.boolean(),
        attachment: z.boolean(),
        toolcall: z.boolean(),
        input: z.object({
          text: z.boolean(),
          audio: z.boolean(),
          image: z.boolean(),
          video: z.boolean(),
          pdf: z.boolean(),
        }),
        output: z.object({
          text: z.boolean(),
          audio: z.boolean(),
          image: z.boolean(),
          video: z.boolean(),
          pdf: z.boolean(),
        }),
      }),
      cost: z.object({
        input: z.number(),
        output: z.number(),
        cache: z.object({
          read: z.number(),
          write: z.number(),
        }),
        experimentalOver200K: z
          .object({
            input: z.number(),
            output: z.number(),
            cache: z.object({
              read: z.number(),
              write: z.number(),
            }),
          })
          .optional(),
      }),
      limit: z.object({
        context: z.number(),
        output: z.number(),
      }),
      status: z.enum(["alpha", "beta", "deprecated", "active"]),
      options: z.record(z.string(), z.any()),
      headers: z.record(z.string(), z.string()),
    })
    .meta({
      ref: "Model",
    })
  export type Model = z.infer<typeof Model>

  export const Info = z
    .object({
      id: z.string(),
      name: z.string(),
      source: z.enum(["env", "config", "custom", "api"]),
      env: z.string().array(),
      key: z.string().optional(),
      options: z.record(z.string(), z.any()),
      models: z.record(z.string(), Model),
    })
    .meta({
      ref: "Provider",
    })
  export type Info = z.infer<typeof Info>

  function fromModelsDevModel(provider: ModelsDev.Provider, model: ModelsDev.Model): Model {
    return {
      id: model.id,
      providerID: provider.id,
      name: model.name,
      api: {
        id: model.id,
        url: provider.api!,
        npm: model.provider?.npm ?? provider.npm ?? provider.id,
      },
      status: model.status ?? "active",
      headers: model.headers ?? {},
      options: model.options ?? {},
      cost: {
        input: model.cost?.input ?? 0,
        output: model.cost?.output ?? 0,
        cache: {
          read: model.cost?.cache_read ?? 0,
          write: model.cost?.cache_write ?? 0,
        },
        experimentalOver200K: model.cost?.context_over_200k
          ? {
              cache: {
                read: model.cost.context_over_200k.cache_read ?? 0,
                write: model.cost.context_over_200k.cache_write ?? 0,
              },
              input: model.cost.context_over_200k.input,
              output: model.cost.context_over_200k.output,
            }
          : undefined,
      },
      limit: {
        context: model.limit.context,
        output: model.limit.output,
      },
      capabilities: {
        temperature: model.temperature,
        reasoning: model.reasoning,
        attachment: model.attachment,
        toolcall: model.tool_call,
        input: {
          text: model.modalities?.input?.includes("text") ?? false,
          audio: model.modalities?.input?.includes("audio") ?? false,
          image: model.modalities?.input?.includes("image") ?? false,
          video: model.modalities?.input?.includes("video") ?? false,
          pdf: model.modalities?.input?.includes("pdf") ?? false,
        },
        output: {
          text: model.modalities?.output?.includes("text") ?? false,
          audio: model.modalities?.output?.includes("audio") ?? false,
          image: model.modalities?.output?.includes("image") ?? false,
          video: model.modalities?.output?.includes("video") ?? false,
          pdf: model.modalities?.output?.includes("pdf") ?? false,
        },
      },
    }
  }

  export function fromModelsDevProvider(provider: ModelsDev.Provider): Info {
    return {
      id: provider.id,
      source: "custom",
      name: provider.name,
      env: provider.env ?? [],
      options: {},
      models: mapValues(provider.models, (model) => fromModelsDevModel(provider, model)),
    }
  }

  const state = Instance.state(async () => {
    using _ = log.time("state")
    const config = await Config.get()
    const modelsDev = await ModelsDev.get()
    const database = mapValues(modelsDev, fromModelsDevProvider)

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
      source: "api" | "env" | "custom" | "config"
      info: Info
      getModel?: (sdk: ProviderSDK, modelID: string, options?: ProviderOptions) => Promise<LanguageModel>
      options: ProviderOptions
    }

    const providers: Record<string, LoadedProvider> = {}
    const models = new Map<
      string,
      {
        providerID: string
        modelID: string
        info: Model
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
      source: "api" | "env" | "custom" | "config",
      getModel?: (sdk: ProviderSDK, modelID: string, options?: ProviderOptions) => Promise<LanguageModel>,
    ): void {
      const provider = providers[id]
      if (!provider) {
        const info = database[id]
        if (!info) return
        if (info.models && Object.values(info.models)[0]?.api.url && !options.baseURL)
          options.baseURL = Object.values(info.models)[0].api.url
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
        models: mapValues(githubCopilot.models, (model) => ({
          ...model,
          providerID: "github-copilot-enterprise",
        })),
      }
    }

    // extend database from config
    for (const [providerID, provider] of configProviders) {
      const existing = database[providerID]
      const parsed: Info = {
        id: providerID,
        name: provider.name ?? existing?.name ?? providerID,
        env: provider.env ?? existing?.env ?? [],
        options: mergeDeep(existing?.options ?? {}, provider.options ?? {}),
        source: "config",
        models: existing?.models ?? {},
      }

      for (const [modelID, model] of Object.entries(provider.models ?? {})) {
        const existingModel = parsed.models[model.id ?? modelID]
        const name = iife(() => {
          if (model.name) return model.name
          if (model.id && model.id !== modelID) return modelID
          return existingModel?.name ?? modelID
        })
        const parsedModel: Model = {
          id: modelID,
          api: {
            id: model.id ?? existingModel?.api.id ?? modelID,
            npm:
              model.provider?.npm ?? provider.npm ?? existingModel?.api.npm ?? modelsDev[providerID]?.npm ?? providerID,
            url: provider?.api ?? existingModel?.api.url ?? modelsDev[providerID]?.api,
          },
          status: model.status ?? existingModel?.status ?? "active",
          name,
          providerID,
          capabilities: {
            temperature: model.temperature ?? existingModel?.capabilities.temperature ?? false,
            reasoning: model.reasoning ?? existingModel?.capabilities.reasoning ?? false,
            attachment: model.attachment ?? existingModel?.capabilities.attachment ?? false,
            toolcall: model.tool_call ?? existingModel?.capabilities.toolcall ?? true,
            input: {
              text: model.modalities?.input?.includes("text") ?? existingModel?.capabilities.input.text ?? true,
              audio: model.modalities?.input?.includes("audio") ?? existingModel?.capabilities.input.audio ?? false,
              image: model.modalities?.input?.includes("image") ?? existingModel?.capabilities.input.image ?? false,
              video: model.modalities?.input?.includes("video") ?? existingModel?.capabilities.input.video ?? false,
              pdf: model.modalities?.input?.includes("pdf") ?? existingModel?.capabilities.input.pdf ?? false,
            },
            output: {
              text: model.modalities?.output?.includes("text") ?? existingModel?.capabilities.output.text ?? true,
              audio: model.modalities?.output?.includes("audio") ?? existingModel?.capabilities.output.audio ?? false,
              image: model.modalities?.output?.includes("image") ?? existingModel?.capabilities.output.image ?? false,
              video: model.modalities?.output?.includes("video") ?? existingModel?.capabilities.output.video ?? false,
              pdf: model.modalities?.output?.includes("pdf") ?? existingModel?.capabilities.output.pdf ?? false,
            },
          },
          cost: {
            input: model?.cost?.input ?? existingModel?.cost?.input ?? 0,
            output: model?.cost?.output ?? existingModel?.cost?.output ?? 0,
            cache: {
              read: model?.cost?.cache_read ?? existingModel?.cost?.cache.read ?? 0,
              write: model?.cost?.cache_write ?? existingModel?.cost?.cache.write ?? 0,
            },
          },
          options: mergeDeep(existingModel?.options ?? {}, model.options ?? {}),
          limit: {
            context: model.limit?.context ?? existingModel?.limit?.context ?? 0,
            output: model.limit?.output ?? existingModel?.limit?.output ?? 0,
          },
          headers: mergeDeep(existingModel?.headers ?? {}, model.headers ?? {}),
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
        source: "custom",
        env: ["OPENROUTER_API_KEY"],
        options: {},
        models: {
          auto: {
            id: "auto",
            providerID: "freemium",
            api: {
              id: "auto",
              npm: "@ai-sdk/openai-compatible",
              url: "https://openrouter.ai/api/v1",
            },
            name: "Freemium (Auto-Rotating Free Models)",
            status: "active",
            capabilities: {
              temperature: true,
              reasoning: false,
              attachment: false,
              toolcall: true,
              input: { text: true, audio: false, image: false, video: false, pdf: false },
              output: { text: true, audio: false, image: false, video: false, pdf: false },
            },
            cost: { input: 0, output: 0, cache: { read: 0, write: 0 } },
            limit: { context: 256000, output: 16000 },
            options: {},
            headers: {},
          },
        },
      }
    }

    // Add Codesurf provider with Auto models
    if (!disabled.has("codesurf")) {
      database["codesurf"] = {
        id: "codesurf",
        name: "Codesurf",
        source: "custom",
        env: [], // No API key required - uses free models
        options: {},
        models: {
          auto: {
            id: "auto",
            providerID: "codesurf",
            api: {
              id: "auto",
              npm: "@ai-sdk/openai-compatible",
              url: "https://openrouter.ai/api/v1",
            },
            name: "Auto (Smart Selection)",
            status: "active",
            capabilities: {
              temperature: true,
              reasoning: true,
              attachment: true,
              toolcall: true,
              input: { text: true, audio: false, image: false, video: false, pdf: false },
              output: { text: true, audio: false, image: false, video: false, pdf: false },
            },
            cost: { input: 0, output: 0, cache: { read: 0, write: 0 } },
            limit: { context: 256000, output: 16000 },
            options: {},
            headers: {},
          },
        },
      }
    }

    // Add kilocode provider
    if (!disabled.has("kilocode")) {
      // We initialize with empty models, they get populated by the loader
      database["kilocode"] = {
        id: "kilocode",
        name: "Kilocode",
        source: "custom",
        env: ["KILOCODE_API_KEY"],
        options: {},
        models: {},
      }
    }

    // load env
    const env = Env.all()
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
        mergeProvider(
          providerID,
          {
            apiKey: provider.key,
          },
          "api",
        )
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
        mergeProvider(plugin.auth.provider, options, "custom")
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
            mergeProvider(enterpriseProviderID, enterpriseOptions, "custom")
          }
        }
      }
    }

    for (const [providerID, fn] of Object.entries(CUSTOM_LOADERS)) {
      if (disabled.has(providerID)) continue
      const result = await fn(database[providerID])
      if (result && (result.autoload || providers[providerID])) {
        mergeProvider(providerID, result.options ?? {}, "custom", result.getModel)
      }
    }

    // load config
    for (const [providerID, provider] of configProviders) {
      mergeProvider(providerID, provider.options ?? {}, "config")
    }

    for (const [providerID, provider] of Object.entries(providers)) {
      if (providerID === "github-copilot") {
        // provider.info.npm = "@ai-sdk/github-copilot"
      }

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
              (!model.status || model.status === "active" || Flag.OPENCODE_ENABLE_EXPERIMENTAL_MODELS) &&
              model.status !== "deprecated",
          ),
      )
      provider.info.models = filteredModels

      if (Object.keys(provider.info.models).length === 0) {
        delete providers[providerID]
        continue
      }
      log.info("found", { providerID })
    }

    return {
      providers,
      models,
      sdk,
      realIdByKey,
    }
  })

  export async function list() {
    return state().then((state) => Object.values(state.providers).map((p) => p.info))
  }

  async function getSDK(provider: Info, model: Model): Promise<AIProvider> {
    return (async () => {
      using _ = log.time("getSDK", {
        providerID: model.providerID,
      })
      const s = await state()
      const pkg = model.api.npm
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
      const bundledKey =
        model.providerID === "google-vertex-anthropic" ? "@ai-sdk/google-vertex/anthropic" : model.api.npm
      const bundledFn = BUNDLED_PROVIDERS[bundledKey]
      if (bundledFn) {
        log.info("using bundled provider", { providerID: model.providerID, pkg: bundledKey })
        const loaded = bundledFn({
          name: model.providerID,
          ...options,
        })
        s.sdk.set(key, loaded)
        return loaded as AIProvider
      }

      let installedPath: string
      if (!model.api.npm.startsWith("file://")) {
        installedPath = await BunProc.install(model.api.npm, "latest")
      } else {
        log.info("loading local provider", { pkg: model.api.npm })
        installedPath = model.api.npm
      }

      const mod = await import(installedPath)

      const fn = mod[Object.keys(mod).find((key) => key.startsWith("create"))!]
      const loaded = await fn({
        name: model.providerID,
        ...options,
      })
      s.sdk.set(key, loaded)
      return loaded
    })().catch((e) => {
      throw new InitError({ providerID: provider.id }, { cause: e })
    })
  }

  export async function getProvider(providerID: string) {
    return state().then((s) => s.providers[providerID]?.info)
  }

  export async function getModel(providerID: string, modelID: string) {
    const s = await state()
    const provider = s.providers[providerID]
    if (!provider) throw new ModelNotFoundError({ providerID, modelID })
    const info = provider.info.models[modelID]
    if (!info) throw new ModelNotFoundError({ providerID, modelID })
    const sdk = await getSDK(provider.info, info)

    try {
      const keyReal = `${providerID}/${modelID}`
      const realID = s.realIdByKey.get(keyReal) ?? info.api.id
      const language = provider.getModel
        ? await provider.getModel(sdk as ProviderSDK, realID, provider.options)
        : sdk.languageModel(realID)
      log.info("found", { providerID, modelID })

      const key = `${providerID}/${modelID}`
      s.models.set(key, {
        providerID,
        modelID,
        info,
        language,
        npm: info.api.npm,
      })
      return {
        modelID,
        providerID,
        info,
        language,
        npm: info.api.npm,
      }
    } catch (e) {
      if (e instanceof NoSuchModelError)
        throw new ModelNotFoundError(
          {
            modelID: info.id,
            providerID: providerID,
          },
          { cause: e },
        )
      throw e
    }
  }

  export async function getLanguage(providerID: string, modelID: string) {
    const { language } = await getModel(providerID, modelID)
    return language
  }

  export async function closest(providerID: string, query: string[]) {
    const s = await state()
    const provider = s.providers[providerID]
    if (!provider) return undefined
    for (const item of query) {
      for (const modelID of Object.keys(provider.info.models)) {
        if (modelID.includes(item))
          return {
            providerID,
            modelID,
          }
      }
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
  export function sort(models: Model[]) {
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
      .then((x) => x.find((p) => !cfg.provider || Object.keys(cfg.provider).includes(p.id)))
    if (!provider) throw new Error("no providers found")
    const [model] = sort(Object.values(provider.models))
    if (!model) throw new Error("no models found")
    return {
      providerID: provider.id,
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
