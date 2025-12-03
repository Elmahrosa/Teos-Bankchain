# Pi Network Setup Guide for TEOS BankChain

## Step 1: Register as Pi Developer

1. Visit https://develop.pi
2. Create a developer account
3. Complete KYC verification
4. Accept the Developer Terms

## Step 2: Create Your App

1. Go to "My Apps" in the Pi Developer Portal
2. Click "New App"
3. Fill in app details:
   - **App Name**: TEOS BankChain
   - **App URL**: https://bankchain.teosegypt.com
   - **Description**: Next-generation digital banking layer connecting traditional banks with Pi Network
   - **Category**: Finance
   - **Platform**: Web

## Step 3: Configure App Settings

1. In your app dashboard, navigate to "Settings"
2. Add these URLs:
   - **App URL**: https://bankchain.teosegypt.com
   - **Redirect URIs**: https://bankchain.teosegypt.com/auth/callback
3. Request these permissions:
   - username (required)
   - payments (required)
   - wallet_address (optional)

## Step 4: Get Your API Keys

1. Go to "API Keys" section
2. Copy your **Pi API Key** (starts with "Key_...")
3. Save it securely - you'll need it for backend

## Step 5: Configure Vercel Environment Variables

Add these to your Vercel project:

\`\`\`bash
PI_API_KEY=your_pi_api_key_here
NEXT_PUBLIC_PI_API_KEY=your_pi_api_key_here
\`\`\`

## Step 6: Test in Pi Browser Sandbox

1. Open Pi app on your phone
2. Go to "Browse" tab
3. Enter: https://sandbox.minepi.com/mobile-app-ui/app/YOUR_APP_ID
4. Test the authentication flow
5. Verify wallet connection works

## Step 7: Submit for Review

Once testing is complete:

1. Go to "Submit for Review" in Pi Developer Portal
2. Provide:
   - App screenshots (homepage, login, dashboard)
   - Demo video (2-3 minutes showing key features)
   - Privacy policy URL: https://bankchain.teosegypt.com/privacy
   - Terms of service URL: https://bankchain.teosegypt.com/terms
3. Explain your app's utility for Pi ecosystem
4. Submit and wait for Core Team review (typically 2-4 weeks)

## Getting Approved Faster

1. **Complete Documentation**: Ensure all legal docs are complete
2. **Show Real Utility**: Demonstrate how it benefits Pi users
3. **Security First**: Document KYC/AML compliance measures
4. **Professional Design**: Polish UI/UX before submission
5. **Responsive Support**: Monitor developer portal for feedback
6. **Community Engagement**: Share updates in Pi forums

## Support Contacts

- **TEOS Support**: ayman@teosegypt.com
- **Pi Developers**: developers@minepi.com
- **WhatsApp**: +201006167293

## Resources

- Pi Developer Docs: https://developers.minepi.com
- Pi SDK Reference: https://github.com/pi-apps/pi-platform-docs
- TEOS Documentation: https://github.com/Elmahrosa/Bankchain
