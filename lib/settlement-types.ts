// Settlement rail types and processing logic

export type SettlementRail = "bank_transfer" | "agent_network" | "pi_bridge" | "card_network"
export type SettlementStatus = "pending" | "processing" | "settled" | "failed" | "reversed"
export type RampType = "on_ramp" | "off_ramp"

export interface SettlementConfig {
  rail: SettlementRail
  cutoffTime: string // HH:MM format
  processingDays: number
  minAmount: number
  maxAmount: number
  fee: number
  feeType: "fixed" | "percentage"
}

export interface Settlement {
  id: string
  transactionId: string
  rail: SettlementRail
  rampType: RampType
  amount: number
  currency: string
  status: SettlementStatus
  scheduledDate: Date
  settledDate?: Date
  reconciled: boolean
  ledgerEntries: LedgerEntry[]
  agentId?: string
  bankReference?: string
  piTransactionHash?: string
  metadata: Record<string, any>
  createdAt: Date
}

export interface LedgerEntry {
  id: string
  settlementId: string
  account: string
  debit: number
  credit: number
  balance: number
  currency: string
  timestamp: Date
  reconciled: boolean
}

export interface Agent {
  id: string
  name: string
  location: string
  status: "active" | "inactive" | "suspended"
  dailyLimit: number
  availableBalance: number
  rating: number
  totalTransactions: number
}

// Default settlement configurations
export const SETTLEMENT_CONFIGS: Record<SettlementRail, SettlementConfig> = {
  bank_transfer: {
    rail: "bank_transfer",
    cutoffTime: "15:00",
    processingDays: 1,
    minAmount: 100,
    maxAmount: 500000,
    fee: 15,
    feeType: "fixed",
  },
  agent_network: {
    rail: "agent_network",
    cutoffTime: "20:00",
    processingDays: 0,
    minAmount: 50,
    maxAmount: 50000,
    fee: 2,
    feeType: "percentage",
  },
  pi_bridge: {
    rail: "pi_bridge",
    cutoffTime: "23:59",
    processingDays: 0,
    minAmount: 10,
    maxAmount: 1000000,
    fee: 0.5,
    feeType: "percentage",
  },
  card_network: {
    rail: "card_network",
    cutoffTime: "23:59",
    processingDays: 0,
    minAmount: 20,
    maxAmount: 100000,
    fee: 2.5,
    feeType: "percentage",
  },
}

export class SettlementService {
  private static settlements: Map<string, Settlement> = new Map()
  private static ledger: Map<string, LedgerEntry[]> = new Map()
  private static agents: Map<string, Agent> = new Map()

  static {
    // Initialize mock agents
    this.createAgent("Cairo Downtown", "Cairo, Egypt")
    this.createAgent("Alexandria Branch", "Alexandria, Egypt")
    this.createAgent("Giza Agent", "Giza, Egypt")
  }

  static createAgent(name: string, location: string): Agent {
    const agent: Agent = {
      id: `agent_${Math.random().toString(36).substring(7)}`,
      name,
      location,
      status: "active",
      dailyLimit: 100000,
      availableBalance: Math.random() * 80000 + 20000,
      rating: 4.5 + Math.random() * 0.5,
      totalTransactions: Math.floor(Math.random() * 1000) + 100,
    }
    this.agents.set(agent.id, agent)
    return agent
  }

  static getAgents(): Agent[] {
    return Array.from(this.agents.values()).filter((a) => a.status === "active")
  }

  static createSettlement(
    transactionId: string,
    rail: SettlementRail,
    rampType: RampType,
    amount: number,
    currency: string,
    agentId?: string,
  ): Settlement {
    const config = SETTLEMENT_CONFIGS[rail]
    const now = new Date()
    const cutoffHour = Number.parseInt(config.cutoffTime.split(":")[0])
    const cutoffMinute = Number.parseInt(config.cutoffTime.split(":")[1])

    // Calculate settlement date based on cutoff time
    const settlementDate = new Date(now)
    if (now.getHours() > cutoffHour || (now.getHours() === cutoffHour && now.getMinutes() > cutoffMinute)) {
      settlementDate.setDate(settlementDate.getDate() + 1)
    }
    settlementDate.setDate(settlementDate.getDate() + config.processingDays)

    const settlement: Settlement = {
      id: `settle_${Math.random().toString(36).substring(7)}`,
      transactionId,
      rail,
      rampType,
      amount,
      currency,
      status: "pending",
      scheduledDate: settlementDate,
      reconciled: false,
      ledgerEntries: [],
      agentId,
      metadata: {},
      createdAt: now,
    }

    // Create ledger entries
    const ledgerEntry = this.createLedgerEntry(settlement)
    settlement.ledgerEntries.push(ledgerEntry)

    this.settlements.set(settlement.id, settlement)
    return settlement
  }

  private static createLedgerEntry(settlement: Settlement): LedgerEntry {
    const entry: LedgerEntry = {
      id: `ledger_${Math.random().toString(36).substring(7)}`,
      settlementId: settlement.id,
      account:
        settlement.rail === "bank_transfer"
          ? "BANK_SETTLEMENT"
          : settlement.rail === "agent_network"
            ? "AGENT_CASH"
            : "PI_BRIDGE",
      debit: settlement.rampType === "off_ramp" ? settlement.amount : 0,
      credit: settlement.rampType === "on_ramp" ? settlement.amount : 0,
      balance: 0, // Calculate based on previous entries
      currency: settlement.currency,
      timestamp: new Date(),
      reconciled: false,
    }

    if (!this.ledger.has(settlement.id)) {
      this.ledger.set(settlement.id, [])
    }
    this.ledger.get(settlement.id)!.push(entry)

    return entry
  }

  static getSettlements(): Settlement[] {
    return Array.from(this.settlements.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  static getSettlement(id: string): Settlement | null {
    return this.settlements.get(id) || null
  }

  static processSettlement(id: string): boolean {
    const settlement = this.settlements.get(id)
    if (!settlement) return false

    settlement.status = "processing"

    // Simulate settlement processing
    setTimeout(() => {
      settlement.status = "settled"
      settlement.settledDate = new Date()

      // Mock bank reference or blockchain hash
      if (settlement.rail === "bank_transfer") {
        settlement.bankReference = `BNK${Date.now()}`
      } else if (settlement.rail === "pi_bridge") {
        settlement.piTransactionHash = `0x${Math.random().toString(16).substring(2, 66)}`
      }
    }, 3000)

    return true
  }

  static reconcileSettlement(id: string): boolean {
    const settlement = this.settlements.get(id)
    if (!settlement || settlement.status !== "settled") return false

    settlement.reconciled = true
    settlement.ledgerEntries.forEach((entry) => {
      entry.reconciled = true
    })

    return true
  }

  static getLedgerEntries(settlementId?: string): LedgerEntry[] {
    if (settlementId) {
      return this.ledger.get(settlementId) || []
    }
    return Array.from(this.ledger.values()).flat()
  }

  static calculateFee(rail: SettlementRail, amount: number): number {
    const config = SETTLEMENT_CONFIGS[rail]
    if (config.feeType === "fixed") {
      return config.fee
    }
    return (amount * config.fee) / 100
  }
}
