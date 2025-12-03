// Mock ledger API endpoint (replace with actual FastAPI backend)
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const accountId = searchParams.get("accountId")

  // Mock ledger entries
  const entries = [
    {
      id: "ledger_001",
      transactionId: "tx_001",
      accountId: accountId || "acc_001",
      amount: 50000,
      currency: "EGP",
      type: "credit",
      balance: 150000,
      timestamp: new Date().toISOString(),
      metadata: { source: "deposit" },
    },
    {
      id: "ledger_002",
      transactionId: "tx_002",
      accountId: accountId || "acc_001",
      amount: 25000,
      currency: "EGP",
      type: "debit",
      balance: 125000,
      timestamp: new Date().toISOString(),
      metadata: { destination: "withdrawal" },
    },
  ]

  return NextResponse.json(entries)
}

export async function POST(request: Request) {
  const body = await request.json()

  // Mock create ledger entry
  const entry = {
    id: `ledger_${Math.random().toString(36).substring(7)}`,
    ...body,
    timestamp: new Date().toISOString(),
  }

  return NextResponse.json(entry)
}
