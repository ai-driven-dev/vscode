#!/bin/bash

set -e

npm run test
npm run compile
node setup.js
npx vsce package
code --install-extension *.vsix
cursor --install-extension *.vsix
rm -rf *.vsix 