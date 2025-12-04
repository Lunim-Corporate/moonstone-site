// Prismic
import { createClient } from "@/src/prismicio"
import { PrismicRichText } from "@prismicio/react"
// Next
import { notFound } from "next/navigation"
// Components
import Form from "./_components/form"

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
          <Form slices={doc.data.slices} />
        </div>
      </div>
    </main>
  );
}