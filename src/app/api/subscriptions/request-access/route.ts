import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "../../auth/[...nextauth]/route"
import { prisma } from "@/src/_lib/prisma"

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

    // Check if user already has active non-iron subscription
    const currentSubscription = await prisma.subscriptions.findFirst({
      where: {
        user_id: userId,
        hub_id: BigInt(hub_id),
        current: true,
      },
      include: {
        price_plans: true,
      },
    })

    if (currentSubscription && currentSubscription.price_plans?.code !== 'iron') {
      return NextResponse.json(
        { message: "You already have Deal Room access" },
        { status: 400 }
      )
    }

    // Check if there's already a pending request
    const pendingRequest = await prisma.subscriptions.findFirst({
      where: {
        user_id: userId,
        hub_id: BigInt(hub_id),
        state: 'requested',
        price_plan_id: 15, // Gold plan ID
      },
    })

    if (pendingRequest) {
      return NextResponse.json(
        { message: "Access request already pending" },
        { status: 400 }
      )
    }

    // Create new subscription request
    const subscription = await prisma.subscriptions.create({
      data: {
        user_id: userId,
        price_plan_id: 15, // Gold plan ID
        hub_id: BigInt(hub_id),
        state: 'requested',
        current: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
    })

    // Send email notification to admins
    try {
      const user = await prisma.users.findUnique({
        where: { id: userId },
        include: {
          emails: {
            where: { primary: true },
            take: 1,
          },
        },
      })

      const userName = user?.friendly_name || user?.name || 'User'
      const userEmail = user?.emails[0]?.email || ''

      // Get all hub admins
      const adminEmails = await prisma.$queryRaw<{ email: string }[]>`
        SELECT DISTINCT e.email
        FROM emails e
        JOIN users u ON u.id = e.user_id
        JOIN profiles p ON p.profileable_id = u.id AND p.profileable_type = 'User'
        JOIN members m ON m.target_id = p.id AND m.target_type = 'Profile'
        WHERE m.hub_id = ${BigInt(hub_id)}
          AND m.admin >= 1
          AND e.primary = true
          AND e.confirmed_at IS NOT NULL
      `

      if (adminEmails.length > 0 && userEmail) {
        // Call backend email service
        const TECH_SUITE_URL = process.env.TABB_BACKEND_URL || "http://localhost:3001"
        await fetch(`${TECH_SUITE_URL}/api/notifications/access-request`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            adminEmails: adminEmails.map(a => a.email),
            userName,
            userEmail,
            hubName: "Moonstone",
          }),
        }).catch(err => {
          console.error("Failed to send admin notification:", err)
          // Don't fail the request if email fails
        })
      }
    } catch (emailError) {
      console.error("Error sending notification email:", emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      message: "Access request submitted successfully",
      subscription_id: Number(subscription.id),
      state: "requested",
    })
  } catch (error: any) {
    console.error("Error requesting access:", error)
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}
