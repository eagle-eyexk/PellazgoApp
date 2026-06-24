# REPOSITORY DISCOVERY
## PellazgoShop — Architecture Audit
**Date:** 2026-06-24 | **Auditor:** Base44 Principal Architect | **Repo:** eagle-eyexk/PellazgoShop

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     PELLAZGO SHOP STACK                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────┐  │
│  │   React 19   │    │  Vite 8.x    │    │  Tailwind CSS    │  │
│  │  (Frontend)  │───▶│  (Bundler)   │───▶│  (Styling)       │  │
│  └──────────────┘    └──────────────┘    └──────────────────┘  │
│           │                  │                                  │
│           ▼                  ▼                                  │
│  ┌──────────────────────────────────────┐                       │
│  │         Base44 BaaS Platform         │                       │
│  │  • Entities (DB)  • Auth  • Storage  │                       │
│  │  • Integrations   • Functions        │                       │
│  └──────────────────────────────────────┘                       │
│           │                                                     │
│           ▼                                                     │
│  ┌──────────────────────────────────────┐                       │
│  │       Capacitor 5.x (iOS Bridge)     │                       │
│  │   webDir: dist/   appId: com.pellazgo│                       │
│  └──────────────────────────────────────┘                       │
│           │                                                     │
│           ▼                                                     │
│  ┌──────────────────────────────────────┐                       │
│  │         Native iOS (Swift)           │                       │
│  │  AppDelegate.swift (Capacitor shell) │                       │
│  │  Bundle: com.pellazgo.app            │                       │
│  │  Team: H4QUDPK7S3                    │                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Folder Structure (Actual)
│       ├── App.xcworkspace/      ← Workspace (CocoaPods integrated)
│       └── App/
│           ├── AppDelegate.swift ← Capacitor AppDelegate
│           ├── Assets.xcassets/  ← AppIcon + Splash images
│           ├── Base.lproj/       ← LaunchScreen.storyboard
│           └── Info.plist        ← (inferred, standard Capacitor)
├── signing/
│   ├── AuthKey_G457WC6V47.p8    ⚠️ CRITICAL: ASC API key in repo
│   ├── Pellazgo_Shop (2).mobileprovision
│   ├── distribution (2).cer
│   ├── pellazgo.csr
│   ├── pellazgo.key             ⚠️ CRITICAL: Private key in repo
│   ├── pellazgo.p12             ⚠️ CRITICAL: P12 cert in repo
│   └── pellazgo.pem             ⚠️ CRITICAL: PEM cert in repo
├── src/
│   └── App.jsx                  ← Single React entry (stubs only — actual app is on Base44)
├── .gitignore                   ← Missing signing/* exclusion ⚠️
├── capacitor.config.json        ← appId: com.pellazgo.app
├── codemagic.yaml               ← Codemagic CI (primary build pipeline)
├── index.html                   ← Vite entry point
└── package.json                 ← React 19 + Capacitor 5 + Vite 8
```

---

## 3. Frontend Framework

| Property | Value |
|----------|-------|
| Framework | React 19.2.7 |
| Bundler | Vite 8.0.16 |
| CSS | Tailwind CSS (inferred from base44 app) |
| State Management | React hooks + Base44 SDK + React Query |
| Routing | React Router DOM v6 |
| Language | JavaScript (JSX) |
| I18n | Custom (Albanian/English) |

**Note:** The GitHub repo contains a minimal `src/App.jsx` stub. The full production source lives in the Base44 platform editor and is synced via the Base44-to-GitHub integration. The GitHub repo represents the **build artifact layer**, not the development source.

---

## 4. Backend / BaaS

| Service | Provider | Notes |
|---------|----------|-------|
| Database | Base44 Entities | Products, Orders, Customers, Categories, etc. |
| Authentication | Base44 Auth | JWT, Google OAuth, OTP, Email/Password |
| File Storage | Base44 Storage | Product images, profile photos |
| LLM / AI | Base44 Core (InvokeLLM) | Product descriptions, search |
| Email | Base44 Core (SendEmail) | Order confirmation |
| Functions | Base44 Backend | Webhooks, logic |

---

## 5. Mobile Framework

| Property | Value |
|----------|-------|
| Framework | Capacitor 5.7.8 |
| appId | com.pellazgo.app |
| appName | Pellazgo |
| webDir | dist |
| bundledWebRuntime | false |
| androidScheme | https |
| iOS target | 13.0+ (Capacitor 5 default) |
| Native shell | Swift (AppDelegate + Capacitor) |

---

## 6. CI/CD Pipelines

### Pipeline A: GitHub Actions (`.github/workflows/ios.yml`)
- Trigger: push to main
- Build: Node 22, npm install + vite build
- Capacitor: rm -rf ios → cap add ios → cap sync
- Signing: Manual, reads from `signing/` folder in repo
- Archive: xcodebuild Manual signing
- Output: IPA artifact (uploaded to workflow artifacts only — no TestFlight push)

### Pipeline B: Codemagic (`codemagic.yaml`)
- Trigger: push to main
- Instance: mac_mini_m1
- Signing: Automatic (via Codemagic `tiligo_asc` integration)
- Archive: Automatic signing, `DEVELOPMENT_TEAM=H4QUDPK7S3`
- Output: Publishes to TestFlight via `app_store_connect: tiligo_asc`
- **Note:** References `TiliGo` in archive path name — likely copy-paste from another project

---

## 7. Data Flow Diagram

```
User Device (iOS)
      │
      ▼
Capacitor WKWebView
      │  (loads from dist/ or live URL)
      ▼
React SPA (Vite bundle)
      │
      ├──► Base44 Auth API ──────────────► JWT Token
      │         │
      │         ▼
      ├──► Base44 Entities API ──────────► Products, Orders, Customers
      │
      ├──► Base44 Integrations API
      │         ├──► InvokeLLM (AI)
      │         ├──► SendEmail
      │         └──► UploadFile
      │
      └──► Payment Processors
                ├──► Stripe (configured, not live keys found)
                ├──► PayPal (configured in UI)
                └──► Bank Transfer (manual)
```

---

## 8. Authentication Flow

```
Register → OTP Verify → setToken → Hard Redirect (/)
Login    → setToken   → Hard Redirect (/)
Google   → OAuth      → setToken → Redirect
Admin    → SHA-256 hash comparison → sessionStorage TTL 4h
```

---

## 9. Service Dependency Map

```
PellazgoShop App
├── REQUIRED (app won't run without)
│   ├── Base44 SDK (@base44/sdk)
│   ├── React 19
│   └── Vite 8 (build time)
│
├── REQUIRED (mobile shell)
│   ├── @capacitor/core 5.x
│   ├── @capacitor/ios 5.x
├── ios/
│   └── App/
│       ├── App.xcodeproj/        ← Xcode project (real Capacitor-generated)
│   └── CocoaPods (Capacitor pods)
│
├── .github/
│   └── workflows/
│       └── ios.yml               ← GitHub Actions CI/CD
├── OPTIONAL (features degrade gracefully)

```
PellazgoShop/
│   ├── Stripe (payments)
│   ├── InvokeLLM (AI features)
│   └── SendEmail (notifications)

│
└── CI/CD
    ├── Codemagic (primary — TestFlight push)
    └── GitHub Actions (secondary — IPA artifact only)
```

---

## 10. Environment Configuration

| Variable | Location | Status |
|----------|----------|--------|
| Base44 App ID | `lib/app-params.js` | Hardcoded in platform |
| Stripe PK | Base44 env (inferred) | Not in repo |
| Admin hashes | `lib/adminAuth.js` | Hardcoded SHA-256 |
| Team ID | `codemagic.yaml`, `ios.yml` | Hardcoded: H4QUDPK7S3 |
| Bundle ID | `capacitor.config.json` | Hardcoded: com.pellazgo.app |
| ASC API Key ID | `signing/AuthKey_G457WC6V47.p8` | **IN REPO — CRITICAL** |
| P12 Password | `ios.yml` line: `-P "Pellazgo"` | **HARDCODED — CRITICAL** |
