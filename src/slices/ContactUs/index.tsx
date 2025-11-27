"use client"
import { FC } from "react";
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
  return (
    <div>
      <PrismicRichText field={slice.primary.heading} />
      <PrismicRichText field={slice.primary.body} />
      <div className="grid grid-cols-2 gap-4">
        {/* Contact Us and Opening Hours */}
        <div className="flex flex-col">
          <div>
            <PrismicRichText field={slice.primary.contact_us_heading} />
            <PrismicRichText field={slice.primary.contact_us_body} />
            {slice.primary.contact_us_items.map((item, index) => {
              return (
                <div key={index}>
                  <PrismicRichText field={item.item_info} />
                </div>
              );
            })}
          </div>
          <div>
            <PrismicRichText field={slice.primary.office_hours_heading} />
            {slice.primary.times.map((time, index) => {
              return (
                <div
                  key={index}
                  className="flex justify-between border-b-2 last:border-none"
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
        <div>
          <PrismicRichText field={slice.primary.form_heading} />
          <form>
            {/* Row 1: Name and Email */}
            <div className="flex">
              <div>
                <label className="block">
                  <PrismicRichText field={slice.primary.full_name} />
                </label>
                <input type="text" name="full-name" id="full-name" />
              </div>
              <div>
                <label className="block">
                  <PrismicRichText field={slice.primary.email} />
                </label>
                <input type="email" name="email" id="email" />
              </div>
            </div>
            {/* Row 2: Phone Number and Company Name */}
            <div className="flex">
              <div>
                <label className="block">
                  <PrismicRichText field={slice.primary.phone_number} />
                </label>
                <input type="text" name="phone-number" id="phone-number" />
              </div>
              <div>
                <label className="block">
                  <PrismicRichText field={slice.primary.company_name} />
                </label>
                <input type="text" name="company-name" id="company-name" />
              </div>
            </div>
            <div>
              <label htmlFor="message">
                <PrismicRichText field={slice.primary.message} />
              </label>
              <textarea name="message" id="message"></textarea>
            </div>
            <div>
              <PrismicRichText field={slice.primary.cta} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
