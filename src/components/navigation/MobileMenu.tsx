"use client";

import { useRef } from "react";
import { m, useIsPresent, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import BookingCta from "@/components/studio/BookingCta";
import LanguageSelector from "@/components/LanguageSelector";
import SocialLinks from "@/components/studio/SocialLinks";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useScrollLock } from "@/hooks/useScrollLock";
import { useAppointment } from "@/contexts/AppointmentContext";
import { studioInfo } from "@/lib/studio-info";
import { getMobileMenuMotion } from "./mobileMenuMotion";
import MenuIcon from "./MenuIcon";

export type MenuLink = Readonly<{
  href: string;
  label: string;
  active: boolean;
}>;

type MobileMenuProps = Readonly<{
  links: readonly MenuLink[];
  onClose: () => void;
}>;

export default function MobileMenu({ links, onClose }: MobileMenuProps) {
  const t = useTranslations("studio.nav");
  const prefix = "/" + useLocale();
  const pathname = usePathname();
  const { openAppointment } = useAppointment();
  const menuRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const present = useIsPresent();
  const reduce = useReducedMotion();
  useScrollLock(true);
  useFocusTrap(present, menuRef, closeRef);
  const closeIfCurrent = (href: string) => href === pathname && onClose();
  const motion = getMobileMenuMotion(Boolean(reduce), links.length);

  return (
    <m.div
      key="menu"
      ref={menuRef}
      className="fixed inset-0 z-[60] h-[100dvh] overflow-hidden bg-night text-bone"
      style={{ willChange: "opacity" }}
      initial="initial"
      animate="open"
      exit="closed"
      variants={motion.root}
      role="dialog"
      aria-modal="true"
      aria-label={t("menu")}
    >
      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between gap-3 px-4 sm:px-8 py-5 sm:py-6 [@media(max-height:520px)]:py-3">
        <Link
          href={prefix}
          className="group flex shrink-0 items-center gap-3"
          onClick={() => closeIfCurrent(prefix)}
        >
          <span className="flex h-9 w-9 items-center justify-center border border-bone/60 text-[15px] font-medium transition-colors group-hover:bg-night">
            U+
          </span>
          <span className="text-[17px] font-medium tracking-tight">Studio</span>
        </Link>
        <m.div
          className="flex min-w-0 items-end"
          aria-hidden
          variants={motion.mascots}
        >
          <Image
            src="/media/mascots/designer-menu.svg"
            alt=""
            width={140}
            height={150}
            loading="eager"
            className="h-11 w-11 sm:h-12 sm:w-12"
          />
          <Image
            src="/media/mascots/builder-menu.svg"
            alt=""
            width={140}
            height={150}
            loading="eager"
            className="-ml-2 h-11 w-11 sm:h-12 sm:w-12"
          />
        </m.div>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label={t("close")}
          className="group -mr-2 ml-1 flex h-11 items-center px-2"
        >
          <MenuIcon open={present} />
        </button>
      </div>
      <m.div
        className="absolute inset-0"
        style={{ willChange: "transform" }}
        variants={motion.panel}
      >
        <m.div className="absolute inset-0" variants={motion.photo} aria-hidden>
          <Image
            src="/media/projects/villa-donusumu/after.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-25"
          />
        </m.div>
        <div
          className="absolute inset-0 bg-linear-to-b from-night via-night/85 to-night"
          aria-hidden
        />

        <div className="relative flex h-full flex-col px-4 sm:px-8">
          <div
            className="h-[84px] shrink-0 sm:h-[92px] [@media(max-height:520px)]:h-[68px]"
            aria-hidden
          />

          <nav
            className="flex min-h-0 flex-1 flex-col justify-center overflow-hidden py-[1.5dvh]"
            aria-label={t("menu")}
          >
            <ul className="flex flex-col [@media(max-height:520px)]:grid [@media(max-height:520px)]:grid-cols-2 [@media(max-height:520px)]:gap-x-8">
              {links.map((item, i) => {
                const active = item.active;
                return (
                  <li
                    key={item.href}
                    className="overflow-hidden border-b border-bone/10 first:border-t [@media(max-height:520px)]:[&:nth-child(2)]:border-t"
                  >
                    <m.div variants={motion.link(i)}>
                      <Link
                        href={item.href}
                        prefetch={false}
                        onClick={() => closeIfCurrent(item.href)}
                        className="group flex items-baseline gap-4 py-[clamp(0.25rem,1.1dvh,1rem)] active:text-clay"
                      >
                        <m.span
                          className="w-7 font-mono text-[12px] text-bone/60"
                          variants={motion.number(i)}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </m.span>
                        <span
                          className={`font-sans text-[clamp(1.1rem,min(8.5vw,4.6dvh),3.75rem)] font-light leading-[1.05] tracking-[-0.035em] ${
                            active ? "text-bone" : "text-bone/65"
                          }`}
                        >
                          {active ? (
                            <em className="font-serif font-normal italic tracking-normal">
                              {item.label}
                            </em>
                          ) : (
                            item.label
                          )}
                        </span>
                        <span
                          className={`ml-auto self-center text-lg transition-transform group-active:translate-x-1 ${active ? "text-clay" : "text-bone/30"}`}
                          aria-hidden
                        >
                          {active ? "●" : "→"}
                        </span>
                      </Link>
                    </m.div>
                  </li>
                );
              })}
            </ul>
          </nav>

          <m.div
            className="border-t border-bone/10 pb-[max(clamp(0.5rem,2dvh,1.25rem),env(safe-area-inset-bottom))] pt-[clamp(0.5rem,2dvh,1.25rem)]"
            variants={motion.footer}
          >
            <div className="flex items-start justify-between gap-6 text-[13px] text-bone/70 [@media(max-height:520px)]:justify-end">
              <div className="-my-1 [@media(max-height:520px)]:hidden">
                <a
                  href={`mailto:${studioInfo.email}`}
                  className="flex min-h-7 items-center active:text-bone"
                >
                  {studioInfo.email}
                </a>
                <a
                  href={studioInfo.phoneHref}
                  className="flex min-h-7 items-center active:text-bone"
                >
                  {studioInfo.phoneDisplay}
                </a>
              </div>
              <LanguageSelector isDarkText={false} />
            </div>
            <SocialLinks
              className="mt-3 w-full justify-between"
              tooltip="above"
            />
            <BookingCta
              onBook={() => {
                onClose();
                openAppointment();
              }}
              label={t("appointment")}
              arrow={<span aria-hidden>→</span>}
              className="mt-[clamp(0.5rem,2dvh,1.25rem)] flex min-h-[clamp(2.75rem,7dvh,3.5rem)] w-full items-center justify-between border border-bone bg-transparent px-5 font-mono text-[12px] uppercase tracking-[0.12em] text-bone transition-colors hover:bg-night hover:text-bone active:bg-night active:text-bone"
            />
          </m.div>
        </div>
      </m.div>
    </m.div>
  );
}
