"use client"
// Prismic
import { Content } from "@prismicio/client";
import { useEffect, useState, type FormEvent } from "react";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";

/**
 * Component for "PasswordForm" Slices.
 */
type PasswordFormContext = {
  showPasswordForm: boolean;
  isSuccess: boolean;
  onSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void> | void;
  password: string;
  setPassword: (p: string) => void;
  isError: boolean;
  isIncorrectPassword: boolean;
};

type PasswordFormProps = SliceComponentProps<Content.PasswordFormSlice, PasswordFormContext>;

export default function PasswordForm({ slice, context }: PasswordFormProps) {
  const {
    showPasswordForm = true,
    isSuccess = false,
    onSubmit,
    password,
    setPassword,
    isError = false,
    isIncorrectPassword = false,
  } = context ?? {} as Partial<PasswordFormContext>;

  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    if (!isError) return;
    const shakeTimeout = setTimeout(() => setIsShaking(true), 0);
    const resetTimeout = setTimeout(() => setIsShaking(false), 800);
    return () => {
      clearTimeout(shakeTimeout);
      clearTimeout(resetTimeout);
    };
  }, [isError]);

  if (slice.variation === "default" && showPasswordForm && !isSuccess) {
    return (
      <>
        <div className="">
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
                className={`w-full py-2 rounded bg-(--cta-color) hover:bg-transparent transition-colors duration-300 hover:text-(--cta-color) text-(--black-secondary-color) cursor-pointer ${isShaking ? "animate-shake" : ""}`}
              >
                <PrismicRichText
                  field={slice.primary.cta_label}
                  components={{
                    paragraph: ({ children }) => <span>{children}</span>,
                  }}
                />
              </button>
            </div>
          </form>
          {/* Error NOT relating to incorrect password */}
          {isError && !isIncorrectPassword && (
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
          {/* Error relating to incorrect password */}
          {isError && isIncorrectPassword && (
            <PrismicRichText
              field={slice.primary.password_incorrect_text}
              components={{
                paragraph: ({ children }) => (
                  <p className="text-red-500 text-center mt-4" role="alert">
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
  if (slice.variation === "accessForm" && !showPasswordForm && !isSuccess) {
    return (
      <>
        <div className="">
          <form>
            <div className="mb-6">
              <label htmlFor="full-name">
                <PrismicRichText
                  field={slice.primary.full_name_label}
                  components={{
                    paragraph: ({ children }) => <span>{children}</span>,
                  }}
                />
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
                  }}
                />
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
                  }}
                />
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
                  }}
                />
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
                  }}
                />
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
                <PrismicRichText
                  field={slice.primary.cta_label}
                  components={{
                    paragraph: ({ children }) => <span>{children}</span>,
                  }}
                />
              </button>
            </div>
          </form>
        </div>
      </>
    );
  }
};
