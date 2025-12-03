export interface FXRate {
  from: string
  to: string
  rate: number
  inverseRate: number
  lastUpdated: Date
  source: string
}

export interface FXQuote {
  from: string
  to: string
  amount: number
  convertedAmount: number
  rate: number
  fees: number
  totalAmount: number
  expiresAt: Date
}

export class FXService {
  private static MOCK_RATES: Record<string, number> = {
    "EGP/USD": 0.0324,
    "USD/EGP": 30.9,
    "EGP/SAR": 0.1215,
    "SAR/EGP": 8.23,
    "USD/SAR": 3.75,
    "SAR/USD": 0.2667,
    "PI/USD": 50,
    "USD/PI": 0.02,
    "PI/EGP": 1545,
    "EGP/PI": 0.000647,
  }

  // Fetch latest FX rates (mock implementation - would call real API)
  static async getRates(): Promise<FXRate[]> {
    await new Promise((resolve) => setTimeout(resolve, 300))

    const rates: FXRate[] = []
    for (const [pair, rate] of Object.entries(this.MOCK_RATES)) {
      const [from, to] = pair.split("/")
      rates.push({
        from,
        to,
        rate,
        inverseRate: 1 / rate,
        lastUpdated: new Date(),
        source: "Central Bank of Egypt / Pi Network Oracle",
      })
    }

    return rates
  }

  // Get specific rate
  static async getRate(from: string, to: string): Promise<number> {
    const key = `${from}/${to}`
    return this.MOCK_RATES[key] || 1
  }

  // Get FX quote for conversion
  static async getQuote(from: string, to: string, amount: number): Promise<FXQuote> {
    await new Promise((resolve) => setTimeout(resolve, 300))

    const rate = await this.getRate(from, to)
    const convertedAmount = amount * rate
    const fees = convertedAmount * 0.002 // 0.2% fee
    const totalAmount = convertedAmount - fees

    return {
      from,
      to,
      amount,
      convertedAmount,
      rate,
      fees,
      totalAmount,
      expiresAt: new Date(Date.now() + 30000), // 30 seconds validity
    }
  }

  // Execute FX conversion
  static async convert(
    fromWalletId: string,
    toWalletId: string,
    amount: number,
    quoteId: string,
  ): Promise<{ transactionId: string }> {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      transactionId: `fx_${Math.random().toString(36).substring(7)}`,
    }
  }
}
