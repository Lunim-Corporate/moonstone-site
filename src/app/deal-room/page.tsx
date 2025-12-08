// Prismic
import { createClient } from "@/src/prismicio"
import { PrismicRichText } from "@prismicio/react"
// Next
import { notFound, redirect } from "next/navigation"
// Auth
import { getServerSession } from "next-auth"
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route"

export default async function Page() {
  // Check authentication
  const session = await getServerSession(authOptions);

  if (!session) {
    // Redirect to sign-in with callback URL
    redirect("/sign-in?callbackUrl=/deal-room");
  }

  const client = createClient()
  const doc = await client.getByUID("page", "deal-room")
  if (!doc) notFound()

  return (
    <div
      className="min-h-screen pt-(--padding-top)"
      style={{
        backgroundImage: `url(${doc.data.main_image.url})`,
      }}
    >
      <div className="max-w-(--max-wrapper-width) mx-auto text-center">
        <PrismicRichText field={doc.data.heading} />
        <div className="mt-8 text-sm">
          <p>Welcome, {session.user?.name || "User"}!</p>
        </div>
      </div>
    </div>
  );
}
