#!/usr/bin/env sh
set -eu

echo "=== MemFOC Vercel build: frontend -> demo/server/static ==="
node --version
npm --version

cd demo/web
npm run build

cd ../..
rm -rf demo/server/static
mkdir -p demo/server/static
cp -r demo/web/dist/* demo/server/static/

echo "=== demo/server/static contents ==="
ls -la demo/server/static/
