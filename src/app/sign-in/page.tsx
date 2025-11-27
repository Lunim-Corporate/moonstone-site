import { createClient } from "@/src/prismicio";
import { PrismicNextLink } from "@prismicio/next";
import SignInForm from "./_components/form";

export default async function Page() {
  const client = createClient();
  const doc = await client.getSingle("signin");

  return (
    <main
      className="bg-cover bg-top"
      style={{
        backgroundImage: `url(${doc.data.background_image.url})`,
      }}
    >
      <div className="min-h-screen pt-40 bg-[rgba(0,0,0,0.8)]">
        <div className="max-w-lg mx-auto p-4">
          <SignInForm doc={doc} />

          <div className="mt-8 text-center">
            <PrismicNextLink
              field={doc.data.back_to_home}
              className="text-xs hover:underline"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
