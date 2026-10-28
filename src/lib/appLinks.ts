import type { MouseEvent } from "react";
import { mailPlatform } from "@/lib/gmailCompose";

export function linkedInIntent(url: string) {
  const { pathname, search } = new URL(url);
  return `intent://www.linkedin.com${pathname}${search}#Intent;scheme=https;package=com.linkedin.android;S.browser_fallback_url=${encodeURIComponent(url)};end`;
}

export function openInLinkedInApp(event: MouseEvent<HTMLAnchorElement>) {
  const link = event.currentTarget;
  const platform = mailPlatform();
  if (platform === "ios") {
    link.target = "_self";
  } else if (platform === "android") {
    event.preventDefault();
    globalThis.location.href = linkedInIntent(link.href);
  }
}
