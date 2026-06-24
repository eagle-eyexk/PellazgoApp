# ECOMMERCE AUDIT
## PellazgoShop — Commerce Readiness Review
**Date:** 2026-06-24

---

## Entity Schema Review

| Entity | Fields | Status | Issues |
|--------|--------|--------|--------|
| Product | name_sq/en, price, sale_price, images[], stock, SKU, category | ✅ Complete | Missing weight/dimensions for shipping calc |
| Category | name_sq/en, slug, parent_id, is_active | ✅ Good | |
| Order | order_number, items[], billing/shipping_address, status, payment | ✅ Complete | Missing shipping carrier field |
| Customer | email, full_name, phone, rewards_points, wishlist[] | ✅ Good | |
| Offer | code, discount_type, discount_value, min_purchase, usage_limit | ✅ Complete | |
| Review | product_id, rating, comment, is_approved | ✅ Basic | Missing verified_purchase flag |

---

## Checkout Flow Audit

### Step 1: Contact & Delivery
| Check | Status | Notes |
|-------|--------|-------|
| First/last name | ✅ | Split properly |
| Email validation | ⚠️ | HTML type="email" only — no custom validation |
| Phone field | ✅ | Optional, correct |
| Billing address | ✅ | 4 fields |
| Same-as-billing checkbox | ✅ | Toggles shipping section |
| Separate shipping | ✅ | Properly implemented |
| Order notes | ✅ | Optional textarea |
| Continue button guard | ✅ | Disabled if required fields empty |

### Step 2: Payment
| Method | Status | Notes |
|--------|--------|-------|
| Bank Transfer | ✅ | Default, working |
| Stripe | ⚠️ | UI shows it but no Stripe Elements implementation |
| PayPal | ⚠️ | UI shows it but no PayPal SDK integration |
| Apple Pay | ❌ | Not present — critical for iOS App Store |

### Step 3: Review
| Check | Status | Notes |
|-------|--------|-------|
| Contact summary | ✅ | |
| Item list with images | ✅ | |
| Back navigation | ✅ | |
| Place order action | ✅ | |

### Step 4: Confirmation
| Check | Status | Notes |
|-------|--------|-------|
| Order number display | ✅ | `PLZ-{timestamp}` format |
| Email confirmation (UI text) | ✅ | Mentions email send |
| Actual confirmation email | ❌ | `SendEmail` integration not called in checkout flow |
| Track order link | ✅ | |
| Continue shopping link | ✅ | |

---

## Payment Implementation Status

### Stripe
| Item | Status |
|------|--------|
| `@stripe/react-stripe-js` installed | ✅ |
| Stripe Elements UI | ❌ Not implemented |
| Payment Intent creation | ❌ Not implemented |
| Webhook handling | ❌ Not implemented |
| Test mode | N/A |
| Production keys | N/A |

**Assessment:** Stripe is listed as a payment option in the UI but tapping it does nothing beyond selecting a radio button. No actual payment processing occurs. Orders with `payment_method: 'stripe'` are created with `payment_status: 'unpaid'`.

### PayPal
**Assessment:** Same as Stripe — UI only, no SDK integration.

### Bank Transfer
**Assessment:** ✅ Functional. Creates an order with `payment_method: 'bank_transfer'` and `payment_status: 'unpaid'`. Manual fulfillment required.

### Apple Pay
**Assessment:** ❌ Not implemented. For an iOS app on the App Store, Apple Pay is strongly recommended and expected by Albanian users familiar with iPhones. Required for premium UX.

---

## Cart Implementation

| Feature | Status | Notes |
|---------|--------|-------|
| Add to cart | ✅ | With quantity |
| Remove from cart | ✅ | |
| Quantity adjustment | ✅ | +/- buttons |
| Cart persistence | ⚠️ | localStorage via cartStore — not synced to DB |
| Cart item count (Navbar) | ✅ | Real-time badge |
| Free shipping threshold | ✅ | €50 threshold |
| Coupon code field | ⚠️ | UI present but not validated against Offer entity |

---

## Inventory Management

| Feature | Status | Notes |
|---------|--------|-------|
| Stock field | ✅ | On Product entity |
| Low stock threshold | ✅ | `low_stock_threshold` field |
| Stock decrement on order | ❌ | Orders created but `Product.stock` not decremented |
| Out-of-stock prevention | ❌ | No check before add-to-cart |
| Admin stock alerts | ✅ | Dashboard shows low stock |

---

## Discount / Coupon System

| Feature | Status | Notes |
|---------|--------|-------|
| Offer entity | ✅ | Full schema with types |
| Admin offer management | ✅ | AdminOffers page |
| Coupon code UI in cart | ✅ | Text input present |
| Coupon validation logic | ❌ | Not wired to Offer entity |
| Percentage discounts | ❌ | No frontend implementation |
| Flash sale pricing | ❌ | `sale_price` field exists but no automatic flash sale toggle |

---

## Order Management

| Feature | Status | Notes |
|---------|--------|-------|
| Order creation | ✅ | Complete |
| Guest orders | ✅ | `is_guest: true` flag |
| Order status tracking | ✅ | Full lifecycle enum |
| Admin order management | ✅ | Status updates, tracking number |
| Order history (customer) | ✅ | In Account page |
| Order tracking page | ✅ | `/track-order` route |
| Email on order | ❌ | Not sending confirmation email |
| Refund flow | ❌ | Status exists (`returned`) but no refund process |
| Shipping integration | ❌ | Tracking number manual-only |

---

## Critical E-Commerce Gaps

| Issue | Priority | Impact |
|-------|----------|--------|
| No real payment processing (Stripe/PayPal not wired) | 🔴 Critical | Cannot take live payments |
| No Apple Pay | 🔴 Critical | iOS users expect it |
| No confirmation email sent | 🟠 High | Customer trust |
| Stock not decremented on order | 🟠 High | Overselling risk |
| Coupon codes not validated | 🟡 Medium | Promo campaigns broken |
| No refund/return flow | 🟡 Medium | Post-purchase experience |
| Cart not synced to server | 🟡 Medium | Lost on browser clear |

---

## E-Commerce Readiness Score: 52/100

Strong foundation with correct entity architecture. Core gaps are in payment processing activation and post-order automation.
