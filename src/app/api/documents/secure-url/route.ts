import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";

const TECH_SUITE_URL =
  process.env.NEXT_PUBLIC_TECH_SUITE_URL || "http://localhost:3001";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.backendToken) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = (await request.json()) as {
    fileId?: string;
    category?: string;
  };

  const response = await fetch(`${TECH_SUITE_URL}/api/documents/secure-url`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.backendToken}`,
    },
    body: JSON.stringify({
      fileId: body.fileId,
      category: body.category,
      hubId: process.env.MOONSTONE_HUB_ID || "3",
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json(
      { success: false, error: data.message || "Failed to get secure URL" },
      { status: response.status }
    );
  }

  return NextResponse.json(data);
}
