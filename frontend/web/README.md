# TEOS Bankchain - Web Dashboard

Next.js web application for bank admins, compliance officers, and operations staff.

## Features

- Real-time compliance monitoring
- Transaction approval workflows
- Multi-currency wallet management
- FX rate tracking
- Audit log exports
- Role-based access control

## Setup

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Copy environment variables:
\`\`\`bash
cp .env.local.example .env.local
\`\`\`

3. Update API URL in `.env.local`

4. Run development server:
\`\`\`bash
npm run dev
\`\`\`

## Environment Variables

- `NEXT_PUBLIC_API_URL` - FastAPI backend URL
- `NEXT_PUBLIC_WS_URL` - WebSocket URL for real-time updates
- `NEXT_PUBLIC_ENV` - Environment (development/staging/production)
