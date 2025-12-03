# TEOS BankChain Repository Structure

This document outlines the organization of the TEOS BankChain repository.

## 📁 Directory Structure

\`\`\`
Bankchain/
├── app/                      # Next.js App Router pages
│   ├── (auth)/              # Authentication pages
│   ├── dashboard/           # User dashboards
│   ├── founder-dashboard/   # Executive dashboard
│   ├── client-dashboard/    # Client banking dashboard
│   ├── wallets/             # Wallet management
│   ├── transactions/        # Transaction pages
│   ├── compliance/          # Compliance tools
│   └── settings/            # User settings
├── components/              # Reusable React components
│   ├── ui/                  # Base UI components (shadcn)
│   ├── charts/              # Chart components
│   ├── forms/               # Form components
│   └── layout/              # Layout components
├── lib/                     # Utility libraries
│   ├── api-client.ts       # API client
│   ├── auth.ts             # Authentication logic
│   ├── kyc-service.ts      # KYC integration
│   ├── card-service.ts     # Card issuance
│   ├── payment-service.ts  # Payment processing
│   └── pi-wallet-service.ts # Pi Network integration
├── contexts/                # React contexts
│   └── auth-context.tsx    # Auth state management
├── hooks/                   # Custom React hooks
├── styles/                  # Global styles
│   └── globals.css         # Tailwind + custom CSS
├── public/                  # Static assets
├── docs/                    # Documentation
│   ├── API_GUIDE.md        # API documentation
│   ├── SECURITY.md         # Security documentation
│   ├── COMPLIANCE.md       # Compliance guidelines
│   ├── RUNBOOK.md          # Operations runbook
│   ├── SUPPORT.md          # Support documentation
│   ├── DASHBOARDS.md       # Dashboard specifications
│   ├── ROADMAP.md          # Product roadmap
│   └── *.md                # Additional docs
├── .github/                 # GitHub configuration
│   ├── CONTRIBUTING.md     # Contribution guidelines
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── ISSUE_TEMPLATE.md
├── LICENSE.md              # Proprietary license
├── README.md               # Project overview
├── DEPLOYMENT_INSTRUCTIONS.md
├── PRODUCTION_READY.md
└── package.json            # Dependencies

## Backend (Separate Deployment)

The backend API is deployed separately and documented in `docs/API_GUIDE.md`.
Backend code should be in a separate repository for security.

## Mobile (Separate Build)

Mobile apps are built separately using Capacitor and documented in mobile-specific docs.

## Key Files

- `next.config.mjs` - Next.js configuration
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `.env.local.example` - Environment variables template
- `.gitignore` - Git ignore rules
- `vercel.json` - Vercel deployment config

## Documentation Priority

1. README.md - Start here
2. PRODUCTION_READY.md - Production checklist
3. docs/SECURITY.md - Security requirements
4. docs/COMPLIANCE.md - Compliance guidelines
5. docs/API_GUIDE.md - API integration
