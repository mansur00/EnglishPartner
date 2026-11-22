#!/usr/bin/env bash
# EnglishPartner: Automated Android APK Environment & Packaging Helper
# Milestone 4D - Trusted Web Activity (TWA via Bubblewrap)

set -euo pipefail

echo "===================================================="
echo "    EnglishPartner Android APK Packaging Runner     "
echo "===================================================="

# 1. Resolve JAVA_HOME
if [[ -z "${JAVA_HOME:-}" ]]; then
  if [[ -d "/Applications/Android Studio.app/Contents/jbr/Contents/Home" ]]; then
    export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
    echo "✓ Using Android Studio embedded OpenJDK: $JAVA_HOME"
  else
    echo "⚠ JAVA_HOME not set and Android Studio default not found."
  fi
else
  echo "✓ JAVA_HOME: $JAVA_HOME"
fi

# 2. Resolve ANDROID_HOME
if [[ -z "${ANDROID_HOME:-}" ]]; then
  if [[ -d "$HOME/Library/Android/sdk" ]]; then
    export ANDROID_HOME="$HOME/Library/Android/sdk"
    echo "✓ Using Android SDK: $ANDROID_HOME"
  else
    echo "⚠ ANDROID_HOME not set and default ~/Library/Android/sdk not found."
  fi
else
  echo "✓ ANDROID_HOME: $ANDROID_HOME"
fi

# 3. Export PATH
if [[ -n "${JAVA_HOME:-}" ]]; then
  export PATH="$JAVA_HOME/bin:$PATH"
fi
if [[ -n "${ANDROID_HOME:-}" ]]; then
  export PATH="$ANDROID_HOME/platform-tools:$PATH"
fi

# 4. Check Java version
if command -v java >/dev/null 2>&1; then
  JAVA_VER=$(java -version 2>&1 | head -n 1)
  echo "✓ Java runtime verified: $JAVA_VER"
else
  echo "❌ Java command not accessible. Please install JDK or Android Studio."
  exit 1
fi

# 5. Check manifest endpoint / production URL
MANIFEST_URL="${1:-http://localhost:3000/manifest.webmanifest}"
echo "✓ Web App Manifest target: $MANIFEST_URL"

echo ""
echo "Packaging Instructions:"
echo "1. Run Bubblewrap initialization:"
echo "   npx @bubblewrap/cli init --manifest=\"$MANIFEST_URL\""
echo "2. Build Android Application Package (APK):"
echo "   npx @bubblewrap/cli build"
echo "===================================================="
