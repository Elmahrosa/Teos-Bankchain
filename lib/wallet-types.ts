// Wallet type definitions and management logic

export type WalletType = "custodial" | "non_custodial"
export type WalletStatus = "active" | "suspended" | "frozen" | "closed"
export type TransactionType = "deposit" | "withdrawal" | "transfer" | "pi_bridge"
export type TransactionStatus = "pending" | "approved" | "processing" | "completed" | "rejected" | "failed"
export type ApprovalTier = "auto" | "tier_1" | "tier_2" | "tier_3"

export interface Wallet {
  id: string
  userId: string
  type: WalletType
  status: WalletStatus
  balances: {
    egp: number
    pi: number
    usd: number
  }
  createdAt: Date
  updatedAt: Date
}

export interface Transaction {
  id: string
  walletId: string
  type: TransactionType
  amount: number
  currency: "egp" | "pi" | "usd"
  status: TransactionStatus
  approvalTier: ApprovalTier
  approvers: string[]
  approvedBy?: string[]
  rejectedBy?: string
  rejectionReason?: string
  metadata: {
    description?: string
    reference?: string
    beneficiary?: string
    beneficiaryAccount?: string
    piAddress?: string
  }
  createdAt: Date
  completedAt?: Date
}

// Approval tier thresholds (in EGP equivalent)
export const APPROVAL_THRESHOLDS = {
  auto: 0, // 0 - 10,000 EGP: Auto-approved
  tier_1: 10000, // 10,000 - 100,000 EGP: Operations approval
  tier_2: 100000, // 100,000 - 1,000,000 EGP: Compliance + Operations
  tier_3: 1000000, // 1,000,000+ EGP: Bank Admin + Compliance + Operations
}

export function determineApprovalTier(amountEGP: number): ApprovalTier {
  if (amountEGP < APPROVAL_THRESHOLDS.tier_1) return "auto"
  if (amountEGP < APPROVAL_THRESHOLDS.tier_2) return "tier_1"
  if (amountEGP < APPROVAL_THRESHOLDS.tier_3) return "tier_2"
  return "tier_3"
}

export function getRequiredApprovers(tier: ApprovalTier): string[] {
  switch (tier) {
    case "auto":
      return []
    case "tier_1":
      return ["operations"]
    case "tier_2":
      return ["operations", "compliance_officer"]
    case "tier_3":
      return ["bank_admin", "compliance_officer", "operations"]
    default:
      return []
  }
}

export class WalletService {
  // Mock wallet data storage
  private static wallets: Map<string, Wallet> = new Map()
  private static transactions: Map<string, Transaction> = new Map()

  static createWallet(userId: string, type: WalletType = "custodial"): Wallet {
    const wallet: Wallet = {
      id: `wallet_${Math.random().toString(36).substring(7)}`,
      userId,
      type,
      status: "active",
      balances: {
        egp: type === "custodial" ? 150000 : 75000, // Mock balances
        pi: 234.56,
        usd: 1200,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.wallets.set(wallet.id, wallet)
    return wallet
  }

  static getWallet(walletId: string): Wallet | null {
    return this.wallets.get(walletId) || null
  }

  static createTransaction(
    walletId: string,
    type: TransactionType,
    amount: number,
    currency: "egp" | "pi" | "usd",
    metadata: Transaction["metadata"],
  ): Transaction {
    const tier = determineApprovalTier(amount)
    const transaction: Transaction = {
      id: `txn_${Math.random().toString(36).substring(7)}`,
      walletId,
      type,
      amount,
      currency,
      status: tier === "auto" ? "approved" : "pending",
      approvalTier: tier,
      approvers: getRequiredApprovers(tier),
      approvedBy: tier === "auto" ? ["system"] : [],
      metadata,
      createdAt: new Date(),
    }
    this.transactions.set(transaction.id, transaction)
    return transaction
  }

  static getTransactions(walletId: string): Transaction[] {
    return Array.from(this.transactions.values())
      .filter((t) => t.walletId === walletId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  static approveTransaction(transactionId: string, approverRole: string): boolean {
    const transaction = this.transactions.get(transactionId)
    if (!transaction) return false

    if (!transaction.approvedBy) transaction.approvedBy = []
    transaction.approvedBy.push(approverRole)

    // Check if all required approvers have approved
    const requiredApprovers = getRequiredApprovers(transaction.approvalTier)
    const allApproved = requiredApprovers.every((role) => transaction.approvedBy!.includes(role))

    if (allApproved) {
      transaction.status = "processing"
      // Simulate completion
      setTimeout(() => {
        transaction.status = "completed"
        transaction.completedAt = new Date()
      }, 2000)
    }

    return true
  }

  static rejectTransaction(transactionId: string, approverRole: string, reason: string): boolean {
    const transaction = this.transactions.get(transactionId)
    if (!transaction) return false

    transaction.status = "rejected"
    transaction.rejectedBy = approverRole
    transaction.rejectionReason = reason

    return true
  }
}
