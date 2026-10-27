import type { Metadata } from "next";
import { appointmentReference, readAppointmentToken } from "@/lib/appointmentToken";
import AppointmentCustomerAction from "@/components/AppointmentCustomerAction";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Randevu onayı",
  robots: { index: false, follow: false },
};

export default async function Page({ searchParams }: Readonly<{ searchParams: Promise<{ t?: string }> }>) {
  const { t } = await searchParams;
  const data = readAppointmentToken(t);
  const appointment = data
    ? { name: data.name, email: data.email, phone: data.phone, service: data.service, date: data.date, time: data.time, message: data.message }
    : null;
  return <AppointmentCustomerAction mode="confirm" token={t ?? ""} reference={t && data ? appointmentReference(t) : ""} appointment={appointment} />;
}
