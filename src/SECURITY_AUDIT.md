# SECURITY AUDIT
## PellazgoShop — Full Security Assessment
**Date:** 2026-06-24 | **Classification:** CONFIDENTIAL

---

## 🔴 CRITICAL FINDINGS — ACT NOW

---

### CRIT-001: Private Signing Keys Committed to Public Repository

| Field | Value |
|-------|-------|
| **Risk Level** | CRITICAL |
| **CVSS Score** | 9.8 |
| **Files Affected** | `signing/pellazgo.key`, `signing/pellazgo.p12`, `signing/pellazgo.pem` |
| **Impact** | Anyone can clone the repo, extract these files, and sign malicious apps as Pellazgo. Apple could revoke the certificate. Impersonation and supply chain attacks become trivial. |
| **Fix** | 1. Revoke and re-issue ALL signing certificates immediately at developer.apple.com. 2. Rotate the `.p12` (new key pair). 3. Remove files from git history: `git filter-repo --path signing/ --invert-paths`. 4. Move to GitHub Secrets or Codemagic Secure Files. |

---

### CRIT-002: App Store Connect API Private Key Exposed

| Field | Value |
|-------|-------|
| **Risk Level** | CRITICAL |
| **CVSS Score** | 9.5 |
| **File** | `signing/AuthKey_G457WC6V47.p8` (Key ID: G457WC6V47) |
| **Impact** | This key grants API access to App Store Connect. An attacker can: submit app updates, access crash logs, view financial data, modify metadata, and remove the app from sale. |
| **Fix** | 1. Revoke `AuthKey_G457WC6V47` immediately in App Store Connect → Users & Access → Keys. 2. Generate a new key. 3. Store as GitHub Secret `APPLE_API_KEY_CONTENT`. 4. Remove from git history. |

---

### CRIT-003: P12 Password Hardcoded in CI Script

| Field | Value |
|-------|-------|
| **Risk Level** | CRITICAL |
| **CVSS Score** | 8.5 |
| **File** | `.github/workflows/ios.yml` line: `security import signing/pellazgo.p12 -k build.keychain -P "Pellazgo"` |
| **Impact** | The P12 password `Pellazgo` is visible to all repo visitors. Combined with CRIT-001 (P12 file in repo), this is a complete certificate compromise. |
| **Fix** | Move password to GitHub Secret `P12_PASSWORD`. Use `${{ secrets.P12_PASSWORD }}` in workflow. |

---

### CRIT-004: .gitignore Does Not Exclude Signing Artifacts

| Field | Value |
|-------|-------|
| **Risk Level** | CRITICAL |
| **File** | `.gitignore` — only excludes `node_modules/`, `dist/`, `.env*`, `.DS_Store` |
| **Impact** | All signing credentials, certificates, and keys are tracked and committed. |
| **Fix** | Add to `.gitignore`: `signing/*.p12`, `signing/*.p8`, `signing/*.key`, `signing/*.pem`, `signing/*.cer`, `signing/*.mobileprovision` |

---

### HIGH-001: Admin Credentials — Hash Strength Assessment

| Field | Value |
|-------|-------|
| **Risk Level** | High |

| **File** | `src/lib/adminAuth.js` |
| **Finding** | Admin credentials use SHA-256 hashes without salting. SHA-256 is fast and vulnerable to rainbow table attacks. The actual username/password are not known but the hash is exposed in client-side code. |

| **Current** | `SHA256(username)` + `SHA256(password)` compared client-side |
| **Impact** | Client-side auth is always bypassable by a determined attacker with DevTools. The "admin panel" gate is security through obscurity. |
| **Fix** | Implement Base44 entity-level RLS (Row Level Security) to restrict Customer and Order reads to `role = 'admin'` users only. Currently any authenticated user who knows the endpoint could read all orders. |

---

### HIGH-003: Codemagic Configuration References Wrong App Name

| Field | Value |
|-------|-------|
| **Risk Level** | High (Build Integrity) |
| **File** | `codemagic.yaml` |
| **Finding** | `name: TiliGo iOS → TestFlight` and archive path `TiliGo.xcarchive`. This is a copy-paste from another project (`TiliGo`). The Codemagic `app_store_connect: tiligo_asc` integration references TiliGo's ASC connection — this means builds are being submitted to a DIFFERENT App Store account. |
| **Fix** | Create a Pellazgo-specific ASC integration in Codemagic. Rename all references from `tiligo_asc` and `TiliGo` to `pellazgo_asc` and `PellazgoShop`. |

---

### HIGH-004: Provisioning Profile Filename Has Spaces and Duplicate Suffix

| Field | Value |
|-------|-------|
| **Risk Level** | Medium-High |
| **File** | `signing/Pellazgo_Shop (2).mobileprovision` |
| **Finding** | The `(2)` suffix indicates this is not the original provisioning profile but a downloaded duplicate. The profile may be expired or mismatched. |
| **Fix** | Download the correct profile from developer.apple.com, name it `Pellazgo_Shop.mobileprovision`, update the CI script accordingly. |

---

## 🟡 MEDIUM SEVERITY

---

### MED-001: Base44 Admin SHA-256 Hashes in Client Bundle

| Risk | Medium |
|------|--------|
| **Finding** | `U_HASH` and `P_HASH` in `adminAuth.js` are shipped to the browser. An attacker can attempt offline hash cracking. |
| **Fix** | These hashes are defense-only. Accept the risk OR move to server-side admin auth. |

---

### MED-002: No Content Security Policy Header

| Risk | Medium |
|------|--------|
| **Finding** | No CSP header is configured. XSS via injected scripts could exfiltrate Base44 tokens. |
| **Fix** | Add CSP via `index.html` meta tag or Codemagic/server headers: `default-src 'self'; connect-src *.base44.com; ...` |

| **Fix** | For production admin access, require Base44 user role = 'admin' from server. Use `user.role === 'admin'` check from authenticated `base44.auth.me()`. The current system is defense-in-depth only, not real auth. |


---
---

| **Finding** | Admin routes (`/nothranted/*`) are protected by a client-side sessionStorage check. All admin data fetching (Orders, Customers, Products) goes through the same Base44 entities API that the storefront uses. The "admin" check does not prevent API-level data access. |

### MED-003: Hardcoded Team ID in Multiple Locations

### HIGH-002: Admin Route Not Truly Protected Server-Side

| Field | Value |
| Risk | Low-Medium |
|------|------------|
| **Files** | `codemagic.yaml`, `ios.yml`, `capacitor.config.json` |
| **Finding** | `H4QUDPK7S3` appears in 3+ files. Not a secret (Apple Team IDs are semi-public) but inconsistency risk. |
|-------|-------|
| **Risk Level** | High |
| **File** | `src/components/admin/AdminGate.jsx`, `src/lib/adminAuth.js` |
| **Fix** | Use a single source of truth — define in Codemagic/GitHub environment variables. |


---

### MED-004: `pellazgo.key` is an RSA Private Key

| Risk | Medium-High |
|------|-------------|
| **File** | `signing/pellazgo.key` — 1732 bytes, RSA private key format |
| **Finding** | This private key was used to generate the distribution certificate. If an attacker uses this to recreate the `.p12`, they can sign apps. |
| **Fix** | Covered by CRIT-001. Rotate and remove from git history. |

---

## 🟢 LOW SEVERITY / INFORMATIONAL

| ID | Finding | Risk | Fix |
|----|---------|------|-----|
| LOW-001 | No HTTPS enforcement for dev server | Info | Dev only, acceptable |
| LOW-002 | `pellazgo.csr` in repo | Low | CSR is public info, not sensitive |
| LOW-003 | Keychain password `build123` in GitHub Actions | Low | Temp keychain, CI-only |
| LOW-004 | Admin session stored in sessionStorage | Low | By design — cleared on close |

---

## Security Score Summary

| Category | Score | Finding |
|----------|-------|---------|
| Secrets Management | 15/100 | 🔴 Critical — keys in public repo |
| Authentication | 60/100 | 🟡 Client-side admin gate |
| Authorization | 45/100 | 🟠 No server-side entity RLS |
| Dependency Security | 95/100 | 🟢 Clean dependency tree |
| Transport Security | 90/100 | 🟢 HTTPS everywhere |
| CI/CD Security | 20/100 | 🔴 Credentials in repo + workflow |
| **Overall Security Score** | **38/100** | **🔴 CRITICAL REMEDIATION REQUIRED** |

---

## Remediation Priority

### Do Today (Before Any Submission)
1. Revoke `AuthKey_G457WC6V47` in App Store Connect
2. Revoke and re-issue distribution certificate at developer.apple.com
3. Remove signing files from git history (`git filter-repo`)
4. Move all secrets to GitHub Secrets / Codemagic Secure Files
5. Update `.gitignore` to exclude `signing/`

### Do This Week
6. Fix Codemagic `tiligo_asc` → create `pellazgo_asc` integration
7. Implement Base44 entity RLS for admin-only data
8. Add Privacy Manifest to iOS project

### Do Before v2
9. Replace client-side admin auth with server-side role check
10. Add Content Security Policy headers
