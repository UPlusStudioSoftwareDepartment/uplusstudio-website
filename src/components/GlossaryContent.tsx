"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { m, useReducedMotion } from "framer-motion";
import PageHeader from "@/components/studio/PageHeader";
import { MascotDuo } from "@/components/mascots/Mascots";
import { EASE_OUT } from "@/components/studio/Reveal";
import { pad } from "@/lib/glossary";

type GlossaryContentProps = {
    total: number;
    counts: Record<string, number>;
    alphabet: string[];
    children: ReactNode;
};

export default function GlossaryContent({ total, counts, alphabet, children }: Readonly<GlossaryContentProps>) {
    const t = useTranslations("glossary");
    const tm = useTranslations("studio.mascots");
    const locale = useLocale();
    const reduce = useReducedMotion();
    const uid = useId();
    const listTopRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [activeLetter, setActiveLetter] = useState<string | null>(null);
    const [visible, setVisible] = useState(total);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        const list = listRef.current;
        if (!list) return;
        const query = searchQuery.trim() ? debouncedSearch.trim().toLocaleLowerCase(locale) : "";
        let shown = 0;
        for (const section of list.querySelectorAll<HTMLElement>("[data-letter-section]")) {
            let sectionShown = 0;
            for (const item of section.querySelectorAll<HTMLElement>("[data-term]")) {
                const match = (!activeLetter || item.dataset.term === activeLetter) && (!query || (item.textContent ?? "").toLocaleLowerCase(locale).includes(query));
                item.hidden = !match;
                if (match) sectionShown++;
            }
            section.hidden = sectionShown === 0;
            shown += sectionShown;
        }
        setVisible(shown);
    }, [searchQuery, debouncedSearch, activeLetter, locale]);

    const selectLetter = (letter: string | null) => {
        setActiveLetter((prev) => (prev === letter ? null : letter));
        const top = listTopRef.current;
        if (top && top.getBoundingClientRect().top < 0) {
            top.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
        }
    };

    const clearAll = () => {
        setSearchQuery("");
        setActiveLetter(null);
    };

    return (
        <div className="relative text-ink">
            <PageHeader
                index="07"
                label={t("label")}
                titleLines={[t("titleLine1"), <em key="accent">{t("titleLine2")}</em>]}
                intro={t("subtitle")}
                meta={[
                    { label: t("metaTerms"), value: <span className="font-mono tabular-nums">{total}</span> },
                    { label: t("metaLetters"), value: <span className="font-mono tabular-nums">{pad(Object.keys(counts).length)}</span> },
                    { label: t("metaLanguage"), value: t("metaLanguageValue") },
                ]}
            />

            <section className="mx-auto mt-20 max-w-[2560px] px-4 pb-28 sm:px-8 lg:mt-28 lg:px-12 lg:pb-40">
                <div className="grid grid-cols-1 gap-x-8 gap-y-6 border-t border-line pt-10 lg:grid-cols-12">
                    <div className="flex items-end justify-between gap-6 lg:col-span-3 lg:flex-col lg:items-start lg:justify-start">
                        <label htmlFor={`${uid}-search`} className="eyebrow text-mute lg:pt-5">
                            {t("searchLabel")}
                        </label>
                        <MascotDuo pose={visible === 0 ? "think" : "wave"} size="sm" message={visible === 0 ? tm("glossaryEmpty") : tm("glossary")} />
                    </div>
                    <div role="search" className="min-w-0 lg:col-span-9">
                        <div className="flex items-center border-b border-line focus-within:border-ink">
                            <svg className="h-5 w-5 shrink-0 text-mute" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1} aria-hidden>
                                <circle cx="7" cy="7" r="5" />
                                <path d="M10.5 10.5 15 15" />
                            </svg>
                            <input
                                id={`${uid}-search`}
                                type="search"
                                placeholder={t("searchPlaceholder")}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoComplete="off"
                                style={{ outline: "none" }}
                                className="w-full min-w-0 bg-transparent py-4 pl-4 pr-2 font-sans text-[clamp(1.25rem,2.4vw,2rem)] font-light tracking-[-0.02em] text-ink placeholder:text-mute/60 focus:outline-none focus-visible:outline-none [&::-webkit-search-cancel-button]:hidden"
                            />
                            {(searchQuery.trim() || activeLetter) && (
                                <button type="button" onClick={clearAll} className="eyebrow shrink-0 py-2 text-mute hover:text-clay">
                                    {t("clearSearch")}
                                </button>
                            )}
                        </div>
                        <p className="mt-3 font-mono text-[12px] uppercase tracking-[0.14em] text-mute" aria-live="polite">
                            {t("foundCount", { count: visible })}
                        </p>
                    </div>
                </div>

                <div ref={listTopRef} className="scroll-mt-20" />
                <nav aria-label={t("lettersLabel")} className="sticky top-0 z-20 -mx-4 mt-12 border-y border-line bg-paper/90 backdrop-blur-md sm:-mx-8 lg:mx-0">
                    <ul className="flex items-stretch overflow-x-auto px-2 [scrollbar-width:none] sm:px-4 lg:overflow-visible lg:px-3 [&::-webkit-scrollbar]:hidden">
                        <li className="mr-1 shrink-0 border-r border-line pr-1">
                            <button
                                type="button"
                                onClick={() => selectLetter(null)}
                                aria-pressed={activeLetter === null}
                                className={`relative h-12 px-4 font-mono text-[12px] uppercase tracking-[0.14em] transition-colors ${activeLetter === null ? "text-ink" : "text-mute hover:text-ink"}`}
                            >
                                {t("allLetters")}
                                {activeLetter === null && <span className="absolute inset-x-4 bottom-0 h-px bg-clay" aria-hidden />}
                            </button>
                        </li>
                        {alphabet.map((letter) => {
                            const count = counts[letter] ?? 0;
                            const active = activeLetter === letter;
                            return (
                                <li key={letter} className="shrink-0 lg:min-w-0 lg:flex-1 lg:shrink">
                                    <button
                                        type="button"
                                        onClick={() => selectLetter(letter)}
                                        disabled={count === 0}
                                        aria-pressed={active}
                                        aria-label={`${t("showLetter", { letter })} (${count})`}
                                        className={`relative h-12 w-10 font-mono text-[13px] transition-colors lg:w-full ${active ? "text-ink" : count === 0 ? "cursor-default text-line" : "text-mute hover:text-clay"}`}
                                    >
                                        {letter}
                                        {active && <span className="absolute inset-x-2 bottom-0 h-px bg-clay" aria-hidden />}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div ref={listRef} hidden={visible === 0}>
                    {children}
                </div>

                {visible === 0 && (
                    <m.div
                        initial={reduce ? false : { opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: EASE_OUT }}
                        className="grid grid-cols-1 gap-x-8 gap-y-8 border-b border-line py-20 sm:py-28 lg:grid-cols-12"
                    >
                        <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-mute lg:col-span-3">
                            {pad(0, 3)} / {total}
                        </p>
                        <div className="lg:col-span-7">
                            <h2 className="display text-[clamp(2.5rem,6vw,5.5rem)] text-ink">{t("noResultsTitle")}</h2>
                            <p className="mt-6 max-w-prose text-[17px] leading-relaxed text-mute">{t("noResultsMessage")}</p>
                            <div className="mt-10 flex flex-wrap items-baseline gap-x-10 gap-y-4">
                                <button
                                    type="button"
                                    onClick={clearAll}
                                    className="group inline-flex items-center gap-3 border-b border-ink pb-1 text-[15px] text-ink hover:border-clay hover:text-clay"
                                >
                                    {t("clearSearch")}
                                    <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>→</span>
                                </button>
                                <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-mute">
                                    {t("totalTerms")} · <span className="tabular-nums text-ink">{total}</span>
                                </span>
                            </div>
                        </div>
                    </m.div>
                )}
            </section>
        </div>
    );
}
