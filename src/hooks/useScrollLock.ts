import { useEffect } from "react";

export function useScrollLock(open: boolean): void {
  useEffect(() => {
    if (!open) return;

    const scrollY = globalThis.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";

    return () => {
      const savedScrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      globalThis.scrollTo(0, Number.parseInt(savedScrollY ?? "0", 10) * -1);
    };
  }, [open]);
}
