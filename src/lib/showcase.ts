import { getProject } from "@/lib/projects";
import type { Locale } from "@/lib/i18n-config";

export type ExamplePair = "villa" | "office" | "officeWorkArea";

const OFFICE_WORK_AREA = {
  before: { src: "/media/projects/ofis-yenileme/before-2.jpg", alt: { tr: "Ofisin önceki hali — çalışma alanı", en: "The office before — work area" } },
  after: { src: "/media/projects/ofis-yenileme/after-2.jpg", alt: { tr: "Ofisin yeni hali — çalışma alanı", en: "The office after — work area" } },
};

const PAIR_PROJECT: Record<ExamplePair, string> = {
  villa: "villa-donusumu",
  office: "ofis-yenileme",
  officeWorkArea: "ofis-yenileme",
};

export function examplePair(pair: ExamplePair, locale: Locale, label: string) {
  const project = getProject(PAIR_PROJECT[pair]);
  if (!project?.beforeAfter) return null;
  const shots =
    pair === "officeWorkArea"
      ? {
          before: { src: OFFICE_WORK_AREA.before.src, alt: OFFICE_WORK_AREA.before.alt[locale] },
          after: { src: OFFICE_WORK_AREA.after.src, alt: OFFICE_WORK_AREA.after.alt[locale] },
        }
      : {
          before: { src: project.beforeAfter.before.src, alt: project.beforeAfter.before.alt[locale] },
          after: { src: project.beforeAfter.after.src, alt: project.beforeAfter.after.alt[locale] },
        };
  return { ...shots, label, title: project.title[locale], href: `/${locale}/projects/${project.slug}` };
}
