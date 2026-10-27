import { ImageResponse } from "next/og";
import { CARD_COLORS as C, googleFont, type CardFont } from "@/lib/appointmentCardImage";
import { STUDIO_SERVICES } from "@/lib/services";
import { Star } from "@/lib/businessCardImage";
import { studioInfo } from "@/lib/studio-info";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "U+ Studio dijital kartvizit";

const COPY = {
  tr: {
    discipline: "MİMARLIK & İÇ MİMARLIK & MÜHENDİSLİK",
    tagline: "Mimarlık, önce düşünmekle başlar.",
    services: "HİZMETLER",
    reviews: "Google yorumu",
    founders: ["Hacer Uyar · Yüksek Mimar", "Rıdvan Uyar · İnşaat Mühendisi"],
  },
  en: {
    discipline: "ARCHITECTURE & INTERIOR ARCHITECTURE & ENGINEERING",
    tagline: "Architecture begins with thinking.",
    services: "SERVICES",
    reviews: "Google reviews",
    founders: ["Hacer Uyar · Master Architect", "Rıdvan Uyar · Civil Engineer"],
  },
};

export default async function Image({ params }: Readonly<{ params: Promise<{ locale: string }> }>) {
  const lang = (await params).locale === "en" ? "en" : "tr";
  const c = COPY[lang];
  const services = STUDIO_SERVICES[lang];
  const contact = [studioInfo.phoneDisplay, studioInfo.email, "uplusstudio.com.tr", "Merkez İncek Plaza · İncek, Gölbaşı / Ankara"];
  const text = `U+STUDIO ★ ${Object.values(c).flat().join(" ")} ${services.map((s) => s.title + s.desc).join(" ")} ${contact.join(" ")} ${studioInfo.googleRating} ${studioInfo.googleReviewCount} 0123456789`;
  const [sans, sansBold, serif, serifItalic] = await Promise.all([
    googleFont("Hanken+Grotesk", "wght@400", text),
    googleFont("Hanken+Grotesk", "wght@600", text),
    googleFont("Instrument+Serif", "ital@0", text),
    googleFont("Instrument+Serif", "ital@1", text),
  ]);
  const fonts = [
    sans && { name: "Sans", data: sans, weight: 400 as const, style: "normal" as const },
    sansBold && { name: "Sans", data: sansBold, weight: 600 as const, style: "normal" as const },
    serif && { name: "Serif", data: serif, weight: 400 as const, style: "normal" as const },
    serifItalic && { name: "Serif", data: serifItalic, weight: 400 as const, style: "italic" as const },
  ].filter(Boolean) as CardFont[];

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: C.night, padding: 28, fontFamily: "Sans" }}>
        <div style={{ display: "flex", width: "100%", height: "100%", background: C.pass, border: `1px solid ${C.line}`, borderRadius: 18, overflow: "hidden" }}>
          <div style={{ display: "flex", flexDirection: "column", width: 470, padding: "40px 40px 34px", borderRight: "1px solid rgba(237,233,225,0.12)" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ fontFamily: "Serif", fontSize: 92, lineHeight: 0.85, color: C.bone }}>U+</div>
                <div style={{ marginTop: 10, fontSize: 19, fontWeight: 600, letterSpacing: 10, color: C.bone }}>STUDIO</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                <div style={{ display: "flex", alignItems: "center", fontSize: 22, color: C.bone }}>
                  <Star size={20} />
                  {studioInfo.googleRating}
                </div>
                <div style={{ fontSize: 13, letterSpacing: 2, color: C.mute }}>{`${studioInfo.googleReviewCount} ${c.reviews}`}</div>
              </div>
            </div>
            <div style={{ marginTop: 28, fontSize: 14, letterSpacing: 2.5, color: C.mute }}>{c.discipline}</div>
            <div style={{ marginTop: 10, fontFamily: "Serif", fontStyle: "italic", fontSize: 40, lineHeight: 1.1, color: C.bone }}>{c.tagline}</div>
            <div style={{ display: "flex", flexDirection: "column", marginTop: "auto", gap: 9 }}>
              {contact.map((line) => (
                <div key={line} style={{ fontSize: 19, color: C.bone }}>{line}</div>
              ))}
              <div style={{ display: "flex", flexDirection: "column", marginTop: 10, paddingTop: 12, borderTop: "1px solid rgba(237,233,225,0.14)", gap: 4 }}>
                {c.founders.map((f) => (
                  <div key={f} style={{ fontSize: 15, color: C.mute }}>{f}</div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "36px 40px 30px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: 10, borderBottom: "1px solid rgba(237,233,225,0.18)" }}>
              <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: 4, color: C.clay }}>{c.services}</div>
              <div style={{ fontSize: 15, letterSpacing: 2, color: C.mute }}>{String(services.length).padStart(2, "0")}</div>
            </div>
            {services.map((s, i) => (
              <div key={s.title} style={{ display: "flex", alignItems: "baseline", padding: "8.5px 0", borderBottom: "1px solid rgba(237,233,225,0.08)" }}>
                <div style={{ width: 38, fontSize: 14, color: C.clay }}>{String(i + 1).padStart(2, "0")}</div>
                <div style={{ fontSize: 19, fontWeight: 600, color: C.bone }}>{s.title}</div>
                <div style={{ marginLeft: "auto", fontSize: 14, color: C.mute }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: fonts.length ? fonts : undefined }
  );
}
