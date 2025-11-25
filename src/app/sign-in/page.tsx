import { createClient } from "@/src/prismicio";
import { PrismicNextLink } from "@prismicio/next";
import { PrismicRichText } from "@prismicio/react";
import SignInForm from "./_components/form";

export default async function Page() {
  const client = createClient();
  const doc = await client.getSingle("signin");


  return (
    <div className="w-full max-w-[320px] mx-auto pt-32">
      <PrismicRichText
        field={doc.data.heading}
        components={{
          heading1: ({ children }: { children: React.ReactNode }) => (
            <h1 className="text-xl font-bold text-center text-[#161616] mb-0 mt-3">
              {children}
            </h1>
          ),
        }}
      />

      <div className="flex justify-center mb-3 mt-3 -mx-20">
        <div className="w-full border-t border-[#B5B4B5]"></div>
      </div>

      <SignInForm doc={doc} />

      <div className="mt-4 text-center">
        <PrismicNextLink
          field={doc.data.back_to_home}
          className="text-[#006f9e] text-xs hover:underline"
        />
      </div>
    </div>
  );
}
