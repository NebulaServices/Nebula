#!/bin/bash
rm -r node_modules/

npm i -g pnpm
pnpm i

sudo apt install python3-distutils-extra -y

pnpm rebuild sqlite3
npx node-gyp rebuild --directory=node_modules/.pnpm/sqlite3@5.1.7/node_modules/sqlite3
