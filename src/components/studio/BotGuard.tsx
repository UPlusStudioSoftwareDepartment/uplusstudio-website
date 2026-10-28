"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { useLocale } from "next-intl";
import { HONEYPOT_FIELD, TURNSTILE_FIELD } from "@/lib/botGuard";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

type TurnstileApi = { render: (el: HTMLElement, options: Record<string, unknown>) => string; remove: (id: string) => void; reset: (id: string) => void };

let loading: Promise<TurnstileApi> | null = null;

function loadTurnstile() {
  loading ??= new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.onload = () => resolve((globalThis as unknown as { turnstile: TurnstileApi }).turnstile);
    script.onerror = reject;
    document.head.append(script);
  });
  return loading;
}

function Turnstile({ onToken, resetRef }: Readonly<{ onToken: (token: string) => void; resetRef: RefObject<(() => void) | null> }>) {
  const boxRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();

  useEffect(() => {
    if (!SITE_KEY) return;
    let id: string | undefined;
    let alive = true;
    loadTurnstile()
      .then((api) => {
        if (!alive || !boxRef.current) return;
        id = api.render(boxRef.current, {
          sitekey: SITE_KEY,
          appearance: "interaction-only",
          theme: "dark",
          language: locale,
          callback: onToken,
          "expired-callback": () => onToken(""),
          "error-callback": () => onToken(""),
        });
        resetRef.current = () => {
          onToken("");
          if (id) api.reset(id);
        };
      })
      .catch(() => {});
    return () => {
      alive = false;
      resetRef.current = null;
      if (id) loadTurnstile().then((api) => api.remove(id!));
    };
  }, [locale, onToken, resetRef]);

  return SITE_KEY ? <div ref={boxRef} /> : null;
}

export function useBotGuard() {
  const trapRef = useRef<HTMLInputElement>(null);
  const [token, setToken] = useState("");
  const resetRef = useRef<(() => void) | null>(null);

  const fields = (
    <>
      <input
        ref={trapRef}
        name={HONEYPOT_FIELD}
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="pointer-events-none absolute -left-[9999px] h-px w-px opacity-0"
      />
      <Turnstile onToken={setToken} resetRef={resetRef} />
    </>
  );

  const values = () => {
    const sent = { [HONEYPOT_FIELD]: trapRef.current?.value ?? "", [TURNSTILE_FIELD]: token };
    resetRef.current?.();
    return sent;
  };

  return { fields, values };
}
