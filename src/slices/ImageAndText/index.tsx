"use client"
import { Content, isFilled, ImageField, RichTextField, RTNode } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import Image from "next/image";
import CardSelector from "@/components/card-selector";

// Define the missing type for textOverBackground variation using proper Prismic types
interface ImageAndTextSliceTextOverBackgroundPrimary {
  background_image: ImageField<never>;
  top_text: RichTextField;
  title: RichTextField;
  subtitle: RichTextField;
  tagline: RichTextField;
}

interface ImageAndTextSliceTextOverBackground {
  id: string;
  slice_type: "image_and_text";
  variation: "textOverBackground";
  primary: ImageAndTextSliceTextOverBackgroundPrimary;
  items: Record<string, never>[];
}

// Define the type for the new cardWithVerticalTitle variation
interface ImageAndTextSliceCardWithVerticalTitlePrimary {
  cards: {
    background_image: ImageField<never>;
    title: RichTextField;
    description: RichTextField;
    color: string;
  }[];
}

interface ImageAndTextSliceCardWithVerticalTitle {
  id: string;
  slice_type: "image_and_text";
  variation: "cardWithVerticalTitle";
  primary: ImageAndTextSliceCardWithVerticalTitlePrimary;
  items: Record<string, never>[];
}

// Extend the existing ImageAndTextSlice type to include the missing variations
type ExtendedImageAndTextSlice = 
  | Content.ImageAndTextSlice 
  | ImageAndTextSliceTextOverBackground
  | ImageAndTextSliceCardWithVerticalTitle;

/**
 * Props for `ImageAndText`.
 */
export type ImageAndTextProps = SliceComponentProps<ExtendedImageAndTextSlice>;

// Helper function to extract text from RichText field
const getTextFromRichText = (field: RichTextField | undefined): string => {
  if (!field || !Array.isArray(field)) return "";
  
  return field
    .filter((node) => "text" in node)
    .map((node) => (node as { text: string }).text)
    .join(" ");
};

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
          <div className="mx-auto flex max-w-7xl flex-col gap-y-10 px-6 md:grid md:grid-cols-[2fr,1.5fr] md:gap-x-8 md:px-10">
            <div>
              <div className="max-w-[60ch]">
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
        className="relative bg-cover bg-center"
        style={{
          backgroundImage: `url(${slice.primary.background_image?.url})`,
        }}
      >
        {isFilled.image(slice.primary.seconday_background_image) && (
          <div
            className="h-60 bg-cover bg-center"
            style={{
              backgroundImage: `url(${slice.primary.seconday_background_image?.url})`,
            }}
          />
        )}
        <div
          className={
            "py-20 " +
            (slice.primary.background_image?.url ? "bg-[rgba(0,0,0,0.8)]" : "")
          }
        >
          <div className="mx-auto max-w-7xl px-6 md:px-10">
            <PrismicRichText
              field={slice.primary.heading}
              components={{
                heading2: ({ children }) => (
                  <h2 className="mb-10 text-center md:text-left">{children}</h2>
                ),
              }}
            />
            <div className="my-counter grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-10">
              {slice.primary.item.map((item, idx) => (
                <div key={idx} className="flex flex-col">
                  {isFilled.image(item.main_image) ? (
                    <div className="mb-6 overflow-hidden rounded-lg shadow-[0px_0px_10px_4px_white]">
                      <PrismicNextImage
                        field={item.main_image}
                        className="w-full rounded"
                      />
                    </div>
                  ) : (
                    <div className="my-4 my-counter-section border-b-2" />
                  )}
                  <div>
                    <PrismicRichText field={item.body} />
                  </div>
                </div>
              ))}
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

  // Handle the textOverBackground variation
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((slice as any).variation === "textOverBackground") {
    // Access the primary fields directly
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const primary = (slice as any).primary;
    
    // Extract all the text content for the scroll animation header
    const topText = primary.top_text || [];
    const title = primary.title || [];
    const subtitle = primary.subtitle || [];
    const tagline = primary.tagline || [];

    // Combine all text content for the header
    const headerContent = (
      <div className="space-y-6">
        {isFilled.richText(topText) && (
          <PrismicRichText
            field={topText}
            components={{
              paragraph: ({ children }) => (
                <p className="text-sm font-semibold tracking-[0.35em] text-[#8CEAFF] uppercase">
                  {children}
                </p>
              ),
            }}
          />
        )}

        {isFilled.richText(title) && (
          <PrismicRichText
            field={title}
            components={{
              heading1: ({ children }) => (
                <h1 className="text-[clamp(2rem,4vw,2.8rem)] font-semibold tracking-[0.22em] text-[#F7EBC5] uppercase">
                  {children}
                </h1>
              ),
            }}
          />
        )}

        {isFilled.richText(subtitle) && (
          <PrismicRichText
            field={subtitle}
            components={{
              paragraph: ({ children }) => (
                <p className="text-[clamp(1rem,1.4vw,1.2rem)] text-[#E7E3CF]">
                  {children}
                </p>
              ),
            }}
          />
        )}

        {isFilled.richText(tagline) && (
          <PrismicRichText
            field={tagline}
            components={{
              paragraph: ({ children }) => (
                <p className="text-[clamp(1.1rem,1.6vw,1.35rem)] font-semibold text-white">
                  {children}
                </p>
              ),
            }}
          />
        )}
      </div>
    );

    return (
      <div className="relative overflow-hidden">
        <ContainerScroll
          titleComponent={headerContent}
        >
          {isFilled.image(primary.background_image) ? (
            <div className="relative h-full w-full">
              <Image
                src={primary.background_image.url || ""}
                alt={primary.background_image.alt || ""}
                fill
                className="object-cover"
                priority
              />
              {/* Overlay gradient for text readability */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/60 to-black/90" />
            </div>
          ) : (
            <div className="h-full w-full bg-gray-200" />
          )}
        </ContainerScroll>
      </div>
    );
  }

  // Handle the new cardWithVerticalTitle variation
  if (slice.variation === "cardWithVerticalTitle") {
    // Transform Prismic data to match our component's expected format
    const cards = slice.primary.cards.map((card, index) => ({
      id: index,
      background: card.background_image?.url || "",
      title: getTextFromRichText(card.title),
      description: getTextFromRichText(card.description),
      color: card.color || "#FFCE54"
    }));

    return (
      <div className="py-20">
        <CardSelector cards={cards} />
      </div>
    );
  }

  return null;
}