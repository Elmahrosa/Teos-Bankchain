// Mock health check endpoint (replace with actual FastAPI backend)
import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    service: "teos-bankchain",
    version: "1.0.0",
  })
}
