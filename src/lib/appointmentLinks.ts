import { parseAppointmentDate } from "./appointmentDate";
import { studioInfo } from "./studio-info";

export const STUDIO_ADDRESS = studioInfo.address.join(", ");

const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
const ymd = (d: Date) => `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, "0")}${String(d.getUTCDate()).padStart(2, "0")}`;

export function calendarUrl({ title, date, time, details, location = STUDIO_ADDRESS }: { title: string; date: string; time: string; details: string; location?: string }) {
  const day = parseAppointmentDate(date);
  if (!day) return "";
  const clock = /^(\d{1,2}):(\d{2})/.exec(time);
  let dates: string;
  if (clock) {
    const start = new Date(Date.UTC(day.year, day.month - 1, day.day, Number(clock[1]) - 3, Number(clock[2])));
    dates = `${stamp(start)}/${stamp(new Date(start.getTime() + 60 * 60 * 1000))}`;
  } else {
    dates = `${ymd(new Date(Date.UTC(day.year, day.month - 1, day.day)))}/${ymd(new Date(Date.UTC(day.year, day.month - 1, day.day + 1)))}`;
  }
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${dates}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}&ctz=Europe/Istanbul`;
}

export function formatPhone(phone: string) {
  const digits = whatsappNumber(phone);
  const local = /^90(\d{3})(\d{3})(\d{2})(\d{2})$/.exec(digits);
  return local ? `0${local[1]} ${local[2]} ${local[3]} ${local[4]}` : phone.trim();
}

export function whatsappNumber(phone: string) {
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("0")) digits = `90${digits.slice(1)}`;
  if (digits.length === 10 && digits.startsWith("5")) digits = `90${digits}`;
  return digits;
}
