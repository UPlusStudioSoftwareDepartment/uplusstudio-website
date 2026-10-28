"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { m, useReducedMotion } from "framer-motion";
import PageHeader from "@/components/studio/PageHeader";
import { MascotDuo } from "@/components/mascots/Mascots";
import { EASE_OUT } from "@/components/studio/Reveal";
import GlossaryList from "@/components/GlossaryList";
import { pad, type Term } from "@/lib/glossary";

type GlossaryContentProps = {
    total: number;
    sections: { letter: string; items: Term[] }[];
    counts: Record<string, number>;
    alphabet: string[];
};

export default function GlossaryContent({ total, sections, counts, alphabet }: Readonly<GlossaryContentProps>) {
    const t = useTranslations("glossary");
    const tm = useTranslations("studio.mascots");
    const locale = useLocale();
    const reduce = useReducedMotion();
    const uid = useId();
    const listTopRef = useRef<HTMLDivElement>(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [activeLetter, setActiveLetter] = useState<string | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const filtered = useMemo(() => {
        const query = searchQuery.trim() ? debouncedSearch.trim().toLocaleLowerCase(locale) : "";
        const matches = (term: Term) =>
            [term.term, term.simple_definition, term.definition].some((text) => text.toLocaleLowerCase(locale).includes(query));
        return sections
            .filter((section) => !activeLetter || section.letter === activeLetter)
            .map((section) => ({ letter: section.letter, items: query ? section.items.filter(matches) : section.items }))
            .filter((section) => section.items.length > 0);
    }, [sections, searchQuery, debouncedSearch, activeLetter, locale]);

    const visible = filtered.reduce((sum, section) => sum + section.items.length, 0);

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
                <div className="border-t border-line pt-10">
                    <div className="flex flex-col-reverse items-center gap-3 text-center">
                        <label htmlFor={`${uid}-search`} className="font-sans text-[20px] font-light leading-6 text-mute">
                            {t("searchLabel")}
                        </label>
                        <MascotDuo pose={visible === 0 ? "think" : "wave"} size="sm" message={visible === 0 ? tm("glossaryEmpty") : tm("glossary")} />
                    </div>
                    <div role="search" className="mt-6 min-w-0">
                        <div className="group flex items-center border-b border-line">
                            <svg className="h-6 w-6 shrink-0 text-mute transition-colors group-focus-within:text-ink" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1} aria-hidden>
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
                                className="min-w-0 bg-transparent py-4 pl-3 pr-3 font-sans text-[20px] leading-6 font-light tracking-[-0.01em] text-ink w-full flex-1 placeholder:text-mute/60 focus:outline-none focus-visible:outline-none [&::-webkit-search-cancel-button]:hidden"
                            />
                            <button type="button" onClick={clearAll} aria-label={t("clearSearch")} title={t("clearSearch")} className="group/x -m-2.5 shrink-0 p-2.5">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-bone/30 bg-night text-bone transition-colors group-hover/x:border-bone group-active/x:border-bone">
                                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden><path strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                                </span>
                            </button>
                        </div>
                        <p className="mt-3 font-sans text-[18px] font-light leading-6 text-mute max-lg:text-center" aria-live="polite">
                            {searchQuery.trim() || activeLetter ? t("foundCount", { count: visible }) : t("totalCount", { count: visible })}
                        </p>
                    </div>
                </div>

                <div ref={listTopRef} className="scroll-mt-20" />
                <nav aria-label={t("lettersLabel")} className="z-20 mt-12 border-y border-line bg-paper/90 lg:sticky lg:top-0 lg:backdrop-blur-md">
                    <ul className="flex flex-wrap items-stretch justify-center px-1 pb-1 lg:flex-nowrap lg:justify-start lg:px-3 lg:pb-0">
                        <li className="flex w-full shrink-0 justify-center border-b border-line lg:mr-1 lg:w-auto lg:border-b-0 lg:border-r lg:pr-1">
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
                                        className={`relative h-10 w-8 font-mono text-[13px] transition-colors lg:h-12 lg:w-full ${active ? "text-ink" : count === 0 ? "cursor-default text-line" : "text-mute hover:text-clay"}`}
                                    >
                                        {letter}
                                        {active && <span className="absolute inset-x-2 bottom-0 h-px bg-clay" aria-hidden />}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {visible > 0 ? (
                    <GlossaryList sections={filtered} counts={counts} />
                ) : (
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
