# TEOS Bankchain - API Reference

## Base URL

\`\`\`
Development: http://localhost:8000
Production: https://api.teos-bankchain.com
\`\`\`

## Authentication

All API requests require authentication via JWT Bearer token.

### Get Token

**POST** `/api/v1/auth/login`

Request:
\`\`\`json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "mfaCode": "123456" // Optional, if MFA enabled
}
\`\`\`

Response:
\`\`\`json
{
  "user": {
    "id": "usr_123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "operations"
  },
  "token": {
    "accessToken": "eyJhbGc...",
    "expiresAt": 1640000000,
    "tokenType": "Bearer"
  }
}
\`\`\`

### Use Token

Include in Authorization header:
\`\`\`
Authorization: Bearer eyJhbGc...
\`\`\`

## Ledger Endpoints

### Create Account

**POST** `/api/v1/ledger/accounts`

Request:
\`\`\`json
{
  "user_id": "usr_123",
  "account_type": "custodial",
  "currency": "USD"
}
\`\`\`

Response:
\`\`\`json
{
  "id": "acc_456",
  "user_id": "usr_123",
  "account_type": "custodial",
  "currency": "USD",
  "balance": 0.0,
  "status": "active",
  "created_at": "2024-01-15T10:30:00Z"
}
\`\`\`

### Get Account

**GET** `/api/v1/ledger/accounts/{account_id}`

### Get User Accounts

**GET** `/api/v1/ledger/accounts?user_id=usr_123`

### Create Transaction

**POST** `/api/v1/ledger/transactions`

Request:
\`\`\`json
{
  "account_id": "acc_456",
  "type": "deposit",
  "amount": 1000.50,
  "currency": "USD",
  "reference": "DEP-2024-001"
}
\`\`\`

Response:
\`\`\`json
{
  "id": "txn_789",
  "account_id": "acc_456",
  "type": "deposit",
  "status": "pending",
  "amount": 1000.50,
  "currency": "USD",
  "created_at": "2024-01-15T10:35:00Z"
}
\`\`\`

## Compliance Endpoints

### Create Audit Log

**POST** `/api/v1/compliance/audit-log`

Request:
\`\`\`json
{
  "action": "user.login",
  "resource": "auth",
  "details": "User logged in successfully"
}
\`\`\`

### Get Audit Logs

**GET** `/api/v1/compliance/audit-logs?limit=100&offset=0`

Response:
\`\`\`json
[
  {
    "id": "log_001",
    "user_id": "usr_123",
    "action": "user.login",
    "resource": "auth",
    "timestamp": "2024-01-15T10:30:00Z"
  }
]
\`\`\`

### Get Compliance Alerts

**GET** `/api/v1/compliance/alerts`

Response:
\`\`\`json
[
  {
    "id": "alert_001",
    "alert_type": "high_value_transaction",
    "severity": "high",
    "transaction_id": "txn_789",
    "description": "Transaction exceeds $10,000 threshold",
    "status": "open",
    "created_at": "2024-01-15T10:40:00Z"
  }
]
\`\`\`

### Resolve Alert

**POST** `/api/v1/compliance/alerts/{alert_id}/resolve`

## Payment Endpoints

### Get FX Rates

**GET** `/api/v1/payments/fx/rates?base=USD`

Response:
\`\`\`json
{
  "base": "USD",
  "rates": {
    "EGP": 30.90,
    "SAR": 3.75,
    "PI": 314.159,
    "EUR": 0.85
  }
}
\`\`\`

### Convert Currency

**POST** `/api/v1/payments/fx/convert`

Request:
\`\`\`json
{
  "amount": 100,
  "from_currency": "USD",
  "to_currency": "EGP"
}
\`\`\`

Response:
\`\`\`json
{
  "amount": 100,
  "from_currency": "USD",
  "to_currency": "EGP",
  "converted_amount": 3090.0
}
\`\`\`

### Create Pi Payment

**POST** `/api/v1/payments/pi/create`

Request:
\`\`\`json
{
  "amount": 10.5,
  "currency": "PI",
  "memo": "Payment for services",
  "metadata": {
    "order_id": "ORD-001"
  }
}
\`\`\`

Response:
\`\`\`json
{
  "identifier": "pi_pay_123",
  "status": "pending",
  "amount": 10.5,
  "created_at": "2024-01-15T10:45:00Z"
}
\`\`\`

### Get Pi Payment Status

**GET** `/api/v1/payments/pi/{payment_id}`

## WebSocket Endpoints

### Connect to Notifications

**WS** `/ws/notifications`

Connect with JWT token as query parameter:
\`\`\`
ws://localhost:8000/ws/notifications?token=eyJhbGc...
\`\`\`

Receive messages:
\`\`\`json
{
  "type": "compliance_alert",
  "data": {
    "alert_id": "alert_002",
    "severity": "high",
    "message": "New high-risk transaction detected"
  },
  "timestamp": "2024-01-15T10:50:00Z"
}
\`\`\`

## Error Responses

All errors follow this format:

\`\`\`json
{
  "detail": "Error message",
  "code": "ERROR_CODE",
  "status_code": 400
}
\`\`\`

### Common Error Codes

- `AUTH_ERROR` (401): Authentication failed
- `AUTHZ_ERROR` (403): Insufficient permissions
- `VALIDATION_ERROR` (400): Invalid request data
- `NOT_FOUND` (404): Resource not found
- `RATE_LIMIT` (429): Too many requests

## Rate Limiting

- **General**: 100 requests per minute per IP
- **Auth**: 10 requests per minute per IP
- **Sensitive**: 20 requests per minute per user

Headers included in response:
\`\`\`
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
\`\`\`

## Request Signing

For enhanced security, sign requests with HMAC:

1. Create signature base string:
   \`\`\`
   {HTTP_METHOD}|{PATH}|{TIMESTAMP}|{BODY_HASH}
   \`\`\`

2. Generate HMAC-SHA256:
   \`\`\`javascript
   const signature = HMAC_SHA256(baseString, API_SECRET)
   \`\`\`

3. Include in header:
   \`\`\`
   X-Signature: {signature}
   X-Timestamp: {timestamp}
   \`\`\`

---

*API Version: 1.0*  
*Last Updated: December 2024*
