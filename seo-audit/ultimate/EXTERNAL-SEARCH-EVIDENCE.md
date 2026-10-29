# External search evidence — 29 October 2026

## Search Console — current company profile, read only

Chrome's native UI identifies the `Uplus` profile and the company account requested by AGENTS.md. The domain property `uplusstudio.com.tr` is accessible. After the user explicitly requested indexing all eligible pages, a request for `/tr/services` was attempted. Google rejected it because the account's daily quota was already exceeded. No successful submission is claimed; quota is not bypassed. No validation requests, exports, sharing or account-setting mutations were performed.

| View / URL | Observation | Meaning |
|---|---|---|
| Overview | 53 total web search clicks; 6 not indexed / 0 indexed in aggregate | Aggregate snapshot, not a current per-URL conclusion |
| Page indexing | Last update 23 October 2026; six `Not found (404)` examples; validation already started 28 October | Older crawl data predating current checks |
| https://www.uplusstudio.com.tr/tr | URL Inspection: `URL is on Google`; `Page is indexed`; `No video indexed`; one valid video item | GOOGLE_VERIFIED_INDEXED for the page; no video-index claim |
| https://www.uplusstudio.com.tr/en | URL Inspection: `URL is on Google`; `Page is indexed`; `1 video indexed`; one valid review item in the stored crawl | GOOGLE_VERIFIED_INDEXED and VIDEO_VERIFIED_INDEXED for the stored English crawl, not proof of current markup or future serving |
| https://www.uplusstudio.com.tr/tr/about | URL Inspection: `URL is on Google`; `Page is indexed` | GOOGLE_VERIFIED_INDEXED |
| https://www.uplusstudio.com.tr/tr/services | URL Inspection: `URL is not on Google`; `URL is unknown to Google` | Not indexed in the inspected Google snapshot; current HTTP/indexability tested separately |
| https://www.uplusstudio.com.tr/tr/projects/villa-donusumu/video | URL Inspection: `Discovered - currently not indexed`; sitemap shown as discovery source | Known to Google; no claim of page/video indexing |
| https://www.uplusstudio.com.tr/tr/services/incek-golbasi-mimarlik-ofisi | URL Inspection: `Discovered - currently not indexed`; sitemap shown | Known to Google; not yet indexed |
| Submitted sitemaps | `/sitemap.xml`: Success; submitted/read 28 October; 56 discovered pages and 18 discovered videos in Google's stored report | Successful discovery is distinct from indexing; stored video count is not current sitemap inventory |
| Request indexing `/tr/services` | `Sorry--we couldn't process this request because you've exceeded your daily quota. Please try submitting this again tomorrow.` | BLOCKED_DAILY_QUOTA; retry no earlier than 30 October subject to Google's quota reset |
| Sitemap resubmission after explicit indexing authorization | Google dialog: `Sitemap submitted successfully` for `https://www.uplusstudio.com.tr/sitemap.xml` | Submission accepted on 29 October; not proof that all 56 URLs are indexed |
| Core Web Vitals overview | Mobile and desktop: `No data` | Field p75 INP/LCP/CLS unavailable; Lighthouse is laboratory evidence only |

The six older 404 examples are the four HTTP/HTTPS apex/www root variants and `https://uplusstudio.com.tr/en`, `https://uplusstudio.com.tr/tr`. All six were fetched in this task and now reach HTTP 200 on the preferred www locale URL. They should not be changed to return 200 at every variant: preferred redirects are intentional.

The English video's existing indexing changed the implementation decision: its sitemap/VideoObject signals are retained; the missing HTML source is corrected instead of removing indexed content. The older English crawl's review enhancement is recorded as historical evidence; it is not copied into current JSON-LD.

All 56 sitemap URLs were individually inspected through the verified company browser in this run. `GOOGLE-INDEX-STATUS.csv` records the complete result: 12 pages indexed, 23 discovered but currently not indexed, 21 unknown to Google in URL Inspection. Three URL inspections report one indexed video each: `/en` and both locale versions of `/projects/konut-uygulama/video`. The 44 remaining URLs are listed in priority order in `INDEXING-REQUEST-QUEUE.csv`; their requests were not successfully submitted because of the observed daily quota. These are snapshots of Google's stored index state, not live tests or guarantees. Previous repo reports are historical references, not substitute evidence for fresh checks.

## Bing / AI / local presence

- Bing Webmaster account reports and Bing Places: NOT_RUN in this run. Existing repository reports are retained without restating their results as new observations.
- ChatGPT Search / Perplexity / Copilot citation experiments: NOT_RUN in this run. A web search result is not evidence of those products citing the site.
- Keyword rank, Local Pack position and search volumes: UNVERIFIED unless individually recorded with locale/date/device. No ranking gain is claimed.
- Company address/services and the engineering-scope questions remain governed by `seo-local-growth/ENTITY-FACT-SHEET.md` and `CONTENT-GAPS-AND-APPROVALS.md`. No new professional claims are inferred.

## Official sources checked for implementation

Accessed 29 October 2026:

- [Google video SEO](https://developers.google.com/search/docs/appearance/video): distinguish a prominent video/watch experience from supporting clips; HTML discovery and a stable thumbnail matter. An indexed page does not imply an indexed video.
- [Google AI features](https://developers.google.com/search/docs/appearance/ai-features): established SEO, accessible content and snippet/index eligibility apply; no special AI schema is required.
- [Localized versions](https://developers.google.com/search/docs/specialty/international/localized-versions): reciprocal, complete language alternatives; preserve existing self canonicals and x-default.
- [OpenAI crawler documentation](https://developers.openai.com/api/docs/bots): search, training and user-triggered access are separate purposes. Existing robots choices are preserved.
- Installed Next.js guide: `node_modules/next/dist/docs/01-app/01-getting-started/14-metadata-and-og-images.md` read before edits.

## Daily follow-up and measurement schedule

The user explicitly approved daily follow-up in this chat. Active heartbeat `u-studio-g-nl-k-indeks-takibi` was created through the app automation tool for 10:00 daily, starting with the next scheduled run (30 October 2026, Europe/Istanbul). It checks the existing company session, updates the per-URL queue, submits only eligible URLs when Google permits, respects quota/CAPTCHA/session limits, stays quiet on unchanged state, and reports meaningful changes or required action. It has no independent deployment authority. Local scheduled work requires the computer/app and the project to be available. All indexing remains Google's decision.

T0: 29 October 2026. Compare query/URL/country/device/search type and actual leads on 5 November (+7), 12 November (+14), 28 November (+30), 28 December (+60), 27 January 2027 (+90). Check the current URL Inspection state and the already-running 404 validation; compare video indexing independently. Do not infer causation from a few days of ranking changes.
