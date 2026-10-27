import { escapeHtml } from "./sanitize";
import { STUDIO_ADDRESS } from "./appointmentLinks";

export type Locale = "tr" | "en";

export const STUDIO = {
  disciplines: { tr: "Mimarlık & İç Mimarlık & Mühendislik", en: "Architecture & Interior Architecture & Engineering" },
  address: STUDIO_ADDRESS,
  phone: "+90 545 320 40 07",
  phoneHref: "tel:+905453204007",
  whatsapp: "https://wa.me/905453204007",
  email: "info@uplusstudio.com.tr",
  directions: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent("İncek Mahallesi Reyhan Caddesi No:3, 06830 Gölbaşı/Ankara")}`,
};

export const C = {
  night: "#0a0a09",
  paper: "#121110",
  card: "#1b1a17",
  bone: "#ede9e1",
  mute: "#a29d93",
  faint: "#6e695f",
  line: "#34312c",
  clay: "#c4825c",
};

export const SERIF = "Georgia,'Times New Roman',serif";
export const SANS = "'Helvetica Neue',Helvetica,Arial,sans-serif";
export const MONO = "'SFMono-Regular',Menlo,Consolas,'Courier New',monospace";

export function layout({
  title,
  preheader,
  label,
  reference,
  body,
  locale = "tr",
}: {
  title: string;
  preheader: string;
  label: string;
  reference?: string;
  body: string;
  locale?: Locale;
}) {
  return `<!doctype html>
<html lang="${locale}">
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
        <td align="right" style="vertical-align:middle;font-family:${MONO};font-size:10px;letter-spacing:1.8px;text-transform:uppercase;color:${C.mute};">${label}${reference ? `&nbsp;&nbsp;<span style="color:${C.bone};">#${escapeHtml(reference)}</span>` : ""}</td>
      </tr></table>
    </td></tr>
    ${body}
    <tr><td class="pad" style="padding:26px 40px 30px;background:${C.card};border-top:1px solid ${C.line};">
      <p style="margin:0;font-family:${SANS};font-size:13px;line-height:1.75;color:${C.mute};">
        <strong style="color:${C.bone};font-weight:600;">U+ Studio</strong> — ${STUDIO.disciplines[locale]}<br>
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

export function eyebrow(text: string, color = C.clay) {
  return `<p style="margin:0;font-family:${MONO};font-size:11px;letter-spacing:2.2px;text-transform:uppercase;color:${color};">${text}</p>`;
}

export function solidButton(href: string, label: string) {
  return `<a class="btn btn-solid" href="${href}" style="display:block;padding:16px 18px;border:1px solid ${C.bone};border-radius:4px;background:${C.bone};color:${C.night};font-family:${MONO};font-size:12px;font-weight:600;letter-spacing:1.8px;text-transform:uppercase;text-align:center;text-decoration:none;">${label}</a>`;
}

export function lineButton(href: string, label: string, color: string = C.bone, extraClass = "btn-line") {
  return `<a class="btn ${extraClass}" href="${href}" style="display:block;padding:16px 18px;border:1px solid ${color};border-radius:4px;background:transparent;color:${color};font-family:${MONO};font-size:12px;font-weight:600;letter-spacing:1.8px;text-transform:uppercase;text-align:center;text-decoration:none;">${label}</a>`;
}

export function buttonPair(left: string, right: string) {
  return `<table role="presentation" class="stack" width="100%" cellpadding="0" cellspacing="0"><tr>
    <td class="pair-l" width="50%" style="vertical-align:top;padding-right:6px;">${left}</td>
    <td class="pair-r" width="50%" style="vertical-align:top;padding-left:6px;">${right}</td>
  </tr></table>`;
}

export function textLinks(links: { href: string; label: string }[]) {
  return links
    .map((l) => `<a class="link" href="${l.href}" style="color:${C.bone};font-family:${SANS};font-size:14px;text-decoration:none;border-bottom:1px solid ${C.line};padding-bottom:2px;">${l.label}</a>`)
    .join(`<span style="color:${C.faint};">&nbsp;&nbsp;·&nbsp;&nbsp;</span>`);
}

export function detailRow(label: string, value: string) {
  return `<tr>
    <td style="padding:13px 0;border-top:1px solid ${C.line};font-family:${MONO};font-size:10.5px;letter-spacing:1.6px;text-transform:uppercase;color:${C.mute};width:32%;vertical-align:top;">${label}</td>
    <td style="padding:13px 0;border-top:1px solid ${C.line};font-family:${SANS};font-size:15px;color:${C.bone};vertical-align:top;">${value}</td>
  </tr>`;
}

export function quote(text: string) {
  return `<div style="border-left:2px solid ${C.clay};padding:6px 0 6px 18px;font-family:${SERIF};font-style:italic;font-size:18px;line-height:1.6;color:${C.bone};white-space:pre-wrap;">${text}</div>`;
}
