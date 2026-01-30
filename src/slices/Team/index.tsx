"use client"
// React
import { useEffect, useState } from "react";
// Prismic
import { Content, isFilled, LinkField, RichTextField, asText } from "@prismicio/client";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";

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
  const [active, setActive] = useState<string | null>(null);
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

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 to-slate-800 text-slate-200">
      <div className="w-full max-w-6xl px-4 mx-auto py-16">
        <div className="mb-12 mt-12 text-center">
          {/* Start header */}
          <header className="text-center mb-12 px-4">
            <PrismicRichText
              field={slice.primary.heading}
              components={{
                heading1: ({ children }) => (
                  <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-sky-400 to-cyan-400 bg-clip-text text-transparent mb-4">
                    {children}
                  </h1>
                ),
              }}
            />
            <div className="text-slate-400 max-w-2xl mx-auto text-lg">
              <PrismicRichText field={slice.primary.body_text} />
            </div>
          </header>
          {/* End header */}

          {/* Team Section */}
          <section className="max-w-6xl mx-auto px-4">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {slice.primary.team_member.map((teamMember, idx) => {
                const memberName = asText(teamMember?.name);
                return (
                  <div
                    key={idx}
                    className={`transition duration-300 ${
                      active && active !== memberName && !isMobile
                        ? "blur-sm opacity-70"
                        : ""
                    }`}
                  >
                    <TeamMember
                      member={teamMember}
                      isActive={active === memberName}
                      setActive={setActive}
                      isMobile={isMobile}
                    />
                  </div>
                );
              })}
            </div>
          </section>
          {/* End Team Section */}
        </div>
      </div>
    </div>
  );
}

/**
 * Team Member Component
 */
type TeamMemberProps = {
  member: Content.TeamSlice["primary"]["team_member"][number];
  isActive: boolean;
  setActive: (name: string | null) => void;
  isMobile: boolean;
};

const TeamMember = ({ member, isActive, setActive, isMobile }: TeamMemberProps) => {
  const memberName = asText(member?.name);
  const { cta_label: memberCtaLabel, cta_link: memberCtaLink } = member as TeamMemberWithCta;

  return (
    <div
      className={`relative rounded-xl shadow-xl overflow-hidden transition-all duration-500 h-full
        ${isActive && !isMobile ? "z-10 scale-[1.02]" : "hover:scale-[1.01]"}
        ${!isActive && !isMobile ? "hover:z-5" : ""}`}
      onMouseEnter={() => !isMobile && setActive(memberName)}
      onMouseLeave={() => !isMobile && setActive(null)}
    >
      {/* Background Image */}
      <div className="h-80 sm:h-96 relative">
        <PrismicNextImage
          field={member.headshot}
          className="w-full h-full object-cover"
        />

        {/* Overlay with Name */}
        <div
          className={`absolute bottom-0 left-0 w-full bg-linear-to-t from-black/70 to-transparent p-4
          transition-all duration-500 ease-in-out opacity-100 translate-y-0 block`}
        >
          <PrismicRichText
            field={member.name}
            components={{
              heading2: ({ children }) => (
                <h2 className="text-left">{children}</h2>
              ),
            }}
          />
        </div>
      </div>

      {/* Bio Section */}
      <BioCard member={member} memberCtaLabel={memberCtaLabel} memberCtaLink={memberCtaLink} />
    </div>
  );
};

/**
 * Bio Card Component
 */
type BioCardProps = {
  member: Content.TeamSlice["primary"]["team_member"][number];
  memberCtaLabel?: RichTextField | null;
  memberCtaLink?: LinkField | null;
};

const BioCard = ({ member, memberCtaLabel, memberCtaLink }: BioCardProps) => {
  return (
    <div className={`bg-slate-900/90 p-5 text-start h-full`}>
      <div className="mb-1">
        <PrismicRichText
          field={member.role}
          components={{
            paragraph: ({ children }) => (
              <span className="text-xl text-strong text-slate-400">{children}</span>
            ),
          }}
        />
      </div>

      <div className="text-slate-200 text-md py-2">
        <PrismicRichText
          field={member.bio}
          components={{
            paragraph: ({ children }) => (
              <p className="whitespace-pre-wrap">{children}</p>
            ),
          }}
        />
      </div>

      <div className="mt-4">
        {isFilled.richText(memberCtaLabel ?? null) && isFilled.link(memberCtaLink) ? (
          <PrismicNextLink
            field={memberCtaLink}
            className="inline-block rounded px-6 py-2 border text-cyan-400 border-color-cyan-400 hover:text-cyan-200 hover:border-color-cyan-200 font-semibold transition-all duration-300"
          >
            <PrismicRichText
              field={memberCtaLabel ?? null}
              components={{
                paragraph: ({ children }) => <span>{children}</span>,
              }}
            />
          </PrismicNextLink>
        ) : (
          <div className="invisible inline-block rounded px-6 py-2">
            <span>Placeholder</span>
          </div>
        )}
      </div>
    </div>
  );
};
