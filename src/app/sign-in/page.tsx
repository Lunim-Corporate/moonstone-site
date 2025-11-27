import { createClient } from "@/src/prismicio";
import SignInForm from "./_components/form";

export default async function Page() {
  const client = createClient();
  const doc = await client.getSingle("signin");

  return (
    <main
      className="bg-cover bg-center"
      style={{
        backgroundImage: `url(${doc.data.background_image.url})`,
      }}
    >
      <div className="min-h-screen pt-40 bg-[rgba(0,0,0,0.8)]">
        <div className="max-w-lg mx-auto p-4">
          <SignInForm doc={doc} />
        </div>
      </div>
    </main>
  );
}
