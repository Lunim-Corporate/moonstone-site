// Prismic
import { createClient } from "@/src/prismicio"
import { PrismicRichText } from "@prismicio/react"
// Next
import type { Metadata } from "next"
import { notFound } from "next/navigation"
// Components
import Form from "./_components/form"

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
  
  return (
    <main
      style={{ backgroundImage: `url(${doc.data.main_image.url})` }}
      className="bg-top bg-cover min-h-full pt-(--padding-top) px-5 px:sm-0"
    >
      <div className="max-w-(--max-wrapper-width) mx-auto">
        <div className="max-w-lg mx-auto py-10" style={{ height: `64rem` }}>
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
          <Form slices={doc.data.slices} />
        </div>
      </div>
    </main>
  );
}
