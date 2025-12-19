"use client"
// React
import { useEffect, useRef, useState } from "react";
// GSAP
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// Prismic
import { Content, isFilled, LinkField, RichTextField } from "@prismicio/client";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";

// Register GSAP plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Props for `Team`.
 */
export type TeamProps = SliceComponentProps<Content.TeamSlice>;

/**
 * Component for "Team" Slices.
 */
type TeamMemberWithCta = Content.TeamSlice["primary"]["team_member"][number] & {
  cta_label?: RichTextField | null;
  cta_link?: LinkField | null;
};

export default function Team({ slice }: TeamProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // GSAP fade-up animation
  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;

    const cards = cardsRef.current.filter(Boolean);
    if (cards.length === 0) return;

    // Set initial state
    gsap.set(cards, {
      opacity: 0,
      y: 60,
    });

    // Create animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
      },
    });

    tl.to(cards, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power3.out",
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [slice.primary.team_member.length]);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 to-slate-800 text-slate-200 py-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Section */}
        <div className="mb-16 text-center">
          <PrismicRichText
            field={slice.primary.heading}
            components={{
              heading1: ({ children }) => (
                <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-sky-400 to-cyan-400 bg-clip-text text-transparent mb-6">
                  {children}
                </h1>
              ),
            }}
          />
          <div className="text-slate-400 max-w-2xl mx-auto text-lg">
            <PrismicRichText field={slice.primary.body_text} />
          </div>
        </div>

        {/* Team Grid */}
        <div
          ref={containerRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {slice.primary.team_member.map((teamMember, idx) => {
            const { cta_label: memberCtaLabel, cta_link: memberCtaLink } = teamMember as TeamMemberWithCta;
            const isActive = activeCard === idx;

            return (
              <div
                key={idx}
                ref={(el) => {
                  cardsRef.current[idx] = el;
                }}
                className={`relative rounded-xl shadow-xl overflow-hidden transition-all duration-500 h-full
                  ${isActive && !isMobile ? "z-10 scale-[1.02]" : "hover:scale-[1.01]"}
                  ${activeCard !== null && activeCard !== idx && !isMobile ? "blur-sm opacity-70" : ""}`}
                onMouseEnter={() => !isMobile && setActiveCard(idx)}
                onMouseLeave={() => !isMobile && setActiveCard(null)}
              >
                {/* Image Section */}
                <div className="relative h-80 sm:h-96">
                  <PrismicNextImage
                    field={teamMember.headshot}
                    className="w-full h-full object-cover"
                  />

                  {/* Name Overlay */}
                  <div className="absolute bottom-0 left-0 w-full bg-linear-to-t from-black/70 to-transparent p-4">
                    <PrismicRichText
                      field={teamMember.name}
                      components={{
                        paragraph: ({ children }) => (
                          <h3 className="text-lg font-semibold text-white">{children}</h3>
                        ),
                      }}
                    />
                  </div>
                </div>

                {/* Bio Section */}
                <div className="bg-slate-900/90 p-5">
                  <div className="mb-4">
                    <PrismicRichText
                      field={teamMember.role}
                      components={{
                        paragraph: ({ children }) => (
                          <span className="text-sm text-slate-400">{children}</span>
                        ),
                      }}
                    />
                  </div>

                  <PrismicRichText
                    field={teamMember.bio}
                    components={{
                      paragraph: ({children}) => (
                        <p className="text-slate-200 text-sm mb-2 last:mb-0 whitespace-pre-wrap">{children}</p>
                      )
                    }}
                  />

                  {isFilled.richText(memberCtaLabel ?? null) && isFilled.link(memberCtaLink) && (
                    <div className="mt-4">
                      <PrismicNextLink
                        field={memberCtaLink}
                        className="inline-block rounded bg-linear-to-r from-sky-400 to-cyan-400 px-6 py-2 text-slate-900 font-semibold hover:from-sky-500 hover:to-cyan-500 transition-all duration-300"
                      >
                        <PrismicRichText
                          field={memberCtaLabel ?? null}
                          components={{
                            paragraph: ({ children }) => <span>{children}</span>,
                          }}
                        />
                      </PrismicNextLink>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
