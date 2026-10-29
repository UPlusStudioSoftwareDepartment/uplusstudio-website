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

  const pathWithoutLocale = pathname.replace(/^\/(tr|en)/, '');
  const hrefFor = (lang: string) => `/${lang}${pathWithoutLocale}`;

  // Real links so crawlers and new-tab clicks reach the same page in the other language.
  const toggleLanguage = (event: React.MouseEvent<HTMLAnchorElement>, lang: string) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    if (lang === locale) return;
    navigateSmoothly(() => router.push(hrefFor(lang)));
  };

  const getButtonClass = (isActive: boolean) => {
    const tap = "relative after:absolute after:-inset-x-1.5 after:-inset-y-3 after:content-['']";
    if (isActive) return `${tap} ${isDarkText ? 'text-ink' : 'text-bone'}`;
    return `${tap} ${isDarkText ? 'text-mute hover:text-ink' : 'text-bone/65 hover:text-bone'}`;
  };

  return (
    <div className="flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.12em]">
      <a
        href={hrefFor('tr')}
        hrefLang="tr"
        onClick={(event) => toggleLanguage(event, 'tr')}
        aria-current={locale === 'tr' ? 'true' : undefined}
        className={`transition-colors duration-300 ${getButtonClass(locale === 'tr')}`}
      >
        TR
      </a>
      <span className={isDarkText ? 'text-line' : 'text-bone/25'}>/</span>
      <a
        href={hrefFor('en')}
        hrefLang="en"
        onClick={(event) => toggleLanguage(event, 'en')}
        aria-current={locale === 'en' ? 'true' : undefined}
        className={`transition-colors duration-300 ${getButtonClass(locale === 'en')}`}
      >
        EN
      </a>
    </div>
  );
}
