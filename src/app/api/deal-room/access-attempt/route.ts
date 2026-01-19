import { DealRoomAccessAttemptEmail } from "@/src/emails/DealRoomAccessAttemptEmail";
import { Resend } from "resend";
import { NextResponse } from "next/server";

interface DealRoomAccessAttemptPayload {
  fullName?: string;
  email?: string;
  nickName?: string;
  currentTier?: string | null;
}

const normalizeRecipients = (value?: string | null) =>
  value
    ? value
        .split(",")
        .map((email) => email.trim())
        .filter(Boolean)
    : [];

export async function POST(request: Request) {
  const body = (await request.json()) as DealRoomAccessAttemptPayload;

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
      `Deal Room Access Attempt`,
      body.fullName ? `Name: ${body.fullName}` : null,
      body.nickName ? `Nickname: ${body.nickName}` : null,
      body.email ? `Email: ${body.email}` : null,
      `Current tier: ${body.currentTier ?? "Unknown"}`,
    ]
      .filter(Boolean)
      .join("\n");

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: toRecipients,
      replyTo: body.email,
      subject: `Deal Room Access Attempt${body.fullName ? `: ${body.fullName}` : ""}`,
      react: DealRoomAccessAttemptEmail({
        fullName: body.fullName,
        email: body.email,
        nickName: body.nickName,
        currentTier: body.currentTier,
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
    console.error("Error sending access attempt email:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unable to send email.",
      },
      { status: 500 }
    );
  }
}
