// Next
import { notFound } from "next/navigation"
// Prismic
import { createClient } from "../prismicio"
import NavigationClient from "./navigationClient"

export default async function Navigation() {
  const client = createClient()
  const doc = await client.getSingle("navigation")
  if (!doc) notFound()

  return <NavigationClient data={doc.data} />
}
