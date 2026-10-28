import glossaryJson from "../../../../../public/locales/tr/glossary.json";

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

export const glossary_tr = {
    "title": "Mimarlık Sözlüğü",
    "subtitle": "Mimari terimleri herkesin anlayacağı dilde açıklıyoruz.",
    "searchPlaceholder": "Terim ara...",
    "foundCount": "{count} terim bulundu",
    "noResultsTitle": "Sonuç Bulunamadı",
    "noResultsMessage": "Aradığınız terim mimarlık sözlüğümüzde yer almıyor.",
    "clearSearch": "Aramayı Temizle",
    "totalTerms": "Mevcut Terim Sayısı",
    "label": "Mimarlık Sözlüğü",
    "titleLine1": "Mimarlık",
    "titleLine2": "sözlüğü",
    "metaTerms": "Terim",
    "metaLetters": "Harf",
    "metaLanguage": "Dil",
    "metaLanguageValue": "Türkçe / English",
    "searchLabel": "Sözlükte ara",
    "lettersLabel": "Harfe göre filtrele",
    "allLetters": "Tümü",
    "showLetter": "{letter} harfiyle başlayan terimler",
    terms,
};
