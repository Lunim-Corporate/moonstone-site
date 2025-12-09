"use client";
import { useEffect, useLayoutEffect, useRef } from "react";
import { Content, ImageField } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
import { motion } from "framer-motion";

/**
 * Props for `Hero`.
 */
export type HeroProps = SliceComponentProps<Content.HeroSlice>;

const AnimatedText = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => {
  const letters = Array.from(text);

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.035 },
    },
  };

  const child = {
    hidden: { opacity: 0, y: "0.3em" },
    visible: {
      opacity: 1,
      y: "0em",
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <motion.span
      className={className}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {letters.map((char, index) => (
        <motion.span
          key={index}
          variants={child}
          style={{ display: "inline-block" }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.span>
  );
};

/**
 * Component for "Hero" Slices.
 */
export default function Hero({ slice }: HeroProps) {
  const primary = slice.primary as typeof slice.primary & {
    moonstone_image?: ImageField;
    top_title?: string | null;
    main_title?: string | null;
    bottom_title?: string | null;
  };

  const topTitle = primary.top_title ?? "";
  const mainTitle = primary.main_title ?? "";
  const bottomTitle = primary.bottom_title ?? "";
  const rootRef = useRef<HTMLDivElement | null>(null);
  const backgroundRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLDivElement | null>(null);
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const gemRef = useRef<HTMLDivElement | null>(null);

  // Global smooth scrolling with Lenis (guarded so it's only initialised once)
  useEffect(() => {
    if (typeof window === "undefined") return;

    if ((window as unknown as { __lenis?: Lenis }).__lenis) {
      return;
    }

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
    });

    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    let frameId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    };

    frameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
      (window as unknown as { __lenis?: Lenis }).__lenis = undefined;
    };
  }, []);

  useLayoutEffect(() => {
    if (!rootRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const root = rootRef.current;
      const bg = backgroundRef.current;
      const title = titleRef.current;
      const gem = gemRef.current;

      const tl = gsap.timeline({
        defaults: {
          duration: 1.2,
          ease: "power3.out",
        },
      });

      if (bg) {
        tl.from(bg, {
          opacity: 0,
          scale: 1.1,
          yPercent: 10,
        }, 0);
      }

      if (gem) {
        tl.from(gem, {
          opacity: 0,
          y: 80,
          scale: 0.8,
        }, 0.15);
      }

      if (gem) {
        gsap.to(gem, {
          y: "-=12",
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      if (bg && root) {
        gsap.to(bg, {
          yPercent: 12,
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      if (title && root) {
        gsap.to(title, {
          yPercent: -10,
          scrollTrigger: {
            trigger: root,
            start: "top center",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      if (gem && root) {
        gsap.to(gem, {
          yPercent: -18,
          scrollTrigger: {
            trigger: root,
            start: "top center",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      if (root) {
        gsap.to(root, {
          opacity: 0,
          scrollTrigger: {
            trigger: root,
            start: "bottom top+=150",
            end: "bottom top-=50",
            scrub: true,
          },
        });
      }
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative h-[100vh] w-full overflow-hidden"
      aria-label="Moonstone hero section"
    >
      <div
        ref={backgroundRef}
        className="absolute inset-0 -z-20 will-change-transform"
        style={{ transform: "translateZ(-120px)" }}
      >
        {slice.primary.background_image && (
          <PrismicNextImage
            field={slice.primary.background_image}
            fill
            preload={true}
            className="object-cover object-center"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/30 to-[#020b18]" />
      </div>

      <div className="relative z-0 flex h-full items-center justify-center pt-28 pb-16 md:pt-36 md:pb-20">
        <div className="flex max-w-5xl flex-col items-center px-6 text-center sm:px-8">
          {(topTitle || mainTitle || bottomTitle) && (
            <div
              ref={titleRef}
              className="mb-6 md:mb-8 leading-tight"
              style={{ fontFamily: "var(--font-lora)" }}
            >
              {topTitle && (
                <AnimatedText
                  text={topTitle}
                  className="block text-[clamp(1.4rem,2.4vw,2rem)] tracking-[0.32em] text-[#F7EBC5] uppercase drop-shadow-[0_0_20px_rgba(0,0,0,0.9)]"
                />
              )}
              {mainTitle && (
                <AnimatedText
                  text={mainTitle}
                  className="mt-1 block text-[clamp(3.2rem,6vw,4.8rem)] tracking-[0.2em] text-[#F7EBC5] uppercase drop-shadow-[0_0_26px_rgba(0,0,0,1)] font-semibold"
                />
              )}
              {bottomTitle && (
                <AnimatedText
                  text={bottomTitle}
                  className="mt-1 block text-[clamp(1.6rem,2.8vw,2.2rem)] tracking-[0.28em] text-[#F7EBC5] uppercase drop-shadow-[0_0_20px_rgba(0,0,0,0.9)]"
                />
              )}
            </div>
          )}

          <div
            ref={gemRef}
            className="mt-16 md:mt-20"
            style={{ transform: "translateZ(80px)" }}
          >
            <div className="relative mx-auto h-20 w-20 md:h-28 md:w-28">
              <div className="absolute inset-0 -z-10 rounded-full bg-[#FFCF3C]/25 blur-3xl" />
              {primary.moonstone_image && (
                <PrismicNextImage
                  field={primary.moonstone_image}
                  fill
                  className="object-contain"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
