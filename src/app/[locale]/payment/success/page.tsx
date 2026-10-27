'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { MascotDuo } from "@/components/mascots/Mascots";
import PageHeader from '@/components/studio/PageHeader';
import { FadeUp } from '@/components/studio/Reveal';
import { purchase_tr } from '../../purchase/locales/tr_TR';
import { purchase_en } from '../../purchase/locales/en_US';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const locale = useLocale();
  const tm = useTranslations("studio.mascots");
  const copy = (locale === 'en' ? purchase_en : purchase_tr).payment.success;

  const [order, setOrder] = useState<{ number: string; date: string } | null>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() =>
      setOrder({
        number: `#UP-2024-${Math.floor(Math.random() * 10000)}`,
        date: new Date().toLocaleDateString(locale === 'en' ? 'en-GB' : 'tr-TR'),
      })
    );
    return () => cancelAnimationFrame(frame);
  }, [locale]);

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  const handleBackToHome = () => {
    router.push('/');
  };

  const rows = [
    { label: copy.orderNo, value: order?.number ?? '—' },
    { label: copy.date, value: order?.date ?? '—' },
    { label: copy.status, value: copy.approved, accent: true },
  ];

  return (
    <div className="relative pb-28 sm:pb-40">
      <PageHeader
        index="✓"
        label={copy.label}
        titleLines={[copy.titleA, <em key="em">{copy.titleEm}</em>]}
        intro={<p>{copy.intro}</p>}
      />

      <div className="mx-auto mt-20 max-w-[2560px] px-4 sm:mt-28 sm:px-8 lg:px-12">
        <MascotDuo pose="cheer" size="md" message={tm("payment")} className="mb-12" />
        <div className="grid grid-cols-1 gap-16 border-t border-line pt-12 lg:grid-cols-12 lg:gap-8 lg:pt-16">
          <FadeUp className="lg:col-span-5">
            <h2 className="eyebrow text-ink">{copy.details}</h2>
            <dl className="mt-6 border-t border-line">
              {rows.map((row) => (
                <div key={row.label} className="flex items-baseline justify-between gap-6 border-b border-line py-4">
                  <dt className="font-mono text-[12px] uppercase tracking-[0.14em] text-mute">{row.label}</dt>
                  <dd className={`text-[15px] ${row.accent ? 'text-clay' : 'text-ink'}`}>
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </FadeUp>

          <FadeUp delay={0.1} className="lg:col-span-6 lg:col-start-7">
            <h2 className="eyebrow text-ink">{copy.next}</h2>
            <ol className="mt-6 border-t border-line">
              {copy.steps.map((step, i) => (
                <li key={step} className="grid grid-cols-[2.5rem_1fr] gap-2 border-b border-line py-4 text-[15px] leading-relaxed text-ink">
                  <span className="pt-0.5 font-mono text-[12px] tracking-[0.14em] text-mute">{String(i + 1).padStart(2, '0')}</span>
                  {step}
                </li>
              ))}
            </ol>

            <div className="mt-12 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={handleBackToHome}
                className="group inline-flex w-full shrink-0 items-center justify-between gap-8 whitespace-nowrap border border-ink bg-transparent px-6 py-4 text-[15px] text-ink hover:border-bone hover:bg-night hover:text-bone sm:w-auto"
              >
                {copy.home}
                <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
              </button>
              <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-mute">{copy.redirect}</p>
            </div>
          </FadeUp>
        </div>
      </div>
    </div>
  );
}
