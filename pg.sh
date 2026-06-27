cat > build.sh <<'EOF'
#!/bin/bash
# ================================================================
# Pellazgo iOS – Full Build, Sign, Archive & Publish
# ================================================================

set -e

echo "🚀 Starting Pellazgo iOS build..."

# --- 1. Configuration -------------------------------------------------
BUNDLE_ID="com.pellazgo.app"
TEAM_ID="H4QUDPK7S3"                       # Replace with your team ID
CERT_PASSWORD="xbGsHVMw"
PROJECT_DIR="ios/App"
WORKSPACE="$PROJECT_DIR/App.xcworkspace"
SCHEME="App"
CONFIGURATION="Release"
ARCHIVE_PATH="$PWD/build/App.xcarchive"
EXPORT_PATH="$PWD/build/ipa"
EXPORT_OPTIONS="$PROJECT_DIR/exportOptions.plist"
KEYCHAIN="build.keychain"
KEYCHAIN_PASSWORD="build123"

# --- 2. Install CocoaPods ---------------------------------------------
echo "📦 Installing CocoaPods..."
cd "$PROJECT_DIR"
pod install --repo-update
cd -

# --- 3. Set up Keychain with certificate -----------------------------
echo "🔐 Setting up keychain..."
security create-keychain -p "$KEYCHAIN_PASSWORD" "$KEYCHAIN"
security default-keychain -s "$KEYCHAIN"
security unlock-keychain -p "$KEYCHAIN_PASSWORD" "$KEYCHAIN"

# Import the .p12 certificate
security import "signing/pellazgo_shop.p12" -k "$KEYCHAIN" -P "$CERT_PASSWORD" -A
security set-keychain-settings -t 3600 -l "$KEYCHAIN"

# --- 4. Install provisioning profile ----------------------------------
echo "📱 Installing provisioning profile..."
mkdir -p ~/Library/MobileDevice/Provisioning\ Profiles
cp "signing/pellazgo_shop.mobileprovision" ~/Library/MobileDevice/Provisioning\ Profiles/

# --- 5. Build Archive -------------------------------------------------
echo "🏗️ Building archive..."
cd "$PROJECT_DIR"
xcodebuild \
  -workspace "$(basename "$WORKSPACE")" \
  -scheme "$SCHEME" \
  -configuration "$CONFIGURATION" \
  -sdk iphoneos \
  -archivePath "$ARCHIVE_PATH" \
  -allowProvisioningUpdates \
  -allowProvisioningDeviceRegistration \
  archive
cd -

# --- 6. Export IPA ----------------------------------------------------
echo "📦 Exporting IPA..."
cd "$PROJECT_DIR"
xcodebuild \
  -exportArchive \
  -archivePath "$ARCHIVE_PATH" \
  -exportOptionsPlist "$EXPORT_OPTIONS" \
  -exportPath "$EXPORT_PATH" \
  -allowProvisioningUpdates \
  -allowProvisioningDeviceRegistration
cd -

# --- 7. Upload to App Store Connect (using API key) -------------------
echo "⬆️ Uploading to App Store Connect..."
xcrun altool --upload-app \
  -f "$EXPORT_PATH/App.ipa" \
  -t ios \
  --apiKey "A8472N678Q" \
  --verbose

echo ""
echo "🎉 Build and publish complete!"
echo "📱 IPA: $EXPORT_PATH/App.ipa"
echo "📁 Archive: $ARCHIVE_PATH"
EOF

chmod +x build.sh  --apiIssuer "6d7acece-2356-43c3-9946-6fd2cda5bf7d" \

