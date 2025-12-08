// Next
import { NextResponse } from "next/server";
// Resend
import { Resend } from "resend";
// Components
import EmailTemplate from "@/src/_components/passwordAccessEmailTemplate";
// Reactr
import { jsx } from "react/jsx-runtime";

export async function POST(req: Request) {
    const resend = new Resend(process.env?.RESEND_API_KEY);

    try {
        const body = await req.json();
        const { name, email, phoneNumber, companyName, message } = body ?? {};

        const from = process.env?.NEXT_PUBLIC_RESEND_FROM_EMAIL;
        const to = process.env?.NEXT_PUBLIC_RESEND_CONTACT_RECIPIENTS;

        if (!from || !to || !resend) {
            return NextResponse.json({ error: "Missing email configuration" }, { status: 500 });
        }
        
        await resend.emails.send({
            from,
            to,
            subject: "New Request - Password Access",
            react: jsx(EmailTemplate, { name: name, email: email, phoneNumber: phoneNumber, companyName: companyName, message: message }),
        });

        return NextResponse.json({ ok: true });
  } catch (err) {
        console.error("send-email error:", err);
        return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
