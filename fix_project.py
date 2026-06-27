#!/usr/bin/env python3
"""
Fix Xcode project signing settings for Pellazgo iOS app.
Run this on the Codemagic build machine before building.
"""

import re
import os
import sys

# ================================================================
# CONFIGURATION
# ================================================================

TEAM_ID = "H4QUDPK7S3"
PROFILE_NAME = "PellazgoApp"
BUNDLE_ID = "com.pellazgo.pellazgo"

PROJECT_FILE = "ios/App/App.xcodeproj/project.pbxproj"
INFO_PLIST = "ios/App/App/Info.plist"
EXPORT_OPTIONS = "ios/App/exportOptions.plist"

# ================================================================
# FUNCTIONS
# ================================================================

def fix_project():
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
    content = re.sub(r'PROVISIONING_PROFILE_SPECIFIER = .*?;', f'PROVISIONING_PROFILE_SPECIFIER = "{PROFILE_NAME}";', content)

    # Add to any buildSettings block that might be missing them
    pattern = r'(buildSettings = \{)'
    replacement = r'\1\n\t\t\t\tDEVELOPMENT_TEAM = ' + TEAM_ID + ';\n\t\t\t\tCODE_SIGN_STYLE = Manual;\n\t\t\t\tPROVISIONING_PROFILE_SPECIFIER = "' + PROFILE_NAME + '";'
    content = re.sub(pattern, replacement, content)

    # Update Info.plist bundle ID
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

    print("✅ Project.pbxproj patched successfully")
    return True


def generate_export_options():
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
        <string>{PROFILE_NAME}</string>
    </dict>
    <key>signingCertificate</key>
    <string>Apple Distribution</string>
</dict>
</plist>'''

    os.makedirs(os.path.dirname(EXPORT_OPTIONS), exist_ok=True)
    with open(EXPORT_OPTIONS, 'w') as f:
        f.write(content)
    print("✅ exportOptions.plist generated")
    return True


# ================================================================
# MAIN
# ================================================================

def main():
    print("🔧 Pellazgo iOS Signing Fix")
    print("=" * 40)

    success = True
    if not fix_project():
        success = False
    if not generate_export_options():
        success = False

    if success:
        print("\n✅ All fixes applied successfully!")
        sys.exit(0)
    else:
        print("\n❌ Some fixes failed.")
        sys.exit(1)


if __name__ == "__main__":
    main()
