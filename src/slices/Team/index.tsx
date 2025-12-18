"use client"
// Prismic
import { Content, isFilled, LinkField, RichTextField } from "@prismicio/client";
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
  return (
    <div className="max-w-(--max-wrapper-width) mx-auto mt-30 mb-10">
      <div className="mb-14 max-w-lg text-center mx-auto">
        <PrismicRichText
          field={slice.primary.heading}
          components={{
            heading1: ({ children }) => <h1 className="text-center mb-5">{children}</h1>
          }}
        />
        <PrismicRichText field={slice.primary.body_text} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-y-20 sm:gap-x-5 sm:p-2.5">
        {slice.primary.team_member.map((teamMember, idx) => {
          const { cta_label: memberCtaLabel, cta_link: memberCtaLink } = teamMember as TeamMemberWithCta;
          return (
            <div key={idx} className="rounded overflow-hidden bg-[#2b2b2b]">
              <div className="relative mb-4">
                <PrismicNextImage 
                field={teamMember.headshot}
                className="w-full"
              />
                <div className="px-5 absolute bottom-0 py-3 text-shadow-lg">
                  <PrismicRichText field={teamMember.name} />
                </div>
              </div>
              <div className="px-5">
                <div className="mb-4">
                <PrismicRichText field={teamMember.role} />
                </div>
              <PrismicRichText field={teamMember.bio} components={{paragraph: ({children}) => <p className="mb-2 last:mb-0 pb-6">{children}</p>}} />
              {isFilled.richText(memberCtaLabel ?? null) && isFilled.link(memberCtaLink) && (
                <div className="pb-6">
                  <PrismicNextLink
                    field={memberCtaLink}
                    className="inline-block rounded bg-(--cta-color) px-6 py-2 text-(--black-primary-color) font-semibold hover:bg-(--cta-color)/70 transition-colors duration-300"
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
  );
};
