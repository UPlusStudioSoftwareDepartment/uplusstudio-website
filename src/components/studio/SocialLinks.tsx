"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import dynamic from "next/dynamic";
import { studioInfo } from "@/lib/studio-info";
import { gmailComposeUrl } from "@/lib/gmailCompose";

const BusinessCard = dynamic(() => import("./BusinessCard"));

const ICON = "h-[18px] w-[18px]";

export const icons = {
  linkedin: (
    <svg className={ICON} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  directions: (
    <svg className={ICON} viewBox="2 2 20 20" fill="currentColor" aria-hidden>
      <path d="M21.71 11.29l-9-9a1 1 0 0 0-1.41 0l-9 9a1 1 0 0 0 0 1.41l9 9a1 1 0 0 0 1.41 0l9-9a1 1 0 0 0 0-1.41ZM14 14.5V12h-4v3H8v-4a1 1 0 0 1 1-1h5V7.5l3.5 3.5-3.5 3.5Z" />
    </svg>
  ),
  instagram: (
    <svg className={ICON} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077" />
    </svg>
  ),
  google: (
    <svg className={ICON} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19.527 4.799c1.212 2.608.937 5.678-.405 8.173-1.101 2.047-2.744 3.74-4.098 5.614-.619.858-1.244 1.75-1.669 2.727-.141.325-.263.658-.383.992-.121.333-.224.673-.34 1.008-.109.314-.236.684-.627.687h-.007c-.466-.001-.579-.53-.695-.887-.284-.874-.581-1.713-1.019-2.525-.51-.944-1.145-1.817-1.79-2.671L19.527 4.799zM8.545 7.705l-3.959 4.707c.724 1.54 1.821 2.863 2.871 4.18.247.31.494.622.737.936l4.984-5.925-.029.01c-1.741.601-3.691-.291-4.392-1.987a3.377 3.377 0 0 1-.209-.716c-.063-.437-.077-.761-.004-1.198l.001-.007zM5.492 3.149l-.003.004c-1.947 2.466-2.281 5.88-1.117 8.77l4.785-5.689-.058-.05-3.607-3.035zM14.661.436l-3.838 4.563a.295.295 0 0 1 .027-.01c1.6-.551 3.403.15 4.22 1.626.176.319.323.683.377 1.045.068.446.085.773.012 1.22l-.003.016 3.836-4.561A8.382 8.382 0 0 0 14.67.439l-.009-.003zM9.466 5.868L14.162.285l-.047-.012A8.31 8.31 0 0 0 11.986 0a8.439 8.439 0 0 0-6.169 2.766l-.016.018 3.665 3.084z" />
    </svg>
  ),
  yandex: (
    <svg
      className={ICON}
      viewBox="1.5 0.5 13 16"
      fill="currentColor"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M8 1C4.6862 1 2 3.6862 2 7C2 8.6563 2.6711 10.156 3.7565 11.2417C4.8422 12.328 7.4 13.9 7.55 15.55C7.57249 15.7974 7.7516 16 8 16C8.2484 16 8.42751 15.7974 8.45 15.55C8.6 13.9 11.1578 12.328 12.2435 11.2417C13.3289 10.156 14 8.6563 14 7C14 3.6862 11.3138 1 8 1Z M8.00002 9.10015C9.15982 9.10015 10.1 8.15994 10.1 7.00015C10.1 5.84035 9.15982 4.90015 8.00002 4.90015C6.84023 4.90015 5.90002 5.84035 5.90002 7.00015C5.90002 8.15994 6.84023 9.10015 8.00002 9.10015Z"
      />
    </svg>
  ),
  whatsapp: (
    <svg className={ICON} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  ),
  email: (
    <svg
      className={ICON}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="1.8" y="3" width="20.4" height="18" rx="3" />
      <path d="m2.5 5 9.5 7.2L21.5 5" />
    </svg>
  ),
  card: (
    <svg
      className={ICON}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="18.8" cy="4" r="3" />
      <circle cx="5.2" cy="12" r="3" />
      <circle cx="18.8" cy="20" r="3" />
      <path d="m7.8 13.5 8.4 5M16.2 5.5l-8.4 5" />
    </svg>
  ),
  phone: (
    <svg
      className={ICON}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 1.1 4.2 2 2 0 0 1 3.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L7.1 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.8 2Z" />
    </svg>
  ),
  peyzajRehber: (
    <Image
      src="/media/icons/peyzajrehber.png"
      alt=""
      width={18}
      height={18}
      className={`${ICON} object-contain brightness-125 grayscale`}
    />
  ),
  armut: (
    <svg className={ICON} viewBox="-3 0 25 32" fill="currentColor" aria-hidden>
      <path
        fillRule="evenodd"
        d="M9.4 5.27a.17.17 0 0 1-.16.1.16.16 0 0 1-.16-.11.17.17 0 0 1 0-.07c.13-2.15.67-3.48 1.2-4.2.09-.12.18-.22.28-.32a2.48 2.48 0 0 1 2.07-.64.23.23 0 0 1 .2.23.22.22 0 0 1 0 .05 3.58 3.58 0 0 1-1 1.82s-.05.05-.08.07l-.08.07A6.26 6.26 0 0 0 10.1 4c-.33.54-.72 1.27-.72 1.27Zm6.06 10.53a13.4 13.4 0 0 1 1.7 2.1 9.05 9.05 0 0 1 1.34 4.55v.5a9.31 9.31 0 0 1-2.71 6.33 9.23 9.23 0 0 1-6.3 2.71h-.56a9.23 9.23 0 0 1-6.25-2.74A9.31 9.31 0 0 1 0 22.94v-.45a9.28 9.28 0 0 1 2.48-6.11c.13-.15.65-.65.77-.77a7.76 7.76 0 0 0 1.76-2.34l.39-.94a8.5 8.5 0 0 0 .49-2.08l.01-.2.01-.24A3.38 3.38 0 0 1 6.94 7.7a3.35 3.35 0 0 1 2.16-.93h.36a3.35 3.35 0 0 1 2.13.95c.57.56.93 1.3 1 2.1v.15l.02.32a8.69 8.69 0 0 0 .88 2.96 8.18 8.18 0 0 0 1.96 2.55Z"
      />
    </svg>
  ),
};

type Item = {
  key: string;
  label: string;
  labelEn: string;
  icon: React.ReactNode;
  href?: string;
  external?: boolean;
  phoneOnly?: boolean;
  action?: "card";
};

const ITEMS: Item[] = [
  {
    key: "directions",
    label: "Yol tarifi",
    labelEn: "Directions",
    href: studioInfo.directionsUrl,
    icon: icons.directions,
    external: true,
  },
  {
    key: "phone",
    label: "Ara",
    labelEn: "Call",
    href: studioInfo.phoneHref,
    icon: icons.phone,
    phoneOnly: true,
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    labelEn: "WhatsApp",
    href: studioInfo.whatsappUrl,
    icon: icons.whatsapp,
    external: true,
  },
  {
    key: "email",
    label: "E-posta",
    labelEn: "Email",
    href: `mailto:${studioInfo.email}`,
    icon: icons.email,
  },
  {
    key: "google",
    label: "Google Maps",
    labelEn: "Google Maps",
    href: studioInfo.mapsUrl,
    icon: icons.google,
    external: true,
  },
  {
    key: "instagram",
    label: "Instagram",
    labelEn: "Instagram",
    href: studioInfo.instagramUrl,
    icon: icons.instagram,
    external: true,
  },
  {
    key: "yandex",
    label: "Yandex Maps",
    labelEn: "Yandex Maps",
    href: studioInfo.yandexMapsUrl,
    icon: icons.yandex,
    external: true,
  },
  {
    key: "armut",
    label: "Armut",
    labelEn: "Armut",
    href: studioInfo.armutUrl,
    icon: icons.armut,
    external: true,
  },
  {
    key: "peyzaj",
    label: "Peyzaj Rehber",
    labelEn: "Peyzaj Rehber",
    href: studioInfo.peyzajRehberUrl,
    icon: icons.peyzajRehber,
    external: true,
  },
  {
    key: "card",
    label: "Kartviziti paylaş",
    labelEn: "Share business card",
    icon: icons.card,
    action: "card",
  },
];

export default function SocialLinks({
  className = "",
  tooltip = "below",
  only,
}: Readonly<{ className?: string; tooltip?: "below" | "above"; only?: string[] }>) {
  const locale = useLocale();
  const [isPhone, setIsPhone] = useState(false);
  const [cardOpen, setCardOpen] = useState(false);
  const [cardLoaded, setCardLoaded] = useState(false);
  const visibleItems = only
    ? only.flatMap((key) => ITEMS.filter((item) => item.key === key))
    : ITEMS.filter((item) => !item.phoneOnly || isPhone);
  const below = tooltip === "below";

  useEffect(() => {
    const id = setTimeout(
      () =>
        setIsPhone(
          /Android|iPhone|iPod/i.test(navigator.userAgent) ||
            globalThis.matchMedia("(max-width: 639px)").matches,
        ),
      0,
    );
    return () => clearTimeout(id);
  }, []);

  const keepTipOnScreen = (e: React.SyntheticEvent<HTMLLIElement>) => {
    const tip = e.currentTarget.querySelector<HTMLElement>('[role="tooltip"]');
    if (!tip) return;
    tip.style.setProperty("--tip-shift", "0px");
    const r = tip.getBoundingClientRect();
    const margin = 8;
    let shift = 0;
    if (r.right > globalThis.innerWidth - margin) shift = globalThis.innerWidth - margin - r.right;
    else if (r.left < margin) shift = margin - r.left;
    tip.style.setProperty("--tip-shift", `${Math.round(shift)}px`);
  };

  const buttonClass =
    "peer relative flex h-8 w-8 items-center justify-center rounded-full after:absolute after:-inset-1.5 after:content-[''] max-[359px]:h-7 max-[359px]:w-7 opacity-80 transition-[opacity,background-color] hover:bg-night hover:opacity-100 focus-visible:opacity-100 2xl:h-9 2xl:w-9";

  return (
    <>
      <ul className={`flex items-center ${className}`}>
        {visibleItems.map((item) => {
          const label = locale === "en" ? item.labelEn : item.label;
          return (
            <li key={item.key} className="relative" onPointerEnter={keepTipOnScreen} onFocus={keepTipOnScreen}>
              {item.action === "card" ? (
                <button
                  type="button"
                  onClick={() => {
                    setCardLoaded(true);
                    setCardOpen(true);
                  }}
                  aria-label={label}
                  className={buttonClass}
                >
                  {item.icon}
                </button>
              ) : (
                <a
                  href={item.key === "email" && !isPhone ? gmailComposeUrl({ to: studioInfo.email, subject: "", text: "" }) : item.href}
                  {...(item.external || (item.key === "email" && !isPhone)
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  aria-label={label}
                  className={buttonClass}
                >
                  {item.icon}
                </a>
              )}
              {!isPhone && (
                <span
                  role="tooltip"
                  className={`pointer-events-none absolute left-1/2 z-50 min-h-8 translate-x-[calc(-50%+var(--tip-shift,0px))] whitespace-nowrap rounded-[6px] bg-black/85 px-2 py-1.5 font-sans text-[13px] font-normal normal-case leading-[1.4] tracking-normal text-white opacity-0 shadow-[0_6px_16px_0_rgba(0,0,0,0.08),0_3px_6px_-4px_rgba(0,0,0,0.12),0_9px_28px_8px_rgba(0,0,0,0.05)] transition-[opacity,transform,scale,translate] duration-150 max-sm:hidden peer-hover:opacity-100 peer-focus-visible:opacity-100 [@media(hover:none)]:hidden ${below ? "top-full mt-2.5" : "bottom-full mb-2.5"}`}
                >
                  {label}
                  <span
                    aria-hidden
                    className={`absolute left-[calc(50%-var(--tip-shift,0px))] h-2 w-2 -translate-x-1/2 rotate-45 bg-black/85 ${below ? "-top-1" : "-bottom-1"}`}
                  />
                </span>
              )}
            </li>
          );
        })}
      </ul>
      {cardLoaded && <BusinessCard open={cardOpen} onClose={() => setCardOpen(false)} />}
    </>
  );
}
