# TEOS BankChain - Deployment Instructions

## Step 1: Download Code from v0

1. Click the **three dots** (⋯) in the top right of the v0 interface
2. Select **"Download ZIP"**
3. Extract the ZIP file to your local machine

## Step 2: Push to GitHub

\`\`\`bash
# Navigate to the extracted folder
cd teos-bankchain

# Initialize git (if not already initialized)
git init

# Add your GitHub repository as remote
git remote add origin https://github.com/Elmahrosa/Bankchain.git

# Add all files
git add .

# Commit
git commit -m "TEOS BankChain - Complete platform with dashboards, compliance, and Pi Network integration"

# Push to GitHub
git push -u origin main
\`\`\`

## Step 3: Deploy to Vercel

### Option A: Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repository: `Elmahrosa/Bankchain`
4. Vercel will auto-detect Next.js settings
5. Add environment variables:
   \`\`\`
   NEXT_PUBLIC_DEMO_MODE=true
   NEXT_PUBLIC_API_URL=https://api.teosegypt.com
   PI_API_KEY=mxrd49hnzbbadbevlwgimdktiaefip4l8q8io2dxyewk4h4zmv2yazgkbcnv9egn
   \`\`\`
6. Click **"Deploy"**

### Option B: Vercel CLI

\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Link to existing project? No
# - Project name: teos-bankchain
# - Directory: ./
# - Override settings? No

# Deploy to production
vercel --prod
\`\`\`

## Step 4: Configure Custom Domain

1. In Vercel Dashboard, go to your project
2. Click **Settings** → **Domains**
3. Add: `bankchain.teosegypt.com`
4. Follow DNS configuration instructions
5. Add CNAME record in your domain provider:
   \`\`\`
   CNAME bankchain cname.vercel-dns.com
   \`\`\`

## Step 5: Register with Pi Network (Required for Pi Wallet Login)

### Why Registration is Needed
Your app will show "Waiting for Pi SDK..." until it's approved by Pi Core Team. Registration at **[https://develop.pi](https://develop.pi)** is required for Pi Wallet authentication to work.

### Registration Steps

1. **Create Pi Developer Account**
   - Visit: [https://develop.pi](https://develop.pi)
   - Log in with your Pi account
   - Complete your developer profile

2. **Register TEOS BankChain**
   - Click "Create New App"
   - Fill in app details:
     - **Name:** TEOS BankChain
     - **URL:** `https://bankchain.teosegypt.com`
     - **Description:** Next-generation banking platform connecting traditional banks with Pi Network. Features KYC/AML compliance, card issuance, ISO-20022 transactions, and multi-currency support for MENA region.
     - **Category:** Banking & Finance

3. **Configure API**
   - Copy your API Key from develop.pi
   - Add to Vercel environment variables:
     \`\`\`
     NEXT_PUBLIC_PI_API_KEY=your_api_key_from_develop_pi
     \`\`\`
   - Redeploy on Vercel

4. **Submit for Review**
   - Upload screenshots of your app
   - Provide links to Terms and Privacy pages
   - Submit for Pi Core Team approval
   - **Review time:** 2-4 weeks

5. **After Approval**
   - Your app appears in Pi Browser directory
   - Pi SDK loads automatically
   - Users can authenticate with Pi Wallet

### Testing Before Approval
While waiting for approval, the app works fully but shows the development banner. All features are functional for testing.

## Step 6: Verify Deployment

Visit your deployment URL and test:
- ✅ Login page loads
- ✅ Demo authentication works (any email/password)
- ✅ Dashboards accessible (Founder, Client, Terms)
- ✅ Arabic/English toggle works
- ✅ AI Assistant loads
- ✅ Mobile responsive

## Environment Variables

### Required for Production
\`\`\`env
NEXT_PUBLIC_DEMO_MODE=false
NEXT_PUBLIC_API_URL=https://api.teosegypt.com
DATABASE_URL=your_production_database_url
PI_API_KEY=your_pi_network_api_key
JWT_SECRET=your_secure_jwt_secret
\`\`\`

### For Pi Network Integration
\`\`\`env
PI_API_KEY=mxrd49hnzbbadbevlwgimdktiaefip4l8q8io2dxyewk4h4zmv2yazgkbcnv9egn
NEXT_PUBLIC_PI_NETWORK_ENABLED=true
\`\`\`

## Troubleshooting

### Build Fails
- Check Vercel build logs
- Verify all TypeScript errors are resolved
- Ensure package.json has correct dependencies

### 404 Errors
- Check next.config.mjs routing
- Verify all pages are in correct directories

### Environment Variables Not Working
- Prefix with `NEXT_PUBLIC_` for client-side access
- Restart deployment after adding variables

## Support

For deployment issues, contact:
- Email: ayman@teosegypt.com
- WhatsApp: +201006167293
- Website: bankchain.teosegypt.com
