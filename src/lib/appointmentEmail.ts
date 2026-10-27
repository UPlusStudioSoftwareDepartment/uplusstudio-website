import { escapeHtml } from "./sanitize";
import { EN_DAYS, EN_MONTHS, FLEXIBLE_DATE, NO_DATE_HINT, TR_DAYS, TR_MONTHS, parseAppointmentDate } from "./appointmentDate";
import { calendarUrl, formatPhone, whatsappNumber } from "./appointmentLinks";
import { STUDIO, type Locale, type Row, button, buttons, details, inlineLinks, intro, layout, link, paragraph, quote, row, section, strong } from "./emailLayout";

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
  tr: { appointment: "Randevu", date: "Tarih", time: "Saat", service: "Hizmet", address: "Adres", name: "Ad Soyad", phone: "Telefon", email: "E-posta" },
  en: { appointment: "Appointment", date: "Date", time: "Time", service: "Service", address: "Address", name: "Name", phone: "Phone", email: "Email" },
};

function describe(input: AppointmentEmailInput, locale: Locale = "tr") {
  const day = parseAppointmentDate(input.date);
  const time = input.time.trim();
  const dateLine = day ? (locale === "en" ? `${EN_MONTHS[day.month - 1]} ${day.day}, ${day.year}` : `${day.day} ${TR_MONTHS[day.month - 1]} ${day.year}`) : "";
  const dayName = day ? (locale === "en" ? EN_DAYS : TR_DAYS)[day.weekday] : "";
  const cal = locale === "en" ? ["Service", "Name", "Phone", "Email", "Note"] : ["Hizmet", "Ad Soyad", "Telefon", "E-posta", "Not"];
  const gcal = calendarUrl({
    date: input.date,
    time,
    title: `U+ Studio — ${input.service}`,
    details: `${cal[0]}: ${input.service}\n${cal[1]}: ${input.name}\n${cal[2]}: ${input.phone}\n${cal[3]}: ${input.email}${input.message.trim() ? `\n\n${cal[4]}: ${input.message.trim()}` : ""}`,
  });
  return {
    hasDate: Boolean(day),
    dateText: day ? `${dateLine} ${dayName}` : FLEXIBLE_DATE[locale],
    time,
    when: [dateLine, time].filter(Boolean).join(" "),
    gcal,
  };
}

export function buildStudioEmail(
  input: AppointmentEmailInput,
  opts: { reference: string; approveUrl?: string; declineUrl?: string; cardUrl?: string }
) {
  const l = LABELS.tr;
  const { hasDate, dateText, time, when, gcal } = describe(input);
  const name = input.name.trim();
  const email = input.email.trim();
  const phone = formatPhone(input.phone);
  const message = input.message.trim();
  const firstName = name.split(/\s+/)[0] ?? "";
  const wa = whatsappNumber(input.phone);
  const telLink = `tel:${input.phone.replace(/[^\d+]/g, "")}`;
  const waLink = `https://wa.me/${wa}?text=${encodeURIComponent(`Merhaba ${firstName}, U+ Studio'dan yazıyoruz. ${when ? `${when} için randevu` : "Randevu"} talebinizi aldık.`)}`;
  const mailLink = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(when ? `U+ Studio — ${when} randevunuz` : "U+ Studio — randevu talebiniz")}`;
  const english = input.locale === "en";
  const slot: Row[] = [
    [l.service, escapeHtml(input.service)],
    [l.date, hasDate ? escapeHtml(dateText) : `${escapeHtml(dateText)} — ${NO_DATE_HINT.toLocaleLowerCase("tr-TR")}; uygun bir gün ve saat önerin.`],
    ...(time ? [row(l.time, escapeHtml(time))] : []),
  ];

  const subject = `Yeni randevu talebi · ${name}${when ? ` · ${when}` : ""}`;
  const body = [
    intro("Yeni randevu talebi", `${strong(escapeHtml(name))} stüdyonuzda yüz yüze görüşmek istiyor.${english ? " Müşteri siteyi İngilizce kullandı." : ""}`),
    section("Randevu", details(slot)),
    message && section("Mesaj", quote(escapeHtml(message))),
    section(
      "Müşteri",
      details([
        [l.name, escapeHtml(name)],
        [l.phone, link(telLink, escapeHtml(phone))],
        [l.email, link(`mailto:${escapeHtml(email)}`, escapeHtml(email))],
      ])
    ),
    opts.approveUrl &&
      opts.declineUrl &&
      section(
        "Yanıtınız",
        `${paragraph("Onayla ya da Reddet'e bastığınızda müşteriye gidecek e-posta hazırlanır. Reddederken bir açıklama yazmanız istenir.")}
      ${buttons(button(opts.approveUrl, "Onayla ✓"), button(opts.declineUrl, "Reddet ✕", "danger"))}`
      ),
    section(
      "Hızlı işlemler",
      inlineLinks([
        ...(wa ? [{ href: waLink, label: "WhatsApp'tan yaz" }] : []),
        { href: telLink, label: "Ara" },
        { href: mailLink, label: "E-posta gönder" },
        ...(gcal ? [{ href: gcal, label: "Google Takvim'e ekle" }] : []),
        ...(opts.cardUrl ? [{ href: opts.cardUrl, label: "Randevu kartı" }] : []),
      ])
    ),
  ]
    .filter(Boolean)
    .join("\n    ");

  const html = layout({
    title: subject,
    preheader: [input.service, when, name].filter(Boolean).join(" · "),
    label: l.appointment,
    reference: opts.reference,
    body,
    reason: "Bu e-posta uplusstudio.com.tr randevu formundan gönderildi. Yanıtlamak doğrudan müşteriye gider.",
  });
  const plain = [
    `YENİ RANDEVU TALEBİ — #${opts.reference}`,
    "",
    "HİZMET",
    input.service,
    "",
    "TARİH VE SAAT",
    hasDate ? [dateText, time].filter(Boolean).join(", ") : `${dateText} (${NO_DATE_HINT.toLocaleLowerCase("tr-TR")})`,
    ...(message ? ["", "MESAJ", message] : []),
    "",
    "MÜŞTERİ",
    `${l.name}: ${name}`,
    `${l.phone}: ${phone}`,
    `${l.email}: ${email}`,
    ...(opts.cardUrl ? ["", "RANDEVU KARTI", opts.cardUrl] : []),
    ...(opts.approveUrl && opts.declineUrl ? ["", `Onayla: ${opts.approveUrl}`, `Reddet: ${opts.declineUrl}`] : []),
  ].join("\n");
  return { subject, html, text: plain };
}

const CLIENT_COPY = {
  tr: {
    approvedSubject: (when: string) => (when ? `Randevunuz onaylandı · ${when} · U+ Studio` : "Randevu talebiniz onaylandı · U+ Studio"),
    declinedSubject: "Randevu talebiniz hakkında · U+ Studio",
    approvedTitle: "Randevunuz onaylandı",
    greeting: (first: string) => `Merhaba ${first},`,
    approvedLead: "sizi stüdyomuzda ağırlamayı sabırsızlıkla bekliyoruz. Randevu bilgileriniz aşağıda.",
    noteFromStudio: "Stüdyodan not",
    addToCalendar: "Takvime ekle",
    directions: "Yol tarifi",
    callUs: "Bizi arayın",
    approvedReason: "Bu e-postayı uplusstudio.com.tr üzerinden randevu talep ettiğiniz için aldınız. Bir değişiklik olursa bu e-postayı yanıtlamanız yeterli.",
    declinedTitle: "Randevu talebiniz hakkında",
    declinedLead: (service: string, hasDate: boolean, hasTime: boolean) =>
      hasDate
        ? `ilginiz için teşekkür ederiz. Maalesef talep ettiğiniz ${hasTime ? "tarih ve saatte" : "tarihte"} sizinle görüşemiyoruz.`
        : `ilginiz için teşekkür ederiz. ${service} talebinizi dikkatle inceledik; maalesef şu an bu görüşmeyi planlayamıyoruz.`,
    declinedNote: "Açıklama",
    declinedInvite: (hasDate: boolean) =>
      hasDate ? "Size uygun başka bir zaman seçerseniz memnuniyetle ağırlarız." : "İhtiyacınız değişirse ya da başka bir konuda konuşmak isterseniz bize her zaman yazabilirsiniz.",
    newTime: (hasDate: boolean) => (hasDate ? "Başka bir zaman seçin" : "Yeni randevu talebi"),
    whatsapp: "WhatsApp'tan yazın",
    declinedReason: "Bu e-postayı uplusstudio.com.tr üzerinden randevu talep ettiğiniz için aldınız.",
    approvedPreheader: (when: string) => (when ? `${when} — U+ Studio'da görüşmek üzere.` : "U+ Studio'da görüşmek üzere."),
    declinedPreheader: "Randevu talebiniz için bir açıklamamız var.",
  },
  en: {
    approvedSubject: (when: string) => (when ? `Your appointment is confirmed · ${when} · U+ Studio` : "Your appointment request is confirmed · U+ Studio"),
    declinedSubject: "About your appointment request · U+ Studio",
    approvedTitle: "Your appointment is confirmed",
    greeting: (first: string) => `Hello ${first},`,
    approvedLead: "we look forward to welcoming you at our studio. Your appointment details are below.",
    noteFromStudio: "A note from the studio",
    addToCalendar: "Add to calendar",
    directions: "Directions",
    callUs: "Call us",
    approvedReason: "You received this email because you requested an appointment on uplusstudio.com.tr. If anything changes, simply reply to this email.",
    declinedTitle: "About your appointment request",
    declinedLead: (service: string, hasDate: boolean, hasTime: boolean) =>
      hasDate
        ? `thank you for getting in touch. Unfortunately we can't meet on the ${hasTime ? "date and time" : "date"} you requested.`
        : `thank you for getting in touch. We carefully reviewed your ${service} request; unfortunately we can't schedule this meeting right now.`,
    declinedNote: "Note",
    declinedInvite: (hasDate: boolean) =>
      hasDate ? "We'd be glad to welcome you at another time that suits you." : "If your plans change or you'd like to talk about something else, just write to us.",
    newTime: (hasDate: boolean) => (hasDate ? "Pick another time" : "New appointment request"),
    whatsapp: "Message us on WhatsApp",
    declinedReason: "You received this email because you requested an appointment on uplusstudio.com.tr.",
    approvedPreheader: (when: string) => (when ? `${when} — see you at U+ Studio.` : "See you at U+ Studio."),
    declinedPreheader: "A note about your appointment request.",
  },
};

export function buildClientEmail(
  input: AppointmentEmailInput,
  opts: { reference: string; status: "approved" | "declined"; note?: string; bookingUrl: string }
) {
  const locale: Locale = input.locale === "en" ? "en" : "tr";
  const copy = CLIENT_COPY[locale];
  const l = LABELS[locale];
  const { hasDate, dateText, time, when, gcal } = describe(input, locale);
  const firstName = input.name.trim().split(/\s+/)[0] ?? "";
  const note = opts.note?.trim() ?? "";
  const approved = opts.status === "approved";
  const upper = (value: string) => value.toLocaleUpperCase(locale === "en" ? "en-US" : "tr-TR");
  const slot: Row[] = [
    ...(hasDate ? [row(l.date, escapeHtml(dateText))] : []),
    ...(time ? [row(l.time, escapeHtml(time))] : []),
    row(l.service, escapeHtml(input.service)),
  ];
  const slotText = [...(hasDate ? [`${l.date}: ${dateText}`] : []), ...(time ? [`${l.time}: ${time}`] : []), `${l.service}: ${input.service}`];

  const subject = approved ? copy.approvedSubject(when) : copy.declinedSubject;
  const greeting = `${escapeHtml(copy.greeting(firstName))} `;
  const body = approved
    ? [
        intro(copy.approvedTitle, `${greeting}${copy.approvedLead}`),
        section(l.appointment, details([...slot, [l.address, escapeHtml(STUDIO.address)]])),
        note && section(copy.noteFromStudio, quote(escapeHtml(note))),
        section(
          "",
          gcal ? buttons(button(gcal, copy.addToCalendar), button(STUDIO.directions, copy.directions, "secondary")) : button(STUDIO.directions, copy.directions)
        ),
        section("", inlineLinks([{ href: STUDIO.whatsapp, label: "WhatsApp" }, { href: STUDIO.phoneHref, label: copy.callUs }])),
      ]
    : [
        intro(copy.declinedTitle, `${greeting}${copy.declinedLead(escapeHtml(input.service), hasDate, Boolean(time))}`),
        hasDate && section(l.appointment, details(slot)),
        note && section(copy.declinedNote, quote(escapeHtml(note))),
        section("", `${paragraph(copy.declinedInvite(hasDate))}${buttons(button(opts.bookingUrl, copy.newTime(hasDate)), button(STUDIO.whatsapp, copy.whatsapp, "secondary"))}`),
      ];

  const html = layout({
    title: subject,
    preheader: approved ? copy.approvedPreheader(when) : copy.declinedPreheader,
    label: l.appointment,
    reference: opts.reference,
    body: body.filter(Boolean).join("\n    "),
    reason: approved ? copy.approvedReason : copy.declinedReason,
    locale,
  });

  const signature = ["", "-- ", "U+ Studio", `${STUDIO.phone} · ${STUDIO.email}`, `uplusstudio.com.tr · ${l.appointment} #${opts.reference}`];
  const plain = (
    approved
      ? [
          copy.greeting(firstName),
          "",
          `${copy.approvedTitle}; ${copy.approvedLead}`,
          "",
          upper(l.appointment),
          ...slotText,
          `${l.address}: ${STUDIO.address}`,
          ...(note ? ["", upper(copy.noteFromStudio), note] : []),
          "",
          ...(gcal ? [`${copy.addToCalendar}: ${gcal}`] : []),
          `${copy.directions}: ${STUDIO.directions}`,
          ...signature,
        ]
      : [
          copy.greeting(firstName),
          "",
          copy.declinedLead(input.service, hasDate, Boolean(time)).replace(/^./, upper),
          ...(hasDate ? ["", upper(l.appointment), ...slotText] : []),
          ...(note ? ["", upper(copy.declinedNote), note] : []),
          "",
          copy.declinedInvite(hasDate),
          `${copy.newTime(hasDate)}: ${opts.bookingUrl}`,
          ...signature,
        ]
  ).join("\n");
  return { subject, html, text: plain };
}
