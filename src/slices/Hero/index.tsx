"use client";
import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsMobile } from "../../hooks/useMediaQuery";

/**
 * Props for `Hero`.
 */
export type HeroProps = SliceComponentProps<Content.HeroSlice>;

// Register GSAP plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Component for "Hero" Slices.
 */
export default function Hero({ slice }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // GSAP animations for TransmediaHero variation
  useEffect(() => {
    if (slice.variation !== "transmediaHero") return;

    const ctx = gsap.context(() => {
      // Staggered fade-in animation
      const heroTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          end: "top 25%",
          scrub: 0.5,
        },
      });

      // Logo fade-in (if exists)
      if (logoRef.current) {
        heroTl.from(logoRef.current, {
          opacity: 0,
          y: 30,
          duration: 0.9,
        });
      }

      // Title fade-in
      if (titleRef.current) {
        heroTl.from(
          titleRef.current,
          {
            opacity: 0,
            y: 40,
            ease: "power2.out",
          },
          logoRef.current ? "-=0.6" : 0
        );
      }

      // Subtitle fade-in
      if (subtitleRef.current) {
        heroTl.from(
          subtitleRef.current,
          {
            opacity: 0,
            y: 26,
          },
          "-=0.5"
        );
      }

      // Tagline fade-in
      if (taglineRef.current) {
        heroTl.from(
          taglineRef.current,
          {
            opacity: 0,
            y: 16,
          },
          "-=0.4"
        );
      }

      // Optional parallax background effect
      const enableParallax = "enable_parallax" in slice.primary ? slice.primary.enable_parallax : false;
      if (enableParallax && backgroundRef.current) {
        gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
          },
        })
        .fromTo(
          backgroundRef.current,
          { scale: 1.04 },
          { scale: 1.0, ease: "none" }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [slice.variation, slice.primary, isMobile]);

  // TransmediaHero variation with GSAP animations
  if (slice.variation === "transmediaHero") {
    return (
      <div className="bg-black">
        <section
          ref={sectionRef}
          className="relative min-h-screen overflow-hidden -mt-px bg-black"
          style={{
            backgroundColor: "#000",
            WebkitMaskImage: 'linear-gradient(to bottom, transparent, #000 6%, #000 94%, transparent)',
            maskImage: 'linear-gradient(to bottom, transparent, #000 6%, #000 94%, transparent)'
          }}
        >
          {/* Background Image */}
          <div
            ref={backgroundRef}
            className="absolute inset-0 will-change-transform"
            style={{
              transform: "translate3d(0, 0, 0)",
            }}
          >
            <PrismicNextImage
              field={slice.primary.background_image}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-[rgba(0,0,0,0.6)]" />
          </div>

          {/* Content */}
          <div className="relative z-10 min-h-screen grid items-center">
            <div className="max-w-4xl text-center mx-auto px-4 sm:px-6 lg:px-8">
              {/* Logo */}
              {slice.primary.logo?.url && (
                <div ref={logoRef} className="mb-6">
                  <PrismicNextImage
                    field={slice.primary.logo}
                    className="w-24 h-24 mx-auto"
                  />
                </div>
              )}

              {/* Title */}
              <div ref={titleRef}>
                <PrismicRichText
                  field={slice.primary.title}
                  components={{
                    heading1: ({ children }) => (
                      <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 text-(--heading-color)">
                        {children}
                      </h1>
                    ),
                  }}
                />
              </div>

              {/* Subtitle */}
              <div ref={subtitleRef}>
                <PrismicRichText
                  field={slice.primary.subtitle}
                  components={{
                    heading2: ({ children }) => (
                      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-4 bg-linear-to-r from-(--cta-color) to-cyan-500 bg-clip-text text-transparent">
                        {children}
                      </h2>
                    ),
                  }}
                />
              </div>

              {/* Tagline */}
              <div ref={taglineRef} className="mt-16">
                <PrismicRichText
                  field={slice.primary.tagline}
                  components={{
                    paragraph: ({ children }) => (
                      <p className="text-xl sm:text-2xl lg:text-3xl text-(--main-text-color)/90 max-w-2xl mx-auto">
                        {children}
                      </p>
                    ),
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Default variation (keep existing implementation)
  return (
    <div className="bg-black">
      <div
        style={{
          backgroundImage: `url(${slice.primary.background_image.url})`,
          backgroundColor: "#000",
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, #000 6%, #000 94%, transparent)',
          maskImage: 'linear-gradient(to bottom, transparent, #000 6%, #000 94%, transparent)'
        }}
        className="bg-cover bg-center min-h-screen relative -mt-px"
      >
        <div className="min-h-screen grid items-center absolute inset-0 bg-[rgba(0,0,0,0.6)]">
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
    </div>
  );
}
