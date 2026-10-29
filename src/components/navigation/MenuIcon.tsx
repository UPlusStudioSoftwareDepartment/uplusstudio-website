"use client";

import { m, useReducedMotion } from "framer-motion";
import { DURATION, EASE_MENU, MENU_MOTION } from "@/lib/motion";

export default function MenuIcon({ open }: Readonly<{ open: boolean }>) {
  const reduce = useReducedMotion();
  return (
    <span className="relative block h-5 w-7" aria-hidden>
      {[0, 1].map((line) => (
        <m.span
          key={line}
          className="absolute right-0 top-1/2 h-px w-full bg-current"
          initial={{
            rotate: 0,
            y: line ? 3 : -3,
            scaleX: line ? 0.67 : 1,
            x: line ? "16.5%" : "0%",
          }}
          animate={{
            rotate: open ? (line ? -45 : 45) : 0,
            y: open ? 0 : line ? 3 : -3,
            scaleX: open || !line ? 1 : 0.67,
            x: !open && line ? "16.5%" : "0%",
          }}
          exit={{
            rotate: 0,
            y: line ? 3 : -3,
            scaleX: line ? 0.67 : 1,
            x: line ? "16.5%" : "0%",
          }}
          transition={{
            duration: reduce ? DURATION.ui : MENU_MOTION.icon,
            ease: EASE_MENU,
          }}
        />
      ))}
    </span>
  );
}
