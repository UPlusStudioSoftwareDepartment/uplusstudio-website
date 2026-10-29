import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { chromium, webkit } from '@playwright/test';

const base = process.env.BASE_URL ?? 'http://localhost:3311';
const manifest = JSON.parse(await readFile('.next/prerender-manifest.json', 'utf8'));
const routes = Object.keys(manifest.routes).filter(path => /^\/(tr|en)(\/|$)/.test(path) && !path.includes('opengraph-image'));
const representative = routes.filter(path => /^\/(tr|en)(\/about|\/contact|\/services|\/projects|\/glossary)?$/.test(path));
const output = { base, at: new Date().toISOString(), checks: [], errors: [] };
await mkdir('motion-audit/layout', { recursive: true });
for (const [engine, screens, paths] of [
  [chromium, [320, 393, 768, 844, 1440, 2560], routes],
  [webkit, [320, 393, 844], representative],
]) {
  const browser = await engine.launch();
  for (const width of screens) {
    const context = await browser.newContext({ viewport: { width, height: width === 844 ? 390 : 900 }, reducedMotion: 'reduce' });
    await context.addInitScript(() => sessionStorage.setItem('u-curtain', '1'));
    const queue = [...paths];
    await Promise.all(Array.from({ length: 3 }, async () => {
      const page = await context.newPage();
      let phase = 'navigation';
      page.on('pageerror', error => output.errors.push({ url: page.url(), engine: engine.name(), phase, error: error.message }));
      while (queue.length) {
        const route = queue.shift();
        phase = 'navigation';
        const response = await page.goto(base + route, { waitUntil: 'networkidle' });
        await page.evaluate(() => document.fonts.ready);
        phase = 'inspection';
        const layout = await page.evaluate(() => ({
          width: innerWidth,
          documentWidth: document.documentElement.scrollWidth,
          lang: document.documentElement.lang,
          clippedHeadings: [...document.querySelectorAll('h1 span, h2 span, h3 span')].filter(el => !el.closest('.sr-only') && el.clientWidth > 0 && el.scrollWidth > el.clientWidth + 3 && getComputedStyle(el).overflowX === 'hidden').map(el => el.textContent.slice(0, 100)),
          overflowingText: [...document.querySelectorAll('main p, main dd, main h1, main h2, main h3')].filter(el => {
            const box = el.getBoundingClientRect();
            return box.width && box.height && el.scrollWidth > el.clientWidth + 2 && getComputedStyle(el).overflowX === 'visible';
          }).map(el => ({ text: el.textContent.slice(0, 100), width: el.clientWidth, content: el.scrollWidth })),
        }));
        const check = { engine: engine.name(), route, status: response.status(), ...layout };
        output.checks.push(check);
        if (width === 393 && engine === chromium) {
          await page.screenshot({ path: `motion-audit/layout/${route.slice(1).replaceAll('/', '-')}.png` });
        }
        if (layout.documentWidth > width + 1 || layout.overflowingText.length || layout.clippedHeadings.length) console.log('OVERFLOW', JSON.stringify(check));
      }
      phase = 'teardown';
      await page.close();
    }));
    await context.close();
    console.log(`${engine.name()} ${width}: ${paths.length} routes checked`);
  }
  await browser.close();
}
await writeFile('motion-audit/layout-audit.json', JSON.stringify(output, null, 2));
console.log(JSON.stringify({ checks: output.checks.length, errors: output.errors.length, overflow: output.checks.filter(c => c.documentWidth > c.width + 1 || c.overflowingText.length || c.clippedHeadings.length).length }));
