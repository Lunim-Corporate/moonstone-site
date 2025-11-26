// Prismicio
import { createClient } from "@/src/prismicio"
// Slices
import { components } from "@/src/slices"
// Prismic
import { SliceZone } from "@prismicio/react"
// Next
import { notFound } from "next/navigation"

export default async function Page() {
  const client = createClient()
  const doc = await client.getByUID("page", "team")
  if (!doc) notFound()

  return (
    <main>
      <SliceZone slices={doc.data.slices} components={components} />
    </main>
  )
}
