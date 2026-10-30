"use client";

import { useEffect } from "react";

// If a visitor follows a link before the page has finished hydrating, React renders the next
// page's metadata but never adopts the server-rendered tags of the first page, so the old title,
// description, canonical and hreflang links stay in <head> next to the new ones. React marks every
// element it owns with a "__reactFiber$" key; a server-rendered tag without one is an orphan, and
// it is removed only when React already owns a tag of the same kind, so the last copy never goes.
const SELECTOR = 'title, meta[name], meta[property], link[rel="canonical"], link[rel="alternate"]';

const owned = (el: Element) => Object.keys(el).some((key) => key.startsWith("__reactFiber$"));
const kind = (el: Element) =>
  [el.tagName, el.getAttribute("rel"), el.getAttribute("hreflang"), el.getAttribute("name"), el.getAttribute("property")].join("|");

function removeOrphans() {
  const tags = [...document.head.querySelectorAll(SELECTOR)];
  const live = new Set(tags.filter(owned).map(kind));
  for (const el of tags) if (!owned(el) && live.has(kind(el))) el.remove();
}

export default function HeadOrphans() {
  useEffect(() => {
    removeOrphans();
    const observer = new MutationObserver(removeOrphans);
    observer.observe(document.head, { childList: true });
    return () => observer.disconnect();
  }, []);
  return null;
}
