import { ImageResponse } from "next/og";
import { TallAppointmentCard, appointmentCardData, appointmentCardFonts } from "@/lib/appointmentCardImage";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  const d = appointmentCardData(params.get("t") ?? "", 160);
  if (!d.valid) return new Response("Not found", { status: 404 });
  const fonts = await appointmentCardFonts(d);
  return new ImageResponse(<TallAppointmentCard d={d} />, {
    width: 1080,
    height: 1350,
    fonts: fonts.length ? fonts : undefined,
    headers: {
      "Cache-Control": "private, max-age=86400",
      ...(params.has("download") ? { "Content-Disposition": `attachment; filename="uplus-studio-randevu-karti-${d.code}.png"` } : {}),
    },
  });
}
