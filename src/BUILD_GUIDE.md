# BUILD GUIDE
## PellazgoShop — Complete Build & Archive Instructions
**Date:** 2026-06-24

---

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| macOS | 14.x (Sonoma) or 15.x | Required |
| Xcode | 16.x | App Store / xcode-select |
| Node.js | 20.x or 22.x | nvm or brew |
| CocoaPods | Latest | `brew install cocoapods` or `gem install cocoapods` |
| Capacitor CLI | 5.7.8 | via npm |

---

## Step 1: Security Remediation (MANDATORY FIRST)

```bash
# 1a. Revoke compromised signing assets (do this in browser at developer.apple.com)
# - Revoke distribution certificate
# - Revoke AuthKey_G457WC6V47 in App Store Connect

# 1b. Generate fresh certificates
# developer.apple.com → Certificates, IDs & Profiles → Certificates → +
# Choose: Apple Distribution
# Follow CSR workflow → download as distribution.cer

# 1c. Export P12 from Keychain Access
# Find "Apple Distribution: Pellazgo" → Export → Save as pellazgo_new.p12
# Use a STRONG password and save it as GitHub Secret P12_PASSWORD

# 1d. Download fresh provisioning profile
# developer.apple.com → Profiles → Pellazgo Shop → Download
# Save as: Pellazgo_Shop.mobileprovision (no spaces, no "(2)")

# 1e. Remove old signing files from git
git filter-repo --path signing/ --invert-paths --force
# Then re-add .gitignore exclusions and recommit clean files if needed
```

---

## Step 2: Local Web Build

```bash
# Clone repository
git clone https://github.com/eagle-eyexk/PellazgoShop.git
cd PellazgoShop

# Install dependencies
npm ci

# Build web assets
npm run build

# Validate output
ls dist/index.html  # Must exist
echo "Build OK"
```

---

## Step 3: Capacitor iOS Setup

```bash
# Full clean (recommended for fresh setup)
rm -rf ios

# Add iOS platform
npx cap add ios

# Sync web build to iOS
npx cap sync ios

# Verify sync
ls ios/App/App/public/index.html  # Must exist
echo "Capacitor sync OK"
```

---

## Step 4: Add Missing iOS Files

### 4a. Privacy Manifest (REQUIRED)
```bash
cat > ios/App/App/PrivacyInfo.xcprivacy << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>NSPrivacyTracking</key><false/>
  <key>NSPrivacyTrackingDomains</key><array/>
  <key>NSPrivacyCollectedDataTypes</key><array/>
  <key>NSPrivacyAccessedAPITypes</key>
  <array>
    <dict>
      <key>NSPrivacyAccessedAPIType</key>
      <string>NSPrivacyAccessedAPICategoryUserDefaults</string>
      <key>NSPrivacyAccessedAPITypeReasons</key>
      <array><string>CA92.1</string></array>
    </dict>
  </array>
</dict>
</plist>
EOF
```

### 4b. Add PrivacyInfo to Xcode project
Open `ios/App/App.xcworkspace` in Xcode:
- File → Add Files → select `PrivacyInfo.xcprivacy`
- Ensure it's added to the "App" target

### 4c. Update Info.plist permissions
```bash
# Camera
/usr/libexec/PlistBuddy -c \
  "Add :NSCameraUsageDescription string 'Pellazgo uses camera for profile photos'" \
  ios/App/App/Info.plist

# Photo Library
/usr/libexec/PlistBuddy -c \
  "Add :NSPhotoLibraryUsageDescription string 'Pellazgo accesses your photos for profile pictures'" \
  ios/App/App/Info.plist

# Face ID (optional)
/usr/libexec/PlistBuddy -c \
  "Add :NSFaceIDUsageDescription string 'Use Face ID to sign in quickly'" \
  ios/App/App/Info.plist
```

---

## Step 5: App Icons

```bash
# Install capacitor-assets
npm install @capacitor/assets --save-dev

# Place your 1024×1024 icon at:
# assets/icon.png (opaque, no alpha channel)
# assets/splash.png (2732×2732)
# assets/splash-dark.png (optional)

# Generate all required sizes
npx capacitor-assets generate --ios

# Sync to Xcode
npx cap sync ios
```

---

## Step 6: CocoaPods

```bash
cd ios/App
pod install --repo-update
cd ../..
echo "Pods installed"
```

---

## Step 7: Verify Xcode Scheme

```bash
cd ios/App
xcodebuild -list -workspace App.xcworkspace
# Should show:
# Schemes:
#   App
```

---

## Step 8: Set Build Number

```bash
BUILD=$(( $(date +%s) - 1700000000 ))
/usr/libexec/PlistBuddy \
  -c "Set :CFBundleVersion $BUILD" \
  ios/App/App/Info.plist
echo "Build number: $BUILD"
```

---

## Step 9: Archive

### Option A: Automatic Signing (Codemagic — Recommended)
```bash
# Handled by Codemagic — see codemagic.yaml
# Requires fixing tiligo_asc → pellazgo_asc first
```

### Option B: Manual Signing (Local or GitHub Actions)

```bash
# Set up signing keychain
KEYCHAIN_PATH=~/Library/Keychains/pellazgo-build.keychain-db
security create-keychain -p "$KEYCHAIN_PASSWORD" $KEYCHAIN_PATH
security set-keychain-settings -lut 21600 $KEYCHAIN_PATH
security unlock-keychain -p "$KEYCHAIN_PASSWORD" $KEYCHAIN_PATH
security import signing/pellazgo.p12 \
  -k $KEYCHAIN_PATH \
  -P "$P12_PASSWORD" \
  -A -t cert -f pkcs12
security list-keychain -d user -s $KEYCHAIN_PATH

# Install provisioning profile
mkdir -p ~/Library/MobileDevice/Provisioning\ Profiles
cp "signing/Pellazgo_Shop.mobileprovision" \
   ~/Library/MobileDevice/Provisioning\ Profiles/

# Archive
cd ios/App
xcodebuild \
  -workspace App.xcworkspace \
  -scheme App \
  -configuration Release \
  -destination 'generic/platform=iOS' \
  -archivePath $HOME/build/PellazgoShop.xcarchive \
  DEVELOPMENT_TEAM=H4QUDPK7S3 \
  CODE_SIGN_STYLE=Manual \
  "CODE_SIGN_IDENTITY=Apple Distribution" \
  "PROVISIONING_PROFILE_SPECIFIER=Pellazgo Shop" \
  archive

# Verify archive
test -d $HOME/build/PellazgoShop.xcarchive && echo "ARCHIVE OK"
```

---

## Step 10: Export IPA

```bash
# Create ExportOptions.plist
cat > /tmp/ExportOptions.plist << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>method</key><string>app-store</string>
  <key>teamID</key><string>H4QUDPK7S3</string>
  <key>signingStyle</key><string>manual</string>
  <key>provisioningProfiles</key>
  <dict>
    <key>com.pellazgo.app</key><string>Pellazgo Shop</string>
  </dict>
  <key>uploadBitcode</key><false/>
  <key>uploadSymbols</key><true/>
  <key>destination</key><string>upload</string>
</dict>
</plist>
EOF

xcodebuild -exportArchive \
  -archivePath $HOME/build/PellazgoShop.xcarchive \
  -exportPath $HOME/build/export \
  -exportOptionsPlist /tmp/ExportOptions.plist

ls $HOME/build/export/*.ipa && echo "IPA EXPORT OK"
```

---

## Step 11: Upload to TestFlight

### Via xcrun altool (CLI)
```bash
xcrun altool --upload-app \
  -f $HOME/build/export/App.ipa \
  --apiKey $APPLE_API_KEY_ID \
  --apiIssuer $APPLE_ISSUER_ID
```

### Via Transporter (GUI)
1. Open Transporter.app
2. Drag IPA into window
3. Click Deliver

---

## Common Build Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `exit 65` | Signing failure | Verify provisioning profile matches bundle ID |
| `No provisioning profile` | Profile not installed | Copy `.mobileprovision` to MobileDevice/Provisioning Profiles |
| `Code signing is required` | Manual signing not configured | Set `CODE_SIGN_STYLE=Manual` |
| `Scheme 'App' not found` | Missing workspace | Use `App.xcworkspace` not `App.xcodeproj` |
| `dist/index.html not found` | Capacitor sync before build | Run `npm run build` then `npx cap sync` |
| `pod: command not found` | CocoaPods not installed | `brew install cocoapods` |
| `PrivacyInfo.xcprivacy missing` | Not added to project | See Step 4a above |

---

## Build Checklist

- [ ] `npm ci && npm run build` succeeds
- [ ] `dist/index.html` exists
- [ ] `npx cap sync ios` succeeds
- [ ] `pod install` succeeds
- [ ] Xcode scheme "App" exists
- [ ] Signing certificate valid (not revoked)
- [ ] Provisioning profile matches bundle ID
- [ ] `xcodebuild archive` exits 0
- [ ] IPA exported successfully
- [ ] IPA uploads to TestFlight
