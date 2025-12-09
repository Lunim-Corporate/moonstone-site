// Prismic
import { SliceZone } from "@prismicio/react";
import { createClient } from "../prismicio";
import { components } from "../slices";
// Next
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function Home() {
  const client = createClient()
  const doc = await client.getSingle("homepage")
  if (!doc) notFound()
  
  return (
    <main>
      <div className="fixed top-4 right-4 z-50">
        <Link 
          href="/test-card-selector" 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Test Card Selector
        </Link>
      </div>
      <SliceZone slices={doc.data.slices} components={components} />
    </main>
  )
}