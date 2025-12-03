// Settlement rails and reconciliation
export type SettlementRail = "bank_transfer" | "agent_network" | "pi_network" | "instant_transfer"
export type SettlementStatus = "pending" | "processing" | "completed" | "failed" | "reconciled"

export interface SettlementConfig {
  rail: SettlementRail
  cutoffTime: string // HH:MM format
  processingDays: number
  minAmount: number
  maxAmount: number
  feePercentage: number
  flatFee: number
  enabled: boolean
}

export interface Settlement {
  id: string
  transactionId: string
  rail: SettlementRail
  amount: number
  currency: Currency
  status: SettlementStatus
  scheduledDate: Date
  completedDate?: Date
  reconciliationStatus?: "pending" | "matched" | "unmatched"
  reconciliationDate?: Date
  metadata: {
    sourceAccount?: string
    destinationAccount?: string
    referenceNumber?: string
    bankName?: string
    agentId?: string
    piWalletAddress?: string
  }
}

export interface LedgerEntry {
  id: string
  settlementId: string
  accountId: string
  debitAmount?: number
  creditAmount?: number
  balance: number
  currency: Currency
  timestamp: Date
  description: string
}

export class SettlementService {
  // Default settlement configurations
  static readonly CONFIGS: Record<SettlementRail, SettlementConfig> = {
    bank_transfer: {
      rail: "bank_transfer",
      cutoffTime: "15:00",
      processingDays: 1,
      minAmount: 100,
      maxAmount: 10000000,
      feePercentage: 0.001,
      flatFee: 5,
      enabled: true,
    },
    instant_transfer: {
      rail: "instant_transfer",
      cutoffTime: "23:59",
      processingDays: 0,
      minAmount: 10,
      maxAmount: 50000,
      feePercentage: 0.015,
      flatFee: 10,
      enabled: true,
    },
    agent_network: {
      rail: "agent_network",
      cutoffTime: "20:00",
      processingDays: 0,
      minAmount: 50,
      maxAmount: 100000,
      feePercentage: 0.02,
      flatFee: 0,
      enabled: true,
    },
    pi_network: {
      rail: "pi_network",
      cutoffTime: "23:59",
      processingDays: 0,
      minAmount: 1,
      maxAmount: 1000000,
      feePercentage: 0.005,
      flatFee: 0,
      enabled: true,
    },
  }

  static calculateFee(amount: number, rail: SettlementRail): number {
    const config = this.CONFIGS[rail]
    return amount * config.feePercentage + config.flatFee
  }

  static canSettleToday(rail: SettlementRail): boolean {
    const config = this.CONFIGS[rail]
    const now = new Date()
    const [cutoffHour, cutoffMinute] = config.cutoffTime.split(":").map(Number)
    const cutoff = new Date(now.getFullYear(), now.getMonth(), now.getDate(), cutoffHour, cutoffMinute)

    return now < cutoff
  }

  static async createSettlement(
    transactionId: string,
    rail: SettlementRail,
    amount: number,
    currency: Currency,
    metadata: Settlement["metadata"],
  ): Promise<Settlement> {
    const settlement: Settlement = {
      id: `stl_${Math.random().toString(36).substring(7)}`,
      transactionId,
      rail,
      amount,
      currency,
      status: "pending",
      scheduledDate: new Date(),
      metadata,
    }

    return settlement
  }

  static async reconcileSettlement(settlementId: string, bankStatementData: any): Promise<Settlement> {
    // Mock reconciliation
    await new Promise((resolve) => setTimeout(resolve, 500))
    throw new Error("Mock implementation - would reconcile with bank statement")
  }

  static async getLedgerEntries(accountId: string, startDate: Date, endDate: Date): Promise<LedgerEntry[]> {
    // Mock ledger data
    return []
  }
}

type Currency = "EGP" | "USD" | "PI"
