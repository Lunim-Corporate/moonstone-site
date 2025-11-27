"use client"
import { FC } from "react";
import { asText, Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";

/**
 * Props for `ContactUs`.
 */
export type ContactUsProps = SliceComponentProps<Content.ContactUsSlice>;

/**
 * Component for "ContactUs" Slices.
 */
const ContactUs: FC<ContactUsProps> = ({ slice }) => {
  return (
    <div className="py-20">
      <div className="text-center mb-16">
        <PrismicRichText field={slice.primary.heading} />
        <PrismicRichText field={slice.primary.body} />
      </div>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* Contact Us and Opening Hours */}
          <div className="flex flex-col gap-8">
            <div className="bg-[#201e1e] rounded p-8 max-w-[50ch]">
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
                    <PrismicRichText field={item.item_info} />
                  </div>
                );
              })}
            </div>
            <div className="bg-[#201e1e] rounded p-8 max-w-[50ch]">
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
          <div className="bg-[#201e1e] rounded py-6">
            <PrismicRichText
              field={slice.primary.form_heading}
              components={{
                heading3: ({ children }) => (
                  <h3 className="mb-8 text-center">{children}</h3>
                ),
              }}
            />
            <form className="max-w-lg mx-auto">
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
                    className="bg-white w-full p-2 rounded"
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
                    className="bg-white w-full p-2 rounded"
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
                    className="bg-white w-full p-2 rounded"
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
                    className="bg-white w-full p-2 rounded"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="message" className="mb-2 block">
                  <PrismicRichText field={slice.primary.message} />
                </label>
                <textarea
                  name="message"
                  id="message"
                  className="bg-white w-full p-2 rounded"
                ></textarea>
              </div>
              <div className="text-center mt-4">
                <button className="bg-(--cta-color) text-black p-3.5 rounded cursor-pointer hover:bg-transparent hover:text-(--cta-color) transition-colors duration-300">
                  {asText(slice.primary.cta)}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
