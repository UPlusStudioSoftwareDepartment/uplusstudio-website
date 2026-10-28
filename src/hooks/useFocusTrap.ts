import { useEffect, type RefObject } from "react";

const FOCUSABLE = "a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]";

const traps: RefObject<HTMLElement | null>[] = [];
const RECENT_CLICK_MS = 5000;
let lastClick: { el: HTMLElement | null; at: number } = { el: null, at: 0 };

if (typeof document !== "undefined") {
  document.addEventListener("click", (e) => (lastClick = { el: (e.target as Element | null)?.closest?.<HTMLElement>(FOCUSABLE) ?? null, at: e.timeStamp }), true);
}

export function useFocusTrap(
  open: boolean,
  dialogRef: RefObject<HTMLElement | null>,
  initialFocusRef: RefObject<HTMLElement | null>
): void {
  useEffect(() => {
    if (!open) return;
    const active = document.activeElement;
    const clicked = performance.now() - lastClick.at < RECENT_CLICK_MS ? lastClick.el : null;
    const opener = clicked ?? (active instanceof HTMLElement && active !== document.body ? active : null);
    traps.push(dialogRef);
    initialFocusRef.current?.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      const dialog = dialogRef.current;
      if (e.key !== "Tab" || !dialog || traps[traps.length - 1] !== dialogRef) return;
      const items = [...dialog.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
        (el) => el.tabIndex >= 0 && el.getClientRects().length > 0
      );
      if (!items.length) return;
      e.preventDefault();
      const index = items.indexOf(document.activeElement as HTMLElement);
      const step = e.shiftKey ? -1 : 1;
      const next = index < 0 ? (e.shiftKey ? items.length - 1 : 0) : (index + step + items.length) % items.length;
      items[next].focus();
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      traps.splice(traps.indexOf(dialogRef), 1);
      opener?.focus({ preventScroll: true });
    };
  }, [open, dialogRef, initialFocusRef]);
}
