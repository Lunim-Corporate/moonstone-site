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
  isError: string;
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
    isError = "",
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
          <form onSubmit={onSubmit} className="max-w-lg mx-auto">
            <div className="mb-6">
              <label htmlFor="password" className="block mb-2 text-white">
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
                className="w-full p-2 rounded border"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {/* Error NOT relating to incorrect password */}
            {isError && !isIncorrectPassword && (
              <div className="text-red-500 mt-4 text-left">
                {isError}
              </div>
            )}
            {/* Error relating to incorrect password */}
            {isError && isIncorrectPassword && (
              <div className="text-red-500 mt-4 text-left">
                <PrismicRichText
                  field={slice.primary.password_incorrect_text}
                />
              </div>
            )}
            <div className="text-left mt-4">
              <PrismicRichText
                field={slice.primary.cta_label}
                components={{
                  paragraph: ({ children }) => (
                    <button
                      className="bg-(--cta-color) text-(--black-primary-color) p-3.5 rounded cursor-pointer hover:bg-(--cta-color)/70 transition-colors duration-300"
                      type="submit"
                    >
                      {children}
                    </button>
                  ),
                }}
              />
            </div>
          </form>
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
          <form onSubmit={onSubmit} className="max-w-lg mx-auto">
            {/* Row 1: Name and Email */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="full-name" className="block mb-2 text-white">
                  <PrismicRichText field={slice.primary.full_name_label} />
                </label>
                <input
                  type="text"
                  name="full-name"
                  id="full-name"
                  className="w-full p-2 rounded border"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block mb-2 text-white">
                  <PrismicRichText field={slice.primary.email_label} />
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="w-full p-2 rounded border"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  inputMode="email"
                  required
                />
              </div>
            </div>
            {/* Row 2: Phone Number and Company Name */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="phone_number" className="block mb-2 text-white">
                  <PrismicRichText field={slice.primary.phone_number_label} />
                </label>
                <input
                  type="text"
                  name="phone_number"
                  id="phone_number"
                  className="w-full p-2 rounded border"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  inputMode="tel"
                />
              </div>
              <div>
                <label htmlFor="company_name" className="block mb-2 text-white">
                  <PrismicRichText field={slice.primary.company_name_label} />
                </label>
                <input
                  type="text"
                  name="company_name"
                  id="company_name"
                  className="w-full p-2 rounded border"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
            </div>
            {/* Row 3: Message */}
            <div>
              <label htmlFor="message" className="mb-2 block text-white">
                <PrismicRichText field={slice.primary.message_label} />
              </label>
              <textarea
                name="message"
                id="message"
                className="w-full p-2 rounded border"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              ></textarea>
            </div>
            {isError && (
              <div className="text-red-500 mt-4 text-left">
                <PrismicRichText field={slice.primary.form_unsuccessfully_submitted_text} />
              </div>
            )}
            {/* End Row 3 */}
            <div className="text-left mt-4">
              <PrismicRichText
                field={slice.primary.cta_label}
                components={{
                  paragraph: ({ children }) => (
                    <button
                      className="bg-(--cta-color) text-(--black-primary-color) p-3.5 rounded cursor-pointer hover:bg-(--cta-color)/70 transition-colors duration-300"
                      type="submit"
                    >
                      {children}
                    </button>
                  ),
                }}
              />
            </div>
          </form>
        </div>
      </>
    );
  }
};
