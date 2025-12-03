// Wallet management for custodial and non-custodial wallets
export type WalletType = "custodial" | "non_custodial"
export type WalletStatus = "active" | "suspended" | "closed"
export type Currency = "EGP" | "USD" | "SAR" | "PI"

export interface Wallet {
  id: string
  userId: string
  type: WalletType
  currency: Currency
  balance: number
  availableBalance: number
  reservedBalance: number
  status: WalletStatus
  createdAt: Date
  updatedAt: Date
  // For non-custodial wallets
  publicKey?: string
  // Metadata
  name?: string
  isDefault?: boolean
}

export interface WalletTransaction {
  id: string
  walletId: string
  type: "deposit" | "withdrawal" | "transfer" | "fee"
  amount: number
  currency: Currency
  status: "pending" | "processing" | "completed" | "failed" | "cancelled"
  approvals: Approval[]
  metadata?: {
    counterpartyWalletId?: string
    counterpartyName?: string
    reference?: string
    notes?: string
  }
  createdAt: Date
  completedAt?: Date
}

export interface Approval {
  approverId: string
  approverName: string
  approverRole: string
  tier: number
  status: "pending" | "approved" | "rejected"
  comments?: string
  timestamp: Date
}

export class WalletService {
  // Get required approval tiers based on transaction amount
  static getRequiredApprovalTiers(amount: number, currency: Currency): number[] {
    // Convert to EGP for comparison
    const amountInEGP =
      currency === "USD" ? amount * 30.9 : currency === "SAR" ? amount * 8.23 : currency === "PI" ? amount * 50 : amount

    if (amountInEGP > 1000000) return [1, 2, 3] // High value: Ops + Compliance + Admin
    if (amountInEGP > 100000) return [1, 2] // Medium value: Ops + Compliance
    if (amountInEGP > 10000) return [1] // Low value: Ops only
    return [] // No approval required
  }

  // Create new wallet
  static async createWallet(userId: string, type: WalletType, currency: Currency, name?: string): Promise<Wallet> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    const wallet: Wallet = {
      id: `wallet_${Math.random().toString(36).substring(7)}`,
      userId,
      type,
      currency,
      balance: 0,
      availableBalance: 0,
      reservedBalance: 0,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
      name: name || `${currency} ${type} Wallet`,
      isDefault: false,
      ...(type === "non_custodial" && {
        publicKey: `0x${Math.random().toString(16).substring(2, 42)}`,
      }),
    }

    return wallet
  }

  // Get wallets for a user
  static async getWallets(userId: string): Promise<Wallet[]> {
    // Mock data
    return [
      {
        id: "wallet_egp_001",
        userId,
        type: "custodial",
        currency: "EGP",
        balance: 125450.5,
        availableBalance: 120450.5,
        reservedBalance: 5000,
        status: "active",
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date(),
        name: "Primary EGP Account",
        isDefault: true,
      },
      {
        id: "wallet_usd_001",
        userId,
        type: "custodial",
        currency: "USD",
        balance: 2840.25,
        availableBalance: 2840.25,
        reservedBalance: 0,
        status: "active",
        createdAt: new Date("2024-02-20"),
        updatedAt: new Date(),
        name: "USD Savings",
        isDefault: false,
      },
      {
        id: "wallet_sar_001",
        userId,
        type: "custodial",
        currency: "SAR",
        balance: 15600.0,
        availableBalance: 15600.0,
        reservedBalance: 0,
        status: "active",
        createdAt: new Date("2024-02-25"),
        updatedAt: new Date(),
        name: "Saudi Riyal Account",
        isDefault: false,
      },
      {
        id: "wallet_pi_001",
        userId,
        type: "non_custodial",
        currency: "PI",
        balance: 1250.8,
        availableBalance: 1250.8,
        reservedBalance: 0,
        status: "active",
        createdAt: new Date("2024-03-10"),
        updatedAt: new Date(),
        name: "Pi Network Wallet",
        isDefault: false,
        publicKey: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEbC",
      },
    ]
  }

  // Initiate withdrawal with approval workflow
  static async initiateWithdrawal(
    walletId: string,
    amount: number,
    currency: Currency,
    destination: string,
    notes?: string,
  ): Promise<WalletTransaction> {
    const requiredTiers = this.getRequiredApprovalTiers(amount, currency)

    const transaction: WalletTransaction = {
      id: `txn_${Math.random().toString(36).substring(7)}`,
      walletId,
      type: "withdrawal",
      amount,
      currency,
      status: requiredTiers.length > 0 ? "pending" : "processing",
      approvals: requiredTiers.map((tier) => ({
        approverId: "",
        approverName: "",
        approverRole: "",
        tier,
        status: "pending",
        timestamp: new Date(),
      })),
      metadata: {
        reference: destination,
        notes,
      },
      createdAt: new Date(),
    }

    return transaction
  }

  // Approve transaction
  static async approveTransaction(
    transactionId: string,
    approverId: string,
    approverName: string,
    approverRole: string,
    approverTier: number,
    comments?: string,
  ): Promise<WalletTransaction> {
    // Mock approval logic
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Return updated transaction (would fetch from API)
    throw new Error("Mock implementation - would update transaction approval status")
  }

  static async getPendingWithdrawals(): Promise<WalletTransaction[]> {
    await new Promise((resolve) => setTimeout(resolve, 500))

    return [
      {
        id: "txn_pending_001",
        walletId: "wallet_egp_001",
        type: "withdrawal",
        amount: 150000,
        currency: "EGP",
        status: "pending",
        approvals: [
          {
            approverId: "ops_001",
            approverName: "Operations Team",
            approverRole: "operations",
            tier: 1,
            status: "approved",
            timestamp: new Date(Date.now() - 3600000),
          },
          {
            approverId: "",
            approverName: "",
            approverRole: "compliance_officer",
            tier: 2,
            status: "pending",
            timestamp: new Date(),
          },
        ],
        metadata: {
          reference: "Bank-NBE-***3456",
          notes: "Supplier payment",
        },
        createdAt: new Date(Date.now() - 7200000),
      },
      {
        id: "txn_pending_002",
        walletId: "wallet_usd_001",
        type: "withdrawal",
        amount: 5000,
        currency: "USD",
        status: "pending",
        approvals: [
          {
            approverId: "",
            approverName: "",
            approverRole: "operations",
            tier: 1,
            status: "pending",
            timestamp: new Date(),
          },
        ],
        metadata: {
          reference: "Bank-CIB-***7890",
          notes: "International transfer",
        },
        createdAt: new Date(Date.now() - 1800000),
      },
    ]
  }
}
