#!/usr/bin/env python3
"""
Fix Xcode project signing settings for Pellazgo iOS app.
Run this on the Codemagic build machine before building.
"""

import re
import os
import sys
import glob

# ================================================================
# CONFIGURATION
# ================================================================

TEAM_ID = "H4QUDPK7S3"
BUNDLE_ID = "com.pellazgo.pellazgo"

PROJECT_FILE = "ios/App/App.xcodeproj/project.pbxproj"
INFO_PLIST = "ios/App/App/Info.plist"
EXPORT_OPTIONS = "ios/App/exportOptions.plist"
SIGNING_FOLDER = "signing"

# ================================================================
# DETECT PROFILE NAME
# ================================================================

def detect_profile_name():
    """Find the actual provisioning profile name from the signing folder."""
    profile_files = glob.glob(f"{SIGNING_FOLDER}/*.mobileprovision")
    if not profile_files:
        print(f"❌ No .mobileprovision files found in {SIGNING_FOLDER}")
        return None
    
    # Use the first profile found
    profile_path = profile_files[0]
    print(f"📱 Found profile: {os.path.basename(profile_path)}")
    
    # Extract the profile name (remove .mobileprovision extension)
    profile_name = os.path.basename(profile_path).replace('.mobileprovision', '')
    print(f"📱 Profile name: {profile_name}")
    
    return profile_name

# ================================================================
# FUNCTIONS
# ================================================================

def fix_project(profile_name):
    """Patch the Xcode project with correct signing settings."""
    if not os.path.exists(PROJECT_FILE):
        print(f"❌ Project file not found: {PROJECT_FILE}")
        return False

    with open(PROJECT_FILE, 'r') as f:
        content = f.read()

    # Force manual signing
    content = re.sub(r'CODE_SIGN_STYLE = Automatic;', 'CODE_SIGN_STYLE = Manual;', content)
    content = re.sub(r'CODE_SIGN_STYLE = .*?;', 'CODE_SIGN_STYLE = Manual;', content)
    content = re.sub(r'DEVELOPMENT_TEAM = .*?;', f'DEVELOPMENT_TEAM = {TEAM_ID};', content)
    content = re.sub(r'PROVISIONING_PROFILE_SPECIFIER = .*?;', f'PROVISIONING_PROFILE_SPECIFIER = "{profile_name}";', content)

    # Add to any buildSettings block
    pattern = r'(buildSettings = \{)'
    replacement = r'\1\n\t\t\t\tDEVELOPMENT_TEAM = ' + TEAM_ID + ';\n\t\t\t\tCODE_SIGN_STYLE = Manual;\n\t\t\t\tPROVISIONING_PROFILE_SPECIFIER = "' + profile_name + '";'
    content = re.sub(pattern, replacement, content)

    # Update Info.plist
    if os.path.exists(INFO_PLIST):
        with open(INFO_PLIST, 'r') as f:
            plist = f.read()
        plist = re.sub(r'<key>CFBundleIdentifier</key>\s*<string>.*?</string>',
                       f'<key>CFBundleIdentifier</key>\n\t<string>{BUNDLE_ID}</string>', plist)
        with open(INFO_PLIST, 'w') as f:
            f.write(plist)
        print("✅ Info.plist updated")

    with open(PROJECT_FILE, 'w') as f:
        f.write(content)

    print(f"✅ Project.pbxproj patched with profile: {profile_name}")
    return True


def generate_export_options(profile_name):
    """Generate exportOptions.plist with correct values."""
    content = f'''<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>app-store</string>
    <key>teamID</key>
    <string>{TEAM_ID}</string>
    <key>signingStyle</key>
    <string>manual</string>
    <key>stripSwiftSymbols</key>
    <true/>
    <key>uploadSymbols</key>
    <true/>
    <key>compileBitcode</key>
    <false/>
    <key>provisioningProfiles</key>
    <dict>
        <key>{BUNDLE_ID}</key>
        <string>{profile_name}</string>
    </dict>
    <key>signingCertificate</key>
    <string>Apple Distribution</string>
</dict>
</plist>'''

    os.makedirs(os.path.dirname(EXPORT_OPTIONS), exist_ok=True)
    with open(EXPORT_OPTIONS, 'w') as f:
        f.write(content)
    print(f"✅ exportOptions.plist generated with profile: {profile_name}")
    return True


# ================================================================
# MAIN
# ================================================================

def main():
    print("🔧 Pellazgo iOS Signing Fix")
    print("=" * 40)
    
    # Detect the actual profile name
    profile_name = detect_profile_name()
    if not profile_name:
        print("❌ Could not detect profile name. Using default: PellazgoApp")
        profile_name = "PellazgoApp"
    
    success = True
    if not fix_project(profile_name):
        success = False
    if not generate_export_options(profile_name):
        success = False

    if success:
        print(f"\n✅ All fixes applied successfully! Using profile: {profile_name}")
        sys.exit(0)
    else:
        print("\n❌ Some fixes failed.")
        sys.exit(1)


if __name__ == "__main__":
    main()