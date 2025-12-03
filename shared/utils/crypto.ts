/**
 * Generate random string
 */
export function generateRandomString(length = 32): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""

  if (typeof window !== "undefined" && window.crypto) {
    const randomValues = new Uint8Array(length)
    window.crypto.getRandomValues(randomValues)

    for (let i = 0; i < length; i++) {
      result += chars[randomValues[i] % chars.length]
    }
  } else {
    // Fallback for non-browser environments
    for (let i = 0; i < length; i++) {
      result += chars[Math.floor(Math.random() * chars.length)]
    }
  }

  return result
}

/**
 * Hash string using SHA-256 (browser only)
 */
export async function hashString(input: string): Promise<string> {
  if (typeof window === "undefined" || !window.crypto?.subtle) {
    throw new Error("Web Crypto API not available")
  }

  const encoder = new TextEncoder()
  const data = encoder.encode(input)
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")

  return hashHex
}

/**
 * Generate HMAC signature
 */
export async function generateHMAC(message: string, secret: string): Promise<string> {
  if (typeof window === "undefined" || !window.crypto?.subtle) {
    throw new Error("Web Crypto API not available")
  }

  const encoder = new TextEncoder()
  const keyData = encoder.encode(secret)
  const messageData = encoder.encode(message)

  const key = await window.crypto.subtle.importKey("raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, ["sign"])

  const signature = await window.crypto.subtle.sign("HMAC", key, messageData)
  const signatureArray = Array.from(new Uint8Array(signature))
  const signatureHex = signatureArray.map((b) => b.toString(16).padStart(2, "0")).join("")

  return signatureHex
}
