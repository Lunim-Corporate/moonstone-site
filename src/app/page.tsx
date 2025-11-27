// Prismic
import { SliceZone } from "@prismicio/react";
import { createClient } from "../prismicio";
import { components } from "../slices";
// Next
import { notFound } from "next/navigation";

export default async function Home() {
  const client = createClient()
  const doc = await client.getSingle("homepage")
  if (!doc) notFound()
  
  return (
    <main>
      <SliceZone slices={doc.data.slices} components={components} />
    </main>
  )
}
