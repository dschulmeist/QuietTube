#!/usr/bin/env bash
#
# Builds a .zip file ready for Chrome Web Store upload.
# Usage: ./scripts/package.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

VERSION=$(grep '"version"' "$ROOT_DIR/manifest.json" | head -1 | sed 's/.*: *"\(.*\)".*/\1/')
OUTPUT="$ROOT_DIR/quiettube-${VERSION}.zip"

cd "$ROOT_DIR"

rm -f "$OUTPUT"

zip -r "$OUTPUT" \
  manifest.json \
  config.js \
  content.css \
  content.js \
  popup.html \
  popup.js \
  icons/ \
  LICENSE \
  -x "*.DS_Store"

echo "Packaged: $OUTPUT ($(du -h "$OUTPUT" | cut -f1))"
