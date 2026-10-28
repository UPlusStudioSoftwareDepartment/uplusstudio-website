import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import JsonLd from "@/components/seo/JsonLd";
import PageHeader from "@/components/studio/PageHeader";
import { breadcrumbLd, pageMetadata, resolveLocale, SEO_COPY, webPageLd } from "@/lib/seo";
import { PRIVACY, PRIVACY_UPDATED } from "@/lib/privacy";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return pageMetadata(resolveLocale((await params).locale), "privacy");
}

export default async function Page({ params }: Props) {
  const locale = resolveLocale((await params).locale);
  setRequestLocale(locale);
  const copy = PRIVACY[locale];
  const updated = new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: "Europe/Istanbul" }).format(new Date(PRIVACY_UPDATED));

  return (
    <>
      <JsonLd data={[webPageLd(locale, "privacy"), breadcrumbLd(locale, [[SEO_COPY[locale].privacy.crumb, "/kvkk"]])]} />
      <PageHeader
        index="08"
        label={copy.label}
        titleLines={[copy.title[0], <em key="em">{copy.title[1]}</em>]}
        intro={<p>{copy.intro}</p>}
        image={{ src: "/images/persons/founders/hacer_uyar/hacer-uyar-u-plus-studio-ofis.jpg", alt: "" }}
      />
      <article className="mx-auto max-w-[2560px] px-4 pb-28 pt-16 sm:px-8 sm:pt-24 lg:px-12">
        <div className="max-w-3xl">
          <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-mute">
            {copy.updated}: <time dateTime={PRIVACY_UPDATED}>{updated}</time>
          </p>
          {copy.sections.map((section) => (
            <section key={section.title} className="mt-12 border-t border-line pt-8">
              <h2 className="display text-[clamp(1.75rem,4vw,2.5rem)] text-ink">{section.title}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph} className="mt-4 text-[17px] leading-relaxed text-ink/85">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
      </article>
    </>
  );
}
