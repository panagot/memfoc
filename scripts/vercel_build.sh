#!/usr/bin/env sh
set -e

cd demo/web
npm ci
npm run build

mkdir -p ../../public
cp -r dist/* ../../public/
