# Pi Browser Setup Guide for TEOS BankChain

## Why the App Won't Open in Pi Browser

Your app needs to be **registered and approved** by the Pi Core Team before it can be accessed in Pi Browser. Here's how to fix this:

---

## Step 1: Register Your App in Pi Developer Portal

1. **Go to Pi Developer Portal**: https://develop.pi
2. **Sign in** with your Pi account
3. **Click "Create New App"**
4. **Fill in the details**:
   - **App Name**: TEOS BankChain
   - **App URL**: https://bankchain.teosegypt.com
   - **Description**: Secure digital banking platform that connects traditional banks with Pi Network. KYC/AML compliant for MENA region.
   - **Category**: Finance
   - **Platform**: Web App
   - **Screenshots**: Upload at least 3 screenshots showing:
     - Login page with Pi Wallet button
     - Dashboard with balance/transactions
     - Settings/Profile page

5. **Submit for Review**

---

## Step 2: Configure Your API Keys

After your app is approved, you'll receive:
- **App ID**: A unique identifier for your app
- **API Key**: For authenticating with Pi Network

### Add to Vercel Environment Variables:

\`\`\`bash
NEXT_PUBLIC_PI_API_KEY=your_api_key_here
PI_API_KEY=your_api_key_here
NEXT_PUBLIC_APP_URL=https://bankchain.teosegypt.com
\`\`\`

### Update `public/manifest.json`:

Replace `YOUR_APP_ID_FROM_PI_DEVELOPER_PORTAL` and `YOUR_API_KEY_FROM_PI_DEVELOPER_PORTAL` with your actual values.

---

## Step 3: Test in Sandbox Mode

While waiting for approval, you can test in **Pi Sandbox**:

1. In Pi Developer Portal, enable **Sandbox Mode**
2. Update `app/layout.tsx`:
   \`\`\`tsx
   <meta name="pi:sandbox" content="true" />
   \`\`\`
3. Test using: `https://sandbox.minepi.com/mobile/app-test?url=https://bankchain.teosegypt.com`

---

## Step 4: Getting Approved Faster

To speed up Pi Core Team approval:

### Required Documentation:
✅ **Privacy Policy** (already created at `/privacy`)  
✅ **Terms of Service** (already created at `/terms`)  
✅ **Security Documentation** (in `docs/SECURITY.md`)  
✅ **KYC/AML Compliance** (in `docs/COMPLIANCE.md`)

### What Pi Core Team Looks For:
- ✅ Working app with no critical bugs
- ✅ Clear privacy policy and terms
- ✅ Secure authentication flow
- ✅ Real value for Pi users
- ✅ No fraudulent or illegal content
- ✅ Responsive design (mobile-first)

### Typical Approval Time:
- **Standard Review**: 2-4 weeks
- **Fast Track**: Contact developers@minepi.com with your use case

---

## Step 5: How Users Access Your App

### After Approval:

**Method 1 - Browse Tab:**
1. Open Pi app
2. Go to **Browse** tab
3. Enter: `bankchain.teosegypt.com`
4. Tap "Go"

**Method 2 - Direct Link:**
Users can click direct links like:
`pi://bankchain.teosegypt.com`

**Method 3 - App Discovery:**
Your app will appear in Pi Browser's app directory

---

## Troubleshooting

### "App not found" error
- ✅ Verify your app is approved in Pi Developer Portal
- ✅ Check that the URL matches exactly: `bankchain.teosegypt.com`
- ✅ Ensure HTTPS is working (required by Pi Browser)

### Pi SDK not loading
- ✅ Check browser console for errors
- ✅ Verify script tag: `https://sdk.minepi.com/pi-sdk.js`
- ✅ Test in regular browser first (SDK loads but won't authenticate)

### Authentication fails
- ✅ Verify API key in environment variables
- ✅ Check that app is not in sandbox mode in production
- ✅ Test with different Pi accounts

---

## Quick Checklist Before Submission

- [ ] App loads properly at `https://bankchain.teosegypt.com`
- [ ] Pi Wallet login button works (shows error outside Pi Browser)
- [ ] Privacy Policy accessible at `/privacy`
- [ ] Terms of Service accessible at `/terms`
- [ ] All images and assets load correctly
- [ ] Mobile-responsive (test on phone)
- [ ] No console errors in browser
- [ ] Contact information visible (ayman@teosegypt.com)

---

## Support

**TEOS Egypt Support:**
- Email: ayman@teosegypt.com
- Website: https://teosegypt.com
- WhatsApp: +201006167293

**Pi Network Support:**
- Developer Portal: https://develop.pi
- Email: developers@minepi.com
- Community: https://www.reddit.com/r/PiNetwork
