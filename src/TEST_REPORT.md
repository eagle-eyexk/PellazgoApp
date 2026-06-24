# TEST REPORT
## PellazgoShop — Testing Strategy & Coverage
**Date:** 2026-06-24

---

## Current Test Coverage: 0%

No automated tests exist in the repository. No test framework is configured. This section defines the required test suite to achieve production readiness.

---

## 1. Unit Tests (Required)

### Framework Recommendation
```bash
npm install --save-dev vitest @testing-library/react @testing-library/user-event jsdom
```

### Test Cases to Implement

#### Cart Store (`lib/cartStore.jsx`)
```javascript
describe('CartStore', () => {
  it('adds item to cart')
  it('increments quantity for duplicate item')
  it('removes item from cart')
  it('calculates subtotal correctly')
  it('persists cart to localStorage')
  it('clears cart after order placement')
})
```

#### i18n (`lib/i18n.jsx`)
```javascript
describe('LanguageProvider', () => {
  it('defaults to Albanian (sq)')
  it('switches to English')
  it('returns correct translation key')
  it('falls back to key for missing translation')
})
```

#### Admin Auth (`lib/adminAuth.js`)
```javascript
describe('adminAuth', () => {
  it('verifyAdminCredentials returns true for correct credentials')
  it('verifyAdminCredentials returns false for wrong password')
  it('setAdminSession stores TTL in sessionStorage')
  it('isAdminSessionValid returns false after TTL expires')
  it('clearAdminSession removes key')
})
```

---

## 2. Integration Tests (Required)

### Framework
```bash
npm install --save-dev msw  # Mock Service Worker for API mocking
```

### Checkout Flow
```javascript
describe('Checkout Integration', () => {
  it('renders empty cart redirect when no items')
  it('step 1: validates required fields before proceeding')
  it('step 2: selects payment method')
  it('step 3: shows order review')
  it('step 4: places order and shows confirmation')
  it('creates Order entity with correct data')
  it('clears cart after successful order')
})
```

### Authentication Flow
```javascript
describe('Auth Integration', () => {
  it('unauthenticated user sees login/register on Account page')
  it('authenticated user sees dashboard on Account page')
  it('logout clears session and redirects')
})
```

---

## 3. UI / End-to-End Tests

### Framework Recommendation: Playwright
```bash
npm install --save-dev @playwright/test
```

### Critical User Journeys

#### Journey 1: Guest Purchase
```
1. Visit homepage
2. Browse shop → add product to cart
3. Click cart → verify item appears
4. Proceed to checkout
5. Fill contact information
6. Select bank transfer
7. Review order
8. Place order → verify confirmation screen
9. Verify order number displayed
10. Navigate to track order
```

#### Journey 2: Account Registration
```
1. Click "Register" in navbar
2. Enter email + password
3. Complete OTP verification
4. Verify redirect to home
5. Visit Account page → verify dashboard visible
6. Check orders tab (empty state)
```

#### Journey 3: Admin Login
```
1. Navigate to /nothranted
2. Verify admin gate shows (not app content)
3. Enter wrong credentials → verify error + attempt count
4. Enter correct credentials → verify admin dashboard
5. Navigate admin sections
6. Verify logout clears session
```

#### Journey 4: Search & Filter
```
1. Visit /shop
2. Search for "çantë"
3. Verify filtered results
4. Apply category filter
5. Verify results update
6. Clear filters
```

---

## 4. iOS-Specific Tests (XCTest)

### Required XCUITest Scenarios
```swift
// Manual test on physical device / TestFlight
func testAppLaunch() {
    // App launches without crash
    // Splash screen appears
    // Home page loads within 3s
}

func testWebViewNavigation() {
    // All nav links work
    // Back gestures work (swipe right)
    // Pull-to-refresh works
}

func testCartBadge() {
    // Adding item updates badge count
    // Cart badge visible in nav
}
func testSafeAreaInsets() {
    // Content not hidden behind notch

    // Dynamic Island not overlapping content
    // Home indicator not overlapping footer

}

func testKeyboardBehavior() {
    // Keyboard pushes form fields up
    // Form scrollable when keyboard open
    // Checkout form usable on small screen
}
```

---

## 6. Security Tests

| Test | Method | Expected |
|------|--------|---------|
| Admin route without auth | Navigate to /nothranted | Admin gate shows |
| Admin brute force | 5+ wrong passwords | Lockout message |
| Account without login | Navigate to /account | Login/register screen |
| Order data without auth | Direct API call | Depends on entity RLS |
| XSS in review comment | Enter `<script>alert(1)</script>` | Escaped in display |

---

## 7. TestFlight Testing Plan

### Internal Testers (Phase 1)
- Developer + 2 team members
- Test all flows above manually
- Focus: crash detection, layout on real devices

### External Testers (Phase 2)
- 5-10 Albanian users from target demographic
- Guided testing of checkout flow
- Feedback: language quality, UX clarity, payment confidence

### Devices to Test
| Device | iOS | Priority |
|--------|-----|---------|
| iPhone 15 Pro Max | 17.x | 🔴 Required |
| iPhone 14 | 16.x | 🔴 Required |
| iPhone 12 | 15.x | 🟡 Recommended |
---
| Low stock warning | Manual | Add product to cart, reduce stock to 0 in admin, verify behavior |

| iPhone SE (3rd gen) | 16.x | 🟡 Small screen test |

| PayPal sandbox | PayPal sandbox account | Order created, payment_status: paid |
| Order confirmation email | Manual | Email received at customer address |
| iPad Pro 12.9 | 17.x | 🟢 Optional |

---

## Test Coverage Target
## 5. Payment Tests (Manual — Requires Stripe Test Mode)
| Bank transfer order creation | Manual | Order created, payment_status: unpaid |
| Stripe payment (test mode) | Stripe test card `4242 4242 4242 4242` | Order created, payment_status: paid |

| Layer | Current | Target |

| Test | Method | Expected |
|------|--------|---------|
|-------|---------|--------|
| Unit tests | 0% | 70% |
| Integration tests | 0% | 50% |
| E2E tests | 0% | Critical paths only |
| Manual iOS tests | Informal | Structured (checklist above) |
