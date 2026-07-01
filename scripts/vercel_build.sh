#!/usr/bin/env sh
set -eu

echo "=== MemFOC Vercel build: frontend -> public/ ==="
node --version
npm --version

cd demo/web
npm run build

cd ../..
rm -rf public
mkdir -p public
cp -r demo/web/dist/* public/

echo "=== public/ contents ==="
ls -la public/
