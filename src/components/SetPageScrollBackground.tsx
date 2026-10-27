"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const SCROLL_WHITE_CLASS = "scroll-bg-white";

export default function SetPageScrollBackground() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof document === "undefined") return;

    const segments = pathname.split("/").filter(Boolean);
    const isHomePage = segments.length <= 1;

    if (isHomePage) {
      document.documentElement.classList.remove(SCROLL_WHITE_CLASS);
      document.body.classList.remove(SCROLL_WHITE_CLASS);
    } else {
      document.documentElement.classList.add(SCROLL_WHITE_CLASS);
      document.body.classList.add(SCROLL_WHITE_CLASS);
    }

    return () => {
      document.documentElement.classList.remove(SCROLL_WHITE_CLASS);
      document.body.classList.remove(SCROLL_WHITE_CLASS);
    };
  }, [pathname]);

  return null;
}
