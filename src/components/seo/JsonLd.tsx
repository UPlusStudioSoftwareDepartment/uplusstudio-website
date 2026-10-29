import { serializeJsonLd } from "@/lib/seo";

export default function JsonLd({ data }: Readonly<{ data: Record<string, unknown> | Record<string, unknown>[] }>) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
