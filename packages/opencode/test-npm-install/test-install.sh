#!/bin/bash
set -e

echo "========================================"
echo "  codesurf-ai Local Install Test"
echo "========================================"
echo ""

# Check if packages are mounted
if [ ! -d "/packages" ]; then
    echo "ERROR: /packages not mounted!"
    echo "Run with: docker-compose up"
    exit 1
fi

echo "Available packages (source):"
ls -la /packages/
echo ""

# Copy packages to writable location (npm needs to chmod)
echo "Copying packages to writable location..."
mkdir -p /test/local-packages
cp -r /packages/* /test/local-packages/
chmod -R 755 /test/local-packages/
echo ""

# Check for required packages
META_PKG="/test/local-packages/codesurf-ai"
if [ ! -d "$META_PKG" ]; then
    echo "ERROR: Meta package not found at $META_PKG"
    echo "Did you run 'bun run build' first?"
    exit 1
fi

# Find platform package (linux arm64 for Docker on Apple Silicon, or x64)
ARCH=$(uname -m)
if [ "$ARCH" = "aarch64" ] || [ "$ARCH" = "arm64" ]; then
    PLATFORM_PKG="/test/local-packages/codesurf-ai-linux-arm64"
else
    PLATFORM_PKG="/test/local-packages/codesurf-ai-linux-x64"
fi
if [ ! -d "$PLATFORM_PKG" ]; then
    echo "WARNING: Linux x64 platform package not found"
    echo "Available platform packages:"
    ls -d /test/local-packages/codesurf-ai-* 2>/dev/null || echo "  None found"
    echo ""
    echo "You may need to build for linux: bun run build (without --single)"
    PLATFORM_PKG=""
fi

echo "========================================"
echo "  Package Contents"
echo "========================================"
echo ""
echo "Meta package.json:"
cat "$META_PKG/package.json"
echo ""

if [ -n "$PLATFORM_PKG" ]; then
    echo "Platform package.json:"
    cat "$PLATFORM_PKG/package.json"
    echo ""
fi

echo "========================================"
echo "  npm pack --dry-run"
echo "========================================"
echo ""
cd "$META_PKG"
npm pack --dry-run
echo ""

echo "========================================"
echo "  Fresh Install Test"
echo "========================================"
echo ""

# Create fresh test project
cd /test
rm -rf project
mkdir project
cd project
npm init -y > /dev/null

echo "Installing packages (ignoring scripts for local install test)..."
npm install "$META_PKG" --save --ignore-scripts
if [ -n "$PLATFORM_PKG" ]; then
    npm install "$PLATFORM_PKG" --save --ignore-scripts
fi

# Manually create the symlink that postinstall would create
if [ -n "$PLATFORM_PKG" ] && [ -d "node_modules/$(basename $PLATFORM_PKG)" ]; then
    PLATFORM_BIN="node_modules/$(basename $PLATFORM_PKG)/bin/codesurf"
    if [ -f "$PLATFORM_BIN" ]; then
        echo "Creating manual symlink for testing..."
        mkdir -p node_modules/.bin
        ln -sf "../$(basename $PLATFORM_PKG)/bin/codesurf" node_modules/.bin/codesurf-binary
    fi
fi

echo ""
echo "Installed packages:"
ls -la node_modules/

echo ""
echo "Bin links:"
ls -la node_modules/.bin/ || echo "No bin links"

echo ""
echo "========================================"
echo "  Binary Test"
echo "========================================"
echo ""

if [ -n "$PLATFORM_PKG" ]; then
    PLATFORM_NAME=$(basename $PLATFORM_PKG)
    BINARY_PATH="node_modules/$PLATFORM_NAME/bin/codesurf"

    echo "Testing binary directly at: $BINARY_PATH"
    if [ -f "$BINARY_PATH" ]; then
        chmod +x "$BINARY_PATH"
        "$BINARY_PATH" --version && echo "SUCCESS!" || echo "FAILED!"
    else
        echo "Binary not found at $BINARY_PATH"
        ls -la "node_modules/$PLATFORM_NAME/bin/" 2>/dev/null || echo "bin directory not found"
    fi
else
    echo "Skipping binary test (no linux platform package)"
fi

echo ""
echo "========================================"
echo "  Test Complete"
echo "========================================"
