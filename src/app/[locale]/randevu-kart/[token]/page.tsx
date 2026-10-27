import type { Metadata } from "next";
import { appointmentReference, readAppointmentToken } from "@/lib/appointmentToken";
import AppointmentCardView from "@/components/AppointmentCardView";
import { TR_MONTHS, parseAppointmentDate } from "@/lib/appointmentDate";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ token: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { token } = await params;
  const data = readAppointmentToken(decodeURIComponent(token));
  const p = data ? parseAppointmentDate(data.date) : null;
  const when = [p ? `${p.day} ${TR_MONTHS[p.month - 1]} ${p.year}` : "", data?.time ?? ""].filter(Boolean).join(" · ");
  const title = data ? ["Randevu kartı", data.name, when].filter(Boolean).join(" · ") : "Randevu kartı";
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
  return <AppointmentCardView appointment={appointment} token={raw} reference={data ? appointmentReference(raw) : ""} via={k === "mail" ? "mail" : "whatsapp"} />;
}
