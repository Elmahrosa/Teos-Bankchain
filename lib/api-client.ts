// Secure API client for FastAPI backend integration
export interface APIConfig {
  baseURL: string
  apiKey?: string
  timeout?: number
}

export interface APIError {
  status: number
  message: string
  code?: string
  details?: any
}

export class APIClient {
  private config: APIConfig
  private static instance: APIClient | null = null

  constructor(config: APIConfig) {
    this.config = {
      baseURL: config.baseURL || process.env.NEXT_PUBLIC_API_URL || "https://api.teosbank.eg",
      apiKey: config.apiKey || process.env.NEXT_PUBLIC_API_KEY,
      timeout: config.timeout || 30000,
    }
  }

  // Singleton pattern
  static getInstance(config?: APIConfig): APIClient {
    if (!this.instance) {
      this.instance = new APIClient(config || { baseURL: "" })
    }
    return this.instance
  }

  // Generate request signature for security
  private async signRequest(method: string, path: string, body?: any, timestamp?: number): Promise<string> {
    const ts = timestamp || Date.now()
    const payload = `${method}:${path}:${ts}:${body ? JSON.stringify(body) : ""}`

    // In production, use proper HMAC signing with secret key
    const encoder = new TextEncoder()
    const data = encoder.encode(payload + (this.config.apiKey || ""))
    const hashBuffer = await crypto.subtle.digest("SHA-256", data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")

    return hashHex
  }

  // Make secure API request with HTTPS enforcement
  private async request<T>(
    method: string,
    path: string,
    options?: {
      body?: any
      headers?: Record<string, string>
      signal?: AbortSignal
    },
  ): Promise<T> {
    const url = `${this.config.baseURL}${path}`

    // Enforce HTTPS in production
    if (process.env.NODE_ENV === "production" && !url.startsWith("https://")) {
      throw new Error("HTTPS is required for API calls in production")
    }

    const timestamp = Date.now()
    const signature = await this.signRequest(method, path, options?.body, timestamp)

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "X-API-Key": this.config.apiKey || "",
      "X-Request-Timestamp": timestamp.toString(),
      "X-Request-Signature": signature,
      ...options?.headers,
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout)

    try {
      console.log(`[v0] API Request: ${method} ${url}`)

      const response = await fetch(url, {
        method,
        headers,
        body: options?.body ? JSON.stringify(options.body) : undefined,
        signal: options?.signal || controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const error: APIError = {
          status: response.status,
          message: response.statusText,
        }

        try {
          const errorData = await response.json()
          error.message = errorData.message || error.message
          error.code = errorData.code
          error.details = errorData.details
        } catch (e) {
          // Response not JSON
        }

        console.error("[v0] API Error:", error)

        // Track failed API calls for monitoring
        await this.trackFailedRequest(method, path, error)

        throw error
      }

      const data = await response.json()
      console.log("[v0] API Success:", method, path)
      return data as T
    } catch (error: any) {
      clearTimeout(timeoutId)

      if (error.name === "AbortError") {
        const timeoutError: APIError = {
          status: 408,
          message: "Request timeout",
          code: "TIMEOUT",
        }
        await this.trackFailedRequest(method, path, timeoutError)
        throw timeoutError
      }

      // Network error or other fetch failure
      const networkError: APIError = {
        status: 0,
        message: error.message || "Network error",
        code: "NETWORK_ERROR",
      }
      await this.trackFailedRequest(method, path, networkError)
      throw networkError
    }
  }

  // Track failed requests for monitoring
  private async trackFailedRequest(method: string, path: string, error: APIError): Promise<void> {
    try {
      // Send to monitoring service or local storage
      const failedRequest = {
        method,
        path,
        error,
        timestamp: new Date().toISOString(),
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
      }

      // Store in localStorage for debugging (in production, send to monitoring service)
      if (typeof window !== "undefined") {
        const failures = JSON.parse(localStorage.getItem("api_failures") || "[]")
        failures.push(failedRequest)
        // Keep only last 50 failures
        localStorage.setItem("api_failures", JSON.stringify(failures.slice(-50)))
      }

      console.error("[v0] Tracked failed request:", failedRequest)
    } catch (e) {
      // Fail silently to not disrupt main flow
      console.error("[v0] Failed to track API error:", e)
    }
  }

  // HTTP methods
  async get<T>(path: string, options?: { headers?: Record<string, string>; signal?: AbortSignal }): Promise<T> {
    return this.request<T>("GET", path, options)
  }

  async post<T>(
    path: string,
    body: any,
    options?: { headers?: Record<string, string>; signal?: AbortSignal },
  ): Promise<T> {
    return this.request<T>("POST", path, { ...options, body })
  }

  async put<T>(
    path: string,
    body: any,
    options?: { headers?: Record<string, string>; signal?: AbortSignal },
  ): Promise<T> {
    return this.request<T>("PUT", path, { ...options, body })
  }

  async delete<T>(path: string, options?: { headers?: Record<string, string>; signal?: AbortSignal }): Promise<T> {
    return this.request<T>("DELETE", path, options)
  }

  async patch<T>(
    path: string,
    body: any,
    options?: { headers?: Record<string, string>; signal?: AbortSignal },
  ): Promise<T> {
    return this.request<T>("PATCH", path, { ...options, body })
  }

  // Get failed requests for monitoring dashboard
  static getFailedRequests(): any[] {
    if (typeof window === "undefined") return []
    try {
      return JSON.parse(localStorage.getItem("api_failures") || "[]")
    } catch {
      return []
    }
  }

  // Clear failed requests log
  static clearFailedRequests(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("api_failures")
    }
  }
}

// FastAPI Backend Service Interfaces
export interface LedgerEntry {
  id: string
  transactionId: string
  accountId: string
  amount: number
  currency: string
  type: "debit" | "credit"
  balance: number
  timestamp: Date
  metadata?: Record<string, any>
}

export interface ComplianceCheck {
  id: string
  transactionId: string
  checkType: "aml" | "kyc" | "sanctions" | "pep"
  status: "pending" | "passed" | "failed" | "review"
  score?: number
  details?: string
  checkedAt: Date
}

// Backend API Services
export class BackendService {
  private static client = APIClient.getInstance()

  // Ledger operations
  static async getLedgerEntries(accountId: string, params?: { from?: Date; to?: Date }): Promise<LedgerEntry[]> {
    const queryParams = new URLSearchParams()
    if (params?.from) queryParams.append("from", params.from.toISOString())
    if (params?.to) queryParams.append("to", params.to.toISOString())

    return this.client.get<LedgerEntry[]>(`/api/v1/ledger/${accountId}?${queryParams.toString()}`)
  }

  static async createLedgerEntry(entry: Omit<LedgerEntry, "id" | "timestamp">): Promise<LedgerEntry> {
    return this.client.post<LedgerEntry>("/api/v1/ledger", entry)
  }

  // Compliance operations
  static async runComplianceCheck(transactionId: string, checkType: string): Promise<ComplianceCheck> {
    return this.client.post<ComplianceCheck>("/api/v1/compliance/check", {
      transactionId,
      checkType,
    })
  }

  static async getComplianceHistory(transactionId: string): Promise<ComplianceCheck[]> {
    return this.client.get<ComplianceCheck[]>(`/api/v1/compliance/history/${transactionId}`)
  }

  // FX Rate operations
  static async getFXRates(): Promise<any> {
    return this.client.get("/api/v1/fx/rates")
  }

  static async createFXQuote(from: string, to: string, amount: number): Promise<any> {
    return this.client.post("/api/v1/fx/quote", { from, to, amount })
  }

  // Health check
  static async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.client.get("/api/v1/health")
  }
}

export const apiClient = APIClient.getInstance()
