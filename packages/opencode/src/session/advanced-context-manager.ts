import { Log } from "@/util/log"
import { Flag } from "@/flag/flag"
import { Token } from "@/util/token"
import { Bus } from "@/bus"
import z from "zod"

/**
 * Advanced Context Manager
 *
 * Intelligent context management system that optimizes token usage through:
 * - Context decay based on message age and relevance
 * - High-token item tracking and lazy loading
 * - Efficient LRU caching with TTL
 * - 70% threshold monitoring with auto-cleanup
 * - Fresh context chip injection (no duplication)
 *
 * Enable with: OPENCODE_INTELLIGENT_CONTEXT=true
 */
export namespace AdvancedContextManager {
  const log = Log.create({ service: "advanced-context-manager" })

  // ============================================================================
  // Types
  // ============================================================================

  export interface ContextItem {
    id: string
    type: "message" | "tool_output" | "file" | "image" | "context_chip"
    content: string
    tokenCount: number
    createdAt: number
    lastAccessedAt: number
    accessCount: number
    relevanceScore: number
    metadata?: {
      mimeType?: string
      filePath?: string
      toolName?: string
      messageIndex?: number
      isCompacted?: boolean
    }
  }

  export interface ContextStats {
    totalTokens: number
    usedTokens: number
    usagePercent: number
    itemCount: number
    highTokenItems: number
    cachedItems: number
    decayedItems: number
  }

  export interface DecayConfig {
    baseRate: number // Base decay rate per turn (default 0.1)
    minRelevance: number // Minimum relevance before removal (default 0.1)
    recentTurnsProtected: number // Recent turns immune to decay (default 2)
    highPriorityBoost: number // Boost for high-priority items (default 0.3)
  }

  // ============================================================================
  // Events
  // ============================================================================

  export const Event = {
    ThresholdReached: Bus.event(
      "context.threshold_reached",
      z.object({
        sessionID: z.string(),
        usagePercent: z.number(),
        tokenCount: z.number(),
      }),
    ),
    ItemEvicted: Bus.event(
      "context.item_evicted",
      z.object({
        sessionID: z.string(),
        itemId: z.string(),
        reason: z.enum(["decay", "threshold", "manual", "ttl"]),
      }),
    ),
    CacheHit: Bus.event(
      "context.cache_hit",
      z.object({
        sessionID: z.string(),
        itemId: z.string(),
      }),
    ),
  }

  // ============================================================================
  // LRU Cache with TTL
  // ============================================================================

  class LRUCache<T> {
    private cache = new Map<string, { value: T; timestamp: number; accessCount: number }>()
    private readonly maxSize: number
    private readonly ttl: number

    constructor(maxSize = 100, ttl = Flag.OPENCODE_CONTEXT_CACHE_TTL) {
      this.maxSize = maxSize
      this.ttl = ttl
    }

    get(key: string): T | undefined {
      const entry = this.cache.get(key)
      if (!entry) return undefined

      // Check TTL
      if (Date.now() - entry.timestamp > this.ttl) {
        this.cache.delete(key)
        return undefined
      }

      // Update access time and count (LRU behavior)
      entry.timestamp = Date.now()
      entry.accessCount++

      // Move to end (most recently used)
      this.cache.delete(key)
      this.cache.set(key, entry)

      return entry.value
    }

    set(key: string, value: T): void {
      // Evict oldest if at capacity
      if (this.cache.size >= this.maxSize) {
        const oldest = this.cache.keys().next().value
        if (oldest) this.cache.delete(oldest)
      }

      this.cache.set(key, {
        value,
        timestamp: Date.now(),
        accessCount: 1,
      })
    }

    has(key: string): boolean {
      const entry = this.cache.get(key)
      if (!entry) return false
      if (Date.now() - entry.timestamp > this.ttl) {
        this.cache.delete(key)
        return false
      }
      return true
    }

    delete(key: string): boolean {
      return this.cache.delete(key)
    }

    clear(): void {
      this.cache.clear()
    }

    get size(): number {
      return this.cache.size
    }

    // Get items sorted by access count (most accessed first)
    getByAccessCount(): Array<{ key: string; value: T; accessCount: number }> {
      return Array.from(this.cache.entries())
        .filter(([_, entry]) => Date.now() - entry.timestamp <= this.ttl)
        .sort((a, b) => b[1].accessCount - a[1].accessCount)
        .map(([key, entry]) => ({ key, value: entry.value, accessCount: entry.accessCount }))
    }

    // Prune expired entries
    prune(): number {
      const now = Date.now()
      let pruned = 0
      for (const [key, entry] of this.cache.entries()) {
        if (now - entry.timestamp > this.ttl) {
          this.cache.delete(key)
          pruned++
        }
      }
      return pruned
    }
  }

  // ============================================================================
  // Session Context State
  // ============================================================================

  interface SessionContext {
    items: Map<string, ContextItem>
    highTokenRefs: Map<string, { pointer: string; tokenCount: number; lastContent?: string }>
    contextChips: Set<string> // IDs of context chips to inject fresh
    turnCount: number
    lastCleanup: number
    contextLimit: number
  }

  // Per-session context state
  const sessionContexts = new Map<string, SessionContext>()

  // Global caches
  const tokenEstimateCache = new LRUCache<number>(500)
  const relevanceCache = new LRUCache<number>(200)
  const contentHashCache = new LRUCache<string>(300)

  // ============================================================================
  // Core Functions
  // ============================================================================

  /**
   * Check if intelligent context management is enabled
   */
  export function isEnabled(): boolean {
    return Flag.OPENCODE_INTELLIGENT_CONTEXT
  }

  /**
   * Initialize context for a session
   */
  export function initSession(sessionID: string, contextLimit: number): void {
    if (!isEnabled()) return

    if (!sessionContexts.has(sessionID)) {
      sessionContexts.set(sessionID, {
        items: new Map(),
        highTokenRefs: new Map(),
        contextChips: new Set(),
        turnCount: 0,
        lastCleanup: Date.now(),
        contextLimit,
      })
      log.info("Initialized session context", { sessionID, contextLimit })
    }
  }

  /**
   * Get or create session context
   */
  function getSessionContext(sessionID: string): SessionContext {
    let ctx = sessionContexts.get(sessionID)
    if (!ctx) {
      ctx = {
        items: new Map(),
        highTokenRefs: new Map(),
        contextChips: new Set(),
        turnCount: 0,
        lastCleanup: Date.now(),
        contextLimit: 200_000, // Default
      }
      sessionContexts.set(sessionID, ctx)
    }
    return ctx
  }

  /**
   * Estimate tokens with caching
   */
  export function estimateTokens(content: string): number {
    const hash = hashContent(content)
    const cached = tokenEstimateCache.get(hash)
    if (cached !== undefined) return cached

    const estimate = Token.estimate(content)
    tokenEstimateCache.set(hash, estimate)
    return estimate
  }

  /**
   * Fast content hash for caching
   */
  function hashContent(content: string): string {
    // Simple fast hash - not cryptographic, just for caching
    let hash = 0
    const len = Math.min(content.length, 1000) // Only hash first 1000 chars for speed
    for (let i = 0; i < len; i++) {
      const char = content.charCodeAt(i)
      hash = ((hash << 5) - hash + char) | 0
    }
    return `${hash}_${content.length}`
  }

  // ============================================================================
  // Context Item Management
  // ============================================================================

  /**
   * Add a context item with automatic token tracking
   */
  export function addItem(
    sessionID: string,
    item: Omit<ContextItem, "tokenCount" | "lastAccessedAt" | "accessCount" | "relevanceScore">,
  ): ContextItem {
    if (!isEnabled()) {
      return {
        ...item,
        tokenCount: 0,
        lastAccessedAt: Date.now(),
        accessCount: 1,
        relevanceScore: 1.0,
      }
    }

    const ctx = getSessionContext(sessionID)
    const tokenCount = estimateTokens(item.content)
    const now = Date.now()

    const fullItem: ContextItem = {
      ...item,
      tokenCount,
      lastAccessedAt: now,
      accessCount: 1,
      relevanceScore: 1.0, // Start at full relevance
    }

    // Track high-token items separately (images, large files, etc.)
    if (tokenCount > 5000 || item.type === "image") {
      ctx.highTokenRefs.set(item.id, {
        pointer: item.id,
        tokenCount,
        lastContent: item.content.slice(0, 200), // Keep preview
      })
      log.info("Tracked high-token item", { id: item.id, tokenCount, type: item.type })
    }

    ctx.items.set(item.id, fullItem)

    // Check threshold after adding
    checkThreshold(sessionID)

    return fullItem
  }

  /**
   * Get a context item (updates access stats)
   */
  export function getItem(sessionID: string, itemId: string): ContextItem | undefined {
    if (!isEnabled()) return undefined

    const ctx = getSessionContext(sessionID)
    const item = ctx.items.get(itemId)

    if (item) {
      item.lastAccessedAt = Date.now()
      item.accessCount++
      Bus.publish(Event.CacheHit, { sessionID, itemId })
    }

    return item
  }

  /**
   * Remove a context item
   */
  export function removeItem(
    sessionID: string,
    itemId: string,
    reason: "decay" | "threshold" | "manual" | "ttl" = "manual",
  ): boolean {
    if (!isEnabled()) return false

    const ctx = getSessionContext(sessionID)
    const removed = ctx.items.delete(itemId)
    ctx.highTokenRefs.delete(itemId)

    if (removed) {
      Bus.publish(Event.ItemEvicted, { sessionID, itemId, reason })
      log.info("Removed context item", { sessionID, itemId, reason })
    }

    return removed
  }

  // ============================================================================
  // Context Decay
  // ============================================================================

  const DEFAULT_DECAY_CONFIG: DecayConfig = {
    baseRate: Flag.OPENCODE_CONTEXT_DECAY_RATE,
    minRelevance: 0.1,
    recentTurnsProtected: 2,
    highPriorityBoost: 0.3,
  }

  /**
   * Apply decay to all context items based on turn count
   */
  export function applyDecay(sessionID: string, config: Partial<DecayConfig> = {}): number {
    if (!isEnabled()) return 0

    const ctx = getSessionContext(sessionID)
    const cfg = { ...DEFAULT_DECAY_CONFIG, ...config }

    ctx.turnCount++
    let decayedCount = 0
    const toRemove: string[] = []

    for (const [id, item] of ctx.items) {
      // Skip context chips - they're injected fresh each time
      if (item.type === "context_chip") continue

      // Calculate age in turns
      const messageIndex = item.metadata?.messageIndex ?? 0
      const turnsOld = ctx.turnCount - messageIndex

      // Protect recent turns
      if (turnsOld <= cfg.recentTurnsProtected) continue

      // Calculate decay factor
      let decayFactor = cfg.baseRate * (turnsOld - cfg.recentTurnsProtected)

      // Boost high-access items (frequently accessed = more relevant)
      if (item.accessCount > 3) {
        decayFactor *= 0.5 // Decay slower for frequently accessed items
      }

      // Apply decay
      item.relevanceScore = Math.max(cfg.minRelevance, item.relevanceScore - decayFactor)
      decayedCount++

      // Mark for removal if below threshold
      if (item.relevanceScore <= cfg.minRelevance) {
        toRemove.push(id)
      }
    }

    // Remove items below minimum relevance
    for (const id of toRemove) {
      removeItem(sessionID, id, "decay")
    }

    log.info("Applied context decay", {
      sessionID,
      turnCount: ctx.turnCount,
      decayedCount,
      removedCount: toRemove.length,
    })

    return decayedCount
  }

  /**
   * Boost relevance of an item (when it's referenced/used)
   */
  export function boostRelevance(sessionID: string, itemId: string, boost = 0.2): void {
    if (!isEnabled()) return

    const ctx = getSessionContext(sessionID)
    const item = ctx.items.get(itemId)

    if (item) {
      item.relevanceScore = Math.min(1.0, item.relevanceScore + boost)
      item.lastAccessedAt = Date.now()
      item.accessCount++
    }
  }

  // ============================================================================
  // Threshold Monitoring & Auto-Cleanup
  // ============================================================================

  /**
   * Check if context usage exceeds threshold and trigger cleanup if needed
   */
  export function checkThreshold(sessionID: string): boolean {
    if (!isEnabled()) return false

    const stats = getStats(sessionID)
    const threshold = Flag.OPENCODE_CONTEXT_THRESHOLD

    if (stats.usagePercent >= threshold) {
      log.warn("Context threshold reached", {
        sessionID,
        usagePercent: stats.usagePercent,
        threshold,
      })

      Bus.publish(Event.ThresholdReached, {
        sessionID,
        usagePercent: stats.usagePercent,
        tokenCount: stats.usedTokens,
      })

      // Trigger auto-cleanup
      autoCleanup(sessionID, threshold * 0.8) // Clean down to 80% of threshold

      return true
    }

    return false
  }

  /**
   * Automatic cleanup to bring usage below target
   */
  export function autoCleanup(sessionID: string, targetPercent = 0.6): number {
    if (!isEnabled()) return 0

    const ctx = getSessionContext(sessionID)
    let removedCount = 0
    let removedTokens = 0
    const targetTokens = ctx.contextLimit * targetPercent

    // Sort items by relevance (lowest first) and then by age
    const sortedItems = Array.from(ctx.items.entries())
      .filter(([_, item]) => item.type !== "context_chip") // Never remove context chips
      .sort((a, b) => {
        // Primary: relevance score (ascending)
        if (a[1].relevanceScore !== b[1].relevanceScore) {
          return a[1].relevanceScore - b[1].relevanceScore
        }
        // Secondary: last accessed (oldest first)
        return a[1].lastAccessedAt - b[1].lastAccessedAt
      })

    // Calculate current usage
    let currentTokens = Array.from(ctx.items.values()).reduce((sum, item) => sum + item.tokenCount, 0)

    // Remove items until we're below target
    for (const [id, item] of sortedItems) {
      if (currentTokens <= targetTokens) break

      // Prefer removing high-token items first if they have low relevance
      if (ctx.highTokenRefs.has(id)) {
        removeItem(sessionID, id, "threshold")
        currentTokens -= item.tokenCount
        removedTokens += item.tokenCount
        removedCount++
        continue
      }

      // Remove low-relevance items
      if (item.relevanceScore < 0.5) {
        removeItem(sessionID, id, "threshold")
        currentTokens -= item.tokenCount
        removedTokens += item.tokenCount
        removedCount++
      }
    }

    log.info("Auto-cleanup completed", {
      sessionID,
      removedCount,
      removedTokens,
      newUsagePercent: (currentTokens / ctx.contextLimit) * 100,
    })

    return removedCount
  }

  // ============================================================================
  // High-Token Item Management
  // ============================================================================

  /**
   * Replace high-token content with a pointer reference
   * Returns the pointer that can be used to retrieve the content later
   */
  export function compactHighTokenItem(sessionID: string, itemId: string): string | undefined {
    if (!isEnabled()) return undefined

    const ctx = getSessionContext(sessionID)
    const item = ctx.items.get(itemId)

    if (!item) return undefined

    // Store reference
    ctx.highTokenRefs.set(itemId, {
      pointer: itemId,
      tokenCount: item.tokenCount,
      lastContent: item.content,
    })

    // Replace content with pointer
    const pointer = `[CONTEXT_REF:${itemId}]`
    item.content = pointer
    item.tokenCount = estimateTokens(pointer)
    item.metadata = { ...item.metadata, isCompacted: true }

    log.info("Compacted high-token item", { sessionID, itemId, originalTokens: ctx.highTokenRefs.get(itemId)?.tokenCount })

    return pointer
  }

  /**
   * Restore compacted content from pointer reference
   */
  export function expandPointer(sessionID: string, pointer: string): string | undefined {
    if (!isEnabled()) return undefined

    const match = pointer.match(/\[CONTEXT_REF:([^\]]+)\]/)
    if (!match) return undefined

    const itemId = match[1]
    const ctx = getSessionContext(sessionID)
    const ref = ctx.highTokenRefs.get(itemId)

    if (ref?.lastContent) {
      log.info("Expanded context pointer", { sessionID, itemId })
      return ref.lastContent
    }

    return undefined
  }

  /**
   * Get all high-token item references (for offering to the model)
   */
  export function getHighTokenRefs(sessionID: string): Array<{ id: string; tokenCount: number; preview: string }> {
    if (!isEnabled()) return []

    const ctx = getSessionContext(sessionID)
    return Array.from(ctx.highTokenRefs.entries()).map(([id, ref]) => ({
      id,
      tokenCount: ref.tokenCount,
      preview: ref.lastContent?.slice(0, 100) ?? "",
    }))
  }

  // ============================================================================
  // Context Chips (Fresh Injection)
  // ============================================================================

  /**
   * Register a context chip (injected fresh each message, never stored)
   */
  export function registerContextChip(sessionID: string, chipId: string): void {
    if (!isEnabled()) return

    const ctx = getSessionContext(sessionID)
    ctx.contextChips.add(chipId)
  }

  /**
   * Unregister a context chip
   */
  export function unregisterContextChip(sessionID: string, chipId: string): void {
    if (!isEnabled()) return

    const ctx = getSessionContext(sessionID)
    ctx.contextChips.delete(chipId)
  }

  /**
   * Get all registered context chip IDs
   */
  export function getContextChipIds(sessionID: string): string[] {
    if (!isEnabled()) return []

    const ctx = getSessionContext(sessionID)
    return Array.from(ctx.contextChips)
  }

  /**
   * Check if an ID is a context chip (for fresh injection logic)
   */
  export function isContextChip(sessionID: string, itemId: string): boolean {
    if (!isEnabled()) return false

    const ctx = getSessionContext(sessionID)
    return ctx.contextChips.has(itemId)
  }

  // ============================================================================
  // Statistics & Monitoring
  // ============================================================================

  /**
   * Get context statistics for a session
   */
  export function getStats(sessionID: string): ContextStats {
    const ctx = getSessionContext(sessionID)

    let totalTokens = 0
    let decayedItems = 0

    for (const item of ctx.items.values()) {
      totalTokens += item.tokenCount
      if (item.relevanceScore < 1.0) decayedItems++
    }

    return {
      totalTokens: ctx.contextLimit,
      usedTokens: totalTokens,
      usagePercent: ctx.contextLimit > 0 ? (totalTokens / ctx.contextLimit) * 100 : 0,
      itemCount: ctx.items.size,
      highTokenItems: ctx.highTokenRefs.size,
      cachedItems: tokenEstimateCache.size + relevanceCache.size,
      decayedItems,
    }
  }

  /**
   * Get items sorted by relevance (for selective context building)
   */
  export function getItemsByRelevance(
    sessionID: string,
    options: {
      minRelevance?: number
      maxTokens?: number
      types?: ContextItem["type"][]
    } = {},
  ): ContextItem[] {
    if (!isEnabled()) return []

    const ctx = getSessionContext(sessionID)
    const { minRelevance = 0, maxTokens = Infinity, types } = options

    let items = Array.from(ctx.items.values())
      .filter((item) => item.relevanceScore >= minRelevance)
      .filter((item) => !types || types.includes(item.type))
      .sort((a, b) => b.relevanceScore - a.relevanceScore)

    // Trim to max tokens
    if (maxTokens < Infinity) {
      let tokenCount = 0
      items = items.filter((item) => {
        if (tokenCount + item.tokenCount <= maxTokens) {
          tokenCount += item.tokenCount
          return true
        }
        return false
      })
    }

    return items
  }

  // ============================================================================
  // Cleanup & Maintenance
  // ============================================================================

  /**
   * Clear all context for a session
   */
  export function clearSession(sessionID: string): void {
    sessionContexts.delete(sessionID)
    log.info("Cleared session context", { sessionID })
  }

  /**
   * Prune all caches (call periodically)
   */
  export function pruneCaches(): number {
    const pruned =
      tokenEstimateCache.prune() + relevanceCache.prune() + contentHashCache.prune()

    if (pruned > 0) {
      log.info("Pruned caches", { count: pruned })
    }

    return pruned
  }

  /**
   * Get global cache stats
   */
  export function getCacheStats(): {
    tokenCache: number
    relevanceCache: number
    contentHashCache: number
    sessions: number
  } {
    return {
      tokenCache: tokenEstimateCache.size,
      relevanceCache: relevanceCache.size,
      contentHashCache: contentHashCache.size,
      sessions: sessionContexts.size,
    }
  }
}
