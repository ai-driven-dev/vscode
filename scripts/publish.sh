#!/bin/bash

# Change to the root directory of the project
cd "$(dirname "$0")/.."

echo "Publishing to Open VSX Registry and VS Code Marketplace..."
echo "Current directory: $(pwd)"

# Exit on error
set -e

# Load environment variables
if [ ! -f .env ]; then
    echo "Error: .env file not found"
    echo "Please create a .env file based on .env.example"
    exit 1
fi

# Source the .env file
set -a
source .env
set +a

# Verify OPEN_VSX_TOKEN is set
if [ -z "$OPEN_VSX_TOKEN" ]; then
    echo "Error: OPEN_VSX_TOKEN is not set in .env file"
    echo "Please add your Open VSX token to .env file"
    exit 1
fi

# Run tests
npm run test --  --reporter=basic

# Build the extension
npm run compile # compile the extension
node setup.js # generate package.json

# Package the extension
echo "Packaging extension..."
npx vsce package

# Publish to Open VSX Registry
echo "Publishing to Open VSX Registry..."
npx ovsx publish *.vsix --pat $OPEN_VSX_TOKEN

# Publish to VS Code Marketplace
echo "Publishing to VS Code Marketplace..."
npx vsce publish

# Clean up
rm *.vsix
