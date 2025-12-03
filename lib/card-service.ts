export interface Card {
  id: string
  userId: string
  type: "virtual" | "physical"
  status: "active" | "blocked" | "expired" | "pending"
  cardNumber: string // Masked for security
  cardholderName: string
  expiryDate: string
  cvv?: string // Only shown once for virtual cards
  currency: "EGP" | "USD" | "SAR" | "AED"
  balance: number
  dailyLimit: number
  monthlyLimit: number
  createdAt: string
  activatedAt?: string
  shippingAddress?: {
    street: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  shippingStatus?: "pending" | "shipped" | "delivered"
  trackingNumber?: string
}

export class CardService {
  private static API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.teosegypt.com"

  static async getUserCards(userId: string): Promise<Card[]> {
    const response = await fetch(`${this.API_URL}/cards/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${this.getAuthToken()}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch cards")
    }

    return response.json()
  }

  static async createVirtualCard(
    userId: string,
    data: {
      currency: Card["currency"]
      dailyLimit: number
      monthlyLimit: number
    },
  ): Promise<Card> {
    const kycProfile = await fetch(`${this.API_URL}/kyc/profile/${userId}`, {
      headers: { Authorization: `Bearer ${this.getAuthToken()}` },
    }).then((res) => res.json())

    if (kycProfile.status !== "approved") {
      throw new Error("KYC verification required before card issuance")
    }

    const response = await fetch(`${this.API_URL}/cards/create-virtual`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.getAuthToken()}`,
      },
      body: JSON.stringify({ userId, ...data }),
    })

    if (!response.ok) {
      throw new Error("Failed to create virtual card")
    }

    return response.json()
  }

  static async createPhysicalCard(
    userId: string,
    data: {
      currency: Card["currency"]
      dailyLimit: number
      monthlyLimit: number
      shippingAddress: Card["shippingAddress"]
    },
  ): Promise<Card> {
    const kycProfile = await fetch(`${this.API_URL}/kyc/profile/${userId}`, {
      headers: { Authorization: `Bearer ${this.getAuthToken()}` },
    }).then((res) => res.json())

    if (kycProfile.status !== "approved") {
      throw new Error("KYC verification required before card issuance")
    }

    const response = await fetch(`${this.API_URL}/cards/create-physical`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.getAuthToken()}`,
      },
      body: JSON.stringify({ userId, ...data }),
    })

    if (!response.ok) {
      throw new Error("Failed to create physical card")
    }

    return response.json()
  }

  static async blockCard(cardId: string): Promise<void> {
    const response = await fetch(`${this.API_URL}/cards/${cardId}/block`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.getAuthToken()}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to block card")
    }
  }

  static async unblockCard(cardId: string): Promise<void> {
    const response = await fetch(`${this.API_URL}/cards/${cardId}/unblock`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.getAuthToken()}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to unblock card")
    }
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
