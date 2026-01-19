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
import { getUserSubscription } from "@/src/_lib/subscription"
// Components
import AuthForm from "@/src/app/deal-room/_components/auth-form"
import PitchDeckDownloads from "@/src/_components/pitch-deck-downloads"

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient()

  try {
    const doc = await client.getByUID("page", "deck")
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
  const doc = await client.getByUID("page", "deck")
  if (!doc) notFound()

  const session = await getServerSession(authOptions)

  if (!session) {
    return (
      <main
        style={{ backgroundImage: `url(${doc.data.main_image.url})` }}
        className="bg-top bg-cover min-h-screen pt-(--padding-top) px-5 px:sm-0"
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
            <AuthForm variant="deck" />
          </div>
        </div>
      </main>
    )
  }

  const subscription = await getUserSubscription(session.user?.id ?? "")

  if (!subscription.hasAccess) {
    return (
      <main
        style={{ backgroundImage: `url(${doc.data.main_image.url})` }}
        className="bg-top bg-cover min-h-screen pt-(--padding-top) px-5 px:sm-0"
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
            <PitchDeckDownloads />
          </div>
        </div>
      </main>
    )
  }

  const dealRoomDoc = await client.getByUID("page", "deal-room")
  const dealRoomHeading = dealRoomDoc?.data?.heading ?? doc.data.heading

  return (
    <div
      className="min-h-screen pt-(--padding-top)"
      style={{
        backgroundImage: `url(${doc.data.main_image.url})`,
      }}
    >
      <div className="max-w-(--max-wrapper-width) mx-auto text-center">
        <PrismicRichText
          field={dealRoomHeading}
          components={{
            heading1: ({ children }) => (
              <h1 className="text-center mb-4">{children}</h1>
            ),
          }}
        />
        <div className="mt-8 text-md">
          <p>Welcome, {session.user?.name || "User"}!</p>
        </div>
        <PitchDeckDownloads />
      </div>
    </div>
  );
}
