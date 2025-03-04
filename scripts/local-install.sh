#!/bin/bash

# Enable strict error handling
set -e

# # Security and dependency updates
# echo "Updating all dependencies to latest versions..."

# # Update npm itself first
# npm install -g npm@latest

# # Clean install and update dependencies
# rm -rf node_modules package-lock.json
# npm install


# # Update specific packages with known issues
# npm update --save
# npm upgrade --save

# # Pin @types/vscode version because engine is 1.93.1
# npm install --save-dev @types/vscode@1.93.0

# # Final security fixes
# npm audit fix --force

# Build and test phase
npm run test

# VSCode extension build
rm -rf ./extension_aidd/out
node setup.js
cd ./extension_aidd/
npm run compile
npx @vscode/vsce package

# Extension installation
declare -a installers=("code" "cursor" "windsurf")

for installer in "${installers[@]}"; do
  if [ -x "$(command -v "$installer")" ]; then
    "$installer" --install-extension *.vsix
  fi
done

# Cleanup
rm -rf *.vsix 