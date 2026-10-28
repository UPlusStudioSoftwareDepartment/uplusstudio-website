"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { navigateSmoothly } from "@/components/studio/PageCurtain";

interface LanguageSelectorProps {
  isDarkText?: boolean;
}

export default function LanguageSelector({ isDarkText = true }: Readonly<LanguageSelectorProps>) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLanguage = (lang: string) => {
    if (lang === locale) return;
    const pathWithoutLocale = pathname.replace(/^\/(tr|en)/, '');
    navigateSmoothly(() => router.push(`/${lang}${pathWithoutLocale}`));
  };

  const getButtonClass = (isActive: boolean) => {
    const tap = "relative after:absolute after:-inset-x-1.5 after:-inset-y-3 after:content-['']";
    if (isActive) return `${tap} ${isDarkText ? 'text-ink' : 'text-bone'}`;
    return `${tap} ${isDarkText ? 'text-mute hover:text-ink' : 'text-bone/45 hover:text-bone'}`;
  };

  return (
    <div className="flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.12em]">
      <button
        type="button"
        onClick={() => toggleLanguage('tr')}
        aria-current={locale === 'tr'}
        className={`transition-colors duration-300 ${getButtonClass(locale === 'tr')}`}
      >
        TR
      </button>
      <span className={isDarkText ? 'text-line' : 'text-bone/25'}>/</span>
      <button
        type="button"
        onClick={() => toggleLanguage('en')}
        aria-current={locale === 'en'}
        className={`transition-colors duration-300 ${getButtonClass(locale === 'en')}`}
      >
        EN
      </button>
    </div>
  );
}
