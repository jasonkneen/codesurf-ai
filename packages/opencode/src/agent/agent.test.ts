import { describe, expect, it } from "bun:test"
import { mergeAgentPermissions } from "./agent"

describe("mergeAgentPermissions", () => {
  it("should merge basic permissions", () => {
    const base = {
      edit: "allow",
      webfetch: "deny",
    }
    const override = {
      edit: "deny",
    }
    const result = mergeAgentPermissions(base, override)
    expect(result.edit).toBe("deny")
    expect(result.webfetch).toBe("deny")
  })

  it("should merge bash permissions when both are objects", () => {
    const base = {
      bash: {
        "ls": "allow",
        "rm": "deny",
      },
    }
    const override = {
      bash: {
        "ls": "deny",
      },
    }
    const result = mergeAgentPermissions(base, override)
    expect(result.bash).toEqual({
      "ls": "deny",
      "rm": "deny",
      "*": "allow",
    })
  })

  it("should handle string bash permission in base", () => {
    const base = {
      bash: "deny",
    }
    const override = {
      bash: {
        "ls": "allow",
      },
    }
    const result = mergeAgentPermissions(base, override)
    expect(result.bash).toEqual({
      "*": "deny",
      "ls": "allow",
    })
  })

  it("should handle string bash permission in override", () => {
    const base = {
      bash: {
        "ls": "allow",
      },
    }
    const override = {
      bash: "deny",
    }
    const result = mergeAgentPermissions(base, override)
    expect(result.bash).toEqual({
      "*": "deny",
      "ls": "allow",
    })
  })

  it("should default to allow for missing permissions", () => {
    const result = mergeAgentPermissions({}, {})
    expect(result.edit).toBe("allow")
    expect(result.webfetch).toBe("allow")
    expect(result.bash).toEqual({ "*": "allow" })
  })
})
