import { studioInfo } from "@/lib/studio-info";

const VCARD = [
  "BEGIN:VCARD",
  "VERSION:3.0",
  "N:;U+ Studio;;;",
  "FN:U+ Studio Mimarlık & İç Mimarlık & Mühendislik",
  "ORG:U+ Studio",
  `TEL;TYPE=WORK,VOICE:${studioInfo.phoneHref.replace("tel:", "")}`,
  `EMAIL;TYPE=WORK:${studioInfo.email}`,
  "URL:https://www.uplusstudio.com.tr",
  "ADR;TYPE=WORK:;;Reyhan Cd. Merkez İncek Plaza No:3 Kat:1 D:2;Gölbaşı;Ankara;06830;Türkiye",
  "END:VCARD",
].join("\r\n");

export function GET() {
  return new Response(VCARD, {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": 'attachment; filename="uplus-studio.vcf"',
      "Cache-Control": "public, max-age=86400",
    },
  });
}
