import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const password = (body && (body.password ?? "")) || "";

    const secret = process.env.PROTECTED_ROUTE_PASSWORD ?? "";

    if (!secret) {
      return NextResponse.json({ error: "Server not configured" }, { status: 500 });
    }

    if (password === secret) {
      return NextResponse.json({ valid: true });
    }

    return NextResponse.json({ valid: false, error: "Invalid password" }, { status: 401 });
  } catch (err) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
