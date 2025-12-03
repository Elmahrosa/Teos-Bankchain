import { apiClient } from "./api-client"

export interface LegalDocument {
  id: string
  type: "terms" | "privacy" | "compliance" | "license"
  title: string
  version: string
  effectiveDate: string
  lastUpdated: string
  nextReview: string
  status: "current" | "archived" | "draft"
  content: string
  changelog: ChangelogEntry[]
}

export interface ChangelogEntry {
  version: string
  date: string
  author: string
  changes: string[]
  impactLevel: "major" | "minor" | "patch"
}

export class LegalDocsService {
  // Fetch all legal documents
  static async getAllDocuments(): Promise<LegalDocument[]> {
    try {
      const response = await apiClient.get("/api/legal/documents")
      return response.data
    } catch (error) {
      console.error("[v0] Failed to fetch legal documents:", error)
      return this.getMockDocuments()
    }
  }

  // Get document by type
  static async getDocument(type: string): Promise<LegalDocument | null> {
    try {
      const response = await apiClient.get(`/api/legal/documents/${type}`)
      return response.data
    } catch (error) {
      console.error("[v0] Failed to fetch document:", error)
      const docs = this.getMockDocuments()
      return docs.find((doc) => doc.type === type) || null
    }
  }

  // Export document as PDF
  static async exportToPDF(documentId: string): Promise<Blob> {
    try {
      const response = await apiClient.get(`/api/legal/documents/${documentId}/export/pdf`, {
        responseType: "blob",
      })
      return response.data
    } catch (error) {
      console.error("[v0] Failed to export PDF:", error)
      // Return mock PDF blob
      return new Blob(["Mock PDF content"], { type: "application/pdf" })
    }
  }

  // Export document as CSV (for regulators)
  static async exportToCSV(documentId: string): Promise<Blob> {
    try {
      const response = await apiClient.get(`/api/legal/documents/${documentId}/export/csv`, {
        responseType: "blob",
      })
      return response.data
    } catch (error) {
      console.error("[v0] Failed to export CSV:", error)
      const doc = await this.getDocument(documentId)
      if (doc) {
        const csvContent = this.generateCSV(doc)
        return new Blob([csvContent], { type: "text/csv" })
      }
      return new Blob([""], { type: "text/csv" })
    }
  }

  // Generate CSV content for regulatory export
  private static generateCSV(doc: LegalDocument): string {
    let csv = "Field,Value\n"
    csv += `Document Type,${doc.type}\n`
    csv += `Title,${doc.title}\n`
    csv += `Version,${doc.version}\n`
    csv += `Effective Date,${doc.effectiveDate}\n`
    csv += `Last Updated,${doc.lastUpdated}\n`
    csv += `Status,${doc.status}\n`
    csv += "\nChangelog\n"
    csv += "Version,Date,Author,Impact Level,Changes\n"
    doc.changelog.forEach((entry) => {
      const changes = entry.changes.join("; ")
      csv += `${entry.version},${entry.date},${entry.author},${entry.impactLevel},"${changes}"\n`
    })
    return csv
  }

  // Download file helper
  static downloadFile(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  // Create legal escalation ticket
  static async createLegalTicket(issue: {
    documentType: string
    issue: string
    userRole: string
    urgency: "low" | "medium" | "high" | "critical"
  }): Promise<any> {
    try {
      const response = await apiClient.post("/api/support/tickets", {
        category: "Legal & Compliance",
        priority:
          issue.urgency === "critical"
            ? "P0"
            : issue.urgency === "high"
              ? "P1"
              : issue.urgency === "medium"
                ? "P2"
                : "P3",
        subject: `Legal Document Issue: ${issue.documentType}`,
        description: issue.issue,
        metadata: {
          documentType: issue.documentType,
          userRole: issue.userRole,
          escalationType: "legal",
        },
      })
      return response.data
    } catch (error) {
      console.error("[v0] Failed to create legal ticket:", error)
      throw error
    }
  }

  // Mock data for development
  private static getMockDocuments(): LegalDocument[] {
    return [
      {
        id: "terms-v1",
        type: "terms",
        title: "Terms of Service",
        version: "1.0",
        effectiveDate: "December 2025",
        lastUpdated: "December 2025",
        nextReview: "June 2026",
        status: "current",
        content: "",
        changelog: [
          {
            version: "1.0",
            date: "December 2025",
            author: "TEOS Legal Team",
            impactLevel: "major",
            changes: [
              "Initial release of Terms of Service",
              "Added Pi Network integration clauses",
              "Defined user eligibility requirements",
              "Established KYC/AML compliance requirements",
            ],
          },
        ],
      },
      {
        id: "privacy-v1",
        type: "privacy",
        title: "Privacy Policy",
        version: "1.0",
        effectiveDate: "December 2025",
        lastUpdated: "December 2025",
        nextReview: "June 2026",
        status: "current",
        content: "",
        changelog: [
          {
            version: "1.0",
            date: "December 2025",
            author: "TEOS Legal Team",
            impactLevel: "major",
            changes: [
              "Initial Privacy Policy release",
              "GDPR compliance measures",
              "Data retention policies defined",
              "User rights and data protection outlined",
            ],
          },
        ],
      },
      {
        id: "compliance-v1",
        type: "compliance",
        title: "Compliance Documents",
        version: "1.0",
        effectiveDate: "December 2025",
        lastUpdated: "December 2025",
        nextReview: "March 2026",
        status: "current",
        content: "",
        changelog: [
          {
            version: "1.0",
            date: "December 2025",
            author: "TEOS Compliance Team",
            impactLevel: "major",
            changes: [
              "KYC/AML procedures documented",
              "Sanctions screening protocols established",
              "Audit log requirements defined",
              "Regulatory reporting framework created",
            ],
          },
        ],
      },
      {
        id: "license-v1",
        type: "license",
        title: "Software License",
        version: "1.0",
        effectiveDate: "December 2025",
        lastUpdated: "December 2025",
        nextReview: "December 2026",
        status: "current",
        content: "",
        changelog: [
          {
            version: "1.0",
            date: "December 2025",
            author: "TEOS Legal Team",
            impactLevel: "major",
            changes: [
              "Proprietary software license defined",
              "NDA clauses established",
              "Usage restrictions documented",
              "Intellectual property rights protected",
            ],
          },
        ],
      },
    ]
  }
}
