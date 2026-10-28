"use client";

import { useId, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import PageHeader from "@/components/studio/PageHeader";
import { Eyebrow, FadeUp, LineReveal, MaskReveal, EASE_STUDIO } from "@/components/studio/Reveal";
import { useAppointment } from "@/contexts/AppointmentContext";
import { MascotDuo } from "@/components/mascots/Mascots";

type Question = {
    q: string;
    a: string;
};

type Row = Question & { key: string; category: string };

const categoryIds = [
    "architectural",
    "interior",
    "adaptive_reuse",
    "turnkey",
    "implementation",
    "project_management",
    "visualization",
    "process",
];

const fallbackLabels: Record<string, { tr: string; en: string }> = {
    architectural: { tr: "Mimari Tasarım", en: "Architectural Design" },
    interior: { tr: "İç Mekân Tasarımı", en: "Interior Design" },
    adaptive_reuse: { tr: "Yeniden İşlevlendirme", en: "Adaptive Reuse" },
    turnkey: { tr: "Anahtar Teslim Projeler", en: "Turnkey Projects" },
    implementation: { tr: "Uygulama Projeleri", en: "Implementation Projects" },
    project_management: { tr: "Proje Yönetimi", en: "Project Management" },
    visualization: { tr: "3D Görselleştirme", en: "3D Visualization" },
    process: { tr: "Süreç & Ödemeler", en: "Process & Payment" },
};

const pad = (n: number) => n.toString().padStart(2, "0");

function PlusMinus({ open }: Readonly<{ open: boolean }>) {
    return (
        <span className="relative block h-4 w-4 shrink-0" aria-hidden>
            <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
            <span
                className={`absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${open ? "rotate-90" : "rotate-0"}`}
            />
        </span>
    );
}

function keepInPlace(el: HTMLElement | null, durationMs = 750) {
    if (!el) return;
    const startTop = el.getBoundingClientRect().top;
    const t0 = performance.now();
    const step = () => {
        const drift = el.getBoundingClientRect().top - startTop;
        if (Math.abs(drift) > 0.5) globalThis.scrollTo({ top: globalThis.scrollY + drift, behavior: "instant" as ScrollBehavior });
        if (performance.now() - t0 < durationMs) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
}

interface QuestionListProps {
    rows: Row[];
    openKey: string | null;
    setOpenKey: (key: string | null) => void;
    uid: string;
    showCategory?: boolean;
    getLabel: (id: string) => string;
}

function QuestionList({ rows, openKey, setOpenKey, uid, showCategory = false, getLabel }: Readonly<QuestionListProps>) {
    const reduce = useReducedMotion();
    return (
        <ul>
            {rows.map((item, index) => {
                const open = openKey === item.key;
                const panelId = `${uid}-panel-${item.key}`;
                const buttonId = `${uid}-button-${item.key}`;
                return (
                    <li key={item.key} className="border-b border-line last:border-b-0">
                        <h3>
                            <button
                                id={buttonId}
                                type="button"
                                onClick={(e) => {
                                    keepInPlace(e.currentTarget);
                                    setOpenKey(open ? null : item.key);
                                }}
                                aria-expanded={open}
                                aria-controls={panelId}
                                className="group grid w-full grid-cols-[2rem_1fr_auto] items-start gap-x-3 py-5 text-left sm:grid-cols-[3rem_1fr_auto] sm:py-6"
                            >
                                <span className={`pt-[0.3em] font-mono text-[12px] tabular-nums transition-colors ${open ? "text-clay" : "text-mute"}`}>
                                    {pad(index + 1)}
                                </span>
                                <span className="min-w-0">
                                    {showCategory && <span className="eyebrow mb-2 block text-mute">{getLabel(item.category)}</span>}
                                    <span className={`block text-[17px] leading-snug transition-colors sm:text-[19px] ${open ? "text-ink" : "text-ink/90 group-hover:text-clay"}`}>
                                        {item.q}
                                    </span>
                                </span>
                                <span className={`mt-[0.35em] transition-colors ${open ? "text-clay" : "text-mute group-hover:text-clay"}`}>
                                    <PlusMinus open={open} />
                                </span>
                            </button>
                        </h3>
                        <AnimatePresence initial={false}>
                            {open && (
                                <m.div
                                    id={panelId}
                                    role="region"
                                    aria-labelledby={buttonId}
                                    initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                                    animate={reduce ? { opacity: 1 } : { height: "auto", opacity: 1 }}
                                    exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                                    transition={{ duration: 0.45, ease: EASE_STUDIO }}
                                    className="overflow-hidden"
                                >
                                    <p className="max-w-[65ch] pb-6 pl-[calc(2rem+0.75rem)] text-[16px] leading-relaxed text-mute sm:pl-[calc(3rem+0.75rem)] sm:text-[17px]">
                                        {item.a}
                                    </p>
                                </m.div>
                            )}
                        </AnimatePresence>
                    </li>
                );
            })}
        </ul>
    );
}

export default function FAQContent() {
    const t = useTranslations("faq");
    const lang = useLocale() as "tr" | "en";
    const tUi = useTranslations(lang === "en" ? "faq_en" : "faq");
    const pick = (key: string) => (t.has(key) ? t : tUi);
    const ui = (key: string, values?: Record<string, string | number>) => pick(key)(key, values);
    const uiRich = (key: string, values: Parameters<typeof t.rich>[1]) => pick(key).rich(key, values);
    const reduce = useReducedMotion();
    const { openAppointment } = useAppointment();
    const tm = useTranslations("studio.mascots");
    const uid = useId();

    const [activeCategory, setActiveCategory] = useState("");
    const [openKey, setOpenKey] = useState<string | null>(null);
    const [query, setQuery] = useState("");

    const getLabel = (id: string) => {
        const translated = t(`categories.${id}`);
        if (translated === `categories.${id}` || translated.includes("categories.")) {
            return fallbackLabels[id]?.[lang] || fallbackLabels[id]?.tr || id;
        }
        return translated;
    };

    const byCategory = useMemo(() => {
        const map: Record<string, Question[]> = {};
        for (const id of categoryIds) {
            const raw = t.raw(`questions.${id}`) as unknown;
            map[id] = Array.isArray(raw) ? (raw as Question[]) : [];
        }
        return map;
    }, [t]);

    const totalQuestions = useMemo(
        () => categoryIds.reduce((sum, id) => sum + byCategory[id].length, 0),
        [byCategory]
    );

    const trimmed = query.trim().toLocaleLowerCase(lang);
    const searching = trimmed.length > 0;

    const rows: Row[] = useMemo(() => {
        if (!searching) return [];
        return categoryIds.flatMap((id) =>
            byCategory[id]
                .map((item, i) => ({ ...item, category: id, key: `${id}-${i}` }))
                .filter(
                    (item) =>
                        item.q.toLocaleLowerCase(lang).includes(trimmed) ||
                        item.a.toLocaleLowerCase(lang).includes(trimmed)
                )
        );
    }, [searching, byCategory, trimmed, lang]);


    return (
        <div className="relative text-ink">
            <PageHeader
                index="06"
                label={ui("label")}
                titleLines={[ui("titleLine1"), <em key="accent">{ui("titleLine2")}</em>]}
                intro={t("subtitle")}
                meta={[
                    { label: ui("metaQuestions"), value: <span className="font-mono tabular-nums">{pad(totalQuestions)}</span> },
                    { label: ui("metaCategories"), value: <span className="font-mono tabular-nums">{pad(categoryIds.length)}</span> },
                    { label: ui("metaOffice"), value: ui("metaOfficeValue") },
                ]}
            />

            <section className="mx-auto max-w-[2560px] px-4 pb-28 pt-16 [overflow-anchor:none] sm:px-8 lg:px-12 lg:pb-40 lg:pt-24">
                <div role="search">
                    <label htmlFor={`${uid}-search`} className="eyebrow block text-mute">
                        {ui("searchLabel")}
                    </label>
                    <div className="group relative mt-4 flex items-center border-b border-field focus-within:border-ink">
                        <svg className="h-5 w-5 shrink-0 text-mute" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1} aria-hidden>
                            <circle cx="7" cy="7" r="5" />
                            <path d="M10.5 10.5 15 15" />
                        </svg>
                        <input
                            id={`${uid}-search`}
                            type="search"
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                setOpenKey(null);
                            }}
                            placeholder={ui("searchPlaceholder")}
                            autoComplete="off"
                            className="w-full min-w-0 bg-transparent py-4 pl-4 pr-2 text-[18px] text-ink placeholder:text-mute/70 [&::-webkit-search-cancel-button]:hidden"
                        />
                        {searching && (
                            <button type="button" onClick={() => setQuery("")} className="eyebrow shrink-0 py-2 text-mute hover:text-clay">
                                {ui("clearSearch")}
                            </button>
                        )}
                    </div>
                    <p className="mt-3 h-4 font-mono text-[12px] tabular-nums text-mute" aria-live="polite">
                        {searching ? ui("resultsCount", { count: rows.length }) : ""}
                    </p>
                </div>

                {searching ? (
                    <div className="mt-10 border-t border-line">
                        {rows.length === 0 ? (
                            <div className="py-16">
                                <p className="font-sans text-3xl font-light tracking-[-0.02em] text-ink">{ui("noResultsTitle")}</p>
                                <p className="mt-4 max-w-prose text-[17px] leading-relaxed text-mute">{ui("noResultsMessage")}</p>
                                <button
                                    type="button"
                                    onClick={() => setQuery("")}
                                    className="mt-8 border-b border-ink pb-1 text-[15px] text-ink hover:border-clay hover:text-clay"
                                >
                                    {ui("clearSearch")}
                                </button>
                            </div>
                        ) : (
                            <QuestionList rows={rows} openKey={openKey} setOpenKey={setOpenKey} uid={uid} showCategory getLabel={getLabel} />
                        )}
                    </div>
                ) : (
                    <ul className="mt-10 border-t border-line">
                        {categoryIds.map((id, i) => {
                            const open = activeCategory === id;
                            const panelId = `${uid}-cat-${id}`;
                            const buttonId = `${uid}-catbtn-${id}`;
                            const items = byCategory[id].map((item, j) => ({ ...item, category: id, key: `${id}-${j}` }));
                            return (
                                <li key={id} className="border-b border-line">
                                    <h2>
                                        <button
                                            id={buttonId}
                                            type="button"
                                            onClick={(e) => {
                                                keepInPlace(e.currentTarget);
                                                setActiveCategory(open ? "" : id);
                                                setOpenKey(null);
                                            }}
                                            aria-expanded={open}
                                            aria-controls={panelId}
                                            className="group flex w-full items-center gap-4 py-6 text-left sm:gap-6 sm:py-8"
                                        >
                                            <span className={`w-8 font-mono text-[12px] tabular-nums transition-colors ${open ? "text-clay" : "text-mute"}`}>
                                                {pad(i + 1)}
                                            </span>
                                            <span
                                                className={`flex-1 font-sans text-[clamp(1.5rem,3.2vw,2.6rem)] font-light leading-[1.1] tracking-[-0.025em] transition-colors ${
                                                    open ? "text-ink" : "text-ink/80 group-hover:text-ink"
                                                }`}
                                            >
                                                {open ? <em className="font-serif font-normal italic tracking-normal">{getLabel(id)}</em> : getLabel(id)}
                                            </span>
                                            <span className="hidden font-mono text-[12px] tabular-nums text-mute sm:inline">
                                                {ui("questionsCount", { count: items.length })}
                                            </span>
                                            <span
                                                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors ${
                                                    open ? "border-clay bg-clay text-night" : "border-field text-ink group-hover:border-ink"
                                                }`}
                                            >
                                                <PlusMinus open={open} />
                                            </span>
                                        </button>
                                    </h2>
                                    <AnimatePresence initial={false}>
                                        {open && (
                                            <m.div
                                                id={panelId}
                                                role="region"
                                                aria-labelledby={buttonId}
                                                initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                                                animate={reduce ? { opacity: 1 } : { height: "auto", opacity: 1 }}
                                                exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                                                transition={{ duration: 0.6, ease: EASE_STUDIO }}
                                                className="overflow-hidden"
                                            >
                                                <div className="mb-8 border border-line bg-paper-2/60 px-4 sm:ml-14 sm:px-8">
                                                    <QuestionList rows={items} openKey={openKey} setOpenKey={setOpenKey} uid={uid} getLabel={getLabel} />
                                                </div>
                                            </m.div>
                                        )}
                                    </AnimatePresence>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </section>

            <section className="relative bg-night text-bone">
                <div className="mx-auto grid max-w-[2560px] grid-cols-1 gap-x-8 gap-y-14 px-4 py-24 sm:px-8 lg:grid-cols-12 lg:px-12 lg:py-36">
                    <div className="flex flex-col justify-between gap-12 lg:col-span-7">
                        <div>
                            <Eyebrow tone="light">{ui("ctaEyebrow")}</Eyebrow>
                            <h2 className="display mt-10 text-[clamp(2.75rem,7vw,7rem)] text-bone [&_em]:font-serif [&_em]:font-normal [&_em]:italic [&_em]:tracking-normal">
                                <LineReveal lines={[uiRich("ctaTitle", { em: (chunks) => <em>{chunks}</em> })]} />
                            </h2>
                        </div>
                        <FadeUp className="max-w-md" delay={0.15}>
                            <MascotDuo pose="think" size="md" message={tm("faq")} className="mb-10" />
                            <p className="text-[17px] leading-relaxed text-bone/65">{ui("ctaText")}</p>
                            <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-6">
                                <button
                                    type="button"
                                    onClick={openAppointment}
                                    className="group inline-flex items-center gap-4 border-b border-bone/40 pb-2 text-lg text-bone hover:border-clay hover:text-clay"
                                >
                                    {ui("ctaButton")}
                                    <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>→</span>
                                </button>
                                <Link
                                    href={`/${lang}/contact`}
                                    className="font-mono text-[12px] uppercase tracking-[0.14em] text-bone/55 hover:text-bone"
                                >
                                    {ui("ctaSecondary")}
                                </Link>
                            </div>
                        </FadeUp>
                    </div>
                    <div className="lg:col-span-4 lg:col-start-9">
                        <MaskReveal className="relative aspect-[4/5] w-full sm:max-w-sm lg:ml-auto lg:max-w-none">
                            <Image
                                src="/media/projects/konut-uygulama/stair-2.jpg"
                                alt={ui("ctaImageAlt")}
                                fill
                                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 24rem, 100vw"
                                className="object-cover"
                            />
                        </MaskReveal>
                    </div>
                </div>
                <div className="mx-auto max-w-[2560px] px-4 sm:px-8 lg:px-12">
                    <div className="h-px bg-bone/10" aria-hidden />
                </div>
            </section>
        </div>
    );
}
