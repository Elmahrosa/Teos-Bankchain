# TEOS BankChain - Vercel Deployment Guide

## Prerequisites
- GitHub account
- Vercel account (sign up at vercel.com)
- Node.js 18+ installed locally (for testing)

## Step 1: Download & Prepare Code

1. **Download the code from v0:**
   - Click the three dots menu in v0
   - Select "Download ZIP"
   - Extract to a local folder

2. **Test locally first:**
   \`\`\`bash
   cd teos-bankchain
   npm install
   npm run build
   npm run dev
   \`\`\`
   - Visit http://localhost:3000
   - If it works locally, proceed to deployment

## Step 2: Push to GitHub

1. **Create a new GitHub repository:**
   - Go to https://github.com/new
   - Repository name: `Bankchain` (or your preferred name)
   - Make it Public or Private
   - DO NOT initialize with README, .gitignore, or license
   - Click "Create repository"

2. **Push code to GitHub:**
   \`\`\`bash
   cd teos-bankchain
   git init
   git add .
   git commit -m "Initial commit: TEOS BankChain production ready"
   git branch -M main
   git remote add origin https://github.com/Elmahrosa/Bankchain.git
   git push -u origin main
   \`\`\`

## Step 3: Deploy to Vercel

1. **Import Project:**
   - Go to https://vercel.com/new
   - Click "Import Git Repository"
   - Select your GitHub account
   - Choose the `Bankchain` repository
   - Click "Import"

2. **Configure Project:**
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./` (leave as default)
   - Build Command: `npm run build` (auto-filled)
   - Output Directory: `.next` (auto-filled)
   - Install Command: `npm install` (auto-filled)

3. **Environment Variables:**
   Add these in the "Environment Variables" section:
   \`\`\`
   NEXT_PUBLIC_APP_MODE=production
   NEXT_PUBLIC_API_URL=https://your-api-domain.com
   DATABASE_URL=your_postgres_connection_string
   JWT_SECRET=your_secure_random_string_min_32_chars
   \`\`\`

4. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete
   - You'll get a URL like: `https://bankchain-xxx.vercel.app`

## Step 4: Configure Custom Domain (Optional)

1. **Add Domain:**
   - Go to Project Settings → Domains
   - Add `bankchain.teosegypt.com`
   - Follow DNS configuration instructions
   - Add CNAME record: `bankchain` → `cname.vercel-dns.com`

2. **SSL Certificate:**
   - Vercel automatically provisions SSL
   - Wait 5-10 minutes for propagation

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Verify all environment variables are set
- Test `npm run build` locally first

### 404 Error
- Ensure repository is not empty
- Check that `package.json` exists in root
- Verify Next.js app structure (app/ or pages/ directory exists)

### Import Errors
- Check that all dependencies are in `package.json`
- Remove any Capacitor or mobile-only dependencies
- Ensure TypeScript errors are resolved

## Production Checklist

- [ ] Local build successful (`npm run build`)
- [ ] Code pushed to GitHub
- [ ] Vercel project created and deployed
- [ ] Environment variables configured
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] Production URL accessible
- [ ] KYC integration API keys added
- [ ] Payment processor credentials configured
- [ ] Database connection working

## Support

If deployment fails:
1. Check Vercel build logs for specific errors
2. Review this guide step by step
3. Contact ayman@teosegypt.com with error details
4. Include build logs and error messages

---

**Your production URL will be ready at:**
`https://bankchain-xxx.vercel.app` or `https://bankchain.teosegypt.com`
