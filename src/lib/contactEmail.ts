import { escapeHtml } from "./sanitize";
import { formatPhone, whatsappNumber } from "./appointmentLinks";
import { details, headline, inlineLinks, intro, layout, link, quote, section, strong } from "./emailLayout";

export interface ContactEmailInput {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  locale?: "tr" | "en";
}

const COPY = {
  tr: {
    subject: "Web sitesinden mesaj",
    hello: "Merhaba U+ Studio,",
    intro: "İletişim formunuz üzerinden size ulaşıyorum.",
    topic: "KONU",
    message: "MESAJ",
    contact: "İLETİŞİM BİLGİLERİM",
    name: "Ad Soyad",
    phone: "Telefon",
    email: "E-posta",
    source: "uplusstudio.com.tr iletişim formu",
  },
  en: {
    subject: "Website message",
    hello: "Hello U+ Studio,",
    intro: "I am writing to you through your contact form.",
    topic: "SUBJECT",
    message: "MESSAGE",
    contact: "MY CONTACT DETAILS",
    name: "Name",
    phone: "Phone",
    email: "Email",
    source: "uplusstudio.com.tr contact form",
  },
};

export function buildContactEmail(input: ContactEmailInput, { markup = false } = {}) {
  const c = COPY[input.locale === "en" ? "en" : "tr"];
  const heading = (text: string) => (markup ? `*${text}*` : text);
  const field = (label: string, value: string) => `${markup ? `*${label}:*` : `${label}:`} ${value}`;
  const name = input.name.trim();
  const email = input.email.trim();
  const phone = formatPhone(input.phone);
  const topic = input.subject.trim();
  const message = input.message.trim();
  return {
    subject: `${c.subject} · ${topic} · ${name}`,
    text: [
      c.hello,
      "",
      c.intro,
      "",
      heading(c.topic),
      topic,
      "",
      heading(c.message),
      message,
      "",
      heading(c.contact),
      field(c.name, name),
      field(c.phone, phone),
      field(c.email, email),
      "",
      markup ? `_${c.source}_` : `— ${c.source}`,
    ].join("\n"),
  };
}

export function buildContactHtml(input: ContactEmailInput) {
  const name = input.name.trim();
  const email = input.email.trim();
  const topic = input.subject.trim();
  const message = input.message.trim();
  const telLink = `tel:${input.phone.replace(/[^\d+]/g, "")}`;
  const wa = whatsappNumber(input.phone);
  const waText = `Merhaba ${name.split(/\s+/)[0]}, U+ Studio'dan yazıyoruz. "${topic}" konulu mesajınızı aldık.`;
  return layout({
    title: `${COPY.tr.subject} · ${topic} · ${name}`,
    preheader: `${topic} · ${message.slice(0, 90)}`,
    label: "Mesaj",
    body: [
      intro("Web sitesinden yeni mesaj", `${strong(escapeHtml(name))} iletişim formundan size yazdı.${input.locale === "en" ? " Ziyaretçi siteyi İngilizce kullandı." : ""}`),
      section("Konu", headline(escapeHtml(topic))),
      section("Mesaj", quote(escapeHtml(message))),
      section(
        "Gönderen",
        details([
          ["Ad Soyad", escapeHtml(name)],
          ["Telefon", link(telLink, escapeHtml(formatPhone(input.phone)))],
          ["E-posta", link(`mailto:${escapeHtml(email)}`, escapeHtml(email))],
        ])
      ),
      section(
        "Hızlı yanıt",
        inlineLinks([
          { href: `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(`Re: ${topic} · U+ Studio`)}`, label: "E-postayla yanıtla" },
          ...(wa ? [{ href: `https://wa.me/${wa}?text=${encodeURIComponent(waText)}`, label: "WhatsApp'tan yaz" }] : []),
          { href: telLink, label: "Ara" },
        ])
      ),
    ].join("\n    "),
    reason: "Bu e-posta uplusstudio.com.tr iletişim formundan gönderildi. Yanıtlamak doğrudan gönderene gider.",
  });
}
