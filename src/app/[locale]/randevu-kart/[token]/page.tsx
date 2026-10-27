import type { Metadata } from "next";
import { appointmentReference, readAppointmentToken } from "@/lib/appointmentToken";
import AppointmentCardView from "@/components/AppointmentCardView";

export const dynamic = "force-dynamic";

const MONTHS = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];

type Params = { params: Promise<{ token: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { token } = await params;
  const data = readAppointmentToken(decodeURIComponent(token));
  const m = data && /^(\d{4})-(\d{2})-(\d{2})/.exec(data.date);
  const when = m ? `${Number(m[3])} ${MONTHS[Number(m[2]) - 1]} ${m[1]} · ${data?.time}` : "";
  const title = data ? `Randevu kartı · ${data.name} · ${when}` : "Randevu kartı";
  const description = data ? `${data.service} — U+ Studio, İncek · Gölbaşı / Ankara` : "U+ Studio";
  return {
    title,
    description,
    robots: { index: false, follow: false },
    openGraph: { title, description, type: "website", siteName: "U+ Studio" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function AppointmentCardPage({ params, searchParams }: Params & { searchParams: Promise<{ k?: string }> }) {
  const { token } = await params;
  const { k } = await searchParams;
  const raw = decodeURIComponent(token);
  const data = readAppointmentToken(raw);
  const appointment = data
    ? { name: data.name, email: data.email, phone: data.phone, service: data.service, date: data.date, time: data.time, message: data.message }
    : null;
  return <AppointmentCardView appointment={appointment} reference={data ? appointmentReference(raw) : ""} via={k === "mail" ? "mail" : "whatsapp"} />;
}
