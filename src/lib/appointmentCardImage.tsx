import { appointmentReference, readAppointmentToken } from "@/lib/appointmentToken";
import { FLEXIBLE_DATE, NO_DATE_HINT, TR_DAYS, TR_MONTHS, parseAppointmentDate } from "@/lib/appointmentDate";

export const CARD_COLORS = { night: "#0a0a09", pass: "#141413", tile: "#1b1a17", bone: "#ede9e1", mute: "#a29d93", line: "#34312c", clay: "#c4825c" };

export type CardFont = { name: string; data: ArrayBuffer; weight: 400 | 600; style: "normal" | "italic" };

export async function googleFont(family: string, axis: string, text: string) {
  try {
    const css = await (
      await fetch(`https://fonts.googleapis.com/css2?family=${family}:${axis}&text=${encodeURIComponent(text)}`, {
        headers: { "User-Agent": "Mozilla/5.0" },
      })
    ).text();
    const url = /src: url\((.+?)\) format\('(?:opentype|truetype|woff)'\)/.exec(css)?.[1];
    if (!url) return null;
    return await (await fetch(url)).arrayBuffer();
  } catch {
    return null;
  }
}

export function appointmentCardData(token: string, maxMessage = 120) {
  const data = readAppointmentToken(token);
  const p = data ? parseAppointmentDate(data.date) : null;
  const fullMessage = (data?.message ?? "").replace(/\s+/g, " ").trim();
  return {
    valid: Boolean(data),
    day: p ? String(p.day).padStart(2, "0") : "",
    monthYear: p ? `${TR_MONTHS[p.month - 1]} ${p.year}` : "",
    weekday: p ? TR_DAYS[p.weekday] : "",
    name: data?.name ?? "Randevu kartı",
    service: data?.service ?? "U+ Studio",
    time: data?.time ?? "",
    code: data ? `UP-${appointmentReference(token)}` : "U+ STUDIO",
    phone: data?.phone ?? "",
    email: data?.email ?? "",
    message: fullMessage.length > maxMessage ? `${fullMessage.slice(0, maxMessage - 3).trimEnd()}…` : fullMessage,
  };
}

export type AppointmentCardData = ReturnType<typeof appointmentCardData>;

export async function appointmentCardFonts(d: AppointmentCardData): Promise<CardFont[]> {
  const text = `U+STUDIO ${Object.values(d).join(" ")} “” YENİ RANDEVU TALEBİ RANDEVU KARTI TARİH SAAT HİZMET MESAJ TELEFON E-POSTA Mimarlık & İç Mimarlık & Mühendislik İncek · Gölbaşı / Ankara 1 saat ${d.weekday.toLocaleUpperCase("tr-TR")} uplusstudio.com.tr ${FLEXIBLE_DATE.tr} ${NO_DATE_HINT.toLocaleUpperCase("tr-TR")}`;
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

export function TallAppointmentCard({ d }: Readonly<{ d: AppointmentCardData }>) {
  const C = CARD_COLORS;
  const label = { fontFamily: "Sans", fontSize: 22, fontWeight: 600, letterSpacing: 5, color: "rgba(237,233,225,0.5)" } as const;
  const tile = { display: "flex", flexDirection: "column", background: C.tile, border: "1px solid rgba(237,233,225,0.16)", borderRadius: 22, overflow: "hidden" } as const;
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", background: C.night, padding: 44, fontFamily: "Sans" }}>
      <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", background: C.pass, border: `1px solid ${C.line}`, borderRadius: 36, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "44px 60px 36px", borderBottom: "2px dashed rgba(255,255,255,0.18)" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ fontFamily: "Serif", fontSize: 128, lineHeight: 1, color: C.bone }}>U+</div>
            <div style={{ display: "flex", flexDirection: "column", marginLeft: 26 }}>
              <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: 14, color: "rgba(237,233,225,0.8)" }}>STUDIO</div>
              <div style={{ marginTop: 10, fontSize: 18, letterSpacing: 1, color: "rgba(237,233,225,0.5)" }}>Mimarlık & İç Mimarlık & Mühendislik</div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <div style={{ ...label, fontSize: 18 }}>RANDEVU KARTI</div>
            <div style={{ marginTop: 8, fontSize: 26, letterSpacing: 3, color: C.bone }}>{d.code}</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "44px 60px 44px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: 6, color: C.clay }}>YENİ RANDEVU TALEBİ</div>
            <div style={{ display: "flex", padding: "10px 24px", border: `2px solid ${C.clay}`, borderRadius: 999, fontSize: 26, color: C.clay }}>{d.service}</div>
          </div>
          <div style={{ marginTop: 18, fontFamily: "Serif", fontSize: 96, lineHeight: 1.04, color: C.bone }}>{d.name}</div>

          <div style={{ display: "flex", marginTop: 36, gap: 24 }}>
            <div style={{ ...tile, flex: 1.5 }}>
              <div style={{ height: 8, background: C.clay }} />
              <div style={{ display: "flex", flexDirection: "column", padding: "22px 30px 26px" }}>
                <div style={label}>TARİH</div>
                {d.day ? (
                  <div style={{ display: "flex", alignItems: "center", marginTop: 8 }}>
                    <div style={{ fontFamily: "Serif", fontSize: 132, lineHeight: 0.95, color: C.bone }}>{d.day}</div>
                    <div style={{ display: "flex", flexDirection: "column", marginLeft: 26, paddingLeft: 26, borderLeft: "1px solid rgba(237,233,225,0.18)" }}>
                      <div style={{ fontFamily: "Serif", fontStyle: "italic", fontSize: 44, color: C.bone }}>{d.monthYear}</div>
                      <div style={{ marginTop: 8, fontSize: 22, letterSpacing: 4, color: C.clay }}>{d.weekday.toLocaleUpperCase("tr-TR")}</div>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", marginTop: 8 }}>
                    <div style={{ fontFamily: "Serif", fontStyle: "italic", fontSize: 110, lineHeight: 1, color: C.bone }}>{FLEXIBLE_DATE.tr}</div>
                    <div style={{ marginTop: 14, fontSize: 22, letterSpacing: 4, color: C.clay }}>{NO_DATE_HINT.toLocaleUpperCase("tr-TR")}</div>
                  </div>
                )}
              </div>
            </div>
            {d.time ? (
              <div style={{ ...tile, flex: 1 }}>
                <div style={{ height: 8, background: "rgba(237,233,225,0.35)" }} />
                <div style={{ display: "flex", flexDirection: "column", padding: "22px 30px 26px" }}>
                  <div style={label}>SAAT</div>
                  <div style={{ marginTop: 8, fontFamily: "Serif", fontSize: 120, lineHeight: 1, color: C.bone }}>{d.time}</div>
                  <div style={{ marginTop: 6, fontSize: 20, letterSpacing: 3, color: C.mute }}>1 saat · İncek</div>
                </div>
              </div>
            ) : null}
          </div>

          {d.message ? (
            <div style={{ display: "flex", flexDirection: "column", marginTop: 40, paddingLeft: 28, borderLeft: `3px solid ${C.clay}` }}>
              <div style={label}>MESAJ</div>
              <div style={{ marginTop: 12, fontFamily: "Serif", fontStyle: "italic", fontSize: 40, lineHeight: 1.3, color: C.bone }}>{`“${d.message}”`}</div>
            </div>
          ) : null}

          <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", borderTop: "1px solid rgba(237,233,225,0.14)", paddingTop: 28 }}>
            <div style={{ display: "flex", gap: 48 }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ ...label, fontSize: 18 }}>TELEFON</div>
                <div style={{ marginTop: 8, fontSize: 30, color: C.bone }}>{d.phone}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ ...label, fontSize: 18 }}>E-POSTA</div>
                <div style={{ marginTop: 8, fontSize: 30, color: C.bone }}>{d.email}</div>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 28 }}>
              <div style={{ fontSize: 20, letterSpacing: 2, color: C.mute }}>İncek · Gölbaşı / Ankara</div>
              <div style={{ display: "flex", gap: 4, height: 44, alignItems: "stretch" }}>
                {Array.from({ length: 30 }, (_, i) => (
                  <div key={i} style={{ width: ((i * 7) % 3) + 2, background: i % 2 === 0 ? C.bone : "transparent" }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
