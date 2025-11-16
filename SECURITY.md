# Security Policy

## Overview

This document outlines the security measures, best practices, and policies for the Startup Dashboard Application. Security is a critical aspect of our application, and all developers must follow these guidelines.

## Table of Contents

1. [Reporting Security Vulnerabilities](#reporting-security-vulnerabilities)
2. [Security Best Practices](#security-best-practices)
3. [Authentication & Authorization](#authentication--authorization)
4. [Data Protection](#data-protection)
5. [Input Validation & Sanitization](#input-validation--sanitization)
6. [XSS Prevention](#xss-prevention)
7. [API Security](#api-security)
8. [NEAR Protocol Security](#near-protocol-security)
9. [Dependency Management](#dependency-management)
10. [Production Security Checklist](#production-security-checklist)

---

## Reporting Security Vulnerabilities

If you discover a security vulnerability, please DO NOT open a public issue. Instead:

1. Email security concerns to: security@yourdomain.com
2. Include detailed steps to reproduce the vulnerability
3. Wait for acknowledgment before public disclosure
4. Allow reasonable time for patching (typically 90 days)

We take all security reports seriously and will respond within 48 hours.

---

## Security Best Practices

### General Guidelines

1. **Never commit secrets to version control**
   - Use environment variables for all sensitive data
   - Keep `.env` files in `.gitignore`
   - Use `.env.example` for documenting required variables
   - Rotate credentials immediately if accidentally committed

2. **Follow the principle of least privilege**
   - Grant minimum necessary permissions
   - Implement role-based access control (RBAC)
   - Regularly audit user permissions

3. **Keep dependencies updated**
   - Run `npm audit` regularly
   - Update security-critical packages immediately
   - Review changelogs before updating

4. **Use HTTPS everywhere**
   - Enforce HTTPS in production
   - Use secure cookies
   - Implement HSTS headers

---

## Authentication & Authorization

### Current Implementation

The application supports two authentication methods:

1. **NEAR Wallet Authentication** (Recommended)
   - Blockchain-based authentication
   - No password storage required
   - Cryptographically secure

2. **Email/Password Authentication**
   - Traditional authentication method
   - **WARNING:** Current implementation is for demo purposes only
   - Must be replaced with proper backend authentication

### Security Requirements

#### NEAR Wallet Authentication

```javascript
// Good: Using NEAR wallet connection
const { wallet } = await initNear();
await wallet.requestSignIn({
  contractId: undefined,
  methodNames: [],
  successUrl: window.location.origin,
  failureUrl: window.location.origin,
});
```

**Best Practices:**
- Always verify wallet signatures on the backend
- Never trust client-side authentication alone
- Validate account IDs against expected formats
- Implement session timeouts

#### Email/Password Authentication

**IMPORTANT:** The current implementation accepts any email/password combination and is **NOT SECURE** for production use.

**Required for Production:**

1. **Backend API Integration**
   ```javascript
   // Replace current implementation with proper API calls
   const response = await fetch('/api/auth/login', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
     },
     body: JSON.stringify({ email, password }),
   });
   ```

2. **Password Requirements**
   - Minimum 12 characters (increased from 8)
   - Mix of uppercase, lowercase, numbers, and special characters
   - Prevent common passwords (use zxcvbn or similar)
   - Implement password strength meter

3. **Rate Limiting**
   - Limit login attempts (5 attempts per 15 minutes)
   - Implement account lockout after repeated failures
   - Use exponential backoff for failed attempts

4. **Multi-Factor Authentication (MFA)**
   - Implement TOTP-based 2FA
   - SMS fallback option
   - Recovery codes for account recovery

5. **Session Management**
   - Use HTTP-only, Secure cookies for session tokens
   - Implement CSRF protection
   - Short session lifetimes (15 minutes)
   - Refresh token rotation

### Token Storage

**DO:**
- Store JWT tokens in HTTP-only cookies
- Use secure, SameSite cookies
- Implement token rotation
- Set appropriate expiration times

**DON'T:**
- Store tokens in localStorage (XSS vulnerable)
- Store sensitive data in plain text
- Use long-lived tokens without refresh

### Logout Security

Always clean up all authentication data on logout:

```javascript
const logout = async () => {
  // Sign out from NEAR wallet if applicable
  if (state.authType === 'near' && wallet) {
    wallet.signOut();
  }

  // Clear all auth-related storage
  localStorage.removeItem('user');
  localStorage.removeItem('authType');
  localStorage.removeItem('rememberMe');
  sessionStorage.clear();

  // Clear any cached data
  clearAuthCache();

  // Redirect to login
  navigate('/login');
};
```

---

## Data Protection

### Sensitive Data Storage

**Encryption Required:**
- User personal information
- Financial data
- API keys and tokens
- Any PII (Personally Identifiable Information)

**Implementation:**

```javascript
import CryptoJS from 'crypto-js';

// Encrypt before storing
const encryptData = (data, key) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
};

// Decrypt when retrieving
const decryptData = (encryptedData, key) => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, key);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};
```

### LocalStorage Security

**Current State:** User data is stored in localStorage without encryption.

**Required Actions:**

1. Encrypt sensitive data before storing
2. Never store passwords or credit card information
3. Implement automatic cleanup on logout
4. Set data expiration times
5. Consider using IndexedDB for larger datasets

**Example Secure Storage:**

```javascript
// Use the provided storage utilities with encryption
import { saveToStorage, loadFromStorage } from './utils/storage';
import { sanitizeForStorage } from './utils/sanitize';

// Before saving
const userData = sanitizeForStorage(user);
const encrypted = encryptData(userData, getEncryptionKey());
saveToStorage('user', encrypted);
```

### Data Transmission

1. **Always use HTTPS** for data transmission
2. **Validate SSL certificates** in production
3. **Implement request signing** for sensitive operations
4. **Use secure WebSocket connections** (wss://)

---

## Input Validation & Sanitization

### Validation

All user inputs MUST be validated using the provided validation utilities:

```javascript
import { validateEmail, validatePassword, validateForm } from './utils/validation';

// Example: Form validation
const validationRules = {
  email: [validateEmail],
  password: [(value) => validatePassword(value, {
    minLength: 12,
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
    requireSpecialChar: true
  })],
};

const { isValid, errors } = validateForm(formData, validationRules);
```

### Sanitization

All user inputs MUST be sanitized before use:

```javascript
import {
  sanitizeString,
  sanitizeEmail,
  sanitizeUrl,
  escapeHtml,
  sanitizeObject
} from './utils/sanitize';

// Sanitize user input
const cleanEmail = sanitizeEmail(email);
const cleanName = sanitizeString(name, { trim: true });
const cleanUrl = sanitizeUrl(websiteUrl);

// Sanitize entire objects
const cleanData = sanitizeObject(formData);
```

### File Upload Security

**Requirements:**

1. **Validate file types**
   ```javascript
   const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
   const validation = validateFile(file, {
     maxSize: 5 * 1024 * 1024, // 5MB
     allowedTypes,
   });
   ```

2. **Scan for malware** (server-side)
3. **Rename uploaded files** (remove user-provided filenames)
4. **Store outside web root**
5. **Serve through CDN** with proper headers

---

## XSS Prevention

### No dangerouslySetInnerHTML

**NEVER use** `dangerouslySetInnerHTML` without proper sanitization.

**If absolutely necessary:**

```javascript
import DOMPurify from 'dompurify';

// Only use with sanitization
<div dangerouslySetInnerHTML={{
  __html: DOMPurify.sanitize(userContent)
}} />
```

### Content Security Policy (CSP)

**Current CSP (Too Permissive):**
```
default-src 'self' http: https: data: blob: 'unsafe-inline'
```

**Recommended CSP for Production:**
```
default-src 'self';
script-src 'self' 'nonce-{random}';
style-src 'self' 'nonce-{random}';
img-src 'self' data: https:;
font-src 'self' data:;
connect-src 'self' https://rpc.near.org https://wallet.near.org;
frame-ancestors 'none';
base-uri 'self';
form-action 'self';
```

### URL Validation

Always validate and sanitize URLs from user input:

```javascript
import { sanitizeUrl, validateUrl } from './utils/sanitize';

const cleanUrl = sanitizeUrl(userProvidedUrl);
const { isValid } = validateUrl(cleanUrl);

if (!isValid) {
  throw new ValidationError('Invalid URL');
}

// Additional check for javascript: or data: URLs
if (/^(javascript|data|vbscript):/i.test(cleanUrl)) {
  throw new SecurityError('Dangerous URL protocol detected');
}
```

---

## API Security

### API Keys and Secrets

**NEVER:**
- Hardcode API keys in source code
- Commit secrets to version control
- Expose API keys in client-side code
- Use the same keys for dev and prod

**ALWAYS:**
- Use environment variables
- Rotate keys regularly
- Use different keys per environment
- Implement key expiration

### API Request Security

```javascript
// Good: Secure API request
const makeSecureRequest = async (endpoint, data) => {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': getCsrfToken(),
      'Authorization': `Bearer ${getAuthToken()}`,
    },
    credentials: 'same-origin',
    body: JSON.stringify(sanitizeObject(data)),
  });

  if (!response.ok) {
    throw new AppError('API request failed', response.status);
  }

  return response.json();
};
```

### CORS Configuration

**Backend CORS Configuration (Example):**

```javascript
// Express.js example
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS.split(','),
  credentials: true,
  optionsSuccessStatus: 200,
  maxAge: 600, // 10 minutes
};

app.use(cors(corsOptions));
```

### Rate Limiting

Implement rate limiting for all API endpoints:

```javascript
// Backend implementation
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP',
});

app.use('/api/', apiLimiter);
```

---

## NEAR Protocol Security

### Wallet Connection Security

**Best Practices:**

1. **Always verify wallet connection status**
   ```javascript
   if (!wallet.isSignedIn()) {
     throw new AuthenticationError('Wallet not connected');
   }
   ```

2. **Validate account IDs**
   ```javascript
   const accountId = wallet.getAccountId();
   if (!/^[a-z0-9_-]+\.near$|^[a-z0-9_-]+\.testnet$/.test(accountId)) {
     throw new ValidationError('Invalid NEAR account ID');
   }
   ```

3. **Never expose private keys**
   - Private keys stay in NEAR wallet
   - Never request or store private keys
   - Use wallet signing methods

### Transaction Security

**Always validate transactions:**

```javascript
// Example: Secure transaction
const executeTransaction = async (amount, recipient) => {
  // Validate inputs
  if (!validateNumber(amount) || amount <= 0) {
    throw new ValidationError('Invalid amount');
  }

  if (!validateNearAccount(recipient)) {
    throw new ValidationError('Invalid recipient');
  }

  // Show user confirmation
  const confirmed = await showConfirmDialog({
    title: 'Confirm Transaction',
    message: `Send ${amount} NEAR to ${recipient}?`,
  });

  if (!confirmed) return;

  // Execute transaction
  try {
    const result = await wallet.sendTransaction({
      amount,
      recipient,
    });

    return result;
  } catch (error) {
    logError(error);
    throw new TransactionError('Transaction failed');
  }
};
```

### Smart Contract Security

1. **Validate all contract calls**
2. **Implement gas limits**
3. **Use view methods for read-only operations**
4. **Audit smart contracts before deployment**

---

## Dependency Management

### NPM Audit

**Run regularly:**
```bash
npm audit
npm audit fix
npm audit fix --force  # Only after reviewing changes
```

### Current Vulnerabilities

**Critical Issues Found:**
- `@babel/traverse` - RCE vulnerability
- `loader-utils` - Prototype pollution
- `form-data` - Weak random function
- Multiple high-severity vulnerabilities in dependencies

**Required Actions:**

1. **Update critical packages:**
   ```bash
   npm update @babel/traverse
   npm update loader-utils
   npm update form-data
   ```

2. **Review and update react-scripts:**
   ```bash
   npm install react-scripts@latest
   ```

3. **Consider alternative packages** for unmaintained dependencies

### Dependency Policies

1. **Pin versions** in package.json for production
2. **Review updates** before applying
3. **Test thoroughly** after updates
4. **Monitor security advisories**
5. **Use `npm ci`** for consistent installs

### Supply Chain Security

1. **Use package-lock.json**
2. **Verify package integrity**
3. **Audit new dependencies** before adding
4. **Use official packages** only
5. **Consider using Snyk or similar tools**

---

## Production Security Checklist

### Pre-Deployment

- [ ] Remove all console.log statements from production code
- [ ] Verify no secrets in code or environment files
- [ ] Update all dependencies with security patches
- [ ] Run security audit (`npm audit`)
- [ ] Enable CSP headers
- [ ] Configure HTTPS/SSL certificates
- [ ] Set secure cookie flags
- [ ] Enable HSTS headers
- [ ] Implement rate limiting
- [ ] Configure CORS properly
- [ ] Set up error monitoring (Sentry, etc.)
- [ ] Enable production error logging
- [ ] Disable source maps in production
- [ ] Remove development tools from production build
- [ ] Verify authentication implementation
- [ ] Test authorization rules
- [ ] Implement session management
- [ ] Set up backup procedures
- [ ] Configure monitoring and alerts

### Environment Variables

**Required Production Variables:**
```env
# Application
REACT_APP_API_BASE_URL=https://api.yourdomain.com
REACT_APP_NEAR_NETWORK=mainnet
REACT_APP_NEAR_CONTRACT_NAME=your-contract.near

# Analytics (Optional)
REACT_APP_GA_TRACKING_ID=G-XXXXXXXXXX
REACT_APP_SENTRY_DSN=https://xxx@sentry.io/xxx

# Build Configuration
NODE_ENV=production
GENERATE_SOURCEMAP=false
```

### Nginx Configuration

**Enhance nginx.conf for production:**

```nginx
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name yourdomain.com;

    # SSL Configuration
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Redirect HTTP to HTTPS
    if ($scheme != "https") {
        return 301 https://$server_name$request_uri;
    }

    # Enhanced Security Headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://rpc.near.org https://wallet.near.org; frame-ancestors 'none'; base-uri 'self'; form-action 'self'" always;
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;

    # ... rest of configuration
}

# HTTP server - redirect to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

### Monitoring

**Implement:**
1. Error tracking (Sentry)
2. Performance monitoring
3. Security event logging
4. Automated alerts for suspicious activity
5. Regular security audits

### Incident Response

**Prepare:**
1. Document incident response procedures
2. Maintain security contact information
3. Have rollback procedures ready
4. Keep security patches ready
5. Regular security drills

---

## Security Headers Reference

### Recommended Headers

```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
Content-Security-Policy: [see CSP section above]
```

---

## Additional Resources

### Security Tools

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Snyk](https://snyk.io/) - Dependency scanning
- [npm audit](https://docs.npmjs.com/cli/v8/commands/npm-audit)
- [Security Headers](https://securityheaders.com/)
- [SSL Labs](https://www.ssllabs.com/ssltest/)

### Best Practices

- [React Security Best Practices](https://snyk.io/blog/10-react-security-best-practices/)
- [NEAR Security Best Practices](https://docs.near.org/develop/contracts/security/welcome)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)

---

## Version History

- v1.0.0 - Initial security documentation
- Last Updated: 2025-11-16

---

**Remember:** Security is everyone's responsibility. If you have questions or concerns, reach out to the security team immediately.
