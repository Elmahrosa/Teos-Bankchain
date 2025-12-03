import type { UserRole } from "@/shared/auth/types"

export interface ExportData {
  timestamp: string
  generatedBy: string
  role: UserRole
  data: any
}

export class DashboardExportService {
  /**
   * Export data to CSV format
   */
  static exportToCSV(data: any[], filename: string): void {
    if (data.length === 0) return

    // Get headers from first object
    const headers = Object.keys(data[0])

    // Create CSV content
    const csvContent = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = row[header]
            // Escape quotes and wrap in quotes if contains comma
            const stringValue = String(value).replace(/"/g, '""')
            return stringValue.includes(",") ? `"${stringValue}"` : stringValue
          })
          .join(","),
      ),
    ].join("\n")

    // Download file
    this.downloadFile(csvContent, filename, "text/csv")
  }

  /**
   * Export data to JSON format
   */
  static exportToJSON(data: any, filename: string): void {
    const exportData: ExportData = {
      timestamp: new Date().toISOString(),
      generatedBy: "TEOS BankChain",
      role: "bank_admin",
      data,
    }

    const jsonContent = JSON.stringify(exportData, null, 2)
    this.downloadFile(jsonContent, filename, "application/json")
  }

  /**
   * Download file helper
   */
  private static downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
}
