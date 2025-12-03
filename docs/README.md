# TEOS BankChain

**A next-generation digital banking layer built on the Pi Network**

[![License](https://img.shields.io/badge/license-Proprietary-red.svg)](LICENSE.md)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](ROADMAP.md)
[![Status](https://img.shields.io/badge/status-Production%20Ready-green.svg)]()

---

## 🚀 Overview

TEOS BankChain is a next-generation digital banking layer built on the Pi Network. It delivers **secure KYC, AML, sanctions screening, ISO-20022 transactions, and Pi-powered identity**. The platform includes a **mobile banking app, real-time IoT data integration**, and a **compliant financial engine** designed for Egypt and the MENA region.

TEOS BankChain enables **instant transfers, user verification, and encrypted sessions with MFA support**. This platform presents TEOS BankChain as a **trusted Pi-based digital bank ready for scale**.

### Key Capabilities

- ✅ **Secure & Compliant**: KYC/AML verification, sanctions screening (OFAC/EU/UN), ISO-20022 transactions
- ✅ **Instant Transactions**: Real-time Pi Network transfers, multi-currency support (EGP/USD/SAR/PI)
- ✅ **Pi-Powered Identity**: Pi Browser integration, biometric authentication, MFA support
- ✅ **Mobile Banking**: Native Android/iOS apps with offline mode and push notifications
- ✅ **Enterprise-Grade**: RBAC, multi-tier approvals, treasury dashboard, SLA monitoring
- ✅ **MENA Region Focus**: Arabic/English support, local payment methods, regional compliance

---

## 🏗️ Architecture

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                      TEOS Bankchain                         │
├─────────────────────────────────────────────────────────────┤
│  Frontend Layer                                             │
│  ├─ Next.js Web Dashboard (Bank Admin, Compliance, Ops)    │
│  ├─ Pi Browser App (Pi Network Integration)                │
│  └─ Mobile Apps (Android/iOS with Capacitor)               │
├─────────────────────────────────────────────────────────────┤
│  API Layer                                                  │
│  ├─ FastAPI Backend (REST + WebSocket)                     │
│  ├─ JWT Authentication (OIDC)                              │
│  └─ Request Signing (HMAC SHA-256)                         │
├─────────────────────────────────────────────────────────────┤
│  Business Logic Layer                                       │
│  ├─ Ledger Service (Accounts, Transactions)                │
│  ├─ Compliance Service (KYC/AML, Audit Logs)              │
│  ├─ Payment Service (Pi Network, FX Rates)                 │
│  └─ Settlement Service (Bank Rails, Agents)                │
├─────────────────────────────────────────────────────────────┤
│  Data Layer                                                 │
│  ├─ PostgreSQL (Ledger, Users, Compliance)                 │
│  ├─ Redis (Caching, Sessions)                              │
│  └─ Firebase (Push Notifications)                          │
└─────────────────────────────────────────────────────────────┘
\`\`\`

## 📁 Project Structure

\`\`\`
/backend           → FastAPI backend services
  /api             → REST & WebSocket endpoints
  /ledger          → Account & transaction services
  /compliance      → KYC/AML & audit services
  /payments        → Pi SDK & FX rate services
  /core            → Config, database, security

/frontend          → Next.js applications
  /web             → Admin dashboards
  /pi              → Pi Browser integration

/mobile            → Native mobile apps
  /android         → Android app (Capacitor)
  /ios             → iOS app (Capacitor)
  /shared          → Biometric auth, secure storage

/shared            → Shared TypeScript utilities
  /auth            → RBAC, permissions
  /utils           → Validation, formatting, crypto

/docs              → Documentation
  README.md        → This file
  ROADMAP.md       → Development milestones
  COMPLIANCE.md    → Compliance procedures
  DEPLOYMENT.md    → Deployment instructions
  API.md           → API reference
  SECURITY.md      → Security architecture and threat model
  RUNBOOK.md       → Operations runbook for incidents
  SUPPORT.md       → Support ticket flow and SLA targets
  CONTACT.md       → Official contact information
  AI_ASSISTANT.md  → AI assistant features and usage
\`\`\`

## ⚡ Quick Start

### Prerequisites

- Node.js 18+
- Python 3.11+
- PostgreSQL 14+
- Redis 7+ (optional)
- Android Studio / Xcode (for mobile)

### 1. Clone Repository

\`\`\`bash
git clone https://github.com/teos-egypt/bankchain.git
cd bankchain
\`\`\`

### 2. Backend Setup

\`\`\`bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your settings

# Run migrations
alembic upgrade head

# Start server
uvicorn main:app --reload
\`\`\`

Backend will run at `http://localhost:8000`

### 3. Frontend Setup

\`\`\`bash
cd frontend/web
npm install

# Configure environment
cp .env.local.example .env.local
# Edit .env.local with API URL

# Start development server
npm run dev
\`\`\`

Frontend will run at `http://localhost:3000`

### 4. Mobile Setup (Optional)

See [Mobile README](../mobile/README.md) for Android/iOS setup instructions.

## 👥 User Roles

1. **Bank Admin** - Full system access, user management
2. **Compliance Officer** - Compliance monitoring, audit logs, transaction review
3. **Operations** - Transaction processing, settlement management
4. **Business** - Business account operations
5. **Individual** - Personal banking operations
6. **Agent** - Cash settlement agent operations

## 🎯 Features by Role

| Feature | Bank Admin | Compliance | Operations | Business | Individual | Agent |
|---------|------------|------------|------------|----------|------------|-------|
| Dashboard | Full | Compliance | Operations | Basic | Basic | Agent |
| Create Wallets | ✓ | ✗ | ✓ | ✓ | ✓ | ✗ |
| View Transactions | ✓ | ✓ | ✓ | Own | Own | Related |
| Approve Transactions | Tier 3 | Tier 2 | Tier 1 | ✗ | ✗ | ✗ |
| Audit Logs | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| Compliance Alerts | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| Settlement Config | ✓ | ✗ | ✓ | ✗ | ✗ | ✗ |
| Agent Management | ✓ | ✗ | ✓ | ✗ | ✗ | ✗ |
| ISO-20022 Transactions | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ |
| Pi-Powered Identity | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ |
| Real-time IoT Integration | ✗ | ✗ | ✓ | ✗ | ✗ | ✗ |
| Mobile Banking | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ |
| AI Assistant | ✗ | ✗ | ✓ | ✗ | ✓ | ✗ |

## 🔐 Security Features

TEOS BankChain implements enterprise-grade security:

- **Authentication**: OIDC + JWT with refresh tokens, biometric (Face ID/Touch ID/Fingerprint)
- **MFA**: TOTP-based two-factor authentication for admins and compliance officers
- **Encryption**: TLS 1.3 for all communications, encrypted session storage
- **Request Signing**: HMAC SHA-256 for API request integrity
- **Rate Limiting**: IP-based rate limiting on all endpoints with WAF protection
- **Secrets Management**: HashiCorp Vault and Firebase Secret Manager support
- **Audit Logging**: All actions logged with append-only signed audit chains
- **RBAC**: Granular role-based access control with transaction limits
- **Session Security**: Automatic session timeout, secure cookie handling
- **HTTPS Enforcement**: Production environments require HTTPS

---

## 📋 Compliance

TEOS BankChain is designed to meet regulatory requirements in Egypt and MENA:

- **KYC/AML**: Automated identity verification, risk scoring, ongoing monitoring
- **Sanctions Screening**: Real-time checks against OFAC, EU, and UN sanctions lists
- **Transaction Monitoring**: AI-powered risk scoring, suspicious activity alerts
- **ISO-20022**: Compliant message formats for cross-border payments
- **Audit Trails**: Cryptographically signed, append-only audit logs (CSV/JSON export)
- **Regulatory Reporting**: Pre-configured reports for central banks and regulators
- **Data Residency**: Compliance with local data protection regulations

See [COMPLIANCE.md](./COMPLIANCE.md) for detailed procedures.

---

## 📱 Mobile Banking

Native mobile apps for Android and iOS powered by Capacitor:

- **Biometric Authentication**: Face ID, Touch ID, Fingerprint with PIN fallback
- **Offline Mode**: Encrypted local storage with automatic sync when online
- **Push Notifications**: Real-time alerts for transactions, compliance, and settlements
- **Secure Storage**: Hardware-backed keystore for sensitive data
- **Real-time IoT Integration**: Connect IoT devices for payment automation
- **Multi-language**: Arabic and English with RTL text support

See [Mobile README](../mobile/README.md) for setup instructions.

---

## 🌍 Regional Focus

Built specifically for Egypt and the MENA region:

- **Currencies**: EGP, USD, SAR, PI with real-time FX rates
- **Languages**: Arabic (RTL) and English with AI assistant support
- **Payment Methods**: Bank transfers, agent networks, mobile wallets
- **Compliance**: Egyptian Central Bank regulations, GCC standards
- **Support**: 24/7 Arabic/English support with local business hours

---

## 🛠️ Technology Stack

**Frontend**
- Next.js 14 with App Router
- React 18 with TypeScript
- Tailwind CSS v4 with deep-blue & gold design system
- shadcn/ui components

**Backend**
- FastAPI (Python 3.11+) with async SQLAlchemy
- PostgreSQL 14+ for transactional data
- Redis 7+ for caching and sessions
- WebSocket support for real-time updates

**Mobile**
- Capacitor 5+ for Android/iOS
- Native biometric APIs
- Encrypted storage with AES-256
- Firebase Cloud Messaging

**Observability**
- Prometheus + Grafana for metrics
- ELK Stack / Loki for centralized logging
- Sentry for error tracking
- Custom SLA monitoring dashboards

**Security**
- HashiCorp Vault for secrets
- Rate limiting + WAF (ModSecurity)
- Automated dependency scanning (Snyk, Trivy)
- Penetration testing pipeline

---

## 📞 Support

For technical support, partnerships, or enterprise inquiries:

- **Email**: ayman@teosegypt.com
- **Website**: bankchain.teosegypt.com
- **WhatsApp**: +201006167293
- **Support Hours**: Sun-Thu 9:00-18:00 EET (Egypt Time)
- **Emergency**: 24/7 for critical production issues

---

## 📄 Documentation

- [README.md](./README.md) - This file
- [ROADMAP.md](./ROADMAP.md) - Development milestones and future plans
- [COMPLIANCE.md](./COMPLIANCE.md) - Compliance procedures and audit exports
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment instructions for production
- [API_GUIDE.md](./API_GUIDE.md) - Complete API reference with examples
- [SECURITY.md](./SECURITY.md) - Security architecture and threat model
- [RUNBOOK.md](./RUNBOOK.md) - Operations runbook for incidents
- [SUPPORT.md](./SUPPORT.md) - Support ticket flow and SLA targets
- [CONTACT.md](./CONTACT.md) - Official contact information
- [AI_ASSISTANT.md](./AI_ASSISTANT.md) - AI assistant features and usage

---

## 📜 License

**Proprietary Software** - Copyright © 2025 TEOS Egypt / Elmahrosa. All rights reserved.

This software is licensed under a proprietary license with NDA requirements. See [LICENSE.md](../LICENSE.md) for full terms.

**No rebrand clauses apply**: TEOS Egypt / Elmahrosa branding must remain visible in all deployments.

---

## 🙏 Acknowledgments

Developed by **TEOS Egypt / Elmahrosa** for the future of digital banking in the MENA region.

Special thanks to the Pi Network community and our banking partners in Egypt and the GCC.

---

**Built with ❤️ for a trusted, Pi-based digital bank ready for scale**
