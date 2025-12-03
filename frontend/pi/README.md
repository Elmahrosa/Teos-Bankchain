# TEOS Bankchain - Pi Browser App

Next.js application optimized for Pi Browser with Pi Network integration.

## Features

- Pi SDK authentication
- Pi payment creation and tracking
- Mobile-optimized interface
- Biometric login support
- Wallet management

## Setup

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Copy environment variables:
\`\`\`bash
cp .env.local.example .env.local
\`\`\`

3. Add your Pi App ID to `.env.local`

4. Run development server:
\`\`\`bash
npm run dev
\`\`\`

## Testing in Pi Browser

1. Build the app:
\`\`\`bash
npm run build
\`\`\`

2. Deploy to a publicly accessible URL

3. Open in Pi Browser mobile app

## Environment Variables

- `NEXT_PUBLIC_API_URL` - FastAPI backend URL
- `NEXT_PUBLIC_PI_APP_ID` - Your Pi Network App ID
- `NEXT_PUBLIC_ENV` - Environment (development/staging/production)
