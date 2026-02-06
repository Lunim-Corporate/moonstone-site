import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";

const TECH_SUITE_URL =
  process.env.NEXT_PUBLIC_TECH_SUITE_URL || "http://localhost:3001";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.backendToken) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  if (!category) {
    return NextResponse.json(
      { success: false, error: "category is required" },
      { status: 400 }
    );
  }

  const response = await fetch(
    `${TECH_SUITE_URL}/api/documents/available-files?category=${category}&hubId=${process.env.MOONSTONE_HUB_ID || "3"}`,
    {
      headers: {
        Authorization: `Bearer ${session.backendToken}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json(
      { success: false, error: data.message || "Failed to get available files" },
      { status: response.status }
    );
  }

  return NextResponse.json(data);
}
