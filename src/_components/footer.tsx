// Next
import { notFound } from "next/navigation";
// Prismic
import { createClient } from "../prismicio"

export default async function Footer() {

  const client = createClient()
  const doc = await client.getSingle("footer")
  if (!doc) return notFound();

  return (
    <footer className="bg-[#201e1e] py-8 px-10 mt-8">
      <div>
        &copy; {new Date().getFullYear()} {doc.data.company_name}. All rights reserved.
      </div>
    </footer>
  )
}
