import { AccessRequestEmail } from "@/src/emails/AccessRequestEmail";
import { Resend } from "resend";
import { NextResponse } from "next/server";

interface AccessRequestPayload {
  fullName: string;
  email: string;
  nickName: string;
  accessReason: string;
}

const normalizeRecipients = (value?: string | null) =>
  value
    ? value
        .split(",")
        .map((email) => email.trim())
        .filter(Boolean)
    : [];

export async function POST(request: Request) {
  const body = (await request.json()) as AccessRequestPayload;

  if (!body.fullName || !body.email || !body.accessReason) {
    return NextResponse.json(
      { success: false, message: "Missing required fields." },
      { status: 400 }
    );
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.NEXT_PUBLIC_RESEND_FROM_EMAIL;
  const toRecipients = normalizeRecipients(process.env.NEXT_PUBLIC_RESEND_CONTACT_RECIPIENTS);

  if (!resendApiKey) {
    console.error("RESEND_API_KEY is not configured");
    return NextResponse.json(
      { success: false, message: "Email service not configured." },
      { status: 500 }
    );
  }

  if (!fromEmail) {
    console.error("NEXT_PUBLIC_RESEND_FROM_EMAIL is not configured");
    return NextResponse.json(
      { success: false, message: "Email service not configured." },
      { status: 500 }
    );
  }

  if (!toRecipients.length) {
    console.error("NEXT_PUBLIC_RESEND_CONTACT_RECIPIENTS is not configured");
    return NextResponse.json(
      { success: false, message: "Email recipients not configured." },
      { status: 500 }
    );
  }

  const resend = new Resend(resendApiKey);

  try {
    const submittedAt = new Date().toISOString();
    const summaryText = [
      `New Deal Room Access Request`,
      `Name: ${body.fullName}`,
      `Nickname: ${body.nickName}`,
      `Email: ${body.email}`,
      `Reason: ${body.accessReason}`,
    ]
      .filter(Boolean)
      .join("\n");

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: toRecipients,
      replyTo: body.email,
      subject: `Deal Room Access Request: ${body.fullName}`,
      react: AccessRequestEmail({
        fullName: body.fullName,
        email: body.email,
        nickName: body.nickName,
        accessReason: body.accessReason,
        submittedAt,
      }),
      text: summaryText,
    });

    if (error) {
      console.error("Failed to send email:", error);
      return NextResponse.json(
        { success: false, message: "Failed to send email.", error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        messageId: data?.id ?? null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending access request email:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unable to send email.",
      },
      { status: 500 }
    );
  }
}
