// Prismic
import { createClient } from "@/src/prismicio"
import { PrismicRichText } from "@prismicio/react"
// Next
import type { Metadata } from "next"
import { notFound } from "next/navigation"
// Auth
import { getServerSession } from "next-auth"
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route"
// Subscription
import { getUserSubscription, sendAccessAttemptNotification } from "@/src/_lib/subscription"
// Components
import AuthForm from "./_components/auth-form"
import DealRoomContent from "@/src/_components/deal-room-content"

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient()

  try {
    const doc = await client.getByUID("page", "deal-room")
    if (!doc) return {}

    return {
      title: doc.data.meta_title || "Moonstone",
      description: doc.data.meta_description || undefined,
      openGraph: {
        title: doc.data.meta_title || "Moonstone",
        description: doc.data.meta_description || undefined,
        images: doc.data.meta_image?.url
          ? [{ url: doc.data.meta_image.url }]
          : [],
      },
    }
  } catch {
    return {}
  }
}

export default async function Page() {
  const client = createClient()
  const doc = await client.getByUID("page", "deal-room")
  if (!doc) notFound()

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
            <AuthForm variant="deal-room" />
          </div>
        </div>
      </main>
    );
  }

  // Check subscription access
  const subscription = await getUserSubscription(session.user?.id ?? "");

  // Notify on access attempt for non-premium users
  if (!subscription.hasAccess && session.user?.id) {
    await sendAccessAttemptNotification(session.user.id);
  }

  // Authenticated users see the two-column deal room layout
  // Categories they don't have access to are shown greyed out
  return (
    <main className="min-h-screen pt-(--padding-top) px-5 sm:px-0">
      <div className="max-w-(--max-wrapper-width) mx-auto">
        <div className="text-center mb-6">
          <PrismicRichText field={doc.data.heading} />
          <p className="mt-4 text-md">
            Welcome, {session.user?.name || "User"}!
          </p>
        </div>
        <DealRoomContent
          hasAccess={subscription.hasAccess}
          hasRequestedAccess={subscription.hasRequestedAccess}
        />
      </div>
    </main>
  );
}
