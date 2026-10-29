// The site's one motion language. globals.css mirrors the curves as --ease-studio / --ease-out-studio (Tailwind: ease-studio, ease-out-studio).
export const EASE_STUDIO = [0.76, 0, 0.24, 1] as const; // in-out: masks, line reveals, page-level moves
export const EASE_OUT = [0.22, 1, 0.36, 1] as const; // out: fades, rises, small UI feedback
export const EASE_MENU = [0.65, 0, 0.35, 1] as const; // the menu and the page curtain

export const MENU_MOTION = {
  open: 0.7,
  close: 0.37,
  layerDelay: 0.08,
  linkDelay: 0.18,
  stagger: 0.05,
  icon: 0.3,
  photo: 1.5,
} as const;

// Seconds. Reveals stay cinematic but short enough that text is readable while it settles.
export const DURATION = {
  ui: 0.2,
  overlay: 0.3,
  menu: 0.6,
  fade: 0.7,
  line: 0.8,
  mask: 1,
} as const;
