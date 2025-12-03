# TEOS Bankchain - Mobile Apps

Native Android and iOS apps built with Capacitor.

## Structure

- `/android` - Android app configuration and build
- `/ios` - iOS app configuration and build
- `/shared` - Shared utilities (biometric auth, secure storage)

## Features

- Native biometric authentication (Face ID, Touch ID, Fingerprint)
- Secure credential storage
- Offline capability
- Push notifications
- Camera access for document verification

## Setup

### Prerequisites

- Node.js 16+
- Android Studio (for Android)
- Xcode (for iOS, macOS only)
- Capacitor CLI

### Android Setup

1. Navigate to Android directory:
\`\`\`bash
cd mobile/android
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Build and sync:
\`\`\`bash
npm run sync
\`\`\`

4. Open in Android Studio:
\`\`\`bash
npm run open
\`\`\`

### iOS Setup

1. Navigate to iOS directory:
\`\`\`bash
cd mobile/ios
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Build and sync:
\`\`\`bash
npm run sync
\`\`\`

4. Open in Xcode:
\`\`\`bash
npm run open
\`\`\`

## Biometric Authentication

The app uses `@capgo/capacitor-native-biometric` for biometric authentication:

- **Android**: Fingerprint, Face unlock
- **iOS**: Face ID, Touch ID

### Usage Example

\`\`\`typescript
import { BiometricAuthService } from '../shared/biometric-auth'

// Check availability
const { isAvailable, biometryType } = await BiometricAuthService.checkAvailability()

// Authenticate
const success = await BiometricAuthService.authenticate('Login to TEOS Bankchain')

// Save credentials securely
await BiometricAuthService.saveCredentials({
  username: 'user@example.com',
  token: 'jwt-token'
})

// Retrieve credentials (requires biometric auth)
const credentials = await BiometricAuthService.getCredentials()
\`\`\`

## Secure Storage

The app uses `@capacitor-community/secure-storage` for secure data storage:

\`\`\`typescript
import { SecureStorage } from '../shared/secure-storage'

// Store data
await SecureStorage.set('api_token', token)

// Retrieve data
const token = await SecureStorage.get('api_token')

// Remove data
await SecureStorage.remove('api_token')
\`\`\`

## Build for Production

### Android

\`\`\`bash
cd mobile/android
npm run sync
npx cap open android
# In Android Studio: Build > Generate Signed Bundle / APK
\`\`\`

### iOS

\`\`\`bash
cd mobile/ios
npm run sync
npx cap open ios
# In Xcode: Product > Archive
\`\`\`
