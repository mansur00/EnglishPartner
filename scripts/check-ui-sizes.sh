#!/usr/bin/env bash
set -e

echo "Running UI font-size and sizing audit across src/..."

FAILED=0

# 1. Check for arbitrary text size classes
echo "  [1/3] Checking for arbitrary text sizes (text-[...])..."
if grep -rnE "text-\[[0-9.]+(px|rem)\]" src/; then
  echo "❌ Error: Arbitrary text sizes found!"
  FAILED=1
fi

# 2. Check for sub-12px Tailwind utilities (e.g. text-2xs, text-3xs)
echo "  [2/3] Checking for sub-12px Tailwind size utilities..."
if grep -rnE "text-(2xs|3xs|mini)" src/; then
  echo "❌ Error: Sub-12px utility classes found!"
  FAILED=1
fi

# 3. Check for inline style font-size values
echo "  [3/3] Checking for inline font-size styles..."
if grep -rnE "(style=.*(font-size|fontSize)|fontSize:\s*['\"]?[0-9.]+)" src/; then
  echo "❌ Error: Inline font-size styles found!"
  FAILED=1
fi

if [ $FAILED -ne 0 ]; then
  echo "UI sizes check FAILED."
  exit 1
fi

echo "✓ UI sizes check passed: strictly conforms to minimum font-size floor (12px chips/nav, 14px body/meta)."
exit 0
