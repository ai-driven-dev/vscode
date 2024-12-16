#!/bin/bash

# Enable strict error handling
set -e

# Security and dependency updates
echo "Updating all dependencies to latest versions..."

# Update npm itself first
npm install -g npm@latest

# Clean install and update dependencies
rm -rf node_modules package-lock.json
npm install


# Update specific packages with known issues
npm update --save
npm upgrade --save

# Pin @types/vscode version because engine is 1.93.1
npm install --save-dev @types/vscode@1.93.0

# Final security fixes
npm audit fix --force

# Build and test phase
npm run test
npm run compile

# Setup and packaging
node setup.js
npx @vscode/vsce package

# Extension installation
code --install-extension *.vsix
cursor --install-extension *.vsix

# Cleanup
rm -rf *.vsix 