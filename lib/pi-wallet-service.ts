export interface PiWalletConnection {
  userId: string
  piUserId: string
  piUsername: string
  walletAddress: string
  isVerified: boolean
  linkedAt: string
  kycStatus: "approved" | "pending" | "rejected"
  balance: number
}

export class PiWalletService {
  private static API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.teosegypt.com"
  private static PI_API_KEY = process.env.NEXT_PUBLIC_PI_API_KEY || ""

  static async connectPiWallet(userId: string): Promise<PiWalletConnection> {
    const kycProfile = await fetch(`${this.API_URL}/kyc/profile/${userId}`, {
      headers: { Authorization: `Bearer ${this.getAuthToken()}` },
    }).then((res) => res.json())

    if (kycProfile.status !== "approved") {
      throw new Error("KYC verification required before linking Pi wallet")
    }

    // Authenticate with Pi Network
    if (typeof window !== "undefined" && (window as any).Pi) {
      const piAuth = await (window as any).Pi.authenticate(
        ["username", "payments", "wallet_address"],
        (payment: any) => {
          console.log("Incomplete payment found:", payment)
        },
      )

      const response = await fetch(`${this.API_URL}/pi/link-wallet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify({
          userId,
          piAccessToken: piAuth.accessToken,
          piUser: piAuth.user,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to link Pi wallet")
      }

      return response.json()
    }

    throw new Error("Pi Browser not detected")
  }

  static async getPiWalletConnection(userId: string): Promise<PiWalletConnection | null> {
    const response = await fetch(`${this.API_URL}/pi/wallet/${userId}`, {
      headers: {
        Authorization: `Bearer ${this.getAuthToken()}`,
      },
    })

    if (response.status === 404) {
      return null
    }

    if (!response.ok) {
      throw new Error("Failed to fetch Pi wallet connection")
    }

    return response.json()
  }

  static async createPiPayment(
    userId: string,
    amount: number,
    memo: string,
  ): Promise<{ paymentId: string; status: string }> {
    const response = await fetch(`${this.API_URL}/pi/create-payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.getAuthToken()}`,
      },
      body: JSON.stringify({ userId, amount, memo }),
    })

    if (!response.ok) {
      throw new Error("Failed to create Pi payment")
    }

    return response.json()
  }

  private static getAuthToken(): string {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("teos_auth_token")
      if (token) {
        return JSON.parse(token).accessToken
      }
    }
    return ""
  }
}
