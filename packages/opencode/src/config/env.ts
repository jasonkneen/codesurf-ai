export function setupEnv() {
  process.env.AGENT = "1"
  process.env.OPENCODE = "1"
  process.env.CODESURF = "1"
  process.env["CODESURF"] = "1"
  process.env["OPENCODE"] = "1" // Keep for backwards compatibility
}
