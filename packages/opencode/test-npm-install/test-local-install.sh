#!/bin/bash
set -e

echo "=== Testing codesurf-ai local npm installation ==="
echo ""

# Check if dist packages are mounted
if [ ! -d "/packages" ]; then
    echo "Error: /packages not mounted. Run with docker-compose."
    exit 1
fi

# List available packages
echo "Available packages in /packages:"
ls -la /packages/
echo ""

# Find the meta package
META_PKG=$(find /packages -maxdepth 1 -name "codesurf-ai" -type d | head -1)
if [ -z "$META_PKG" ]; then
    echo "Error: codesurf-ai meta package not found in /packages"
    echo "Did you run 'bun run build' first?"
    exit 1
fi

echo "Found meta package: $META_PKG"
echo ""

# Show package.json contents
echo "=== Meta package.json ==="
cat "$META_PKG/package.json"
echo ""
echo ""

# Try npm pack (dry run)
echo "=== Running npm pack (creates tarball without publishing) ==="
cd "$META_PKG"
npm pack --dry-run
echo ""

# Test local install
echo "=== Testing local install ==="
cd /home/testuser
mkdir -p test-project
cd test-project
npm init -y > /dev/null

echo "Installing from local package..."
npm install "$META_PKG" --save

echo ""
echo "=== Checking installed binaries ==="
ls -la node_modules/.bin/ || echo "No binaries found"

echo ""
echo "=== Testing codesurf command ==="
npx codesurf --version || echo "codesurf --version failed (expected without platform binary)"

echo ""
echo "=== Test complete ==="
