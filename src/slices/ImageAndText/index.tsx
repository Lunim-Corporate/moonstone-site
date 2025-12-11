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
  // The Hook, Why now, Transmedia, Potential Investors
  if (slice.variation === "default") {
    return (
      <div
        style={{
          backgroundImage: `url(${slice.primary.background_image?.url})`,
        }}
        className="bg-cover bg-center"
      >
        {/* Only add opacity level for background images */}
        <div
          className={
            "py-20 " +
            (slice.primary.background_image?.url ? "bg-[rgba(0,0,0,0.8)]" : "")
          }
        >
          <div className="grid grid-cols-[2fr_1.5fr] gap-x-8 max-w-(--max-wrapper-width) mx-auto">
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
                    paragraph: ({ children }) => (
                      <p className="mb-6">{children}</p>
                    ),
                  }}
                />
                {isFilled.link(slice.primary.cta) && (
                  <div>
                      <PrismicNextLink
                        field={slice.primary.cta}
                        className="p-2.5 text-(--black-primary-color) bg-(--cta-color) rounded hover:bg-transparent hover:text-(--cta-color) transition-colors duration-300 font-bold"
                      />
                  </div>
                )}
              </div>
            </div>
            <div>
              <PrismicNextImage
                field={slice.primary.main_image}
                className="rounded"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
  // Comparables, Synopsis
  if (slice.variation === "imageAboveTextBelow") {
    return (
      <div
        className="bg-cover bg-center relative"
        style={{
          backgroundImage: `url(${slice.primary.background_image?.url})`,
        }}
      >
        {isFilled.image(slice.primary.seconday_background_image) && (
          <div className="bg-cover bg-bottom h-100" style={{ backgroundImage: `url(${slice.primary.seconday_background_image?.url})` }}></div>
        )}
        <div className={"py-20 " + (slice.primary.background_image?.url ? "bg-[rgba(0,0,0,0.8)]" : "")}>
          <div className="max-w-(--max-wrapper-width) mx-auto">
            <PrismicRichText
              field={slice.primary.heading}
              components={{
                heading2: ({ children }) => (
                  <h2 className="mb-10">{children}</h2>
                ),
              }}
            />
            <div className="grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-x-10 my-counter">
              {slice.primary.item.map((item, idx) => {
                return (
                  <div key={idx} className="flex flex-col">
                    {isFilled.image(item.main_image) ? (
                    // Add shadow if not shadow already present 
                    <div className="rounded-lg overflow-hidden mb-6 shadow-[0px_0px_10px_4px_white]">
                      <div className="rounded-lg overflow-hidden mb-6">
                        <PrismicNextImage
                          field={item.main_image}
                          className="w-full rounded"
                        />
                        </div>
                      </div>
                    ) : (
                        <div className="my-counter-section border-b-2 my-4"></div>
                    )}
                    <div>
                      <PrismicRichText field={item.body} />
                    </div>
                  </div>
                );
              })}
            </div>
            {isFilled.richText(slice.primary.body) && (
              <div className="mt-12 text-center">
                <PrismicRichText field={slice.primary.body} />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
};