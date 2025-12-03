# TEOS BankChain

**A Next-Generation Digital Banking Platform Built on Pi Network**

[![License](https://img.shields.io/badge/License-Proprietary-red.svg)](LICENSE.md)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-green.svg)](PRODUCTION_READY.md)
[![Version](https://img.shields.io/badge/Version-2.0.0-blue.svg)](docs/ROADMAP.md)

---

## Overview

TEOS BankChain delivers secure KYC, AML compliance, sanctions screening, ISO-20022 transactions, and Pi-powered identity verification for the MENA region. The platform includes real payment processing, card issuance, and compliant financial services designed for Egypt and the GCC.

### Key Features

- **Real Payment Processing**: Accept and process actual financial transactions
- **Card Issuance**: Create virtual and physical debit cards for verified users
- **KYC/AML Verification**: Comprehensive identity verification with document scanning
- **Pi Wallet Integration**: Link verified Pi Network wallets with KYC approval
- **Multi-Currency Support**: EGP, USD, SAR, AED, and Pi cryptocurrency
- **Real-Time Compliance**: Automated sanctions screening (OFAC/EU/UN)
- **Secure Authentication**: JWT + OIDC with MFA and biometric support
- **Mobile-First Design**: Optimized for smartphones and tablets
- **Arabic + English**: Full localization for MENA markets
- **Enterprise Observability**: ELK stack, Prometheus, Grafana, Sentry

---

## Quick Start

### Deploy to Vercel (Recommended)

See [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md) for complete instructions.

**Quick Steps:**
1. Download code from v0
2. Push to GitHub repository
3. Import to Vercel
4. Add environment variables
5. Deploy

Your production URL: `https://bankchain.teosegypt.com`

### Local Development

\`\`\`bash
# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your production values

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
\`\`\`

Visit `http://localhost:3000`

---

## Environment Variables

Required for production deployment:

\`\`\`env
NEXT_PUBLIC_APP_MODE=production
NEXT_PUBLIC_API_URL=https://api.teosegypt.com
DATABASE_URL=postgresql://user:password@host:5432/dbname
JWT_SECRET=your_secure_random_string_min_32_chars
STRIPE_SECRET_KEY=sk_live_...
KYC_API_KEY=your_kyc_provider_api_key
PI_API_KEY=your_pi_network_api_key
\`\`\`

Add these in the Vercel dashboard under "Environment Variables".

---

## Project Structure

\`\`\`
teos-bankchain/
├── app/                      # Next.js app directory
│   ├── dashboard/           # Admin dashboards
│   ├── founder-dashboard/   # Executive analytics
│   ├── client-dashboard/    # Customer banking
│   ├── wallets/             # Wallet management
│   ├── cards/               # Card issuance
│   ├── login/               # Authentication
│   └── ...
├── components/              # React components
├── lib/                     # Core services
│   ├── kyc-service.ts      # KYC verification
│   ├── card-service.ts     # Card issuance
│   ├── payment-service.ts  # Payment processing
│   └── pi-wallet-service.ts # Pi integration
├── backend/                 # FastAPI backend
├── docs/                    # Documentation
└── public/                  # Static assets
\`\`\`

---

## Dashboards

### Founder Dashboard
Executive-level analytics with:
- Real-time MENA-wide analytics
- Daily Active Pioneers & KYC completion
- SLA compliance (99.9% uptime)
- Support ticket queue & resolution
- Treasury balance & staking APY
- Sanctions/AML screening hits
- Revenue dashboard (fees + launchpad)

**Access**: `/founder-dashboard` (Bank Admins only)

### Client Dashboard
User-friendly banking with:
- Pi balance + $TEOS holdings
- Multi-currency wallets (EGP/USD/SAR/AED)
- Transaction history with ISO-20022 tags
- KYC verification status
- Virtual/physical card management
- Quick send/receive actions

**Access**: `/client-dashboard` (Verified users)

See [docs/DASHBOARDS.md](docs/DASHBOARDS.md) for details.

---

## Technology Stack

**Frontend**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS v4
- shadcn/ui components
- SWR for data fetching

**Backend**
- FastAPI (Python 3.9+)
- PostgreSQL with async SQLAlchemy
- Redis for caching
- WebSocket for real-time updates

**Mobile**
- Capacitor
- Native biometric APIs
- Offline-first architecture

**Security**
- HTTPS/TLS encryption
- JWT authentication
- HashiCorp Vault for secrets
- Rate limiting + WAF
- Automated security scans

**Observability**
- ELK Stack (Elasticsearch, Logstash, Kibana)
- Prometheus + Grafana
- Sentry error tracking
- Custom metrics and alerts

---

## Documentation

- [Production Ready Guide](./PRODUCTION_READY.md) - **Start here for production deployment**
- [Vercel Deployment](./VERCEL_DEPLOYMENT_GUIDE.md) - Step-by-step Vercel setup
- [API Documentation](./docs/API.md) - Complete API reference
- [Security & Compliance](./docs/SECURITY.md) - Security architecture
- [Support Guide](./docs/SUPPORT.md) - Ticket flow and SLA targets

---

## Contact & Support

**TEOS Egypt / Elmahrosa International**

- **Email**: ayman@teosegypt.com
- **Website**: https://bankchain.teosegypt.com
- **WhatsApp**: +201006167293

**Support Hours**: Sunday - Thursday, 9:00 AM - 6:00 PM EET

---

## License

TEOS BankChain is proprietary software owned by TEOS Egypt. See [LICENSE.md](LICENSE.md) for complete terms.

---

## Production Status

✅ **Production Ready**

- Real payment processing enabled
- KYC/AML verification active
- Card issuance operational
- Pi wallet integration live
- Full compliance monitoring
- Enterprise security enabled

---

**Built with ❤️ by TEOS Egypt for the future of digital banking in MENA**

*Powered by Pi Network | ISO-20022 Compliant | Enterprise-Grade Security*
