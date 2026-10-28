"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { m, useReducedMotion } from "framer-motion";
import PageHeader from "@/components/studio/PageHeader";
import { MascotDuo } from "@/components/mascots/Mascots";
import { EASE_OUT } from "@/components/studio/Reveal";

type Term = {
    key: string;
    term: string;
    definition: string;
    simple_definition: string;
    image_id: string;
    category: string;
};

const ALPHABETS: Record<string, string[]> = {
    tr: "A B C Ç D E F G H I İ J K L M N O Ö P R S Ş T U Ü V Y Z".split(" "),
    en: "A B C D E F G H I J K L M N O P Q R S T U V W X Y Z".split(" "),
};

const pad = (n: number, width = 2) => n.toString().padStart(width, "0");

const initialOf = (term: string, locale: string) => term.trim().charAt(0).toLocaleUpperCase(locale);

export default function GlossaryContent() {
    const t = useTranslations("glossary");
    const tm = useTranslations("studio.mascots");
    const locale = useLocale();
    const reduce = useReducedMotion();
    const uid = useId();
    const listTopRef = useRef<HTMLDivElement>(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [activeLetter, setActiveLetter] = useState<string | null>(null);

    const [debouncedSearch, setDebouncedSearch] = useState("");
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);


    const allTerms = useMemo(() => {
        const raw = (t.raw("terms") as unknown as Term[]) || [];
        return [...raw].sort((a, b) => a.term.localeCompare(b.term, locale, { sensitivity: "base" }));
    }, [t, locale]);

    const letterCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        for (const term of allTerms) {
            const l = initialOf(term.term, locale);
            counts[l] = (counts[l] || 0) + 1;
        }
        return counts;
    }, [allTerms, locale]);

    const alphabet = useMemo(() => {
        const base = ALPHABETS[locale] ?? ALPHABETS.en;
        const extra = Object.keys(letterCounts).filter((l) => !base.includes(l)).sort((a, b) => a.localeCompare(b, locale));
        return [...base, ...extra];
    }, [letterCounts, locale]);

    const filteredTerms = useMemo(() => {
        const byLetter = activeLetter ? allTerms.filter((term) => initialOf(term.term, locale) === activeLetter) : allTerms;
        if (!searchQuery.trim()) return byLetter; 
        if (!debouncedSearch.trim()) return byLetter; 
        const query = debouncedSearch.toLocaleLowerCase(locale);
        return byLetter.filter(
            (term) =>
                term.term.toLocaleLowerCase(locale).includes(query) ||
                term.simple_definition.toLocaleLowerCase(locale).includes(query) ||
                term.definition.toLocaleLowerCase(locale).includes(query)
        );
    }, [searchQuery, debouncedSearch, allTerms, activeLetter, locale]);

    const sections = useMemo(() => {
        const groups: { letter: string; items: Term[] }[] = [];
        for (const term of filteredTerms) {
            const l = initialOf(term.term, locale);
            const last = groups[groups.length - 1];
            if (last && last.letter === l) last.items.push(term);
            else groups.push({ letter: l, items: [term] });
        }
        return groups;
    }, [filteredTerms, locale]);

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

    const usedLetters = Object.keys(letterCounts).length;

    return (
        <div className="relative text-ink">
            <PageHeader
                index="07"
                label={t("label")}
                titleLines={[t("titleLine1"), <em key="accent">{t("titleLine2")}</em>]}
                intro={t("subtitle")}
                meta={[
                    { label: t("metaTerms"), value: <span className="font-mono tabular-nums">{allTerms.length}</span> },
                    { label: t("metaLetters"), value: <span className="font-mono tabular-nums">{pad(usedLetters)}</span> },
                    { label: t("metaLanguage"), value: t("metaLanguageValue") },
                ]}
            />

            <section className="mx-auto mt-20 max-w-[2560px] px-4 pb-28 sm:px-8 lg:mt-28 lg:px-12 lg:pb-40">
                <div className="grid grid-cols-1 gap-x-8 gap-y-6 border-t border-line pt-10 lg:grid-cols-12">
                    <div className="flex items-end justify-between gap-6 lg:col-span-3 lg:flex-col lg:items-start lg:justify-start">
                        <label htmlFor={`${uid}-search`} className="eyebrow text-mute lg:pt-5">
                            {t("searchLabel")}
                        </label>
                        <MascotDuo
                            pose={filteredTerms.length === 0 ? "think" : "wave"}
                            size="sm"
                            message={filteredTerms.length === 0 ? tm("glossaryEmpty") : tm("glossary")}
                        />
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
                            {t("foundCount", { count: filteredTerms.length })}
                        </p>
                    </div>
                </div>

                <div ref={listTopRef} className="scroll-mt-20" />
                <nav
                    aria-label={t("lettersLabel")}
                    className="sticky top-0 z-20 -mx-4 mt-12 border-y border-line bg-paper/90 backdrop-blur-md sm:-mx-8 lg:mx-0"
                >
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
                            const count = letterCounts[letter] || 0;
                            const active = activeLetter === letter;
                            return (
                                <li key={letter} className="shrink-0 lg:min-w-0 lg:flex-1 lg:shrink">
                                    <button
                                        type="button"
                                        onClick={() => selectLetter(letter)}
                                        disabled={count === 0}
                                        aria-pressed={active}
                                        aria-label={`${t("showLetter", { letter })} (${count})`}
                                        className={`relative h-12 w-10 font-mono text-[13px] transition-colors lg:w-full ${active
                                            ? "text-ink"
                                            : count === 0
                                                ? "cursor-default text-line"
                                                : "text-mute hover:text-clay"
                                            }`}
                                    >
                                        {letter}
                                        {active && <span className="absolute inset-x-2 bottom-0 h-px bg-clay" aria-hidden />}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {filteredTerms.length > 0 ? (
                    <div className="mt-4">
                        {sections.map((section) => (
                            <section key={section.letter} aria-labelledby={`${uid}-letter-${section.letter}`} className="pt-16 sm:pt-24">
                                <div className="grid grid-cols-1 items-end gap-x-8 border-b border-ink pb-4 lg:grid-cols-12">
                                    <h2
                                        id={`${uid}-letter-${section.letter}`}
                                        className="font-serif text-[clamp(5rem,12vw,10rem)] font-normal leading-[0.8] tracking-normal text-ink lg:col-span-3"
                                    >
                                        {section.letter}
                                    </h2>
                                    <p className="mt-4 font-mono text-[12px] uppercase tracking-[0.14em] tabular-nums text-mute lg:col-span-9 lg:mt-0 lg:text-right">
                                        {pad(letterCounts[section.letter] || 0, 3)}
                                    </p>
                                </div>
                                <ul>
                                    {section.items.map((item, i) => (
                                            <li
                                                key={item.key}
                                                id={item.key}
                                                className="group grid scroll-mt-28 grid-cols-1 gap-x-8 gap-y-3 border-b border-line py-7 [contain-intrinsic-size:auto_220px] [content-visibility:auto] sm:py-9 lg:grid-cols-12"
                                            >
                                                <h3 className="min-w-0 lg:col-span-4">
                                                    <span className="block break-words font-sans text-[clamp(1.5rem,2.6vw,2.25rem)] font-light leading-[1.1] tracking-[-0.025em] text-ink transition-colors group-hover:text-clay">
                                                        <span className="mr-[0.04em] font-serif font-normal italic tracking-normal">{item.term.charAt(0)}</span>
                                                        {item.term.slice(1)}
                                                    </span>
                                                </h3>
                                                <div className="min-w-0 lg:col-span-6">
                                                    <p className="text-[17px] leading-relaxed text-ink">{item.simple_definition}</p>
                                                    <p className="mt-3 max-w-prose text-[15px] leading-relaxed text-mute">{item.definition}</p>
                                                </div>
                                                <p className="order-first font-mono text-[12px] uppercase tracking-[0.14em] text-mute lg:order-none lg:col-span-2 lg:pt-2 lg:text-right">
                                                    {item.category || `${section.letter}.${pad(i + 1)}`}
                                                </p>
                                            </li>
                                    ))}
                                </ul>
                            </section>
                        ))}
                    </div>
                ) : (
                    <m.div
                        initial={reduce ? false : { opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: EASE_OUT }}
                        className="grid grid-cols-1 gap-x-8 gap-y-8 border-b border-line py-20 sm:py-28 lg:grid-cols-12"
                    >
                        <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-mute lg:col-span-3">
                            {pad(0, 3)} / {allTerms.length}
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
                                    {t("totalTerms")} · <span className="tabular-nums text-ink">{allTerms.length}</span>
                                </span>
                            </div>
                        </div>
                    </m.div>
                )}
            </section>
        </div>
    );
}
