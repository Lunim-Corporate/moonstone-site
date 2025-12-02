// Next
import { notFound } from "next/navigation";
// Prismic
import { createClient } from "../prismicio"

export default async function Footer() {
  const client = createClient()
  const doc = await client.getSingle("footer")
  if (!doc) return notFound();

  return (
    <footer className="bg-(--black-primary-color) px-10 py-6">
      <div>
        &copy; {new Date().getFullYear()} {doc.data.company_name}. All rights reserved.
      </div>
    </footer>
  )
}
