"use client"
import { isFilled, ImageField, RichTextField } from "@prismicio/client";
import * as prismic from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import Image from "next/image";
import CardSelector from "@/components/card-selector";
import {  useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { GlowingEffect } from "@/components/ui/glowing-effect";

// Define the missing type for textOverBackground variation using proper Prismic types
interface ImageAndTextSliceDefaultPrimary {
  background_image: ImageField<never>;
  heading: RichTextField;
  body: RichTextField;
  main_image: ImageField<never>;
  cta: prismic.LinkField;
  tilt_angle?: string;
  bullet_points?: {
    bullet_title: RichTextField;
    bullet_description: RichTextField;
  }[];
}

interface ImageAndTextSliceDefault {
  id: string;
  slice_type: "image_and_text";
  variation: "default";
  primary: ImageAndTextSliceDefaultPrimary;
  items: {
    title: RichTextField;
    description: RichTextField;
    is_bullet?: boolean;
    bullet_point_1?: RichTextField;
    bullet_point_2?: RichTextField;
    bullet_point_3?: RichTextField;
    bullet_point_4?: RichTextField;
    bullet_point_5?: RichTextField;
  }[];
}

interface ImageAndTextSliceTextOverBackgroundPrimary {
  background_image: ImageField<never>;
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

// Define the type for the imageAboveTextBelow variation
interface ImageAndTextSliceImageAboveTextBelowPrimary {
  background_image: ImageField<never>;
  heading: RichTextField;
  item: {
    title: RichTextField;
    description: RichTextField;
  }[];
  theme: RichTextField;
}

interface ImageAndTextSliceImageAboveTextBelow {
  id: string;
  slice_type: "image_and_text";
  variation: "imageAboveTextBelow";
  primary: ImageAndTextSliceImageAboveTextBelowPrimary;
  items: Record<string, never>[];
}

// Define the type for the new collapsingCard variation
interface ImageAndTextSliceCollapsingCardPrimary {
  background_image: ImageField<never>;
  heading: RichTextField;
  cards: {
    card_image: ImageField<never>;
    title: RichTextField;
    description: RichTextField;
    color: string;
  }[];
}

interface ImageAndTextSliceCollapsingCard {
  id: string;
  slice_type: "image_and_text";
  variation: "collapsingCard";
  primary: ImageAndTextSliceCollapsingCardPrimary;
  items: Record<string, never>[];
}

// Extend the existing ImageAndTextSlice type to include the missing variations
type ExtendedImageAndTextSlice = 
  | ImageAndTextSliceDefault
  | ImageAndTextSliceTextOverBackground
  | ImageAndTextSliceImageAboveTextBelow
  | ImageAndTextSliceCollapsingCard;

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
  // Ref for the image container to observe when it comes into view
  const ref = useRef(null);
  // Check if the element is in view
  const isInView = useInView(ref, { once: true, margin: "-20%" });
  // Animation controls for the image
  const imageControls = useAnimation();
  
  // Apply animation when component mounts or when inView changes
  useEffect(() => {
    if (slice.variation === "default" && isInView) {
      // Get the tilt angle from the slice data
      const tiltAngle = slice.primary.tilt_angle || "None";
      
      // Set target rotation based on tilt angle
      const getTargetRotation = () => {
        if (tiltAngle === "Left") return -5;
        if (tiltAngle === "Right") return 5;
        return 0;
      };
      
      imageControls.start({ 
        rotate: getTargetRotation(),
        transition: { duration: 0.8, ease: "easeOut" }
      });
    }
  }, [isInView, imageControls, slice]);
  
  // The Hook, Why now, Transmedia, Potential Investors
  if (slice.variation === "default") {
    // Get the tilt angle from the slice data
    const tiltAngle = slice.primary.tilt_angle || "None";
    
    // Set initial rotation based on tilt angle
    const getInitialRotation = () => {
      if (tiltAngle === "Left") return -5;
      if (tiltAngle === "Right") return 5;
      return 0;
    };
    
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
                    heading2: ({ children }) => (
                      <h2 className="text-2xl font-semibold text-[#8df6ff]">{children}</h2>
                    ),
                    heading3: ({ children }) => (
                      <h3 className="text-xl font-semibold text-[#8df6ff]">{children}</h3>
                    ),
                    paragraph: ({ children }) => (
                      <p className="mb-6 text-gray-200">{children}</p>
                    ),
                  }}
                />
                
                {/* Repeatable title and description with bullet point option */}
                {slice.items.length > 0 && (
                  <div className="mt-8 space-y-4">
                    {slice.items.map((item, index) => (
                      <div key={index}>
                        <div>
                          <PrismicRichText
                            field={item.title}
                            components={
                              {
                                heading3: ({ children }) => (
                                  <h3 className="text-xl font-semibold text-[#8df6ff] mb-1">
                                    {children}
                                  </h3>
                                ),
                              }
                            }
                          />
                          {!item.is_bullet ? (
                            <PrismicRichText
                              field={item.description}
                              components={
                                {
                                  paragraph: ({ children }) => (
                                    <p className="text-gray-200">{children}</p>
                                  ),
                                }
                              }
                            />
                          ) : (
                            <div className="space-y-2 mt-2">
                              {isFilled.richText(item.bullet_point_1) && (
                                <div className="flex items-start">
                                  <span className="inline-block w-2 h-2 rounded-full bg-[#8df6ff] mr-3 mt-2 flex-shrink-0"></span>
                                  <PrismicRichText
                                    field={item.bullet_point_1}
                                    components={
                                      {
                                        paragraph: ({ children }) => (
                                          <p className="text-gray-200">{children}</p>
                                        ),
                                      }
                                    }
                                  />
                                </div>
                              )}
                              {isFilled.richText(item.bullet_point_2) && (
                                <div className="flex items-start">
                                  <span className="inline-block w-2 h-2 rounded-full bg-[#8df6ff] mr-3 mt-2 flex-shrink-0"></span>
                                  <PrismicRichText
                                    field={item.bullet_point_2}
                                    components={
                                      {
                                        paragraph: ({ children }) => (
                                          <p className="text-gray-200">{children}</p>
                                        ),
                                      }
                                    }
                                  />
                                </div>
                              )}
                              {isFilled.richText(item.bullet_point_3) && (
                                <div className="flex items-start">
                                  <span className="inline-block w-2 h-2 rounded-full bg-[#8df6ff] mr-3 mt-2 flex-shrink-0"></span>
                                  <PrismicRichText
                                    field={item.bullet_point_3}
                                    components={
                                      {
                                        paragraph: ({ children }) => (
                                          <p className="text-gray-200">{children}</p>
                                        ),
                                      }
                                    }
                                  />
                                </div>
                              )}
                              {isFilled.richText(item.bullet_point_4) && (
                                <div className="flex items-start">
                                  <span className="inline-block w-2 h-2 rounded-full bg-[#8df6ff] mr-3 mt-2 flex-shrink-0"></span>
                                  <PrismicRichText
                                    field={item.bullet_point_4}
                                    components={
                                      {
                                        paragraph: ({ children }) => (
                                          <p className="text-gray-200">{children}</p>
                                        ),
                                      }
                                    }
                                  />
                                </div>
                              )}
                              {isFilled.richText(item.bullet_point_5) && (
                                <div className="flex items-start">
                                  <span className="inline-block w-2 h-2 rounded-full bg-[#8df6ff] mr-3 mt-2 flex-shrink-0"></span>
                                  <PrismicRichText
                                    field={item.bullet_point_5}
                                    components={
                                      {
                                        paragraph: ({ children }) => (
                                          <p className="text-gray-200">{children}</p>
                                        ),
                                      }
                                    }
                                  />
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {isFilled.link(slice.primary.cta) && (
                  <div>
                      <PrismicNextLink
                        field={slice.primary.cta}
                        className="p-2.5 text-(--black-primary-color) bg-(--cta-color) rounded hover:bg-transparent hover:text-(--cta-color) transition-colors duration-300 font-bold mt-8 inline-block"
                      />
                  </div>
                )}
              </div>
            </div>
            <div>
              <motion.div 
                ref={ref}
                initial={{ rotate: getInitialRotation() }}
                animate={imageControls}
                className="relative inline-block"
              >
                {/* Enhanced golden frame with four layers for elegance */}
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-yellow-800 rounded-lg shadow-2xl transform rotate-2 -z-10 scale-[1.04]"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-yellow-700 rounded-lg shadow-xl transform -rotate-1 -z-10 scale-[1.03]"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg shadow-lg transform rotate-1 -z-10 scale-[1.01]"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-lg shadow-md transform -rotate-1 -z-10"></div>
                <div className="relative border-4 border-yellow-400 rounded-lg p-1 bg-gradient-to-br from-yellow-400/30 to-yellow-600/30">
                  <PrismicNextImage
                    field={slice.primary.main_image}
                    className="rounded"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  // Comparables, Synopsis
  if (slice.variation === "imageAboveTextBelow") {

    return (
      <div className="relative py-20 bg-transparent">
        {/* Background image for the entire section */}
        {isFilled.image(slice.primary.background_image) && (
          <div className="absolute inset-0 -z-10">
            <PrismicNextImage
              field={slice.primary.background_image}
              className="w-full h-full object-cover"
              fill
            />
            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-black/70"></div>
          </div>
        )}
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <PrismicRichText
            field={slice.primary.heading}
            components={{
              heading2: ({ children }) => (
                <h2 className="mb-10 text-center md:text-left text-5xl md:text-6xl font-bold">{children}</h2>
              ),
            }}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[22rem]">
            {slice.primary.item.map((item, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-xl
                  bg-black/30 backdrop-blur-sm border border-white/10
                  transform-gpu
                  ${idx === 0 ? 'md:col-start-2 md:col-end-3 md:row-start-1 md:row-end-4' : ''}
                  ${idx === 1 ? 'md:col-start-1 md:col-end-2 md:row-start-1 md:row-end-3' : ''}
                  ${idx === 2 ? 'md:col-start-1 md:col-end-2 md:row-start-3 md:row-end-4' : ''}
                  ${idx === 3 ? 'md:col-start-3 md:col-end-3 md:row-start-1 md:row-end-2' : ''}
                  ${idx === 4 ? 'md:col-start-3 md:col-end-3 md:row-start-2 md:row-end-4' : ''}`}
              >
                <GlowingEffect
                  spread={30}
                  glow={true}
                  proximity={64}
                  inactiveZone={0.01}
                  borderWidth={2}
                />
                <div className="absolute top-4 left-4 z-10">
                  <span className="text-4xl font-extrabold text-[#8df6ff]">{idx + 1}</span>
                </div>
                <div className="flex flex-col justify-end h-full p-6 z-10">
                  <div>
                    <PrismicRichText
                      field={item.title}
                      components={{
                        heading3: ({ children }) => (
                          <h3 className="text-xl font-semibold text-[#8df6ff] mb-1">
                            {children}
                          </h3>
                        ),
                      }}
                    />
                    <PrismicRichText
                      field={item.description}
                      components={{
                        paragraph: ({ children }) => (
                          <p className="text-gray-200">{children}</p>
                        ),
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          {isFilled.richText(slice.primary.theme) && (
            <div className="mt-12 text-center">
              <div className="inline-flex items-center gap-2">
                <span className="text-2xl font-semibold text-[#8df6ff]">Theme:</span>
                <PrismicRichText 
                  field={slice.primary.theme}
                  components={{
                    heading2: ({ children }) => (
                      <h2 className="text-2xl font-semibold text-[#8df6ff]">{children}</h2>
                    ),
                    heading3: ({ children }) => (
                      <h3 className="text-xl font-semibold text-[#8df6ff]">{children}</h3>
                    ),
                    paragraph: ({ children }) => (
                      <p className="text-lg text-gray-200">{children}</p>
                    ),
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Handle the textOverBackground variation
  if (slice.variation === "textOverBackground") {
    // Access the primary fields directly
    const primary = slice.primary;
    
    // Extract all the text content for the scroll animation header
    const title = primary.title || [];
    const subtitle = primary.subtitle || [];
    const tagline = primary.tagline || [];

    // Combine all text content for the header
    const headerContent = (
      <div className="space-y-6 text-center">
        {isFilled.richText(title) && (
          <PrismicRichText
            field={title}
            components={{
              heading1: ({ children }) => (
                <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-semibold tracking-[0.22em] text-[#F7EBC5] uppercase drop-shadow-[0_0_20px_rgba(0,0,0,0.9)] animate-fade-in">
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
                <p className="mt-4 text-[clamp(1.2rem,1.8vw,1.5rem)] text-[#E7E3CF] animate-fade-in animation-delay-200">
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
                <p className="mt-6 text-[clamp(1.3rem,2vw,1.7rem)] font-semibold text-white animate-fade-in animation-delay-400">
                  {children}
                </p>
              ),
            }}
          />
        )}
      </div>
    );

    return (
      <div className="relative overflow-hidden min-h-screen mb-20">
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



  // Handle the new collapsingCard variation
  if (slice.variation === "collapsingCard") {
    // Transform Prismic data to match our component's expected format
    const cards = slice.primary.cards.map((card, index) => ({
      id: index,
      background: card.card_image?.url || "",
      title: getTextFromRichText(card.title),
      description: getTextFromRichText(card.description),
      color: card.color || "#FFCE54"
    }));

    return (
      <div className="relative py-20 bg-transparent">
        {/* Section background image covering entire section */}
        {isFilled.image(slice.primary.background_image) && (
          <div className="absolute inset-0 z-0">
            <PrismicNextImage 
              field={slice.primary.background_image} 
              className="w-full h-full object-cover"
              fill
            />
            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-black/70"></div>
          </div>
        )}
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isFilled.richText(slice.primary.heading) && (
            <div className="mb-10 text-left">
              <PrismicRichText 
                field={slice.primary.heading} 
                components={{
                  heading1: ({ children }) => (
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">{children}</h1>
                  ),
                  heading2: ({ children }) => (
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">{children}</h2>
                  ),
                  heading3: ({ children }) => (
                    <h3 className="text-2xl md:text-3xl font-bold mb-6">{children}</h3>
                  ),
                }}
              />
            </div>
          )}
          
          {/* Card selector with transparent background to allow section background to show through */}
          <div className="bg-transparent">
            <CardSelector cards={cards} />
          </div>
        </div>
      </div>
    );
  }

  return null;
}