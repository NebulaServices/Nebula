#!/bin/bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

nvm install 20
nvm use 20

rm -r ~/.nvm/versions/node/v20.19.2/lib/node_modules/pnpm
npm i -g pnpm
pnpm="$HOME/.nvm/versions/node/v20.19.2/bin/pnpm"

rm -r node_modules/
rm pnpm-lock.yaml
"$pnpm" i

sudo pacman -S python-distutils-extra # sudo apt install python3-distutils-extra -y (on Debian/Ubuntu)
"$pnpm" rebuild sqlite3
npx node-gyp rebuild --directory=node_modules/.pnpm/sqlite3@5.1.7/node_modules/sqlite3
