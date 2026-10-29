// Run against a production build. Install Lighthouse separately; no project dependency is needed.
// LIGHTHOUSE_MODULE may point to an installed lighthouse/core/index.js file.
import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const option = (name, fallback) => {
  const index = process.argv.indexOf(name);
  return index < 0 ? fallback : process.argv[index + 1] || fallback;
};
const base = option("--base", "http://localhost:3100");
const phase = option("--phase", "after");
const out = option("--out", `seo-audit/ultimate/lighthouse-${phase}`);
const moduleUrl = process.env.LIGHTHOUSE_MODULE ? pathToFileURL(process.env.LIGHTHOUSE_MODULE).href : import.meta.resolve("lighthouse");
const { default: lighthouse } = await import(moduleUrl);
const { default: desktopConfig } = await import(new URL("./config/desktop-config.js", moduleUrl));
const require = createRequire(process.env.LIGHTHOUSE_MODULE ? moduleUrl : import.meta.url);
const { launch } = require("chrome-launcher");
const sitemapResponse = await fetch(`${base}/sitemap.xml`);
if (!sitemapResponse.ok) throw new Error(`Sitemap HTTP ${sitemapResponse.status}`);
const paths = [...(await sitemapResponse.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => new URL(url).pathname);
const rows = [];
const profiles = option("--profiles", "mobile,desktop").split(",");
if (profiles.some((profile) => !["mobile", "desktop"].includes(profile))) throw new Error("Use --profiles mobile,desktop");
await mkdir(out, { recursive: true });
const chrome = await launch({ chromeFlags: ["--headless=new", "--no-first-run", "--disable-extensions"] });
const csv = (values) => values.map((row) => row.map((value) => JSON.stringify(value ?? "")).join(",")).join("\n") + "\n";
async function save() {
  await writeFile(`${out}/results.json`, JSON.stringify({ phase, base, measuredAt: new Date().toISOString(), runsPerUrl: 1, labOnly: true, rows }, null, 2));
  await writeFile(`${out}/results.csv`, csv([
    ["Path", "Profile", "Status", "Performance", "Accessibility", "Best practices", "SEO", "LCP ms", "CLS", "TBT ms", "Error"],
    ...rows.map((r) => [r.path, r.profile, r.status, r.performance, r.accessibility, r.bestPractices, r.seo, r.lcp, r.cls, r.tbt, r.error]),
  ]));
}
try {
  for (const path of paths) {
    for (const profile of profiles) {
      const row = { path, profile, status: "BLOCKED" };
      try {
        const result = await lighthouse(`${base}${path}`, {
          port: chrome.port,
          logLevel: "error",
          output: "json",
          onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
        }, profile === "desktop" ? desktopConfig : undefined);
        const { lhr } = result;
        if (lhr.runtimeError) throw new Error(`${lhr.runtimeError.code}: ${lhr.runtimeError.message}`);
        if (lhr.configSettings.formFactor !== profile) throw new Error(`Expected ${profile}, measured ${lhr.configSettings.formFactor}`);
        Object.assign(row, {
          status: "TESTED",
          lighthouseVersion: lhr.lighthouseVersion,
          formFactor: lhr.configSettings.formFactor,
          throttling: lhr.configSettings.throttling,
          performance: lhr.categories.performance.score,
          accessibility: lhr.categories.accessibility.score,
          bestPractices: lhr.categories["best-practices"].score,
          seo: lhr.categories.seo.score,
          lcp: lhr.audits["largest-contentful-paint"].numericValue,
          cls: lhr.audits["cumulative-layout-shift"].numericValue,
          tbt: lhr.audits["total-blocking-time"].numericValue,
          findings: Object.entries(lhr.audits).filter(([, audit]) => audit.score !== null && audit.score < 1).map(([id, audit]) => ({ id, title: audit.title, score: audit.score, displayValue: audit.displayValue })),
          warnings: lhr.runWarnings,
        });
      } catch (error) {
        row.error = String(error);
      }
      rows.push(row);
      await save();
      console.log(`${rows.length}/${paths.length * profiles.length} ${profile} ${path}: ${row.status} ${row.performance ?? row.error}`);
    }
  }
} finally {
  await save();
  await chrome.kill();
}
if (rows.some((row) => row.status === "BLOCKED")) process.exitCode = 1;
