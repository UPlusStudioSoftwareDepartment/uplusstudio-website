# Environment baseline — 29 October 2026

| Area | Observed value | Evidence | Scope | Status |
|---|---|---|---|---|
| Repository | Existing `main` branch; pre-existing audit edits and untracked `.claude/`, `motion-audit/final-2.json` | Initial `git status --short` | Local | CONFIRMED; preserved |
| Framework | Next.js 16.4.3 App Router, React 19, TypeScript, next-intl | Installed build output; package.json | Local production build | CONFIRMED |
| Package manager | npm; package-lock.json | Repository lockfile | Local | CONFIRMED |
| Localized routes | Turkish and English; 56 sitemap URLs, including 24 project details and 8 watch pages | live-before/audit.json; sitemap route | Current production | CONFIRMED |
| Canonical origin | https://www.uplusstudio.com.tr | Source metadata and HTTP crawl | Current production | CONFIRMED |
| Routing | Locale prefixes; self canonicals and reciprocal tr/en/x-default | live-before/URL-INVENTORY.csv | Current production | CONFIRMED |
| Media baseline | 60 unique discovered images, 54 search images, 4 distinct video files with HTTP sources | live-before/audit.json | Current production; HTML discovery only | CONFIRMED |
| Company browser | Existing Chrome `Uplus` profile; account matches AGENTS.md | Native Chrome UI and Google Account accessible name | Manual browser/account checks | CONFIRMED |
| Search Console | Domain property `uplusstudio.com.tr` accessible | Company browser, Overview and URL Inspection | Read only | CONFIRMED |
| Deployment | Existing Vercel workflow; no push/deploy performed in this task | Repository and user instructions | Production changes | NOT_RUN; requires separate approval |
| Test tools | ESLint, tsc, Vitest, Playwright, axe; Lighthouse 13.6.0 temporarily run from npm cache | Executed tools; package.json | Local | CONFIRMED |
| Local test server | Dedicated production server on port 3100; existing user development server on 3000 preserved | Next start output | Automated laboratory tests | CONFIRMED |

Automated Playwright/Lighthouse runs use disposable, signed-out laboratory browser contexts. These do not represent the company account or physical Android/iOS devices. Manual production/account checks use the verified existing company profile. No credentials, cookies or profile files are extracted.

## Initial checks

- Production HTTP crawl: 56 required pages, 60 image files, 4 video files accessible; zero FAIL and three WARN. Two warnings concern the home video missing an HTML source; one concerns `/de` redirecting before its final 404.
- Baseline lint: zero errors, one React Hook Form `watch` compatibility warning.
- Baseline TypeScript: passed.
- Baseline unit tests: sandbox attempt blocked by `spawn EPERM`; permitted rerun passed 115/115.
- Baseline production build: passed, 74 generated routes. Generated routes include API/private/404 pages, so 74 is not the number of indexable URLs.
- Lighthouse baseline: all 56 URLs × mobile/desktop queued sequentially. Actual results and coverage are recorded in `lighthouse-before/results.json`; partial rows must not be reported as full coverage.

## Priority and impact map

| ID | Priority | Evidence/root cause | Smallest correction | Regression check |
|---|---|---|---|---|
| SEO-01 | P1 | Home video in sitemap/JSON-LD has no HTML source; live-before crawler warnings | Add a native source child; retain viewport-based JS selection, preload=none and existing indexed video signals | HTTP crawl; home reduced-motion test |
| MEDIA-01 | P1 | InViewVideo only assigns src/poster after JS/scroll; reduced-motion users have no manual controls | Render stable source/poster and native controls; retain viewport loading/play/pause and preference handling | Video discovery, reduced motion, E2E |
| A11Y-01 | P1 | Fullscreen fallback has role=dialog but no focus trap/restoration | Reuse existing focus hook, focus close, pause original duplicate player | Forced fallback keyboard test |
| CONTENT-01 | P2 | Block line spans concatenate `behindyour` in DOM text | Insert semantic whitespace between lines | Exact heading text regression |
| FORM-01 | P2 | Deprecated form watch subscription triggers compiler lint warning | Existing form library subscribe API with unsubscribe cleanup | Lint; contact draft tests |
| QA-01 | P1 | Shared E2E route inventory covers only the first project and no watch pages | Generate all project/watch paths from existing data | Full route smoke and metadata tests |
| GSC-01 | P1 | Aggregate index report last updated 23 October shows old root-address 404s | Verify current HTTP and individual URL Inspection; do not change working routing based on stale aggregate data | External evidence report |
| PERF-01 | P1 | Watch-page Lighthouse baseline LCP around 4.3 seconds; metadata preload starts media loading before the visitor plays it | Keep discoverable source, controls and preloaded poster; defer the MP4 with preload=none | Repeat Lighthouse; on-demand playback tests for all four videos |
| SCHEMA-01 | P1 | JSON-LD replacement used a literal `<` as its own replacement, leaving script-termination sequences intact | Serialize `<` as a JSON Unicode escape | Round-trip and script-termination regression tests |

No unsupported city pages, fabricated project facts, ratings, office addresses, training-bot changes or new dependencies are introduced.
