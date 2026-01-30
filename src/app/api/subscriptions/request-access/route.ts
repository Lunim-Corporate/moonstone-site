import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "../../auth/[...nextauth]/route"

const TECH_SUITE_URL = process.env.TABB_BACKEND_URL || "http://localhost:3001"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { hub_id } = body

    if (!hub_id) {
      return NextResponse.json(
        { message: "hub_id is required" },
        { status: 400 }
      )
    }

    const userId = parseInt(session.user.id)

    // Call tech-suite internal API endpoint (no auth required for server-to-server)
    // We'll use the upgrade endpoint temporarily or create a new internal endpoint
    const response = await fetch(`${TECH_SUITE_URL}/api/subscriptions/internal/request-access`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        hub_id,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || "Failed to request access" },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Error requesting access:", error)
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}
