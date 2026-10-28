import { useEffect, type RefObject } from "react";

const FOCUSABLE = "a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]";

const traps: RefObject<HTMLElement | null>[] = [];

export function useFocusTrap(
  open: boolean,
  dialogRef: RefObject<HTMLElement | null>,
  initialFocusRef: RefObject<HTMLElement | null>
): void {
  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    traps.push(dialogRef);
    initialFocusRef.current?.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      const dialog = dialogRef.current;
      if (e.key !== "Tab" || !dialog || traps[traps.length - 1] !== dialogRef) return;
      const items = [...dialog.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
        (el) => el.tabIndex >= 0 && el.getClientRects().length > 0
      );
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (dialog.contains(document.activeElement) && document.activeElement !== (e.shiftKey ? first : last)) return;
      e.preventDefault();
      (e.shiftKey ? last : first).focus();
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      traps.splice(traps.indexOf(dialogRef), 1);
      opener?.focus({ preventScroll: true });
    };
  }, [open, dialogRef, initialFocusRef]);
}
