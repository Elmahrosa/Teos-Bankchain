# Vercel Deployment Guide for TEOS BankChain

## Prerequisites

1. GitHub repository connected to Vercel
2. Environment variables configured in Vercel dashboard
3. All TypeScript errors resolved

## Required Environment Variables

Add these in your Vercel project settings:

\`\`\`bash
# Demo Mode (set to false for production)
NEXT_PUBLIC_DEMO_MODE=true

# API Configuration
NEXT_PUBLIC_API_URL=https://api.bankchain.teosegypt.com
NEXT_PUBLIC_BACKEND_URL=https://backend.bankchain.teosegypt.com

# Pi Network (optional for demo)
NEXT_PUBLIC_PI_API_KEY=your_pi_api_key
PI_API_SECRET=your_pi_api_secret

# Other optional services
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
\`\`\`

## Deployment Steps

### 1. Fix TypeScript Issues

The following fixes have been applied:

- Added `@types/crypto-js` to devDependencies
- Created type declarations for Capacitor plugins in `mobile/shared/types.d.ts`
- Updated `offline-storage.ts` to use dynamic imports for SSR compatibility
- Excluded `backend` folder from TypeScript compilation
- Enabled proper TypeScript checking in `next.config.mjs`

### 2. Build Locally First

Always test the build locally before deploying:

\`\`\`bash
npm run build
\`\`\`

If the build succeeds locally, it should work on Vercel.

### 3. Deploy to Vercel

#### Option A: Automatic Deployment (Recommended)

1. Push changes to GitHub
2. Vercel automatically deploys

#### Option B: Manual Deployment

\`\`\`bash
npm install -g vercel
vercel --prod
\`\`\`

### 4. Monitor Build Logs

Check Vercel dashboard for:
- Build logs
- TypeScript errors
- Runtime errors

## Common Issues & Solutions

### Issue: "Module not found" errors

**Solution:** Ensure all imports use absolute paths with `@/` prefix or relative paths correctly.

### Issue: "CryptoJS is not defined"

**Solution:** Use dynamic imports for crypto-js to avoid SSR issues:

\`\`\`typescript
const CryptoJS = await import("crypto-js")
\`\`\`

### Issue: Capacitor plugins fail in browser

**Solution:** Wrap Capacitor calls with platform checks:

\`\`\`typescript
if (Capacitor.isNativePlatform()) {
  // Use native plugin
} else {
  // Fallback for web
}
\`\`\`

### Issue: Build timeout on Vercel

**Solution:**
1. Reduce bundle size by lazy loading components
2. Optimize images and assets
3. Use Vercel Pro for longer build times

## Post-Deployment Checklist

- [ ] Check all pages load correctly
- [ ] Verify environment variables are set
- [ ] Test authentication flow
- [ ] Confirm API connections work
- [ ] Check mobile responsiveness
- [ ] Test Arabic/English language toggle
- [ ] Verify demo mode banner appears
- [ ] Test AI assistant functionality

## Production Deployment

Before going to production:

1. Set `NEXT_PUBLIC_DEMO_MODE=false`
2. Update all placeholder content
3. Configure real database connections
4. Set up proper API authentication
5. Enable rate limiting and security features
6. Configure monitoring and error tracking
7. Set up SSL certificates
8. Configure CDN for static assets

## Support

For deployment issues, contact: ayman@teosegypt.com
