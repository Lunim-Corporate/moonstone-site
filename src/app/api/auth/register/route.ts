import { NextResponse } from "next/server";

const TABB_BACKEND_URL = process.env.TABB_BACKEND_URL || "http://localhost:3001";
const MOONSTONE_HUB_ID = parseInt(process.env.MOONSTONE_HUB_ID || "3", 10);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name, friendly_name, source } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Validate source parameter
    if (source && !['deck', 'deal-room'].includes(source)) {
      return NextResponse.json(
        { error: "Invalid source parameter" },
        { status: 400 }
      );
    }

    // Call tech-suite register API
    const response = await fetch(`${TABB_BACKEND_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        name,
        friendly_name,
        hub_id: MOONSTONE_HUB_ID,
        source: source || 'deck', // Default to 'deck' if not specified
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Map backend error responses to appropriate status codes
      const statusCode = response.status;
      const errorMessage = data.message || data.error || "Registration failed";

      return NextResponse.json(
        { error: errorMessage },
        { status: statusCode }
      );
    }

    // Return success response with requiresConfirmation flag
    return NextResponse.json(
      {
        message: data.message || "Account created successfully. Please check your email to confirm your account.",
        user: {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          friendlyName: data.user.friendlyName,
          admin: data.user.admin,
        },
        profile: {
          id: data.profile.id,
          slug: data.profile.slug,
          name: data.profile.name,
          visibility: data.profile.visibility,
        },
        hub_id: MOONSTONE_HUB_ID,
        source: data.source,
        requiresConfirmation: data.requiresConfirmation || true,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Registration failed" },
      { status: 500 }
    );
  }
}
