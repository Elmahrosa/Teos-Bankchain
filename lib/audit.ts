// Audit logging and observability
export type AuditEventType =
  | "user_login"
  | "user_logout"
  | "transaction_created"
  | "transaction_approved"
  | "transaction_rejected"
  | "wallet_created"
  | "wallet_suspended"
  | "settlement_created"
  | "settlement_reconciled"
  | "config_changed"
  | "report_generated"
  | "suspicious_activity"

export interface AuditLog {
  id: string
  eventType: AuditEventType
  userId: string
  userEmail: string
  userRole: string
  timestamp: Date
  ipAddress?: string
  userAgent?: string
  resourceId?: string
  resourceType?: string
  action: string
  changes?: Record<string, any>
  metadata?: Record<string, any>
}

export interface Metric {
  name: string
  value: number
  timestamp: Date
  tags?: Record<string, string>
}

export interface ErrorLog {
  id: string
  timestamp: Date
  level: "error" | "warning" | "info"
  message: string
  stack?: string
  userId?: string
  context?: Record<string, any>
}

export class AuditService {
  static async logEvent(event: Omit<AuditLog, "id" | "timestamp">): Promise<void> {
    const log: AuditLog = {
      ...event,
      id: `audit_${Math.random().toString(36).substring(7)}`,
      timestamp: new Date(),
    }

    console.log("[v0] Audit log:", log)

    // In production: Send to audit database
    if (typeof window !== "undefined") {
      const logs = JSON.parse(localStorage.getItem("audit_logs") || "[]")
      logs.push(log)
      localStorage.setItem("audit_logs", JSON.stringify(logs.slice(-1000))) // Keep last 1000
    }
  }

  static async getAuditLogs(
    filters?: Partial<{
      userId: string
      eventType: AuditEventType
      startDate: Date
      endDate: Date
    }>,
  ): Promise<AuditLog[]> {
    if (typeof window !== "undefined") {
      const logs = JSON.parse(localStorage.getItem("audit_logs") || "[]")
      return logs
        .map((log: any) => ({
          ...log,
          timestamp: new Date(log.timestamp),
        }))
        .filter((log: AuditLog) => {
          if (filters?.userId && log.userId !== filters.userId) return false
          if (filters?.eventType && log.eventType !== filters.eventType) return false
          if (filters?.startDate && log.timestamp < filters.startDate) return false
          if (filters?.endDate && log.timestamp > filters.endDate) return false
          return true
        })
        .reverse()
    }
    return []
  }

  static async exportAuditLogs(format: "csv" | "json", filters?: any): Promise<Blob> {
    const logs = await this.getAuditLogs(filters)

    if (format === "json") {
      return new Blob([JSON.stringify(logs, null, 2)], { type: "application/json" })
    }

    // CSV format
    const headers = ["ID", "Timestamp", "Event Type", "User", "Role", "Action", "Resource"]
    const rows = logs.map((log) => [
      log.id,
      log.timestamp.toISOString(),
      log.eventType,
      log.userEmail,
      log.userRole,
      log.action,
      log.resourceId || "",
    ])

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n")
    return new Blob([csv], { type: "text/csv" })
  }

  static async trackMetric(metric: Omit<Metric, "timestamp">): Promise<void> {
    const fullMetric: Metric = {
      ...metric,
      timestamp: new Date(),
    }

    console.log("[v0] Metric:", fullMetric)
    // In production: Send to metrics service (e.g., Prometheus, Datadog)
  }

  static async logError(error: Omit<ErrorLog, "id" | "timestamp">): Promise<void> {
    const log: ErrorLog = {
      ...error,
      id: `error_${Math.random().toString(36).substring(7)}`,
      timestamp: new Date(),
    }

    console.error("[v0] Error log:", log)
    // In production: Send to error tracking service (e.g., Sentry)
  }

  static async generateRegulatorReport(
    startDate: Date,
    endDate: Date,
  ): Promise<{
    summary: any
    transactions: any[]
    compliance: any
  }> {
    // Mock regulator report
    return {
      summary: {
        totalTransactions: 1250,
        totalVolume: 15750000,
        flaggedTransactions: 3,
        period: { start: startDate, end: endDate },
      },
      transactions: [],
      compliance: {
        amlChecks: 1250,
        kycVerifications: 847,
        suspiciousActivityReports: 3,
      },
    }
  }
}
