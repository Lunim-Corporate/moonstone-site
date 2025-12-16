// Prismic
import { SliceZone } from "@prismicio/react";
import { createClient } from "../../prismicio";
import { components } from "../../slices";
// Next
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();

  try {
    const doc = await client.getSingle("homepage");

    if (!doc) return {};

    return {
      title: doc.data.meta_title || "Moonstone - Homepage Old",
      description: doc.data.meta_description || undefined,
      openGraph: {
        title: doc.data.meta_title || "Moonstone - Homepage Old",
        description: doc.data.meta_description || undefined,
        images: doc.data.meta_image?.url
          ? [{ url: doc.data.meta_image.url }]
          : [],
      },
    };
  } catch {
    // Document doesn't exist yet in Prismic; fall back to default metadata.
    return {
      title: "Moonstone - Homepage Old",
      description: undefined,
    };
  }
}

export default async function HomepageNext() {
  const client = createClient();
  const doc = await client.getSingle("homepage").catch(() => null);

  if (!doc) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-(--background-color)">
        <div className="text-center px-4">
          <h1 className="text-4xl font-bold mb-4 text-(--heading-color)">
            Homepage Old - Not Published Yet
          </h1>
          <p className="text-lg text-(--main-text-color) mb-6">
            Please create and publish the &quot;Homepage&quot; document in
            Prismic.
          </p>
          <div className="text-left max-w-2xl mx-auto bg-(--brown) p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-3 text-(--cta-color)">
              Steps to publish:
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-(--main-text-color)">
              <li>Go to your Prismic dashboard</li>
              <li>
                Click &quot;Create new&quot; &rarr; Select &quot;Homepage&quot;
              </li>
              <li>Add the Hero slice with transmediaHero variation</li>
              <li>Fill in: logo, title, subtitle, tagline, background image</li>
              <li>Save and Publish</li>
            </ol>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <SliceZone slices={doc.data.slices} components={components} />
    </main>
  );
}
