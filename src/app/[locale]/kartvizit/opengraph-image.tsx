import { ImageResponse } from "next/og";
import { TallBusinessCard, businessCardFonts } from "@/lib/businessCardImage";

export const runtime = "nodejs";
export const size = { width: 1080, height: 1350 };
export const contentType = "image/png";
export const alt = "U+ Studio dijital kartvizit";

export default async function Image({ params }: Readonly<{ params: Promise<{ locale: string }> }>) {
  const lang = (await params).locale === "en" ? "en" : "tr";
  const fonts = await businessCardFonts(lang);
  return new ImageResponse(<TallBusinessCard lang={lang} />, { ...size, fonts: fonts.length ? fonts : undefined });
}
