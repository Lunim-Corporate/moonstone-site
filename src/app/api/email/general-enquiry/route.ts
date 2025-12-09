// Next
import { NextResponse } from "next/server";
// Resend
import { Resend } from "resend";
// Components
import EmailTemplate from "@/src/_components/generalEnquiryEmailTemplate";
// Supabase
import { supabase } from "@/src/_lib/supabase";
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
        
        // create record in Supabase `general_enquiries` table
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

        return NextResponse.json(data);
    } catch (err) {
        console.error("send-email error:", err);
        return NextResponse.json({ err }, { status: 500 });
  }
}
