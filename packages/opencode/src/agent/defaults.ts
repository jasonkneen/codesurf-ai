import { Agent } from "./agent"
import PROMPT_ORCHESTRATOR from "../session/prompt/orchestrator.txt"

export function createDefaultAgents(
  defaultTools: Record<string, boolean>,
  agentPermission: Agent.Info["permission"],
  planPermission: Agent.Info["permission"],
): Record<string, Agent.Info> {
  const createBuildAgent = (name: string): Agent.Info => ({
    name,
    description:
      "General-purpose agent for researching complex questions, searching for code, and executing multi-step tasks. When you are searching for a keyword or file and are not confident that you will find the right match in the first few tries use this agent to perform the search for you.",
    roleDefinition: "Full-capability implementation agent with all tools",
    tools: {
      todoread: true,
      todowrite: true,
      switch_mode: true,
      complete_task: true,
      ...defaultTools,
    },

    options: {},
    permission: agentPermission,
    capabilities: {
      canCreateSubtasks: true,
      canSwitchModes: true,
      canModifyFiles: true,
      canExecuteCommands: true,
    },
    mode: "primary",
    builtIn: true,
  })

  return {
    build: createBuildAgent("build"),
    general: createBuildAgent("general"),

    plan: {
      name: "plan",
      description: "Read-only planning and analysis agent for architecture design and planning",
      roleDefinition: "Strategic planner who analyzes and designs without making changes",
      options: {},
      permission: planPermission,
      tools: {
        switch_mode: true,
        complete_task: true,
        ...defaultTools,
      },
      capabilities: {
        canCreateSubtasks: false,
        canSwitchModes: true,
        canModifyFiles: false,
        canExecuteCommands: false,
      },
      mode: "primary",
      builtIn: true,
    },
    architect: {
      name: "architect",
      description: "System design and architecture specialist (markdown-only editing)",
      roleDefinition: "Architecture and design specialist who documents designs in markdown",
      tools: {
        read: true,
        write: true, // But filtered by fileTypeRestrictions
        edit: true, // But filtered by fileTypeRestrictions
        glob: true,
        grep: true,
        list: true,
        bash: false,
        switch_mode: true,
        complete_task: true,
        todowrite: true,
        todoread: true,
        ...defaultTools,
      },
      fileTypeRestrictions: [".md", ".txt", ".json"],
      options: {},
      permission: {
        edit: "allow",
        bash: {
          "git status*": "allow",
          "git log*": "allow",
          "git diff*": "allow",
          "*": "deny",
        },
        webfetch: "allow",
      },
      capabilities: {
        canCreateSubtasks: false,
        canSwitchModes: true,
        canModifyFiles: true,
        canExecuteCommands: false,
      },
      mode: "primary",
      builtIn: true,
    },
    orchestrator: {
      name: "orchestrator",
      description: "Orchestrates complex workflows by coordinating specialized agents",
      roleDefinition: "Strategic workflow coordinator who delegates to specialized modes",
      tools: {
        ...defaultTools,
        // Orchestrator-specific overrides (MUST be after defaultTools to take precedence)
        write: false,
        edit: false,
        bash: false,
        task: true,
        switch_mode: true,
        complete_task: false, // Orchestrator doesn't complete itself
        read: true,
        glob: true,
        grep: true,
        todowrite: true,
        todoread: true,
      },
      options: {},
      permission: {
        edit: "deny",
        bash: {
          "git status*": "allow",
          "git log*": "allow",
          "git diff*": "allow",
          "*": "deny",
        },
        webfetch: "allow",
      },
      capabilities: {
        canCreateSubtasks: true,
        canSwitchModes: true,
        canModifyFiles: false,
        canExecuteCommands: false,
      },
      mode: "primary",
      builtIn: true,
      temperature: 0.3,
      // Model auto-selected based on agent permissions (see prompt.ts resolveModel)
      // Read-only agents automatically use small/cheap models
      prompt: PROMPT_ORCHESTRATOR,
    },
  }
}
