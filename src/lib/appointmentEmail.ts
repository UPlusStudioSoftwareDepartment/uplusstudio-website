import { escapeHtml } from "./sanitize";
import { EN_DAYS, EN_MONTHS, FLEXIBLE_DATE, NO_DATE_HINT, TR_DAYS, TR_MONTHS, parseAppointmentDate } from "./appointmentDate";
import { calendarUrl, whatsappNumber } from "./appointmentLinks";
import { C, MONO, SANS, SERIF, STUDIO, type Locale, buttonPair, detailRow, eyebrow, layout, lineButton, quote, solidButton, textLinks } from "./emailLayout";

export interface AppointmentEmailInput {
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  message: string;
  locale?: "tr" | "en";
}

const LABELS = {
  tr: { date: "Tarih", day: "Gün", time: "Saat", service: "Hizmet", appointment: "Randevu" },
  en: { date: "Date", day: "Day", time: "Time", service: "Service", appointment: "Appointment" },
};

function parseSlot(date: string, locale: Locale) {
  const d = parseAppointmentDate(date);
  if (!d) return null;
  return {
    dateLine: locale === "en" ? `${EN_MONTHS[d.month - 1]} ${d.day}, ${d.year}` : `${d.day} ${TR_MONTHS[d.month - 1]} ${d.year}`,
    dayName: (locale === "en" ? EN_DAYS : TR_DAYS)[d.weekday],
  };
}

function describe(input: AppointmentEmailInput, locale: Locale = "tr") {
  const slot = parseSlot(input.date, locale);
  const time = input.time.trim();
  const dateLine = slot ? slot.dateLine : FLEXIBLE_DATE[locale];
  const when = [slot?.dateLine, time].filter(Boolean).join(" ");
  const calTitle = `U+ Studio — ${input.service}`;
  const cal = locale === "en" ? ["Service", "Name", "Phone", "Email", "Note"] : ["Hizmet", "Ad Soyad", "Telefon", "E-posta", "Not"];
  const calDetails = `${cal[0]}: ${input.service}\n${cal[1]}: ${input.name}\n${cal[2]}: ${input.phone}\n${cal[3]}: ${input.email}${input.message.trim() ? `\n\n${cal[4]}: ${input.message.trim()}` : ""}`;
  const gcal = calendarUrl({ date: input.date, time: input.time, title: calTitle, details: calDetails });
  return { hasDate: Boolean(slot), dateLine, dayName: slot?.dayName ?? "", time, when, gcal };
}

function ticket({
  dateLine,
  dayName,
  time,
  service,
  status,
  hint,
  locale = "tr",
}: {
  dateLine: string;
  dayName: string;
  time: string;
  service: string;
  status?: { label: string; color: string };
  hint?: string;
  locale?: Locale;
}) {
  const l = LABELS[locale];
  const columns = [
    ...(dayName ? [{ label: l.day, value: dayName, width: 33, style: `font-size:16px;color:${C.bone};` }] : []),
    ...(time ? [{ label: l.time, value: time, width: 22, style: `font-size:16px;font-weight:600;color:${C.bone};` }] : []),
  ];
  columns.push({ label: l.service, value: service, width: 100 - columns.reduce((sum, c) => sum + c.width, 0), style: `font-size:16px;color:${C.clay};` });
  const cells = columns
    .map(
      (c, i) =>
        `<td class="col" width="${c.width}%" style="vertical-align:top;${i < columns.length - 1 ? "padding-right:12px;" : ""}">${eyebrow(c.label, C.mute)}<p style="margin:8px 0 0;font-family:${SANS};${c.style}">${escapeHtml(c.value)}</p></td>`
    )
    .join("\n        ");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${C.line};border-radius:6px;background:${C.card};">
    <tr><td style="padding:26px 28px 22px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
        <td style="vertical-align:top;">
          ${eyebrow(l.date, C.mute)}
          <p class="hero-date" style="margin:10px 0 0;font-family:${SERIF};font-style:italic;font-size:48px;line-height:1;color:${C.bone};">${escapeHtml(dateLine)}</p>
          ${hint ? `<p style="margin:10px 0 0;font-family:${SANS};font-size:14px;line-height:1.5;color:${C.clay};">${escapeHtml(hint)}</p>` : ""}
        </td>
        ${status ? `<td align="right" style="vertical-align:top;"><span style="display:inline-block;padding:6px 12px;border:1px solid ${status.color};border-radius:999px;font-family:${MONO};font-size:10px;letter-spacing:1.6px;text-transform:uppercase;color:${status.color};white-space:nowrap;">${status.label}</span></td>` : ""}
      </tr></table>
    </td></tr>
    <tr><td style="padding:0 28px;"><div style="border-top:1px dashed ${C.line};height:0;line-height:0;font-size:0;">&nbsp;</div></td></tr>
    <tr><td style="padding:18px 28px 24px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
        ${cells}
      </tr></table>
    </td></tr>
  </table>`;
}

export function buildStudioEmail(
  input: AppointmentEmailInput,
  opts: { reference: string; approveUrl?: string; declineUrl?: string }
) {
  const { hasDate, dateLine, dayName, time, when, gcal } = describe(input);
  const name = escapeHtml(input.name.trim());
  const email = escapeHtml(input.email.trim());
  const phone = escapeHtml(input.phone.trim());
  const message = input.message.trim() ? escapeHtml(input.message.trim()) : "";
  const firstName = input.name.trim().split(/\s+/)[0] ?? "";
  const wa = whatsappNumber(input.phone);
  const waLink = `https://wa.me/${wa}?text=${encodeURIComponent(`Merhaba ${firstName}, U+ Studio'dan yazıyoruz. ${when ? `${when} için randevu` : "Randevu"} talebinizi aldık.`)}`;
  const telLink = `tel:${input.phone.replace(/[^\d+]/g, "")}`;
  const mailLink = `mailto:${encodeURIComponent(input.email.trim())}?subject=${encodeURIComponent(when ? `U+ Studio — ${when} randevunuz` : "U+ Studio — randevu talebiniz")}`;
  const language = input.locale === "en" ? " · İngilizce" : "";

  const subject = `Yeni randevu talebi · ${input.name.trim()}${when ? ` · ${when}` : ""}`;
  const decision =
    opts.approveUrl && opts.declineUrl
      ? `<tr><td class="pad" style="padding:30px 40px 6px;">
          ${eyebrow("Yanıtınız")}
          <p style="margin:10px 0 18px;font-family:${SANS};font-size:15px;line-height:1.6;color:${C.mute};">Onayla ya da Reddet'e bastığınızda müşteriye gidecek bilgilendirme e-postası sizin için hazırlanır. Reddederken bir açıklama yazmanız istenir.</p>
          ${buttonPair(solidButton(opts.approveUrl, "Onayla&nbsp;&nbsp;✓"), lineButton(opts.declineUrl, "Reddet&nbsp;&nbsp;✕", C.clay, "btn-decline"))}
        </td></tr>`
      : "";

  const body = `
    <tr><td class="pad" style="padding:36px 40px 10px;">
      ${eyebrow(`Yeni randevu talebi${language}`)}
      <p style="margin:14px 0 26px;font-family:${SERIF};font-size:30px;line-height:1.2;color:${C.bone};">${name} sizinle <em>yüz yüze</em> görüşmek istiyor.</p>
      ${ticket({ dateLine, dayName, time, service: input.service, hint: hasDate ? undefined : `${NO_DATE_HINT}; uygun bir gün ve saat önerin.` })}
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
      <p style="margin:14px 0 0;font-family:${SANS};font-size:12.5px;line-height:1.6;color:${C.faint};">Bu e-postayı yanıtlamak doğrudan müşteriye gider.</p>
    </td></tr>`;

  const html = layout({ title: subject, preheader: [input.service, when, input.name.trim()].filter(Boolean).join(" · "), label: LABELS.tr.appointment, reference: opts.reference, body });
  const text = [
    `YENİ RANDEVU TALEBİ — #${opts.reference}`,
    "",
    [hasDate ? `${dateLine} ${dayName}` : `${dateLine} (${NO_DATE_HINT.toLocaleLowerCase("tr-TR")})`, time, input.service].filter(Boolean).join(" · "),
    `${input.name.trim()} · ${input.email.trim()} · ${input.phone.trim()}`,
    input.message.trim() ? `\nMesaj: ${input.message.trim()}` : "",
    opts.approveUrl ? `\nOnayla: ${opts.approveUrl}` : "",
    opts.declineUrl ? `Reddet: ${opts.declineUrl}` : "",
  ].join("\n");
  return { subject, html, text };
}

const CLIENT_COPY = {
  tr: {
    approvedSubject: (when: string) => (when ? `Randevunuz onaylandı · ${when} · U+ Studio` : "Randevu talebiniz onaylandı · U+ Studio"),
    declinedSubject: "Randevu talebiniz hakkında · U+ Studio",
    approvedEyebrow: "Randevunuz onaylandı",
    approvedTitle: (first: string) => `Görüşmek üzere, <em>${first}</em>.`,
    approvedLead: "Stüdyomuzda sizi ağırlamak için sabırsızlanıyoruz. Randevu bilgileriniz aşağıda.",
    approvedStatus: "Onaylandı",
    noteFromStudio: "Stüdyodan not",
    addToCalendar: "Takvime ekle",
    directions: "Yol tarifi",
    address: "Adres",
    callUs: "Bizi arayın",
    approvedFootnote: "Bir değişiklik olursa bu e-postayı yanıtlamanız yeterli.",
    declinedEyebrow: "Randevu talebiniz",
    declinedTitle: (first: string) => `Merhaba ${first}, ilginiz için <em>teşekkür ederiz</em>.`,
    declinedLead: (service: string, hasDate: boolean, hasTime: boolean) =>
      hasDate
        ? `Maalesef talep ettiğiniz ${hasTime ? "tarih ve saatte" : "tarihte"} sizinle görüşemiyoruz.`
        : `${service} talebinizi dikkatle inceledik; maalesef şu an bu görüşmeyi planlayamıyoruz.`,
    declinedStatus: "Uygun değil",
    declinedNote: "Açıklama",
    declinedInvite: (hasDate: boolean) =>
      hasDate ? "Size uygun başka bir zaman seçerseniz memnuniyetle ağırlarız." : "İhtiyacınız değişirse ya da başka bir konuda konuşmak isterseniz bize her zaman yazabilirsiniz.",
    newTime: (hasDate: boolean) => (hasDate ? "Başka bir zaman seçin" : "Yeni randevu talebi"),
    whatsapp: "WhatsApp'tan yazın",
    approvedPreheader: (when: string) => (when ? `${when} — U+ Studio'da görüşmek üzere.` : "U+ Studio'da görüşmek üzere."),
    declinedPreheader: "Randevu talebiniz için bir açıklamamız var.",
    greeting: (first: string) => `Merhaba ${first},`,
    approvedIntro: "Randevunuz onaylandı; sizi stüdyomuzda ağırlamayı sabırsızlıkla bekliyoruz.",
    appointment: "RANDEVU",
  },
  en: {
    approvedSubject: (when: string) => (when ? `Your appointment is confirmed · ${when} · U+ Studio` : "Your appointment request is confirmed · U+ Studio"),
    declinedSubject: "About your appointment request · U+ Studio",
    approvedEyebrow: "Appointment confirmed",
    approvedTitle: (first: string) => `See you soon, <em>${first}</em>.`,
    approvedLead: "We look forward to welcoming you at our studio. Your appointment details are below.",
    approvedStatus: "Confirmed",
    noteFromStudio: "A note from the studio",
    addToCalendar: "Add to calendar",
    directions: "Directions",
    address: "Address",
    callUs: "Call us",
    approvedFootnote: "If anything changes, simply reply to this email.",
    declinedEyebrow: "Your appointment request",
    declinedTitle: (first: string) => `Hello ${first}, thank you for <em>getting in touch</em>.`,
    declinedLead: (service: string, hasDate: boolean, hasTime: boolean) =>
      hasDate
        ? `Unfortunately we can't meet on the ${hasTime ? "date and time" : "date"} you requested.`
        : `We carefully reviewed your ${service} request; unfortunately we can't schedule this meeting right now.`,
    declinedStatus: "Unavailable",
    declinedNote: "Note",
    declinedInvite: (hasDate: boolean) =>
      hasDate ? "We'd be glad to welcome you at another time that suits you." : "If your plans change or you'd like to talk about something else, just write to us.",
    newTime: (hasDate: boolean) => (hasDate ? "Pick another time" : "New appointment request"),
    whatsapp: "Message us on WhatsApp",
    approvedPreheader: (when: string) => (when ? `${when} — see you at U+ Studio.` : "See you at U+ Studio."),
    declinedPreheader: "A note about your appointment request.",
    greeting: (first: string) => `Hello ${first},`,
    approvedIntro: "Your appointment is confirmed; we look forward to welcoming you at our studio.",
    appointment: "APPOINTMENT",
  },
};

export function buildClientEmail(
  input: AppointmentEmailInput,
  opts: { reference: string; status: "approved" | "declined"; note?: string; bookingUrl: string }
) {
  const locale: Locale = input.locale === "en" ? "en" : "tr";
  const copy = CLIENT_COPY[locale];
  const { hasDate, dateLine, dayName, time, when, gcal } = describe(input, locale);
  const firstName = escapeHtml(input.name.trim().split(/\s+/)[0] ?? "");
  const note = opts.note?.trim() ? escapeHtml(opts.note.trim()) : "";
  const approved = opts.status === "approved";

  const subject = approved ? copy.approvedSubject(when) : copy.declinedSubject;

  const body = approved
    ? `
    <tr><td class="pad" style="padding:38px 40px 10px;">
      ${eyebrow(copy.approvedEyebrow)}
      <p style="margin:14px 0 8px;font-family:${SERIF};font-size:32px;line-height:1.2;color:${C.bone};">${copy.approvedTitle(firstName)}</p>
      <p style="margin:0 0 26px;font-family:${SANS};font-size:15px;line-height:1.7;color:${C.mute};">${copy.approvedLead}</p>
      ${ticket({ dateLine, dayName, time, service: input.service, status: { label: copy.approvedStatus, color: C.clay }, locale })}
    </td></tr>
    ${note ? `<tr><td class="pad" style="padding:26px 40px 4px;">${eyebrow(copy.noteFromStudio, C.mute)}<div style="height:12px;line-height:12px;">&nbsp;</div>${quote(note)}</td></tr>` : ""}
    <tr><td class="pad" style="padding:30px 40px 8px;">
      ${gcal ? buttonPair(solidButton(gcal, copy.addToCalendar), lineButton(STUDIO.directions, copy.directions)) : solidButton(STUDIO.directions, copy.directions)}
    </td></tr>
    <tr><td class="pad" style="padding:22px 40px 36px;">
      ${eyebrow(copy.address, C.mute)}
      <p style="margin:10px 0 16px;font-family:${SANS};font-size:15px;line-height:1.6;color:${C.bone};">${STUDIO.address}</p>
      <p style="margin:0;line-height:2.2;">${textLinks([
        { href: STUDIO.whatsapp, label: "WhatsApp" },
        { href: STUDIO.phoneHref, label: copy.callUs },
      ])}</p>
      <p style="margin:14px 0 0;font-family:${SANS};font-size:12.5px;line-height:1.6;color:${C.faint};">${copy.approvedFootnote}</p>
    </td></tr>`
    : `
    <tr><td class="pad" style="padding:38px 40px 10px;">
      ${eyebrow(copy.declinedEyebrow)}
      <p style="margin:14px 0 8px;font-family:${SERIF};font-size:30px;line-height:1.25;color:${C.bone};">${copy.declinedTitle(firstName)}</p>
      <p style="margin:0 0 ${hasDate ? 26 : 8}px;font-family:${SANS};font-size:15px;line-height:1.7;color:${C.mute};">${copy.declinedLead(escapeHtml(input.service), hasDate, Boolean(time))}</p>
      ${hasDate ? ticket({ dateLine, dayName, time, service: input.service, status: { label: copy.declinedStatus, color: C.mute }, locale }) : ""}
    </td></tr>
    ${note ? `<tr><td class="pad" style="padding:26px 40px 4px;">${eyebrow(copy.declinedNote, C.mute)}<div style="height:12px;line-height:12px;">&nbsp;</div>${quote(note)}</td></tr>` : ""}
    <tr><td class="pad" style="padding:30px 40px 36px;">
      <p style="margin:0 0 18px;font-family:${SANS};font-size:15px;line-height:1.7;color:${C.mute};">${copy.declinedInvite(hasDate)}</p>
      ${buttonPair(solidButton(opts.bookingUrl, copy.newTime(hasDate)), lineButton(STUDIO.whatsapp, copy.whatsapp))}
    </td></tr>`;

  const html = layout({
    title: subject,
    preheader: approved ? copy.approvedPreheader(when) : copy.declinedPreheader,
    label: LABELS[locale].appointment,
    reference: opts.reference,
    body,
    locale,
  });
  const noteText = opts.note?.trim();
  const upper = (text: string) => text.toLocaleUpperCase(locale === "en" ? "en-US" : "tr-TR");
  const labels = LABELS[locale];
  const signature = ["", "U+ Studio", `${STUDIO.phone} · ${STUDIO.email}`, "uplusstudio.com.tr", `${labels.appointment} #${opts.reference}`];
  const greeting = copy.greeting(input.name.trim().split(/\s+/)[0] ?? "");
  const text = (
    approved
      ? [
          greeting,
          "",
          copy.approvedIntro,
          "",
          copy.appointment,
          `${labels.date}: ${dateLine}${dayName ? ` ${dayName}` : ""}`,
          ...(time ? [`${labels.time}: ${time}`] : []),
          `${labels.service}: ${input.service}`,
          `${copy.address}: ${STUDIO.address}`,
          ...(noteText ? ["", upper(copy.noteFromStudio), noteText] : []),
          "",
          ...(gcal ? [`${copy.addToCalendar}: ${gcal}`] : []),
          `${copy.directions}: ${STUDIO.directions}`,
          ...signature,
        ]
      : [
          greeting,
          "",
          copy.declinedLead(input.service, hasDate, Boolean(time)),
          ...(noteText ? ["", upper(copy.declinedNote), noteText] : []),
          "",
          copy.declinedInvite(hasDate),
          `${copy.newTime(hasDate)}: ${opts.bookingUrl}`,
          ...signature,
        ]
  ).join("\n");
  return { subject, html, text };
}
