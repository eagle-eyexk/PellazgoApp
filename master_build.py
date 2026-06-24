#!/usr/bin/env python3
"""Pellazgo Master Builder"""
import subprocess, os, json, shutil
from pathlib import Path

REPO = os.path.expanduser("~/PellazgoApp")
CFG = {
    "appId":"com.pellazgo.app","appName":"Pellazgo Shop",
    "teamId":"H4QUDPK7S3","profile":"Pellazgo Shop",
    "p12pass":"Pellazgo","integration":"pellazgo_asc"
}

def run(cmd): return subprocess.run(cmd, shell=True, cwd=REPO, capture_output=True, text=True)

print("="*50)
print("PELLAZGO MASTER BUILDER")
print("="*50)

os.chdir(REPO)

# 1. Install Capacitor 7
print("\n1. Installing Capacitor 7...")
run("npm install @capacitor/core@^7.0.0 @capacitor/cli@^7.0.0 @capacitor/ios@^7.0.0 @capacitor/app@^7.0.0 --save")

# 2. Fix capacitor config
print("\n2. Writing capacitor.config.json...")
with open("capacitor.config.json","w") as f:
    json.dump({"appId":CFG["appId"],"appName":CFG["appName"],"webDir":"dist","bundledWebRuntime":False}, f, indent=2)

# 3. Write codemagic.yaml
print("\n3. Writing codemagic.yaml...")
yaml = '''workflows:
  ios-release:
    name: Pellazgo Shop iOS
    instance_type: mac_mini_m1
    max_build_duration: 120
    integrations:
      app_store_connect: ''' + CFG["integration"] + '''
    environment:
      node: 22
      xcode: latest
      cocoapods: default
      groups:
        - code-signing
    triggering:
      events: [push]
      branch_patterns: [{pattern: main}]
    scripts:
      - name: Build
        script: |
          set -e
          npm install
          npm run build
      - name: Setup iOS
        script: |
          set -e
          rm -rf ios
          npx cap add ios
          npx cap sync ios
          find ios -name "project.pbxproj" -exec sed -i "" "s/CODE_SIGN_IDENTITY = \\"iPhone Developer\\";/CODE_SIGN_IDENTITY = \\"Apple Distribution\\";/g" {} \\;
          cd ios/App && pod install --repo-update && cd ../..
      - name: Signing
        script: |
          mkdir -p ~/Library/MobileDevice/Provisioning\\ Profiles
          cp signing/*.mobileprovision ~/Library/MobileDevice/Provisioning\\ Profiles/
          security create-keychain -p build123 build.keychain 2>/dev/null || true
          security default-keychain -s build.keychain
          security unlock-keychain -p build123 build.keychain
          for p12 in signing/*.p12; do
            security import "$p12" -k build.keychain -P "''' + CFG["p12pass"] + '''" -T /usr/bin/codesign
          done
          security set-key-partition-list -S apple-tool:,apple: -s -k build123 build.keychain
      - name: Build number
        script: |
          BUILD=$(( $(date +%s) - 1700000000 ))
          /usr/libexec/PlistBuddy -c "Set :CFBundleVersion $BUILD" ios/App/App/Info.plist 2>/dev/null || true
      - name: Archive
        script: |
          set -e
          cd ios/App
          xcodebuild -workspace App.xcworkspace -scheme App -configuration Release -archivePath /Users/builder/build/PellazgoShop.xcarchive DEVELOPMENT_TEAM=''' + CFG["teamId"] + ''' CODE_SIGN_STYLE=Manual PROVISIONING_PROFILE_SPECIFIER="''' + CFG["profile"] + '''" archive
          test -d /Users/builder/build/PellazgoShop.xcarchive
      - name: Export
        script: |
          cat > /Users/builder/ExportOptions.plist << "PLIST"
          <?xml version="1.0" encoding="UTF-8"?>
          <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
          <plist version="1.0"><dict>
            <key>method</key><string>app-store</string>
            <key>teamID</key><string>''' + CFG["teamId"] + '''</string>
            <key>provisioningProfiles</key>
            <dict><key>''' + CFG["appId"] + '''</key><string>''' + CFG["profile"] + '''</string></dict>
          </dict></plist>
          PLIST
          xcodebuild -exportArchive -archivePath /Users/builder/build/PellazgoShop.xcarchive -exportPath /Users/builder/build -exportOptionsPlist /Users/builder/ExportOptions.plist
    artifacts:
      - /Users/builder/build/*.ipa
    publishing:
      app_store_connect:
        auth: integration
        submit_to_testflight: true
'''
with open("codemagic.yaml","w") as f: f.write(yaml)

# 4. Copy signing files
print("\n4. Copying signing files...")
src = os.path.expanduser("~/PellazgoShop/signing")
dst = os.path.join(REPO, "signing")
os.makedirs(dst, exist_ok=True)
if os.path.exists(src):
    for f in Path(src).glob("*"):
        shutil.copy(f, dst)
    print("   Copied from PellazgoShop")

# 5. Build
print("\n5. Building...")
run("npm run build")
if os.path.exists("dist/index.html"): print("   Build OK")

# 6. Generate iOS
print("\n6. Generating iOS project...")
run("rm -rf ios")
run("npx cap add ios")
run("npx cap sync ios")
if os.path.exists("ios/App/Podfile"): print("   Podfile OK")

# 7. Push
print("\n7. Pushing to GitHub...")
run("git add -A")
run('git commit -m "Master builder complete"')
run("git push origin main --force")
print("   Pushed")

print("\n" + "="*50)
print("DONE! Start Codemagic build for PellazgoApp.")
print("="*50)
