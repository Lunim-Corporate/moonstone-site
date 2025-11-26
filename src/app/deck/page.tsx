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
    <main className="max-w-4xl mx-auto">
      <div>
        <PrismicRichText field={doc.data.heading} components={{
          heading1: ({children}) => <h1 className="text-center mb-4">{children}</h1>
        }} />
      </div>
      <Form slices={doc.data.slices} />
    </main>
  )
}
