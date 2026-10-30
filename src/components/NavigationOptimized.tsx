"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import LanguageSelector from "./LanguageSelector";
import SocialLinks from "./studio/SocialLinks";
import MobileMenu from "./navigation/MobileMenu";
import MenuIcon from "./navigation/MenuIcon";

const SCROLL_THRESHOLD = 40;
// Scroll jitter (trackpad inertia, touch bounce) must not flip the bar: it only hides or shows after
// this much travel in one direction, and the solid background has a small dead band around the threshold.
const HIDE_DELTA = 12;
const SCROLLED_BAND = 24;

function startsOverDark(pathname: string, prefix: string): boolean {
  if (pathname === "/" || pathname === prefix) return true;
  return new RegExp(
    `^${prefix}/(projects(/[^/]+)?|guides(/[^/]+)?|about|services|contact|glossary|kvkk)/?$`,
  ).test(pathname);
}

export default function Navigation() {
  const t = useTranslations("studio.nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // True from open until the close animation ends; the header then stays in the page's view-transition layer instead of being drawn over the menu.
  const [menuMounted, setMenuMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [settling, setSettling] = useState(false);

  const prefix = `/${locale}`;
  const overDark = startsOverDark(pathname, prefix) && !isScrolled;

  const primary = [
    { href: prefix, label: t("home") },
    { href: `${prefix}/projects`, label: t("work") },
    { href: `${prefix}/about`, label: t("studio") },
    { href: `${prefix}/services`, label: t("services") },
    { href: `${prefix}/guides`, label: t("guidesShort") },
    { href: `${prefix}/glossary`, label: t("glossaryShort") },
    { href: `${prefix}/contact`, label: t("contact") },
  ];

  useEffect(() => {
    let lastY = globalThis.scrollY;
    let rafId = 0;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (document.body.style.position === "fixed") return;
        const y = globalThis.scrollY;
        setIsScrolled((was) => (was ? y > SCROLL_THRESHOLD - SCROLLED_BAND : y > SCROLL_THRESHOLD));
        if (y <= 400) {
          setIsHidden(false);
          lastY = y;
        } else if (Math.abs(y - lastY) >= HIDE_DELTA) {
          setIsHidden(y > lastY);
          lastY = y;
        }
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
    setIsScrolled(false);
    setIsHidden(false);
    setSettling(true);
  }

  useEffect(() => {
    if (!settling) return;
    const id = requestAnimationFrame(() => setSettling(false));
    return () => cancelAnimationFrame(id);
  }, [settling]);

  useEffect(() => {
    if (!isMenuOpen) return;
    const onKey = (e: KeyboardEvent) =>
      e.key === "Escape" && setIsMenuOpen(false);
    const desktop = globalThis.matchMedia("(min-width: 1024px)");
    const onDesktop = () => desktop.matches && setIsMenuOpen(false);
    globalThis.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onDesktop);
    return () => {
      globalThis.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onDesktop);
    };
  }, [isMenuOpen]);

  const isActive = (href: string) =>
    href === prefix ? pathname === prefix : pathname.startsWith(href);
  const openMenu = () => {
    setMenuMounted(true);
    setIsMenuOpen(true);
  };
  const textTone = overDark ? "text-bone" : "text-ink";

  return (
    <>
      <nav
        className={`fixed inset-x-0 top-0 z-50 will-change-transform motion-reduce:transition-none ${menuMounted ? "" : "[view-transition-name:site-nav]"} ${settling ? "" : "transition-[transform,padding] duration-500 ease-studio"} ${
          isScrolled ? "py-3" : "py-5 sm:py-6"
        }`}
        style={{ transform: isHidden && !isMenuOpen ? "translateY(-100%)" : "none" }}
      >
        {/* The solid bar fades in as its own layer, so the blur never pops on or off over the hero film. */}
        <span
          aria-hidden
          className={`pointer-events-none absolute inset-0 -z-10 border-b border-line bg-paper/85 backdrop-blur-md motion-reduce:transition-none ${settling ? "" : "transition-opacity duration-500 ease-studio"} ${isScrolled ? "opacity-100" : "opacity-0"}`}
        />
        <div className="mx-auto flex max-w-[2560px] items-center justify-between px-4 sm:px-8 lg:px-12">
          <Link
            href={prefix}
            className={`group flex items-center gap-3 ${textTone}`}
            aria-label="U+ Studio"
          >
            <span className="flex h-9 w-9 items-center justify-center border border-bone/60 text-[15px] font-medium text-bone transition-colors duration-500 group-hover:border-bone group-hover:bg-night">
              U+
            </span>
            <span className="text-[17px] font-medium tracking-tight">
              Studio
            </span>
          </Link>

          <div
            className={`hidden items-center gap-5 lg:flex xl:gap-8 ${textTone}`}
          >
            {primary.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className="group relative py-1 text-[14px]"
              >
                <span
                  className={
                    isActive(item.href)
                      ? ""
                      : "opacity-90 transition-opacity group-hover:opacity-100"
                  }
                >
                  {item.label}
                </span>
                <span
                  className={`absolute -bottom-0.5 left-0 h-px w-full origin-left bg-current transition-transform duration-500 ${
                    isActive(item.href)
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
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
              <SocialLinks only={["directions", "whatsapp", "instagram", "card"]} className="-mx-2" />
            </div>

            <div className="lg:hidden">
              <LanguageSelector isDarkText={!overDark} />
            </div>

            <button
              type="button"
              onClick={openMenu}
              className="group -mr-2 ml-1 flex h-11 items-center px-2 lg:hidden"
              aria-label={t("menu")}
              aria-expanded={isMenuOpen}
            >
              <MenuIcon open={false} />
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence onExitComplete={() => setMenuMounted(false)}>
        {isMenuOpen && (
          <MobileMenu
            links={primary.map((item) => ({
              ...item,
              label: item.href.endsWith("/glossary") && locale !== "en"
                ? t("glossary")
                : item.label,
              active: isActive(item.href),
            }))}
            onClose={() => setIsMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
