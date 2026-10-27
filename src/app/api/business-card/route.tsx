import { ImageResponse } from "next/og";
import { TallBusinessCard, businessCardFonts } from "@/lib/businessCardImage";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const lang = new URL(req.url).searchParams.get("locale") === "en" ? "en" : "tr";
  const fonts = await businessCardFonts(lang);
  return new ImageResponse(<TallBusinessCard lang={lang} />, {
    width: 1080,
    height: 1350,
    fonts: fonts.length ? fonts : undefined,
    headers: { "Cache-Control": "public, max-age=3600, s-maxage=86400" },
  });
}
