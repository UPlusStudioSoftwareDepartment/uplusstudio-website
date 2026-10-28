"use client";

import { useState, useEffect, useRef } from "react";
import BookingCta from "@/components/studio/BookingCta";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import LanguageSelector from "./LanguageSelector";
import SocialLinks from "./studio/SocialLinks";
import { DesignerMascot, BuilderMascot } from "@/components/mascots/Mascots";
import { useScrollLock } from "@/hooks/useScrollLock";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useAppointment } from "@/contexts/AppointmentContext";
import { studioInfo } from "@/lib/studio-info";

const SCROLL_THRESHOLD = 40;
const EASE = [0.76, 0, 0.24, 1] as const;

function startsOverDark(pathname: string, prefix: string): boolean {
  if (pathname === "/" || pathname === prefix) return true;
  return new RegExp(
    `^${prefix}/(projects(/[^/]+)?|about|services|contact|faq|glossary|purchase|payment(/success)?)/?$`
  ).test(pathname);
}

export default function Navigation() {
  const t = useTranslations("studio.nav");
  const locale = useLocale();
  const pathname = usePathname();
  const { openAppointment } = useAppointment();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const prefix = `/${locale}`;
  const overDark = startsOverDark(pathname, prefix) && !isScrolled;

  const primary = [
    { href: prefix, label: t("home") },
    { href: `${prefix}/projects`, label: t("work") },
    { href: `${prefix}/about`, label: t("studio") },
    { href: `${prefix}/services`, label: t("services") },
    { href: `${prefix}/glossary`, label: t("glossaryShort") },
    { href: `${prefix}/contact`, label: t("contact") },
  ];
  const overlayLinks = [
    ...primary.map((item) => (item.href.endsWith("/glossary") ? { ...item, label: t("glossary") } : item)),
  ];

  useScrollLock(isMenuOpen);
  useFocusTrap(isMenuOpen, menuRef, closeRef);

  useEffect(() => {
    let lastY = globalThis.scrollY;
    let rafId = 0;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const y = globalThis.scrollY;
        setIsScrolled(y > SCROLL_THRESHOLD);
        setIsHidden(y > 400 && y > lastY);
        lastY = y;
      });
    };
    globalThis.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      globalThis.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setIsMenuOpen(false);
  }

  useEffect(() => {
    if (!isMenuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIsMenuOpen(false);
    const desktop = globalThis.matchMedia("(min-width: 1024px)");
    const onResize = () => desktop.matches && setIsMenuOpen(false);
    globalThis.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onResize);
    return () => {
      globalThis.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onResize);
    };
  }, [isMenuOpen]);

  const isActive = (href: string) => (href === prefix ? pathname === prefix : pathname.startsWith(href));
  const textTone = overDark ? "text-bone" : "text-ink";

  return (
    <>
      <motion.nav
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,padding] duration-500 ${
          isScrolled ? "bg-paper/85 backdrop-blur-md border-b border-line py-3" : "bg-transparent border-b border-transparent py-5 sm:py-6"
        }`}
        animate={{ y: isHidden && !isMenuOpen ? "-100%" : "0%" }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <div className="mx-auto flex max-w-[2560px] items-center justify-between px-4 sm:px-8 lg:px-12">
          <Link href={prefix} className={`group flex items-center gap-3 ${textTone}`} aria-label="U+ Studio">
            <span
              className="flex h-9 w-9 items-center justify-center border border-bone/60 text-[15px] font-medium text-bone transition-colors duration-500 group-hover:border-bone group-hover:bg-night"
            >
              U+
            </span>
            <span className="text-[17px] font-medium tracking-tight">Studio</span>
          </Link>

          <div className={`hidden items-center gap-5 lg:flex xl:gap-8 ${textTone}`}>
            {primary.map((item) => (
              <Link key={item.href} href={item.href} className="group relative py-1 text-[14px]">
                <span className={isActive(item.href) ? "" : "opacity-75 transition-opacity group-hover:opacity-100"}>{item.label}</span>
                <span
                  className={`absolute -bottom-0.5 left-0 h-px w-full origin-left bg-current transition-transform duration-500 ${
                    isActive(item.href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            ))}
          </div>

          <div className={`flex items-center gap-4 xl:gap-6 ${textTone}`}>
            <div className="hidden lg:block">
              <LanguageSelector isDarkText={!overDark} />
            </div>
            <div className="hidden items-center gap-4 lg:flex">
              <span className="h-5 w-px bg-current opacity-25" aria-hidden />
              <SocialLinks className="-mx-2" />
            </div>

            <div className="lg:hidden">
              <LanguageSelector isDarkText={!overDark} />
            </div>

            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              className="group -mr-2 ml-1 flex h-11 items-center gap-3 px-2 font-mono text-[12px] uppercase tracking-[0.12em] lg:hidden"
              aria-label={t("menu")}
              aria-expanded={isMenuOpen}
            >
              <span className="hidden sm:inline">{t("menu")}</span>
              <span className="flex w-7 flex-col gap-[6px]">
                <span className="h-px w-full bg-current" />
                <span className="h-px w-2/3 self-end bg-current" />
              </span>
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            key="menu"
            ref={menuRef}
            className="fixed inset-0 z-[60] h-[100dvh] overflow-hidden bg-night text-bone lg:hidden"
            initial={{ clipPath: "circle(0% at calc(100% - 44px) 40px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 44px) 40px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 44px) 40px)" }}
            transition={{ duration: 0.85, ease: EASE }}
            role="dialog"
            aria-modal="true"
            aria-label={t("menu")}
          >
            <motion.div
              className="absolute inset-0"
              initial={{ scale: 1.15 }}
              animate={{ scale: 1 }}
              transition={{ duration: 6, ease: "easeOut" }}
              aria-hidden
            >
              <Image src="/media/projects/villa-donusumu/after.jpg" alt="" fill sizes="100vw" className="object-cover opacity-25" />
            </motion.div>
            <div className="absolute inset-0 bg-linear-to-b from-night via-night/85 to-night" aria-hidden />

            <div className="relative flex h-full flex-col px-4 sm:px-8">
              <div className="flex items-center justify-between gap-3 py-[clamp(0.5rem,2.2dvh,1.5rem)]">
                <Link href={prefix} className="group flex shrink-0 items-center gap-3" onClick={() => setIsMenuOpen(false)}>
                  <span className="flex h-9 w-9 items-center justify-center border border-bone/60 text-[15px] font-medium transition-colors group-hover:bg-night">U+</span>
                  <span className="text-[17px] font-medium tracking-tight">Studio</span>
                </Link>
                <div className="flex min-w-0 items-end" aria-hidden>
                  <DesignerMascot pose="wave" className="h-11 w-11 sm:h-12 sm:w-12" />
                  <BuilderMascot className="-ml-2 h-11 w-11 sm:h-12 sm:w-12" />
                </div>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  className="group -mr-1 flex items-center gap-3 font-mono text-[12px] uppercase tracking-[0.12em]"
                >
                  {t("close")}
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-bone/30 transition-colors group-active:bg-night active:text-bone group-active:text-bone">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden><path strokeWidth={1.25} d="M6 18L18 6M6 6l12 12" /></svg>
                  </span>
                </button>
              </div>

              <nav className="flex min-h-0 flex-1 flex-col justify-center overflow-hidden py-[1.5dvh]" aria-label={t("menu")}>
                <ul className="flex flex-col [@media(max-height:520px)]:grid [@media(max-height:520px)]:grid-cols-2 [@media(max-height:520px)]:gap-x-8">
                  {overlayLinks.map((item, i) => {
                    const active = isActive(item.href);
                    return (
                      <li key={item.href} className="overflow-hidden border-b border-bone/10 first:border-t [@media(max-height:520px)]:[&:nth-child(2)]:border-t">
                        <motion.div
                          initial={{ y: "110%" }}
                          animate={{ y: "0%" }}
                          exit={{ y: "110%", transition: { duration: 0.3 } }}
                          transition={{ duration: 0.8, ease: EASE, delay: 0.3 + i * 0.05 }}
                        >
                          <Link
                            href={item.href}
                            onClick={() => setIsMenuOpen(false)}
                            className="group flex items-baseline gap-4 py-[clamp(0.25rem,1.1dvh,1rem)] active:text-clay"
                          >
                            <span className="w-7 font-mono text-[12px] text-bone/60">{String(i + 1).padStart(2, "0")}</span>
                            <span
                              className={`font-sans text-[clamp(1.1rem,min(8.5vw,4.6dvh),3.75rem)] font-light leading-[1.05] tracking-[-0.035em] ${
                                active ? "text-bone" : "text-bone/65"
                              }`}
                            >
                              {active ? <em className="font-serif font-normal italic tracking-normal">{item.label}</em> : item.label}
                            </span>
                            <span
                              className={`ml-auto self-center text-lg transition-transform group-active:translate-x-1 ${active ? "text-clay" : "text-bone/30"}`}
                              aria-hidden
                            >
                              {active ? "●" : "→"}
                            </span>
                          </Link>
                        </motion.div>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <motion.div
                className="border-t border-bone/10 pb-[max(clamp(0.5rem,2dvh,1.25rem),env(safe-area-inset-bottom))] pt-[clamp(0.5rem,2dvh,1.25rem)]"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE, delay: 0.7 }}
              >
                <div className="flex items-start justify-between gap-6 text-[13px] text-bone/70 [@media(max-height:520px)]:justify-end">
                  <div className="-my-1 [@media(max-height:520px)]:hidden">
                    <a href={`mailto:${studioInfo.email}`} className="flex min-h-7 items-center active:text-bone">{studioInfo.email}</a>
                    <a href={studioInfo.phoneHref} className="flex min-h-7 items-center active:text-bone">{studioInfo.phoneDisplay}</a>
                  </div>
                  <LanguageSelector isDarkText={false} />
                </div>
                <SocialLinks className="mt-3 w-full justify-between" tooltip="above" />
                <BookingCta
                  onBook={() => {
                    setIsMenuOpen(false);
                    openAppointment();
                  }}
                  label={t("appointment")}
                  arrow={<span aria-hidden>→</span>}
                  className="mt-[clamp(0.5rem,2dvh,1.25rem)] flex min-h-[clamp(2.75rem,7dvh,3.5rem)] w-full items-center justify-between border border-bone bg-transparent px-5 font-mono text-[12px] uppercase tracking-[0.12em] text-bone transition-colors hover:bg-night hover:text-bone active:bg-night active:text-bone"
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
