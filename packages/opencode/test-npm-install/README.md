# codesurf-ai npm Install Test

Docker-based testing for verifying npm package installation in a clean environment.

## Prerequisites

1. Build the packages first:
   ```bash
   cd packages/opencode

   # Build for current platform only (quick test)
   bun run build --single

   # OR build for all platforms (full test including Linux for Docker)
   bun run build
   ```

2. Create the meta package:
   ```bash
   # This is normally done by publish.ts, but for testing:
   mkdir -p dist/codesurf-ai
   cp -r bin dist/codesurf-ai/
   cp script/preinstall.mjs dist/codesurf-ai/
   cp script/postinstall.mjs dist/codesurf-ai/
   cp README.md dist/codesurf-ai/

   # Create package.json (adjust version as needed)
   cat > dist/codesurf-ai/package.json << 'EOF'
   {
     "name": "codesurf-ai",
     "version": "0.0.0-test",
     "description": "AI coding agent for the terminal",
     "bin": { "codesurf": "./bin/codesurf", "surf": "./bin/surf" },
     "optionalDependencies": {
       "codesurf-ai-linux-x64": "0.0.0-test"
     }
   }
   EOF
   ```

## Usage

### Run Automated Test
```bash
cd test-npm-install
docker-compose up --build test
```

### Interactive Shell (for manual testing)
```bash
cd test-npm-install
docker-compose run --build shell

# Inside container:
ls /packages/                    # See available packages
npm init -y
npm install /packages/codesurf-ai
npm install /packages/codesurf-ai-linux-x64
npx codesurf --version
```

### Clean Up
```bash
docker-compose down --rmi local
```

## What Gets Tested

1. **Package Structure** - Verifies package.json has required fields
2. **npm pack** - Ensures package can be packed without errors
3. **Fresh Install** - Installs in empty project directory
4. **Binary Execution** - Runs `codesurf --version` and `surf --version`

## Troubleshooting

### "Meta package not found"
Run `bun run build` first to create the dist folder.

### "Linux x64 platform package not found"
Run `bun run build` without `--single` to build all platforms.

### Binary test fails
Check that the platform package matches the Docker architecture (linux-x64).
