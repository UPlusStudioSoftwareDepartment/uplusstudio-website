"use client";

import Image from "next/image";
import { useMemo, type ReactNode, type Ref } from "react";
import QRCode from "qrcode";
import { studioInfo } from "@/lib/studio-info";
import { icons } from "@/components/studio/SocialLinks";
import { Hayzer, Rayzer } from "@/components/mascots/Mascots";

const SITE = "uplusstudio.com.tr";
const LABEL = "font-mono text-[10px] uppercase tracking-[0.18em] text-clay";

const COPY = {
  tr: {
    discipline: "Mimarlık & İç Mimarlık & Mühendislik",
    tagline: "Mimarlık, önce düşünmekle başlar.",
    contact: "İletişim",
    findUs: "Bizi bulun",
    platforms: [
      "Google Haritalar",
      "Yandex Haritalar",
      "Armut",
      "Peyzaj Rehber",
    ],
    studio: "Stüdyo",
    founders: "Kurucular",
    services: "Hizmetler",
    reviews: "Google yorumu",
    scan: "Siteyi açmak için okutun",
    address: [
      "Merkez İncek Plaza",
      "Reyhan Cd. No:3, Kat:1 D:2",
      "İncek · Gölbaşı / Ankara",
    ],
    people: [
      { name: "Hacer Uyar", title: "Yüksek Mimar", role: "Kurucu Ortak" },
      { name: "Rıdvan Uyar", title: "İnşaat Mühendisi", role: "Kurucu Ortak" },
    ],
    serviceList: [
      ["Mimari Tasarım", "Konsept, avan ve uygulama projeleri"],
      ["İç Mimarlık", "Mekân kurgusu, malzeme ve aydınlatma tasarımı"],
      ["Yenileme & Dönüşüm", "Tadilat, cephe ve iç mekân yenileme"],
      ["Konut & Villa", "Müstakil ev, villa ve daire projeleri"],
      ["Ticari Mekânlar", "Kafe, ofis, spor salonu ve mağaza"],
      ["Özel Mobilya & Detay", "Mekâna özel mobilya ve detay çözümleri"],
      ["3D Görselleştirme", "Fotogerçekçi render ve animasyon"],
      ["Mühendislik Danışmanlığı", "Yönetmelik uyumu, teknik değerlendirme"],
      ["İzin & Onay Desteği", "Proje onay ve izin süreçlerinde yardım"],
      [
        "Uygulama & Proje Yönetimi",
        "Şantiye ve bütçe yönetimi, anahtar teslim",
      ],
    ],
  },
  en: {
    discipline: "Architecture & Interior Architecture & Engineering",
    tagline: "Architecture begins with thinking.",
    contact: "Contact",
    findUs: "Find us on",
    platforms: ["Google Maps", "Yandex Maps", "Armut", "Peyzaj Rehber"],
    studio: "Studio",
    founders: "Founders",
    services: "Services",
    reviews: "Google reviews",
    scan: "Scan to visit the website",
    address: [
      "Merkez İncek Plaza",
      "Reyhan Cd. No:3, Floor 1, Unit 2",
      "İncek · Gölbaşı / Ankara",
    ],
    people: [
      { name: "Hacer Uyar", title: "Master Architect", role: "Co-founder" },
      { name: "Rıdvan Uyar", title: "Civil Engineer", role: "Co-founder" },
    ],
    serviceList: [
      ["Architectural Design", "Concept, schematic and construction drawings"],
      [
        "Interior Architecture",
        "Space planning, materials and lighting design",
      ],
      ["Renovation & Conversion", "Refurbishment, façades and interiors"],
      ["Homes & Villas", "Detached houses, villas and apartments"],
      ["Commercial Spaces", "Cafés, offices, gyms and retail"],
      ["Bespoke Furniture & Detail", "Custom joinery and detail solutions"],
      ["3D Visualisation", "Photorealistic renders and animation"],
      ["Engineering Consultancy", "Code compliance, technical review"],
      ["Permits & Approvals", "Support through approval and permit processes"],
      ["Construction Management", "Site, budget and quality control — turnkey"],
    ],
  },
};

function QR({
  url,
  className = "",
}: Readonly<{ url: string; className?: string }>) {
  const { size, d } = useMemo(() => {
    const { modules } = QRCode.create(url, { errorCorrectionLevel: "M" });
    let path = "";
    for (let y = 0; y < modules.size; y++)
      for (let x = 0; x < modules.size; x++)
        if (modules.get(x, y)) path += `M${x} ${y}h1v1h-1z`;
    return { size: modules.size, d: path };
  }, [url]);
  return (
    <svg
      viewBox={`-2 -2 ${size + 4} ${size + 4}`}
      className={className}
      shapeRendering="crispEdges"
      aria-hidden
    >
      <rect x="-2" y="-2" width={size + 4} height={size + 4} fill="#ede9e1" />
      <path d={d} fill="#0a0a09" />
    </svg>
  );
}

function Row({
  icon,
  children,
}: Readonly<{ icon: ReactNode; children: ReactNode }>) {
  return (
    <li className="flex items-center gap-2.5">
      <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center text-bone/55 [&_img]:h-3.5 [&_img]:w-3.5 [&_svg]:h-3.5 [&_svg]:w-3.5">
        {icon}
      </span>
      <span className="min-w-0 truncate">{children}</span>
    </li>
  );
}

export default function ServiceCard({
  ref,
  locale = "tr",
  className = "",
  children,
  footer,
}: Readonly<{
  ref?: Ref<HTMLDivElement>;
  locale?: "tr" | "en";
  className?: string;
  children?: ReactNode;
  footer?: ReactNode;
}>) {
  const c = COPY[locale];
  return (
    <div
      ref={ref}
      className={`@container relative w-full overflow-hidden rounded-[6px] border border-bone/15 bg-[#0a0a09] p-7 text-bone shadow-[0_30px_80px_rgba(0,0,0,0.6)] ${className}`}
      data-modal-content="true"
    >
      <div
        className="pointer-events-none absolute -left-24 -top-28 h-72 w-72 rounded-full bg-[radial-gradient(closest-side,rgba(196,130,92,0.22),transparent)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-32 -right-24 h-72 w-72 rounded-full bg-[radial-gradient(closest-side,rgba(237,233,225,0.06),transparent)]"
        aria-hidden
      />
      {children}

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <Image
            src="/images/general_black_cuted.jpeg"
            width={300}
            height={120}
            alt="U+ Studio"
            className="h-auto w-[132px] mix-blend-screen @md:w-[150px]"
          />
          <div className="flex shrink-0 flex-col items-end gap-1 pt-1 text-right">
            <span className="flex items-center gap-1.5 font-mono text-[12px] tracking-[0.08em]">
              <svg
                className="h-3 w-3 text-[#f4b400]"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden
              >
                <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" />
              </svg>
              {studioInfo.googleRating}
            </span>
            <span className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-bone/50">
              {studioInfo.googleReviewCount} {c.reviews}
            </span>
          </div>
        </div>

        <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-bone/55 @md:text-[11px]">
          {c.discipline}
        </p>
        <p className="mt-2 font-serif text-[clamp(1.5rem,5.2vw,2.1rem)] italic leading-[1.1]">
          {c.tagline}
        </p>

        <div className="mt-6 flex items-baseline justify-between border-b border-bone/15 pb-3">
          <p className={LABEL}>{c.services}</p>
          <span className="font-mono text-[10px] tracking-[0.14em] text-bone/40">
            {String(c.serviceList.length).padStart(2, "0")}
          </span>
        </div>
        <ol>
          {c.serviceList.map(([title, desc], i) => (
            <li
              key={title}
              className="grid grid-cols-[1.75rem_1fr] items-baseline border-b border-bone/10 py-2"
            >
              <span className="font-mono text-[10px] tracking-[0.1em] text-clay">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex flex-col gap-0.5 @md:flex-row @md:items-baseline @md:justify-between @md:gap-4">
                <span className="text-[13.5px] font-medium leading-snug">
                  {title}
                </span>
                <span className="text-[11.5px] leading-snug text-bone/55 @md:text-right">
                  {desc}
                </span>
              </span>
            </li>
          ))}
        </ol>

        <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-6 @md:grid-cols-2">
          <div>
            <p className={`${LABEL} mb-3`}>{c.contact}</p>
            <ul className="space-y-2 text-[12.5px]">
              <Row icon={icons.phone}>{studioInfo.phoneDisplay}</Row>
              <Row icon={icons.whatsapp}>{studioInfo.phoneDisplay}</Row>
              <Row icon={icons.email}>{studioInfo.email}</Row>
              <Row icon={icons.instagram}>{studioInfo.instagramHandle}</Row>
              <Row
                icon={
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3Z" />
                  </svg>
                }
              >
                {SITE}
              </Row>
            </ul>
          </div>
          <div>
            <p className={`${LABEL} mb-3`}>{c.studio}</p>
            <div className="flex gap-2.5 text-[12.5px] leading-relaxed">
              <span className="mt-[3px] flex h-3.5 w-3.5 shrink-0 items-center justify-center text-bone/55 [&_svg]:h-3.5 [&_svg]:w-3.5">
                {icons.google}
              </span>
              <p>
                {c.address.map((line, i) => (
                  <span
                    key={line}
                    className={
                      i === 0 ? "block font-medium" : "block text-bone/70"
                    }
                  >
                    {line}
                  </span>
                ))}
              </p>
            </div>
          </div>
          <div>
            <p className={`${LABEL} mb-3`}>{c.findUs}</p>
            <ul className="space-y-2 text-[12.5px]">
              {[
                icons.google,
                icons.yandex,
                icons.armut,
                icons.peyzajRehber,
              ].map((icon, i) => (
                <Row key={c.platforms[i]} icon={icon}>
                  {c.platforms[i]}{" "}
                  <span className="text-bone/45">· U+ Studio</span>
                </Row>
              ))}
            </ul>
          </div>
          <div>
            <p className={`${LABEL} mb-3`}>{c.founders}</p>
            <ul className="space-y-2 text-[12.5px]">
              {c.people.map((p) => (
                <li key={p.name}>
                  <span className="block font-medium">{p.name}</span>
                  <span className="block text-[11.5px] text-bone/55">
                    {p.title} · {p.role}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 flex items-end justify-between gap-4 border-t border-bone/15 pt-5">
          <div className="flex items-center gap-3">
            <QR
              url={`https://www.${SITE}/${locale}`}
              className="h-[68px] w-[68px] shrink-0 rounded-[3px]"
            />
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[11px] tracking-[0.06em]">
                {SITE}
              </span>
              <span className="max-w-[150px] font-mono text-[9px] uppercase leading-snug tracking-[0.12em] text-bone/45">
                {c.scan}
              </span>
            </div>
          </div>
          <div
            className="-mb-1 -mr-1 flex shrink-0 items-end -space-x-3"
            aria-hidden
          >
            <Hayzer pose="wave" className="h-14 w-14" />
            <Rayzer className="h-14 w-14" />
          </div>
        </div>

        {footer}
      </div>
    </div>
  );
}
