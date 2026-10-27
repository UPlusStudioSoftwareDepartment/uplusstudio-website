import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { pageMetadata, resolveLocale } from "@/lib/seo";
import PageHeader from "@/components/studio/PageHeader";
import { MascotDuo } from "@/components/mascots/Mascots";
import { getTranslations } from "next-intl/server";
import PurchaseForm from "./purchase/PurchaseForm";
import { purchase_tr } from "./locales/tr_TR";
import { purchase_en } from "./locales/en_US";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  return pageMetadata(resolveLocale((await params).locale), "purchase");
}

export default async function PurchasePage() {
  const locale = await getLocale();
  const t = locale === "en" ? purchase_en : purchase_tr;
  const tm = await getTranslations("studio.mascots");

  const words = t.title.split(" ");
  const last = words.pop() ?? "";
  const titleLines = words.length ? [words.join(" "), <em key="em">{last}</em>] : [last];

  return (
    <div className="relative pb-28 sm:pb-40">
      <PageHeader index="—" label={t.page.label} titleLines={titleLines} intro={<p>{t.subtitle}</p>} image={{ src: "/media/projects/tek-katli-ev/exterior.jpg", alt: t.page.label }} />
      <div className="mx-auto max-w-[2560px] px-4 pt-16 sm:px-8 lg:px-12">
        <MascotDuo pose="wave" size="sm" message={tm("purchase")} />
      </div>
      <PurchaseForm />
    </div>
  );
}
