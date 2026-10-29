import { escapeHtml } from "./sanitize";
import { STUDIO_ADDRESS } from "./appointmentLinks";
import { studioInfo } from "./studio-info";

export type Locale = "tr" | "en";

export const STUDIO = {
  disciplines: { tr: "Mimarlık & İç Mimarlık & Mühendislik", en: "Architecture, Interiors & Engineering" },
  address: STUDIO_ADDRESS,
  phone: studioInfo.phoneDisplay,
  phoneHref: studioInfo.phoneHref,
  whatsapp: studioInfo.whatsappUrl,
  email: studioInfo.email,
  directions: studioInfo.directionsUrl,
};

const C = {
  page: "#f2efe8",
  card: "#fcfbf8",
  ink: "#1c1b19",
  mute: "#5f5a52",
  line: "#e2ddd3",
  brand: "#151413",
  brandText: "#f1ede5",
  accent: "#9a5a36",
};

const SANS = "'Helvetica Neue',Helvetica,Arial,sans-serif";
const SERIF = "Georgia,'Times New Roman',serif";

export type Row = [label: string, value: string];

export const row = (label: string, value: string): Row => [label, value];

export function layout({
  title,
  preheader,
  label,
  reference,
  body,
  reason,
  locale = "tr",
}: {
  title: string;
  preheader: string;
  label: string;
  reference?: string;
  body: string;
  reason: string;
  locale?: Locale;
}) {
  return `<!doctype html>
<html lang="${locale}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${escapeHtml(title)}</title>
<style>
  a { color:${C.ink}; }
  .btn:hover { opacity:.88; }
  @media (max-width:620px) {
    .pad { padding-left:22px !important; padding-right:22px !important; }
    .stack td { display:block !important; width:100% !important; padding:0 0 10px !important; }
    .row-label, .row-value { display:block !important; width:100% !important; }
    .row-label { padding-bottom:2px !important; border-bottom:0 !important; }
    .row-value { padding-top:0 !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:${C.page};-webkit-font-smoothing:antialiased;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}&#8199;&#65279;&#847;&#8199;&#65279;&#847;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.page};">
<tr><td align="center" style="padding:32px 12px 40px;">
  <!--[if mso]><table role="presentation" width="600" cellpadding="0" cellspacing="0"><tr><td><![endif]-->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:${C.card};border:1px solid ${C.line};border-radius:8px;overflow:hidden;">
    <tr><td class="pad" style="padding:22px 36px;background:${C.brand};">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
        <td style="vertical-align:middle;white-space:nowrap;font-family:${SANS};font-size:17px;font-weight:700;color:${C.brandText};">U+ Studio</td>
        <td align="right" style="vertical-align:middle;font-family:${SANS};font-size:12px;letter-spacing:1px;text-transform:uppercase;color:${C.brandText};">${escapeHtml(label)}${reference ? `&nbsp;&nbsp;<strong>#${escapeHtml(reference)}</strong>` : ""}</td>
      </tr></table>
    </td></tr>
    ${body}
    <tr><td style="height:20px;line-height:20px;">&nbsp;</td></tr>
    <tr><td class="pad" style="padding:22px 36px 26px;border-top:1px solid ${C.line};">
      <p style="margin:0;font-family:${SANS};font-size:13px;line-height:1.6;color:${C.mute};">
        <strong style="color:${C.ink};">U+ Studio</strong> · ${STUDIO.disciplines[locale]}<br>
        ${STUDIO.address}<br>
        <a href="${STUDIO.phoneHref}" style="color:${C.mute};">${STUDIO.phone}</a> · <a href="mailto:${STUDIO.email}" style="color:${C.mute};">${STUDIO.email}</a> · <a href="https://www.uplusstudio.com.tr" style="color:${C.mute};">uplusstudio.com.tr</a>
      </p>
      <p style="margin:12px 0 0;font-family:${SANS};font-size:12px;line-height:1.6;color:${C.mute};">${escapeHtml(reason)}</p>
    </td></tr>
  </table>
  <!--[if mso]></td></tr></table><![endif]-->
</td></tr>
</table>
</body>
</html>`;
}

export function strong(text: string) {
  return `<strong style="color:${C.ink};">${text}</strong>`;
}

export function intro(title: string, lead: string) {
  return `<tr><td class="pad" style="padding:32px 36px 8px;">
      <h1 style="margin:0;font-family:${SERIF};font-size:26px;line-height:1.25;font-weight:400;color:${C.ink};">${title}</h1>
      <p style="margin:10px 0 0;font-family:${SANS};font-size:16px;line-height:1.6;color:${C.mute};">${lead}</p>
    </td></tr>`;
}

export function section(title: string, content: string) {
  return `<tr><td class="pad" style="padding:24px 36px 4px;">
      ${title ? `<h2 style="margin:0 0 10px;font-family:${SANS};font-size:13px;line-height:1.4;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:${C.accent};">${title}</h2>` : ""}
      ${content}
    </td></tr>`;
}

export function details(rows: Row[]) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${C.line};">
        ${rows
          .map(
            ([label, value]) => `<tr>
          <td class="row-label" width="34%" style="padding:11px 12px 11px 0;border-bottom:1px solid ${C.line};font-family:${SANS};font-size:14px;line-height:24px;font-weight:700;color:${C.ink};vertical-align:top;">${label}</td>
          <td class="row-value" style="padding:11px 0;border-bottom:1px solid ${C.line};font-family:${SANS};font-size:16px;line-height:24px;color:${C.ink};vertical-align:top;">${value}</td>
        </tr>`
          )
          .join("\n        ")}
      </table>`;
}

export function headline(text: string) {
  return `<p style="margin:0;font-family:${SERIF};font-size:20px;line-height:1.4;color:${C.ink};">${text}</p>`;
}

export function quote(text: string) {
  return `<div style="padding:14px 16px;background:${C.page};border-left:3px solid ${C.accent};font-family:${SANS};font-size:16px;line-height:1.6;color:${C.ink};white-space:pre-wrap;">${text}</div>`;
}

export function paragraph(text: string) {
  return `<p style="margin:0 0 14px;font-family:${SANS};font-size:15px;line-height:1.6;color:${C.mute};">${text}</p>`;
}

export function link(href: string, label: string) {
  return `<a href="${href}" style="color:${C.ink};font-weight:700;">${label}</a>`;
}

export function button(href: string, label: string, tone: "primary" | "secondary" | "danger" = "primary") {
  const colors = {
    primary: `background:${C.brand};border:1px solid ${C.brand};color:${C.brandText};`,
    secondary: `background:${C.card};border:1px solid ${C.ink};color:${C.ink};`,
    danger: `background:${C.card};border:1px solid ${C.accent};color:${C.accent};`,
  }[tone];
  return `<a class="btn" href="${href}" style="display:block;padding:14px 18px;border-radius:4px;${colors}font-family:${SANS};font-size:15px;font-weight:700;line-height:20px;text-align:center;text-decoration:none;">${label}</a>`;
}

export function buttons(...items: string[]) {
  if (items.length === 1) return items[0];
  return `<table role="presentation" class="stack" width="100%" cellpadding="0" cellspacing="0"><tr>
        ${items.map((item, i) => `<td width="${Math.floor(100 / items.length)}%" style="vertical-align:top;${i ? "padding-left:6px;" : "padding-right:6px;"}">${item}</td>`).join("\n        ")}
      </tr></table>`;
}

export function inlineLinks(items: { href: string; label: string }[]) {
  return `<p style="margin:0;font-family:${SANS};font-size:15px;line-height:2;color:${C.mute};">${items.map((item) => `<span style="white-space:nowrap;">${link(item.href, item.label)}</span>`).join("&nbsp;&nbsp;·&nbsp; ")}</p>`;
}
