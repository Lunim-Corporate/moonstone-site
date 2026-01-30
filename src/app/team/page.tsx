// Prismicio
import { createClient } from "@/src/prismicio"
// Slices
import { components } from "@/src/slices"
// Prismic
import { SliceZone } from "@prismicio/react"
// Next
import type { Metadata } from "next"
import { notFound } from "next/navigation"

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient()

  try {
    const doc = await client.getByUID("page", "team")
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
  const doc = await client.getByUID("page", "team")
  if (!doc) notFound()

  return (
    <main className="px-5 sm:px-0">
      <SliceZone slices={doc.data.slices} components={components} />
    </main>
  )
}
