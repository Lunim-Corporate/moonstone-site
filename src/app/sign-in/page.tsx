import { createClient } from "@/src/prismicio";
import { notFound } from "next/navigation";

export default async function Page() {
  const client = createClient();
  const doc = await client.getSingle("signin");

  if (!doc) notFound();
  return <div>page</div>;
}
