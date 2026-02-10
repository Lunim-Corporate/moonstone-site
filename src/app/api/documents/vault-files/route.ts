import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";

const TECH_SUITE_URL =
  process.env.TABB_BACKEND_URL || "http://localhost:3001";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.backendToken) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const hubId = searchParams.get("hubId") || process.env.MOONSTONE_HUB_ID || "3";
  const categoryId = searchParams.get("categoryId");

  const params = new URLSearchParams({ hubId });
  if (categoryId) params.append("categoryId", categoryId);

  const response = await fetch(
    `${TECH_SUITE_URL}/api/documents/vault-files?${params}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.backendToken}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json(
      { success: false, error: data.message || "Failed to fetch vault files" },
      { status: response.status }
    );
  }

  return NextResponse.json(data);
}
