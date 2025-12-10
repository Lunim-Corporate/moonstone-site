// Next
import { NextResponse } from "next/server";
// Crypto
import { randomUUID } from "crypto";
// Redis
import { rateLimit } from "@/src/_lib/redis";
// Constants
import { COOKIE } from "@/src/_lib/constants";

export async function POST(req: Request) {
  try {
    // Determine client identifier for rate limiting (cookie preferred, fallback to IP)
    const cookieHeader = req.headers.get("cookie") || "";
    const getCookie = (name: string) => {
      const match = cookieHeader.split(";").map(c => c.trim()).find(c => c.startsWith(name + "="));
      return match ? decodeURIComponent(match.split("=")[1]) : undefined;
    };

    let clientId = getCookie(COOKIE);

    const xRealIp = req.headers.get("x-real-ip");
    const forwardedFor = req.headers.get("x-forwarded-for");
    const clientIp = xRealIp || forwardedFor?.split(",")[0]?.trim();

    if (!clientId) {
      clientId = randomUUID();
    }

    const rateLimitKey = clientId ? `cookie:${clientId}` : (clientIp ? `ip:${clientIp}` : undefined);
    if (!rateLimitKey) {
      return NextResponse.json({ error: "Unable to determine client identifier" }, { status: 400 });
    }

    const rl = await rateLimit.checkPassword.limit(rateLimitKey);
    if (!rl.success) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const body = await req.json();
    const password = (body && (body.password ?? "")) || "";

    const secret = process.env.PROTECTED_ROUTE_PASSWORD ?? "";

    // Prepare incoming cookie check so we can set the cookie on responses when needed
    const incomingClientCookie = getCookie(COOKIE);

    if (!secret) {
      const response = NextResponse.json({ error: "Server not configured" }, { status: 500 });
      if (!incomingClientCookie && clientId) {
        response.cookies.set({
          name: COOKIE,
          value: clientId,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 365,
        });
      }
      return response;
    }

    const link = process.env.PROTECTED_ROUTE_LINK ?? "";
    if (password === secret) {
      const response = NextResponse.json({ valid: true, link }, { status: 200 });
      if (!incomingClientCookie && clientId) {
        response.cookies.set({
          name: COOKIE,
          value: clientId,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 365,
        });
      }
      return response;
    }

    const response = NextResponse.json({ valid: false }, { status: 200 });
    if (!incomingClientCookie && clientId) {
      response.cookies.set({
        name: COOKIE,
        value: clientId,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
      });
    }
    return response;
  } catch (err) {
    console.error("check-password error:", err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
