import { AuthService } from "./auth"

export class PaymentGuard {
  static canProcessPayment(userId?: string): { allowed: boolean; reason?: string } {
    const user = AuthService.getUser()

    if (!user) {
      return {
        allowed: false,
        reason: "User must be authenticated to process payments.",
      }
    }

    // if (!user.kycVerified) {
    //   return {
    //     allowed: false,
    //     reason: "KYC verification required to process payments.",
    //   }
    // }

    return { allowed: true }
  }

  static validateWithdrawal(amount: number, userId: string): { valid: boolean; error?: string } {
    const paymentCheck = this.canProcessPayment(userId)
    if (!paymentCheck.allowed) {
      return { valid: false, error: paymentCheck.reason }
    }

    if (amount <= 0) {
      return { valid: false, error: "Withdrawal amount must be greater than zero" }
    }

    const user = AuthService.getUser()
    if (user) {
      const limits = AuthService.getTransactionLimits(user.role)
      if (amount > limits.single) {
        return { valid: false, error: `Withdrawal exceeds single transaction limit of ${limits.single}` }
      }
    }

    return { valid: true }
  }

  static validateDeposit(amount: number, userId: string): { valid: boolean; error?: string } {
    const paymentCheck = this.canProcessPayment(userId)
    if (!paymentCheck.allowed) {
      return { valid: false, error: paymentCheck.reason }
    }

    if (amount <= 0) {
      return { valid: false, error: "Deposit amount must be greater than zero" }
    }

    return { valid: true }
  }

  static validateTransfer(amount: number, fromUserId: string, toUserId: string): { valid: boolean; error?: string } {
    const paymentCheck = this.canProcessPayment(fromUserId)
    if (!paymentCheck.allowed) {
      return { valid: false, error: paymentCheck.reason }
    }

    if (amount <= 0) {
      return { valid: false, error: "Transfer amount must be greater than zero" }
    }

    if (fromUserId === toUserId) {
      return { valid: false, error: "Cannot transfer to yourself" }
    }

    const user = AuthService.getUser()
    if (user) {
      const limits = AuthService.getTransactionLimits(user.role)
      if (amount > limits.single) {
        return { valid: false, error: `Transfer exceeds single transaction limit of ${limits.single}` }
      }
    }

    return { valid: true }
  }
}
