import { getAuthToken } from "./auth-token"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

class APIClient {
  private baseUrl: string

  constructor() {
    this.baseUrl = API_BASE_URL
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = getAuthToken()

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: "Request failed" }))
      throw new Error(error.detail || `HTTP ${response.status}`)
    }

    return response.json()
  }

  // Ledger endpoints
  async getAccounts() {
    return this.request("/api/v1/ledger/accounts")
  }

  async createAccount(data: any) {
    return this.request("/api/v1/ledger/accounts", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async createTransaction(data: any) {
    return this.request("/api/v1/ledger/transactions", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Compliance endpoints
  async getAuditLogs(limit = 100, offset = 0) {
    return this.request(`/api/v1/compliance/audit-logs?limit=${limit}&offset=${offset}`)
  }

  async getComplianceAlerts() {
    return this.request("/api/v1/compliance/alerts")
  }

  async resolveAlert(alertId: string) {
    return this.request(`/api/v1/compliance/alerts/${alertId}/resolve`, {
      method: "POST",
    })
  }

  // Payment endpoints
  async getFXRates(base = "USD") {
    return this.request(`/api/v1/payments/fx/rates?base=${base}`)
  }

  async convertCurrency(amount: number, from: string, to: string) {
    return this.request("/api/v1/payments/fx/convert", {
      method: "POST",
      body: JSON.stringify({
        amount,
        from_currency: from,
        to_currency: to,
      }),
    })
  }

  async createPiPayment(data: any) {
    return this.request("/api/v1/payments/pi/create", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }
}

export const apiClient = new APIClient()
