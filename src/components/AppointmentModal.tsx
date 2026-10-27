"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import AdvancedCalendar from "./AdvancedCalendar";
import { useToast } from "@/contexts/ToastContext";
import { useScrollLock } from "@/hooks/useScrollLock";
import { studioInfo } from "@/lib/studio-info";
import { copyRich, gmailAppUrl, gmailComposeUrl, mailPlatform, mailtoUrl, openUrl, pasteableHtml } from "@/lib/gmailCompose";
import { icons } from "@/components/studio/SocialLinks";
import type { AppointmentPrefill } from "@/contexts/AppointmentContext";
import { MascotDuo } from "@/components/mascots/Mascots";

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefill?: AppointmentPrefill | null;
}

const EASE = [0.76, 0, 0.24, 1] as const;
const TIME_SLOTS = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
const SERVICES = ["architectural", "interior", "renovation", "villa", "commercial", "office", "visualization", "consulting", "site", "project"] as const;

function FieldError({ message }: Readonly<{ message?: string }>) {
  if (!message) return null;
  return <p className="mt-2 font-mono text-[12px] text-clay">{message}</p>;
}

function SectionHeading({ index, children }: Readonly<{ index: string; children: React.ReactNode }>) {
  return (
    <div className="flex items-baseline gap-4 mb-8">
      <span className="font-mono text-[12px] text-mute">{index}</span>
      <h3 className="font-sans text-[13px] font-medium uppercase tracking-[0.14em] text-ink">{children}</h3>
      <span className="h-px flex-1 bg-line translate-y-[-3px]" aria-hidden />
    </div>
  );
}

export default function AppointmentModal({ isOpen, onClose, prefill }: Readonly<AppointmentModalProps>) {
  const t = useTranslations("appointment");
  const ts = useTranslations("studio");
  const locale = useLocale();
  const toast = useToast();
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | null>(null);
  const [sentValues, setSentValues] = useState<AppointmentFormValues | null>(null);
  const messageValueRef = useRef<string>("");
  const formRef = useRef<HTMLFormElement>(null);
  const [cardCopied, setCardCopied] = useState(false);
  const [mailLinks, setMailLinks] = useState<{ label: string; href: string }[]>([]);

  useScrollLock(isOpen);

  const appointmentSchema = useMemo(() => z.object({
    name: z.string()
      .min(1, t("validation.required"))
      .min(3, t("validation.nameMin"))
      .refine((val) => /^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/.test(val), { message: t("validation.nameInvalid") }),
    email: z.string()
      .min(1, t("validation.required"))
      .refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), { message: t("validation.emailInvalid") }),
    phone: z.string()
      .min(1, t("validation.required"))
      .refine((val) => /^(?:90)?0?5\d{9}$/.test(val.replace(/\D/g, "")), { message: t("validation.phoneInvalid") }),
    service: z.string()
      .min(1, t("validation.required")),
    date: z.string()
      .refine((val) => {
        if (!val) return true;
        const selectedDate = new Date(val);
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        return selectedDate >= tomorrow;
      }, { message: t("validation.dateFuture") }),
    time: z.string(),
    message: z.string()
      .max(500, t("validation.messageMax"))
      .refine((val) => val.trim().length > 0, { message: t("validation.required") })
      .refine((val) => val.trim().length === 0 || val.trim().length >= 10, { message: t("validation.messageMin") })
  }), [t, locale]);

  type AppointmentFormValues = z.infer<typeof appointmentSchema>;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    getValues,
    reset,
    trigger,
    formState: { errors, isSubmitting }
  } = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      date: "",
      time: "",
      service: "",
      message: ""
    }
  });

  useEffect(() => {
    if (!isOpen || !prefill) return;
    const serviceKey =
      SERVICES.find((k) => k === prefill.service || t(`services.${k}`) === prefill.service) ?? "";
    reset({
      name: prefill.name ?? "",
      email: prefill.email ?? "",
      phone: prefill.phone ?? "",
      date: prefill.date ?? "",
      time: prefill.time ?? "",
      service: serviceKey,
      message: prefill.message ?? "",
    });
    messageValueRef.current = prefill.message ?? "";
  }, [isOpen, prefill, reset, t]);

  const values = watch();
  const messageRegister = register("message");

  useEffect(() => {
    if (isOpen) messageValueRef.current = values.message ?? "";
  }, [isOpen, values.message]);

  const PASS_CANVAS_WIDTH = 500;

  const drawInfo = (ctx: CanvasRenderingContext2D, label: string, value: string, currentY: number, size = 28) => {
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText(label.toUpperCase(), 60, currentY);
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${size}px serif`;
    ctx.fillText(value, 60, currentY + 35);
    return currentY + 95;
  };

  const chunkLongWord = (ctx: CanvasRenderingContext2D, word: string, maxWidth: number): string[] => {
    const chunks: string[] = [];
    let remaining = word;
    while (remaining.length > 0) {
      let chunk = '';
      let i = 0;
      while (i < remaining.length && ctx.measureText(chunk + remaining[i]).width <= maxWidth) {
        chunk += remaining[i];
        i++;
      }
      if (chunk === '') chunk = remaining[0] ?? '';
      chunks.push(chunk);
      remaining = remaining.slice(chunk.length);
    }
    return chunks;
  };

  const wrapTextToLines = (ctx: CanvasRenderingContext2D, text: string, maxLineWidth: number): string[] => {
    const words = text.split(/\s+/).filter(Boolean);
    const lines: string[] = [];
    let line = '';
    for (const w of words) {
      const next = line ? `${line} ${w}` : w;
      const fitsLine = ctx.measureText(next).width <= maxLineWidth;
      const wordTooLong = ctx.measureText(w).width > maxLineWidth;
      if (fitsLine) {
        line = next;
      } else {
        if (line) lines.push(line);
        if (wordTooLong) {
          lines.push(...chunkLongWord(ctx, w, maxLineWidth));
          line = '';
        } else {
          line = w;
        }
      }
    }
    if (line) lines.push(line);
    return lines.length > 0 ? lines : [text.slice(0, 80)];
  };

  const drawBrandHeader = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.fillStyle = '#141413';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#ede9e1';
    ctx.textAlign = 'center';
    ctx.font = 'bold 72px serif';
    ctx.fillText('U+', width / 2, 115);
    ctx.font = 'bold 11px sans-serif';
    ctx.fillStyle = 'rgba(237,233,225,0.7)';
    const brandLabel = 'STUDIO ARCHITECTURE';
    const charSpace = 6;
    const startXPx = (width - brandLabel.length * charSpace) / 2;
    for (let i = 0; i < brandLabel.length; i++) {
      ctx.fillText(brandLabel[i], startXPx + (i * charSpace), 145);
    }
    ctx.strokeStyle = 'rgba(237,233,225,0.25)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(50, 185);
    ctx.lineTo(450, 185);
    ctx.stroke();
    ctx.fillStyle = 'rgba(237,233,225,0.6)';
    ctx.font = 'bold 10px sans-serif';
    ctx.fillText(locale === 'tr' ? 'RANDEVU KARTI' : 'APPOINTMENT CARD', width / 2, 215);
  };

  const drawMessageBlock = (
    ctx: CanvasRenderingContext2D,
    messageText: string,
    startY: number,
    height: number,
    messageLabel: string
  ): number => {
    const maxLineWidth = 380;
    const lineHeight = 18;
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = 'bold 11px Arial';
    ctx.fillText(messageLabel, 60, startY);
    ctx.font = '13px Arial';
    const lines = wrapTextToLines(ctx, messageText, maxLineWidth);
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    let messageY = startY + 25;
    const maxMessageBottomY = height - 120;
    for (const lineText of lines) {
      if (messageY + lineHeight > maxMessageBottomY) break;
      ctx.fillText(lineText, 60, messageY);
      messageY += lineHeight;
    }
    return messageY + 20;
  };

  const drawPerforationAndBarcode = (ctx: CanvasRenderingContext2D, width: number, perforationY: number) => {
    const luxuryBarcodeY = perforationY + 30;
    ctx.setLineDash([8, 6]);
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.beginPath();
    ctx.moveTo(0, perforationY);
    ctx.lineTo(width, perforationY);
    ctx.stroke();
    ctx.setLineDash([]);
    const getBarWidth = (i: number): number => {
      if (i % 3 === 0) return 3;
      if (i % 7 === 0) return 1;
      return 2;
    };
    for (let i = 0; i < 60; i++) {
      ctx.fillStyle = i % 2 === 0 ? '#ede9e1' : '#141413';
      ctx.fillRect(60 + (i * 4), luxuryBarcodeY, getBarWidth(i), 40);
    }
    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = 'bold 10px monospace';
    ctx.fillText('U+ STUDIO', width - 60, luxuryBarcodeY + 25);
    ctx.font = 'bold 8px sans-serif';
    ctx.fillText('İNCEK · GÖLBAŞI / ANKARA', width - 60, luxuryBarcodeY + 40);
  };

  function drawPassToCanvas(
    ctx: CanvasRenderingContext2D,
    vals: { name: string; email: string; phone: string; service: string; date: string; time: string; message: string },
    width: number,
    height: number,
    dateLocale: string
  ) {
    let currentYPos = 285;
    drawBrandHeader(ctx, width, height);
    ctx.textAlign = 'left';

    currentYPos = drawInfo(ctx, t("guest"), vals.name, currentYPos, 32);
    currentYPos = drawInfo(ctx, t("service"), t(`services.${vals.service}`), currentYPos, 22);
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText(t("appointmentDate").toUpperCase(), 60, currentYPos);
    ctx.fillText(t("time").toUpperCase(), 300, currentYPos);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px serif';
    ctx.fillText(vals.date ? new Date(vals.date).toLocaleDateString(dateLocale) : t("flexibleDate"), 60, currentYPos + 35);
    ctx.fillText(vals.time, 300, currentYPos + 35);
    currentYPos += 80;
    currentYPos = drawInfo(ctx, t("phone"), vals.phone, currentYPos, 20);

    const messageText = vals.message == null ? '' : String(vals.message).trim();
    currentYPos = messageText
      ? drawMessageBlock(ctx, messageText, currentYPos, height, t("message").toUpperCase())
      : currentYPos + 30;

    const perforationY = Math.min(currentYPos + 20, height - 100);
    drawPerforationAndBarcode(ctx, width, perforationY);
  }

  const onSubmit = async (data: AppointmentFormValues) => {
    setSubmitStatus(null);
    setSubmitErrorMessage(null);
    const platform = mailPlatform();
    if (platform !== "desktop") {
      const { url: cardUrl } = await appointmentLink(data, "mail");
      const subject = `${locale === "tr" ? "Randevu talebi" : "Appointment request"} — ${data.name} · ${t(`services.${data.service}`)}`;
      const body = appointmentText(data, cardUrl, false);
      const mailto = mailtoUrl(studioInfo.email, subject, body);
      setMailLinks(
        platform === "ios"
          ? [
              { label: locale === "tr" ? "Gmail'de aç" : "Open in Gmail", href: gmailAppUrl(studioInfo.email, subject, body) },
              { label: locale === "tr" ? "Mail uygulamasında aç" : "Open in Mail", href: mailto },
            ]
          : [{ label: locale === "tr" ? "Gmail'de aç" : "Open in Gmail", href: mailto }]
      );
      setCardCopied(false);
      setSentValues({ ...data });
      setSubmitStatus("success");
      formRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      globalThis.location.href = mailto;
      return;
    }
    try {
      const prepared = (async () => {
        const link = await appointmentLink(data, "mail");
        let mail = { subject: "", html: "" };
        if (link.token) {
          const res = await fetch("/api/appointment-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: link.token }),
          });
          if (res.ok) mail = await res.json();
        }
        return { link, mail, text: appointmentText(data, link.url, false) };
      })();
      let copied = await copyRich(
        prepared.then(({ mail, text }) => (mail.html ? pasteableHtml(mail.html) : text)),
        prepared.then(({ text }) => text)
      );
      const { mail, text } = await prepared;
      copied = copied && Boolean(mail.html);
      const subject = mail.subject || `${locale === "tr" ? "Randevu talebi" : "Appointment request"} — ${data.name} · ${t(`services.${data.service}`)}`;
      openUrl(gmailComposeUrl(studioInfo.email, subject, copied ? undefined : text));
      setCardCopied(copied);
      setSentValues({ ...data });
      setSubmitStatus('success');
      formRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      toast.success(copied ? t("successPaste") : t("successMessage"));
    } catch {
      const message = t("error");
      setSubmitErrorMessage(message);
      setSubmitStatus('error');
      toast.error(message);
    }
  };

  const handleClose = () => {
    setSubmitStatus(null);
    setSentValues(null);
    setCardCopied(false);
    setMailLinks([]);
    reset();
    messageValueRef.current = '';
    onClose();
  };

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    globalThis.addEventListener("keydown", onKey);
    return () => globalThis.removeEventListener("keydown", onKey);
  }, [isOpen]);

  const dateLocale = locale === 'tr' ? 'tr-TR' : 'en-US';

  const calculateCanvasHeight = (messageText: string): number => {
    let baseHeight = 750;
    if (messageText.length === 0) return Math.max(baseHeight + 80, 850);
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    if (tempCtx == null) return Math.max(baseHeight + 80, 850);
    tempCtx.font = '13px Arial';
    const maxLineWidth = 380;
    const lineHeight = 18;
    const words = messageText.split(/\s+/).filter(Boolean);
    let line = '';
    let lineCount = 0;
    for (const w of words) {
      const next = line ? `${line} ${w}` : w;
      if (tempCtx.measureText(next).width <= maxLineWidth) {
        line = next;
      } else {
        if (line) lineCount++;
        line = w;
      }
    }
    if (line) lineCount++;
    baseHeight += 30 + (lineCount * lineHeight) + 40 + 80;
    return Math.max(baseHeight, 850);
  };

  const PASS_FILE = 'uplus-studio-randevu-karti.jpg';

  const renderPassBlob = (vals: AppointmentFormValues) =>
    new Promise<Blob | null>((resolve) => {
      const messageText = vals.message == null ? '' : String(vals.message).trim();
      const canvasHeight = calculateCanvasHeight(messageText);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx == null) return resolve(null);
      canvas.width = PASS_CANVAS_WIDTH;
      canvas.height = canvasHeight;
      drawPassToCanvas(ctx, vals, PASS_CANVAS_WIDTH, canvasHeight, dateLocale);
      canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.95);
    });

  const saveBlob = (blob: Blob) => {
    const url = globalThis.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = PASS_FILE;
    a.click();
    setTimeout(() => globalThis.URL.revokeObjectURL(url), 1000);
  };

  const downloadPass = async (vals: AppointmentFormValues) => {
    const blob = await renderPassBlob(vals);
    if (blob) saveBlob(blob);
  };

  const sharePass = async (vals: AppointmentFormValues) => {
    const blob = await renderPassBlob(vals);
    if (!blob) return;
    const file = new File([blob], PASS_FILE, { type: 'image/jpeg' });
    const text = locale === 'tr'
      ? `U+ Studio randevum: ${t(`services.${vals.service}`)} · ${vals.date ? new Date(vals.date).toLocaleDateString(dateLocale) : t("flexibleDate")} ${vals.time}`
      : `My U+ Studio appointment: ${t(`services.${vals.service}`)} · ${vals.date ? new Date(vals.date).toLocaleDateString(dateLocale) : t("flexibleDate")} ${vals.time}`;
    try {
      if (typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: 'U+ Studio', text });
        return;
      }
    } catch (e) {
      if ((e as Error)?.name === 'AbortError') return;
    }
    saveBlob(blob);
    toast.success(locale === 'tr' ? 'Paylaşım bu tarayıcıda desteklenmiyor; kart indirildi.' : 'Sharing isn\'t supported here; the card was downloaded.');
  };

  const appointmentLink = async (v: AppointmentFormValues, via: "mail" | "whatsapp") => {
    try {
      const res = await fetch("/api/appointment-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...v, service: t(`services.${v.service}`), locale, via }),
      });
      if (res.ok) {
        const json = await res.json();
        return { token: String(json.token ?? ""), url: String(json.url ?? ""), image: String(json.image ?? "") };
      }
    } catch {}
    return { token: "", url: "", image: "" };
  };


  const appointmentText = (v: AppointmentFormValues, cardUrl: string, markup: boolean) => {
    const b = (s: string) => (markup ? `*${s}*` : s);
    const service = t(`services.${v.service}`);
    const when = v.date ? new Date(v.date).toLocaleDateString(dateLocale, { day: "numeric", month: "long", year: "numeric", weekday: "long" }) : t("flexibleDate");
    const tr = locale === "tr";
    return [
      b(tr ? "Randevu talebi — U+ Studio" : "Appointment request — U+ Studio"),
      "",
      `${b(tr ? "Ad Soyad:" : "Name:")} ${v.name}`,
      `${b(tr ? "Hizmet:" : "Service:")} ${service}`,
      `${b(tr ? "Tarih:" : "Date:")} ${when}`,
      `${b(tr ? "Saat:" : "Time:")} ${v.time}`,
      `${b(tr ? "Telefon:" : "Phone:")} ${v.phone}`,
      `${b(tr ? "E-posta:" : "Email:")} ${v.email}`,
      "",
      markup ? `_${v.message.trim()}_` : `“${v.message.trim()}”`,
      ...(cardUrl ? ["", `${tr ? "Randevu kartı" : "Appointment card"}: ${cardUrl}`] : []),
    ].join("\n");
  };

  const cardImageAsJpeg = async (src: string) => {
    const bitmap = await createImageBitmap(await (await fetch(src)).blob());
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0);
    return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.94));
  };

  const sendViaWhatsApp = async () => {
    const isValid = await trigger();
    if (!isValid) {
      toast.error(t("fillRequired"));
      return;
    }
    const canShareFiles = typeof navigator.canShare === "function" && navigator.canShare({ files: [new File([""], "x.jpg", { type: "image/jpeg" })] });
    const popup = canShareFiles ? null : globalThis.open("about:blank", "_blank");
    const v = getValues();
    const { url: cardUrl, image: imageUrl } = await appointmentLink(v, "whatsapp");
    const url = `${studioInfo.whatsappUrl}?text=${encodeURIComponent(appointmentText(v, cardUrl, true))}`;
    if (canShareFiles && imageUrl) {
      try {
        const jpeg = await cardImageAsJpeg(imageUrl);
        if (jpeg) {
          const file = new File([jpeg], PASS_FILE, { type: "image/jpeg" });
          await navigator.share({ files: [file], text: appointmentText(v, "", true) });
          return;
        }
      } catch (e) {
        if ((e as Error)?.name === "AbortError") return;
      }
    }
    if (popup) popup.location.href = url;
    else globalThis.location.href = url;
  };

  const handleDownload = async () => {
    const isValid = await trigger();
    if (!isValid) {
      toast.error(t("fillRequired"));
      return;
    }
    await downloadPass({ ...getValues() });
  };

  const inputClass = (hasError: boolean) =>
    `w-full bg-transparent border-0 border-b py-3 text-lg text-ink placeholder:text-mute/50 outline-none transition-colors rounded-none ${
      hasError ? "border-clay" : "border-line focus:border-ink"
    }`;
  const labelClass = "block font-mono text-[12px] uppercase tracking-[0.12em] text-mute";

  const formattedDate = values.date
    ? new Date(values.date).toLocaleDateString(dateLocale, { day: "numeric", month: "long", weekday: "long" })
    : null;
  const completed = [values.name, values.email, values.phone, values.service, values.date, values.time, values.message].filter(Boolean).length;

  const passRows: { label: string; value: string | null }[] = [
    { label: t("guest"), value: values.name || null },
    { label: t("service"), value: values.service ? t(`services.${values.service}`) : null },
    { label: t("date"), value: formattedDate },
    { label: t("time"), value: values.time || null },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="appointment-overlay"
          className="fixed inset-0 z-[70] flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { delay: 0.25, duration: 0.3 } }}
        >
          <button
            type="button"
            aria-label={t("cancel")}
            className="absolute inset-0 bg-night/60 backdrop-blur-sm cursor-default"
            onClick={handleClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="appointment-modal-title"
            className="relative z-10 flex h-full w-full max-w-[1320px] bg-paper shadow-[0_0_80px_rgba(0,0,0,0.35)]"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <aside className="relative hidden lg:flex w-[40%] shrink-0 flex-col justify-between overflow-hidden bg-night text-bone p-10 xl:p-12">
              <Image
                src="/media/projects/modern-villa/exterior-dusk.jpg"
                alt=""
                fill
                sizes="40vw"
                className="object-cover opacity-55"
                priority
              />
              <div className="absolute inset-0 bg-linear-to-b from-night/70 via-night/20 to-night/90" aria-hidden />

              <div className="relative flex items-center justify-between">
                <span className="font-sans text-lg tracking-tight">U+ Studio</span>
                <span className="eyebrow text-bone/60">{t("title")}</span>
              </div>

              <div className="relative">
                <motion.p
                  className="font-serif text-5xl xl:text-6xl leading-[0.95] max-w-md"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, ease: EASE, delay: 0.45 }}
                >
                  {ts("cta.title")}
                </motion.p>
                <p className="mt-6 max-w-sm text-sm leading-relaxed text-bone/70">{t("subtitle")}</p>
              </div>

              <motion.div
                className="relative border border-bone/20 bg-night/50 backdrop-blur-md"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: EASE, delay: 0.6 }}
              >
                <div className="flex items-center justify-between border-b border-bone/15 px-6 py-4">
                  <span className="eyebrow text-bone/60">{t("digitalPass")}</span>
                  <span className="font-mono text-[12px] text-bone/50">{String(completed).padStart(2, "0")} / 07</span>
                </div>
                <dl className="grid grid-cols-2">
                  {passRows.map((row, i) => (
                    <div key={row.label} className={`px-6 py-4 ${i % 2 === 0 ? "border-r border-bone/15" : ""} ${i < 2 ? "border-b border-bone/15" : ""}`}>
                      <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-bone/45">{row.label}</dt>
                      <dd className={`mt-1.5 truncate text-[15px] ${row.value ? "text-bone" : "text-bone/30"}`}>{row.value ?? "—"}</dd>
                    </div>
                  ))}
                </dl>
                <div className="flex items-center justify-between border-t border-bone/15 px-6 py-4">
                  <div className="flex items-end gap-[3px]" aria-hidden>
                    {Array.from({ length: 22 }, (_, i) => (
                      <span key={i} className="w-px bg-bone/50" style={{ height: `${8 + ((i * 7) % 4) * 4}px` }} />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="group inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.12em] text-bone/80 hover:text-bone"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v12m0 0l-4-4m4 4l4-4M5 20h14" strokeWidth={1.25} /></svg>
                    {locale === "tr" ? "Kartı indir" : "Download pass"}
                  </button>
                </div>
              </motion.div>
            </aside>

            <div className="flex min-w-0 flex-1 flex-col">
              <header className="flex shrink-0 items-center justify-between gap-6 border-b border-line px-6 py-2 sm:items-start sm:px-12 sm:py-8">
                <div>
                  <span className="eyebrow hidden text-mute sm:inline">U+ Studio — {t("title")}</span>
                  <h2 id="appointment-modal-title" className="font-serif text-[1.75rem] leading-none text-ink sm:mt-3 sm:text-5xl">
                    {t("title")}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  className="group flex items-center gap-3 font-mono text-[12px] uppercase tracking-[0.12em] text-ink"
                  aria-label={t("cancel")}
                >
                  <span className="hidden sm:inline">{ts("nav.close")}</span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-line transition-colors sm:h-11 sm:w-11 group-hover:border-ink group-hover:bg-night hover:text-bone group-hover:text-bone">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={1.25} d="M6 18L18 6M6 6l12 12" /></svg>
                  </span>
                </button>
              </header>

              <form
                id="appointment-form"
                ref={formRef}
                onSubmit={handleSubmit(onSubmit)}
                className="custom-scrollbar flex-1 min-h-0 overflow-y-auto px-6 py-10 sm:px-12"
                noValidate
              >
                <AnimatePresence>
                  {submitStatus === 'success' && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-10 flex flex-col items-center gap-5 rounded-[6px] border border-line bg-paper-2 px-6 py-8 text-center text-ink">
                      <MascotDuo pose="cheer" size="sm" />
                      <p className="max-w-md text-[16px] leading-relaxed text-ink/90">
                        {mailLinks.length ? t("successMobile") : cardCopied ? t("successPasteLong") : t("success")}
                      </p>
                      {mailLinks.length > 0 && (
                        <div className="flex w-full max-w-md flex-col gap-2">
                          {mailLinks.map((m, i) => (
                            <a
                              key={m.href}
                              href={m.href}
                              className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-[3px] border px-4 font-mono text-[12px] uppercase tracking-[0.12em] transition-colors ${
                                i === 0 ? "border-bone bg-bone text-night hover:bg-transparent hover:text-bone" : "border-bone/60 text-ink hover:border-bone hover:bg-night"
                              }`}
                            >
                              {icons.email}
                              {m.label}
                            </a>
                          ))}
                        </div>
                      )}
                      {sentValues && (
                        <div className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
                          <button
                            type="button"
                            onClick={() => sharePass(sentValues)}
                            className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-[3px] border border-bone/60 bg-transparent px-4 font-mono text-[12px] uppercase tracking-[0.12em] text-ink transition-colors hover:border-bone hover:bg-night"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden><path strokeWidth={1.5} strokeLinecap="round" d="M12 3v12m0-12 4 4m-4-4-4 4M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" /></svg>
                            {locale === "tr" ? "Kartı paylaş" : "Share card"}
                          </button>
                          <button
                            type="button"
                            onClick={() => downloadPass(sentValues)}
                            className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-[3px] border border-bone/60 bg-transparent px-4 font-mono text-[12px] uppercase tracking-[0.12em] text-ink transition-colors hover:border-bone hover:bg-night"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden><path strokeWidth={1.5} strokeLinecap="round" d="M12 4v11m0 0 4-4m-4 4-4-4M5 20h14" /></svg>
                            {locale === "tr" ? "Kartı indir" : "Download card"}
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                  {submitStatus === 'error' && submitErrorMessage && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-10 border border-clay px-6 py-5 text-clay">
                      {submitErrorMessage}
                    </motion.div>
                  )}
                </AnimatePresence>

                <section className="mb-14">
                  <SectionHeading index="01">{t("personalInfo")}</SectionHeading>
                  <div className="grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <label htmlFor="appointment-name" className={labelClass}>{t("name")}</label>
                      <input id="appointment-name" {...register("name")} autoComplete="name" className={inputClass(!!errors.name)} placeholder={t("namePlaceholder")} />
                      <FieldError message={errors.name?.message} />
                    </div>
                    <div>
                      <label htmlFor="appointment-email" className={labelClass}>{t("email")}</label>
                      <input id="appointment-email" type="email" {...register("email")} autoComplete="email" className={inputClass(!!errors.email)} placeholder={t("emailPlaceholder")} />
                      <FieldError message={errors.email?.message} />
                    </div>
                    <div>
                      <label htmlFor="appointment-phone" className={labelClass}>{t("phone")}</label>
                      <input id="appointment-phone" type="tel" inputMode="tel" {...register("phone")} autoComplete="tel" className={inputClass(!!errors.phone)} placeholder={t("phonePlaceholder")} />
                      <FieldError message={errors.phone?.message} />
                    </div>
                  </div>

                  <fieldset className="mt-10">
                    <legend className={labelClass}>{t("service")}</legend>
                    <div className="mt-4 grid grid-cols-2 gap-px border border-line bg-line xl:grid-cols-5">
                      {SERVICES.map((service) => {
                        const active = values.service === service;
                        return (
                          <button
                            key={service}
                            type="button"
                            aria-pressed={active}
                            onClick={() => setValue("service", service, { shouldValidate: true })}
                            className={`px-4 py-5 text-left text-sm transition-colors ${active ? "bg-ink text-paper" : "bg-paper text-ink hover:bg-night hover:text-bone"}`}
                          >
                            <span className={`block font-mono text-[11px] mb-2 ${active ? "text-paper/60" : "text-mute"}`}>
                              {String(SERVICES.indexOf(service) + 1).padStart(2, "0")}
                            </span>
                            {t(`services.${service}`)}
                          </button>
                        );
                      })}
                    </div>
                    <FieldError message={errors.service?.message} />
                  </fieldset>
                </section>

                <section className="mb-14">
                  <SectionHeading index="02">{t("schedule")}</SectionHeading>
                  <p className="-mt-5 mb-8 text-[14px] leading-relaxed text-mute">{t("scheduleOptional")}</p>
                  <div className="grid grid-cols-1 gap-10 xl:grid-cols-[1.3fr_1fr]">
                    <div>
                      <AdvancedCalendar
                        selectedDate={values.date}
                        onDateSelect={(date) => setValue('date', date, { shouldValidate: true })}
                        selectedTime={values.time}
                        onTimeSelect={(time) => setValue('time', time, { shouldValidate: true })}
                      />
                      <FieldError message={errors.date?.message} />
                    </div>
                    <div>
                      <p className={labelClass}>{t("time")}</p>
                      <div className="mt-4 grid grid-cols-4 gap-px border border-line bg-line xl:grid-cols-2">
                        {TIME_SLOTS.map((slot) => {
                          const active = values.time === slot;
                          return (
                            <button
                              key={slot}
                              type="button"
                              aria-pressed={active}
                              onClick={() => setValue('time', slot, { shouldValidate: true })}
                              className={`py-4 font-mono text-[13px] transition-colors ${active ? "bg-ink text-paper" : "bg-paper text-ink hover:bg-night hover:text-bone"}`}
                            >
                              {slot}
                            </button>
                          );
                        })}
                      </div>
                      <FieldError message={errors.time?.message} />
                      {formattedDate && (
                        <p className="mt-6 text-sm text-mute">
                          <span className="text-ink">{formattedDate}</span>
                          {values.time && <> · <span className="text-ink">{values.time}</span></>}
                        </p>
                      )}
                    </div>
                  </div>
                </section>

                <section className="mb-6">
                  <SectionHeading index="03">{t("message")}</SectionHeading>
                  <label htmlFor="appointment-message" className="sr-only">{t("message")}</label>
                  <textarea
                    id="appointment-message"
                    {...messageRegister}
                    onChange={(e) => {
                      messageRegister.onChange(e);
                      messageValueRef.current = e.target.value;
                    }}
                    rows={4}
                    maxLength={500}
                    required
                    aria-required="true"
                    aria-invalid={!!errors.message}
                    className={`${inputClass(!!errors.message)} resize-none`}
                    placeholder={t("messagePlaceholder")}
                  />
                  <div className="mt-2 flex justify-between">
                    <FieldError message={errors.message?.message} />
                    <span className="ml-auto font-mono text-[12px] text-mute">{values.message?.length ?? 0} / 500</span>
                  </div>
                </section>

                <p className="mt-10 text-sm text-mute lg:hidden">
                  {studioInfo.phoneDisplay} · {studioInfo.email}
                </p>
              </form>

              <footer className="flex shrink-0 flex-col-reverse gap-3 border-t border-line px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-12">
                <div className="hidden sm:flex items-center gap-4">
                  <div className="h-px w-32 bg-line overflow-hidden">
                    <motion.div className="h-full bg-ink" animate={{ width: `${(completed / 7) * 100}%` }} transition={{ duration: 0.5, ease: EASE }} />
                  </div>
                  <span className="font-mono text-[12px] text-mute">{String(completed).padStart(2, "0")} / 07</span>
                </div>
                <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="order-2 min-h-12 whitespace-nowrap rounded-[3px] border border-line px-4 font-mono text-[12px] uppercase tracking-[0.12em] text-ink transition-colors hover:border-ink hover:bg-night sm:order-1 sm:px-6"
                  >
                    {t("cancel")}
                  </button>
                  <button
                    type="button"
                    onClick={sendViaWhatsApp}
                    className="order-3 inline-flex min-h-12 items-center justify-center gap-2 whitespace-nowrap rounded-[3px] border border-line px-4 font-mono text-[12px] uppercase tracking-[0.12em] text-ink transition-colors hover:border-bone hover:bg-night sm:order-2 sm:px-5"
                  >
                    {icons.whatsapp}
                    WhatsApp
                  </button>
                  <button
                    type="submit"
                    form="appointment-form"
                    disabled={isSubmitting}
                    className="group order-1 col-span-2 inline-flex min-h-12 items-center justify-center gap-4 whitespace-nowrap rounded-[3px] border border-ink bg-transparent px-6 font-mono text-[12px] uppercase tracking-[0.12em] text-ink transition-colors hover:border-bone hover:bg-night hover:text-bone disabled:opacity-50 sm:order-3 sm:px-8"
                  >
                    {isSubmitting ? t("sending") : t("book")}
                    <span className="transition-transform group-hover:translate-x-1" aria-hidden>→</span>
                  </button>
                </div>
              </footer>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
