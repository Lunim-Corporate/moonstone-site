"use client"
// React
import { FC, useState, FormEvent } from "react";
// Prismic
import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";

/**
 * Props for `ContactUs`.
 */
export type ContactUsProps = SliceComponentProps<Content.ContactUsSlice>;

/**
 * Component for "ContactUs" Slices.
 */
const ContactUs: FC<ContactUsProps> = ({ slice }) => {

  const [name, setName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setSuccess(false)
    try {
      const res = await fetch("/api/email/general-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phoneNumber,
          companyName,
          message,
        }),
      })

      if (!res.ok) {
        setError(res.statusText)
        return
      }

      // success - clear form
      setSuccess(true)
      setName("")
      setEmail("")
      setPhoneNumber("")
      setCompanyName("")
      setMessage("")
    } catch (err) {
      console.error(err)
      setError("An error occurred. Please try again.")
    }
  }

  return (
    <div className="py-20 bg-(--black-primary-color)">
      <div className="text-center mb-16">
        <PrismicRichText field={slice.primary.heading} />
        <PrismicRichText field={slice.primary.body} />
      </div>
      <div className="max-w-(--max-wrapper-width) mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* Contact Us and Opening Hours */}
          <div className="flex flex-col gap-8">
            <div className="bg-(--black-primary-color) rounded p-8 max-w-[50ch]">
              <div className="mb-8">
                <PrismicRichText
                  field={slice.primary.contact_us_heading}
                  components={{
                    heading3: ({ children }) => (
                      <h3 className="mb-2">{children}</h3>
                    ),
                  }}
                />
                <PrismicRichText field={slice.primary.contact_us_body} />
              </div>
              {slice.primary.contact_us_items.map((item, index) => {
                return (
                  <div key={index} className="ms-8 mb-4 last:mb-0">
                    <PrismicRichText
                      field={item.item_info}
                      components={{
                        // Detects phone-like strings even if they contain spaces, parentheses or dashes
                        // (e.g. "020 3051 9057", "(020)-3051-9057" → digits = "02030519057").
                        // Prevents hydrataion errors by ensuring the href is consistent between server and client.
                        paragraph: ({ children, text }) => {
                          const raw = (text ?? "").trim();
                          const digits = raw.replace(/\D/g, ""); // remove non-digits
                          if (/^\d{8,12}$/.test(digits)) {
                            // 8–12 numeric digits
                            const telHref = `tel:${digits}`; // normalized href (no spaces)
                            return <a href={telHref}>{raw}</a>;
                          }
                          if (raw.includes("@")) {  // rudimentary email check
                            const mailtoHref = `mailto:${raw}`;
                            return <a href={mailtoHref}>{raw}</a>;
                          }
                          return <span>{children}</span>;
                        },
                      }}
                    />
                  </div>
                );
              })}
            </div>
            <div className="bg-(--black-primary-color) rounded p-8 max-w-[50ch]">
              <PrismicRichText
                field={slice.primary.office_hours_heading}
                components={{
                  heading2: ({ children }) => (
                    <h2 className="mb-2">{children}</h2>
                  ),
                }}
              />
              {slice.primary.times.map((time, index) => {
                return (
                  <div
                    key={index}
                    className="flex justify-between border-b-2 last:border-none py-4"
                  >
                    <div>
                      <PrismicRichText field={time.days} />
                    </div>
                    <div>
                      <PrismicRichText field={time.hours} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Contact Us Form */}
          <div className="bg-(--black-primary-color) rounded py-6">
            <PrismicRichText
              field={slice.primary.form_heading}
              components={{
                heading3: ({ children }) => (
                  <h3 className="mb-8 text-center">{children}</h3>
                ),
              }}
            />
            <form className="max-w-lg mx-auto" onSubmit={handleSubmit}>
              {/* Row 1: Name and Email */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block mb-2">
                    <PrismicRichText field={slice.primary.full_name} />
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
                  <label className="block mb-2">
                    <PrismicRichText field={slice.primary.email} />
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
                  <label className="block mb-2">
                    <PrismicRichText field={slice.primary.phone_number} />
                  </label>
                  <input
                    type="text"
                    name="phone-number"
                    id="phone-number"
                    className="w-full p-2 rounded border"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    inputMode="tel"
                  />
                </div>
                <div>
                  <label className="block mb-2">
                    <PrismicRichText field={slice.primary.company_name} />
                  </label>
                  <input
                    type="text"
                    name="company-name"
                    id="company-name"
                    className="w-full p-2 rounded border"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
              </div>
              {/* Row 3: Message */}
              <div>
                <label htmlFor="message" className="mb-2 block">
                  <PrismicRichText field={slice.primary.message} />
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
              {success && (
                <div className="text-green-500 mt-4 text-center">
                  <PrismicRichText
                    field={slice.primary.email_success_message}
                  />
                </div>
              )}
              {error && (
                <div className="text-red-500 mt-4 text-center">
                  {/* <PrismicRichText
                    field={slice.primary.email_error_message}
                  /> */}
                  {error}
                </div>
              )}
              {/* End Row 3 */}
              <div className="text-center mt-4">
                  <PrismicRichText
                    field={slice.primary.cta}
                    components={{
                      paragraph: ({ children }) => (
                        <button className="bg-(--cta-color) text-(--black-primary-color) p-3.5 rounded cursor-pointer hover:bg-transparent hover:text-(--cta-color) transition-colors duration-300"
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
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
