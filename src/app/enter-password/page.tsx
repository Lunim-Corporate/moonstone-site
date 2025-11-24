// Components
import Form from "./_components/Form";
// Constants
import { COOKIE_NAME, COOKIE_SECRET } from "@/src/_constants/app";
// Lib
import safeRedirectPath from "@/src/_lib/safeRedirectPath";
import verifyToken from "@/src/_lib/verifyToken";
// Next
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page({ searchParams }: { searchParams?: Promise<{ from?: string }> }) {
  const params = searchParams ? await searchParams : {};
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (verifyToken(token, COOKIE_SECRET)) {
    const dest = safeRedirectPath(params?.from) || '/protected';
    redirect(dest);
  }
  // Not authenticated — show the password form
  return (
      <main className="min-h-full flex flex-col items-center justify-center">
        <Form />
    </main>
  );
}