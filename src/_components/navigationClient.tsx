"use client"
// React
import { useEffect, useState } from "react"
// Prismic
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next"

export default function NavigationClient({ data }: { data: any }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const navClass = `py-6 transition-colors duration-300 ${
    scrolled ? "bg-[#201e1e] shadow-md" : "bg-transparent"
  }`

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav aria-label="primary" className={navClass}>
        <div className="flex justify-between items-center px-10">
          <div>
            <PrismicNextLink field={data.home}>
              <PrismicNextImage field={data.logo} className="w-30" />
            </PrismicNextLink>
          </div>
          <div>
            <menu className="flex gap-8">
              {data.nav_links.map((link: any, idx: number) => {
                return <PrismicNextLink key={idx} field={link.link} />
              })}
            </menu>
          </div>
        </div>
      </nav>
    </header>
  )
}
