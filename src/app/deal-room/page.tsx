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
            <AuthForm />
          </div>
        </div>
      </main>
    );
  }

  // Check subscription access
  const subscription = await getUserSubscription(session.user?.id ?? "");

  if (!subscription.hasAccess) {
    // Sign out the user and show the auth form with a message
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
            <AuthForm
              defaultToCreateAccount={true}
              message="You need a Bronze or Silver tier subscription to access the Deal Room. Please create an account to request access."
            />
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
