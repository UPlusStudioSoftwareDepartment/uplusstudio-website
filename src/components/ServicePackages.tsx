"use client";

import Image from "next/image";

import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Eyebrow, FadeUp, LineReveal, MaskReveal } from "@/components/studio/Reveal";
import { useAppointment } from "@/contexts/AppointmentContext";
import { useServicesCopy } from "@/components/ServicesClient";
import FramedImage from "@/components/studio/FramedImage";

import { packagePrices, type PackageTier } from "@/lib/pricing";

interface PackageFeature {
  id: string;
  text: string;
}

interface Package {
  id: PackageTier;
  name: string;
  price: number;
  duration: string;
  features: PackageFeature[];
  popular?: boolean;
}

const sectorImages: Partial<Record<PackageTier, string>> = {
  cafe: '/media/projects/butik-kafe/interior.jpg',
  gym: '/media/projects/evox-gym/training-floor.jpg',
};

const SECTOR_TIERS: PackageTier[] = ['cafe', 'gym'];

const CONTAINER = 'mx-auto max-w-[2560px] px-4 sm:px-8 lg:px-12';

const PACKAGE_IMAGES: Record<string, { src: string; alt: { tr: string; en: string } }> = {
  basic: { src: "/media/projects/konut-ic-mekan/living-1.jpg", alt: { tr: "Konut iç mekânı — oturma alanı", en: "Residential interior — living area" } },
  starter: { src: "/media/projects/konut-ic-mekan/bedroom-1.jpg", alt: { tr: "Konut iç mekânı — yatak odası", en: "Residential interior — bedroom" } },
  professional: { src: "/media/projects/villa-ic-mekan/bedroom.jpg", alt: { tr: "Villa iç mekânı — yatak odası", en: "Villa interior — bedroom" } },
  business: { src: "/media/projects/konut-ic-mekan/living-4.jpg", alt: { tr: "Konut iç mekânı — salon", en: "Residential interior — living room" } },
  enterprise: { src: "/media/projects/konut-projeleri/apartment.jpg", alt: { tr: "Konut projesi", en: "Residential project" } },
  premium: { src: "/media/projects/modern-villa/exterior-pool.jpg", alt: { tr: "Modern villa ve havuz", en: "Modern villa and pool" } },
};

export default function ServicePackages() {
  const t = useTranslations('packages');
  const locale = useLocale();
  const page = useServicesCopy().page;
  const { openAppointment, openAppointmentWith } = useAppointment();

  const packages = useMemo<Package[]>(() => [
    {
      id: 'basic',
      name: t('basic.name'),
      price: packagePrices.basic,
      duration: t('basic.duration'),
      features: [
        { id: 'concept', text: t('basic.features.concept') },
        { id: '2dDrawings', text: t('basic.features.2dDrawings') },
        { id: 'consultation', text: t('basic.features.consultation') },
        { id: 'revisions', text: t('basic.features.revisions') },
      ],
    },
    {
      id: 'starter',
      name: t('starter.name'),
      price: packagePrices.starter,
      duration: t('starter.duration'),
      features: [
        { id: 'concept', text: t('starter.features.concept') },
        { id: '2dDrawings', text: t('starter.features.2dDrawings') },
        { id: 'basic3d', text: t('starter.features.basic3d') },
        { id: 'consultation', text: t('starter.features.consultation') },
        { id: 'revisions', text: t('starter.features.revisions') },
      ],
    },
    {
      id: 'professional',
      name: t('professional.name'),
      price: packagePrices.professional,
      duration: t('professional.duration'),
      features: [
        { id: 'concept', text: t('professional.features.concept') },
        { id: '3dModeling', text: t('professional.features.3dModeling') },
        { id: 'renderings', text: t('professional.features.renderings') },
        { id: 'technicalDrawings', text: t('professional.features.technicalDrawings') },
        { id: 'consultation', text: t('professional.features.consultation') },
        { id: 'unlimitedRevisions', text: t('professional.features.unlimitedRevisions') },
      ],
      popular: true,
    },
    {
      id: 'business',
      name: t('business.name'),
      price: packagePrices.business,
      duration: t('business.duration'),
      features: [
        { id: 'concept', text: t('business.features.concept') },
        { id: '3dModeling', text: t('business.features.3dModeling') },
        { id: 'premiumRenderings', text: t('business.features.premiumRenderings') },
        { id: 'technicalDrawings', text: t('business.features.technicalDrawings') },
        { id: 'materialSelection', text: t('business.features.materialSelection') },
        { id: 'consultation', text: t('business.features.consultation') },
        { id: 'unlimitedRevisions', text: t('business.features.unlimitedRevisions') },
      ],
    },
    {
      id: 'enterprise',
      name: t('enterprise.name'),
      price: packagePrices.enterprise,
      duration: t('enterprise.duration'),
      features: [
        { id: 'concept', text: t('enterprise.features.concept') },
        { id: '3dModeling', text: t('enterprise.features.3dModeling') },
        { id: 'vrTour', text: t('enterprise.features.vrTour') },
        { id: 'premiumRenderings', text: t('enterprise.features.premiumRenderings') },
        { id: 'technicalDrawings', text: t('enterprise.features.technicalDrawings') },
        { id: 'materialSelection', text: t('enterprise.features.materialSelection') },
        { id: 'consultation', text: t('enterprise.features.consultation') },
        { id: 'unlimitedRevisions', text: t('enterprise.features.unlimitedRevisions') },
      ],
    },
    {
      id: 'premium',
      name: t('premium.name'),
      price: packagePrices.premium,
      duration: t('premium.duration'),
      features: [
        { id: 'concept', text: t('premium.features.concept') },
        { id: '3dModeling', text: t('premium.features.3dModeling') },
        { id: 'vrTour', text: t('premium.features.vrTour') },
        { id: 'ultraRenderings', text: t('premium.features.ultraRenderings') },
        { id: 'technicalDrawings', text: t('premium.features.technicalDrawings') },
        { id: 'materialSelection', text: t('premium.features.materialSelection') },
        { id: 'consultation', text: t('premium.features.consultation') },
        { id: 'unlimitedRevisions', text: t('premium.features.unlimitedRevisions') },
        { id: 'projectManagement', text: t('premium.features.projectManagement') },
        { id: 'support', text: t('premium.features.support') },
      ],
    },
    {
      id: 'cafe',
      name: t('cafe.name'),
      price: packagePrices.cafe,
      duration: t('cafe.duration'),
      features: [
        { id: 'concept', text: t('cafe.features.concept') },
        { id: 'layout', text: t('cafe.features.layout') },
        { id: 'kitchenDesign', text: t('cafe.features.kitchenDesign') },
        { id: 'seating', text: t('cafe.features.seating') },
        { id: 'lighting', text: t('cafe.features.lighting') },
        { id: 'technicalDrawings', text: t('cafe.features.technicalDrawings') },
        { id: 'consultation', text: t('cafe.features.consultation') },
      ],
    },
    {
      id: 'gym',
      name: t('gym.name'),
      price: packagePrices.gym,
      duration: t('gym.duration'),
      features: [
        { id: 'concept', text: t('gym.features.concept') },
        { id: 'equipmentLayout', text: t('gym.features.equipmentLayout') },
        { id: 'lockerRooms', text: t('gym.features.lockerRooms') },
        { id: 'reception', text: t('gym.features.reception') },
        { id: 'ventilation', text: t('gym.features.ventilation') },
        { id: 'technicalDrawings', text: t('gym.features.technicalDrawings') },
        { id: 'consultation', text: t('gym.features.consultation') },
      ],
    },
  ], [t]);

  const numberLocale = locale === 'en' ? 'en-US' : 'tr-TR';
  const formatPrice = (price: number) => `₺${price.toLocaleString(numberLocale)}`;

  const requestPackage = (pkg: Package) =>
    openAppointmentWith({
      service: SECTOR_TIERS.includes(pkg.id) ? 'commercial' : undefined,
      message: t('requestMessage', { name: pkg.name, price: formatPrice(pkg.price) }),
    });

  const designPackages = packages.filter((p) => !SECTOR_TIERS.includes(p.id));
  const sectorPackages = packages.filter((p) => SECTOR_TIERS.includes(p.id));

  const renderButton = (pkg: Package, inverted: boolean) => {
    const tone = inverted
      ? 'border-clay/70 text-bone hover:border-bone hover:bg-night hover:text-bone'
      : 'border-ink/50 text-ink hover:border-bone hover:bg-night hover:text-bone';
    return (
      <button
        type="button"
        onClick={() => requestPackage(pkg)}
        aria-label={`${t('purchase')} — ${pkg.name}`}
        className={`group/btn inline-flex w-full items-center justify-between gap-4 rounded-[3px] border bg-transparent px-5 py-4 font-mono text-[12px] uppercase tracking-[0.12em] transition-colors duration-300 ${tone}`}
      >
        {t('purchase')}
        <span aria-hidden className="transition-transform duration-300 group-hover/btn:translate-x-1">→</span>
      </button>
    );
  };

  const renderFeatures = (pkg: Package) => (
    <ul className="space-y-2.5 text-[15px] leading-snug text-ink/85">
      {pkg.features.map((feature) => (
        <li key={feature.id} className="flex gap-3">
          <svg className="mt-[0.3em] h-3.5 w-3.5 shrink-0 text-clay" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden>
            <path d="m3 8.5 3 3 7-7" />
          </svg>
          {feature.text}
        </li>
      ))}
    </ul>
  );

  return (
    <section id="services" aria-labelledby="packages-title" className="relative pt-28 sm:pt-40">
      <div className={CONTAINER}>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Eyebrow>{page.packagesEyebrow}</Eyebrow>
          </div>
          <div className="lg:col-span-8">
            <h2
              id="packages-title"
              className="display text-[clamp(2.5rem,6vw,5.5rem)] text-ink"
            >
              <LineReveal lines={[t('title')]} />
            </h2>
            <FadeUp>
              <p className="mt-8 max-w-xl text-[17px] leading-relaxed text-mute">{t('subtitle')}</p>
            </FadeUp>
          </div>
        </div>

        <div className="mt-20 flex items-baseline justify-between border-b border-ink pb-4 sm:mt-28">
          <h3 className="eyebrow font-normal text-ink">{page.designGroup}</h3>
          <span className="font-mono text-[12px] tracking-[0.14em] text-mute">
            {String(designPackages.length).padStart(2, '0')}
          </span>
        </div>

        <ol className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 xl:gap-6">
          {designPackages.map((pkg, i) => {
            const featured = Boolean(pkg.popular);
            const photo = PACKAGE_IMAGES[pkg.id];
            return (
              <li
                key={pkg.id}
                className={`group relative row-span-5 grid grid-rows-subgrid overflow-hidden rounded-[6px] border bg-paper-2/50 transition-[border-color,box-shadow,translate] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${
                  featured
                    ? 'border-clay/60 shadow-[0_30px_90px_-40px_rgba(196,130,92,0.55)]'
                    : 'border-line hover:border-ink/30 hover:shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)]'
                }`}
              >
                <div className="relative h-[clamp(11rem,15vw,15rem)] overflow-hidden bg-night">
                  {photo && (
                    <Image
                      src={photo.src}
                      alt={photo.alt[locale === 'en' ? 'en' : 'tr']}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="object-cover grayscale transition-[filter,transform,scale] duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform group-hover:scale-[1.06] group-hover:grayscale-0 motion-reduce:transition-none"
                    />
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-night/85 via-night/10 to-transparent" aria-hidden />
                  <span className="absolute bottom-4 left-6 font-mono text-[11px] tracking-[0.16em] text-bone/80 sm:left-8">
                    P—{String(i + 1).padStart(2, '0')}
                  </span>
                  {featured && (
                    <span className="absolute right-4 top-4 rounded-full bg-clay px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-night">
                      {t('popular')}
                    </span>
                  )}
                </div>

                <h4 className="px-6 pt-7 font-sans text-[clamp(1.6rem,2.2vw,2.1rem)] font-light leading-[1.05] tracking-[-0.025em] text-ink sm:px-8">
                  {pkg.name}
                </h4>

                <div className="mx-6 mt-6 flex items-end justify-between gap-4 border-y border-line py-5 sm:mx-8">
                  <div>
                    <span className="sr-only">{page.price}: </span>
                    <span className="block font-serif text-[clamp(2.25rem,3vw,2.75rem)] leading-none text-ink">{formatPrice(pkg.price)}</span>
                    <span className="mt-2 block font-mono text-[11px] tracking-[0.08em] text-mute">
                      / {t('project')} {page.vatNote}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="eyebrow block text-mute">{page.duration}</span>
                    <span className="mt-2 inline-block whitespace-nowrap rounded-full border border-line px-3 py-1 text-[13px] text-ink">{pkg.duration}</span>
                  </div>
                </div>

                <div className="px-6 pt-6 sm:px-8">
                  <p className="eyebrow mb-4 text-mute">{page.includes}</p>
                  {renderFeatures(pkg)}
                </div>

                <div className="self-end px-6 pb-7 pt-8 sm:px-8">{renderButton(pkg, featured)}</div>
              </li>
            );
          })}
        </ol>

        <div className="mt-24 grid grid-cols-1 gap-8 sm:mt-32 lg:grid-cols-12">
          <div className="flex items-baseline justify-between border-b border-ink pb-4 lg:col-span-12">
            <h3 className="eyebrow font-normal text-ink">{page.sectorGroup}</h3>
            <span className="font-mono text-[12px] tracking-[0.14em] text-mute">
              {String(sectorPackages.length).padStart(2, '0')}
            </span>
          </div>
          <p className="max-w-xl text-[17px] leading-relaxed text-mute lg:col-span-6 lg:col-start-7">{page.sectorIntro}</p>
        </div>

        <ol className="mt-12">
          {sectorPackages.map((pkg, i) => {
            const image = sectorImages[pkg.id];
            const reversed = i % 2 === 1;
            return (
              <li key={pkg.id} className="grid grid-cols-1 gap-8 border-t border-line py-12 lg:grid-cols-12 lg:gap-12 lg:py-16">
                {image && (
                  <MaskReveal
                    from="left"
                    className={`relative aspect-[3/2] w-full bg-night lg:col-span-7 lg:aspect-auto lg:h-full lg:min-h-[420px] ${reversed ? 'lg:order-2 lg:col-start-6' : ''}`}
                  >
                    <FramedImage src={image} alt={page.sectorImages[pkg.id as 'cafe' | 'gym']} sizes="(max-width: 1024px) 100vw, 58vw" />
                  </MaskReveal>
                )}
                <FadeUp className={`flex flex-col lg:col-span-5 ${reversed ? 'lg:order-1 lg:col-start-1' : ''}`}>
                  <span className="font-mono text-[12px] tracking-[0.14em] text-mute">
                    S—{String(i + 1).padStart(2, '0')}
                  </span>
                  <h4 className="display mt-6 text-[clamp(2rem,4vw,3.5rem)] leading-[1]! text-ink">
                    {pkg.name}
                  </h4>

                  <dl className="mt-8 grid grid-cols-2 gap-4 border-t border-line pt-5">
                    <div>
                      <dt className="eyebrow text-mute">{page.price}</dt>
                      <dd className="mt-2 font-serif text-[2.25rem] leading-none text-ink">{formatPrice(pkg.price)}</dd>
                      <dd className="mt-2 font-mono text-[12px] tracking-[0.08em] text-mute">
                        / {t('project')} {page.vatNote}
                      </dd>
                    </div>
                    <div>
                      <dt className="eyebrow text-mute">{page.duration}</dt>
                      <dd className="mt-2 text-[17px] text-ink">{pkg.duration}</dd>
                    </div>
                  </dl>

                  <div className="mt-8 border-t border-line pt-5">
                    <p className="eyebrow mb-4 text-mute">{page.includes}</p>
                    {renderFeatures(pkg)}
                  </div>

                  <div className="mt-10 sm:max-w-sm">{renderButton(pkg, false)}</div>
                </FadeUp>
              </li>
            );
          })}
        </ol>

        <div className="grid grid-cols-1 gap-6 border-y border-line py-10 sm:py-12 lg:grid-cols-12 lg:items-center">
          <h3 className="display text-2xl leading-[1.1]! text-ink sm:text-3xl lg:col-span-4">
            {t('customPackage.title')}
          </h3>
          <p className="max-w-lg text-[15px] leading-relaxed text-mute lg:col-span-5">{t('customPackage.description')}</p>
          <div className="lg:col-span-3 lg:text-right">
            <button
              type="button"
              onClick={openAppointment}
              className="group inline-flex items-center gap-3 border-b border-ink pb-1 text-[15px] text-ink hover:border-clay hover:text-clay"
            >
              {t('customPackage.contact')}
              <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
