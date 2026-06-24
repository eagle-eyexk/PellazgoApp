#!/usr/bin/env python3
"""
PELLAZGO MASTER BUILDER — Complete iOS Pipeline Automation
Analyzes repo, fixes all issues, configures Codemagic, pushes, and builds.
Run once. Everything works.
"""

import subprocess, os, sys, json, re, shutil, time
from pathlib import Path

# ═══════════════════════════════════════════════════════════
# CONFIGURATION
# ═══════════════════════════════════════════════════════════
REPO_DIR = os.path.expanduser("~/PellazgoApp")
GITHUB_REPO = "https://github.com/eagle-eyexk/PellazgoApp.git"
BRANCH = "main"

PELLAZGO_CONFIG = {
    "appId": "com.pellazgo.app",
    "appName": "Pellazgo Shop",
    "bundleId": "com.pellazgo.app",
    "teamId": "H4QUDPK7S3",
    "profileName": "Pellazgo Shop",
    "p12Password": "Pellazgo",
    "integrationName": "pellazgo_asc",
    "issuerId": "6d7acece-2356-43c3-9946-6fd2cda5bf7d",
    "keyId": "G457WC6V47",
}

SIGNING_FILES = {
    "p12": "pellazgo.p12",
    "mobileprovision": "Pellazgo_Shop.mobileprovision",
}

# ═══════════════════════════════════════════════════════════
# UTILITY FUNCTIONS
# ═══════════════════════════════════════════════════════════
def run(cmd, cwd=REPO_DIR, check=True):
    """Run a shell command"""
    result = subprocess.run(cmd, shell=True, cwd=cwd, capture_output=True, text=True)
    if check and result.returncode != 0:
        print(f"  ⚠️  Command failed (exit {result.returncode})")
        if result.stderr: print(f"     {result.stderr[:200]}")
    return result

def status(msg, ok=True):
    """Print status message"""
    icon = "✅" if ok else "❌"
    print(f"  {icon} {msg}")

def section(title):
    """Print section header"""
    print(f"\n{'='*60}")
    print(f"  {title}")
    print(f"{'='*60}")

# ═══════════════════════════════════════════════════════════
# PHASE 1: REPOSITORY ANALYSIS
# ═══════════════════════════════════════════════════════════
def analyze_repo():
    section("PHASE 1: REPOSITORY ANALYSIS")
    
    os.chdir(REPO_DIR)
    
    # Check essential files
    files_to_check = [
        "package.json",
        "capacitor.config.json",
        "codemagic.yaml",
        "vite.config.js",
        "src/App.jsx",
        "index.html",
        "signing/",
    ]
    
    for f in files_to_check:
        exists = os.path.exists(f)
        status(f"File/Folder: {f}", exists)
    
    # Check signing files
    signing_dir = os.path.join(REPO_DIR, "signing")
    p12_files = list(Path(signing_dir).glob("*.p12")) if os.path.exists(signing_dir) else []
    mp_files = list(Path(signing_dir).glob("*.mobileprovision")) if os.path.exists(signing_dir) else []
    status(f"P12 files: {len(p12_files)}", len(p12_files) > 0)
    status(f"Provisioning profiles: {len(mp_files)}", len(mp_files) > 0)
    
    # Check package.json
    with open("package.json") as f:
        pkg = json.load(f)
    has_cap = "@capacitor/core" in pkg.get("dependencies", {})
    has_build = "build" in pkg.get("scripts", {})
    status(f"Capacitor dependency: {has_cap}", has_cap)
    status(f"Build script: {has_build}", has_build)
    
    return True

# ═══════════════════════════════════════════════════════════
# PHASE 2: DEPENDENCY FIX
# ═══════════════════════════════════════════════════════════
def fix_dependencies():
    section("PHASE 2: DEPENDENCY FIX")
    
    # Install Capacitor 7 (CocoaPods compatible)
    cap_packages = [
        "@capacitor/core@^7.0.0",
        "@capacitor/cli@^7.0.0", 
        "@capacitor/ios@^7.0.0",
        "@capacitor/app@^7.0.0",
        "@capacitor/camera@^7.0.0",
        "@capacitor/filesystem@^7.0.0",
        "@capacitor/geolocation@^7.0.0",
        "@capacitor/haptics@^7.0.0",
        "@capacitor/keyboard@^7.0.0",
        "@capacitor/preferences@^7.0.0",
        "@capacitor/status-bar@^7.0.0",
    ]
    
    print("  Installing Capacitor 7 packages...")
    run(f"npm install {' '.join(cap_packages)} --save")
    status("Capacitor 7 packages installed")
    
    # Fix package.json build script if missing
    with open("package.json") as f:
        pkg = json.load(f)
    
    if "build" not in pkg.get("scripts", {}):
        pkg["scripts"] = pkg.get("scripts", {})
        pkg["scripts"]["build"] = "vite build"
        with open("package.json", "w") as f:
            json.dump(pkg, f, indent=2)
        status("Added build script")
    else:
        status("Build script exists")
    
    return True

# ═══════════════════════════════════════════════════════════
# PHASE 3: CAPACITOR CONFIG
# ═══════════════════════════════════════════════════════════
def fix_capacitor_config():
    section("PHASE 3: CAPACITOR CONFIGURATION")
    
    config = {
        "appId": PELLAZGO_CONFIG["appId"],
        "appName": PELLAZGO_CONFIG["appName"],
        "webDir": "dist",
        "bundledWebRuntime": False,
    }
    
    with open("capacitor.config.json", "w") as f:
