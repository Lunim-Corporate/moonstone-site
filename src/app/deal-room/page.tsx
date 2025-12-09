// Prismic
import { createClient } from "@/src/prismicio"
import { PrismicRichText } from "@prismicio/react"
// Next
import { notFound } from "next/navigation"

export default async function Page() {
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
      </div>
    </div>
  );
}
