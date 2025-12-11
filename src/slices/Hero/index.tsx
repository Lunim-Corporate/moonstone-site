"use client";
import React from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Content, ImageField } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { motion } from "framer-motion";
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamically import the 3D gem to avoid SSR issues
const Gem3D = dynamic(() => import("@/components/Gem3D"), { 
  ssr: false,
  loading: () => <SimpleGemLoading />
});

// Simple gem loading component
const SimpleGemLoading = () => (
  <div className="w-full h-full flex items-center justify-center z-10">
    <div className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center">
      <div className="absolute inset-0 rounded-full bg-[#FFCF3C]/25 blur-2xl animate-pulse z-0"></div>
      <div 
        className="relative w-full h-full rounded-full bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600 z-10 shadow-lg"
        style={{
          clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          transform: 'rotate(45deg)',
          boxShadow: '0 0 30px rgba(255, 207, 60, 0.7)'
        }}
      >
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
      </div>
    </div>
  </div>
);

// Simple gem fallback component
const SimpleGem = dynamic(() => import("@/components/SimpleGem"), { 
  ssr: false 
});

// Error boundary component for handling 3D rendering errors
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    console.error("Gem3D Error:", error);
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI with simple gem
      return <SimpleGem />;
    }

    return this.props.children;
  }
}

// Random character animation component
const RandomAnimatedText = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => {
  const [displayedChars, setDisplayedChars] = useState<Array<{ char: string; visible: boolean }>>([]);
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Initialize characters with visibility set to false
    const initialChars = Array.from(text).map(char => ({ char, visible: false }));
    
    // Set initial state after a microtask to avoid synchronous setState warning
    Promise.resolve().then(() => {
      setDisplayedChars(initialChars);
    });

    // Animate characters randomly
    const timeouts: NodeJS.Timeout[] = [];
    const indices = [...Array(initialChars.length).keys()];
    
    // Shuffle indices for random appearance
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    indices.forEach((index, shuffledIndex) => {
      const timeout = setTimeout(() => {
        setDisplayedChars(prev => {
          const newChars = [...prev];
          newChars[index] = { ...newChars[index], visible: true };
          return newChars;
        });
      }, shuffledIndex * 80 + Math.random() * 100); // Random delay for more natural effect
      
      timeouts.push(timeout);
    });

    // Cleanup timeouts
    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [text]);

  return (
    <motion.span
      ref={containerRef}
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {displayedChars.map((item, index) => (
        <motion.span
          key={index}
          className="inline-block"
          initial={{ opacity: 0, y: "20px" }}
          animate={{ 
            opacity: item.visible ? 1 : 0, 
            y: item.visible ? "0px" : "20px" 
          }}
          transition={{ 
            duration: 0.4, 
            ease: "easeOut",
            delay: item.visible ? 0.1 : 0
          }}
        >
          {item.char === " " ? "\u00A0" : item.char}
        </motion.span>
      ))}
    </motion.span>
  );
};

/**
 * Props for `Hero`.
 */
export type HeroProps = SliceComponentProps<Content.HeroSlice>;

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
                <RandomAnimatedText
                  text={topTitle}
                  className="block text-[clamp(1.8rem,3vw,2.5rem)] tracking-[0.32em] text-[#F7EBC5] uppercase drop-shadow-[0_0_20px_rgba(0,0,0,0.9)]"
                />
              )}
              {mainTitle && (
                <RandomAnimatedText
                  text={mainTitle}
                  className="mt-1 block text-[clamp(4rem,8vw,6rem)] tracking-[0.2em] text-[#F7EBC5] uppercase drop-shadow-[0_0_26px_rgba(0,0,0,1)] font-semibold"
                />
              )}
              {bottomTitle && (
                <RandomAnimatedText
                  text={bottomTitle}
                  className="mt-1 block text-[clamp(2rem,3.5vw,2.8rem)] tracking-[0.28em] text-[#F7EBC5] uppercase drop-shadow-[0_0_20px_rgba(0,0,0,0.9)]"
                />
              )}
            </div>
          )}

          <div
            ref={gemRef}
            className="mt-16 md:mt-20 w-full h-64 md:h-80 flex items-center justify-center relative z-20"
          >
            <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
              <div className="absolute inset-0 -z-10 rounded-full bg-[#FFCF3C]/25 blur-3xl animate-pulse" />
              {primary.moonstone_image ? (
                <PrismicNextImage
                  field={primary.moonstone_image}
                  fill
                  className="object-contain z-0"
                />
              ) : (
                <div className="w-full h-full relative flex items-center justify-center z-10" style={{ minHeight: '200px' }}>
                  <Suspense fallback={<SimpleGemLoading />}>
                    <ErrorBoundary>
                      <Gem3D />
                    </ErrorBoundary>
                  </Suspense>
                  {/* Fallback in case both 3D gem and suspense fail */}
                  <noscript>
                    <SimpleGem />
                  </noscript>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
