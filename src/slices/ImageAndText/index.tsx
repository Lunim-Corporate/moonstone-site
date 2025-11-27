"use client"
import { Content, isFilled } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";

/**
 * Props for `ImageAndText`.
 */
export type ImageAndTextProps = SliceComponentProps<Content.ImageAndTextSlice>;

/**
 * Component for "ImageAndText" Slices.
 */
export default function ImageAndText({ slice }: ImageAndTextProps) {
  if (slice.variation === "default") {
    return (
      <div className="grid grid-cols-[2fr_1.5fr] gap-x-8 py-20 max-w-7xl mx-auto">
        <div>
          <div className="w-[60ch]">
            <PrismicRichText
              field={slice.primary.heading}
              components={{
                heading2: ({ children }) => (
                  <h2 className="mb-6">{children}</h2>
                ),
              }}
            />
            <PrismicRichText
              field={slice.primary.body}
              components={{
                paragraph: ({ children }) => <p className="mb-6">{children}</p>,
              }}
            />
            <div>
              {isFilled.link(slice.primary.cta) && (
                <PrismicNextLink
                  field={slice.primary.cta}
                  className="p-2.5 text-black bg-[#03ECF2] rounded hover:bg-transparent hover:text-[#03ECF2] transition-colors duration-300"
                />
              )}
            </div>
          </div>
        </div>
        <div>
          <PrismicNextImage field={slice.primary.main_image} />
        </div>
      </div>
    );
  }
  if (slice.variation === "imageAboveTextBelow") {
    return (
      <div className="bg-[#201e1e] py-20">
        <div className="max-w-7xl mx-auto">
          <PrismicRichText
            field={slice.primary.heading}
            components={{
              heading2: ({ children }) => <h2 className="mb-4">{children}</h2>,
            }}
          />
          <div className="grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-x-10">
            {slice.primary.item.map((item, idx) => {
              return (
                <div key={idx} className="flex flex-col">
                  <div className="rounded-lg overflow-hidden mb-6 shadow-[10px_10px_20px_white]">
                    <PrismicNextImage
                      field={item.main_image}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <PrismicRichText field={item.body} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
};