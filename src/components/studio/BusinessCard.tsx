"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { toPng } from "html-to-image";
import { useLocale } from "next-intl";
import { useScrollLock } from "@/hooks/useScrollLock";
import { cardCaptureOptions, dataUrlToBlob } from "@/lib/cardCapture";
import { studioInfo } from "@/lib/studio-info";
import ServiceCard from "@/components/ServiceCard";
import { icons } from "./SocialLinks";

const EASE = [0.76, 0, 0.24, 1] as const;
const DESIGN_W = 520;
const GUTTER = 16;

const VCARD = [
  "BEGIN:VCARD",
  "VERSION:3.0",
  "N:;U+ Studio;;;",
  "FN:U+ Studio Mimarlık & İç Mimarlık & Mühendislik",
  "ORG:U+ Studio",
  `TEL;TYPE=WORK,VOICE:${studioInfo.phoneHref.replace("tel:", "")}`,
  `EMAIL;TYPE=WORK:${studioInfo.email}`,
  "URL:https://www.uplusstudio.com.tr",
  "ADR;TYPE=WORK:;;Reyhan Cd. Merkez İncek Plaza No:3 Kat:1 D:2;Gölbaşı;Ankara;06830;Türkiye",
  "END:VCARD",
].join("\r\n");

const COPY = {
  tr: {
    title: "Dijital kartvizit",
    tagline: "Mimarlık, önce düşünmekle başlar.",
    discipline: "Mimarlık & İç Mimarlık & Mühendislik",
    share: "Paylaş",
    download: "İndir",
    save: "Rehbere ekle",
    close: "Kapat",
    copied: "Bağlantı kopyalandı",
    shareVia: "Paylaşım platformu seçin",
    copyLink: "Bağlantıyı kopyala",
    copyImage: "Kartı kopyala",
    imageCopied: "Kart kopyalandı — sohbete yapıştırabilirsiniz",
    shareHint: "Kart görselini kopyalayıp WhatsApp, Instagram gibi uygulamalara yapıştırabilir ya da bağlantıyı paylaşabilirsiniz.",
    message: "U+ Studio — Mimarlık & İç Mimarlık & Mühendislik. Projeniz için bize ulaşın:",
    failed: "İşlem tamamlanamadı, tekrar deneyin",
  },
  en: {
    title: "Digital business card",
    tagline: "Architecture begins with thinking.",
    discipline: "Architecture & Interior Architecture & Engineering",
    share: "Share",
    download: "Download",
    save: "Save contact",
    close: "Close",
    copied: "Link copied",
    shareVia: "Choose where to share",
    copyLink: "Copy link",
    copyImage: "Copy card",
    imageCopied: "Card copied — paste it into any chat",
    shareHint: "Copy the card image and paste it into WhatsApp, Instagram and other apps, or share the link.",
    message: "U+ Studio — Architecture & Interior Architecture & Engineering. Get in touch about your project:",
    failed: "Something went wrong, please try again",
  },
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.uplusstudio.com.tr";

const shareIcons = {
  telegram: "M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z",
  x: "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z",
  facebook: "M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z",
  linkedin: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
};

function shareTargets(url: string, text: string) {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(text);
  return [
    { key: "whatsapp", label: "WhatsApp", href: `https://wa.me/?text=${t}%20${u}`, icon: icons.whatsapp },
    { key: "telegram", label: "Telegram", href: `https://t.me/share/url?url=${u}&text=${t}`, icon: <BrandIcon d={shareIcons.telegram} /> },
    { key: "x", label: "X", href: `https://twitter.com/intent/tweet?text=${t}&url=${u}`, icon: <BrandIcon d={shareIcons.x} /> },
    { key: "facebook", label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${u}`, icon: <BrandIcon d={shareIcons.facebook} /> },
    { key: "linkedin", label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`, icon: <BrandIcon d={shareIcons.linkedin} /> },
    { key: "email", label: "E-posta", href: `mailto:?subject=${encodeURIComponent("U+ Studio")}&body=${t}%0A${u}`, icon: icons.email },
  ];
}

function BrandIcon({ d }: Readonly<{ d: string }>) {
  return (
    <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d={d} />
    </svg>
  );
}

async function renderCardImage(node: HTMLElement | null) {
  if (!node) throw new Error("card not ready");
  await toPng(node, cardCaptureOptions(node));
  const blob = await dataUrlToBlob(await toPng(node, cardCaptureOptions(node)));
  return new File([blob], "uplus-studio-kartvizit.png", { type: "image/png" });
}

export default function BusinessCard({ open, onClose }: Readonly<{ open: boolean; onClose: () => void }>) {
  const locale = useLocale() === "en" ? "en" : "tr";
  const c = COPY[locale];
  const cardRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState<"share" | "download" | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const shareUrl = `${SITE_URL}/${locale}`;
  const targets = shareTargets(shareUrl, c.message);
  const [note, setNote] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const imageRef = useRef<Promise<File> | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState({ scale: 1, h: 0 });

  useEffect(() => {
    if (!open || !mounted) return;
    const update = () => {
      const card = cardRef.current;
      if (!card) return;
      const gutter = globalThis.innerWidth < 640 ? GUTTER : GUTTER * 1.5;
      const chrome = (headerRef.current?.offsetHeight ?? 0) + (actionsRef.current?.offsetHeight ?? 0) + 24;
      const availW = Math.min(DESIGN_W, globalThis.innerWidth - gutter * 2);
      const availH = globalThis.innerHeight - gutter * 2 - chrome;
      const h = card.offsetHeight;
      const scale = Math.min(1, availW / DESIGN_W, availH / h);
      setFit((f) => (Math.abs(f.scale - scale) < 0.002 && f.h === h ? f : { scale, h }));
    };
    const raf = requestAnimationFrame(update);
    const ro = new ResizeObserver(update);
    if (cardRef.current) ro.observe(cardRef.current);
    if (actionsRef.current) ro.observe(actionsRef.current);
    globalThis.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      globalThis.removeEventListener("resize", update);
    };
  }, [open, mounted]);

  useScrollLock(open);

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    globalThis.addEventListener("keydown", onKey);
    return () => globalThis.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    imageRef.current = null;
    if (!open) return;
    const id = setTimeout(() => {
      imageRef.current = renderCardImage(cardRef.current);
      imageRef.current.catch(() => (imageRef.current = null));
    }, 900);
    return () => clearTimeout(id);
  }, [open, locale]);

  const flash = (text: string) => {
    setNote(text);
    setTimeout(() => setNote(null), 2400);
  };

  const renderImage = () => renderCardImage(cardRef.current);

  const cardImage = () => {
    imageRef.current ??= renderImage();
    return imageRef.current;
  };

  const handleShare = async () => {
    if (panelOpen) {
      setPanelOpen(false);
      return;
    }
    setBusy("share");
    try {
      const file = await cardImage();
      if (typeof navigator.canShare === "function" && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file] });
      } else {
        setPanelOpen(true);
      }
    } catch (e) {
      if ((e as Error)?.name !== "AbortError") setPanelOpen(true);
    } finally {
      setBusy(null);
    }
  };

  const handleCopyImage = async () => {
    try {
      await navigator.clipboard.write([new ClipboardItem({ "image/png": cardImage() })]);
      flash(c.imageCopied);
    } catch {
      flash(c.failed);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      flash(c.copied);
    } catch {
      flash(c.failed);
    }
  };

  const handleDownload = async () => {
    setBusy("download");
    try {
      const link = document.createElement("a");
      link.download = "uplus-studio-kartvizit.png";
      link.href = URL.createObjectURL(await cardImage());
      link.click();
      setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    } catch {
      flash(c.failed);
    } finally {
      setBusy(null);
    }
  };

  const handleSaveContact = () => {
    const url = URL.createObjectURL(new Blob([VCARD], { type: "text/vcard;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "uplus-studio.vcf";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  if (!mounted) return null;

  const actionClass =
    "inline-flex min-h-10 min-w-0 flex-auto items-center justify-center gap-1.5 whitespace-nowrap rounded-[3px] border border-bone/30 px-1.5 py-2 font-mono text-[10px] uppercase tracking-[0.08em] text-bone transition-colors hover:border-bone hover:bg-night disabled:opacity-50 @min-[26rem]:text-[10.5px] @min-[26rem]:tracking-[0.1em] @max-[19rem]:px-1 @max-[19rem]:text-[9.5px] @max-[19rem]:tracking-normal [&>svg]:h-3 [&>svg]:w-3 [&>svg]:shrink-0 @min-[26rem]:[&>svg]:h-3.5 @min-[26rem]:[&>svg]:w-3.5 @max-[17rem]:[&>svg]:hidden";

  const tileClass =
    "flex h-full min-h-16 w-full flex-col items-center justify-center gap-1.5 rounded-[3px] border border-bone/15 bg-transparent px-1 py-2 text-center text-[10px] leading-tight text-bone transition-colors hover:border-bone hover:bg-night sm:text-[12px] [&>svg]:shrink-0";

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="card"
          className="fixed inset-0 z-[90] flex items-center justify-center overflow-hidden p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label={c.title}
        >
          <button type="button" aria-label={c.close} className="absolute inset-0 cursor-default bg-night/80 backdrop-blur-md" onClick={onClose} />

          <motion.div
            className="relative z-10 flex flex-col"
            style={{ width: DESIGN_W * fit.scale, visibility: fit.h ? "visible" : "hidden" }}
            initial={{ y: 30, opacity: 0, rotateX: 12 }}
            animate={{ y: 0, opacity: 1, rotateX: 0 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <div ref={headerRef} className="mb-3 flex items-center justify-between text-bone">
              <span className="eyebrow text-bone/60">{c.title}</span>
              <button
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-bone/30 transition-colors hover:bg-night"
                aria-label={c.close}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden><path strokeWidth={1.25} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="relative" style={{ height: fit.h * fit.scale }}>
              <div className="absolute left-0 top-0 origin-top-left" style={{ width: DESIGN_W, transform: `scale(${fit.scale})` }}>
                <ServiceCard ref={cardRef} locale={locale} />
              </div>

            <AnimatePresence initial={false}>
              {panelOpen && (
                <motion.div
                  key="share-panel"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="absolute inset-x-2 bottom-2 z-10 overflow-hidden"
                >
                  <div className="rounded-[3px] border border-bone/20 bg-night/95 p-3 shadow-[0_-20px_60px_rgba(0,0,0,0.6)] backdrop-blur-md sm:p-4">
                    <p className="eyebrow text-bone/60">{c.shareVia}</p>
                    <p className="mb-3 mt-1.5 text-[12px] leading-snug text-bone/60">{c.shareHint}</p>
                    <ul className="grid auto-rows-fr grid-cols-4 gap-1.5 sm:gap-2">
                      <li className="h-full">
                        <button
                          type="button"
                          onClick={handleCopyImage}
                          className={tileClass}
                        >
                          <svg className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24" aria-hidden><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="10" r="1.6" /><path d="m21 16-5-5-8 8" /></svg>
                          {c.copyImage}
                        </button>
                      </li>
                      {targets.map((tg) => (
                        <li key={tg.key} className="h-full">
                          <a
                            href={tg.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={tileClass}
                          >
                            {tg.icon}
                            {tg.label}
                          </a>
                        </li>
                      ))}
                      <li className="h-full">
                        <button
                          type="button"
                          onClick={handleCopy}
                          className={tileClass}
                        >
                          <svg className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24" aria-hidden><rect x="8" y="8" width="13" height="13" rx="2" /><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" /></svg>
                          {c.copyLink}
                        </button>
                      </li>
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {note && (
                <motion.p
                  className="absolute inset-x-0 top-3 z-20 mx-auto w-fit max-w-[90%] rounded-[3px] border border-bone/25 bg-night px-3 py-2 text-center font-mono text-[11px] uppercase tracking-[0.12em] text-bone"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  role="status"
                >
                  {note}
                </motion.p>
              )}
            </AnimatePresence>
            </div>

            <div ref={actionsRef} className="@container mt-3">
              <div className="flex gap-1.5 @min-[20rem]:grid @min-[20rem]:grid-cols-3 @min-[20rem]:gap-2">
              <button type="button" onClick={handleShare} disabled={busy !== null} className={actionClass}>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden><path strokeWidth={1.5} strokeLinecap="round" d="M12 3v12m0-12 4 4m-4-4-4 4M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" /></svg>
                {busy === "share" ? "…" : c.share}
              </button>
              <button type="button" onClick={handleDownload} disabled={busy !== null} className={actionClass}>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden><path strokeWidth={1.5} strokeLinecap="round" d="M12 4v11m0 0 4-4m-4 4-4-4M5 20h14" /></svg>
                {busy === "download" ? "…" : c.download}
              </button>
              <button type="button" onClick={handleSaveContact} className={actionClass}>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden><path strokeWidth={1.5} strokeLinecap="round" d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm10-3v6m3-3h-6" /></svg>
                {c.save}
              </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
