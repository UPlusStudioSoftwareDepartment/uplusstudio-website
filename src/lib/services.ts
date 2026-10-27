import type { Locale } from "@/lib/i18n-config";

export type AppointmentServiceKey =
  | "architectural"
  | "interior"
  | "renovation"
  | "villa"
  | "commercial"
  | "office"
  | "visualization"
  | "consulting"
  | "site"
  | "project";

export type StudioService = { title: string; desc: string; booking: AppointmentServiceKey };

export const STUDIO_SERVICES: Record<Locale, StudioService[]> = {
  tr: [
    { title: "Mimari Tasarım", desc: "Konsept, avan ve uygulama projeleri", booking: "architectural" },
    { title: "İç Mimarlık", desc: "Mekân kurgusu, malzeme ve aydınlatma tasarımı", booking: "interior" },
    { title: "Yenileme & Dönüşüm", desc: "Tadilat, cephe ve iç mekân yenileme", booking: "renovation" },
    { title: "Konut & Villa", desc: "Müstakil ev, villa ve daire projeleri", booking: "villa" },
    { title: "Ticari Mekânlar", desc: "Kafe, ofis, spor salonu ve mağaza", booking: "commercial" },
    { title: "Özel Mobilya & Detay", desc: "Mekâna özel mobilya ve detay çözümleri", booking: "interior" },
    { title: "3D Görselleştirme", desc: "Fotogerçekçi render ve animasyon", booking: "visualization" },
    { title: "Mühendislik Danışmanlığı", desc: "Yönetmelik uyumu, teknik değerlendirme", booking: "consulting" },
    { title: "İzin & Onay Desteği", desc: "Proje onay ve izin süreçlerinde yardım", booking: "consulting" },
    { title: "Uygulama & Proje Yönetimi", desc: "Şantiye ve bütçe yönetimi, anahtar teslim", booking: "project" },
  ],
  en: [
    { title: "Architectural Design", desc: "Concept, schematic and construction drawings", booking: "architectural" },
    { title: "Interior Architecture", desc: "Space planning, materials and lighting design", booking: "interior" },
    { title: "Renovation & Conversion", desc: "Refurbishment, façades and interiors", booking: "renovation" },
    { title: "Homes & Villas", desc: "Detached houses, villas and apartments", booking: "villa" },
    { title: "Commercial Spaces", desc: "Cafés, offices, gyms and retail", booking: "commercial" },
    { title: "Bespoke Furniture & Detail", desc: "Custom joinery and detail solutions", booking: "interior" },
    { title: "3D Visualisation", desc: "Photorealistic renders and animation", booking: "visualization" },
    { title: "Engineering Consultancy", desc: "Code compliance, technical review", booking: "consulting" },
    { title: "Permits & Approvals", desc: "Support through approval and permit processes", booking: "consulting" },
    { title: "Construction Management", desc: "Site, budget and quality control — turnkey", booking: "project" },
  ],
};
