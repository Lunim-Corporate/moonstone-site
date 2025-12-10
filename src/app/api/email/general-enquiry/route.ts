// Next
import { NextResponse, after } from "next/server";
import { randomUUID } from "crypto";
// Resend
import { Resend } from "resend";
// Components
import EmailTemplate from "@/src/_components/generalEnquiryEmailTemplate";
// Supabase
import { supabase } from "@/src/_lib/supabase";
// Reactr
import { jsx } from "react/jsx-runtime";
// Redis
import { rateLimit } from "@/src/_lib/redis";
// Constants
import { COOKIE } from "@/src/_lib/constants";

export async function POST(req: Request) {
    const resend = new Resend(process.env?.RESEND_API_KEY);

    try {
        // Determine client identifier for rate limiting:
        // Prefer a persistent cookie-based id (ms_client_id). Fallback to IP when cookie missing.
        const cookieHeader = req.headers.get("cookie") || "";
        const getCookie = (name: string) => {
            const match = cookieHeader.split(";").map(c => c.trim()).find(c => c.startsWith(name + "="));
            return match ? decodeURIComponent(match.split("=")[1]) : undefined;
        };

        let clientId = getCookie(COOKIE);

        const xRealIp = req.headers.get("x-real-ip");
        const forwardedFor = req.headers.get("x-forwarded-for");
        const clientIp = xRealIp || forwardedFor?.split(",")[0]?.trim();

        // If we don't have any identifier at all, generate a cookie id and set it on response.
        if (!clientId) {
            clientId = randomUUID();
        }

        // Build the rate limit key. Prefer cookie-based id, but also include IP where available.
        // This keeps limits per device/browser while allowing IP-only fallback.
        const rateLimitKey = clientId ? `cookie:${clientId}` : (clientIp ? `ip:${clientIp}` : undefined);

        if (!rateLimitKey) {
            return NextResponse.json({ error: "Unable to determine client identifier" }, { status: 400 });
        }

        const { success, pending } = await rateLimit.generalEnquiry.limit(rateLimitKey);
        // Set up analytics logging for rate limit
        if (pending) {
            after(() => pending.catch((e: Error) => console.error("ratelimit analytics error:", e)));
        }

        if (!success) {
            return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
        }

        // Create record in Supabase `general_enquiries` table
        const body = await req.json();
        const { name, email, phoneNumber, companyName, message } = body ?? {};

        const from = process.env?.NEXT_PUBLIC_RESEND_FROM_EMAIL;
        const to = process.env?.NEXT_PUBLIC_RESEND_CONTACT_RECIPIENTS;

        if (!from || !to || !resend) {
            return NextResponse.json({ error: "Missing email configuration" }, { status: 500 });
        }
        
        const record = {
            name: name ?? null,
            email: email ?? null,
            phone_number: phoneNumber ?? null,
            company_name: companyName ?? null,
            message: message ?? null,
        };

        const { error: supabaseInsertError } = await supabase
            .from("general_enquiries")
            .insert([record]);

        if (supabaseInsertError) {
            console.error("Supabase insert error:", supabaseInsertError);
            return NextResponse.json({ error: "Failed to save enquiry" }, { status: 500 });
        }

        // Send email via Resend
        const { data, error } = await resend.emails.send({
            from,
            to,
            subject: "New General Enquiry",
            react: jsx(EmailTemplate, {  name, email, phoneNumber, companyName, message }),
        });

        if (error) {
            console.error("Resend error:", error);
            return NextResponse.json({ error }, { status: 500 });
        }

        // Build response while ensuring cookie is set when we generated a new client id.
        const response = NextResponse.json(data);
        // If the incoming request didn't have the cookie, set it now for future requests.
        const incomingClientCookie = getCookie(COOKIE);
        if (!incomingClientCookie && clientId) {
            // Set a secure, httpOnly cookie for 1 year. Browser will send it on subsequent requests.
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
        console.error("send-email error:", err);
        return NextResponse.json({ err }, { status: 500 });
  }
}
