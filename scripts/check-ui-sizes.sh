#!/usr/bin/env bash
set -e

echo "Checking for arbitrary font sizes (text-[Npx] or text-[Nrem])..."
if grep -rnE "text-\[[0-9.]+(px|rem)\]" src/; then
  echo "Error: Arbitrary text sizes found!"
  exit 1
fi

echo "UI sizes check passed: zero arbitrary font sizes found."
exit 0
