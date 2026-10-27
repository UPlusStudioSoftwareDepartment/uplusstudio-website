import { createHmac, timingSafeEqual } from "node:crypto";

export interface AppointmentTokenData {
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  message: string;
  locale?: "tr" | "en";
  createdAt: number;
}

const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

function secret() {
  return (
    process.env.APPOINTMENT_SECRET ||
    (process.env.VERCEL_PROJECT_ID ? `uplus-appointment:${process.env.VERCEL_PROJECT_ID}` : "")
  );
}

const b64 = (s: string | Buffer) => Buffer.from(s).toString("base64url");

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

function matches(expected: string, given: string) {
  const a = Buffer.from(expected);
  const b = Buffer.from(given);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function studioSignature(token: string) {
  return sign(`studio:${token}`);
}

export function isStudioSignature(token: string, signature: string | undefined | null) {
  return Boolean(signature && secret()) && matches(studioSignature(token), signature ?? "");
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
  if (!matches(sign(payload), signature)) return null;
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
