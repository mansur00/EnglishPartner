# EnglishPartner: Mobile App & Android APK Architecture (Milestone 4D)

> **Document Status:** Authoritative Architectural Guide  
> **Target Platform:** Android APK & Google Play Store  
> **Workspace Context:** `/Users/mdmansur/Desktop/apk/English learning`  
> **Reference Specs:** `ECP_Phase_Plan.md` §7.1 (Track 4D), `Brief §3.2`

---

## 1. Executive Summary & Strategy

EnglishPartner is built with Next.js 16, React 19, and Tailwind v4, utilizing a Responsive Desktop + Mobile layout with Expandable Design System components.

To produce a high-performance Android APK for distribution or installation, two proven packaging pathways exist:

```
                      ┌────────────────────────────────────────┐
                      │    EnglishPartner Core Next.js App     │
                      │  (PWA Manifest, Service Worker, HTTPS) │
                      └───────────────────┬────────────────────┘
                                          │
                  ┌───────────────────────┴───────────────────────┐
                  ▼                                               ▼
     ┌─────────────────────────┐                     ┌─────────────────────────┐
     │  Path A (Recommended):  │                     │   Path B (Alternative): │
     │   Trusted Web Activity  │                     │   Capacitor Bridge      │
     │      (TWA / Bubblewrap) │                     │   (@capacitor/android)  │
     └────────────┬────────────┘                     └────────────┬────────────┘
                  │                                               │
                  ▼                                               ▼
     • Ultra-lightweight (~1 MB APK)                 • Native Android Studio project
     • Instant over-the-air updates                  • Offline-bundled web assets
     • Zero duplicate codebase                       • Custom Java/Kotlin plugin hooks
     • Uses Chrome Custom Tabs engine                • Uses Android System WebView
```

---

## 2. Path A (Recommended): Trusted Web Activity (TWA via Bubblewrap)

Trusted Web Activity (TWA) is Google's official standard for delivering Progressive Web Apps as native Android APKs to the Google Play Store.

### 2.1 Key Advantages
1. **Lightweight footprint:** ~1 to 2 MB download size.
2. **Instant Over-the-Air updates:** Code changes deployed to the web app are instantly live in the APK without requiring users to download updates from the Play Store.
3. **Hardware accelerated:** Runs on the learner's installed Google Chrome engine, guaranteeing full Web Speech API and MediaRecorder compatibility.
4. **Already configured:** Directly consumes our W3C manifest (`src/app/manifest.ts`) and offline service worker (`public/sw.js`).

### 2.2 Prerequisites
- Node.js 20+
- Java Development Kit (JDK 17+)
- Android SDK (installed via Android Studio Mac ARM)

### 2.3 Detected Local Environment Configuration (Mac ARM)
The owner's Mac ARM workstation already has Android Studio and Android SDK installed. To use the embedded JDK and SDK without additional installations, add the following exports to your shell (`~/.zshrc`) or run them in your terminal session:

```bash
# Set Android Studio embedded Java 25 & Android SDK paths
export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
export ANDROID_HOME="$HOME/Library/Android/sdk"
export PATH="$JAVA_HOME/bin:$ANDROID_HOME/platform-tools:$PATH"
```

### 2.4 Step-by-Step TWA Generation
```bash
# 1. Install Google's official Bubblewrap CLI
npm install -g @bubblewrap/cli

# 2. Initialize Android project from our live/deployed manifest
bubblewrap init --manifest="https://your-production-domain.com/manifest.webmanifest"

# 3. Build signed Android Application Package (APK) and Android App Bundle (AAB)
bubblewrap build
```

---

## 3. Path B: Capacitor Android Native Packaging

If complete offline asset bundling (zero network requirement for initial cold-start) or native Java/Kotlin SDK plugins are desired:

### 3.1 Setup Commands
```bash
cd english-partner

# 1. Install Capacitor dependencies
npm install @capacitor/core @capacitor/android
npm install -D @capacitor/cli

# 2. Initialize Capacitor configuration
npx cap init "English Partner" "com.englishpartner.app" --web-dir "out"

# 3. Add Android native platform
npx cap add android

# 4. Open project in Android Studio
npx cap open android
```

### 3.2 Android Permissions & Hardware Access
In `android/app/src/main/AndroidManifest.xml`:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <!-- Internet & Network State -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <!-- Microphone & Audio Recording for Roleplay & Pronunciation Practice -->
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/AppTheme">

        <activity
            android:name=".MainActivity"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale|smallestScreenSize|screenLayout|uiMode"
            android:exported="true"
            android:launchMode="singleTask"
            android:theme="@style/AppTheme.NoActionBarLaunch">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
```

---

## 4. Android Studio Build & Signing Runbook

Using the installer at `android-studio-rabbit1-mac_arm.dmg`:

1. **Install Android Studio**: Mount the DMG and copy to `/Applications`.
2. **Open Project**: Select the generated `android/` directory.
3. **Generate Keystore**:
   - Menu: **Build > Generate Signed Bundle / APK**.
   - Select **Android App Bundle** (for Google Play) or **APK** (for direct sideload testing).
   - Create a release keystore `english-partner-release.jks`.
   - Key alias: `englishpartner`.
4. **Compile Output**:
   - `app-release.apk`: Direct APK installable on any Android phone via ADB or file download.
   - `app-release.aab`: Optimized bundle for Google Play Console submission.

---

## 5. Verification & Launch Gate Checklist

- [x] W3C Web App Manifest valid (`src/app/manifest.ts` -> `/manifest.webmanifest`).
- [x] Offline caching Service Worker registered (`public/sw.js`).
- [x] Audio permissions (`RECORD_AUDIO`) requested strictly upon user microphone tap.
- [x] Rate limiting & daily quotas active to protect backend during high user spikes.
- [x] Responsive layout tested on 360px (mobile), 768px (tablet), and 1280px (desktop).
- [x] Min font floor 12px, max font weight 600, flat non-3D aesthetic preserved.
