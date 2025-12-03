# TEOS Bankchain API Guide

## Overview

Complete API reference for integrating with TEOS Bankchain platform.

**Base URL**: `https://api.teos-bankchain.com`  
**API Version**: v1  
**Protocol**: HTTPS only  
**Authentication**: Bearer JWT tokens

---

## Authentication

### Obtain Access Token

\`\`\`http
POST /v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secure_password"
}
\`\`\`

**Response**:
\`\`\`json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 3600,
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "role": "individual"
  }
}
\`\`\`

### Using Access Tokens

Include the access token in the Authorization header:

\`\`\`http
GET /v1/wallets
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
\`\`\`

### Refresh Tokens

\`\`\`http
POST /v1/auth/refresh
Content-Type: application/json

{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
\`\`\`

---

## Wallets API

### List Wallets

\`\`\`http
GET /v1/wallets
Authorization: Bearer {token}
\`\`\`

**Response**:
\`\`\`json
{
  "wallets": [
    {
      "id": "wallet_abc123",
      "user_id": "user_123",
      "type": "custodial",
      "currency": "EGP",
      "balance": 15000.50,
      "status": "active",
      "created_at": "2024-01-10T10:30:00Z"
    }
  ]
}
\`\`\`

### Create Wallet

\`\`\`http
POST /v1/wallets
Authorization: Bearer {token}
Content-Type: application/json

{
  "type": "custodial",
  "currency": "USD"
}
\`\`\`

**Response**:
\`\`\`json
{
  "id": "wallet_xyz789",
  "type": "custodial",
  "currency": "USD",
  "balance": 0,
  "status": "active",
  "created_at": "2024-01-15T14:20:00Z"
}
\`\`\`

---

## Transactions API

### Create Transaction

\`\`\`http
POST /v1/transactions
Authorization: Bearer {token}
Content-Type: application/json

{
  "from_wallet_id": "wallet_abc123",
  "to_wallet_id": "wallet_xyz789",
  "amount": 100.00,
  "currency": "USD",
  "type": "transfer",
  "description": "Payment for services"
}
\`\`\`

**Response**:
\`\`\`json
{
  "id": "tx_def456",
  "from_wallet_id": "wallet_abc123",
  "to_wallet_id": "wallet_xyz789",
  "amount": 100.00,
  "currency": "USD",
  "status": "pending_approval",
  "approval_tier": 1,
  "created_at": "2024-01-15T14:25:00Z"
}
\`\`\`

### Get Transaction Status

\`\`\`http
GET /v1/transactions/{transaction_id}
Authorization: Bearer {token}
\`\`\`

**Response**:
\`\`\`json
{
  "id": "tx_def456",
  "status": "completed",
  "approvals": [
    {
      "tier": 1,
      "approved_by": "user_admin_1",
      "approved_at": "2024-01-15T14:30:00Z"
    }
  ],
  "completed_at": "2024-01-15T14:30:05Z"
}
\`\`\`

---

## Compliance API

### Sanctions Screening

\`\`\`http
POST /v1/compliance/sanctions/screen
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "John Doe",
  "country": "EG",
  "entity_type": "individual"
}
\`\`\`

**Response**:
\`\`\`json
{
  "entity_name": "John Doe",
  "entity_type": "individual",
  "country": "EG",
  "risk_level": "clear",
  "matches": [],
  "checked_at": "2024-01-15T14:35:00Z",
  "lists_checked": ["OFAC", "EU", "UN"]
}
\`\`\`

### Export Audit Logs

\`\`\`http
POST /v1/compliance/audit-logs/export
Authorization: Bearer {token}
Content-Type: application/json

{
  "start_date": "2024-01-01T00:00:00Z",
  "end_date": "2024-01-15T23:59:59Z",
  "format": "json"
}
\`\`\`

**Response**:
\`\`\`json
{
  "data": "[{...audit logs...}]",
  "format": "json",
  "record_count": 1523,
  "generated_at": "2024-01-15T14:40:00Z"
}
\`\`\`

---

## FX Rates API

### Get Current Rates

\`\`\`http
GET /v1/fx/rates
Authorization: Bearer {token}
\`\`\`

**Response**:
\`\`\`json
{
  "rates": [
    {
      "from": "USD",
      "to": "EGP",
      "rate": 30.85,
      "provider": "Central Bank",
      "updated_at": "2024-01-15T14:00:00Z"
    },
    {
      "from": "PI",
      "to": "EGP",
      "rate": 950.00,
      "provider": "Pi Network",
      "updated_at": "2024-01-15T14:00:00Z"
    }
  ]
}
\`\`\`

### Convert Currency

\`\`\`http
POST /v1/fx/convert
Authorization: Bearer {token}
Content-Type: application/json

{
  "from": "USD",
  "to": "EGP",
  "amount": 1000
}
\`\`\`

**Response**:
\`\`\`json
{
  "from": "USD",
  "to": "EGP",
  "amount": 1000,
  "rate": 30.85,
  "converted": 30850,
  "provider": "Central Bank"
}
\`\`\`

---

## Webhooks

### Register Webhook

\`\`\`http
POST /v1/webhooks
Authorization: Bearer {token}
Content-Type: application/json

{
  "url": "https://your-app.com/webhooks/teos",
  "events": ["transaction.completed", "compliance.alert", "settlement.completed"],
  "secret": "your_webhook_secret"
}
\`\`\`

### Webhook Payload Example

\`\`\`json
{
  "event": "transaction.completed",
  "timestamp": "2024-01-15T14:45:00Z",
  "data": {
    "transaction_id": "tx_def456",
    "amount": 100.00,
    "currency": "USD",
    "status": "completed"
  },
  "signature": "sha256=abc123..."
}
\`\`\`

### Verify Webhook Signature

\`\`\`python
import hmac
import hashlib

def verify_webhook(payload, signature, secret):
    expected = hmac.new(
        secret.encode(),
        payload.encode(),
        hashlib.sha256
    ).hexdigest()
    
    return hmac.compare_digest(f"sha256={expected}", signature)
\`\`\`

---

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Invalid or missing token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |
| 503 | Service Unavailable |

**Error Response Format**:
\`\`\`json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Amount must be greater than 0",
    "details": {
      "field": "amount",
      "value": -100
    }
  }
}
\`\`\`

---

## Rate Limits

| Endpoint | Limit |
|----------|-------|
| /v1/auth/* | 10 requests/minute |
| /v1/transactions | 100 requests/minute |
| /v1/wallets | 100 requests/minute |
| /v1/compliance/* | 50 requests/minute |
| Default | 1000 requests/minute |

Rate limit headers:
\`\`\`http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1705329600
\`\`\`

---

## SDKs & Examples

### Python SDK

\`\`\`python
from teos_bankchain import Client

client = Client(api_key="your_api_key")

# Create wallet
wallet = client.wallets.create(type="custodial", currency="USD")

# Create transaction
tx = client.transactions.create(
    from_wallet_id=wallet.id,
    to_wallet_id="wallet_xyz789",
    amount=100.00,
    currency="USD"
)

# Screen for sanctions
result = client.compliance.screen_sanctions(
    name="John Doe",
    country="EG"
)
\`\`\`

### JavaScript SDK

\`\`\`javascript
import { TeosClient } from '@teos-bankchain/sdk';

const client = new TeosClient({ apiKey: 'your_api_key' });

// Create wallet
const wallet = await client.wallets.create({
  type: 'custodial',
  currency: 'USD'
});

// Create transaction
const tx = await client.transactions.create({
  fromWalletId: wallet.id,
  toWalletId: 'wallet_xyz789',
  amount: 100.00,
  currency: 'USD'
});
\`\`\`

---

**Document Version**: 1.0  
**Last Updated**: 2024-01-15  
**Support**: ayman@teosegypt.com  
**Website**: bankchain.teosegypt.com
