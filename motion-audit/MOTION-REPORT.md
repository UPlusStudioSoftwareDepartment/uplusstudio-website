# Motion, loading & page transitions — audit and changes (29 Oct 2026)

Follow-up: [COMPLETION-REPORT.md](COMPLETION-REPORT.md) covers the final mobile curtain, static page/global 404 fix, representative phone tests, and measured limitations. The sections below retain the earlier baseline and findings.

One report instead of six: audit, motion system, transition matrix, before/after, browser results and changelog. The code inventory is in [INVENTORY.md](INVENTORY.md); raw numbers are in `before.json`, `before-slow.json`, `after.json`, `after-flows.json` (the baseline navigation/flow run stopped on a script bug before writing JSON; its numbers come from that run's log).

**How it was measured:** `node scripts/motion-audit.mjs --label <name>` against a local production build (`npm run build && npm run start -- -p 3100`). Headless Chromium (software raster, CPU throttling via CDP) and Playwright WebKit on Windows. Read every number as *old vs new on the same machine*, never as a real phone's frame rate. No physical phone was tested.

## Problems found (by priority)

| P | Problem | Evidence | Status |
|---|---|---|---|
| P0 | Idle pages never rest: the mascots' looping animations write SVG styles ~330×/s even when the mascots are off screen, and the home film's progress bar runs a rAF loop forever, even when stopped | 60 style recalcs + 60 layouts per second and 85–122 ms/s main-thread time on every measured page, doing nothing | **Fixed**: loops run only while the mascot is on screen; the progress loop runs only while the film plays |
| P1 | Back/Forward slid from the top to the old position (~0.5 s) because of the global `html { scroll-behavior: smooth }` | traced: native restore animated from 0; no script involved | **Fixed**: no global smooth scroll; smooth stays opt-in where the code asks for it (back-to-top respects reduced motion) |
| P1 | A tap could freeze the screen for up to 1.3 s on a slow network: the view transition waited up to 1.2 s for the next route, with no feedback | Slow 4G + 4× CPU: longest frame gap after a tap 1317 / 1217 / 1333 ms | **Fixed**: cap 600 ms, plus a 2 px clay line at the top while a page change is pending (only after 150 ms, so fast changes never show it). Worst gap now 917 ms |
| P1 | Rapid double tap left an unhandled `AbortError` (skipped view transition) in the console, which can reach client error reporting | console errors in Chromium and WebKit | **Fixed**: the skipped transition's promises are caught |
| P2 | Header dimmed and shrank with the page during transitions | visual | **Fixed**: the header has its own `view-transition-name` and stays put (or slides back in if it was hidden) |
| P2 | Long waits before reading: line reveals 1 s + 0.09 s/line, image masks 1.2/1.6 s, mobile menu 0.8 s + links from 0.3 s (last link at ~1.35 s), page fade 0.5 s, which also blocks taps | timings in code | **Tuned** (still cinematic): lines 0.8 s + 0.08 s/line, fades 0.7 s, masks 1.0/1.3 s, menu 0.6 s with links from 0.2 s, page fade 0.4 s |
| P2 | Same easing curves copied into ten files | grep | **Centralised** in `src/lib/motion.ts` + CSS variables |
| — | Backdrop glow blur, grain blend, blurred photo frames, nav blur suspected as scroll cost | A/B switching each off: differences within run-to-run noise | **Kept**: no evidence they cause jank |
| P1 | `html { overscroll-behavior: none }` disabled pull-to-refresh and the iOS rubber band | code | **Fixed (second round)**: native overscroll back; `html` carries the dark ground so the bounce area never flashes light |
| P1 | Every 404 showed a bare page with no header or footer: unmatched URLs and `notFound()` both fall back to the root `app/not-found.tsx`, which sits outside the locale layout | live site: `nav` 0 on `/tr/bu-sayfa-yok` and `/tr/projects/yok` | **Fixed (second round)**: the layout's providers + header/main/footer became `SiteFrame`, used by the layout and by the root 404, which now shows the locale 404 in the language of the path (`/en/…` → English). Unmatched URLs are fully server-rendered; for routes that call `notFound()` (unknown slug, `/maintenance`) Next 16 sends its empty recovery shell and the browser draws the same page — status 404 and `noindex` are in the response either way |
| P1 | Content hidden until JavaScript runs: the 12 project cards on `/tr/projects` were in the HTML at `opacity:0` (animated in on mount), as were the 404 texts and the mascot speech bubbles; scroll reveals (`FadeUp`, line and image masks, 35+ blocks on About) never appear without JavaScript | server HTML: `style="opacity:0…"` counts per page | **Fixed (second round)**: project grid renders its final state first (`AnimatePresence initial={false}`; filter changes still fade); 404 and speech bubble use CSS keyframes like the page headers; a `<noscript>` style shows the end state of every scroll reveal when JavaScript is off (reveals unchanged with JavaScript) |
| — | Header icon tooltips stick out past the right edge on desktop | Chrome sweep | **No change needed**: hidden at rest, `html` clips x-overflow, and `keepTipOnScreen` shifts each tooltip onto the screen when it appears |

Checked and fine: no CLS on any of the 59 routes (0 in both engines), headings render without waiting for JS, reduced motion shows all text immediately and every flow still works, the first-visit curtain lifts (about 2.4 s) and does not replay in the session, the menu locks and unlocks scroll and closes on navigation, the project detail opens at the top.

## Motion system (`src/lib/motion.ts`, `globals.css`)

| Token | Value | Used for |
|---|---|---|
| `EASE_STUDIO` / `--ease-studio` | `cubic-bezier(0.76, 0, 0.24, 1)` | masks, line reveals, page-level moves |
| `EASE_OUT` / `--ease-out-studio` | `cubic-bezier(0.22, 1, 0.36, 1)` | fades, rises, UI feedback |
| `EASE_MENU` | `cubic-bezier(0.65, 0, 0.35, 1)` | menu circle, curtain |
| `DURATION.ui` | 0.2 s | small UI feedback |
| `DURATION.overlay` | 0.3 s | modal fades |
| `DURATION.menu` | 0.6 s (close ×0.75) | mobile menu |
| `DURATION.fade` | 0.7 s | `FadeUp`, menu footer |
| `DURATION.line` / `--duration-line` | 0.8 s | `LineReveal` (JS and CSS variants) |
| `DURATION.mask` | 1.0 s (scale ×1.3) | `MaskReveal` |
| `--duration-page` | 0.4 s | view-transition fade, header group |

Rules: only `transform`/`opacity` for moving things; looping decoration must pause off screen; reduced motion: no curtain, no view transition, no loops, content visible at once (global CSS rule + `motion-reduce:` overrides). Hero settles (2–2.4 s) and the first-visit curtain are unchanged.

## Before / after

**Main thread while the page sits idle** (Chromium, ms of task time per second · style recalcs per second):

| Page | Phone before | Phone after | Desktop before | Desktop after |
|---|---|---|---|---|
| /tr top (hero mascots visible) | 103 · 60 | 100 · 60 | 115 · 60 | 95 · 60 |
| /tr middle | 105 · 60 | **3 · 3** | 92 · 60 | **1 · 0** |
| /tr/projects top | 122 · 60 | **1 · 2** | 85 · 60 | **0 · 0** |
| /tr/projects middle (mascots visible) | 118 · 60 | 108 · 60 | 121 · 60 | **6 · 0** |
| /tr/about top | 116 · 60 | **3 · 2** | 87 · 60 | **0 · 0** |
| /tr/about middle | 122 · 60 | **2 · 2** | 110 · 60 | **0 · 0** |

Where mascots are on screen they still animate, by design.

**Scroll frames**, the same scripted scroll on both, alternating live site (old code) and local build, 3 runs each, avg frame ms / share of frames over 25 ms:

| Page | Phone 4× CPU old | Phone 4× CPU new | Desktop 1× old | Desktop 1× new |
|---|---|---|---|---|
| /tr/projects | 26.8 / 58 % | **23.9 / 41 %** | 49.8 / 90 % | 48.8 / 89 % |
| /tr/about | 29.4 / 70 % | **24.9 / 47 %** | 39.7 / 91 % | 39.8 / 89 % |
| /tr/projects/villa-donusumu | 19.5 / 16 % | **17.7 / 6 %** | 39.8 / 90 % | 38.9 / 89 % |

The desktop numbers are the headless software rasteriser painting large photos, identical for old and new code; a GPU-backed browser does not have that cost. Note: the first `before.json` scroll run is not comparable, because the old global smooth scroll turned the scripted `scrollTo` into smooth scrolls.

**Navigation, click → new page usable** (Chromium): desktop 117–263 ms before, 119–179 ms after; phone 4× CPU 253–959 ms after (before: only 3 of 8 pairs ran, a script bug). **Slow 4G, longest frozen gap after a tap:** before 300–1333 ms, after 367–917 ms.

## Route transition matrix (all PASS unless noted)

| Flow | Chromium | WebKit |
|---|---|---|
| home → projects, projects → detail, detail → next detail, detail → projects, about → services, services → contact, contact → glossary, home → service landing | PASS | PASS (slow engine: 0.8–6.9 s per page on this Windows build) |
| detail opens at top | PASS | PASS |
| Back restores list scroll instantly | PASS (1600 → 1600) | PASS (1600 → 1570) |
| Forward | PASS | PASS |
| menu → page: closes, unlocks scroll, top | PASS | PASS |
| rapid double navigation lands on the last tap, no stuck overlay, no console error | PASS | PASS |
| reduced motion: text visible, navigation works | PASS | PASS |
| first-visit curtain lifts / no replay | PASS | PASS |
| cold load of 59 routes: h1 visible, CLS 0, no stuck overlay | PASS (phone + desktop) | PASS (phone) |

## Coverage

| Scope | Total | Tested | PASS | FAIL | BLOCKED / NOT_RUN |
|---|---:|---:|---:|---:|---:|
| Real pages (cold load) | 59 | 59 | 59 | 0 | token pages, maintenance NOT_RUN |
| Route transition pairs | 8 | 8 | 8 | 0 | 0 |
| Flows (back/forward, menu, rapid, reduced motion, curtain) × 2 engines | 20 | 20 | 20 | 0 | 0 |
| Viewports (320, 390, 820, 1366, 1440, 2560) | 6 | 6 | see Chrome sweep below | | |
| Browsers | 4 | 4 | | | Locally: Chromium headless, WebKit, your Chrome. Firefox cannot start on this PC (Windows 10.0.26200 refuses its `mozglue` side-by-side assembly, even after a fresh `playwright install --force firefox`), so Firefox runs in GitHub CI instead: the e2e suite covers Chrome, Edge, Firefox (windows-2025) and Safari, iPhone, iPad (macos-15). Real iOS/Android hardware NOT_RUN |
| Playwright e2e suite | — | — | — | — | NOT_RUN locally by your rule. CI on `36111eb`: lint-and-build, e2e Windows (Chrome/Edge/Firefox), e2e macOS (Safari/iPhone/iPad), production smoke — all success. New `e2e/motion.spec.ts` (idle mascots, instant Back, rapid taps, pending line, 404 frame) runs there on every push |

## Chrome (Claude extension) sweep, your real Chrome

The window was maximised at 2560 px and could not be resized, so 320/390/820/1366/1440 ran in a same-origin iframe of that exact width (media queries follow the frame), with real mouse clicks inside it. Chrome kept the window in the background at ~1 frame/s, so frame timing there is BLOCKED; functional and visual checks are valid.

| Check | Result |
|---|---|
| 11 pages × 5 widths (home, projects, detail, about, services, a service landing, contact, glossary, kartvizit, an English film page, 404) + home at 2560 | 56/56 PASS: no horizontal page overflow, h1 visible, no hidden text on screen |
| Menu button only below lg (320/390/820 yes, 1366/1440 no) | PASS |
| 390: real tap opens menu, focus on "Kapat", scroll locked; tap "Hakkımızda" → /tr/about, menu closed, scroll unlocked, top of page | PASS |
| 820: menu opens, Escape closes, focus back on the menu button | PASS |
| 1366: header "Projeler" → list → card → detail; opens at top; header keeps `site-nav` | PASS |
| Mascots: 0 style writes while off screen, animate in view, stop again when scrolled away | PASS |
| Home film progress: ticks while playing, 0 writes after stop, keeps its position | PASS |
| Iframe history Back | PASS |
| Pending line renders (2 px clay, fixed top, grows) | PASS |
| Reduced motion in real Chrome | NOT_RUN (needs the OS setting); covered by the headless flows |

Side notes, not changed: the 404 page has no header on the live site either; a hidden social-icon tooltip in the desktop header sticks out past the right edge on film pages without causing scroll.

## Changelog

| File | Change |
|---|---|
| `src/components/mascots/Mascots.tsx` | loops only while on screen (`useInView`), rest on first keyframe off screen |
| `src/components/home/HomeHero.tsx` | progress rAF only while the film plays; final sync on pause/end |
| `src/components/studio/PageCurtain.tsx` | freeze cap 1200 → 600 ms, pending line state, catch skipped-transition promises, mark pending also without View Transitions |
| `src/app/globals.css` | no global smooth scroll, duration variables, page fade 0.5 → 0.4 s, header view-transition group, pending line |
| `src/app/[locale]/layout.tsx` | dropped `data-scroll-behavior` (no longer needed) |
| `src/components/NavigationOptimized.tsx` | header `view-transition-name`, menu 0.8 → 0.6 s, tokens |
| `src/components/studio/Reveal.tsx` | durations from tokens |
| `src/lib/motion.ts` | new: shared curves and durations |
| `src/components/studio/SiteFooter.tsx` | back-to-top respects reduced motion |
| 10 components | local easing copies → `@/lib/motion` / `ease-out-studio` |
| `scripts/motion-audit.mjs` | new measurement script |
| `src/components/SiteFrame.tsx` | new: providers + header/main/footer, shared by the locale layout and the root 404 |
| `src/app/not-found.tsx` | full site frame and the locale 404, language from the request |
| `src/app/[locale]/layout.tsx` | uses `SiteFrame` |
| `e2e/motion.spec.ts` | new e2e tests for the behaviour above |
| `src/components/ProjectsContent.tsx` | grid cards visible in the HTML (`initial={false}`) |
| `src/app/[locale]/not-found.tsx`, `src/components/mascots/Mascots.tsx` | 404 texts and speech bubble animate with CSS keyframes |
| `src/app/[locale]/layout.tsx` | `<noscript>` end state for scroll reveals |

Possible regressions to watch: the menu and reveals are a bit quicker (revert in `DURATION`); the header no longer fades during page changes; a page change slower than 600 ms finishes without the fade, under the pending line.
