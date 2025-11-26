// Next
import { notFound } from "next/navigation"
// Prismic
import { createClient } from "../prismicio"
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next"

export default async function Navigation() {
    const client = createClient()
    const doc = await client.getSingle("navigation")
    if (!doc) notFound()
    
  return (
    <header>
        <nav aria-label="primary" className="mb-10 py-6 bg bg-[#201e1e]">
            <div className="flex justify-between items-center px-10">
                <div>
                    <PrismicNextLink field={doc.data.home}>
                        <PrismicNextImage field={doc.data.logo} className="w-30" />
                    </PrismicNextLink>
                </div>
                <div>
                    <menu className="flex gap-8">
                        {doc.data.nav_links.map((link, idx) => {
                            return <PrismicNextLink key={idx} field={link.link} />
                        })}
                    </menu>
                </div>
            </div>
        </nav>
    </header>
  )
}
