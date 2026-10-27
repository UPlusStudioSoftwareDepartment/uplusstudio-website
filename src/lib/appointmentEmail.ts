import { escapeHtml } from "./sanitize";

export interface AppointmentEmailInput {
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  message: string;
}

const STUDIO = {
  disciplines: "Mimarlık & İç Mimarlık & Mühendislik",
  address: "Merkez İncek Plaza, Reyhan Cd. No:3, Kat:1 D:2, İncek · Gölbaşı / Ankara",
  phone: "+90 545 320 40 07",
  phoneHref: "tel:+905453204007",
  whatsapp: "https://wa.me/905453204007",
  email: "info@uplusstudio.com.tr",
  directions: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent("İncek Mahallesi Reyhan Caddesi No:3, 06830 Gölbaşı/Ankara")}`,
};

const C = {
  night: "#0a0a09",
  paper: "#121110",
  card: "#1b1a17",
  bone: "#ede9e1",
  mute: "#a29d93",
  faint: "#6e695f",
  line: "#34312c",
  clay: "#c4825c",
};

const SERIF = "Georgia,'Times New Roman',serif";
const SANS = "'Helvetica Neue',Helvetica,Arial,sans-serif";
const MONO = "'SFMono-Regular',Menlo,Consolas,'Courier New',monospace";

const MONTHS = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
const DAYS = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];

function parseSlot(date: string, time: string) {
  const d = /^(\d{4})-(\d{2})-(\d{2})/.exec(date);
  const t = /^(\d{1,2}):(\d{2})/.exec(time);
  if (!d) return null;
  const [y, m, day] = [Number(d[1]), Number(d[2]), Number(d[3])];
  const [hh, mm] = t ? [Number(t[1]), Number(t[2])] : [10, 0];
  const utcStart = new Date(Date.UTC(y, m - 1, day, hh - 3, mm));
  return {
    y,
    m,
    day,
    utcStart,
    utcEnd: new Date(utcStart.getTime() + 60 * 60 * 1000),
    dayName: DAYS[new Date(Date.UTC(y, m - 1, day)).getUTCDay()],
  };
}

const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

function whatsappNumber(phone: string) {
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("0")) digits = `90${digits.slice(1)}`;
  if (digits.length === 10 && digits.startsWith("5")) digits = `90${digits}`;
  return digits;
}

function describe(input: AppointmentEmailInput) {
  const slot = parseSlot(input.date, input.time);
  const dateLine = slot ? `${slot.day} ${MONTHS[slot.m - 1]} ${slot.y}` : input.date || "Görüşmede belirlenecek";
  const calTitle = `U+ Studio — ${input.service}`;
  const calDetails = `Hizmet: ${input.service}\nAd Soyad: ${input.name}\nTelefon: ${input.phone}\nE-posta: ${input.email}${input.message.trim() ? `\n\nNot: ${input.message.trim()}` : ""}`;
  const gcal = slot
    ? `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(calTitle)}&dates=${stamp(slot.utcStart)}/${stamp(slot.utcEnd)}&details=${encodeURIComponent(calDetails)}&location=${encodeURIComponent(STUDIO.address)}&ctz=Europe/Istanbul`
    : "";
  const ics = slot
    ? [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//U+ Studio//Randevu//TR",
        "METHOD:PUBLISH",
        "BEGIN:VEVENT",
        `UID:${stamp(slot.utcStart)}-${whatsappNumber(input.phone) || "guest"}@uplusstudio.com.tr`,
        `DTSTAMP:${stamp(new Date())}`,
        `DTSTART:${stamp(slot.utcStart)}`,
        `DTEND:${stamp(slot.utcEnd)}`,
        `SUMMARY:${calTitle.replace(/[,;]/g, " ")}`,
        `DESCRIPTION:${calDetails.replace(/\n/g, "\\n").replace(/[,;]/g, " ")}`,
        `LOCATION:${STUDIO.address.replace(/[,;]/g, " ")}`,
        "END:VEVENT",
        "END:VCALENDAR",
      ].join("\r\n")
    : null;
  return { slot, dateLine, dayName: slot?.dayName ?? "", gcal, ics };
}

function layout({ title, preheader, reference, body }: { title: string; preheader: string; reference: string; body: string }) {
  return `<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark light">
<meta name="supported-color-schemes" content="dark light">
<title>${escapeHtml(title)}</title>
<style>
  a { color:${C.bone}; }
  .btn { transition:background-color .2s, color .2s, border-color .2s; }
  .btn-solid:hover { background:${C.clay} !important; border-color:${C.clay} !important; color:${C.night} !important; }
  .btn-line:hover { background:${C.night} !important; border-color:${C.bone} !important; color:${C.bone} !important; }
  .btn-decline:hover { background:${C.clay} !important; color:${C.night} !important; }
  .link:hover { color:${C.clay} !important; }
  @media (max-width:620px) {
    .wrap { width:100% !important; border-radius:0 !important; }
    .pad { padding-left:22px !important; padding-right:22px !important; }
    .hero-date { font-size:40px !important; }
    .stack, .stack td { display:block !important; width:100% !important; }
    .stack .pair-l { padding:0 0 10px 0 !important; }
    .stack .pair-r { padding:0 !important; }
    .col { display:block !important; width:100% !important; padding:0 0 18px 0 !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:${C.night};-webkit-font-smoothing:antialiased;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${C.night};">${escapeHtml(preheader)}&#8199;&#65279;&#847;&#8199;&#65279;&#847;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.night};">
<tr><td align="center" style="padding:36px 12px 48px;">
  <table role="presentation" class="wrap" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px;background:${C.paper};border:1px solid ${C.line};border-radius:8px;overflow:hidden;">
    <tr><td style="height:3px;line-height:3px;font-size:0;background:${C.clay};">&nbsp;</td></tr>
    <tr><td class="pad" style="padding:28px 40px;border-bottom:1px solid ${C.line};">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
        <td style="vertical-align:middle;white-space:nowrap;">
          <span style="display:inline-block;border:1px solid ${C.bone};padding:6px 8px;font-family:${SANS};font-size:15px;font-weight:600;line-height:1;color:${C.bone};">U+</span><span style="font-family:${SANS};font-size:17px;color:${C.bone};padding-left:10px;vertical-align:middle;">Studio</span>
        </td>
        <td align="right" style="vertical-align:middle;font-family:${MONO};font-size:10px;letter-spacing:1.8px;text-transform:uppercase;color:${C.mute};">Randevu&nbsp;&nbsp;<span style="color:${C.bone};">#${escapeHtml(reference)}</span></td>
      </tr></table>
    </td></tr>
    ${body}
    <tr><td class="pad" style="padding:26px 40px 30px;background:${C.card};border-top:1px solid ${C.line};">
      <p style="margin:0;font-family:${SANS};font-size:13px;line-height:1.75;color:${C.mute};">
        <strong style="color:${C.bone};font-weight:600;">U+ Studio</strong> — ${STUDIO.disciplines}<br>
        ${STUDIO.address}<br>
        <a class="link" href="${STUDIO.phoneHref}" style="color:${C.mute};text-decoration:none;">${STUDIO.phone}</a>&nbsp;&nbsp;·&nbsp;&nbsp;<a class="link" href="mailto:${STUDIO.email}" style="color:${C.mute};text-decoration:none;">${STUDIO.email}</a>&nbsp;&nbsp;·&nbsp;&nbsp;<a class="link" href="https://www.uplusstudio.com.tr" style="color:${C.mute};text-decoration:none;">uplusstudio.com.tr</a>
      </p>
    </td></tr>
  </table>
</td></tr>
</table>
</body>
</html>`;
}

function eyebrow(text: string, color = C.clay) {
  return `<p style="margin:0;font-family:${MONO};font-size:11px;letter-spacing:2.2px;text-transform:uppercase;color:${color};">${text}</p>`;
}

function ticket(dateLine: string, dayName: string, time: string, service: string, status?: { label: string; color: string }) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${C.line};border-radius:6px;background:${C.card};">
    <tr><td style="padding:26px 28px 22px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
        <td style="vertical-align:top;">
          ${eyebrow("Tarih", C.mute)}
          <p class="hero-date" style="margin:10px 0 0;font-family:${SERIF};font-style:italic;font-size:48px;line-height:1;color:${C.bone};">${escapeHtml(dateLine)}</p>
        </td>
        ${status ? `<td align="right" style="vertical-align:top;"><span style="display:inline-block;padding:6px 12px;border:1px solid ${status.color};border-radius:999px;font-family:${MONO};font-size:10px;letter-spacing:1.6px;text-transform:uppercase;color:${status.color};white-space:nowrap;">${status.label}</span></td>` : ""}
      </tr></table>
    </td></tr>
    <tr><td style="padding:0 28px;"><div style="border-top:1px dashed ${C.line};height:0;line-height:0;font-size:0;">&nbsp;</div></td></tr>
    <tr><td style="padding:18px 28px 24px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
        <td class="col" width="33%" style="vertical-align:top;padding-right:12px;">${eyebrow("Gün", C.mute)}<p style="margin:8px 0 0;font-family:${SANS};font-size:16px;color:${C.bone};">${escapeHtml(dayName || "—")}</p></td>
        <td class="col" width="22%" style="vertical-align:top;padding-right:12px;">${eyebrow("Saat", C.mute)}<p style="margin:8px 0 0;font-family:${SANS};font-size:16px;font-weight:600;color:${C.bone};">${escapeHtml(time)}</p></td>
        <td class="col" width="45%" style="vertical-align:top;">${eyebrow("Hizmet", C.mute)}<p style="margin:8px 0 0;font-family:${SANS};font-size:16px;color:${C.clay};">${escapeHtml(service)}</p></td>
      </tr></table>
    </td></tr>
  </table>`;
}

function solidButton(href: string, label: string) {
  return `<a class="btn btn-solid" href="${href}" style="display:block;padding:16px 18px;border:1px solid ${C.bone};border-radius:4px;background:${C.bone};color:${C.night};font-family:${MONO};font-size:12px;font-weight:600;letter-spacing:1.8px;text-transform:uppercase;text-align:center;text-decoration:none;">${label}</a>`;
}

function lineButton(href: string, label: string, color: string = C.bone, extraClass = "btn-line") {
  return `<a class="btn ${extraClass}" href="${href}" style="display:block;padding:16px 18px;border:1px solid ${color};border-radius:4px;background:transparent;color:${color};font-family:${MONO};font-size:12px;font-weight:600;letter-spacing:1.8px;text-transform:uppercase;text-align:center;text-decoration:none;">${label}</a>`;
}

function buttonPair(left: string, right: string) {
  return `<table role="presentation" class="stack" width="100%" cellpadding="0" cellspacing="0"><tr>
    <td class="pair-l" width="50%" style="vertical-align:top;padding-right:6px;">${left}</td>
    <td class="pair-r" width="50%" style="vertical-align:top;padding-left:6px;">${right}</td>
  </tr></table>`;
}

function textLinks(links: { href: string; label: string }[]) {
  return links
    .map((l) => `<a class="link" href="${l.href}" style="color:${C.bone};font-family:${SANS};font-size:14px;text-decoration:none;border-bottom:1px solid ${C.line};padding-bottom:2px;">${l.label}</a>`)
    .join(`<span style="color:${C.faint};">&nbsp;&nbsp;·&nbsp;&nbsp;</span>`);
}

function detailRow(label: string, value: string) {
  return `<tr>
    <td style="padding:13px 0;border-top:1px solid ${C.line};font-family:${MONO};font-size:10.5px;letter-spacing:1.6px;text-transform:uppercase;color:${C.mute};width:32%;vertical-align:top;">${label}</td>
    <td style="padding:13px 0;border-top:1px solid ${C.line};font-family:${SANS};font-size:15px;color:${C.bone};vertical-align:top;">${value}</td>
  </tr>`;
}

function quote(text: string) {
  return `<div style="border-left:2px solid ${C.clay};padding:6px 0 6px 18px;font-family:${SERIF};font-style:italic;font-size:18px;line-height:1.6;color:${C.bone};white-space:pre-wrap;">${text}</div>`;
}

export function buildStudioEmail(
  input: AppointmentEmailInput,
  opts: { reference: string; approveUrl?: string; declineUrl?: string }
) {
  const { dateLine, dayName, gcal, ics } = describe(input);
  const name = escapeHtml(input.name.trim());
  const email = escapeHtml(input.email.trim());
  const phone = escapeHtml(input.phone.trim());
  const message = input.message.trim() ? escapeHtml(input.message.trim()) : "";
  const firstName = input.name.trim().split(/\s+/)[0] ?? "";
  const wa = whatsappNumber(input.phone);
  const waLink = `https://wa.me/${wa}?text=${encodeURIComponent(`Merhaba ${firstName}, U+ Studio'dan yazıyoruz. ${dateLine} ${input.time} randevu talebinizi aldık.`)}`;
  const telLink = `tel:${input.phone.replace(/[^\d+]/g, "")}`;
  const mailLink = `mailto:${encodeURIComponent(input.email.trim())}?subject=${encodeURIComponent(`U+ Studio — ${dateLine} randevunuz`)}`;

  const subject = `Yeni randevu talebi · ${input.name.trim()} · ${dateLine} ${input.time}`;
  const decision =
    opts.approveUrl && opts.declineUrl
      ? `<tr><td class="pad" style="padding:30px 40px 6px;">
          ${eyebrow("Yanıtınız")}
          <p style="margin:10px 0 18px;font-family:${SANS};font-size:15px;line-height:1.6;color:${C.mute};">Onayladığınızda ya da reddettiğinizde müşteriye otomatik olarak şık bir bilgilendirme e-postası gider. Reddederken bir açıklama yazmanız istenir.</p>
          ${buttonPair(solidButton(opts.approveUrl, "Onayla&nbsp;&nbsp;✓"), lineButton(opts.declineUrl, "Reddet&nbsp;&nbsp;✕", C.clay, "btn-decline"))}
        </td></tr>`
      : "";

  const body = `
    <tr><td class="pad" style="padding:36px 40px 10px;">
      ${eyebrow("Yeni randevu talebi")}
      <p style="margin:14px 0 26px;font-family:${SERIF};font-size:30px;line-height:1.2;color:${C.bone};">${name} sizinle <em>yüz yüze</em> görüşmek istiyor.</p>
      ${ticket(dateLine, dayName, input.time, input.service)}
    </td></tr>
    ${decision}
    <tr><td class="pad" style="padding:30px 40px 6px;">
      ${eyebrow("Müşteri", C.mute)}
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;">
        ${detailRow("Ad Soyad", name)}
        ${detailRow("E-posta", `<a class="link" href="mailto:${email}" style="color:${C.bone};text-decoration:none;">${email}</a>`)}
        ${detailRow("Telefon", `<a class="link" href="${telLink}" style="color:${C.bone};text-decoration:none;">${phone}</a>`)}
      </table>
    </td></tr>
    ${message ? `<tr><td class="pad" style="padding:24px 40px 6px;">${eyebrow("Mesaj", C.mute)}<div style="height:12px;line-height:12px;">&nbsp;</div>${quote(message)}</td></tr>` : ""}
    <tr><td class="pad" style="padding:28px 40px 34px;">
      ${eyebrow("Hızlı işlemler", C.mute)}
      <p style="margin:14px 0 0;line-height:2.2;">${textLinks([
        ...(wa ? [{ href: waLink, label: "WhatsApp'tan yaz" }] : []),
        { href: telLink, label: "Ara" },
        { href: mailLink, label: "E-posta gönder" },
        ...(gcal ? [{ href: gcal, label: "Google Takvim'e ekle" }] : []),
      ])}</p>
      <p style="margin:14px 0 0;font-family:${SANS};font-size:12.5px;line-height:1.6;color:${C.faint};">Takvim dosyası (.ics) ektedir. Bu e-postayı yanıtlamak doğrudan müşteriye gider.</p>
    </td></tr>`;

  const html = layout({ title: subject, preheader: `${input.service} · ${dateLine} ${input.time} · ${input.name.trim()}`, reference: opts.reference, body });
  const text = [
    `YENİ RANDEVU TALEBİ — #${opts.reference}`,
    "",
    `${dateLine}${dayName ? ` ${dayName}` : ""} · ${input.time} · ${input.service}`,
    `${input.name.trim()} · ${input.email.trim()} · ${input.phone.trim()}`,
    input.message.trim() ? `\nMesaj: ${input.message.trim()}` : "",
    opts.approveUrl ? `\nOnayla: ${opts.approveUrl}` : "",
    opts.declineUrl ? `Reddet: ${opts.declineUrl}` : "",
  ].join("\n");
  return { subject, html, text, ics };
}

export function buildClientEmail(
  input: AppointmentEmailInput,
  opts: { reference: string; status: "approved" | "declined"; note?: string; bookingUrl: string }
) {
  const { dateLine, dayName, gcal, ics } = describe(input);
  const firstName = escapeHtml(input.name.trim().split(/\s+/)[0] ?? "");
  const note = opts.note?.trim() ? escapeHtml(opts.note.trim()) : "";
  const approved = opts.status === "approved";

  const subject = approved
    ? `Randevunuz onaylandı · ${dateLine} ${input.time} · U+ Studio`
    : `Randevu talebiniz hakkında · U+ Studio`;

  const body = approved
    ? `
    <tr><td class="pad" style="padding:38px 40px 10px;">
      ${eyebrow("Randevunuz onaylandı")}
      <p style="margin:14px 0 8px;font-family:${SERIF};font-size:32px;line-height:1.2;color:${C.bone};">Görüşmek üzere, <em>${firstName}</em>.</p>
      <p style="margin:0 0 26px;font-family:${SANS};font-size:15px;line-height:1.7;color:${C.mute};">Stüdyomuzda sizi ağırlamak için sabırsızlanıyoruz. Randevu bilgileriniz aşağıda.</p>
      ${ticket(dateLine, dayName, input.time, input.service, { label: "Onaylandı", color: C.clay })}
    </td></tr>
    ${note ? `<tr><td class="pad" style="padding:26px 40px 4px;">${eyebrow("Stüdyodan not", C.mute)}<div style="height:12px;line-height:12px;">&nbsp;</div>${quote(note)}</td></tr>` : ""}
    <tr><td class="pad" style="padding:30px 40px 8px;">
      ${buttonPair(gcal ? solidButton(gcal, "Takvime ekle") : solidButton(STUDIO.directions, "Yol tarifi"), lineButton(STUDIO.directions, "Yol tarifi"))}
    </td></tr>
    <tr><td class="pad" style="padding:22px 40px 36px;">
      ${eyebrow("Adres", C.mute)}
      <p style="margin:10px 0 16px;font-family:${SANS};font-size:15px;line-height:1.6;color:${C.bone};">${STUDIO.address}</p>
      <p style="margin:0;line-height:2.2;">${textLinks([
        { href: STUDIO.whatsapp, label: "WhatsApp" },
        { href: STUDIO.phoneHref, label: "Bizi arayın" },
      ])}</p>
      <p style="margin:14px 0 0;font-family:${SANS};font-size:12.5px;line-height:1.6;color:${C.faint};">Takvim dosyası (.ics) ektedir. Bir değişiklik olursa bu e-postayı yanıtlamanız yeterli.</p>
    </td></tr>`
    : `
    <tr><td class="pad" style="padding:38px 40px 10px;">
      ${eyebrow("Randevu talebiniz")}
      <p style="margin:14px 0 8px;font-family:${SERIF};font-size:30px;line-height:1.25;color:${C.bone};">Merhaba ${firstName}, ilginiz için <em>teşekkür ederiz</em>.</p>
      <p style="margin:0 0 26px;font-family:${SANS};font-size:15px;line-height:1.7;color:${C.mute};">Maalesef talep ettiğiniz tarih ve saatte sizinle görüşemiyoruz.</p>
      ${ticket(dateLine, dayName, input.time, input.service, { label: "Uygun değil", color: C.mute })}
    </td></tr>
    ${note ? `<tr><td class="pad" style="padding:26px 40px 4px;">${eyebrow("Açıklama", C.mute)}<div style="height:12px;line-height:12px;">&nbsp;</div>${quote(note)}</td></tr>` : ""}
    <tr><td class="pad" style="padding:30px 40px 36px;">
      <p style="margin:0 0 18px;font-family:${SANS};font-size:15px;line-height:1.7;color:${C.mute};">Size uygun başka bir zaman seçerseniz memnuniyetle ağırlarız.</p>
      ${buttonPair(solidButton(opts.bookingUrl, "Yeni zaman seçin"), lineButton(STUDIO.whatsapp, "WhatsApp'tan yazın"))}
    </td></tr>`;

  const html = layout({
    title: subject,
    preheader: approved ? `${dateLine} ${input.time} — U+ Studio'da görüşmek üzere.` : "Talep ettiğiniz saat için bir açıklamamız var.",
    reference: opts.reference,
    body,
  });
  const text = approved
    ? `Randevunuz onaylandı — #${opts.reference}\n\n${dateLine} ${dayName} · ${input.time} · ${input.service}\n${STUDIO.address}\n${note ? `\nNot: ${opts.note?.trim()}\n` : ""}\nYol tarifi: ${STUDIO.directions}`
    : `Randevu talebiniz hakkında — #${opts.reference}\n\nMaalesef ${dateLine} ${input.time} için sizinle görüşemiyoruz.${note ? `\n\nAçıklama: ${opts.note?.trim()}` : ""}\n\nYeni zaman seçin: ${opts.bookingUrl}`;
  return { subject, html, text, ics: approved ? ics : null };
}
