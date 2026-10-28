import dynamic from "next/dynamic";
import { Suspense } from "react";
import type { Metadata } from "next";
import ServicesClient from "@/components/ServicesClient";
import JsonLd from "@/components/seo/JsonLd";
import { setRequestLocale } from "next-intl/server";
import {
  breadcrumbLd,
  pageMetadata,
  resolveLocale,
  SEO_COPY,
  servicesLd,
  webPageLd,
} from "@/lib/seo";

function PackagesFallback() {
  return (
    <div
      className="mx-auto max-w-[2560px] px-4 py-32 sm:px-8 lg:px-12"
      aria-busy="true"
    >
      <div className="h-px w-full origin-left animate-pulse bg-line" />
    </div>
  );
}

const ServicePackages = dynamic(() => import("@/components/ServicePackages"), {
  ssr: true,
  loading: () => <PackagesFallback />,
});

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return pageMetadata(resolveLocale((await params).locale), "services");
}

export default async function ServicesPage({ params }: Props) {
  const locale = resolveLocale((await params).locale);
  setRequestLocale(locale);
  return (
    <>
      <JsonLd
        data={[
          webPageLd(locale, "services"),
          breadcrumbLd(locale, [
            [SEO_COPY[locale].services.crumb, "/services"],
          ]),
          servicesLd(locale),
        ]}
      />
      <ServicesClient>
        <Suspense fallback={<PackagesFallback />}>
          <ServicePackages />
        </Suspense>
      </ServicesClient>
    </>
  );
}
