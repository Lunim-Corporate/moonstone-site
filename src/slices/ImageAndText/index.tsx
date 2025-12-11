"use client";
import { Content, isFilled } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsMobile } from "../../hooks/useMediaQuery";

// Register GSAP plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Props for `ImageAndText`.
 */
export type ImageAndTextProps = SliceComponentProps<Content.ImageAndTextSlice>;

/**
 * Component for "ImageAndText" Slices.
 */
export default function ImageAndText({ slice }: ImageAndTextProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const bgParallaxRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // GSAP animations for parallaxTextImage variation
  useEffect(() => {
    if (slice.variation !== "parallaxTextImage") return;

    const ctx = gsap.context(() => {
      if (bgRef.current) {
        const enableParallax = "enable_parallax" in slice.primary ? slice.primary.enable_parallax : true;
        const enableZoom = "enable_zoom_effect" in slice.primary ? slice.primary.enable_zoom_effect : true;

        if (enableZoom) {
          gsap.fromTo(
            bgRef.current,
            { scale: 1.02 },
            {
              scale: 1.06,
              ease: "none",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top bottom",
                end: "center center",
                scrub: 0.9,
              },
            }
          );
        }

        if (enableParallax && bgParallaxRef.current) {
          const getParallaxRange = () => {
            if (typeof window === "undefined") return 50;
            return window.innerWidth < 640 ? 25 : 50;
          };

          gsap.fromTo(
            bgParallaxRef.current,
            { yPercent: () => -getParallaxRange() },
            {
              yPercent: () => getParallaxRange(),
              ease: "none",
              force3D: true,
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.5,
                invalidateOnRefresh: true,
              },
            }
          );
        }
      }

      // Text animation preset
      const animationPreset = "animation_preset" in slice.primary ? (slice.primary.animation_preset as string) : "fade-up";
      if (animationPreset && animationPreset !== "none") {
        const textEls = sectionRef.current?.querySelectorAll("[data-pt-text]");
        if (textEls?.length) {
          const isStrong = animationPreset === "stagger-strong";
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current!,
              start: isMobile ? "top bottom" : "top 90%",
              end: isMobile ? "top center" : "center center",
              scrub: isMobile ? 0.45 : 0.6,
            },
          });

          if (animationPreset === "slide-left") {
            tl.from(textEls, {
              opacity: 0,
              x: -40,
              filter: "blur(6px)",
              stagger: isStrong ? 0.2 : 0.12,
              ease: "none",
            });
          } else {
            tl.from(textEls, {
              opacity: 0,
              y: 48,
              filter: "blur(6px)",
              stagger: isStrong ? 0.2 : 0.12,
              ease: "none",
            });
          }
        }
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [slice.variation, slice.primary, isMobile]);

  // ParallaxTextImage variation (The Hook, Why Now, Audience & Market)
  if (slice.variation === "parallaxTextImage") {
    return (
      <section
        ref={sectionRef}
        className="relative overflow-hidden -mt-px"
      >
        {/* Background Parallax Layer */}
        {slice.primary.background_image?.url && (
          <div
            ref={bgRef}
            className="absolute inset-0 z-0 will-change-transform overflow-hidden"
          >
            <div
              ref={bgParallaxRef}
              className="absolute inset-0 -top-[22%] -bottom-[22%] -left-[6%] -right-[6%] sm:-top-[28%] sm:-bottom-[28%] sm:-left-[8%] sm:-right-[8%] md:-top-[36%] md:-bottom-[36%] md:-left-[10%] md:-right-[10%]"
            >
              <PrismicNextImage
                field={slice.primary.background_image}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Only add opacity level for background images */}
        <div
          className={
            "py-20 " +
            (slice.primary.background_image?.url ? "bg-[rgba(0,0,0,0.8)]" : "")
          }
          style={{ position: "relative", zIndex: 1 }}
        >
          <div className="grid grid-cols-[2fr_1.5fr] gap-x-8 max-w-(--max-wrapper-width) mx-auto">
            <div>
              <div className="w-[60ch]">
                <div data-pt-text>
                  <PrismicRichText
                    field={slice.primary.heading}
                    components={{
                      heading2: ({ children }) => (
                        <h2 className="mb-8 text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight text-(--heading-color)">
                          {children}
                        </h2>
                      ),
                    }}
                  />
                </div>
                <div data-pt-text>
                  <PrismicRichText
                    field={slice.primary.body}
                    components={{
                      paragraph: ({ children }) => (
                        <p className="mb-8 text-lg sm:text-xl leading-relaxed text-(--main-text-color)">
                          {children}
                        </p>
                      ),
                    }}
                  />
                </div>
                {isFilled.link(slice.primary.cta) && (
                  <div data-pt-text>
                      <PrismicNextLink
                        field={slice.primary.cta}
                        className="inline-flex items-center justify-center px-6 py-3 text-lg sm:text-xl text-(--black-primary-color) bg-(--cta-color) rounded hover:bg-transparent hover:text-(--cta-color) transition-colors duration-300 font-bold"
                      />
                  </div>
                )}
              </div>
            </div>
            <div data-pt-text>
              <PrismicNextImage
                field={slice.primary.main_image}
                className="rounded shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

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
}
