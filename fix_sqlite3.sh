#!/bin/bash
# Fixes sqlite3 related issues (ARCH ONLY | Requires https://nvm.sh)

# Load NVM
NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Install and use node v20
nvm install 20
nvm use 20

# Install pnpm
npm i -g pnpm
pnpm="$HOME/.nvm/versions/node/v20.19.2/bin/pnpm"

# Remove already installed deps
rm -r node_modules/
rm pnpm-lock.yaml

# Reinstall deps
"$pnpm" i

# Build sqlite3
sudo pacman -S python-distutils-extra # Install required dep for building sqlite3
"$pnpm" rebuild sqlite3 # bleh
npx node-gyp rebuild --directory=node_modules/.pnpm/sqlite3@5.1.7/node_modules/sqlite3 # Build sqlite3