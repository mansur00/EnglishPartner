#!/usr/bin/env bash
set -e

echo "Running UI font-size, weight, and arbitrary color audit across src/..."

FAILED=0

# 1. Check for arbitrary text size classes
echo "  [1/5] Checking for arbitrary text sizes (text-[...])..."
if grep -rnE "text-\[[0-9.]+(px|rem)\]" src/; then
  echo "❌ Error: Arbitrary text sizes found!"
  FAILED=1
fi

# 2. Check for sub-12px Tailwind utilities (e.g. text-2xs, text-3xs)
echo "  [2/5] Checking for sub-12px Tailwind size utilities..."
if grep -rnE "text-(2xs|3xs|mini)" src/; then
  echo "❌ Error: Sub-12px utility classes found!"
  FAILED=1
fi

# 3. Check for inline style font-size values
echo "  [3/5] Checking for inline font-size styles..."
if grep -rnE "(style=.*(font-size|fontSize)|fontSize:\s*['\"]?[0-9.]+)" src/; then
  echo "❌ Error: Inline font-size styles found!"
  FAILED=1
fi

# 4. Check for arbitrary hex colors ([#...])
echo "  [4/5] Checking for arbitrary hex color classes ([#...])..."
if grep -rnE "\[#[0-9a-fA-F]{3,8}\]" src/; then
  echo "❌ Error: Arbitrary hex color classes found!"
  FAILED=1
fi

# 5. Check for font-bold / weights 700+
echo "  [5/5] Checking for font-bold or weight 700+ (max allowed is 600)..."
if grep -rnE "font-(bold|extrabold|black|\[[7-9]00\])" src/; then
  echo "❌ Error: font-bold or weight 700+ found!"
  FAILED=1
fi
if grep -rnE "(font-weight:\s*[7-9]00|fontWeight:\s*['\"]?[7-9]00)" src/; then
  echo "❌ Error: Inline font-weight 700+ found!"
  FAILED=1
fi

if [ $FAILED -ne 0 ]; then
  echo "UI sizes and tokens check FAILED."
  exit 1
fi

echo "✓ UI audit passed: strictly conforms to minimum font-size floor (12px), max font-weight 600, no arbitrary hex colors."
exit 0
