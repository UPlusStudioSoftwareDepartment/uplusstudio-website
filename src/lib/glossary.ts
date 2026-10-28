export type Term = {
  key: string;
  term: string;
  definition: string;
  simple_definition: string;
  category: string;
};

const ALPHABETS: Record<string, string[]> = {
  tr: "A B C Ç D E F G H I İ J K L M N O Ö P R S Ş T U Ü V Y Z".split(" "),
  en: "A B C D E F G H I J K L M N O P Q R S T U V W X Y Z".split(" "),
};

export const pad = (n: number, width = 2) => n.toString().padStart(width, "0");

export const initialOf = (term: string, locale: string) => term.trim().charAt(0).toLocaleUpperCase(locale);

export function glossaryIndex(raw: Term[], locale: string) {
  const terms = raw
    .map(({ key, term, definition, simple_definition, category }) => ({ key, term, definition, simple_definition, category }))
    .sort((a, b) => a.term.localeCompare(b.term, locale, { sensitivity: "base" }));
  const sections: { letter: string; items: Term[] }[] = [];
  for (const term of terms) {
    const letter = initialOf(term.term, locale);
    const last = sections.at(-1);
    if (last?.letter === letter) last.items.push(term);
    else sections.push({ letter, items: [term] });
  }
  const counts = Object.fromEntries(sections.map((s) => [s.letter, s.items.length]));
  const base = ALPHABETS[locale] ?? ALPHABETS.en;
  const extra = Object.keys(counts)
    .filter((l) => !base.includes(l))
    .sort((a, b) => a.localeCompare(b, locale));
  return { total: terms.length, sections, counts, alphabet: [...base, ...extra] };
}
