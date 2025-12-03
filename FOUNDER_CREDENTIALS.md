# Founder Login Credentials

## Default Credentials (Development & Testing)

**Access URL**: `/founder-login`

**Username**: `aasm1969`

**Default Password**: `Teos@Egypt2024!`

**Wallet Address**: `GDIW2DXDR3DU4CYTRHDS3WYDGHMUQZG7E5FJWWW6XSADOC5VHMYRYD6F`

---

## Quick Login Steps

1. Visit: `https://bankchain.teosegypt.com/founder-login`
2. Enter username: `aasm1969`
3. Enter password: `Teos@Egypt2024!`
4. Access Founder Dashboard with full permissions

---

## For Production Deployment

### Change Default Password

The default password is hardcoded for testing. For production:

1. Generate a secure bcrypt hash:
\`\`\`bash
npm install bcrypt
node -e "console.log(require('bcrypt').hashSync('YOUR_NEW_PASSWORD', 10))"
\`\`\`

2. Add to Vercel environment variables:
\`\`\`
FOUNDER_USERNAME=aasm1969
FOUNDER_PASSWORD_HASH=$2b$10$YOUR_GENERATED_HASH
\`\`\`

### Security Recommendations

- Change default password immediately after first login
- Use minimum 16 characters with mixed case, numbers, symbols
- Enable MFA (to be implemented)
- Rotate password every 90 days
- Never share credentials via email/chat

---

## Troubleshooting

**Can't login?**
- Ensure you're using `/founder-login` not `/login`
- Check username is exactly `aasm1969` (no spaces)
- Password is case-sensitive: `Teos@Egypt2024!`

**Forgot password?**
- Contact: ayman@teosegypt.com
- WhatsApp: +201006167293

---

**Last Updated**: December 2025
**Classification**: CONFIDENTIAL
