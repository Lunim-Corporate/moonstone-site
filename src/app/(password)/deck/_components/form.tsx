"use client"
// Prismic
import { PrismicRichText, SliceZone } from "@prismicio/react";
import { Content, RichTextField } from "@prismicio/client";
// components map is imported inside the client wrapper to avoid passing functions to client components
import { components } from "@/src/slices";
// React
import { useEffect, useRef, useState } from "react";
import type { ComponentProps } from "react";
// Next
import Link from "next/link";

type SliceZoneSlices = ComponentProps<typeof SliceZone>["slices"];

export default function Form({ slices }: { slices: SliceZoneSlices }) {
  const [showPasswordForm, setShowPasswordForm] = useState<boolean>(true);
  const passwordFormToggle = useRef<HTMLDivElement | null>(null);
  const accessFormToggle = useRef<HTMLDivElement | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [isIncorrectPassword, setIsIncorrectPassword] = useState<boolean>(false);
  const [protectedLink, setProtectedLink] = useState<string>("");
  // Access form variables
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const isPasswordFormSlice = (s: unknown): s is Content.PasswordFormSlice => {
    if (typeof s !== "object" || s === null) return false;
    const record = s as Record<string, unknown>;
    return record.slice_type === "password_form";
  };

  const safeSlices = slices ?? [];

  const accessFormSlice = safeSlices.find(
    (s): s is Content.PasswordFormSlice => isPasswordFormSlice(s) && s.variation === "accessForm"
  );

  const defaultSlice = safeSlices.find(
    (s): s is Content.PasswordFormSlice => isPasswordFormSlice(s) && s.variation === "default"
  );

  const activeClass = "inset-ring-2 inset-ring-cyan-300/60 scale-105";
  const inactiveClass = "bg-transparent";

  // Keyboard accessibility for toggling forms
  useEffect(() => {
    const handleKeyDownOnPasswordToggle = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (!showPasswordForm) setShowPasswordForm(true);
      }
    };

    const element = passwordFormToggle.current;
    if (element) element.addEventListener("keydown", handleKeyDownOnPasswordToggle);
    return () => {
      if (element) element.removeEventListener("keydown", handleKeyDownOnPasswordToggle);
    };
  }, [passwordFormToggle, showPasswordForm]);

  useEffect(() => {
    const handleKeyDownOnAccessToggle = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (showPasswordForm) setShowPasswordForm(false);
      }
    };

    const element = accessFormToggle.current;
    if (element) element.addEventListener("keydown", handleKeyDownOnAccessToggle);
    return () => {
      if (element) element.removeEventListener("keydown", handleKeyDownOnAccessToggle);
    };
  }, [accessFormToggle, showPasswordForm]);
    
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!password) return;
  
      setIsIncorrectPassword(false);
      setIsError(false);

    if (showPasswordForm) {
      try {
        const res = await fetch("/api/check-pasword", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        });
  
        if (!res.ok) {
          setIsError(true);
          return;
        }
  
        const data = await res.json();
  
        if (data?.valid) { // password correct
          if (!data?.link) { // link missing
            setIsError(true);
            return;
          }
          setIsSuccess(true);
          setProtectedLink(data.link);
        } else { // password incorrect
          setIsError(true);
          setIsIncorrectPassword(true);
        }
      } catch {
        setIsError(true);
      }
      // Access form submission
    } else {
        try {
          const res = await fetch("/api/email/password-access", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, phoneNumber, companyName, message }),
          });

          if (!res.ok) {
            setIsError(true);
            return;
          }

          const data = await res.json();

          if (data?.valid) {
            // password correct
            if (!data?.link) {
              // link missing
              setIsError(true);
              return;
            }
            setIsSuccess(true);
            setProtectedLink(data.link);
          } else {
            // password incorrect
            setIsError(true);
            setIsIncorrectPassword(true);
          }
        } catch {
          setIsError(true);
        }
    }
    };

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
              field={
                defaultSlice?.primary && "subtitle" in defaultSlice.primary
                  ? defaultSlice.primary.subtitle
                  : null
              }
              components={{
                heading2: ({ children }) => (
                  <h2 className="mb-2 text-xl">{children}</h2>
                ),
              }}
            />
            <PrismicRichText
              field={
                defaultSlice?.primary && "body" in defaultSlice.primary
                  ? defaultSlice.primary.body
                  : null
              }
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
              field={
                accessFormSlice?.primary &&
                "subtitle" in accessFormSlice.primary
                  ? accessFormSlice.primary.subtitle
                  : null
              }
              components={{
                heading2: ({ children }) => (
                  <h2 className="mb-2 text-xl">{children}</h2>
                ),
              }}
            />
            <PrismicRichText
              field={
                accessFormSlice?.primary && "body" in accessFormSlice.primary
                  ? accessFormSlice.primary.body
                  : null
              }
              components={{
                heading3: ({ children }) => (
                  <p className="mb-6 text-sm">{children}</p>
                ),
              }}
            />
          </div>
        </div>
        <SliceZone
          slices={slices}
          components={components}
          context={{ showPasswordForm, isSuccess, onSubmit, password, setPassword, isError, isIncorrectPassword, name, setName, email, setEmail, phoneNumber, setPhoneNumber, companyName, setCompanyName, message, setMessage }}
        />
        {/* Password Success */}
        {isSuccess && (
          <div>
            <PrismicRichText
              field={
                defaultSlice?.primary &&
                "password_correct_text" in defaultSlice.primary
                  ? (defaultSlice.primary.password_correct_text as RichTextField)
                  : null
              }
              components={{
                paragraph: ({ children }) => (
                  <p className="text-green-500 text-center mt-4" role="alert">
                    {children}
                  </p>
                ),
              }}
            />
            <Link
              href={protectedLink}
              target="_blank"
              className="block font-bold mt-4 w-full py-2 rounded bg-(--cta-color) text-(--black-secondary-color) hover:bg-transparent hover:text-(--cta-color) transition-colors duration-500 cursor-pointer text-center"
            >
              <PrismicRichText
                field={
                  defaultSlice?.primary &&
                  "success_cta_label" in defaultSlice.primary
                    ? (defaultSlice.primary.success_cta_label as RichTextField)
                    : null
                }
                components={{
                  paragraph: ({ children }) => <span>{children}</span>,
                }}
              />
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
