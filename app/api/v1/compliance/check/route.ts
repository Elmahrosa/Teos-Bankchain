// Mock compliance check API endpoint (replace with actual FastAPI backend)
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const body = await request.json()
  const { transactionId, checkType } = body

  // Simulate compliance check
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const check = {
    id: `check_${Math.random().toString(36).substring(7)}`,
    transactionId,
    checkType,
    status: Math.random() > 0.8 ? "review" : "passed",
    score: Math.floor(Math.random() * 100),
    details: checkType === "aml" ? "No matches found in sanctions lists" : "KYC verification passed",
    checkedAt: new Date().toISOString(),
  }

  return NextResponse.json(check)
}
