import { describe, it, expect } from "bun:test"
import { Session } from "@/session"
import { SessionPrompt } from "@/session/prompt"

describe("Context Chips", () => {
  it("should inject context chips into conversation without storing them", async () => {
    // Create a session
    const session = await Session.create({})
    const sessionID = session.id

    // Define context chips
    const contextChips = [
      {
        id: "ctx_1",
        name: "TODOS",
        content: "Use TodosContext: plan\nalways plan",
      },
      {
        id: "ctx_2",
        name: "plan",
        content: "Always create a plan before implementing",
      },
    ]

    // Send first message WITH context chips
    const msg1 = await SessionPrompt.prompt({
      sessionID,
      agent: "general",
      context: contextChips,
      parts: [
        {
          type: "text",
          text: "Hello, can you help me?",
        },
      ],
      noReply: true, // Don't actually call the model
    })

    // Check that the user message was stored
    expect(msg1.info.role).toBe("user")

    // Get all messages from the session
    const messages1 = await Session.messages({ sessionID })

    // Should only have the user message, NOT the context
    expect(messages1.length).toBe(1)
    expect(messages1[0].info.role).toBe("user")
    expect(messages1[0].parts[0].type).toBe("text")
    expect((messages1[0].parts[0] as any).text).toBe("Hello, can you help me?")

    // Verify context is NOT in stored messages
    const allText = messages1.flatMap((m) => m.parts.filter((p) => p.type === "text").map((p: any) => p.text)).join("")
    expect(allText).not.toContain("TODOS")
    expect(allText).not.toContain("Use TodosContext")

    // Send second message WITHOUT context chips
    await SessionPrompt.prompt({
      sessionID,
      agent: "general",
      parts: [
        {
          type: "text",
          text: "Second message",
        },
      ],
      noReply: true,
    })

    // Get all messages again
    const messages2 = await Session.messages({ sessionID })

    // Should have 2 user messages, still no context stored
    expect(messages2.length).toBe(2)
    expect(messages2.every((m) => m.info.role === "user")).toBe(true)

    // Verify context is still NOT in stored messages
    const allText2 = messages2.flatMap((m) => m.parts.filter((p) => p.type === "text").map((p: any) => p.text)).join("")
    expect(allText2).not.toContain("TODOS")
    expect(allText2).not.toContain("Use TodosContext")

    // Cleanup
    await Session.remove(session.id)
  })

  it("should include context chips in messages sent to model but not persist them", async () => {
    // This test verifies the getMessages function includes context dynamically
    const session = await Session.create({})
    const sessionID = session.id

    const contextChips = [
      {
        id: "ctx_test",
        name: "TestContext",
        content: "This is test context",
      },
    ]

    // Create a message with context
    await SessionPrompt.prompt({
      sessionID,
      agent: "general",
      context: contextChips,
      parts: [
        {
          type: "text",
          text: "Test message",
        },
      ],
      noReply: true,
    })

    // Get persisted messages - should NOT contain context
    const persistedMessages = await Session.messages({ sessionID })
    expect(persistedMessages.length).toBe(1)

    const persistedText = persistedMessages
      .flatMap((m) => m.parts.filter((p) => p.type === "text").map((p: any) => p.text))
      .join("")
    expect(persistedText).not.toContain("TestContext")
    expect(persistedText).not.toContain("This is test context")

    // Cleanup
    await Session.remove(session.id)
  })

  it("should remove context when chips are deactivated", async () => {
    // This test verifies context is not sticky across messages
    const session = await Session.create({})
    const sessionID = session.id

    // First message WITH context
    await SessionPrompt.prompt({
      sessionID,
      agent: "general",
      context: [
        {
          id: "ctx_temp",
          name: "TempContext",
          content: "Temporary context",
        },
      ],
      parts: [
        {
          type: "text",
          text: "Message 1",
        },
      ],
      noReply: true,
    })

    // Second message WITHOUT context (simulating chip being removed)
    await SessionPrompt.prompt({
      sessionID,
      agent: "general",
      context: [], // Empty context
      parts: [
        {
          type: "text",
          text: "Message 2",
        },
      ],
      noReply: true,
    })

    // Get all messages
    const messages = await Session.messages({ sessionID })

    // Should have 2 messages, neither should contain context
    expect(messages.length).toBe(2)

    const allText = messages.flatMap((m) => m.parts.filter((p) => p.type === "text").map((p: any) => p.text)).join("")
    expect(allText).not.toContain("TempContext")
    expect(allText).not.toContain("Temporary context")

    // Cleanup
    await Session.remove(session.id)
  })
})
