import { describe, it, expect } from "vitest";
import { buildClientEmail, buildStudioEmail } from "./appointmentEmail";

const request = {
  name: "Ayşe Yılmaz",
  email: "ayse@example.com",
  phone: "0532 123 45 67",
  service: "İç Mimarlık",
  date: "2026-11-04",
  time: "14:00",
  message: "Salon ve mutfak için keşif görüşmesi.",
};
const flexible = { ...request, date: "", time: "" };
const links = { reference: "ABC123", approveUrl: "https://example.com/approve", declineUrl: "https://example.com/decline" };

describe("studio email", () => {
  it("shows the requested slot and the approve / decline links", () => {
    const mail = buildStudioEmail(request, links);
    expect(mail.subject).toBe("Yeni randevu talebi · Ayşe Yılmaz · 4 Kasım 2026 14:00");
    expect(mail.text).toContain("HİZMET\nİç Mimarlık\n\nTARİH VE SAAT\n4 Kasım 2026 Çarşamba, 14:00");
    expect(mail.html).toContain(links.approveUrl);
    expect(mail.html).toContain(links.declineUrl);
    expect(mail.html).toContain("calendar.google.com");
  });

  it("tells the studio to suggest a time when the visitor left the date open", () => {
    const mail = buildStudioEmail(flexible, links);
    expect(mail.subject).toBe("Yeni randevu talebi · Ayşe Yılmaz");
    expect(mail.text).toContain("TARİH VE SAAT\nEsnek (müşteri tarih seçmedi)");
    expect(mail.html).toContain("Esnek — müşteri tarih seçmedi; uygun bir gün ve saat önerin.");
    expect(mail.html).not.toContain("Görüşmede belirlenecek");
    expect(mail.text).not.toMatch(/·\s+·/);
    const whatsapp = /href="https:\/\/wa\.me\/905321234567\?text=([^"]+)"/.exec(mail.html)?.[1] ?? "";
    expect(decodeURIComponent(whatsapp)).toBe("Merhaba Ayşe, U+ Studio'dan yazıyoruz. Randevu talebinizi aldık.");
    expect(mail.html).not.toContain("calendar.google.com");
  });

  it("only lists the day and time that were actually chosen", () => {
    const dated = buildStudioEmail(request, links).html;
    expect(dated).toContain(">4 Kasım 2026 Çarşamba</td>");
    expect(dated).toContain(">Saat</td>");
    const open = buildStudioEmail(flexible, links).html;
    expect(open).not.toContain(">Saat</td>");
    expect(open).toContain(">Hizmet</td>");
    const timeOnly = buildClientEmail({ ...flexible, time: "14:00" }, { reference: "X", status: "approved", bookingUrl: "u" }).html;
    expect(timeOnly).toContain(">Saat</td>");
    expect(timeOnly).not.toContain(">Tarih</td>");
  });

  it("sets every label in bold next to its value", () => {
    const labels = [...buildStudioEmail(request, links).html.matchAll(/<td class="row-label"[^>]*font-weight:700;[^>]*>([^<]+)<\/td>/g)].map((m) => m[1]);
    expect(labels).toEqual(["Hizmet", "Tarih", "Saat", "Ad Soyad", "Telefon", "E-posta"]);
  });

  it("links the appointment card like the WhatsApp message does", () => {
    const mail = buildStudioEmail(request, { ...links, cardUrl: "https://example.com/tr/randevu-kart/t?k=mail" });
    expect(mail.html).toContain('href="https://example.com/tr/randevu-kart/t?k=mail"');
    expect(mail.text).toContain("RANDEVU KARTI\nhttps://example.com/tr/randevu-kart/t?k=mail");
  });

  it("does not promise an attachment it cannot send", () => {
    expect(buildStudioEmail(request, links).html).not.toContain(".ics");
    expect(buildClientEmail(request, { reference: "X", status: "approved", bookingUrl: "u" }).html).not.toContain(".ics");
  });

  it("flags requests made on the English site", () => {
    expect(buildStudioEmail({ ...request, locale: "en" }, links).html).toContain("İngilizce");
  });
});

describe("client email", () => {
  it("confirms a dated appointment in Turkish with a calendar link", () => {
    const mail = buildClientEmail(request, { reference: "X", status: "approved", bookingUrl: "https://example.com/tr/contact" });
    expect(mail.subject).toBe("Randevunuz onaylandı · 4 Kasım 2026 14:00 · U+ Studio");
    expect(mail.html).toContain('lang="tr"');
    expect(mail.html).toContain("Takvime ekle");
  });

  it("confirms a flexible request with the slot the studio picked", () => {
    const mail = buildClientEmail({ ...flexible, date: "2026-11-06", time: "10:00" }, { reference: "X", status: "approved", bookingUrl: "u" });
    expect(mail.subject).toBe("Randevunuz onaylandı · 6 Kasım 2026 10:00 · U+ Studio");
    expect(mail.html).toContain("Cuma");
    expect(mail.html).toContain("Takvime ekle");
    expect(mail.html).not.toContain("Esnek");
  });

  it("declines a dated request by offering another time", () => {
    const mail = buildClientEmail(request, { reference: "X", status: "declined", note: "O gün şantiyedeyiz.", bookingUrl: "https://example.com/tr/contact" });
    expect(mail.html).toContain("talep ettiğiniz tarih ve saatte");
    expect(mail.html).toContain(">Tarih</td>");
    expect(mail.html).toContain("Başka bir zaman seçin");
  });

  it("declines an open request without an empty date card", () => {
    const mail = buildClientEmail(flexible, { reference: "X", status: "declined", note: "Bu hafta şantiyedeyiz.", bookingUrl: "https://example.com/tr/contact" });
    expect(mail.text).toContain("İç Mimarlık talebinizi dikkatle inceledik; maalesef şu an bu görüşmeyi planlayamıyoruz.");
    expect(mail.text).toContain("Bu hafta şantiyedeyiz.");
    expect(mail.html).not.toContain(">Tarih</td>");
    expect(mail.html).not.toContain("Esnek");
    expect(mail.html).toContain("Yeni randevu talebi");
    expect(mail.html).toContain("https://example.com/tr/contact");
  });

  it("leaves no empty sections in the plain-text copy when optional parts are missing", () => {
    const texts = [
      buildStudioEmail({ ...flexible, message: "" }, links).text,
      buildClientEmail(flexible, { reference: "X", status: "approved", bookingUrl: "u" }).text,
      buildClientEmail(flexible, { reference: "X", status: "declined", bookingUrl: "u" }).text,
    ];
    for (const text of texts) expect(text).not.toMatch(/\n\n\n/);
    expect(texts[0]).not.toContain("MESAJ");
  });

  it("repeats the declined slot in the plain-text copy", () => {
    const mail = buildClientEmail(request, { reference: "X", status: "declined", bookingUrl: "u" });
    expect(mail.text).toContain("RANDEVU\nTarih: 4 Kasım 2026 Çarşamba\nSaat: 14:00\nHizmet: İç Mimarlık");
  });

  it("writes to English visitors in English", () => {
    const mail = buildClientEmail({ ...request, locale: "en" }, { reference: "X", status: "approved", bookingUrl: "u" });
    expect(mail.subject).toBe("Your appointment is confirmed · November 4, 2026 14:00 · U+ Studio");
    expect(mail.html).toContain('lang="en"');
    expect(mail.html).toContain("Wednesday");
    expect(mail.html).not.toContain("Onaylandı");
  });

  it("escapes what the visitor typed", () => {
    const mail = buildClientEmail({ ...request, name: "<b>Ayşe</b>" }, { reference: "X", status: "declined", note: "<script>x</script>", bookingUrl: "u" });
    expect(mail.html).not.toContain("<script>");
    expect(mail.html).not.toContain("<b>Ayşe");
  });
});
