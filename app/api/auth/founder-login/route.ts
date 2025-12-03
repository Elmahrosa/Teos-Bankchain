import { type NextRequest, NextResponse } from "next/server"

const DEFAULT_USERNAME = "aasm1969"
const DEFAULT_PASSWORD = "Teos@Egypt2024!"

// Founder wallet address for verification
const FOUNDER_WALLET = "GDIW2DXDR3DU4CYTRHDS3WYDGHMUQZG7E5FJWWW6XSADOC5VHMYRYD6F"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    console.log("[v0] Founder login attempt:", { username, passwordLength: password?.length })

    const validUsername = process.env.FOUNDER_USERNAME || DEFAULT_USERNAME
    const validPassword = process.env.FOUNDER_PASSWORD || DEFAULT_PASSWORD

    // Verify username
    if (username !== validUsername) {
      console.log("[v0] Username mismatch")
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Verify password
    if (password !== validPassword) {
      console.log("[v0] Password mismatch")
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    console.log("[v0] Founder authentication successful")

    const founderUser = {
      id: "founder-1",
      username: validUsername,
      email: "ayman@teosegypt.com",
      role: "founder",
      walletAddress: FOUNDER_WALLET,
      permissions: ["*"], // Full access
      name: "TEOS Founder",
      verified: true,
      kycStatus: "approved",
    }

    // Generate session token (in production, use proper JWT)
    const token = Buffer.from(JSON.stringify({ ...founderUser, timestamp: Date.now() })).toString("base64")

    return NextResponse.json({
      success: true,
      token,
      user: founderUser,
      redirectUrl: "/founder-dashboard",
    })
  } catch (error) {
    console.error("[Founder Login Error]", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}
