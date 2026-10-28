import type { AbstractIntlMessages } from "next-intl";

const PAGE_ONLY = new Set(["glossary"]);

export function sharedMessages(messages: AbstractIntlMessages): AbstractIntlMessages {
  return Object.fromEntries(Object.entries(messages).filter(([key]) => !PAGE_ONLY.has(key)));
}
