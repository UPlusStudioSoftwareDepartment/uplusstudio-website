import type { Metadata } from "next";
import { appointmentReference, readAppointmentToken } from "@/lib/appointmentToken";
import AppointmentResponse from "@/components/AppointmentResponse";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Randevu yanıtı",
  robots: { index: false, follow: false },
};

export default async function AppointmentResponsePage({
  searchParams,
}: Readonly<{ searchParams: Promise<{ t?: string; a?: string; s?: string }> }>) {
  const { t, a, s } = await searchParams;
  const appointment = readAppointmentToken(t);
  return (
    <AppointmentResponse
      token={t ?? ""}
      signature={s ?? ""}
      initialAction={a === "decline" ? "decline" : "approve"}
      reference={t && appointment ? appointmentReference(t) : ""}
      appointment={
        appointment
          ? {
              name: appointment.name,
              email: appointment.email,
              phone: appointment.phone,
              service: appointment.service,
              date: appointment.date,
              time: appointment.time,
              message: appointment.message,
              locale: appointment.locale,
            }
          : null
      }
    />
  );
}
