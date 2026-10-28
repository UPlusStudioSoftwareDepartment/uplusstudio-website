"use client";

import { useLocale } from "next-intl";

const COPY = {
  tr: ["Kişisel verilerinizi nasıl işlediğimizi ", "KVKK Aydınlatma Metni", " açıklıyor."],
  en: ["See how we handle your personal data in our ", "privacy notice", "."],
} as const;

export default function PrivacyNote({ className = "" }: Readonly<{ className?: string }>) {
  const locale = useLocale() === "en" ? "en" : "tr";
  const [before, link, after] = COPY[locale];
  return (
    <p className={`text-[13px] leading-relaxed text-mute ${className}`}>
      {before}
      <a href={`/${locale}/kvkk`} target="_blank" rel="noopener noreferrer" className="underline decoration-line underline-offset-4 hover:text-ink">
        {link}
      </a>
      {after}
    </p>
  );
}
