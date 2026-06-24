# RELEASE PLAN
## PellazgoShop — TestFlight & App Store Release
**Date:** 2026-06-24 | **Target Release:** Q3 2026

---

## Release Phases

```
Phase 0: Security Remediation    (Day 1 — MANDATORY before anything else)
Phase 1: Build Stabilization     (Days 2-3)
Phase 2: Feature Completion      (Days 4-10)
Phase 3: TestFlight Internal     (Days 11-14)
Phase 4: TestFlight External     (Days 15-21)
Phase 5: App Store Submission    (Day 22)
Phase 6: App Store Review        (Days 23-30, Apple timeline)
Phase 7: Phased Release          (Day 30+)
```

---

## Phase 0: Security Remediation (Day 1)

**MUST complete before pushing any new code:**

- [ ] Revoke `AuthKey_G457WC6V47` in App Store Connect
- [ ] Revoke distribution certificate at developer.apple.com
- [ ] Re-issue distribution certificate + export new P12
- [ ] Download fresh provisioning profile (no spaces in filename)
- [ ] Remove signing folder from git history: `git filter-repo`
- [ ] Update `.gitignore` to exclude all signing files
- [ ] Move all secrets to GitHub Secrets + Codemagic Secure Files
- [ ] Fix Codemagic `tiligo_asc` → create `pellazgo_asc` integration

---

## Phase 1: Build Stabilization (Days 2-3)

- [ ] Fix `capacitor.config.json` (add ios section, allowNavigation)
- [ ] Generate all app icon sizes with `@capacitor/assets`
- [ ] Add `PrivacyInfo.xcprivacy` to Xcode project
- [ ] Add permissions to `Info.plist` (camera, photo library)
- [ ] Rename provisioning profile (remove spaces)
- [ ] Fix Codemagic `TiliGo` references → `PellazgoShop`
- [ ] Verify clean `codemagic.yaml` build passes end-to-end

---

## Phase 2: Feature Completion (Days 4-10)

### Critical (must have for App Review)
- [ ] Implement real Stripe payment (Stripe Elements UI)
- [ ] Send confirmation email on order placement
- [ ] Decrement stock on order creation
- [ ] Validate coupon codes against Offer entity
- [ ] Create demo account for App Review team

### High Priority
- [ ] Apple Pay integration (`@capacitor/stripe` or web Apple Pay)
- [ ] Fix safe area insets (notch/Dynamic Island)
- [ ] Add `loading="lazy"` to product images

---

## Phase 3: TestFlight Internal (Days 11-14)

**Internal build (build 1.0.0, build number auto)**

Testers: Developer + 2 QA


| Day | Activity |
|-----|---------|
| 11 | Submit build to TestFlight via Codemagic |
| 11 | Install on iPhone 15 Pro Max + iPhone SE |
| 12 | Run through all 4 critical user journeys (see TEST_REPORT.md) |
| 12 | Test on iOS 15, 16, 17 |
| 13 | Fix all crash reports + layout issues |
| 14 | Rebuild and resubmit |

**Pass Criteria:**
- Zero crashes in 4 core journeys
- Payment flow completes
- Account login/register works
- All pages render without layout breaks

---

## Phase 4: TestFlight External (Days 15-21)

**External testers: 10 Albanian users**

Onboarding message (Albanian):
```
Mirë se vini në programin beta të Pellazgo Shop!
Ju ftojmë të testoni aplikacionin tonë të ri iOS.
Identifikohuni me emailin tuaj dhe na tregoni çfarë mendoni.
Kini kujdes: ky është version beta — mos vendosni porosi reale.
```

Focus areas:
- Language quality (Albanian text)
- Checkout confidence and clarity
- Performance on older iPhones (12, SE)
- Trust signals (design, product presentation)

---

## Phase 5: App Store Submission (Day 22)

### Pre-Submission Checklist

#### App Store Connect Setup
- [ ] Create app listing at appstoreconnect.apple.com
- [ ] Set bundle ID: `com.pellazgo.app`
- [ ] Configure Privacy Labels (see APP_STORE_AUDIT.md)
- [ ] Set age rating: 4+
- [ ] Add Privacy Policy URL: `https://pellazgo.com/privacy-policy`
- [ ] Add Support URL: `https://pellazgo.com/contact`

#### Screenshots
- [ ] iPhone 6.7" (15 Pro Max) — 5 screenshots minimum
- [ ] iPhone 5.5" (8 Plus) — 5 screenshots minimum
- [ ] Recommended screens: Home, Shop, Product Detail, Cart, Checkout

#### Metadata
- [ ] App name: "Pellazgo Shop" (≤30 chars)
- [ ] Subtitle: "Albanian Premium E-Commerce" (≤30 chars)
- [ ] Description (Albanian + English — see AppStoreMetadata.md)
- [ ] Keywords (Albanian + English mixed)

#### Build
- [ ] Upload production build via Codemagic/Transporter
- [ ] Build has correct version (1.0.0) and build number

#### Review Notes
- [ ] Demo account credentials
- [ ] Explanation of Albanian market context
- [ ] Payment method explanation (bank transfer primary)

---

## Rollback Plan

### If App Review Rejects
| Rejection Reason | Fix | Timeline |
|-----------------|-----|---------|
| Privacy Manifest missing | Add PrivacyInfo.xcprivacy | 1 day |
| Incomplete payment flow | Implement Stripe fully | 3-5 days |
| Crash on launch | Fix + resubmit | 1-2 days |
| Privacy Policy insufficient | Expand policy | 1 day |

### If Live App Has Critical Bug
1. Disable affected feature via Base44 app settings (instant — no App Store update needed, since it's a WebView app)
2. Push fix to Base44 platform → live immediately for all users
3. Submit minor version update (1.0.1) to App Store for any native layer fixes

**Key advantage of WebView/Capacitor:** Most bug fixes can be deployed instantly by updating the Base44 web app — no App Store review cycle needed for non-native changes.

---

## Monitoring Strategy

### Crash Reporting
- [ ] Implement `@capacitor/push-notifications` for future push
- [ ] Add Sentry (recommended): `npm install @sentry/capacitor`
- [ ] Review Xcode Organizer Crashes weekly

### Analytics
- [ ] Use existing TrafficAnalytics entity
- [ ] Monitor: session count, conversion rate, payment method distribution
- [ ] Alert on: cart abandonment spike, order creation failures

### Uptime
- [ ] Base44 platform SLA: 99.9% (managed)
- [ ] Monitor via UptimeRobot (free): check `pellazgo.com` every 5 minutes

---

## Version Roadmap

| Version | Target | Features |
|---------|--------|---------|
| 1.0.0 | Q3 2026 | Core store, bank transfer, guest checkout |
| 1.1.0 | Q3 2026 | Stripe live payments, Apple Pay |
| 1.2.0 | Q4 2026 | Push notifications, saved addresses |
| 2.0.0 | Q1 2027 | Native features (camera for AR try-on?), loyalty program |
