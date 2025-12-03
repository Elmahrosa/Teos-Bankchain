# DASHBOARDS.md — TEOS BankChain & Pump

**Target:** Live in Pi Browser + Android repo  
**Last Updated:** December 2025

---

## 1. Founder Dashboard (Admin View)

### Real-time MENA Analytics
- Real-time MENA-wide analytics (Egypt + GCC + Levant)
- Daily Active Pioneers & KYC completion rate
- SLA compliance monitor (99.9% uptime, <2s tx finality)
- Support ticket queue + resolution time, CSAT score
- $TEOS treasury balance & staking pool APY
- Sanctions/AML screening hits (auto-flag + manual review)
- One-click audit log export (CSV + JSON) — ISO-20022 compliant
- Revenue dashboard: fees from Pump launchpad + BankChain transfers
- Custom alerts engine (push/email/Telegram if balance < X SOL or screening hit)

### Key Features
- **Business Intelligence**: User metrics, transaction analytics, regional performance
- **Compliance Monitoring**: Real-time compliance scores, KYC/AML tracking
- **System Health**: Uptime monitoring, API latency, service status
- **Export Functionality**: CSV/JSON exports for audits and investor decks
- **Alert System**: Configurable thresholds for critical events

### Target Roles
- Bank Admin
- Compliance Officer
- Operations Manager

---

## 2. Client Dashboard (User View)

### Consumer-Friendly Interface
- Light / Dark mode + Arabic/English auto-switch
- Regional branding toggle (Egypt | KSA | UAE | Lebanon flags)
- Pi balance + $TEOS holdings + fiat conversion (EGP, SAR, AED)
- Transaction history with ISO-20022 reference tags
- In-app support ticket creation + status tracking
- KYC verification status + document upload
- Security settings: MFA toggle, biometric enable/disable
- Notification preferences (push/email for deposits, withdrawals, compliance alerts)
- Privacy controls: balance visibility toggle, transaction masking
- Quick actions: Send Pi, Request payment, Convert to fiat
- Referral program tracker with rewards dashboard

### Key Features
- **Account Management**: Balance display with privacy toggle, multi-currency support
- **Transaction History**: Recent activity with search and filter capabilities
- **Personalization**: Theme options, language preferences, regional branding
- **Security**: MFA, biometric auth, login history tracking
- **Support**: Direct ticket creation and tracking

### Target Roles
- Individual customers
- Business customers

---

## 3. Technical Requirements

### Role-Based Access Control (RBAC)
- **Founder Dashboard**: Only accessible to Bank Admin, Compliance Officer, Operations
- **Client Dashboard**: Accessible to Individual and Business customers
- **Data Visibility**: Founder sees all data; Clients see only personal accounts
- **Permission Validation**: Real-time permission checks on all operations

### Compliance & Audit
- All actions logged to append-only audit chain
- Export operations include metadata (timestamp, user, role)
- Dashboard views tracked for regulatory review
- Data access follows principle of least privilege
- GDPR/PDPL compliant data retention policies

### Localization
- **Languages**: English (default), Arabic with RTL support
- **Regional Settings**: Date/currency formatting per locale
- **Branding**: Country-specific themes (Egypt, KSA, UAE, Lebanon)
- **Auto-detection**: Browser language preference

### Mobile Optimization
- **Founder Dashboard**: Tablet-optimized (768px+), touch-friendly interface
- **Client Dashboard**: Mobile-first (320px+), bottom navigation, pull-to-refresh
- **Responsive Grid**: Adaptive layouts for all screen sizes
- **Performance**: < 2s load time, real-time updates

### Real-Time Features
- **WebSocket Updates**: Live balance updates, transaction notifications
- **Refresh Intervals**: Metrics refresh every 30 seconds
- **Push Notifications**: Firebase Cloud Messaging for alerts
- **Live Monitoring**: System health and compliance status

### Export Functionality
- **Formats**: CSV and JSON with cryptographic signatures
- **Access Control**: Role-based export permissions
- **Audit Trail**: All exports logged with user and timestamp
- **Data Compliance**: PII redaction based on role

---

## 4. Security & Compliance

### Authentication & Authorization
- HTTPS-only with signed API requests
- JWT tokens with role and permission claims
- Session timeout: 15min for Clients, 30min for Founders
- MFA required for sensitive operations
- Biometric authentication support (Face ID, Touch ID, Fingerprint)

### Data Protection
- TLS 1.3 encryption for all data transmission
- Encrypted data at rest (AES-256)
- Signed audit logs (SHA-256 HMAC)
- Secure key management (HashiCorp Vault)

### Compliance Standards
- ISO-20022 transaction formatting
- OFAC/EU sanctions screening
- KYC/AML monitoring and reporting
- GDPR/Egypt DPA compliance
- PCI DSS for payment data

### Audit & Monitoring
- Append-only audit logs with cryptographic chaining
- Real-time compliance alerts
- Rate limiting on sensitive endpoints
- Failed access attempt tracking
- Automated security scanning

---

## 5. Integration Points

### Pi Network SDK
- **Authentication**: Pi Browser user verification
- **Payment Verification**: Transaction validation on Pi blockchain
- **Wallet Connection**: Pi balance and transaction history
- **Payment Flows**: Pi → fiat and fiat → Pi conversions

### Sanctions API
- **OFAC Screening**: US sanctions list integration
- **EU Screening**: European Union sanctions compliance
- **Real-time Checks**: Transaction-level screening
- **Auto-flagging**: Automatic compliance alerts

### Support System
- **Ticket Routing**: Automatic assignment by category (Legal, Compliance, Tech)
- **Escalation Paths**: Priority-based escalation to specialists
- **SLA Tracking**: Response and resolution time monitoring
- **Integration**: Links to SUPPORT.md workflows

### Analytics Platform
- **Prometheus Metrics**: System performance monitoring
- **Grafana Dashboards**: Visual analytics and alerts
- **ELK Stack**: Centralized logging and search
- **Sentry**: Error tracking and debugging

### Notification System
- **Firebase Cloud Messaging**: Push notifications for mobile
- **Email**: SendGrid for transactional emails
- **SMS**: Twilio for critical security alerts
- **Telegram**: Optional bot for admin alerts

---

## 6. API Endpoints

### Founder Dashboard APIs
\`\`\`typescript
GET  /api/v1/analytics/metrics          // Business KPIs
GET  /api/v1/analytics/users            // User statistics
GET  /api/v1/analytics/regions          // Regional breakdown
GET  /api/v1/analytics/compliance       // Compliance scores
GET  /api/v1/system/health              // System status
GET  /api/v1/support/tickets            // Support queue
POST /api/v1/analytics/export           // Generate export
GET  /api/v1/treasury/balance           // $TEOS treasury
GET  /api/v1/sanctions/screenings       // Sanctions hits
\`\`\`

### Client Dashboard APIs
\`\`\`typescript
GET  /api/v1/accounts/:id/balance       // Account balance
GET  /api/v1/accounts/:id/transactions  // Transaction history
POST /api/v1/transactions/send          // Initiate transfer
GET  /api/v1/accounts/:id/status        // KYC verification
POST /api/v1/support/tickets            // Create ticket
GET  /api/v1/support/tickets/:id        // Ticket status
PUT  /api/v1/accounts/:id/settings      // Update preferences
GET  /api/v1/accounts/:id/referrals     // Referral rewards
\`\`\`

---

## 7. Dashboard Scaffolding Guide

### Project Structure
\`\`\`
app/
├── founder-dashboard/
│   ├── page.tsx                      # Main executive view
│   ├── analytics/page.tsx            # Detailed analytics
│   ├── compliance/page.tsx           # Compliance monitoring
│   ├── treasury/page.tsx             # Treasury dashboard
│   └── exports/page.tsx              # Export management
│
├── client-dashboard/
│   ├── page.tsx                      # Main user view
│   ├── transactions/page.tsx         # Transaction history
│   ├── profile/page.tsx              # Account settings
│   ├── security/page.tsx             # Security settings
│   └── support/page.tsx              # Support tickets
│
components/
├── founder/
│   ├── metrics-card.tsx              # KPI display
│   ├── chart-widget.tsx              # Data visualization
│   ├── export-button.tsx             # Export controls
│   └── alert-panel.tsx               # Alert management
│
└── client/
    ├── balance-card.tsx              # Balance display
    ├── transaction-item.tsx          # Transaction row
    ├── quick-action.tsx              # Action buttons
    └── ticket-form.tsx               # Support form
\`\`\`

### Setup Instructions
\`\`\`bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL, PI_API_KEY, etc.

# Run development server
npm run dev

# Access dashboards
# Founder: http://localhost:3000/founder-dashboard
# Client: http://localhost:3000/client-dashboard
\`\`\`

### Integration Checklist
- [ ] Pi Network SDK configured with API key
- [ ] Role-based routing implemented
- [ ] WebSocket connection for real-time updates
- [ ] Notification service configured (Firebase)
- [ ] Export service with signature generation
- [ ] Localization files loaded (en/ar)
- [ ] Theme system (light/dark mode)
- [ ] Compliance audit logging enabled
- [ ] Sanctions API integration tested
- [ ] Support ticket routing configured

---

## 8. Testing & QA

### Founder Dashboard Tests
- [ ] Role access control (only admins can access)
- [ ] Metrics display correctly with live data
- [ ] Export functions generate valid CSV/JSON
- [ ] Alerts trigger on threshold breaches
- [ ] Language toggle (EN ↔ AR) works
- [ ] Tablet responsive layout (768px+)
- [ ] Real-time updates via WebSocket
- [ ] Compliance scores calculate correctly
- [ ] Treasury balance updates live
- [ ] Support ticket queue displays

### Client Dashboard Tests
- [ ] Balance visibility toggle works
- [ ] Transaction list loads and paginates
- [ ] Quick actions navigate correctly
- [ ] Support ticket creation successful
- [ ] KYC document upload works
- [ ] MFA toggle enables/disables
- [ ] Theme switching (light/dark) works
- [ ] Language toggle (EN ↔ AR) works
- [ ] Mobile responsive (320px+)
- [ ] Referral tracker displays rewards

---

## 9. Performance Targets

### Load Times
- Founder Dashboard: < 2 seconds initial load
- Client Dashboard: < 1.5 seconds initial load
- Metric refresh: 30 seconds interval
- Export generation: < 10 seconds
- API response: < 500ms average

### Real-Time Updates
- Balance updates: Instant (WebSocket)
- Transaction notifications: < 1 second
- System alerts: < 2 seconds
- Compliance flags: Immediate

---

## 10. Support & Maintenance

**Technical Support**: ayman@teosegypt.com  
**Website**: bankchain.teosegypt.com  
**WhatsApp**: +201006167293  
**Documentation**: https://docs.bankchain.teosegypt.com

---

*Document maintained by TEOS Egypt Engineering Team*  
*Version: 2.0 - December 2025*
