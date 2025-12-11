"use client";
import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";

/**
 * Props for `Hero`.
 */
export type HeroProps = SliceComponentProps<Content.HeroSlice>;

/**
 * Component for "Hero" Slices.
 */
export default function Hero({ slice }: HeroProps) {
  return (
    <div
      style={{
        backgroundImage: `url(${slice.primary.background_image.url})`,
      }}
      className="bg-cover bg-center min-h-screen relative"
    >
      <div className="min-h-screen grid items-center absolute inset-0 bg-[rgba(0,0,0,0.5)]">
        <div className="max-w-4xl text-center mx-auto">
          <PrismicRichText
            field={slice.primary.heading}
            components={{
              heading1: ({ children }) => <h1 className="mb-5">{children}</h1>,
            }}
          />
          <PrismicRichText field={slice.primary.body} />
        </div>
      </div>
    </div>
  );
}
