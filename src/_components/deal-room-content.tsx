"use client";

import { useEffect, useRef, useState } from "react";
import RequestAccessButton from "./request-access-button";

interface VaultDocument {
  id: number;
  name: string;
  extension: string;
  url?: string;
  expiresAt?: string;
}

interface VaultCategory {
  id: number;
  label: string;
  position: number;
  accessible: boolean;
  requiredTier: string | null;
  documents: VaultDocument[];
}

interface VaultFilesResponse {
  success: boolean;
  data: {
    userTier: string | null;
    categories: VaultCategory[];
  };
}

// File extension to icon mapping
function getFileIcon(ext: string): string {
  const lower = ext.toLowerCase();
  const iconMap: Record<string, string> = {
    pdf: "\u{1F4C4}",
    doc: "\u{1F4DD}",
    docx: "\u{1F4DD}",
    xls: "\u{1F4CA}",
    xlsx: "\u{1F4CA}",
    csv: "\u{1F4CA}",
    ppt: "\u{1F4CA}",
    pptx: "\u{1F4CA}",
    png: "\u{1F5BC}",
    jpg: "\u{1F5BC}",
    jpeg: "\u{1F5BC}",
    mp4: "\u{1F3AC}",
    zip: "\u{1F4E6}",
  };
  return iconMap[lower] || "\u{1F4CE}";
}

function createCategoryId(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^\w\s]/gi, "")
    .replace(/\s+/g, "-");
}

function useIsMobile(breakpoint = 1024) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);
  return isMobile;
}

export default function DealRoomContent({
  hasAccess,
  hasRequestedAccess,
}: {
  hasAccess: boolean;
  hasRequestedAccess: boolean;
}) {
  const [categories, setCategories] = useState<VaultCategory[]>([]);
  const [userTier, setUserTier] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [tocOpen, setTocOpen] = useState(true);
  const activeItemRef = useRef<HTMLLIElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    async function fetchVaultFiles() {
      try {
        const res = await fetch("/api/documents/vault-files");
        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "Failed to load documents");
          setLoading(false);
          return;
        }

        const json: VaultFilesResponse = await res.json();
        setCategories(json.data.categories);
        setUserTier(json.data.userTier);
      } catch {
        setError("Failed to load documents");
      } finally {
        setLoading(false);
      }
    }

    fetchVaultFiles();
  }, []);

  // Observe category headings for active TOC highlighting
  useEffect(() => {
    if (!categories.length) return;

    const headingIds = categories.map((cat) => createCategoryId(cat.label));
    const headings = headingIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (!headings.length) return;

    let lastActiveId: string | null = null;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting && e.intersectionRatio > 0)
          .map((e) => ({ id: e.target.id, top: e.boundingClientRect.top }))
          .filter((e) => e.top >= 0);

        if (visible.length > 0) {
          visible.sort((a, b) => a.top - b.top);
          const newActiveId = visible[0].id;
          if (newActiveId !== lastActiveId) {
            lastActiveId = newActiveId;
            setActiveId(newActiveId);
          }
        }
      },
      {
        root: null,
        rootMargin: "0px 0px -80% 0px",
        threshold: [0, 1],
      }
    );

    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [categories]);

  // Auto-scroll active TOC item into view on desktop
  useEffect(() => {
    if (!activeId || !activeItemRef.current || isMobile) return;
    activeItemRef.current.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [activeId, isMobile]);

  if (loading) {
    return (
      <div className="py-16 text-center">
        <div className="inline-block w-8 h-8 border-2 border-[var(--cta-color)] border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-sm text-gray-400">Loading deal room...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 text-center">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-gray-400">
          Documents are being prepared. Please check back soon.
        </p>
      </div>
    );
  }

  const hasRestrictedCategories = categories.some((cat) => !cat.accessible);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] lg:gap-10 mt-10">
      {/* Left panel — Category navigation index */}
      <aside>
        <div className="sticky top-40">
          <div className="rounded-2xl p-6 mb-10 border border-white/10 shadow-[0_0_15px_rgba(3,236,242,0.15)]">
            <div className="flex justify-between items-center mb-5">
              <h4 className="text-xl m-0">Categories</h4>
              <button
                aria-label="Toggle category list"
                className="cursor-pointer lg:hidden"
                onClick={() => setTocOpen(!tocOpen)}
              >
                <svg
                  className={`w-5 h-5 text-white transition-transform duration-300 ${tocOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>
            <nav
              className={`transition-all duration-300 ease-in-out overflow-hidden ${tocOpen ? "max-h-[2000px]" : "max-h-0 lg:max-h-[2000px]"}`}
            >
              <menu className="list-none p-0 m-0">
                {categories.map((cat) => {
                  const catId = createCategoryId(cat.label);
                  const isActive = activeId === catId;

                  if (!cat.accessible) {
                    return (
                      <li
                        key={cat.id}
                        className="relative ps-3 mb-2 last:mb-0 text-base text-gray-600 cursor-not-allowed select-none"
                        title={
                          cat.requiredTier
                            ? `Requires ${cat.requiredTier} tier`
                            : "Restricted"
                        }
                      >
                        <span className="flex items-center gap-2">
                          <svg
                            className="w-3.5 h-3.5 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {cat.label}
                        </span>
                      </li>
                    );
                  }

                  return (
                    <li
                      key={cat.id}
                      ref={isActive ? activeItemRef : null}
                      className={`relative ps-3 mb-2 last:mb-0 text-base transition-colors duration-300 ${
                        isActive
                          ? "text-[var(--cta-color)] before:content-['•'] before:text-current before:absolute before:-left-1"
                          : "hover:text-[var(--cta-color)]"
                      }`}
                    >
                      <a
                        href={`#${catId}`}
                        className="no-underline text-inherit"
                        onClick={(e) => {
                          e.preventDefault();
                          document
                            .getElementById(catId)
                            ?.scrollIntoView({ behavior: "smooth" });
                        }}
                      >
                        {cat.label}
                      </a>
                    </li>
                  );
                })}
              </menu>
            </nav>
          </div>
        </div>
      </aside>

      {/* Right panel — Documents grouped by category */}
      <div>
        {/* Request access banner for users without full access */}
        {hasRestrictedCategories && !hasAccess && (
          <div className="mb-10 rounded-xl border border-white/10 bg-white/5 p-6">
            {!hasRequestedAccess ? (
              <>
                <p className="text-sm text-gray-300 mb-4">
                  To access all the Deal Room documents,{" "}
                  <span className="hidden sm:inline">click</span>
                  <span className="sm:hidden">tap</span> the &ldquo;Request
                  Access&rdquo; button below.
                </p>
                <RequestAccessButton />
              </>
            ) : (
              <div className="text-center">
                <p className="text-sm text-gray-300">
                  Your access request is being reviewed. We&rsquo;ll notify you
                  once it&rsquo;s approved. In the meantime, you can access the
                  documents available to your current tier below.
                </p>
              </div>
            )}
          </div>
        )}

        {categories.map((cat) => {
          const catId = createCategoryId(cat.label);

          return (
            <section key={cat.id} className="mb-12">
              <h3
                id={catId}
                className={`scroll-mt-28 text-2xl mb-6 pb-3 border-b border-white/10 ${
                  !cat.accessible ? "text-gray-600" : ""
                }`}
              >
                {cat.label}
                {!cat.accessible && cat.requiredTier && (
                  <span className="ml-3 text-xs font-normal text-gray-500 align-middle">
                    <svg
                      className="w-3.5 h-3.5 inline-block mr-1 -mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {cat.requiredTier} tier
                  </span>
                )}
              </h3>

              <div className="space-y-2">
                {cat.documents.map((doc) => {
                  const displayName = `${doc.name}${doc.extension ? `.${doc.extension}` : ""}`;

                  if (!cat.accessible || !doc.url) {
                    return (
                      <div
                        key={doc.id}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/[0.03] text-gray-600 cursor-not-allowed select-none"
                      >
                        <span className="text-lg leading-none">
                          {getFileIcon(doc.extension)}
                        </span>
                        <span className="text-sm">{displayName}</span>
                      </div>
                    );
                  }

                  return (
                    <a
                      key={doc.id}
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] transition-colors no-underline text-inherit group"
                    >
                      <span className="text-lg leading-none">
                        {getFileIcon(doc.extension)}
                      </span>
                      <span className="text-sm group-hover:text-[var(--cta-color)] transition-colors">
                        {displayName}
                      </span>
                      <svg
                        className="w-4 h-4 ml-auto text-gray-500 group-hover:text-[var(--cta-color)] transition-colors flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                    </a>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
