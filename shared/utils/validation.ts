/**
 * Email validation
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Phone number validation (international format)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/
  return phoneRegex.test(phone.replace(/[\s-()]/g, ""))
}

/**
 * Password strength validation
 */
export function isStrongPassword(password: string): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters")
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter")
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter")
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number")
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Password must contain at least one special character")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Amount validation
 */
export function isValidAmount(amount: string | number): boolean {
  const num = typeof amount === "string" ? Number.parseFloat(amount) : amount
  return !isNaN(num) && num > 0 && isFinite(num)
}

/**
 * Wallet address validation (simplified)
 */
export function isValidWalletAddress(address: string, type: "pi" | "btc" | "eth"): boolean {
  const patterns = {
    pi: /^G[A-Z0-9]{55}$/,
    btc: /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/,
    eth: /^0x[a-fA-F0-9]{40}$/,
  }

  return patterns[type]?.test(address) ?? false
}
