import { CARD_COLORS as C, googleFont, type CardFont } from "@/lib/appointmentCardImage";
import { STUDIO_SERVICES } from "@/lib/services";
import { studioInfo } from "@/lib/studio-info";

export const BUSINESS_CARD_COPY = {
  tr: {
    discipline: "MİMARLIK & İÇ MİMARLIK & MÜHENDİSLİK",
    tagline: "Mimarlık, önce düşünmekle başlar.",
    services: "HİZMETLER",
    contact: "İLETİŞİM",
    studio: "STÜDYO",
    founders: "KURUCULAR",
    reviews: "Google yorumu",
    people: [
      ["Hacer Uyar", "Yüksek Mimar · Kurucu Ortak"],
      ["Rıdvan Uyar", "İnşaat Mühendisi · Kurucu Ortak"],
    ],
    address: ["Merkez İncek Plaza", "Reyhan Cd. No:3, Kat:1 D:2", "İncek · Gölbaşı / Ankara"],
  },
  en: {
    discipline: "ARCHITECTURE, INTERIORS & ENGINEERING",
    tagline: "Architecture begins with thinking.",
    services: "SERVICES",
    contact: "CONTACT",
    studio: "STUDIO",
    founders: "FOUNDERS",
    reviews: "Google reviews",
    people: [
      ["Hacer Uyar", "Master Architect · Co-founder"],
      ["Rıdvan Uyar", "Civil Engineer · Co-founder"],
    ],
    address: ["Merkez İncek Plaza", "Reyhan Cd. No:3, Floor 1, Unit 2", "İncek · Gölbaşı / Ankara"],
  },
};

export async function businessCardFonts(lang: "tr" | "en"): Promise<CardFont[]> {
  const c = BUSINESS_CARD_COPY[lang];
  const text = `U+STUDIO ★ ${JSON.stringify(c)} ${STUDIO_SERVICES[lang].map((s) => s.title + s.desc).join(" ")} ${studioInfo.phoneDisplay} ${studioInfo.email} ${studioInfo.instagramHandle} uplusstudio.com.tr 0123456789`;
  const [sans, sansBold, serif, serifItalic] = await Promise.all([
    googleFont("Hanken+Grotesk", "wght@400", text),
    googleFont("Hanken+Grotesk", "wght@600", text),
    googleFont("Instrument+Serif", "ital@0", text),
    googleFont("Instrument+Serif", "ital@1", text),
  ]);
  return [
    sans && { name: "Sans", data: sans, weight: 400 as const, style: "normal" as const },
    sansBold && { name: "Sans", data: sansBold, weight: 600 as const, style: "normal" as const },
    serif && { name: "Serif", data: serif, weight: 400 as const, style: "normal" as const },
    serifItalic && { name: "Serif", data: serifItalic, weight: 400 as const, style: "italic" as const },
  ].filter(Boolean) as CardFont[];
}

export function Star({ size }: Readonly<{ size: number }>) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ marginRight: 10 }}>
      <path fill="#f4b400" d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" />
    </svg>
  );
}

export function TallBusinessCard({ lang }: Readonly<{ lang: "tr" | "en" }>) {
  const c = BUSINESS_CARD_COPY[lang];
  const services = STUDIO_SERVICES[lang];
  const fixed = { flexShrink: 0 } as const;
  const label = { ...fixed, fontSize: 19, fontWeight: 600, letterSpacing: 5, color: C.clay, marginBottom: 10 } as const;
  const column = { display: "flex", flexDirection: "column", gap: 7 } as const;
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", background: C.night, padding: 36, fontFamily: "Sans" }}>
      <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", background: C.pass, border: `1px solid ${C.line}`, borderRadius: 30, padding: "46px 54px 42px" }}>
        <div style={{ ...fixed, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontFamily: "Serif", fontSize: 124, lineHeight: 0.85, color: C.bone }}>U+</div>
            <div style={{ marginTop: 12, fontSize: 26, fontWeight: 600, letterSpacing: 15, color: C.bone }}>STUDIO</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", marginTop: 6 }}>
            <div style={{ display: "flex", alignItems: "center", fontSize: 32, color: C.bone }}>
              <Star size={28} />
              {studioInfo.googleRating}
            </div>
            <div style={{ marginTop: 4, fontSize: 17, letterSpacing: 3, color: C.mute }}>{`${studioInfo.googleReviewCount} ${c.reviews}`}</div>
          </div>
        </div>

        <div style={{ ...fixed, marginTop: 30, fontSize: 19, letterSpacing: 4, color: C.mute }}>{c.discipline}</div>
        <div style={{ ...fixed, marginTop: 8, fontFamily: "Serif", fontStyle: "italic", fontSize: 52, lineHeight: 1.1, color: C.bone }}>{c.tagline}</div>

        <div style={{ ...fixed, display: "flex", justifyContent: "space-between", marginTop: 30, paddingBottom: 10, borderBottom: "1px solid rgba(237,233,225,0.2)" }}>
          <div style={{ fontSize: 19, fontWeight: 600, letterSpacing: 5, color: C.clay }}>{c.services}</div>
          <div style={{ fontSize: 19, letterSpacing: 3, color: C.mute }}>{String(services.length).padStart(2, "0")}</div>
        </div>
        {services.map((s, i) => (
          <div key={s.title} style={{ ...fixed, display: "flex", alignItems: "center", height: 58, borderBottom: "1px solid rgba(237,233,225,0.09)" }}>
            <div style={{ width: 50, fontSize: 19, color: C.clay }}>{String(i + 1).padStart(2, "0")}</div>
            <div style={{ fontSize: 26, fontWeight: 600, color: C.bone }}>{s.title}</div>
            <div style={{ marginLeft: "auto", paddingLeft: 20, fontSize: 19, color: C.mute }}>{s.desc}</div>
          </div>
        ))}

        <div style={{ ...fixed, display: "flex", marginTop: "auto", paddingTop: 26, gap: 34 }}>
          <div style={{ ...column, flex: 1.25 }}>
            <div style={label}>{c.contact}</div>
            <div style={{ fontSize: 22, color: C.bone }}>{studioInfo.phoneDisplay}</div>
            <div style={{ fontSize: 22, color: C.bone }}>{studioInfo.email}</div>
            <div style={{ fontSize: 22, color: C.bone }}>uplusstudio.com.tr</div>
            <div style={{ fontSize: 22, color: C.bone }}>{studioInfo.instagramHandle}</div>
          </div>
          <div style={{ ...column, flex: 1 }}>
            <div style={label}>{c.studio}</div>
            {c.address.map((a, i) => (
              <div key={a} style={{ fontSize: 21, color: i === 0 ? C.bone : C.mute }}>{a}</div>
            ))}
          </div>
          <div style={{ ...column, flex: 1 }}>
            <div style={label}>{c.founders}</div>
            {c.people.map(([n, r]) => (
              <div key={n} style={{ display: "flex", flexDirection: "column", marginBottom: 4 }}>
                <div style={{ fontSize: 21, color: C.bone }}>{n}</div>
                <div style={{ fontSize: 16, color: C.mute }}>{r}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
