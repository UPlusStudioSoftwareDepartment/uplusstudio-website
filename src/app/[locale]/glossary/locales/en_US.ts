import glossaryJson from "../../../../../public/locales/en/glossary.json";

type GlossaryTerm = {
    key: string;
    term: string;
    definition: string;
    simple_definition: string;
    image_id: string;
    category?: string;
};

const terms = (glossaryJson as { terms: GlossaryTerm[] }).terms.map((t) => ({
    ...t,
    category: t.category ?? "",
}));

export const glossary_en = {
    "title": "Architectural Glossary",
    "subtitle": "Explaining architectural terms in a language everyone can understand.",
    "searchPlaceholder": "Search terms...",
    "foundCount": "Found {count} terms",
    "totalCount": "{count} terms",
    "noResultsTitle": "Nothing Found",
    "noResultsMessage": "The term you're looking for doesn't exist in our architectural dictionary.",
    "clearSearch": "Clear Search",
    "totalTerms": "Available Terms",
    "label": "Architectural Glossary",
    "titleLine1": "Architectural",
    "titleLine2": "glossary",
    "metaTerms": "Terms",
    "metaLetters": "Letters",
    "metaLanguage": "Language",
    "metaLanguageValue": "EN / TR",
    "searchLabel": "Search the glossary",
    "lettersLabel": "Filter by letter",
    "allLetters": "All",
    "showLetter": "Terms starting with {letter}",
    terms,
};
