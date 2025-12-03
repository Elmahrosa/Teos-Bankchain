# Pi Network Integration Setup Guide

## Overview
TEOS BankChain integrates with Pi Network to enable Pi cryptocurrency payments, wallet connections, and decentralized identity verification.

---

## 1. Create Pi Developer Account

### Step 1: Register at Pi Developer Portal
1. Go to [https://develop.pi](https://develop.pi)
2. Sign in with your Pi account
3. Complete developer verification

### Step 2: Create New App
1. Click **"Create New App"**
2. Fill in app details:
   - **App Name**: TEOS BankChain
   - **Description**: Next-generation digital banking layer built on Pi Network
   - **Category**: Finance
   - **Website**: https://bankchain.teosegypt.com

### Step 3: Configure App Settings
1. **App Type**: Select "Web App"
2. **Development URL**: `http://localhost:3000` (for testing)
3. **Production URL**: `https://bankchain.teosegypt.com`
4. **Redirect URLs**: Add both development and production URLs

---

## 2. Get API Credentials

### API Key
1. In your app dashboard, go to **"Keys"** section
2. Copy your **API Key** (starts with `Key_...`)
3. Add to your `.env.local`:
   \`\`\`env
   NEXT_PUBLIC_PI_API_KEY=your_api_key_here
   \`\`\`

### Wallet Secret
1. Generate a wallet secret for server-side payments
2. **IMPORTANT**: Never expose this in frontend code
3. Add to your `.env.local`:
   \`\`\`env
   PI_WALLET_SECRET=your_wallet_secret_here
   \`\`\`

---

## 3. Configure Environment Variables

Create/update your `.env.local` file:

\`\`\`env
# Pi Network Configuration
NEXT_PUBLIC_PI_API_KEY=Key_xxxxxxxxxxxxxxxxxx
PI_WALLET_SECRET=xxxxxxxxxxxxxxxxxxxxxx

# Pi API URLs
NEXT_PUBLIC_PI_API_URL=https://api.minepi.com
NEXT_PUBLIC_PI_TESTNET=false  # Set to true for sandbox testing

# Your App URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_PRODUCTION_URL=https://bankchain.teosegypt.com
\`\`\`

---

## 4. Test in Pi Browser

### Desktop Testing
1. Download Pi Browser from [https://pi-apps.pi-network.com](https://pi-apps.pi-network.com)
2. Open your app URL in Pi Browser
3. Test authentication and payments

### Mobile Testing
1. Open Pi app on your phone
2. Navigate to "Pi Apps" section
3. Enter your development URL
4. Test all features

---

## 5. Payment Flow Configuration

### Server-Side Endpoints
Create these endpoints in your backend:

\`\`\`typescript
// /api/pi/approve-payment
POST /api/pi/approve-payment
Body: { paymentId: string }
Response: { success: boolean }

// /api/pi/complete-payment
POST /api/pi/complete-payment
Body: { paymentId: string, txid: string }
Response: { success: boolean }

// /api/pi/get-payment
GET /api/pi/get-payment/:paymentId
Response: { payment: PiPayment }
\`\`\`

### Webhook Configuration
1. In Pi Developer Portal, go to **"Webhooks"**
2. Add webhook URL: `https://bankchain.teosegypt.com/api/pi/webhook`
3. Select events to monitor:
   - `payment.completed`
   - `payment.cancelled`
   - `user.kyc_verified`

---

## 6. KYC Integration

### Enable KYC Verification
1. In app settings, enable **"KYC Required"**
2. Configure KYC levels:
   - Level 1: Basic verification (email, phone)
   - Level 2: Identity documents
   - Level 3: Enhanced due diligence

### KYC Callback
\`\`\`typescript
// Check user KYC status
const user = await PiNetworkService.authenticate()
const kycStatus = user.kycStatus // 'none' | 'pending' | 'verified'
\`\`\`

---

## 7. Testing Checklist

- [ ] Pi authentication works in Pi Browser
- [ ] Can create test payment
- [ ] Payment approval flow works
- [ ] Payment completion flow works
- [ ] Webhook receives events
- [ ] KYC status displays correctly
- [ ] Error handling works properly

---

## 8. Production Deployment

### Before Going Live
1. ✅ Complete Pi app review process
2. ✅ Verify all API endpoints are HTTPS
3. ✅ Test payment flow end-to-end
4. ✅ Configure rate limiting
5. ✅ Set up monitoring and alerts
6. ✅ Review security best practices

### Mainnet Activation
1. Switch `NEXT_PUBLIC_PI_TESTNET=false`
2. Update production URLs in Pi Developer Portal
3. Submit app for mainnet approval
4. Monitor first transactions carefully

---

## 9. API Reference

### Authentication
\`\`\`typescript
const user = await PiNetworkService.authenticate()
// Returns: { uid, username, accessToken }
\`\`\`

### Create Payment
\`\`\`typescript
const payment = await PiNetworkService.createPayment(
  10.5,  // amount in Pi
  "TEOS BankChain Transfer",  // memo
  { orderId: "12345", userId: "user_123" }  // metadata
)
\`\`\`

### Get Payment Status
\`\`\`typescript
const payment = await PiNetworkService.getPayment(paymentId)
// Returns: { identifier, amount, status, transaction }
\`\`\`

---

## 10. Support & Resources

- **Pi Developer Portal**: https://develop.pi
- **Pi Developer Docs**: https://developers.pi
- **TEOS Support**: ayman@teosegypt.com
- **Pi Developer Community**: https://discord.gg/pi

---

## Security Notes

1. **Never expose** your `PI_WALLET_SECRET` in frontend code
2. **Always validate** payments on your backend
3. **Implement** rate limiting on payment endpoints
4. **Monitor** for suspicious payment patterns
5. **Log** all payment transactions for audit

---

**Last Updated**: December 2025 (v1.0)
**TEOS Egypt / Elmahrosa** - Powering Pi-Based Banking
