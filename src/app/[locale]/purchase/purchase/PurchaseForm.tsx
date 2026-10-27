'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { FadeUp } from '@/components/studio/Reveal';
import { useAppointment } from '@/contexts/AppointmentContext';
import { purchase_tr } from '../locales/tr_TR';
import { purchase_en } from '../locales/en_US';

const LABEL = 'block font-mono text-[12px] uppercase tracking-[0.14em] text-mute';
const FIELD =
  'mt-3 w-full rounded-none border-0 border-b border-line bg-transparent px-0 py-3 text-[17px] text-ink placeholder:text-mute/60 transition-colors focus:border-ink focus:outline-none focus-visible:outline-none';

export default function PurchaseForm() {
  const locale = useLocale();
  const t = locale === 'en' ? purchase_en : purchase_tr;
  const { openAppointment } = useAppointment();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const required = (
    <span className="ml-1 text-clay" aria-hidden>*</span>
  );

  return (
    <div className="mx-auto mt-20 max-w-[2560px] px-4 sm:mt-28 sm:px-8 lg:px-12">
      <div className="grid grid-cols-1 gap-16 border-t border-line pt-12 lg:grid-cols-12 lg:gap-8 lg:pt-16">
        <FadeUp className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="name" className={LABEL}>
                {t.name}{required}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={FIELD}
              />
            </div>

            <div>
              <label htmlFor="email" className={LABEL}>
                {t.email}{required}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={FIELD}
              />
            </div>

            <div>
              <label htmlFor="phone" className={LABEL}>
                {t.phone}{required}
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                autoComplete="tel"
                value={formData.phone}
                onChange={handleChange}
                required
                className={FIELD}
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="service" className={LABEL}>
                {t.service}{required}
              </label>
              <div className="relative">
                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  required
                  className={`${FIELD} cursor-pointer appearance-none pr-8`}
                >
                  <option value="">{t.selectService}</option>
                  <option value="architectural">{t.form.services.architectural}</option>
                  <option value="interior">{t.form.services.interior}</option>
                  <option value="consulting">{t.form.services.consulting}</option>
                  <option value="projectManagement">{t.form.services.projectManagement}</option>
                  <option value="other">{t.form.services.other}</option>
                </select>
                <span aria-hidden className="pointer-events-none absolute bottom-3.5 right-0 font-mono text-[13px] text-mute">↓</span>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="message" className={LABEL}>
                {t.message}
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className={`${FIELD} resize-y`}
                placeholder={t.messagePlaceholder}
              />
            </div>

            <div className="flex flex-col gap-6 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-mute">
                <span className="text-clay" aria-hidden>*</span> {t.page.required}
              </p>
              <button
                type="submit"
                className="group inline-flex w-full items-center justify-between gap-8 border border-ink bg-transparent px-6 py-4 text-[15px] text-ink hover:border-bone hover:bg-night hover:text-bone sm:w-auto"
              >
                {t.submit}
                <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
              </button>
            </div>
          </form>
        </FadeUp>

        <FadeUp delay={0.1} className="lg:col-span-4 lg:col-start-9">
          <aside className="border border-line bg-paper p-6 sm:p-8" aria-labelledby="purchase-aside-title">
            <h2 id="purchase-aside-title" className="eyebrow text-ink">
              {t.page.asideTitle}
            </h2>
            <ol className="mt-6 border-t border-line">
              {t.page.asideSteps.map((step, i) => (
                <li key={step} className="grid grid-cols-[2.5rem_1fr] gap-2 border-b border-line py-4 text-[15px] leading-relaxed text-ink">
                  <span className="pt-0.5 font-mono text-[12px] tracking-[0.14em] text-mute">{String(i + 1).padStart(2, '0')}</span>
                  {step}
                </li>
              ))}
            </ol>
            <div className="mt-8 flex flex-col items-start gap-4">
              <button
                type="button"
                onClick={openAppointment}
                className="group inline-flex items-center gap-3 border-b border-ink pb-1 text-[15px] text-ink hover:border-clay hover:text-clay"
              >
                {t.page.consult}
                <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
              </button>
              <Link
                href={`/${locale}/services`}
                className="group inline-flex items-center gap-3 text-[15px] text-mute hover:text-clay"
              >
                {t.page.packagesLink}
                <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
            <dl className="mt-10 border-t border-line pt-5">
              <dt className="eyebrow text-mute">{t.page.studio}</dt>
              <dd className="mt-2 text-[15px] text-ink">{t.page.studioValue}</dd>
            </dl>
          </aside>
        </FadeUp>
      </div>
    </div>
  );
}
