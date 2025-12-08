"use client"
// Prismic
import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
// React
import { type FormEvent } from "react";

/**
 * Component for "PasswordForm" Slices.
 */
type PasswordFormContext = {
  showPasswordForm: boolean;
  passwordIsCorrect: boolean;
  onSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void> | void;
  password: string;
  setPassword: (p: string) => void;
  isError: boolean;
  isIncorrectPassword: boolean;
  name: string;
  setName: (n: string) => void;
  email: string;
  setEmail: (e: string) => void;
  phoneNumber: string;
  setPhoneNumber: (p: string) => void;
  companyName: string;
  setCompanyName: (c: string) => void;
  message: string;
  setMessage: (m: string) => void;
  accessFormSubmitted: boolean;
};

type PasswordFormProps = SliceComponentProps<Content.PasswordFormSlice, PasswordFormContext>;

export default function PasswordForm({ slice, context }: PasswordFormProps) {
  const {
    showPasswordForm = true,
    passwordIsCorrect = false,
    onSubmit,
    password,
    setPassword,
    isError = false,
    isIncorrectPassword = false,
    name,
    setName,
    email,
    setEmail,
    phoneNumber,
    setPhoneNumber,
    companyName,
    setCompanyName,
    message,
    setMessage,
    accessFormSubmitted = false,
  } = context ?? {} as Partial<PasswordFormContext>;

  // Password Form (consists of password input and submit button)
  // Only display if showPasswordForm is true (user wants to enter a password), password is NOT correct (user has not entered in a password OR has entered an incorrect password), and access form has NOT been submitted
  if (slice.variation === "default" && showPasswordForm && !passwordIsCorrect && !accessFormSubmitted) {
    return (
      <>
        <div>
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
                className={`w-full py-2 rounded bg-(--cta-color) hover:bg-transparent transition-colors duration-300 hover:text-(--cta-color) text-(--black-secondary-color) cursor-pointer ${isError ? "animate-shake" : ""}`}
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
  // Access Form (consists of name, email, phone number, company name, message inputs and submit button)
  // Only display if showPasswordForm is false (user wants to get access to password by submitting the access form), password is NOT correct (user has not entered in a password OR has entered an incorrect password), and access form has NOT been submitted
  if (slice.variation === "accessForm" && !showPasswordForm && !passwordIsCorrect && !accessFormSubmitted) {
    return (
      <>
        <div>
          <form onSubmit={onSubmit}>
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
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                inputMode="email"
                required
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
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                inputMode="tel"
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
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
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
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              ></textarea>
            </div>
            <div>
              <button
                type="submit"
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
          {isError && (
            <PrismicRichText
              field={slice.primary.form_unsuccessfully_submitted_text}
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
};
