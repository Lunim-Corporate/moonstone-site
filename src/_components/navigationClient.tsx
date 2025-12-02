"use client"
// React
import { useEffect, useState } from "react"
// Prismic
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next"
import { NavigationDocumentData, NavigationDocumentDataNavLinksItem, Simplify } from "@/prismicio-types";
// Next
import { usePathname } from "next/navigation";
import { asLink } from "@prismicio/client";

export default function NavigationClient({
  data,
}: {
  data: Simplify<NavigationDocumentData>;
}) {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navClass = `py-6 transition-colors duration-300 ${
    scrolled ? "bg-(--black-primary-color) shadow-md" : "bg-transparent"
  }`;
  
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
              {data.nav_links.map(
                (
                  link: Simplify<NavigationDocumentDataNavLinksItem>,
                  idx: number
                ) => {
                  return <PrismicNextLink key={idx} field={link.link} className={"hover:opacity-75 " + (pathname === asLink(link.link) ? "text-(--cta-color)" : "")} />;
                }
              )}
            </menu>
          </div>
        </div>
      </nav>
    </header>
  );
}
