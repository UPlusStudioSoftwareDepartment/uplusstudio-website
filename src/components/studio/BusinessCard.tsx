"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, m } from "framer-motion";
import { useLocale } from "next-intl";
import { useScrollLock } from "@/hooks/useScrollLock";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { mailPlatform } from "@/lib/gmailCompose";
import ServiceCard from "@/components/ServiceCard";
import { icons } from "./SocialLinks";

const EASE = [0.76, 0, 0.24, 1] as const;
const DESIGN_W = 520;
const GUTTER = 16;


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
    holdToSave: "Kaydetmek için görsele basılı tutun",
    shareHint: "Kart görselini kopyalayıp WhatsApp, Instagram gibi uygulamalara yapıştırabilir ya da bağlantıyı paylaşabilirsiniz.",
    message: "U+ Studio — Mimarlık & İç Mimarlık & Mühendislik · İncek, Gölbaşı / Ankara",
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
    holdToSave: "Press and hold the image to save it",
    shareHint: "Copy the card image and paste it into WhatsApp, Instagram and other apps, or share the link.",
    message: "U+ Studio — Architecture & Interior Architecture & Engineering · İncek, Gölbaşı / Ankara",
    failed: "Something went wrong, please try again",
  },
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.uplusstudio.com.tr";

const shareIcons = {
  telegram: "M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z",
  x: "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z",
  facebook: "M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z",
};

function shareTargets(url: string, text: string) {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(text);
  return [
    { key: "whatsapp", label: "WhatsApp", href: `https://wa.me/?text=${t}%0A${u}`, icon: icons.whatsapp },
    { key: "telegram", label: "Telegram", href: `https://t.me/share/url?url=${u}&text=${t}`, icon: <BrandIcon d={shareIcons.telegram} /> },
    { key: "x", label: "X", href: `https://twitter.com/intent/tweet?text=${t}&url=${u}`, icon: <BrandIcon d={shareIcons.x} /> },
    { key: "facebook", label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${u}`, icon: <BrandIcon d={shareIcons.facebook} /> },
    { key: "linkedin", label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`, icon: icons.linkedin },
    { key: "email", label: "E-posta", href: mailPlatform() === "desktop" ? `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent("U+ Studio")}&body=${t}%0A${u}` : `mailto:?subject=${encodeURIComponent("U+ Studio")}&body=${t}%0A${u}`, icon: icons.email },
  ];
}

function BrandIcon({ d }: Readonly<{ d: string }>) {
  return (
    <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d={d} />
    </svg>
  );
}

async function renderCardImage(locale: "tr" | "en") {
  const res = await fetch(`/api/business-card?locale=${locale}`);
  if (!res.ok) throw new Error("card image unavailable");
  return new File([await res.blob()], "uplus-studio-kartvizit.png", { type: "image/png" });
}

export default function BusinessCard({ open, onClose }: Readonly<{ open: boolean; onClose: () => void }>) {
  const locale = useLocale() === "en" ? "en" : "tr";
  const c = COPY[locale];
  const cardRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState<"share" | "download" | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const shareUrl = `${SITE_URL}/${locale}/kartvizit`;
  const targets = shareTargets(shareUrl, c.message);
  const [note, setNote] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const imageRef = useRef<Promise<File> | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [fit, setFit] = useState({ scale: 1, h: 0, w: DESIGN_W });
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !mounted) return;
    const update = () => {
      const card = cardRef.current;
      if (!card) return;
      const phone = globalThis.innerWidth < 640;
      const gutter = phone ? 12 : GUTTER * 1.5;
      const chrome = (headerRef.current?.offsetHeight ?? 0) + (actionsRef.current?.offsetHeight ?? 0) + 24;
      const w = phone ? Math.min(DESIGN_W, globalThis.innerWidth - gutter * 2) : DESIGN_W;
      const availW = Math.min(DESIGN_W, globalThis.innerWidth - gutter * 2);
      const availH = globalThis.innerHeight - gutter * 2 - chrome;
      const h = card.offsetHeight;
      const scale = phone ? 1 : Math.min(1, availW / DESIGN_W, availH / h);
      setFit((f) => (Math.abs(f.scale - scale) < 0.002 && f.h === h && f.w === w ? f : { scale, h, w }));
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
  useFocusTrap(open && fit.h > 0, overlayRef, closeRef);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (panelOpen && overlay) overlay.scrollTo({ top: overlay.scrollHeight, behavior: "smooth" });
  }, [panelOpen]);

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.stopPropagation();
      onClose();
    };
    globalThis.addEventListener("keydown", onKey, true);
    return () => globalThis.removeEventListener("keydown", onKey, true);
  }, [open, onClose]);

  useEffect(() => {
    imageRef.current = null;
    if (!open) return;
    const id = setTimeout(() => {
      imageRef.current = renderCardImage(locale);
      imageRef.current.catch(() => (imageRef.current = null));
    }, 300);
    return () => clearTimeout(id);
  }, [open, locale]);

  const flash = (text: string) => {
    setNote(text);
    setTimeout(() => setNote(null), 2400);
  };

  const renderImage = () => renderCardImage(locale);

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
      if (typeof navigator.share === "function") {
        await navigator.share({ title: "U+ Studio", text: c.message, url: shareUrl });
      } else {
        setPanelOpen(true);
      }
    } catch (e) {
      if ((e as Error)?.name !== "AbortError") setPanelOpen(true);
    } finally {
      setBusy(null);
    }
  };

  const shareTo = (href: string) => {
    if (href.startsWith("mailto:")) globalThis.location.assign(href);
    else if (!globalThis.open(href, "_blank", "noopener,noreferrer")) globalThis.location.assign(href);
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
    const inApp = /Instagram|FBAN|FBAV|FB_IAB|Line\/|TikTok|Snapchat|LinkedInApp|Twitter/i.test(navigator.userAgent);
    if (!inApp) {
      const link = document.createElement("a");
      link.href = `/api/business-card?locale=${locale}&download=1`;
      link.download = "uplus-studio-kartvizit.png";
      link.rel = "noopener";
      document.body.appendChild(link);
      link.click();
      link.remove();
      return;
    }
    setBusy("download");
    try {
      setPreview(URL.createObjectURL(await cardImage()));
    } catch {
      flash(c.failed);
    } finally {
      setBusy(null);
    }
  };

  const closePreview = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
  };

  if (!mounted) return null;

  const actionClass =
    "inline-flex min-h-10 min-w-0 flex-auto items-center justify-center gap-1.5 whitespace-nowrap rounded-[3px] border border-bone/30 px-1.5 py-2 font-mono text-[10px] uppercase tracking-[0.08em] text-bone transition-colors hover:border-bone hover:bg-night disabled:opacity-50 @min-[26rem]:text-[10.5px] @min-[26rem]:tracking-[0.1em] @max-[19rem]:px-1 @max-[19rem]:text-[9.5px] @max-[19rem]:tracking-normal [&>svg]:h-3 [&>svg]:w-3 [&>svg]:shrink-0 @min-[26rem]:[&>svg]:h-3.5 @min-[26rem]:[&>svg]:w-3.5 @max-[17rem]:[&>svg]:hidden";

  const tileClass =
    "flex h-full min-h-16 w-full flex-col items-center justify-center gap-1.5 rounded-[3px] border border-bone/15 bg-transparent px-1 py-2 text-center text-[10px] leading-tight text-bone transition-colors hover:border-bone hover:bg-night sm:text-[12px] [&>svg]:shrink-0";

  return createPortal(
    <AnimatePresence>
      {open && (
        <m.div
          key="card"
          ref={overlayRef}
          className="fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto overscroll-contain px-3 pt-3 sm:items-center sm:overflow-hidden sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label={c.title}
        >
          <button type="button" tabIndex={-1} aria-label={c.close} className="fixed inset-0 cursor-default bg-night/80 backdrop-blur-md" onClick={onClose} />

          <m.div
            className="relative z-10 flex flex-col"
            style={{ width: fit.w * fit.scale, visibility: fit.h ? "visible" : "hidden" }}
            initial={{ y: 30, opacity: 0, rotateX: 12 }}
            animate={{ y: 0, opacity: 1, rotateX: 0 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <div ref={headerRef} className="mb-2 flex items-center justify-between text-bone sm:mb-3">
              <span className="eyebrow text-bone/60">{c.title}</span>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-bone/30 transition-colors hover:bg-night sm:h-10 sm:w-10"
                aria-label={c.close}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden><path strokeWidth={1.25} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="relative" style={{ height: fit.h * fit.scale }}>
              <div className="absolute left-0 top-0 origin-top-left" style={{ width: fit.w, transform: `scale(${fit.scale})` }}>
                <ServiceCard ref={cardRef} locale={locale} />
              </div>

            <AnimatePresence initial={false}>
              {panelOpen && (
                <m.div
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
                          <button type="button" onClick={() => shareTo(tg.href)} className={tileClass}>
                            {tg.icon}
                            {tg.label}
                          </button>
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
                </m.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {preview && (
                <m.div
                  key="preview"
                  className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 bg-night/95 p-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Image src={preview} alt={c.title} width={1080} height={1350} unoptimized className="h-auto max-h-[85%] w-auto rounded-[3px]" />
                  <p className="text-center font-mono text-[11px] uppercase tracking-[0.12em] text-bone/80">{c.holdToSave}</p>
                  <button type="button" onClick={closePreview} className="min-h-10 rounded-[3px] border border-bone/40 px-4 font-mono text-[11px] uppercase tracking-[0.12em] text-bone">
                    {c.close}
                  </button>
                </m.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {note && (
                <m.p
                  className="absolute inset-x-0 top-3 z-20 mx-auto w-fit max-w-[90%] rounded-[3px] border border-bone/25 bg-night px-3 py-2 text-center font-mono text-[11px] uppercase tracking-[0.12em] text-bone"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  role="status"
                >
                  {note}
                </m.p>
              )}
            </AnimatePresence>
            </div>

            <div ref={actionsRef} className="@container sticky bottom-0 z-20 -mx-3 mt-3 bg-night/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-md sm:static sm:mx-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
              <div className="flex gap-1.5 @min-[20rem]:grid @min-[20rem]:grid-cols-3 @min-[20rem]:gap-2">
              <button type="button" onClick={handleShare} disabled={busy !== null} className={actionClass}>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden><path strokeWidth={1.5} strokeLinecap="round" d="M12 3v12m0-12 4 4m-4-4-4 4M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" /></svg>
                {busy === "share" ? "…" : c.share}
              </button>
              <button type="button" onClick={handleDownload} disabled={busy !== null} className={actionClass}>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden><path strokeWidth={1.5} strokeLinecap="round" d="M12 4v11m0 0 4-4m-4 4-4-4M5 20h14" /></svg>
                {busy === "download" ? "…" : c.download}
              </button>
              <a href="/api/vcard" download className={actionClass}>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden><path strokeWidth={1.5} strokeLinecap="round" d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm10-3v6m3-3h-6" /></svg>
                {c.save}
              </a>
              </div>
            </div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
