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
  const imageGridRef = useRef<HTMLDivElement>(null);
  const defaultBgRef = useRef<HTMLDivElement>(null);
  const defaultBgParallaxRef = useRef<HTMLDivElement>(null);
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
            if (typeof window === "undefined") return 30;
            return window.innerWidth < 640 ? 15 : 30;
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
                scrub: 0.8,
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

          // Separate text elements from image
          const textOnlyEls = Array.from(textEls).filter(el =>
            !el.querySelector('img') && el.tagName !== 'IMG'
          );
          const imageEl = Array.from(textEls).find(el =>
            el.querySelector('img') || el.tagName === 'IMG'
          );

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current!,
              start: isMobile ? "top bottom" : "top 90%",
              end: isMobile ? "top center" : "center center",
              scrub: isMobile ? 0.45 : 0.6,
            },
          });

          // Animate text with movement
          if (textOnlyEls.length) {
            if (animationPreset === "slide-left") {
              tl.from(textOnlyEls, {
                opacity: 0,
                x: -40,
                filter: "blur(6px)",
                stagger: isStrong ? 0.2 : 0.12,
                ease: "none",
              }, 0);
            } else {
              tl.from(textOnlyEls, {
                opacity: 0,
                y: 48,
                filter: "blur(6px)",
                stagger: isStrong ? 0.2 : 0.12,
                ease: "none",
              }, 0);
            }
          }

          // Animate image with only opacity (no vertical movement)
          if (imageEl) {
            tl.from(imageEl, {
              opacity: 0,
              filter: "blur(6px)",
              ease: "none",
            }, 0);
          }
        }
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [slice.variation, slice.primary, isMobile]);

  useEffect(() => {
    if (slice.variation !== "imageAboveTextBelow") return;

    const ctx = gsap.context(() => {
      if (!imageGridRef.current) return;
      const cards = imageGridRef.current.querySelectorAll(".iat-card");
      if (!cards.length) return;

      gsap
        .timeline({
          scrollTrigger: {
            trigger: imageGridRef.current,
            start: isMobile ? "top 99%" : "top 92%",
            end: isMobile ? "top 65%" : "top 40%",
            scrub: 0.03,
          },
        })
        .from(cards, {
          opacity: 0,
          y: 30,
          filter: "blur(4px)",
          stagger: 0.12,
          ease: "none",
        });
    }, imageGridRef);

    return () => ctx.revert();
  }, [slice.variation, isMobile]);

  // GSAP animations for default variation parallax
  useEffect(() => {
    if (slice.variation !== "default") return;

    const ctx = gsap.context(() => {
      if (defaultBgRef.current && defaultBgParallaxRef.current) {
        const getParallaxRange = () => {
          if (typeof window === "undefined") return 15;
          return window.innerWidth < 640 ? 10 : 15;
        };

        gsap.fromTo(
          defaultBgParallaxRef.current,
          { yPercent: () => -getParallaxRange() },
          {
            yPercent: () => getParallaxRange(),
            ease: "none",
            force3D: true,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [slice.variation, isMobile]);

  // ParallaxTextImage variation (The Hook, Why Now, Audience & Market)
  if (slice.variation === "parallaxTextImage") {
    return (
      <section
        ref={sectionRef}
        className="relative overflow-hidden -mt-px bg-[#03070f]"
        style={{ WebkitMaskImage: 'linear-gradient(to bottom, transparent, #03070f 6%, #03070f 94%, transparent)', maskImage: 'linear-gradient(to bottom, transparent, #03070f 6%, #03070f 94%, transparent)' }}
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
            slice.primary.background_image?.url ? "bg-[rgba(0,0,0,0.5)]" : ""
          }
          style={{ position: "relative", zIndex: 1 }}
        >
          <div className="grid grid-cols-[2fr_1.5fr] gap-x-8 max-w-(--max-wrapper-width) mx-auto">
            <div className="pt-20">
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
      <section
        ref={sectionRef}
        className="relative overflow-hidden -mt-px bg-[#03070f]"
        style={{ WebkitMaskImage: 'linear-gradient(to bottom, transparent, #03070f 6%, #03070f 94%, transparent)', maskImage: 'linear-gradient(to bottom, transparent, #03070f 6%, #03070f 94%, transparent)' }}
      >
        {/* Background Parallax Layer */}
        {slice.primary.background_image?.url && (
          <div
            ref={defaultBgRef}
            className="absolute inset-0 z-0 will-change-transform overflow-hidden"
          >
            <div
              ref={defaultBgParallaxRef}
              className="absolute inset-0 -top-[15%] -bottom-[15%] -left-[5%] -right-[5%] sm:-top-[20%] sm:-bottom-[20%] sm:-left-[7%] sm:-right-[7%]"
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
      </section>
    );
  }
  // Comparables, Synopsis
  if (slice.variation === "imageAboveTextBelow") {
    return (
      <section
        ref={sectionRef}
        className="bg-cover bg-center relative -mt-px bg-[#03070f]"
        style={{
          backgroundImage: `url(${slice.primary.background_image?.url})`,
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, #03070f 6%, #03070f 94%, transparent)',
          maskImage: 'linear-gradient(to bottom, transparent, #03070f 6%, #03070f 94%, transparent)'
        }}
      >
        {isFilled.image(slice.primary.seconday_background_image) && (
          <div
            className="bg-cover bg-bottom h-100"
            style={{
              backgroundImage: `url(${slice.primary.seconday_background_image?.url})`,
            }}
          ></div>
        )}
        <div
          className={
            "py-20 " +
            (slice.primary.background_image?.url ? "bg-[rgba(0,0,0,0.8)]" : "")
          }
        >
          <div className="max-w-(--max-wrapper-width) mx-auto">
            <PrismicRichText
              field={slice.primary.heading}
              components={{
                heading2: ({ children }) => (
                  <h2 className="mb-10">{children}</h2>
                ),
              }}
            />
            <div
              ref={imageGridRef}
              className="grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-x-10 my-counter"
            >
              {slice.primary.item.map((item, idx) => {
                return (
                  <div key={idx} className="iat-card flex flex-col">
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
      </section>
    );
  }
}
