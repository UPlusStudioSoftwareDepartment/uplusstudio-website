import type { Locale } from "@/lib/i18n-config";
import { projectPlanning } from "@/lib/projectPlanning";

export default function ProjectPreparation({ locale }: Readonly<{ locale: Locale }>) {
  const copy = projectPlanning[locale];
  return (
    <aside aria-labelledby="project-preparation" className="border-y border-line py-10">
      <h2 id="project-preparation" className="font-serif text-3xl leading-tight sm:text-4xl">{copy.preparationTitle}</h2>
      <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-mute">{copy.preparationIntro}</p>
      <ul className="mt-8 grid gap-x-12 gap-y-5 text-[16px] leading-relaxed sm:grid-cols-2">
        {copy.preparation.map((item) => <li key={item} className="border-t border-line pt-4">{item}</li>)}
      </ul>
    </aside>
  );
}
