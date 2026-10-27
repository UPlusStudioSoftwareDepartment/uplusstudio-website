import { createHmac, timingSafeEqual } from "node:crypto";

export interface AppointmentTokenData {
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  message: string;
  createdAt: number;
}

const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

function secret() {
  return process.env.APPOINTMENT_SECRET || process.env.GMAIL_PASS || "";
}

const b64 = (s: string | Buffer) => Buffer.from(s).toString("base64url");

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function createAppointmentToken(data: Omit<AppointmentTokenData, "createdAt">) {
  if (!secret()) return null;
  const payload = b64(JSON.stringify({ ...data, createdAt: Date.now() }));
  return `${payload}.${sign(payload)}`;
}

export function readAppointmentToken(token: string | undefined | null): AppointmentTokenData | null {
  if (!token || !secret()) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expected = Buffer.from(sign(payload));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as AppointmentTokenData;
    if (!data.createdAt || Date.now() - data.createdAt > MAX_AGE_MS) return null;
    return data;
  } catch {
    return null;
  }
}

export function appointmentReference(token: string) {
  return createHmac("sha256", "ref").update(token).digest("hex").slice(0, 6).toUpperCase();
}
