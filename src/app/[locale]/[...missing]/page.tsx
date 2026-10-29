import { notFound } from "next/navigation";
import { connection } from "next/server";

// Unknown addresses under a locale (and the proxy's missing pages) end here, so the 404 renders inside the locale layout.
// Rendered per request: Next 16 answers a static notFound() with an empty shell, a dynamic one in full (header, footer, 404).
// Kept to this route so every other page stays prerendered.
export default async function MissingPage() {
  await connection();
  notFound();
}
