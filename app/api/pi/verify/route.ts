import { type NextRequest, NextResponse } from "next/server"

const PI_API_KEY = process.env.PI_API_KEY || ""
const PI_API_URL = "https://api.minepi.com"

export async function POST(request: NextRequest) {
  try {
    const { accessToken } = await request.json()

    if (!accessToken) {
      return NextResponse.json({ error: "Access token required" }, { status: 400 })
    }

    // Verify the access token with Pi Network API
    const response = await fetch(`${PI_API_URL}/v2/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      return NextResponse.json({ error: "Invalid access token" }, { status: 401 })
    }

    const userData = await response.json()

    return NextResponse.json({
      success: true,
      user: {
        uid: userData.uid,
        username: userData.username,
      },
    })
  } catch (error) {
    console.error("Pi verification error:", error)
    return NextResponse.json({ error: "Verification failed" }, { status: 500 })
  }
}
