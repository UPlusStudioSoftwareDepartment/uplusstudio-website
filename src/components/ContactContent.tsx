"use client";

import CompanyLocation from "@/components/CompanyLocation";
import StudioClock from "@/components/studio/StudioClock";
import GoogleRating from "@/components/studio/GoogleRating";
import { MascotDuo } from "@/components/mascots/Mascots";
import PageHeader from "@/components/studio/PageHeader";
import { Eyebrow, FadeUp } from "@/components/studio/Reveal";
import { useLocale, useTranslations } from "next-intl";
import { contact_en } from "@/app/[locale]/contact/locales/en_US";
import { contact_tr } from "@/app/[locale]/contact/locales/tr_TR";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getContactSchema, type ContactFormValues } from "@/lib/validations";
import { useState, useEffect, type ReactNode } from "react";
import { useToast } from "@/contexts/ToastContext";
import { useAppointment } from "@/contexts/AppointmentContext";
import { useSearchParams } from "next/navigation";
import { studioInfo } from "@/lib/studio-info";

const CONTAINER = "mx-auto max-w-[2560px] px-4 sm:px-8 lg:px-12";
const INPUT =
    "w-full rounded-none border-0 border-b border-line bg-transparent px-0 py-3 text-[clamp(1.125rem,1.6vw,1.375rem)] font-light leading-normal text-ink transition-[border-color,box-shadow] duration-300 placeholder:text-mute/50 hover:border-mute focus:border-ink focus:shadow-[0_1px_0_0_var(--color-ink)] focus:outline-none focus-visible:outline-none! aria-[invalid=true]:border-clay";

interface FieldProps {
    id: string;
    index: string;
    label: string;
    error?: string;
    children: ReactNode;
}

function Field({ id, index, label, error, children }: Readonly<FieldProps>) {
    return (
        <div className="grid gap-2">
            <label htmlFor={id} className="flex items-baseline gap-3 font-mono text-[12px] uppercase tracking-[0.14em] text-mute">
                <span className="tabular-nums text-ink/40">{index}</span>
                {label}
            </label>
            {children}
            {error && (
                <p id={`${id}-error`} role="alert" className="font-mono text-[12px] tracking-[0.04em] text-clay">
                    {error}
                </p>
            )}
        </div>
    );
}

interface DetailRowProps {
    label: string;
    href: string;
    external?: boolean;
    children: ReactNode;
}

function DetailRow({ label, href, external, children }: Readonly<DetailRowProps>) {
    return (
        <div className="border-b border-line py-6 sm:py-8">
            <dt className="font-mono text-[12px] uppercase tracking-[0.14em] text-mute">{label}</dt>
            <dd className="mt-3">
                <a
                    href={href}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group inline-flex items-start gap-4 break-words text-[clamp(1.375rem,2.4vw,2.25rem)] font-light leading-[1.15] tracking-[-0.02em] text-ink transition-colors duration-300 hover:text-clay"
                >
                    <span className="min-w-0">{children}</span>
                    <span
                        aria-hidden
                        className="mt-[0.2em] shrink-0 text-[0.6em] text-mute transition-[transform,color] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-clay"
                    >
                        ↗
                    </span>
                </a>
            </dd>
        </div>
    );
}

export default function ContactContent() {
    const t = useTranslations("contact");
    const tm = useTranslations("studio.mascots");
    const copy = useLocale() === "en" ? contact_en : contact_tr;
    const toast = useToast();
    const { openAppointment } = useAppointment();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const searchParams = useSearchParams();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue
    } = useForm<ContactFormValues>({
        resolver: zodResolver(getContactSchema(t)),
    });

    useEffect(() => {
        const project = searchParams.get("project");
        const type = searchParams.get("type");
        if (project && type) {
            setValue("subject", `${project} - ${type}`);
        }
    }, [searchParams, setValue]);

    const onSubmit = async (data: ContactFormValues) => {
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const json = await res.json().catch(() => ({}));
            if (!res.ok) {
                const apiError = (json?.error as string) || "Gönderilemedi";
                const message = apiError === "Email service not configured"
                    ? t("errorNotConfigured")
                    : t("error");
                toast.error(message);
                return;
            }
            reset();
            toast.success(t("success"));
        } catch {
            toast.error(t("error"));
        } finally {
            setIsSubmitting(false);
        }
    };

    const nameError = errors.name ? t("nameError") : undefined;
    const emailError = errors.email?.message;
    const subjectError = errors.subject ? t("subjectError") : undefined;
    const messageError = errors.message?.message;

    return (
        <div className="relative text-ink">
            <PageHeader
                index="05"
                label={t("title")}
                titleLines={[copy.header.line1, <em key="accent">{copy.header.accent}</em>]}
                intro={<p>{copy.header.intro}</p>}
            />

            <section className={`${CONTAINER} pb-28 pt-20 sm:pb-40 sm:pt-28`} aria-label={t("heading")}>
                <div className="grid grid-cols-1 gap-20 border-t border-line pt-14 lg:grid-cols-12 lg:gap-8">
                    <FadeUp className="lg:col-span-5">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <Eyebrow>{t("getInTouch")}</Eyebrow>
                            <StudioClock className="text-mute" />
                        </div>
                        <dl className="mt-8 border-t border-line">
                            <DetailRow label={t("email")} href={`mailto:${studioInfo.email}`}>
                                {studioInfo.email}
                            </DetailRow>
                            <DetailRow label={t("phone")} href={studioInfo.phoneHref}>
                                {studioInfo.phoneDisplay}
                            </DetailRow>
                            <DetailRow label={t("address")} href={studioInfo.mapsUrl} external>
                                {t("addressText")}
                            </DetailRow>
                            <DetailRow label={copy.instagram} href={studioInfo.instagramUrl} external>
                                {studioInfo.instagramHandle}
                            </DetailRow>
                        </dl>

                        <GoogleRating className="mt-8 text-ink" />

                        <div className="mt-10 flex flex-col items-center gap-6 rounded-[3px] border border-line bg-paper-2/40 p-6 text-center sm:flex-row sm:items-center sm:gap-8 sm:p-8 sm:text-left">
                            <MascotDuo pose="wave" size="sm" className="shrink-0" />
                            <div className="min-w-0 flex-1">
                                <p className="font-serif text-[clamp(1.2rem,1.6vw,1.45rem)] italic leading-snug text-ink">{tm("hello")}</p>
                                <p className="mt-2 text-[15px] leading-relaxed text-mute">{copy.appointment.prompt}</p>
                                <button
                                    type="button"
                                    onClick={openAppointment}
                                    className="group mt-6 inline-flex min-h-12 w-full items-center justify-between gap-6 rounded-[3px] border border-ink/50 bg-transparent px-6 font-mono text-[12px] uppercase tracking-[0.12em] text-ink transition-colors hover:border-bone hover:bg-night hover:text-bone sm:w-auto"
                                >
                                    {copy.appointment.button}
                                    <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                                </button>
                            </div>
                        </div>
                    </FadeUp>

                    <FadeUp className="lg:col-span-6 lg:col-start-7" delay={0.15}>
                        <Eyebrow>{copy.formLabel}</Eyebrow>
                        <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-10" noValidate>
                            <Field id="name" index="01" label={t("name")} error={nameError}>
                                <input
                                    {...register("name")}
                                    type="text"
                                    id="name"
                                    autoComplete="name"
                                    aria-invalid={nameError ? "true" : "false"}
                                    aria-describedby={nameError ? "name-error" : undefined}
                                    className={INPUT}
                                />
                            </Field>

                            <Field id="email" index="02" label={t("email")} error={emailError}>
                                <input
                                    {...register("email")}
                                    type="email"
                                    id="email"
                                    autoComplete="email"
                                    inputMode="email"
                                    aria-invalid={emailError ? "true" : "false"}
                                    aria-describedby={emailError ? "email-error" : undefined}
                                    className={INPUT}
                                />
                            </Field>

                            <Field id="subject" index="03" label={t("subject")} error={subjectError}>
                                <input
                                    {...register("subject")}
                                    type="text"
                                    id="subject"
                                    aria-invalid={subjectError ? "true" : "false"}
                                    aria-describedby={subjectError ? "subject-error" : undefined}
                                    className={INPUT}
                                />
                            </Field>

                            <Field id="message" index="04" label={t("message")} error={messageError}>
                                <textarea
                                    {...register("message")}
                                    id="message"
                                    rows={5}
                                    aria-invalid={messageError ? "true" : "false"}
                                    aria-describedby={messageError ? "message-error" : undefined}
                                    className={`${INPUT} resize-none`}
                                />
                            </Field>

                            <div className="flex flex-col gap-6 pt-4 sm:flex-row sm:items-center sm:justify-between">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    aria-busy={isSubmitting}
                                    className="group inline-flex w-full items-center justify-between gap-12 border border-ink bg-transparent px-7 py-5 text-[15px] text-ink transition-colors duration-300 hover:border-bone hover:bg-night hover:text-bone disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-night sm:w-auto"
                                >
                                    {isSubmitting ? t("sending") || "Gönderiliyor..." : t("send")}
                                    <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                                </button>
                                <a
                                    href={`mailto:${studioInfo.email}`}
                                    className="font-mono text-[12px] uppercase tracking-[0.14em] text-mute transition-colors hover:text-clay"
                                >
                                    {studioInfo.email}
                                </a>
                            </div>
                        </form>
                    </FadeUp>
                </div>
            </section>

            <section className={`${CONTAINER} pb-28 sm:pb-40`} aria-labelledby="contact-map">
                <div className="flex flex-col gap-6 border-t border-line pt-14 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <Eyebrow>{t("findUs")}</Eyebrow>
                        <h2 id="contact-map" className="mt-6 max-w-xl font-sans text-[clamp(1.5rem,2.6vw,2.5rem)] font-light leading-[1.1] tracking-[-0.02em]">
                            {t("addressText")}
                        </h2>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-8 gap-y-3 self-start sm:self-auto">
                        <a href={studioInfo.mapsUrl} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-3 border-b border-ink/40 pb-1 text-[15px] transition-colors hover:border-clay hover:text-clay">
                            Google Maps
                            <span aria-hidden className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
                        </a>
                        <a href={studioInfo.yandexMapsUrl} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-3 border-b border-ink/40 pb-1 text-[15px] transition-colors hover:border-clay hover:text-clay">
                            Yandex Maps
                            <span aria-hidden className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
                        </a>
                    </div>
                </div>
                <FadeUp className="mt-10">
                    <CompanyLocation size="xl" directionsLabel={copy.directions} title={`U+ Studio — ${t("findUs")}`} />
                </FadeUp>
            </section>
        </div>
    );
}
