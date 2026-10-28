"use client";

import Link from "next/link";
import CompanyLocation from "@/components/CompanyLocation";
import StudioClock from "@/components/studio/StudioClock";
import GoogleRating from "@/components/studio/GoogleRating";
import { MascotDuo } from "@/components/mascots/Mascots";
import PageHeader from "@/components/studio/PageHeader";
import { Eyebrow, FadeUp } from "@/components/studio/Reveal";
import { icons } from "@/components/studio/SocialLinks";
import Select from "@/components/studio/Select";
import { useLocale, useTranslations } from "next-intl";
import { contact_en } from "@/app/[locale]/contact/locales/en_US";
import { contact_tr } from "@/app/[locale]/contact/locales/tr_TR";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getContactSchema, type ContactFormValues } from "@/lib/validations";
import { useMemo, useState, type ReactNode } from "react";
import { useToast } from "@/contexts/ToastContext";
import { useAppointment } from "@/contexts/AppointmentContext";
import { studioInfo } from "@/lib/studio-info";
import { APPOINTMENT_SERVICES } from "@/lib/services";
import { buildContactEmail } from "@/lib/contactEmail";
import { type ComposedMail, followLink, gmailAppUrl, mailPlatform, mailtoUrl, openGmail, openUrl } from "@/lib/gmailCompose";

const CONTAINER = "mx-auto max-w-[2560px] px-4 sm:px-8 lg:px-12";
const INPUT =
    "w-full rounded-none border-0 border-b border-line bg-transparent px-0 py-3 text-[clamp(1.125rem,1.6vw,1.375rem)] font-light leading-normal text-ink transition-[border-color,box-shadow] duration-300 placeholder:text-mute/50 hover:border-mute focus:border-ink focus:shadow-[0_1px_0_0_var(--color-ink)] focus:outline-none focus-visible:outline-none! aria-[invalid=true]:border-clay";
const ACTION =
    "inline-flex min-h-12 items-center justify-center gap-2 rounded-[3px] border px-5 font-mono text-[12px] uppercase tracking-[0.12em] transition-colors";

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
                <span aria-hidden className="text-clay">*</span>
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
                    className="group inline-flex items-start gap-4 break-words text-[clamp(1.125rem,1.6vw,1.5rem)] font-light leading-[1.15] tracking-[-0.02em] text-ink transition-colors duration-300 hover:text-clay"
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

interface Sent {
    mail: ComposedMail | null;
    mailLinks: { label: string; href: string }[];
    opened: boolean;
}

type ContactReply = { sent: true } | ({ sent: false } & Omit<ComposedMail, "to">);

const DELIVERED: Sent = { mail: null, mailLinks: [], opened: true };
const EMPTY: ContactFormValues = { name: "", email: "", phone: "", subject: "", message: "" };

function typedBeforeHydration(): ContactFormValues {
    if (typeof document === "undefined") return EMPTY;
    const typed = (id: string) => document.querySelector<HTMLInputElement | HTMLTextAreaElement>(`#${id}`)?.value ?? "";
    return { ...EMPTY, name: typed("name"), email: typed("email"), phone: typed("phone"), message: typed("message") };
}

export default function ContactContent() {
    const t = useTranslations("contact");
    const ta = useTranslations("appointment");
    const tm = useTranslations("studio.mascots");
    const locale = useLocale();
    const copy = locale === "en" ? contact_en : contact_tr;
    const toast = useToast();
    const { openAppointment } = useAppointment();
    const [sent, setSent] = useState<Sent | null>(null);
    const [typed] = useState(typedBeforeHydration);
    const subjects = useMemo(() => [...APPOINTMENT_SERVICES.map((key) => ta(`services.${key}`)), t("subjectOther")], [ta, t]);

    const {
        register,
        control,
        handleSubmit,
        trigger,
        getValues,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ContactFormValues>({
        resolver: zodResolver(getContactSchema(t)),
        defaultValues: typed,
    });

    const requestMail = async (data: ContactFormValues) => {
        const res = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...data, locale }),
        });
        if (!res.ok) throw new Error(`contact ${res.status}`);
        return (await res.json()) as ContactReply;
    };

    const onSubmit = async (data: ContactFormValues) => {
        const platform = mailPlatform();
        try {
            const reply = await requestMail(data);
            if (reply.sent) {
                setSent(DELIVERED);
                return;
            }
            const mail = { to: studioInfo.formInbox, subject: reply.subject, text: reply.text };
            if (platform === "desktop") {
                setSent({ mail, mailLinks: [], opened: openGmail(mail) });
                return;
            }
            const mailto = mailtoUrl(mail);
            const mailLinks =
                platform === "ios"
                    ? [
                          { label: t("openGmailApp"), href: gmailAppUrl(mail) },
                          { label: t("openMailApp"), href: mailto },
                      ]
                    : [{ label: t("openGmailApp"), href: mailto }];
            setSent({ mail, mailLinks, opened: true });
            globalThis.location.assign(mailto);
        } catch {
            toast.error(t("error"));
        }
    };

    const reopenGmail = () => {
        if (sent?.mail) setSent({ ...sent, opened: openGmail(sent.mail) });
    };

    const sendViaWhatsApp = async () => {
        if (!(await trigger())) return;
        const { text } = buildContactEmail({ ...getValues(), locale: locale === "en" ? "en" : "tr" }, { markup: true });
        const url = `${studioInfo.whatsappUrl}?text=${encodeURIComponent(text)}`;
        if (mailPlatform() === "desktop") openUrl(url);
        else followLink(url);
    };

    const startOver = () => {
        reset(EMPTY);
        setSent(null);
    };

    const status = !sent
        ? ""
        : !sent.mail
          ? t("successSent")
          : sent.mailLinks.length
          ? t("successMobile")
          : !sent.opened
            ? t("successRetry")
            : t("successText");

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
                    <FadeUp className="lg:col-span-6 lg:col-start-7 lg:row-start-1" delay={0.15}>
                        <Eyebrow>{copy.formLabel}</Eyebrow>
                        {sent ? (
                            <div className="mt-10 flex flex-col items-start gap-6 rounded-[3px] border border-line bg-paper-2/40 p-6 sm:p-8" role="status">
                                <MascotDuo pose="cheer" size="sm" />
                                <p className="max-w-lg text-[17px] leading-relaxed text-ink/90">{status}</p>
                                <div className="flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap">
                                    {sent.mailLinks.map((m, i) => (
                                        <a
                                            key={m.href}
                                            href={m.href}
                                            className={`${ACTION} ${i === 0 ? "border-bone bg-bone text-night hover:bg-transparent hover:text-bone" : "border-bone/60 text-ink hover:border-bone hover:bg-night"}`}
                                        >
                                            {icons.email}
                                            {m.label}
                                        </a>
                                    ))}
                                    {sent.mail && !sent.mailLinks.length && (
                                        <button
                                            type="button"
                                            onClick={reopenGmail}
                                            className={`${ACTION} ${sent.opened ? "border-bone/60 text-ink hover:border-bone hover:bg-night" : "border-bone bg-bone text-night hover:bg-transparent hover:text-bone"}`}
                                        >
                                            {icons.email}
                                            {t("openGmail")}
                                        </button>
                                    )}
                                    <button type="button" onClick={startOver} className={`${ACTION} border-line text-mute hover:border-ink hover:text-ink`}>
                                        {t("newMessage")}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-10" noValidate>
                                <Field id="name" index="01" label={t("name")} error={errors.name?.message}>
                                    <input
                                        {...register("name")}
                                        type="text"
                                        id="name"
                                        autoComplete="name"
                                        required
                                        aria-invalid={errors.name ? "true" : "false"}
                                        aria-describedby={errors.name ? "name-error" : undefined}
                                        className={INPUT}
                                    />
                                </Field>

                                <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-8">
                                    <Field id="email" index="02" label={t("email")} error={errors.email?.message}>
                                        <input
                                            {...register("email")}
                                            type="email"
                                            id="email"
                                            autoComplete="email"
                                            inputMode="email"
                                            required
                                            aria-invalid={errors.email ? "true" : "false"}
                                            aria-describedby={errors.email ? "email-error" : undefined}
                                            className={INPUT}
                                        />
                                    </Field>

                                    <Field id="phone" index="03" label={t("phone")} error={errors.phone?.message}>
                                        <input
                                            {...register("phone")}
                                            type="tel"
                                            id="phone"
                                            autoComplete="tel"
                                            inputMode="tel"
                                            required
                                            placeholder={ta("phonePlaceholder")}
                                            aria-invalid={errors.phone ? "true" : "false"}
                                            aria-describedby={errors.phone ? "phone-error" : undefined}
                                            className={INPUT}
                                        />
                                    </Field>
                                </div>

                                <Field id="subject" index="04" label={t("subject")} error={errors.subject?.message}>
                                    <Controller
                                        name="subject"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                id="subject"
                                                value={field.value}
                                                options={subjects}
                                                placeholder={t("selectSubject")}
                                                invalid={Boolean(errors.subject)}
                                                describedBy={errors.subject ? "subject-error" : undefined}
                                                onChange={field.onChange}
                                                onBlur={field.onBlur}
                                                className={INPUT}
                                            />
                                        )}
                                    />
                                </Field>

                                <Field id="message" index="05" label={t("message")} error={errors.message?.message}>
                                    <textarea
                                        {...register("message")}
                                        id="message"
                                        rows={5}
                                        maxLength={2000}
                                        required
                                        aria-invalid={errors.message ? "true" : "false"}
                                        aria-describedby={errors.message ? "message-error" : undefined}
                                        className={`${INPUT} resize-none`}
                                    />
                                </Field>

                                <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:flex-wrap sm:items-center">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        aria-busy={isSubmitting}
                                        className="group inline-flex w-full items-center justify-between gap-12 rounded-[3px] border border-ink bg-transparent px-7 py-5 text-[15px] text-ink transition-colors duration-300 hover:border-bone hover:bg-night hover:text-bone disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                                    >
                                        {isSubmitting ? t("preparing") : t("send")}
                                        <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={sendViaWhatsApp}
                                        className="inline-flex w-full items-center justify-center gap-3 rounded-[3px] border border-line px-7 py-5 text-[15px] text-ink transition-colors duration-300 hover:border-bone hover:bg-night hover:text-bone sm:w-auto"
                                    >
                                        {icons.whatsapp}
                                        WhatsApp
                                    </button>
                                </div>
                            </form>
                        )}
                    </FadeUp>

                    <FadeUp className="lg:col-span-5 lg:col-start-1 lg:row-start-1">
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
                        <Link href={`/${locale}/services/incek-golbasi-mimarlik-ofisi`} className="group inline-flex items-center gap-3 border-b border-ink/40 pb-1 text-[15px] transition-colors hover:border-clay hover:text-clay">
                            {copy.office}
                            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                        </Link>
                    </div>
                </div>
                <FadeUp className="mt-10">
                    <CompanyLocation size="xl" directionsLabel={copy.directions} title={`U+ Studio — ${t("findUs")}`} />
                </FadeUp>
            </section>
        </div>
    );
}
