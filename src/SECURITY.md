# Pellazgo — Zero Trust Security Policy

## Overview
Pellazgo implements a **zero-trust security architecture** across all systems: frontend, backend, and admin panel. This document outlines the security implementation.

---

## 1. Authentication & Authorization

### User Authentication (Frontend)
- **Status**: Base44 platform-managed
- **Implementation**:
  - Email/password or Google OAuth
  - JWT token-based sessions
  - Session expiry: 24 hours
  - Tokens stored in secure, HTTP-only cookies (via SDK)
  
### Admin Authentication (Restricted)
- **Path**: `/nothranted/*` (obfuscated)
- **Credentials**: SHA-256 hashed (plaintext NEVER stored)
- **Hash Verification**: Client-side crypto.subtle.digest()
- **Session Management**:
  - sessionStorage (not persisted across browser close)
  - TTL: 4 hours with timeout
  - Timestamp-based validation
### Account Access
- **Requirement**: Logged-in users only
- **Gate**: Account page redirects unauthenticated users to login/register
- **No Dummy Data**: Profile info hidden for guests

---


## 2. Rate Limiting & Brute Force Protection

### Admin Panel
| Metric | Behavior |
|--------|----------|
| **Failed Attempts** | 3-5-7 attempts trigger escalating lockout |
| **Lockout Durations** | 30s → 120s → 300s (exponential) |
| **Delay Per Attempt** | 300ms minimum (mitigates timing attacks) |
| **Session Reset** | Successful login resets attempt counter |

### Guest Checkout
- No authentication required
- Email field validated (format check)
- Phone field sanitized (numbers/dashes only)

---

## 3. Data Protection

### In Transit
- HTTPS enforced (platform-managed)
- Content-Security-Policy headers (platform-managed)
- X-Frame-Options: DENY (blocks clickjacking)

### At Rest
- **Order Data**: Encrypted by Base44 platform
- **Admin Credentials**: SHA-256 hashes only
- **PII**: Collected only for order processing
  - Customer email, name, phone, address
  - No credit card data (payment gateway handled by Base44)

### Sensitive Endpoints
| Endpoint | Auth | Method | Validation |
|----------|------|--------|-----------|
| `/account/*` | Required | Protected Route | User email match |
| `/nothranted/*` | Admin SHA-256 | Session + Hash | Exponential backoff |
| `/checkout` | Optional | Form validation | Email, phone format |
| `/api/orders` | Optional | Guest/User | Create-only, no read |

---

## 4. Admin Panel Security

### Obfuscation
- **Route**: `/nothranted` (not `/admin` or `/dashboard`)
- **No Public References**: Links hidden from store UI
- **Access Only Via**: Direct URL or backend redirect

### Credential Handling
```javascript
// Credentials hashed before storage
const username_hash = sha256(username);
const password_hash = sha256(password);

// Verification: both hashes must match stored hashes
// Plaintext values never logged or exposed
```

### Session Isolation
- **Storage**: sessionStorage (tab-specific, cleared on close)
- **Not Persistent**: Requires re-login on browser restart
- **Timeout**: 4 hours with validation check

---

## 5. Base44 Badge Removal

The Base44 edit badge and branding have been removed:
- **CSS Rule**: `#base44-edit-badge { display: none !important; }`
- **Scope**: All known badge selectors covered
- **Fallback**: Multiple CSS targeting for complete coverage

---

## 6. Guest Checkout Security

### Information Collected
| Field | Validation | Purpose |
|-------|-----------|---------|
| Email | RFC 5322 format | Order confirmation |
| Name | Trimmed, 1-100 chars | Shipping label |
| Phone | Digits + dashes | Delivery contact |
| Address | Text, 5-200 chars | Shipping address |

### No Authentication Assumption
- **Zero trust principle**: Never assume guest is valid
- **Order tracking**: Uses `order_number` (unique token), not email alone
- **Fraud check**: (Optional) Email validation on checkout

---

## 7. Compliance & Best Practices

### Standards
- ✅ OWASP Top 10 (mitigation implemented)
- ✅ Zero-trust principles
- ✅ Defense in depth (multiple layers)
- ✅ Least privilege (minimal data collection)

### Audit Trail
- Order creation logged with metadata
- Admin login attempts not logged (privacy-first)
- Traffic source tracked for analytics only

---

## 8. Environment Variables & Secrets

### Required Secrets
```env
ADMIN_USERNAME_HASH=<sha256 hash>
ADMIN_PASSWORD_HASH=<sha256 hash>
STRIPE_PUBLIC_KEY=pk_live_***
STRIPE_SECRET_KEY=sk_live_***
DATABASE_URL=<base44 app id>
```

### Never Committed
- Plaintext credentials
- API keys / secrets
- Private signing certificates

---

## 9. Incident Response

### Suspected Breach
1. Clear all sessionStorage (admin sessions)
2. Invalidate all active user tokens (via platform)
3. Rotate admin hashes
4. Review order database for unauthorized changes

### Brute Force Detected
- Admin lockout already triggered at 7 attempts
- IP-level rate limiting (platform feature)
- Manual intervention: Clear sessionStorage

---

## 10. Regular Reviews

- **Monthly**: Check admin panel logs
- **Quarterly**: Update dependencies (security patches)
- **Annually**: Security audit + penetration test

---

## Contact

For security concerns: **info@pellazgo.com**

---

*Last Updated: 2026-06-23*
*Version: 1.0*
