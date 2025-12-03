export interface Payment {
  id: string
  userId: string
  type: "deposit" | "withdrawal" | "transfer" | "card_payment"
  amount: number
  currency: string
  status: "pending" | "processing" | "completed" | "failed" | "cancelled"
  method: "bank_transfer" | "pi_network" | "card" | "agent"
  recipientId?: string
  cardId?: string
  transactionHash?: string
  createdAt: string
  completedAt?: string
  failureReason?: string
}

export class PaymentService {
  private static API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.teosegypt.com"

  static async createPayment(payment: Omit<Payment, "id" | "status" | "createdAt">): Promise<Payment> {
    const response = await fetch(`${this.API_URL}/payments/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.getAuthToken()}`,
      },
      body: JSON.stringify(payment),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Payment creation failed")
    }

    return response.json()
  }

  static async getPaymentHistory(userId: string, limit = 50): Promise<Payment[]> {
    const response = await fetch(`${this.API_URL}/payments/history/${userId}?limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${this.getAuthToken()}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch payment history")
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
