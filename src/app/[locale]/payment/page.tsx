'use client';

import { packagePrices } from '@/lib/pricing';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import PageHeader from '@/components/studio/PageHeader';
import { FadeUp } from '@/components/studio/Reveal';
import { purchase_tr } from '../purchase/locales/tr_TR';
import { purchase_en } from '../purchase/locales/en_US';

const KDV_RATE = 0.2;
const PAYMENT_PROCESSING_DELAY_MS = 3000;

const LABEL = 'block font-mono text-[12px] uppercase tracking-[0.14em] text-mute';
const FIELD =
  'mt-3 w-full rounded-none border-0 border-b border-line bg-transparent px-0 py-3 text-[17px] text-ink placeholder:text-mute/50 transition-colors focus:border-ink focus:outline-none';

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const isEn = locale === 'en';
  const copy = (isEn ? purchase_en : purchase_tr).payment;
  const tp = useTranslations('packages');
  const numberLocale = isEn ? 'en-US' : 'tr-TR';

  const packageId = searchParams.get('package') || 'basic';
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCard, setSelectedCard] = useState('credit');
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    email: '',
    phone: ''
  });

  const packages = {
    basic: {
      name: 'Temel Paket',
      price: packagePrices.basic,
      duration: '2 Hafta',
      features: ['Konsept Tasarım', '2D Teknik Çizimler', '3 Danışmanlık Görüşmesi', '2 Revizyon Hakkı']
    },
    starter: {
      name: 'Başlangıç Paketi',
      price: packagePrices.starter,
      duration: '3 Hafta',
      features: ['Konsept Tasarım', '2D Teknik Çizimler', 'Temel 3D Modelleme', '4 Danışmanlık Görüşmesi', '3 Revizyon Hakkı']
    },
    professional: {
      name: 'Profesyonel Paket',
      price: packagePrices.professional,
      duration: '3 Hafta',
      features: ['Konsept Tasarım', '3D Modelleme', 'Renderings', 'Teknik Çizimler', 'Danışmanlık', '3 Revizyon Hakkı']
    },
    business: {
      name: 'İşletme Paketi',
      price: packagePrices.business,
      duration: '4 Hafta',
      features: ['Konsept Tasarım', '3D Modelleme', 'Premium Renderings', 'Teknik Çizimler', 'Malzeme Seçimi', 'Danışmanlık', '3 Revizyon Hakkı']
    },
    enterprise: {
      name: 'Kurumsal Paket',
      price: packagePrices.enterprise,
      duration: '6 Hafta',
      features: ['Konsept Tasarım', '3D Modelleme', 'VR Tur', 'Premium Renderings', 'Teknik Çizimler', 'Malzeme Seçimi', 'Danışmanlık', '3 Revizyon Hakkı']
    },
    premium: {
      name: 'Premium Paket',
      price: packagePrices.premium,
      duration: '4 Hafta',
      features: ['Konsept Tasarım', '3D Modelleme', 'VR Tur', 'Ultra Renderings', 'Teknik Çizimler', 'Malzeme Seçimi', '3 Revizyon Hakkı', 'Proje Yönetimi', 'Destek'],
    },
    cafe: {
      name: 'Kafe Paketi',
      price: packagePrices.cafe,
      duration: '4 Hafta',
      features: ['Konsept Tasarım', 'Mekan Düzeni', 'Mutfak Tasarımı', 'Oturma Alanları', 'Aydınlatma Tasarımı', 'Teknik Çizimler', 'Danışmanlık']
    },
    gym: {
      name: 'Spor Salonu Paketi',
      price: packagePrices.gym,
      duration: '5 Hafta',
      features: ['Konsept Tasarım', 'Ekipman Düzeni', 'Soyunma Odaları', 'Resepsiyon Alanı', 'Havalandırma Sistemi', 'Teknik Çizimler', 'Danışmanlık']
    }
  };

  const resolvedId = (packageId in packages ? packageId : 'basic') as keyof typeof packages;
  const currentPackage = packages[resolvedId];

  const display = isEn
    ? {
        name: tp(`${resolvedId}.name`),
        duration: tp(`${resolvedId}.duration`),
        features: Object.values(tp.raw(`${resolvedId}.features`) as Record<string, string>),
      }
    : { name: currentPackage.name, duration: currentPackage.duration, features: currentPackage.features };

  const rawPrice = String(currentPackage.price).replaceAll(/[^\d.]/g, '').replaceAll('.', '');
  const basePrice = Number.parseFloat(rawPrice) || 0;
  const kdvAmount = Math.round(basePrice * KDV_RATE);
  const totalPrice = Math.round(basePrice * (1 + KDV_RATE));
  const money = (n: number) => `${n.toLocaleString(numberLocale)} ${copy.currency}`;

  const formatCardNumber = (value: string) =>
    value.replaceAll(/\s/g, '').replaceAll(/(.{4})/g, '$1 ').trim().slice(0, 19);

  const formatExpiryDate = (value: string) =>
    value.replaceAll(/\D/g, '').replace(/(.{2})/, '$1/').slice(0, 5);

  const formatCvv = (value: string) =>
    value.replaceAll(/\D/g, '').slice(0, 3);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const formatters: Record<string, (v: string) => string> = {
      cardNumber: formatCardNumber,
      expiryDate: formatExpiryDate,
      cvv: formatCvv,
    };
    const formatted = formatters[name]?.(value) ?? value;
    setFormData(prev => ({ ...prev, [name]: formatted }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      router.push(`/${locale}/payment/success`);
    }, PAYMENT_PROCESSING_DELAY_MS);
  };

  const handleBack = () => {
    router.back();
  };

  const methods = [
    { value: 'credit', label: copy.credit },
    { value: 'debit', label: copy.debit },
  ];

  return (
    <div className="relative pb-28 sm:pb-40">
      <PageHeader
        index="—"
        label={copy.label}
        titleLines={[copy.titleA, <em key="em">{copy.titleEm}</em>]}
        intro={<p>{copy.intro}</p>}
      />

      <div className="mx-auto mt-20 max-w-[2560px] px-4 sm:mt-28 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-16 border-t border-line pt-12 lg:grid-cols-12 lg:gap-8 lg:pt-16">
          <FadeUp delay={0.1} className="lg:order-2 lg:col-span-4 lg:col-start-9 lg:row-start-1">
            <aside className="border border-line bg-paper p-6 sm:p-8 lg:sticky lg:top-28" aria-labelledby="order-summary-title">
              <h2 id="order-summary-title" className="eyebrow text-ink">{copy.summary}</h2>

              <div className="mt-6 border-t border-line pt-6">
                <h3 className="display text-[2rem] leading-[1.05]! text-ink">{display.name}</h3>
                <p className="mt-3 font-mono text-[12px] uppercase tracking-[0.14em] text-mute">
                  {copy.duration} — {display.duration}
                </p>
                <p className="mt-6 font-serif text-[2.75rem] leading-none text-ink">{money(basePrice)}</p>
              </div>

              <div className="mt-8 border-t border-line pt-6">
                <h4 className="eyebrow text-mute">{copy.contents}</h4>
                <ul className="mt-4 space-y-2 text-[15px] text-ink">
                  {display.features.map((feature) => (
                    <li key={feature} className="flex gap-3">
                      <span aria-hidden className="text-mute">—</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <dl className="mt-8 border-t border-line pt-6 text-[15px]">
                <div className="flex justify-between gap-4 py-1.5 text-mute">
                  <dt>{copy.subtotal}</dt>
                  <dd className="font-mono text-[13px]">{money(basePrice)}</dd>
                </div>
                <div className="flex justify-between gap-4 py-1.5 text-mute">
                  <dt>{copy.vat}</dt>
                  <dd className="font-mono text-[13px]">{money(kdvAmount)}</dd>
                </div>
                <div className="mt-3 flex items-baseline justify-between gap-4 border-t border-ink pt-4 text-ink">
                  <dt className="eyebrow">{copy.total}</dt>
                  <dd className="font-serif text-2xl">{money(totalPrice)}</dd>
                </div>
              </dl>
            </aside>
          </FadeUp>

          <FadeUp className="lg:order-1 lg:col-span-7 lg:col-start-1 lg:row-start-1">
            <h2 className="eyebrow text-ink">{copy.details}</h2>

            <form onSubmit={handleSubmit} className="mt-10 space-y-10">
              <fieldset>
                <legend className={LABEL}>{copy.methodLegend}</legend>
                <div className="mt-4 grid grid-cols-2 border border-line">
                  {methods.map((method, i) => {
                    const active = selectedCard === method.value;
                    return (
                      <label
                        key={method.value}
                        className={`flex cursor-pointer items-center gap-3 px-4 py-4 text-[15px] has-[:focus-visible]:outline has-[:focus-visible]:outline-1 has-[:focus-visible]:outline-clay ${
                          i === 1 ? 'border-l border-line' : ''
                        } ${active ? 'bg-ink text-paper' : 'text-ink hover:bg-night hover:text-bone'}`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.value}
                          checked={active}
                          onChange={(e) => setSelectedCard(e.target.value)}
                          className="sr-only"
                        />
                        <span aria-hidden className={`h-2.5 w-2.5 border ${active ? 'border-paper bg-paper' : 'border-ink'}`} />
                        {method.label}
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="cardNumber" className={LABEL}>
                    {copy.cardNumber}
                  </label>
                  <input
                    id="cardNumber"
                    type="text"
                    name="cardNumber"
                    inputMode="numeric"
                    autoComplete="cc-number"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="1234 5678 9012 3456"
                    className={`${FIELD} font-mono tracking-[0.08em]`}
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="cardName" className={LABEL}>
                    {copy.cardName}
                  </label>
                  <input
                    id="cardName"
                    type="text"
                    name="cardName"
                    autoComplete="cc-name"
                    value={formData.cardName}
                    onChange={handleInputChange}
                    placeholder={copy.cardNamePlaceholder}
                    className={FIELD}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="expiryDate" className={LABEL}>
                    {copy.expiry}
                  </label>
                  <input
                    id="expiryDate"
                    type="text"
                    name="expiryDate"
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    placeholder="MM/YY"
                    className={`${FIELD} font-mono tracking-[0.08em]`}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="cvv" className={LABEL}>
                    {copy.cvv}
                  </label>
                  <input
                    id="cvv"
                    type="text"
                    name="cvv"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    placeholder="123"
                    className={`${FIELD} font-mono tracking-[0.08em]`}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className={LABEL}>
                    {copy.email}
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={copy.emailPlaceholder}
                    className={FIELD}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className={LABEL}>
                    {copy.phone}
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="0555 123 45 67"
                    className={FIELD}
                    required
                  />
                </div>
              </div>

              <div className="flex items-start gap-4 border-y border-line py-5">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <rect x="5" y="11" width="14" height="10" strokeWidth={1} />
                  <path d="M8 11V7a4 4 0 018 0v4" strokeWidth={1} />
                </svg>
                <div>
                  <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-ink">{copy.ssl}</p>
                  <p className="mt-1 text-[14px] text-mute">{copy.sslNote}</p>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-6 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="group inline-flex items-center gap-3 self-start border-b border-ink/40 pb-1 text-[15px] text-ink hover:border-clay hover:text-clay sm:self-auto"
                  aria-label={copy.backAria}
                >
                  <span aria-hidden className="transition-transform group-hover:-translate-x-1">←</span>
                  {copy.back}
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  aria-busy={isLoading}
                  aria-label={isLoading ? copy.processingAria : copy.submit}
                  className="group inline-flex w-full items-center justify-between gap-8 border border-ink bg-transparent px-6 py-4 text-[15px] text-ink hover:border-bone hover:bg-night hover:text-bone disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-[300px]"
                >
                  {isLoading ? (
                    <span className="inline-flex items-center gap-3">
                      <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden>
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                      </svg>
                      {copy.processing}
                    </span>
                  ) : (
                    <>
                      <span>{copy.submit}</span>
                      <span className="font-serif text-lg">{money(totalPrice)}</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            <p className="mt-10 font-mono text-[12px] uppercase tracking-[0.14em] text-mute">{copy.secureNote}</p>
          </FadeUp>
        </div>
      </div>
    </div>
  );
}
