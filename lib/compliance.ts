export interface ComplianceAlert {
  id: string
  type: "high_value" | "suspicious_pattern" | "aml_flag" | "kyc_expired" | "threshold_breach" | "cross_border"
  severity: "low" | "medium" | "high" | "critical"
  title: string
  description: string
  transactionId?: string
  userId?: string
  amount?: number
  currency?: string
  timestamp: Date
  status: "open" | "investigating" | "resolved" | "false_positive"
  assignedTo?: string
  resolutionNotes?: string
}

export interface TransactionMonitor {
  id: string
  transactionId: string
  type: "deposit" | "withdrawal" | "transfer" | "exchange"
  amount: number
  currency: string
  from: string
  to: string
  status: "pending" | "processing" | "completed" | "flagged" | "rejected"
  riskScore: number
  flags: string[]
  timestamp: Date
  requiresApproval: boolean
  approvalTier?: number
}

export interface AuditExportOptions {
  format: "csv" | "json"
  dateFrom: Date
  dateTo: Date
  eventTypes?: string[]
  userRoles?: string[]
  includeMetadata?: boolean
}

export class ComplianceService {
  // Mock real-time compliance alerts
  static async getComplianceAlerts(): Promise<ComplianceAlert[]> {
    await new Promise((resolve) => setTimeout(resolve, 500))

    return [
      {
        id: "alert_001",
        type: "high_value",
        severity: "high",
        title: "High Value Transaction Detected",
        description: "Transfer of EGP 2,500,000 exceeds threshold",
        transactionId: "tx_HV_001",
        userId: "user_123",
        amount: 2500000,
        currency: "EGP",
        timestamp: new Date(Date.now() - 300000),
        status: "open",
      },
      {
        id: "alert_002",
        type: "suspicious_pattern",
        severity: "critical",
        title: "Unusual Activity Pattern",
        description: "Multiple rapid transactions from same account",
        transactionId: "tx_SP_002",
        userId: "user_456",
        timestamp: new Date(Date.now() - 600000),
        status: "investigating",
        assignedTo: "compliance@teosbank.eg",
      },
      {
        id: "alert_003",
        type: "aml_flag",
        severity: "medium",
        title: "AML Watch List Match",
        description: "Potential match with sanctioned entity list",
        userId: "user_789",
        timestamp: new Date(Date.now() - 900000),
        status: "open",
      },
      {
        id: "alert_004",
        type: "cross_border",
        severity: "low",
        title: "Cross-Border Transaction",
        description: "International transfer requires documentation",
        transactionId: "tx_CB_004",
        amount: 50000,
        currency: "USD",
        timestamp: new Date(Date.now() - 1200000),
        status: "resolved",
      },
    ]
  }

  // Monitor recent transactions with risk scoring
  static async monitorTransactions(): Promise<TransactionMonitor[]> {
    await new Promise((resolve) => setTimeout(resolve, 500))

    return [
      {
        id: "mon_001",
        transactionId: "tx_2024_001",
        type: "withdrawal",
        amount: 150000,
        currency: "EGP",
        from: "Wallet-EGP-001",
        to: "Bank-NBE-***3456",
        status: "pending",
        riskScore: 75,
        flags: ["high_value", "unusual_time"],
        timestamp: new Date(Date.now() - 180000),
        requiresApproval: true,
        approvalTier: 2,
      },
      {
        id: "mon_002",
        transactionId: "tx_2024_002",
        type: "exchange",
        amount: 5000,
        currency: "USD",
        from: "USD Wallet",
        to: "EGP Wallet",
        status: "processing",
        riskScore: 25,
        flags: [],
        timestamp: new Date(Date.now() - 360000),
        requiresApproval: false,
      },
      {
        id: "mon_003",
        transactionId: "tx_2024_003",
        type: "deposit",
        amount: 250000,
        currency: "SAR",
        from: "Bank-AlRajhi-***7890",
        to: "Wallet-SAR-001",
        status: "flagged",
        riskScore: 85,
        flags: ["first_time_sender", "large_amount"],
        timestamp: new Date(Date.now() - 540000),
        requiresApproval: true,
        approvalTier: 3,
      },
    ]
  }

  // Update alert status
  static async updateAlertStatus(alertId: string, status: ComplianceAlert["status"], notes?: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    console.log(`[v0] Alert ${alertId} updated to ${status}`, notes)
    return true
  }

  // Export audit logs for regulators
  static async exportAuditLogs(options: AuditExportOptions): Promise<Blob> {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const mockData = [
      {
        timestamp: new Date().toISOString(),
        eventType: "user_login",
        userId: "user_123",
        userEmail: "admin@teosbank.eg",
        userRole: "bank_admin",
        action: "User logged in successfully",
        ipAddress: "192.168.1.1",
        metadata: { authMethod: "password_mfa" },
      },
      {
        timestamp: new Date().toISOString(),
        eventType: "transaction_approved",
        userId: "user_456",
        userEmail: "compliance@teosbank.eg",
        userRole: "compliance_officer",
        action: "Transaction tx_001 approved",
        metadata: { transactionId: "tx_001", amount: 500000, currency: "EGP" },
      },
    ]

    if (options.format === "csv") {
      const headers = Object.keys(mockData[0]).join(",")
      const rows = mockData.map((row) => Object.values(row).join(",")).join("\n")
      const csv = `${headers}\n${rows}`
      return new Blob([csv], { type: "text/csv" })
    } else {
      const json = JSON.stringify(mockData, null, 2)
      return new Blob([json], { type: "application/json" })
    }
  }
}
