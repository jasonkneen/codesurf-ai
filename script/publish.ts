#!/usr/bin/env bun

import { $ } from "bun"
import { createOpencode } from "@opencode-ai/sdk/server"
import { Script } from "@opencode-ai/script"

// Helper: fetch with timeout
async function fetchWithTimeout(url: string, timeoutMs = 10000): Promise<Response> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, { signal: controller.signal })
  } finally {
    clearTimeout(timeout)
  }
}

// Helper: promise with timeout
async function withTimeout<T>(promise: Promise<T>, timeoutMs: number, fallback: T): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), timeoutMs)),
  ])
}

const notes = [] as string[]

console.log("=== publishing ===\n")

if (!Script.preview) {
  // Pre-flight check: ensure version doesn't already exist
  const existingTag = await $`git tag -l v${Script.version}`.text()
  if (existingTag.trim()) {
    console.error(`\n❌ Version v${Script.version} already has a git tag. Use a different version.\n`)
    process.exit(1)
  }

  const npmVersionCheck = await fetchWithTimeout(`https://registry.npmjs.org/codesurf-ai/${Script.version}`, 5000)
    .then((res) => res.ok)
    .catch(() => false)
  if (npmVersionCheck) {
    console.error(`\n❌ Version ${Script.version} already published to npm. Use a different version.\n`)
    process.exit(1)
  }

  console.log(`✓ Version ${Script.version} is available for publishing\n`)

  const previous = await fetchWithTimeout("https://registry.npmjs.org/codesurf-ai/latest", 10000)
    .then((res) => {
      if (!res.ok) return null
      return res.json()
    })
    .then((data: any) => {
      const version = data?.version
      // Validate version format to prevent command injection
      if (version && !/^[0-9]+\.[0-9]+\.[0-9]+(-[a-zA-Z0-9.-]+)?(\+[a-zA-Z0-9.-]+)?$/.test(version)) {
        console.warn(`Invalid version format from npm: ${version}, using fallback`)
        return null
      }
      return version
    })
    .catch(() => null)

  // Get commits for changelog - using safe Bun template strings (no raw shell execution)
  const packages = "packages/opencode packages/sdk packages/plugin"
  let log: string

  if (previous) {
    const tagExists = await $`git rev-parse v${previous}`.nothrow()
    if (tagExists.exitCode === 0) {
      // Safe: Bun's $ template handles escaping, and previous is validated
      log = await $`git log v${previous}..HEAD --oneline --format=%h %s -- ${packages}`.text()
    } else {
      // Fall back to last 50 commits if tag doesn't exist
      console.warn(`Git tag v${previous} not found, using last 50 commits`)
      log = await $`git log -50 --oneline --format=%h %s -- ${packages}`.text()
    }
  } else {
    // No previous version on npm, use last 50 commits
    console.warn("No previous version on npm, using last 50 commits")
    log = await $`git log -50 --oneline --format=%h %s -- ${packages}`.text()
  }

  const commits = log
    .split("\n")
    .filter((line) => line && !line.match(/^\w+ (ignore:|test:|chore:|ci:)/i))
    .join("\n")

  const opencode = await createOpencode()
  const session = await opencode.client.session.create()
  console.log("generating changelog since " + previous)

  // Changelog generation with 60-second timeout and fallback
  const changelogPromise = opencode.client.session
    .prompt({
      path: {
        id: session.data!.id,
      },
      body: {
        model: {
          providerID: "opencode",
          modelID: "claude-haiku-4-5",
        },
        parts: [
          {
            type: "text",
            text: `
          Analyze these commits and generate a changelog of all notable user facing changes.

          Commits between ${previous} and HEAD:
          ${commits}

          - Do NOT make general statements about "improvements", be very specific about what was changed.
          - Do NOT include any information about code changes if they do not affect the user facing changes.
          - For commits that are already well-written and descriptive, avoid rewording them. Simply capitalize the first letter, fix any misspellings, and ensure proper English grammar.
          - DO NOT read any other commits than the ones listed above (THIS IS IMPORTANT TO AVOID DUPLICATING THINGS IN OUR CHANGELOG)
          - If a commit was made and then reverted do not include it in the changelog. If the commits only include a revert but not the original commit, then include the revert in the changelog.

          IMPORTANT: ONLY return a bulleted list of changes, do not include any other information. Do not include a preamble like "Based on my analysis..."

          <example>
          - Added ability to @ mention agents
          - Fixed a bug where the TUI would render improperly on some terminals
          </example>
          `,
          },
        ],
      },
    })
    .then((x) => x.data?.parts?.find((y) => y.type === "text")?.text)

  const raw = await withTimeout(changelogPromise, 60000, null)
  if (raw === null) {
    console.warn("⚠️  Changelog generation timed out, using fallback message")
    notes.push("- See commit history for detailed changes")
  } else {
    for (const line of raw?.split("\n") ?? []) {
      if (line.startsWith("- ")) {
        notes.push(line)
      }
    }
  }
  console.log("---- Generated Changelog ----")
  console.log(notes.join("\n"))
  console.log("-----------------------------")
  opencode.server.close()

  // Get contributors
  const team = [
    "actions-user",
    "opencode",
    "rekram1-node",
    "thdxr",
    "kommander",
    "jayair",
    "fwang",
    "adamdotdevin",
    "opencode-agent[bot]",
  ]
  const compare =
    await $`gh api "/repos/sst/opencode/compare/v${previous}...HEAD" --jq '.commits[] | {login: .author.login, message: .commit.message}'`.text()
  const contributors = new Map<string, string[]>()

  for (const line of compare.split("\n").filter(Boolean)) {
    const { login, message } = JSON.parse(line) as { login: string | null; message: string }
    const title = message.split("\n")[0] ?? ""
    if (title.match(/^(ignore:|test:|chore:|ci:|release:)/i)) continue

    if (login && !team.includes(login)) {
      if (!contributors.has(login)) contributors.set(login, [])
      contributors.get(login)?.push(title)
    }
  }

  if (contributors.size > 0) {
    notes.push("")
    notes.push(`**Thank you to ${contributors.size} community contributor${contributors.size > 1 ? "s" : ""}:**`)
    for (const [username, userCommits] of contributors) {
      notes.push(`- @${username}:`)
      for (const commit of userCommits) {
        notes.push(`  - ${commit}`)
      }
    }
  }
}

const pkgjsons = await Array.fromAsync(
  new Bun.Glob("**/package.json").scan({
    absolute: true,
  }),
).then((arr) => arr.filter((x) => !x.includes("node_modules") && !x.includes("dist")))

for (const file of pkgjsons) {
  let pkg = await Bun.file(file).text()
  pkg = pkg.replaceAll(/"version": "[^"]+"/g, `"version": "${Script.version}"`)
  console.log("updated:", file)
  await Bun.file(file).write(pkg)
}

const extensionToml = new URL("../packages/extensions/zed/extension.toml", import.meta.url).pathname
let toml = await Bun.file(extensionToml).text()
toml = toml.replace(/^version = "[^"]+"/m, `version = "${Script.version}"`)
toml = toml.replaceAll(/releases\/download\/v[^/]+\//g, `releases/download/v${Script.version}/`)
console.log("updated:", extensionToml)
await Bun.file(extensionToml).write(toml)

await $`bun install`

console.log("\n=== opencode ===\n")
await import(`../packages/opencode/script/publish.ts`)

console.log("\n=== sdk ===\n")
await import(`../packages/sdk/js/script/publish.ts`)

console.log("\n=== plugin ===\n")
await import(`../packages/plugin/script/publish.ts`)

const dir = new URL("..", import.meta.url).pathname
process.chdir(dir)

if (!Script.preview) {
  await $`git commit -am "release: v${Script.version}"`
  await $`git tag v${Script.version}`
  await $`git fetch origin`
  await $`git cherry-pick HEAD..origin/dev`.nothrow()
  await $`git push origin HEAD --tags --no-verify --force-with-lease`
  await new Promise((resolve) => setTimeout(resolve, 5_000))
  await $`gh release create v${Script.version} --title "v${Script.version}" --notes ${notes.join("\n") ?? "No notable changes"} ./packages/opencode/dist/*.zip ./packages/opencode/dist/*.tar.gz`
}
