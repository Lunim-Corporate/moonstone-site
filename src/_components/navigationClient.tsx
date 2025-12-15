"use client"
// React
import { useEffect, useRef, useState } from "react"
// Prismic
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next"
import { NavigationDocumentData, NavigationDocumentDataNavLinksItem, Simplify } from "@/prismicio-types";
import { asLink } from "@prismicio/client";
// Next
import { usePathname } from "next/navigation";

export default function NavigationClient({
  data,
}: {
  data: Simplify<NavigationDocumentData>;
}) {
  const [scrolled, setScrolled] = useState(false); // whether the page has been scrolled down
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false); // mobile menu state (open or closed)
  const [windowInnerWidthGreaterThanMd, setWindowInnerWidthGreaterThanMd] = useState(() =>
    typeof window === "undefined" ? true : window.innerWidth > 768
  );
  const mobileMenuRef = useRef<HTMLElement | null>(null);
  const headerHasBg = scrolled || (isOpen && !windowInnerWidthGreaterThanMd);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsOpen(false);
  }, [pathname]);

  // Close mobile menu on resize if width > 768px
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768) {
        setWindowInnerWidthGreaterThanMd(true);
        setIsOpen(false);
      } else {
        setWindowInnerWidthGreaterThanMd(false);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Close mobile menu on Escape key press (Accessibility)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    // Wait until the menu is rendered/visible 
    const id = window.setTimeout(() => {
      // Get first link in mobile menu and focus it (Accessibility)
      const firstFocusable = mobileMenuRef.current?.querySelector<HTMLElement>(
        'a'
      );
      firstFocusable?.focus();
    }, 0);
    return () => window.clearTimeout(id);
  }, [isOpen]);

  return (
    <header
      className={`py-6 transition-colors duration-300 fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-10 ${headerHasBg ? "bg-(--black-primary-color) shadow-md" : "bg-transparent"} flex-wrap`}
    >
      {/* Logo */}
      <div>
        <PrismicNextLink field={data.home}>
          <PrismicNextImage field={data.logo} className="w-12 max-w-[72px]" />
        </PrismicNextLink>
      </div>
      {/* Links */}
      <nav
        ref={mobileMenuRef}
        aria-label="primary"
        className={
          "hidden md:flex order-2 md:order-1 basis-full md:basis-auto mt-10 md:mt-0 " +
          (isOpen && !windowInnerWidthGreaterThanMd ? "flex!" : "")
        }
      >
        <menu className={"flex gap-8 mx-auto " + (isOpen ? "flex-col w-full" : "")}>
          {data.nav_links.map(
            (
              link: Simplify<NavigationDocumentDataNavLinksItem>,
              idx: number
            ) => {
              return (
                <PrismicNextLink
                  key={idx}
                  field={link.link}
                  className={
                    "hover:opacity-75 text-center p-2 " +
                    (pathname === asLink(link.link) ? "text-(--cta-color)" : "")
                  }
                />
              );
            }
          )}
        </menu>
      </nav>
      {/* Hamburger */}
      <div className="md:hidden">
        <button
          aria-expanded={isOpen}
          onClick={() => setIsOpen((v) => !v)}
          className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-(--cta-color) cursor-pointer"
          title={isOpen ? "Close menu" : "Open menu"}
        >
          <svg
            className="w-6 h-6"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            {/* Top line */}
            <path
              d="M4 7h16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                transformOrigin: 'center',
                transform: isOpen ? 'translateY(5px) rotate(45deg)' : 'none',
                transition: 'transform 250ms ease, opacity 250ms ease'
              }}
            />
            {/* Middle line */}
            <path
              d="M4 12h16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                opacity: isOpen ? 0 : 1,
                transformOrigin: 'center',
                transform: isOpen ? 'scaleX(0.5)' : 'none',
                transition: 'transform 200ms ease, opacity 200ms ease'
              }}
            />
            {/* Bottom line */}
            <path
              d="M4 17h16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                transformOrigin: 'center',
                transform: isOpen ? 'translateY(-5px) rotate(-45deg)' : 'none',
                transition: 'transform 250ms ease, opacity 250ms ease'
              }}
            />
          </svg>
        </button>
      </div>
    </header>
  );
}
