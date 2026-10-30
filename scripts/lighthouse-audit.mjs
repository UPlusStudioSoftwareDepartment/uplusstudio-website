// Run against a production server. LIGHTHOUSE_MODULE can reuse an existing install.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { METRICS, summarize, toCsv } from './lighthouse-results.mjs';

const option = (name, fallback) => {
  const index = process.argv.indexOf(name);
  return index < 0 ? fallback : process.argv[index + 1] || fallback;
};
const base = option('--base', 'http://localhost:3300').replace(/\/$/, '');
const phase = option('--phase', 'after');
const out = option('--out', `reports/performance/${new Date().toISOString().slice(0, 10)}/${phase}`);
const runs = Number(option('--runs', '3'));
if (!Number.isInteger(runs) || runs < 1) throw new Error('--runs must be a positive integer');
const throttlingMethod = option('--throttling-method', 'simulate');
if (!['simulate', 'devtools'].includes(throttlingMethod)) throw new Error('Use --throttling-method simulate or devtools');
const profiles = option('--profiles', 'mobile,desktop').split(',');
if (new Set(profiles).size !== profiles.length || profiles.some((profile) => !['mobile', 'desktop'].includes(profile))) throw new Error('Use --profiles mobile,desktop');
const moduleUrl = process.env.LIGHTHOUSE_MODULE ? pathToFileURL(process.env.LIGHTHOUSE_MODULE).href : import.meta.resolve('lighthouse');
const { default: lighthouse } = await import(moduleUrl);
const { default: desktopConfig } = await import(new URL('./config/desktop-config.js', moduleUrl));
const require = createRequire(process.env.LIGHTHOUSE_MODULE ? moduleUrl : import.meta.url);
const { launch } = require('chrome-launcher');
const sitemapResponse = await fetch(`${base}/sitemap.xml`);
if (!sitemapResponse.ok) throw new Error(`Sitemap HTTP ${sitemapResponse.status}`);
const extraPaths = option('--extra-paths', '').split(',').filter(Boolean);
if (extraPaths.some((path) => !path.startsWith('/') || path.startsWith('//') || path.includes('?') || path.includes('#'))) throw new Error('--extra-paths must contain local paths without query or hash');
const sitemapPaths = [...(await sitemapResponse.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => new URL(url).pathname);
const inventory = [...new Set([...sitemapPaths, ...extraPaths])];
const selectedPaths = option('--paths', '').split(',').filter(Boolean);
if (selectedPaths.some((path) => !inventory.includes(path))) throw new Error('Every --paths entry must appear in the sitemap or --extra-paths');
const paths = selectedPaths.length ? [...new Set(selectedPaths)] : inventory;
await mkdir(`${out}/raw`, { recursive: true });
const buildId = (await readFile(`${process.env.NEXT_DIST_DIR ?? '.next'}/BUILD_ID`, 'utf8').catch(() => 'UNVERIFIED')).trim();
const environment = { phase, base, buildId, throttlingMethod, runsPerUrl: runs, paths, profiles, labOnly: true, cache: 'cold (Lighthouse storage reset)', warmCache: 'UNVERIFIED', fieldINP: 'UNVERIFIED', startedAt: new Date().toISOString() };
let samples = [];
if (process.argv.includes('--resume')) {
  const saved = JSON.parse(await readFile(`${out}/results.json`, 'utf8'));
  if ((saved.throttlingMethod ?? 'simulate') !== throttlingMethod) throw new Error('Cannot resume a different throttling method');
  for (const key of ['phase', 'base', 'buildId', 'runsPerUrl', 'paths', 'profiles']) {
    if (JSON.stringify(saved[key]) !== JSON.stringify(environment[key])) throw new Error(`Cannot resume a different ${key}`);
  }
  samples = saved.samples;
}
async function save() {
  const rows = summarize(samples, runs);
  for (const path of paths) for (const profile of profiles) {
    if (!rows.some((row) => row.path === path && row.profile === profile)) {
      rows.push({ path, profile, status: 'UNVERIFIED', runs: 0, expectedRuns: runs });
    }
  }
  await writeFile(`${out}/results.json`, JSON.stringify({ ...environment, measuredAt: new Date().toISOString(), rows, samples }, null, 2));
  await writeFile(`${out}/results.csv`, toCsv([
    ['Path', 'Profile', 'Status', 'Runs', ...METRICS],
    ...rows.map((row) => [row.path, row.profile, row.status, row.runs, ...METRICS.map((key) => row[key])]),
  ]));
}
const chrome = await launch({ chromeFlags: ['--headless=new', '--no-first-run', '--disable-extensions'] });
try {
  environment.browser = (await (await fetch(`http://localhost:${chrome.port}/json/version`)).json()).Browser;
  for (const path of paths) {
    for (const profile of profiles) {
      for (let run = 1; run <= runs; run++) {
        if (samples.some((sample) => sample.path === path && sample.profile === profile && sample.run === run)) continue;
        const sample = { path, profile, run, status: 'BLOCKED', measuredAt: new Date().toISOString() };
        try {
          const result = await lighthouse(`${base}${path}`, {
            port: chrome.port, logLevel: 'error', output: ['json', 'html'], throttlingMethod,
            onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
          }, profile === 'desktop' ? desktopConfig : undefined);
          const { lhr } = result;
          const stem = `${path.replace(/^\//, '').replaceAll('/', '__')}-${profile}-${run}`;
          await writeFile(`${out}/raw/${stem}.json`, JSON.stringify(lhr));
          await writeFile(`${out}/raw/${stem}.html`, result.report[1]);
          if (process.argv.includes('--trace') && result.artifacts?.Trace) {
            await writeFile(`${out}/raw/${stem}.trace.json`, JSON.stringify(result.artifacts.Trace));
          }
          if (lhr.runtimeError) throw new Error(`${lhr.runtimeError.code}: ${lhr.runtimeError.message}`);
          if (lhr.configSettings.formFactor !== profile) throw new Error(`Expected ${profile}, measured ${lhr.configSettings.formFactor}`);
          if (lhr.configSettings.throttlingMethod !== throttlingMethod) throw new Error(`Expected ${throttlingMethod}, measured ${lhr.configSettings.throttlingMethod}`);
          const metric = (id) => lhr.audits[id]?.numericValue ?? null;
          Object.assign(sample, {
            status: 'TESTED', lighthouseVersion: lhr.lighthouseVersion, formFactor: lhr.configSettings.formFactor,
            throttling: lhr.configSettings.throttling, report: `raw/${stem}.html`,
            performance: lhr.categories.performance.score, accessibility: lhr.categories.accessibility.score,
            bestPractices: lhr.categories['best-practices'].score, seo: lhr.categories.seo.score,
            lcp: metric('largest-contentful-paint'), fcp: metric('first-contentful-paint'), cls: metric('cumulative-layout-shift'),
            tbt: metric('total-blocking-time'), speedIndex: metric('speed-index'), transferBytes: metric('total-byte-weight'),
            requests: lhr.audits['network-requests']?.details?.items?.length ?? null,
            mainThreadMs: metric('mainthread-work-breakdown'), ttfb: metric('server-response-time'),
            findings: Object.entries(lhr.audits).filter(([, audit]) => audit.score !== null && audit.score < 1).map(([id, audit]) => ({ id, title: audit.title, score: audit.score, displayValue: audit.displayValue })),
            warnings: lhr.runWarnings,
            diagnostics: {
              mainThread: lhr.audits['mainthread-work-breakdown']?.details?.items,
              scriptExecution: lhr.audits['bootup-time']?.details?.items,
              lcpBreakdown: lhr.audits['lcp-breakdown-insight']?.details,
              lcpDiscovery: lhr.audits['lcp-discovery-insight']?.details,
            },
          });
        } catch (error) { sample.error = String(error); }
        samples.push(sample);
        await save();
        console.log(`${samples.length}/${paths.length * profiles.length * runs} ${profile} ${path} #${run}: ${sample.status} ${sample.performance ?? sample.error}`);
      }
    }
  }
} finally {
  await save();
  await chrome.kill();
}
if (summarize(samples, runs).some((row) => row.status === 'BLOCKED' || (process.argv.includes('--assert') && row.status === 'FAIL'))) process.exitCode = 1;
