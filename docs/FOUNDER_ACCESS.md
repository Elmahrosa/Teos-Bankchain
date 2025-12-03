# Founder Access Documentation

## Overview

TEOS BankChain includes a secure, separate authentication system for founder/executive access to the Founder Dashboard. This system is completely isolated from regular user authentication to prevent unauthorized access.

## Security Architecture

### Separate Login Portal

- **User Login**: `/login` - For customers, business accounts, and bank staff
- **Founder Login**: `/founder-login` - Hidden endpoint for founder access only
- **No Cross-Visibility**: Regular users never see the Founder Login option

### Authentication Method

**Username-based Authentication**
- Username: `aasm1969` (configured via `FOUNDER_USERNAME` env variable)
- Password: Bcrypt-hashed password stored in `FOUNDER_PASSWORD_HASH` env variable
- Session: 24-hour JWT token with full permissions

### Access URL

Direct URL: `https://bankchain.teosegypt.com/founder-login`

**Security Note**: This URL is NOT linked anywhere in the user interface to prevent discovery.

## Setup Instructions

### 1. Generate Secure Password Hash

\`\`\`bash
# Using Node.js
npm install bcrypt
node -e "console.log(require('bcrypt').hashSync('YOUR_SECURE_PASSWORD', 10))"
\`\`\`

Example output:
\`\`\`
$2b$10$N9qo8uLOickgx2ZMRZoMye.IjdF.SfQXdpU9UYvIvT8vFQqN9vK6i
\`\`\`

### 2. Configure Environment Variables

Add to Vercel Dashboard → Settings → Environment Variables:

\`\`\`env
FOUNDER_USERNAME=aasm1969
FOUNDER_PASSWORD_HASH=$2b$10$YOUR_GENERATED_HASH_HERE
\`\`\`

### 3. Access the Founder Dashboard

1. Navigate to: `https://bankchain.teosegypt.com/founder-login`
2. Enter username: `aasm1969`
3. Enter your secure password
4. Access granted to Founder Dashboard with full permissions

## Security Best Practices

### Password Requirements

- Minimum 16 characters
- Mix of uppercase, lowercase, numbers, and symbols
- NOT based on dictionary words or personal information
- Rotated every 90 days
- Never shared via email or unencrypted channels

### Access Control

- Only accessible to authorized founders/executives
- All login attempts are logged in audit system
- Failed login attempts trigger security alerts
- IP-based rate limiting (5 attempts per hour)
- Session timeout: 24 hours of inactivity

### Audit Trail

Every founder login creates an audit log entry with:
- Timestamp
- IP address
- User agent
- Authentication method
- Session duration
- Actions performed

## Founder Dashboard Capabilities

### Full Access Permissions

\`\`\`typescript
permissions: ["*"] // Complete system access
\`\`\`

### Available Features

1. **Analytics & KPIs**
   - Real-time MENA-wide metrics
   - Daily Active Pioneers & KYC completion
   - SLA compliance monitoring (99.9% uptime)
   - Revenue tracking (Pump launchpad + transfers)

2. **Support & Operations**
   - Ticket queue management
   - Resolution time tracking
   - CSAT score monitoring

3. **Financial Oversight**
   - $TEOS treasury balance
   - Staking pool APY
   - Transaction volume & fees

4. **Compliance & Risk**
   - Sanctions/AML screening hits
   - Manual review queue
   - Audit log exports (CSV + JSON)
   - ISO-20022 compliance reports

5. **Alerts & Notifications**
   - Custom threshold alerts
   - Push/Email/Telegram notifications
   - System health monitoring

## Emergency Access

### Password Reset

If founder password is lost:

1. Access server with database credentials
2. Generate new bcrypt hash
3. Update `FOUNDER_PASSWORD_HASH` in Vercel environment variables
4. Redeploy application or wait for automatic environment sync

### Account Lockout

If account is locked after failed attempts:

1. Access Redis cache or database
2. Clear lockout counter: `DEL founder_lockout:aasm1969`
3. Account automatically unlocks after 1 hour

## Compliance Notes

### Regulatory Requirements

- All founder access logged for SOC2/ISO27001 compliance
- Audit trail retained for 7 years
- Multi-factor authentication recommended for production
- Session activity monitored in real-time

### Recommended Enhancements

1. **Hardware Security Key**: YubiKey or similar for 2FA
2. **IP Whitelisting**: Restrict access to known IP ranges
3. **Geofencing**: Alert on access from unexpected locations
4. **Biometric**: Add fingerprint/Face ID on mobile devices

## Support

For founder access issues:

- Email: ayman@teosegypt.com
- WhatsApp: +201006167293
- Emergency: Contact DevOps team directly

---

**Last Updated**: December 2025  
**Version**: 1.0  
**Classification**: CONFIDENTIAL - Founder Access Only
