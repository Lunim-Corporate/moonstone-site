// Prismic
import { createClient } from "@/src/prismicio"
import { PrismicRichText } from "@prismicio/react"
// Next
import { notFound } from "next/navigation"
// Auth
import { getServerSession } from "next-auth"
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route"
// Subscription
import { getUserSubscription } from "@/src/_lib/subscription"
// Components
import AuthForm from "./_components/auth-form"
import LogoutAndRedirect from "./_components/logout-and-redirect"

export default async function Page() {
  const client = createClient()
  const doc = await client.getByUID("page", "deal-room")
  if (!doc) notFound()

  // Get allowed tiers from environment variable
  const allowedTiers = (process.env.DEAL_ROOM_ALLOWED_TIERS || "bronze,silver")
    .split(",")
    .map(tier => tier.trim().toLowerCase());

  // Format allowed tiers for display
  const allowedTiersDisplay = allowedTiers
    .map(tier => tier.charAt(0).toUpperCase() + tier.slice(1))
    .join(", ");

  // Check authentication
  const session = await getServerSession(authOptions);

  // If not authenticated, show auth form
  if (!session) {
    return (
      <main
        style={{ backgroundImage: `url(${doc.data.main_image.url})` }}
        className="bg-top bg-cover bg-fixed min-h-screen pt-(--padding-top) px-5 px:sm-0"
      >
        <div className="max-w-(--max-wrapper-width) mx-auto">
          <div className="max-w-lg mx-auto py-10">
            <div>
              <PrismicRichText
                field={doc.data.heading}
                components={{
                  heading1: ({ children }) => (
                    <h1 className="text-center mb-4">{children}</h1>
                  ),
                }}
              />
            </div>
            <AuthForm />
          </div>
        </div>
      </main>
    );
  }

  // Check subscription access
  const subscription = await getUserSubscription(session.user?.id ?? "");

  if (!subscription.hasAccess) {
    // Log out the user and redirect back to this page (which will show the auth form)
    return (
      <main
        style={{ backgroundImage: `url(${doc.data.main_image.url})` }}
        className="bg-top bg-cover bg-fixed min-h-screen pt-(--padding-top) px-5 px:sm-0"
      >
        <div className="max-w-(--max-wrapper-width) mx-auto">
          <div className="max-w-lg mx-auto py-10">
            <div>
              <PrismicRichText
                field={doc.data.heading}
                components={{
                  heading1: ({ children }) => (
                    <h1 className="text-center mb-4">{children}</h1>
                  ),
                }}
              />
            </div>
            <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded text-center">
              <p className="text-sm font-medium mb-2">You need a {allowedTiersDisplay} tier subscription to access the Deal Room.</p>
              <p className="text-xs">Your current tier: {subscription.tier ? subscription.tier.charAt(0).toUpperCase() + subscription.tier.slice(1) : 'None'}</p>
            </div>
            <LogoutAndRedirect />
          </div>
        </div>
      </main>
    );
  }

  // User is authenticated and has access
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
