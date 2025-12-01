import { z } from "zod"
import { Log } from "@/util/log"
import { AdvancedContextManager } from "./advanced-context-manager"
import { Session } from "."
import { MessageV2 } from "./message-v2"
import { Flag } from "@/flag/flag"

/**
 * Context Retrieval Tool
 *
 * Provides the model with ability to fetch older/compacted context on demand.
 * This allows for lazy loading of historical context when needed.
 */
export namespace ContextRetrievalTool {
  const log = Log.create({ service: "context-retrieval-tool" })

  // ============================================================================
  // Tool Schema
  // ============================================================================

  export const ToolSchema = z.object({
    action: z.enum(["list_available", "fetch_item", "fetch_by_type", "search", "get_stats"]),
    itemId: z.string().optional(),
    itemType: z.enum(["message", "tool_output", "file", "image", "context_chip"]).optional(),
    query: z.string().optional(),
    limit: z.number().int().min(1).max(20).default(5).optional(),
  })

  export type ToolInput = z.infer<typeof ToolSchema>

  // ============================================================================
  // Tool Definition (for AI SDK)
  // ============================================================================

  export const definition = {
    name: "retrieve_context",
    description: `Retrieve older or compacted context that is not currently in the conversation.
Use this tool when:
- You need to reference something mentioned earlier that may have been removed for space
- You want to see tool outputs from earlier in the session
- You need to access file contents that were read earlier
- You want to see available context items and their relevance scores

Actions:
- list_available: List all available context items with their IDs and relevance scores
- fetch_item: Fetch a specific context item by ID
- fetch_by_type: Fetch items of a specific type (message, tool_output, file, image)
- search: Search for context items by keyword
- get_stats: Get statistics about context usage`,
    parameters: ToolSchema,
  }

  // ============================================================================
  // Tool Execution
  // ============================================================================

  export interface ToolResult {
    success: boolean
    data?: unknown
    error?: string
  }

  export async function execute(sessionID: string, input: ToolInput): Promise<ToolResult> {
    if (!Flag.OPENCODE_INTELLIGENT_CONTEXT) {
      return {
        success: false,
        error: "Intelligent context management is not enabled. Set OPENCODE_INTELLIGENT_CONTEXT=true to enable.",
      }
    }

    log.info("Executing context retrieval", { sessionID, action: input.action })

    try {
      switch (input.action) {
        case "list_available":
          return await listAvailable(sessionID, input.limit ?? 10)

        case "fetch_item":
          if (!input.itemId) {
            return { success: false, error: "itemId is required for fetch_item action" }
          }
          return await fetchItem(sessionID, input.itemId)

        case "fetch_by_type":
          if (!input.itemType) {
            return { success: false, error: "itemType is required for fetch_by_type action" }
          }
          return await fetchByType(sessionID, input.itemType, input.limit ?? 5)

        case "search":
          if (!input.query) {
            return { success: false, error: "query is required for search action" }
          }
          return await searchContext(sessionID, input.query, input.limit ?? 5)

        case "get_stats":
          return getStats(sessionID)

        default:
          return { success: false, error: `Unknown action: ${input.action}` }
      }
    } catch (error) {
      log.error("Context retrieval failed", { sessionID, action: input.action, error })
      return { success: false, error: String(error) }
    }
  }

  // ============================================================================
  // Action Implementations
  // ============================================================================

  async function listAvailable(sessionID: string, limit: number): Promise<ToolResult> {
    // Get items sorted by relevance
    const items = AdvancedContextManager.getItemsByRelevance(sessionID, {
      minRelevance: 0,
    })

    // Also get high-token references
    const highTokenRefs = AdvancedContextManager.getHighTokenRefs(sessionID)

    const availableItems = items.slice(0, limit).map((item) => ({
      id: item.id,
      type: item.type,
      relevanceScore: Math.round(item.relevanceScore * 100) / 100,
      tokenCount: item.tokenCount,
      preview: item.content.slice(0, 100) + (item.content.length > 100 ? "..." : ""),
      accessCount: item.accessCount,
      isCompacted: item.metadata?.isCompacted ?? false,
    }))

    const compactedItems = highTokenRefs.map((ref) => ({
      id: ref.id,
      type: "compacted" as const,
      tokenCount: ref.tokenCount,
      preview: ref.preview,
      canExpand: true,
    }))

    return {
      success: true,
      data: {
        availableItems,
        compactedItems,
        totalItems: items.length,
        totalCompacted: highTokenRefs.length,
      },
    }
  }

  async function fetchItem(sessionID: string, itemId: string): Promise<ToolResult> {
    // First check if it's a regular item
    const item = AdvancedContextManager.getItem(sessionID, itemId)
    if (item) {
      // Boost relevance since it was requested
      AdvancedContextManager.boostRelevance(sessionID, itemId, 0.3)

      return {
        success: true,
        data: {
          id: item.id,
          type: item.type,
          content: item.content,
          tokenCount: item.tokenCount,
          relevanceScore: item.relevanceScore,
          metadata: item.metadata,
        },
      }
    }

    // Check if it's a compacted item that needs expansion
    const expanded = AdvancedContextManager.expandPointer(sessionID, `[CONTEXT_REF:${itemId}]`)
    if (expanded) {
      return {
        success: true,
        data: {
          id: itemId,
          type: "expanded",
          content: expanded,
          wasCompacted: true,
        },
      }
    }

    // Try to find in session messages directly
    const msgs = await Session.messages({ sessionID })
    for (const msg of msgs) {
      for (const part of msg.parts) {
        if (part.id === itemId) {
          return {
            success: true,
            data: {
              id: itemId,
              type: part.type,
              content: getPartContent(part),
              fromMessageHistory: true,
            },
          }
        }
      }
    }

    return {
      success: false,
      error: `Item not found: ${itemId}`,
    }
  }

  async function fetchByType(
    sessionID: string,
    itemType: AdvancedContextManager.ContextItem["type"],
    limit: number,
  ): Promise<ToolResult> {
    const items = AdvancedContextManager.getItemsByRelevance(sessionID, {
      types: [itemType],
      minRelevance: 0,
    })

    const results = items.slice(0, limit).map((item) => ({
      id: item.id,
      type: item.type,
      content: item.content.length > 500 ? item.content.slice(0, 500) + "..." : item.content,
      tokenCount: item.tokenCount,
      relevanceScore: item.relevanceScore,
    }))

    return {
      success: true,
      data: {
        type: itemType,
        items: results,
        totalAvailable: items.length,
      },
    }
  }

  async function searchContext(sessionID: string, query: string, limit: number): Promise<ToolResult> {
    const items = AdvancedContextManager.getItemsByRelevance(sessionID, {
      minRelevance: 0,
    })

    const queryLower = query.toLowerCase()
    const matches = items
      .filter((item) => item.content.toLowerCase().includes(queryLower))
      .slice(0, limit)
      .map((item) => {
        // Find the matching snippet
        const contentLower = item.content.toLowerCase()
        const matchIndex = contentLower.indexOf(queryLower)
        const snippetStart = Math.max(0, matchIndex - 50)
        const snippetEnd = Math.min(item.content.length, matchIndex + query.length + 50)
        const snippet = (snippetStart > 0 ? "..." : "") + item.content.slice(snippetStart, snippetEnd) + (snippetEnd < item.content.length ? "..." : "")

        return {
          id: item.id,
          type: item.type,
          snippet,
          relevanceScore: item.relevanceScore,
          tokenCount: item.tokenCount,
        }
      })

    // Also search high-token refs
    const highTokenRefs = AdvancedContextManager.getHighTokenRefs(sessionID)
    const compactedMatches = highTokenRefs
      .filter((ref) => ref.preview.toLowerCase().includes(queryLower))
      .slice(0, 3)
      .map((ref) => ({
        id: ref.id,
        type: "compacted" as const,
        preview: ref.preview,
        tokenCount: ref.tokenCount,
        canExpand: true,
      }))

    return {
      success: true,
      data: {
        query,
        matches,
        compactedMatches,
        totalMatches: matches.length + compactedMatches.length,
      },
    }
  }

  function getStats(sessionID: string): ToolResult {
    const stats = AdvancedContextManager.getStats(sessionID)
    const cacheStats = AdvancedContextManager.getCacheStats()

    return {
      success: true,
      data: {
        context: {
          totalTokens: stats.totalTokens,
          usedTokens: stats.usedTokens,
          usagePercent: Math.round(stats.usagePercent * 100) / 100,
          itemCount: stats.itemCount,
          highTokenItems: stats.highTokenItems,
          decayedItems: stats.decayedItems,
        },
        cache: cacheStats,
        thresholdPercent: Flag.OPENCODE_CONTEXT_THRESHOLD * 100,
        decayRate: Flag.OPENCODE_CONTEXT_DECAY_RATE * 100,
      },
    }
  }

  // ============================================================================
  // Helpers
  // ============================================================================

  function getPartContent(part: MessageV2.Part): string {
    switch (part.type) {
      case "text":
        return part.text
      case "file":
        return `File: ${part.filename ?? "unknown"}`
      case "tool":
        if (part.state.status === "completed") {
          return `Tool: ${part.tool}\nInput: ${JSON.stringify(part.state.input ?? {})}\nOutput: ${part.state.output}`
        }
        return `Tool: ${part.tool}\nStatus: ${part.state.status}`
      case "reasoning":
        return part.text
      default:
        return "[Unknown part type]"
    }
  }

  // ============================================================================
  // System Prompt Addition
  // ============================================================================

  export function getSystemPromptAddition(): string {
    if (!Flag.OPENCODE_INTELLIGENT_CONTEXT) return ""

    return `
## Context Management

This session uses intelligent context management. Some older content may be compacted or removed to optimize token usage.

You have access to the \`retrieve_context\` tool to:
- List available context items that may not be in the current conversation
- Fetch specific items by ID
- Search for content by keyword
- View context statistics

If you need information from earlier in the conversation that appears to be missing, use this tool to retrieve it.
`
  }
}
