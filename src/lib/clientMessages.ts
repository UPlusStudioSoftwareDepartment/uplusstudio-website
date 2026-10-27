import type { AbstractIntlMessages } from "next-intl";

const PAGE_ONLY = new Set(["glossary", "faq", "faq_en", "about_en", "contact_en", "projects_en", "purchase_en", "services_en"]);

export function sharedMessages(messages: AbstractIntlMessages): AbstractIntlMessages {
  return Object.fromEntries(Object.entries(messages).filter(([key]) => !PAGE_ONLY.has(key)));
}

export function withNamespaces(messages: AbstractIntlMessages, namespaces: string[]): AbstractIntlMessages {
  const extra = Object.fromEntries(namespaces.filter((n) => n in messages).map((n) => [n, messages[n]]));
  return { ...sharedMessages(messages), ...extra };
}
