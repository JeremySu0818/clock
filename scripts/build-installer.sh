#!/usr/bin/env sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
ROOT_DIR=$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)
PLATFORM=$(uname -s)

cd "$ROOT_DIR"

echo '[1/4] Installing npm dependencies...'
npm install

echo '[2/4] Building Electron output...'
npm run clean:release
npm run typecheck
npx electron-vite build

echo '[3/4] Building platform installer...'
case "$PLATFORM" in
  Linux)
    npx electron-builder --linux AppImage deb --x64 --config.directories.output=installer-release --publish never
    ;;
  Darwin)
    npx electron-builder --mac dmg zip --x64 --config.directories.output=installer-release --publish never
    ;;
  *)
    echo "Unsupported Unix platform: $PLATFORM" >&2
    exit 1
    ;;
esac

echo '[4/4] Done.'
echo "Installer output: $ROOT_DIR/installer-release"
