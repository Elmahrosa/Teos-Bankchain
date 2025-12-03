# TEOS Bankchain - Shared Utilities

Shared TypeScript utilities used across backend, frontend, and mobile applications.

## Structure

- `/auth` - Authentication and RBAC utilities
- `/utils` - Common utility functions

## Usage

### Authentication & RBAC

\`\`\`typescript
import { RBACService, UserRole } from '@teos/bankchain-shared'

// Check permissions
const canEdit = RBACService.hasPermission('operations', 'transactions', 'update')

// Get approval tier
const tier = RBACService.getApprovalTier('bank_admin') // Returns 3

// Check admin access
const isAdmin = RBACService.canAccessAdminDashboard('compliance_officer') // Returns true
\`\`\`

### Validation

\`\`\`typescript
import { isValidEmail, isStrongPassword, isValidAmount } from '@teos/bankchain-shared'

// Validate email
if (!isValidEmail('user@example.com')) {
  console.error('Invalid email')
}

// Validate password
const { isValid, errors } = isStrongPassword('MyPassword123!')
if (!isValid) {
  console.error('Weak password:', errors)
}

// Validate amount
if (!isValidAmount('100.50')) {
  console.error('Invalid amount')
}
\`\`\`

### Formatting

\`\`\`typescript
import { formatCurrency, formatDateTime, maskString } from '@teos/bankchain-shared'

// Format currency
const formatted = formatCurrency(1234.56, 'EGP') // "EGP 1,234.56"

// Format date
const date = formatDateTime(new Date()) // "Jan 15, 2024, 10:30 AM"

// Mask sensitive data
const masked = maskString('1234567890', 4) // "******7890"
\`\`\`

### Cryptography

\`\`\`typescript
import { generateRandomString, hashString, generateHMAC } from '@teos/bankchain-shared'

// Generate random string
const random = generateRandomString(32)

// Hash string
const hash = await hashString('secret-data')

// Generate HMAC signature
const signature = await generateHMAC('message', 'secret-key')
\`\`\`

### Error Handling

\`\`\`typescript
import { AuthenticationError, ValidationError, handleError } from '@teos/bankchain-shared'

// Throw custom errors
throw new AuthenticationError('Invalid credentials')
throw new ValidationError('Invalid input', { field: 'email' })

// Handle unknown errors
try {
  // ... some operation
} catch (error) {
  const appError = handleError(error)
  console.error(appError.message, appError.code)
}
\`\`\`

## Role-Based Access Control (RBAC)

### User Roles

- **bank_admin**: Full system access
- **compliance_officer**: Compliance monitoring, audit logs, alerts
- **operations**: Transaction processing, settlement management
- **business**: Business account operations
- **individual**: Personal account access
- **agent**: Cash settlement agent operations

### Approval Tiers

- Tier 3: Bank Admin
- Tier 2: Compliance Officer
- Tier 1: Operations
- Tier 0: Business, Individual, Agent (no approval rights)

## Installation

Since this is a local package, use npm workspaces or link it:

\`\`\`bash
# In your frontend/backend project
npm install file:../shared
\`\`\`

Or use TypeScript path mapping in `tsconfig.json`:

\`\`\`json
{
  "compilerOptions": {
    "paths": {
      "@teos/bankchain-shared": ["../shared"]
    }
  }
}
\`\`\`
\`\`\`
