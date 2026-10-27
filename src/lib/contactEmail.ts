import { formatPhone } from "./appointmentLinks";

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
  const topic = input.subject.trim();
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
      input.message.trim(),
      "",
      heading(c.contact),
      field(c.name, name),
      field(c.phone, formatPhone(input.phone)),
      field(c.email, input.email.trim()),
      "",
      markup ? `_${c.source}_` : `— ${c.source}`,
    ].join("\n"),
  };
}
