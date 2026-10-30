// Read-only verification of the six historical 404 examples shown in Search Console.
import { writeFile } from 'node:fs/promises';
const urls = ['https://www.uplusstudio.com.tr/', 'https://uplusstudio.com.tr/', 'http://uplusstudio.com.tr/', 'http://www.uplusstudio.com.tr/', 'https://uplusstudio.com.tr/en', 'https://uplusstudio.com.tr/tr'];
const rows = [];
for (const url of urls) {
  const chain = [];
  let current = url;
  try {
    for (let step = 0; step < 8; step++) {
      const response = await fetch(current, { redirect: 'manual', signal: AbortSignal.timeout(20000) });
      chain.push({ url: current, status: response.status, location: response.headers.get('location') });
      if (response.status >= 300 && response.status < 400 && response.headers.get('location')) {
        current = new URL(response.headers.get('location'), current).href;
        await response.body?.cancel();
        continue;
      }
      const html = await response.text();
      rows.push({ url, finalUrl: current, status: response.status, canonical: html.match(/<link rel="canonical" href="([^"]+)"/)?.[1], chain });
      break;
    }
  } catch (error) { rows.push({ url, chain, error: String(error) }); }
}
const report = { checkedAt: new Date().toISOString(), rows };
await writeFile('reports/performance/2026-10-29/live-redirects.json', JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
if (rows.length !== urls.length || rows.some((row) => row.status !== 200)) process.exitCode = 1;
