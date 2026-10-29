# Motion & loading inventory (29 Oct 2026, before changes)

Stack found in the code: Next.js 16 App Router (SSG for every page route, `generateStaticParams`), React 19, next-intl, framer-motion 12 through `LazyMotion` + async `domMax`, Tailwind 4. No GSAP, Lenis, Swiper, AOS or Lottie. Page changes use the View Transition API through a capture-phase link handler in `PageCurtain.tsx`; Back/Forward stay native. Native scroll everywhere (no smooth-scroll library); `html { scroll-behavior: smooth }` with Next's `data-scroll-behavior="smooth"` so route changes jump instantly.

## Routes (59 checked)

`/tr` and `/en` × home, about, services, 5 service landings, projects, 12 project details, 4 project films (`/projects/<slug>/video`), contact, glossary, kvkk, kartvizit, plus a 404 (`/tr/bu-sayfa-yok`). The noindex token pages (`randevu-kart/[token]`, `randevu-yanit`) and `maintenance` need real tokens/state and were not loaded.

## Motion matrix

| Where | Component | Trigger | Motion | Duration / easing | Notes |
|---|---|---|---|---|---|
| All routes, first visit per session | `PageCurtain` | load | black U+/STUDIO curtain lifts bottom→top | waits for `load` + fonts, 0.9–2.6 s; lift 1.3 s `(0.65,0,0.35,1)` | overlay only, page HTML complete; CSS fallback lifts at 4 s without JS; hidden for reduced motion |
| All link clicks (same origin, other path) | `PageCurtain` → `navigateSmoothly` | click | View Transition: old page recedes (opacity .4, scale .985), new fades in | 0.5 s ease-out; update waits for new route commit, capped at 1.2 s | header was part of the root snapshot |
| Every page | `NavigationOptimized` | scroll | hide on scroll down past 400 px, solid bar past 40 px | 0.5 s in-out; rAF-throttled passive listener | `backdrop-blur-md` on the solid bar |
| Phones/tablets | mobile menu | tap | circle clip-path reveal, links rise, footer fades | 0.8 s circle, links 0.8 s from 0.3 s + 0.05 s each, footer 0.7 s at 0.7 s | focus trap, Escape, scroll lock, closes on route change |
| Home hero | `HomeHero` | load | video settle scale, H1 line reveal, eyebrow/CTA rise | 2 s settle; lines 1 s from 0.35 s | film plays after `load`; progress bar rAF loop |
| Inner heroes | `PageHeader`, `ProjectDetail` | load | photo settle 1.08–1.12 → 1, line reveal, rise | 2.2–2.4 s settle; lines 1 s | CSS keyframes, paused while the curtain covers the page |
| Sections | `LineReveal` | in view | lines slide up out of a mask | 1 s in-out, +0.09 s per line | |
| Sections | `FadeUp` | in view | opacity 0→1, y 24→0 | 0.9 s ease-out | `motion-reduce` forces visible |
| Images | `MaskReveal` | in view | clip-path inset + scale 1.12→1 | 1.2 s clip, 1.6 s scale | gallery, about, services |
| About | `ScrubText` | scroll | word opacity 0.5→1 linked to scroll | per word `useTransform` | |
| Inner pages | `ArchitecturalBackdrop` | scroll | two 80 vw × 80 vh radial glows with `blur-3xl` move with scroll; fixed grain layer | linear to scroll | `mix-blend-mode: overlay` grain |
| Projects | grid / list / filter | click, hover | `layout` reflow, popLayout fades, cursor-following preview (spring) | 0.25–0.8 s | |
| Project cards, reels | hover | image scale 1.03 | 1.2–1.4 s ease-out | |
| Videos | `InViewVideo` | in view | poster at 600 px, src+play at 200 px, pause off screen | — | muted, playsInline, `.catch` on play |
| Before/after | `BeforeAfter` | drag/keys | clip-path follows pointer | immediate | horizontal-intent touch slop 8 px, `touch-pan-y` |
| Modals | Showcase, Services, Appointment, Founder, Fullscreen | open/close | fade + rise | 0.3–0.6 s | focus trap/return, scroll lock, Escape |
| Mascots | `Mascots.tsx` (hero, menu, 9 pages) | always | ~7 infinite loops per mascot (breathe, sway, arm, smile, blush…) | 0.9–4.6 s loops | framer JS animations on SVG `<g>` |
| Services | marquee | always | 40 s linear translate | CSS | reduced motion stops it |
| Booking CTA | phone ring icon | always | ring + pulse | 2.6 s CSS | reduced motion stops it |

## Loading states

- No `loading.tsx` / Suspense fallbacks: every page route is static, so there is no data wait. No skeletons exist, none are needed.
- Images: `next/image` with `fill` inside fixed aspect boxes (no CLS), hero `priority` + `fetchPriority="high"`; `FramedImage` adds a 128 px blurred copy behind `object-contain` photos.
- Video: posters before play; the home film loads after `load`, other videos are lazy (`preload="none"`) until near the viewport.
- Fonts: `next/font` (self-hosted).
- Errors: `error.tsx`, `global-error.tsx`, `not-found.tsx` exist; client errors post to `/api/client-error`.
