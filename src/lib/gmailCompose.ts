export function pasteableHtml(html: string) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  doc.querySelectorAll("style, title, meta").forEach((el) => el.remove());
  doc.body.querySelectorAll<HTMLElement>("div").forEach((el) => {
    if (el.style.display === "none") el.remove();
  });
  return doc.body.innerHTML;
}

export async function copyRich(html: Promise<string> | string, text: Promise<string> | string) {
  try {
    if (typeof ClipboardItem === "undefined" || !navigator.clipboard?.write) return false;
    const write = navigator.clipboard
      .write([
        new ClipboardItem({
          "text/html": Promise.resolve(html).then((h) => new Blob([h], { type: "text/html" })),
          "text/plain": Promise.resolve(text).then((t) => new Blob([t], { type: "text/plain" })),
        }),
      ])
      .then(() => true);
    return await Promise.race([write, new Promise<boolean>((resolve) => setTimeout(() => resolve(false), 4000))]);
  } catch {
    return false;
  }
}

export function gmailComposeUrl(to: string, subject: string, body?: string) {
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}${body ? `&body=${encodeURIComponent(body)}` : ""}`;
}

export type MailPlatform = "ios" | "android" | "desktop";

export function mailPlatform(): MailPlatform {
  if (typeof navigator === "undefined") return "desktop";
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/i.test(ua) || (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1)) return "ios";
  if (/Android/i.test(ua)) return "android";
  return "desktop";
}

export function mailtoUrl(to: string, subject: string, body: string) {
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function gmailAppUrl(to: string, subject: string, body: string) {
  return `googlegmail:///co?to=${encodeURIComponent(to)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function openUrl(url: string) {
  if (!globalThis.open(url, "_blank")) globalThis.location.href = url;
}
