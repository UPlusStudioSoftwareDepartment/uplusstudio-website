import { useEffect } from "react";

let locks = 0;
let savedScrollY = 0;
let lockedPath = "";

export function useScrollLock(open: boolean): void {
  useEffect(() => {
    if (!open) return;

    if (locks === 0) {
      savedScrollY = globalThis.scrollY;
      lockedPath = globalThis.location.pathname;
      const body = document.body.style;
      body.position = "fixed";
      body.top = `-${savedScrollY}px`;
      body.width = "100%";
      body.overflow = "hidden";
    }
    locks += 1;

    return () => {
      locks -= 1;
      if (locks > 0) return;
      const body = document.body.style;
      body.position = "";
      body.top = "";
      body.width = "";
      body.overflow = "";
      if (globalThis.location.pathname === lockedPath) globalThis.scrollTo({ top: savedScrollY, left: 0, behavior: "instant" });
    };
  }, [open]);
}
