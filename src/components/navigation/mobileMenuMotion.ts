import type { Variants } from "framer-motion";
import {
  DURATION,
  EASE_MENU as MENU_EASE,
  EASE_OUT,
  MENU_MOTION,
} from "@/lib/motion";
type MenuMotion = Readonly<{
  root: Variants;
  mascots: Variants;
  panel: Variants;
  photo: Variants;
  link: (index: number) => Variants;
  number: (index: number) => Variants;
  footer: Variants;
}>;
export function getMobileMenuMotion(
  reduce: boolean,
  linkCount: number,
): MenuMotion {
  const openDuration = reduce ? DURATION.ui : MENU_MOTION.open;
  const closeDuration = reduce ? DURATION.ui : MENU_MOTION.close;
  return {
    root: {
      initial: { opacity: 0 },
      open: { opacity: 1, transition: { duration: reduce ? DURATION.ui : 0.24, ease: EASE_OUT } },
      closed: {
        opacity: 0,
        transition: {
          duration: closeDuration,
        },
      },
    },
    mascots: {
      initial: { opacity: 0, scale: reduce ? 1 : 0.97 },
      open: {
        opacity: 1,
        scale: 1,
        transition: {
          duration: DURATION.overlay,
          delay: reduce ? 0 : MENU_MOTION.linkDelay,
        },
      },
      closed: { opacity: 0, transition: { duration: DURATION.ui } },
    },
    panel: {
      initial: { y: reduce ? 0 : -18 },
      open: {
        y: 0,
        transition: {
          duration: openDuration,
          ease: EASE_OUT,
        },
      },
      closed: {
        y: reduce ? 0 : -8,
        transition: { duration: closeDuration, ease: MENU_EASE },
      },
    },
    photo: {
      initial: { opacity: 0 },
      open: {
        opacity: 1,
        transition: {
          duration: reduce ? DURATION.ui : MENU_MOTION.photo,
        },
      },
      closed: { opacity: 0, transition: { duration: DURATION.ui } },
    },
    link: (i: number) => ({
      initial: {
        y: reduce ? 0 : 16,
        opacity: reduce ? 1 : 0,
      },
      open: {
        y: 0,
        opacity: 1,
        transition: {
          duration: reduce ? 0 : MENU_MOTION.link,
          ease: EASE_OUT,
          delay: reduce ? 0 : MENU_MOTION.linkDelay + i * MENU_MOTION.stagger,
        },
      },
      closed: {
        y: reduce ? 0 : -8,
        opacity: 0,
        transition: {
          duration: reduce ? 0 : DURATION.ui,
          delay: reduce ? 0 : (linkCount - 1 - i) * 0.015,
          ease: MENU_EASE,
        },
      },
    }),
    number: (i: number) => ({
      initial: { opacity: reduce ? 1 : 0 },
      open: {
        opacity: 1,
        transition: {
          duration: DURATION.ui,
          delay: reduce
            ? 0
            : MENU_MOTION.linkDelay + i * MENU_MOTION.stagger + 0.1,
        },
      },
      closed: {
        opacity: 0,
        transition: { duration: DURATION.ui },
      },
    }),
    footer: {
      initial: { opacity: reduce ? 1 : 0, y: reduce ? 0 : 12 },
      open: {
        opacity: 1,
        y: 0,
        transition: {
          duration: reduce ? 0 : DURATION.overlay,
          delay: reduce ? 0 : 0.2,
          ease: EASE_OUT,
        },
      },
      closed: {
        opacity: 0,
        y: 0,
        transition: { duration: DURATION.ui },
      },
    },
  };
}
