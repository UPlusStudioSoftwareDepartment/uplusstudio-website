import { ImageResponse } from "next/og";
import { CARD_COLORS as C, appointmentCardData, appointmentCardFonts } from "@/lib/appointmentCardImage";
import { FLEXIBLE_DATE, NO_DATE_HINT } from "@/lib/appointmentDate";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "U+ Studio randevu kartı";

export default async function Image({ params }: Readonly<{ params: Promise<{ token: string }> }>) {
  const { token } = await params;
  const d = appointmentCardData(decodeURIComponent(token));
  const { day, monthYear, weekday, name, service, time, code, phone, email, message } = d;
  const fonts = await appointmentCardFonts(d);

  const label = { fontFamily: "Sans", fontSize: 16, fontWeight: 600, letterSpacing: 3, color: "rgba(237,233,225,0.5)" } as const;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: C.night, padding: 40, fontFamily: "Sans" }}>
        <div style={{ display: "flex", width: "100%", height: "100%", background: C.pass, border: `1px solid ${C.line}`, borderRadius: 24, overflow: "hidden" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: 360, borderRight: `2px dashed rgba(255,255,255,0.18)`, padding: 32 }}>
            <div style={{ fontFamily: "Serif", fontSize: 150, lineHeight: 1, color: C.bone }}>U+</div>
            <div style={{ marginTop: 18, fontSize: 18, fontWeight: 600, letterSpacing: 12, color: "rgba(237,233,225,0.75)" }}>STUDIO</div>
            <div style={{ display: "flex", marginTop: 16, width: 240, borderTop: "1px solid rgba(237,233,225,0.3)" }} />
            <div style={{ marginTop: 14, fontSize: 12, letterSpacing: 2, color: "rgba(237,233,225,0.5)", textAlign: "center" }}>Mimarlık & İç Mimarlık & Mühendislik</div>
            <div style={{ marginTop: 40, ...label, fontSize: 14 }}>RANDEVU KARTI</div>
            <div style={{ marginTop: 10, fontSize: 18, color: "rgba(237,233,225,0.7)", letterSpacing: 2 }}>{code}</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "34px 46px 30px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: 4, color: C.clay }}>YENİ RANDEVU TALEBİ</div>
              <div style={{ display: "flex", padding: "6px 14px", border: `1px solid ${C.clay}`, borderRadius: 999, fontSize: 16, color: C.clay }}>{service}</div>
            </div>
            <div style={{ marginTop: 10, fontFamily: "Serif", fontSize: 58, lineHeight: 1.05, color: C.bone }}>{name}</div>

            <div style={{ display: "flex", marginTop: 20, gap: 16 }}>
              <div style={{ display: "flex", flexDirection: "column", flex: 1.45, background: C.tile, border: "1px solid rgba(237,233,225,0.16)", borderRadius: 14, overflow: "hidden" }}>
                <div style={{ height: 5, background: C.clay }} />
                <div style={{ display: "flex", flexDirection: "column", padding: "12px 20px 14px" }}>
                  <div style={{ ...label, fontSize: 13 }}>TARİH</div>
                  {day ? (
                    <div style={{ display: "flex", alignItems: "center", marginTop: 4 }}>
                      <div style={{ fontFamily: "Serif", fontSize: 70, lineHeight: 0.95, color: C.bone }}>{day}</div>
                      <div style={{ display: "flex", flexDirection: "column", marginLeft: 16, paddingLeft: 16, borderLeft: "1px solid rgba(237,233,225,0.18)" }}>
                        <div style={{ fontFamily: "Serif", fontStyle: "italic", fontSize: 28, color: C.bone }}>{monthYear}</div>
                        <div style={{ marginTop: 4, fontSize: 14, letterSpacing: 3, color: C.clay }}>{weekday.toLocaleUpperCase("tr-TR")}</div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", marginTop: 4 }}>
                      <div style={{ fontFamily: "Serif", fontStyle: "italic", fontSize: 58, lineHeight: 1, color: C.bone }}>{FLEXIBLE_DATE.tr}</div>
                      <div style={{ marginTop: 8, fontSize: 14, letterSpacing: 3, color: C.clay }}>{NO_DATE_HINT.toLocaleUpperCase("tr-TR")}</div>
                    </div>
                  )}
                </div>
              </div>
              {time ? (
                <div style={{ display: "flex", flexDirection: "column", flex: 1, background: C.tile, border: "1px solid rgba(237,233,225,0.16)", borderRadius: 14, overflow: "hidden" }}>
                  <div style={{ height: 5, background: "rgba(237,233,225,0.35)" }} />
                  <div style={{ display: "flex", flexDirection: "column", padding: "12px 20px 14px" }}>
                    <div style={{ ...label, fontSize: 13 }}>SAAT</div>
                    <div style={{ marginTop: 4, fontFamily: "Serif", fontSize: 64, lineHeight: 1, color: C.bone }}>{time}</div>
                    <div style={{ marginTop: 2, fontSize: 13, letterSpacing: 2, color: C.mute }}>1 saat · İncek</div>
                  </div>
                </div>
              ) : null}
            </div>

            {message ? (
              <div style={{ display: "flex", flexDirection: "column", marginTop: 18, paddingLeft: 16, borderLeft: `2px solid ${C.clay}` }}>
                <div style={{ ...label, fontSize: 13 }}>MESAJ</div>
                <div style={{ marginTop: 6, fontFamily: "Serif", fontStyle: "italic", fontSize: 24, lineHeight: 1.3, color: C.bone }}>{`“${message}”`}</div>
              </div>
            ) : null}

            <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderTop: "1px solid rgba(237,233,225,0.14)", paddingTop: 14 }}>
              <div style={{ display: "flex", gap: 28 }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div style={{ ...label, fontSize: 12 }}>TELEFON</div>
                  <div style={{ marginTop: 4, fontSize: 19, color: C.bone }}>{phone}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div style={{ ...label, fontSize: 12 }}>E-POSTA</div>
                  <div style={{ marginTop: 4, fontSize: 19, color: C.bone }}>{email}</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 3, height: 30, alignItems: "stretch" }}>
                {Array.from({ length: 24 }, (_, i) => (
                  <div key={i} style={{ width: (i * 7) % 3 + 1, background: i % 2 === 0 ? C.bone : "transparent" }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: fonts.length ? fonts : undefined }
  );
}
