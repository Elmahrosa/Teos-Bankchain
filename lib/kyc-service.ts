export interface KYCDocument {
  id: string
  userId: string
  type: "passport" | "national_id" | "drivers_license" | "proof_of_address"
  status: "pending" | "verified" | "rejected"
  documentUrl: string
  uploadedAt: string
  verifiedAt?: string
  verifiedBy?: string
  rejectionReason?: string
}

export interface KYCProfile {
  userId: string
  status: "not_started" | "pending" | "approved" | "rejected"
  level: "tier1" | "tier2" | "tier3"
  firstName: string
  lastName: string
  dateOfBirth: string
  nationality: string
  address: {
    street: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  documents: KYCDocument[]
  amlScreening?: {
    status: "clear" | "flagged" | "pending"
    screenedAt: string
    sanctionsList: string[]
  }
  pepScreening?: {
    isPEP: boolean
    screenedAt: string
  }
  approvedAt?: string
  approvedBy?: string
}

export class KYCService {
  private static API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.teosegypt.com"

  static async getKYCProfile(userId: string): Promise<KYCProfile> {
    const response = await fetch(`${this.API_URL}/kyc/profile/${userId}`, {
      headers: {
        Authorization: `Bearer ${this.getAuthToken()}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch KYC profile")
    }

    return response.json()
  }

  static async submitKYC(userId: string, data: Partial<KYCProfile>): Promise<KYCProfile> {
    const response = await fetch(`${this.API_URL}/kyc/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.getAuthToken()}`,
      },
      body: JSON.stringify({ userId, ...data }),
    })

    if (!response.ok) {
      throw new Error("Failed to submit KYC")
    }

    return response.json()
  }

  static async uploadDocument(userId: string, documentType: KYCDocument["type"], file: File): Promise<KYCDocument> {
    const formData = new FormData()
    formData.append("userId", userId)
    formData.append("documentType", documentType)
    formData.append("file", file)

    const response = await fetch(`${this.API_URL}/kyc/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.getAuthToken()}`,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Failed to upload document")
    }

    return response.json()
  }

  static async performAMLScreening(userId: string): Promise<KYCProfile["amlScreening"]> {
    const response = await fetch(`${this.API_URL}/kyc/aml-screen`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.getAuthToken()}`,
      },
      body: JSON.stringify({ userId }),
    })

    if (!response.ok) {
      throw new Error("AML screening failed")
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
