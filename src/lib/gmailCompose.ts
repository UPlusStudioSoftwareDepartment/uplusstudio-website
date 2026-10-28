export interface ComposedMail {
  to: string;
  subject: string;
  text: string;
}

export function gmailComposeUrl({ to, subject, text }: ComposedMail) {
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}${text ? `&body=${encodeURIComponent(text)}` : ""}`;
}

export type MailPlatform = "ios" | "android" | "desktop";

export function mailPlatform(): MailPlatform {
  if (typeof navigator === "undefined") return "desktop";
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/i.test(ua) || (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1)) return "ios";
  if (/Android/i.test(ua)) return "android";
  return "desktop";
}

export function mailtoUrl({ to, subject, text }: ComposedMail) {
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
}

export function gmailAppUrl({ to, subject, text }: ComposedMail) {
  return `googlegmail:///co?to=${encodeURIComponent(to)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
}

export function openUrl(url: string) {
  return Boolean(globalThis.open(url, "_blank"));
}

export function followLink(href: string) {
  const link = Object.assign(document.createElement("a"), { href });
  document.body.append(link);
  link.click();
  link.remove();
}

export const openGmail = (mail: ComposedMail) => openUrl(gmailComposeUrl(mail));
