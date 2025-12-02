"use client"
import React, { useState } from "react";
// Prismic
import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";

/**
 * Component for "PasswordForm" Slices.
 */
type PasswordFormProps = SliceComponentProps<Content.PasswordFormSlice> & {
  context?: boolean
}

export default function PasswordForm({ slice, context }: PasswordFormProps) {

  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState<string>("");
  const [isIncorrectPassword, setIsIncorrectPassword] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!password) return
    setIsIncorrectPassword(false);

    try {
      const res = await fetch("/api/check-pasword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setError((body && body.error) || "Password check failed");
        return;
      }

      const data = await res.json().catch(() => null);
      if (data && data.valid) {
        const link = (data.link ?? "") as string;
        if (!link) {
          setError("Server not configured");
          return;
        }
        setError(null);
        setSuccessMessage(
          "Password correct! The pitch deck will now open in a new tab"
        );
        // Wait 5 seconds before opening the link
        await new Promise((resolve) => setTimeout(resolve, 5000));
        window.open(link, "_blank", "noopener,noreferrer");
        // Reset form
        setSuccessMessage("");
      } else {
        setError("Incorrect password");
        setIsIncorrectPassword(true);
      }
    } catch {
      setError("Network error");
    }
  }

  if (slice.variation === "default" && context) {
    return (
      <>
        <div className="p-8 bg-(--black-primary-color) rounded">
          <PrismicRichText
            field={slice.primary.subtitle}
            components={{
              heading2: ({ children }) => (
                <h2 className="mb-2 text-lg">{children}</h2>
              ),
            }}
          />
          <PrismicRichText
            field={slice.primary.body}
            components={{
              heading3: ({ children }) => (
                <p className="mb-6 text-sm">{children}</p>
              ),
            }}
          />
          <form onSubmit={onSubmit}>
            <div className="mb-6">
              <label htmlFor="password">
                <PrismicRichText
                  field={slice.primary.password_label}
                  components={{
                    paragraph: ({ children }) => <span>{children}</span>,
                  }}
                />
              </label>
              <input
                type="password"
                name="password"
                id="password"
                className="border rounded w-full mt-1.5" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full py-2 rounded bg-(--cta-color) text-(--black-secondary-color) hover:bg-transparent hover:text-(--cta-color) transition-colors duration-500 cursor-pointer"
              >
                <PrismicRichText field={slice.primary.cta_label} />
              </button>
            </div>
          </form>
          {/* Error NOT relating to incorrect password */}
          {error && (
            <p
              className="text-sm text-red-500 mb-4 text-center mt-4"
              role="alert"
            >
              {error}
            </p>
          )}
          {/* Error relating to incorrect password */}
          {error && isIncorrectPassword && (
            <PrismicRichText
              field={slice.primary.error_message}
              components={{
                paragraph: ({ children }) => (
                  <p className="text-red-500 text-center mt-4" role="alert">
                    {children}
                  </p>
                ),
              }}
            />
          )}
          {successMessage && (
            <PrismicRichText
              field={slice.primary.success_message}
              components={{
                paragraph: ({ children }) => (
                  <p className="text-green-500 text-center mt-4" role="alert">
                    {children}
                  </p>
                ),
              }}
            />
          )}
        </div>
      </>
    );
  }
  if (slice.variation === "accessForm" && !context) {
    return (
      <>
        {/* <div>
          <div className="text-center"></div>
        </div> */}
        <div className="p-8 bg-(--black-primary-color) rounded">
          <PrismicRichText
            field={slice.primary.subtitle}
            components={{
              heading2: ({ children }) => (
                <h2 className="mb-2">{children}</h2>
              ),
            }}
          />
          <PrismicRichText
            field={slice.primary.body}
            components={{
              heading3: ({ children }) => (
                <p className="mb-6">{children}</p>
              ),
            }}
          />
          <form>
            <div className="mb-6">
              <label htmlFor="full-name">
                <PrismicRichText
                  field={slice.primary.full_name_label}
                  components={{
                    paragraph: ({ children }) => <span>{children}</span>,
                  }} />
              </label>
              <input
                type="text"
                name="full-name"
                id="full-name"
                className="border rounded w-full mt-1.5"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="email">
                <PrismicRichText
                  field={slice.primary.email_label}
                  components={{
                    paragraph: ({ children }) => <span>{children}</span>,
                  }} />
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="border rounded w-full mt-1.5"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="phone_number">
                <PrismicRichText
                  field={slice.primary.phone_number_label}
                  components={{
                    paragraph: ({ children }) => <span>{children}</span>,
                  }} />
              </label>
              <input
                type="tel"
                name="phone_number"
                id="phone_number"
                className="border rounded w-full mt-1.5"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="company_name">
                <PrismicRichText
                  field={slice.primary.company_name_label}
                  components={{
                    paragraph: ({ children }) => <span>{children}</span>,
                  }} />
                  </label>
              <input
                type="text"
                name="company_name"
                id="company_name"
                className="border rounded w-full mt-1.5"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="message">
                <PrismicRichText
                  field={slice.primary.message_label}
                  components={{
                    paragraph: ({ children }) => <span>{children}</span>,
                  }} />
                  </label>
              <textarea
                name="message"
                id="message"
                className="border rounded w-full mt-1.5"
              ></textarea>
            </div>
            <div>
              <button
                type="button"
                className="w-full py-2 rounded bg-(--cta-color) text-(--black-secondary-color) hover:bg-transparent hover:text-(--cta-color) transition-colors duration-500 cursor-pointer"
              >
                <PrismicRichText field={slice.primary.cta_label} />
              </button>
            </div>
          </form>
        </div>
      </>
    );
  }
};
