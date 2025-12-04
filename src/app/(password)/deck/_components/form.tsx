"use client"
// Prismic
import { PrismicRichText, SliceZone } from "@prismicio/react";
// components map is imported inside the client wrapper to avoid passing functions to client components
import { components } from "@/src/slices";
// React
import { useEffect, useRef, useState } from "react";
import { PageDocumentDataSlicesSlice } from "@/prismicio-types";

export default function Form({ slices }: { slices: unknown[] }) {
  const [showPasswordForm, setShowPasswordForm] = useState(true);
  const passwordFormToggle = useRef<HTMLDivElement | null>(null);
  const accessFormToggle = useRef<HTMLDivElement | null>(null);

  const accessFormSlice = slices.find((slice: unknown) => (slice as PageDocumentDataSlicesSlice).variation === "accessForm") as PageDocumentDataSlicesSlice;
  const defaultSlice = slices.find((slice: unknown) => (slice as PageDocumentDataSlicesSlice).variation === "default") as PageDocumentDataSlicesSlice;

  const activeClass = "inset-ring-2 inset-ring-cyan-300/60 scale-105";
  const inactiveClass = "bg-transparent";

  // Keyboard accessibility for toggling forms
  useEffect(() => {
    const toggleFormState = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (!showPasswordForm) setShowPasswordForm(true);
      }
    }
    const currentElement = passwordFormToggle.current;
    currentElement?.addEventListener("keydown", (e) => toggleFormState(e));
    return () => currentElement?.removeEventListener("keydown", (e) => toggleFormState(e));
    }, [passwordFormToggle, showPasswordForm]);
  
  useEffect(() => {
    const toggleFormState = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (showPasswordForm) setShowPasswordForm(false);
      }
    }
    const currentElement = accessFormToggle.current;
    currentElement?.addEventListener("keydown", e => toggleFormState(e));
    return () => currentElement?.removeEventListener("keydown", e => toggleFormState(e));
    }, [accessFormToggle, showPasswordForm]);

  return (
    <>
      <div className="p-8 inset-ring-1 inset-ring-cyan-300/20 rounded backdrop-blur-xl">
        <div className="flex flex-col md:flex-row justify-around py-6 gap-6 mb-5">
          {/* Password Form toggle */}
          <div
            className={`rounded-2xl p-4 transform transition-transform duration-200 hover:scale-105 focus:scale-105 cursor-pointer ${
              showPasswordForm ? activeClass : inactiveClass
            }`}
            tabIndex={0}
            ref={passwordFormToggle}
            onClick={() => {
              if (!showPasswordForm) setShowPasswordForm(true);
            }}
          >
            <PrismicRichText
              field={defaultSlice?.primary && 'subtitle' in defaultSlice.primary ? defaultSlice.primary.subtitle : null}
              components={{
                heading2: ({ children }) => (
                  <h2 className="mb-2 text-xl">{children}</h2>
                ),
              }}
            />
            <PrismicRichText
              field={defaultSlice?.primary && 'body' in defaultSlice.primary ? defaultSlice.primary.body : null}
              components={{
                heading3: ({ children }) => (
                  <p className="mb-6 text-sm">{children}</p>
                ),
              }}
            />
          </div>
          {/* Access Form Toggle */}
          <div
            className={`rounded-2xl p-4 transform transition-transform duration-200 hover:scale-105 focus:scale-105 cursor-pointer ${
              !showPasswordForm ? activeClass : inactiveClass
            }`}
            tabIndex={0}
            ref={accessFormToggle}
            onClick={() => {
              if (showPasswordForm) setShowPasswordForm(false);
            }}
          >
            <PrismicRichText
              field={accessFormSlice?.primary && 'subtitle' in accessFormSlice.primary ? accessFormSlice.primary.subtitle : null}
              components={{
                heading2: ({ children }) => (
                  <h2 className="mb-2 text-xl">{children}</h2>
                ),
              }}
            />
            <PrismicRichText
              field={accessFormSlice?.primary && 'body' in accessFormSlice.primary ? accessFormSlice.primary.body : null}
              components={{
                heading3: ({ children }) => (
                  <p className="mb-6 text-sm">{children}</p>
                ),
              }}
            />
          </div>
        </div>
        <SliceZone
          // @ts-expect-error: slices come from Prismic and are compatible with SliceZone
          slices={slices}
          components={components}
          context={showPasswordForm}
        />
      </div>
    </>
  );
}
