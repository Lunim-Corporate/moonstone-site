// Prismic
import { Content } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";

/**
 * Props for `Team`.
 */
export type TeamProps = SliceComponentProps<Content.TeamSlice>;

/**
 * Component for "Team" Slices.
 */
export default function Team({ slice }: TeamProps) {
  return (
    <div className="max-w-7xl mx-auto mt-30 mb-10">
      <div className="mb-14 max-w-lg text-center mx-auto">
        <PrismicRichText
          field={slice.primary.heading}
          components={{
            heading1: ({ children }) => <h1 className="text-center mb-5">{children}</h1>
          }}
        />
        <PrismicRichText field={slice.primary.body_text} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-20 sm:gap-4">
        {slice.primary.team_member.map((teamMember, idx) => (
            <div key={idx} className="rounded overflow-hidden bg-[#2d2b2b]">
              <div className="relative mb-4">
                <PrismicNextImage field={teamMember.headshot} />
                <div className="px-5 absolute bottom-0 py-6">
                  <PrismicRichText field={teamMember.name} />
                </div>
              </div>
              <div className="px-5">
                <div className="mb-8">
                <PrismicRichText field={teamMember.role} />
                </div>
              <PrismicRichText field={teamMember.bio} components={{paragraph: ({children}) => <p className="mb-2 last:mb-0 pb-6">{children}</p>}} />
              </div>
            </div>
        ))}
      </div>
    </div>
  );
};