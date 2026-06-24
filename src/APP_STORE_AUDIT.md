# APP STORE COMPLIANCE AUDIT
## PellazgoShop — Apple Review Readiness
**Date:** 2026-06-24

---

## Compliance Score: 55/100

---

## 1. Privacy Manifest (PrivacyInfo.xcprivacy)

**Status: ❌ MISSING — Will cause rejection since iOS 17 / May 2024**

Apple requires a Privacy Manifest for all new submissions declaring:
- What data is collected
- What APIs are accessed (UserDefaults, file timestamps, etc.)

Capacitor 5.7.8 uses `UserDefaults` for plugin state → must declare `NSPrivacyAccessedAPICategoryUserDefaults`.

**Required file: `ios/App/App/PrivacyInfo.xcprivacy`** — see IOS_AUDIT.md for content.

---

## 2. Privacy Labels (App Store Connect)

Must declare in App Store Connect before submission:

| Data Type | Collected | Linked to User | Tracking |
|-----------|-----------|----------------|---------|
| Email address | ✅ Yes | ✅ Yes | ❌ No |
| Name | ✅ Yes | ✅ Yes | ❌ No |
| Phone number | ✅ Yes | ✅ Yes | ❌ No |
| Physical address | ✅ Yes | ✅ Yes | ❌ No |
| Purchase history | ✅ Yes | ✅ Yes | ❌ No |
| Payment info | ❌ Not collected directly (payment gateway) | N/A | N/A |
| Crash data | ❌ Not configured | N/A | N/A |
| Analytics | ✅ TrafficAnalytics entity | ⚠️ Session-based | ❌ No |

**Required Privacy Nutrition Labels:**
- Contact Info (email, name, phone, address) → linked to user
- Purchases → linked to user
- Usage Data → not linked to user

---

## 3. App Tracking Transparency (ATT)

**Status: ✅ Not required**

The app does not use IDFA or cross-app tracking. No ATT prompt needed.
The TrafficAnalytics entity collects UTM parameters (first-party, session-scoped) — this does NOT require ATT.

---

## 4. App Review Guidelines Compliance

### Section 2 — Performance
| Rule | Status |
|------|--------|
| 2.1 App completeness | ⚠️ Payment flows incomplete (Stripe/PayPal UI-only) |
| 2.3.3 Demo accounts | ⚠️ Provide demo credentials for review |
| 2.5.1 No UIWebView | ✅ Uses WKWebView via Capacitor |

### Section 3 — Business
| Rule | Status |
|------|--------|
| 3.1.1 In-App Purchase | ✅ Physical goods exempt from IAP |
| 3.2 Other Business Models | ✅ E-commerce allowed |

### Section 4 — Design (HIG)
| Rule | Status |
|------|--------|
| 4.0 Copycats | ✅ Original app |
| 4.2 Minimum functionality | ⚠️ Payments must actually work |
| 4.8 Login required | ⚠️ Guest checkout exists but account required for full features |
| Safe area insets | ⚠️ Verify iPhone 15 Pro notch/island handling |
| Large text / Dynamic Type | ❌ Not implemented |

### Section 5 — Legal
| Rule | Status |
|------|--------|
| 5.1.1 Privacy Policy | ✅ `/privacy-policy` route exists |
| 5.1.2 Permission usage | ⚠️ Camera/photo descriptions must be complete |
| 5.1.5 Location services | ✅ Not using persistent location |

---

## 5. App Store Metadata Requirements

| Item | Status | Notes |
|------|--------|-------|
| App name | ✅ "Pellazgo Shop" | ≤30 chars |
| Subtitle | ✅ "Albanian Premium E-Commerce" | ≤30 chars |
| Description | ✅ Written in AppStoreMetadata.md | |
| Keywords | ✅ Listed | Review for ASO |
| Screenshots (6.7") | ❌ Not created | **Required** |
| Screenshots (5.5") | ❌ Not created | **Required** |
| iPad screenshots | ⚠️ Optional but recommended | |
| App Preview video | ⚠️ Optional | Increases conversion |
| Support URL | ✅ pellazgo.com/contact | |
| Privacy Policy URL | ✅ pellazgo.com/privacy-policy | |
| Rating | ✅ 4+ (no objectionable content) | |
| Category | ✅ Shopping | |

---

## 6. App Icon

| Size | Required | Status |
|------|---------|--------|
| 1024×1024 | ✅ Required | ⚠️ Present but filename has spaces |
| All @1x @2x @3x sizes | ✅ Required | ❌ Missing — only 1024 present |

**Fix:** Use `@capacitor/assets` to generate all required icon sizes:
```bash
npm install @capacitor/assets --save-dev
npx capacitor-assets generate --ios
```
Provide a 1024×1024 source PNG at `assets/icon.png`.

---
## 7. Localization

| Language | Status |
|---------|--------|
| Albanian (sq) | ✅ Full support |
| English (en) | ✅ Full support |
| App Store listing (Albanian) | ✅ Prepared in AppStoreMetadata.md |
| App Store listing (English) | ✅ Prepared |
| Right-to-left support | N/A (Albanian/English are LTR) |

---

## 8. App Store Review Notes Template

Provide this in the "Review Notes" field:

```
Demo Account:
Email: demo@pellazgo.com
Password: Demo1234!

Notes:
- App is an e-commerce store for Albanian premium leather goods
- Bank transfer is the primary payment method for the Albanian market
- Stripe/PayPal available but require live credentials for processing
- Guest checkout available — no account required to browse or purchase
- Albanian and English languages supported
- Admin panel at /nothranted (separate credential, not for review)

Social Media:
- Instagram: @pellazgo.official
- Facebook: Pellazgo Official
- TikTok: @pellazgo.official
```

---

## 9. Critical Pre-Submission Checklist

- [ ] Create `PrivacyInfo.xcprivacy`
- [ ] Generate all icon sizes with `@capacitor/assets`
- [ ] Take screenshots on iPhone 15 Pro Max (6.7") and iPhone 8 Plus (5.5")
- [ ] Add Privacy Labels in App Store Connect
- [ ] Implement at least one working payment method
- [ ] Verify privacy policy URL is accessible
- [ ] Set App Review demo account
- [ ] Test on physical iPhone device
- [ ] Verify safe area handling (notch/Dynamic Island)
- [ ] Submit for App Review with complete metadata
