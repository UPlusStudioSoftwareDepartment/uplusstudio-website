import { readFile, writeFile } from 'node:fs/promises';
import { METRICS, summarize, toCsv } from './lighthouse-results.mjs';
const root = process.argv[2] ?? 'reports/performance/2026-10-29';
const primary = JSON.parse(await readFile(`${root}/all-pages/results.json`, 'utf8'));
const samples = primary.samples.map((sample) => ({ ...sample, source: 'all-pages' }));
for (const folder of ['repeats', 'retries', 'supplemental', 'helper-repeats', 'helper-retry']) {
  const raw = await readFile(`${root}/${folder}/results.json`, 'utf8').catch((error) => {
    if (error.code === 'ENOENT') return null;
    throw error;
  });
  if (!raw) continue;
  const result = JSON.parse(raw);
  if (result.buildId !== primary.buildId || result.base !== primary.base) throw new Error(`Different environment in ${folder}`);
  if ((result.throttlingMethod ?? 'simulate') !== (primary.throttlingMethod ?? 'simulate')) throw new Error(`Different throttling method in ${folder}`);
  const versions = new Set(primary.samples.filter((sample) => sample.lighthouseVersion).map((sample) => sample.lighthouseVersion));
  if (result.samples.some((sample) => sample.lighthouseVersion && !versions.has(sample.lighthouseVersion))) throw new Error(`Different Lighthouse version in ${folder}`);
  samples.push(...result.samples.map((sample) => ({ ...sample, source: folder })));
}
const rows = [];
const recoveredErrors = [];
const paths = [...new Set([...primary.paths, ...samples.map((sample) => sample.path)])];
for (const path of paths) for (const profile of primary.profiles) {
  const group = samples.filter((sample) => sample.path === path && sample.profile === profile);
  if (!group.length) rows.push({ path, profile, status: 'UNVERIFIED', runs: 0 });
  else {
    // A separate, successful retry may recover a trace failure; keep the first error in the evidence.
    const retry = group.some((sample) => ['retries', 'helper-retry'].includes(sample.source) && sample.status === 'TESTED');
    const firstErrors = group.filter((sample) => !['retries', 'helper-retry'].includes(sample.source) && sample.status === 'BLOCKED');
    const aggregate = retry ? group.filter((sample) => !firstErrors.includes(sample)) : group;
    if (retry) recoveredErrors.push(...firstErrors);
    rows.push(summarize(aggregate, aggregate.length)[0]);
  }
}
for (const row of rows.filter((row) => row.path.endsWith('/kartvizit'))) {
  row.seoStatus = 'NOT_APPLICABLE (intentional noindex)';
  if (row.status === 'FAIL' && row.performance >= 0.9 && row.accessibility >= 0.95 && row.bestPractices >= 0.95) row.status = 'PASS';
}
const unmeasured = rows.filter((row) => row.status === 'UNVERIFIED' || row.status === 'BLOCKED');
const failed = rows.filter((row) => row.status === 'FAIL');
const pct = (value) => Number.isFinite(value) ? String(Math.round(value * 100)) : '—';
const ms = (value) => Number.isFinite(value) ? String(Math.round(value)) : '—';
const text = `# Performans ve medya denetimi\n\nÜretim QA build: ${primary.buildId}; ${primary.browser}; Lighthouse ${[...new Set(samples.map((sample) => sample.lighthouseVersion).filter(Boolean))].join(', ')}. Yerel ${primary.base}; laboratuvar simülasyonu.\n\nDurum: ${rows.length - unmeasured.length}/${rows.length} URL/profil ölçüldü; ${unmeasured.length} eksik/engelli; ${failed.length} kategori eşiği altında. Her URL üç kez ölçülmedi: tam kapsama tek koşu, repeats klasöründeki seçilmiş mobil URL'lerde ek koşular. Tek koşu kararlı medyan kanıtı değildir. Ham kötü örnekler silinmez.\n\n| URL | Mod | Koşu | Önce | Final P/A/BP/SEO | LCP ms | CLS | TBT ms | Durum |\n|---|---|---:|---|---|---:|---:|---:|---|\n${rows.map((row) => `| ${row.path} | ${row.profile} | ${row.runs} | UNVERIFIED | ${[row.performance, row.accessibility, row.bestPractices, row.seo].map(pct).join('/')} | ${ms(row.lcp)} | ${row.cls ?? '—'} | ${ms(row.tbt)} | ${row.status} |`).join('\n')}\n\nÖnce sütunu: tüm URL'ler için eş sürümlü başlangıç ölçümü yok. before ve after-video dosyalarındaki 12.8.2 tanılaması 13.6.0 final ölçümleriyle doğrudan kazanım hesabına sokulmadı. Perde süresi deneyi fayda göstermedi ve geri alındı. repeats varsa aynı build/araç sürümündeki örneklerin medyanları kullanılır.\n\nHTTP/metadata/medya kanıtı: seo-final/audit.json ve URL/IMAGE/VIDEO-INVENTORY.csv. 62 indekslenebilir sayfa, 65 görsel (4 yeni SVG dahil), 5 benzersiz video erişilebilir; 0 hata, /de için 308 ardından 404 uyarısı. Fiziksel dosya envanteri: docs/marketing-growth/media-manifest.json.\n\nHam raporlar: all-pages/raw ve varsa repeats/raw / supplemental/raw; her örnek JSON ve HTML. FCP, Speed Index, transfer byte, istek sayısı, ana iş parçacığı ve TTFB değerleri SUMMARY.csv ve results.json içinde. Bunlar field INP değildir. Saha CWV, warm-cache ayrı karşılaştırması, gerçek cihaz ve production TTFB UNVERIFIED.\n\nGörsel kanıt: needs-tr/en-320/1440.png, process-tr/en-320/1440.png. 1440px ihtiyaç kartları ve 320px süreç görseli manuel incelendi; yedi genişlikte otomatik yükleme/taşma/link kontrolleri final E2E'de geçti. Teknik erişim telif ve proje uygulama/fotoğraf-render doğrulamasına eşit değildir.\n`;
const notes = `\nİlk trace hatalarından ayrı başarılı retry ile toparlanan örnek: ${recoveredErrors.length}. İlk hata kaynakları summary.json recoveredErrors ve all-pages içinde korunuyor.\n\nKartvizit yardımcı sayfaları varsa bilinçli noindex nedeniyle SEO eşiği NOT_APPLICABLE; gerçek sayısal SEO skorları tabloda değiştirilmeden korunur. Diğer üç kategori eşikleri geçerlidir. Bakım sayfası normal ortamda 404, özel imzalı yardımcı URL'ler public performans kapsamı dışındadır; hata/redirect davranışları SEO/E2E ile denetlenir.\n\nVarsayılan simülasyon ve DevTools kısıtlaması ayrı deneylerdir; video-diagnostic-devtools klasörü varsa sonuçları bu skor tablosuna karıştırılmaz. Tanı ve sınırlar VIDEO-PERFORMANCE-DIAGNOSIS.md içindedir.\n`;
await writeFile(`${root}/SUMMARY.md`, text + notes);
await writeFile(`${root}/SUMMARY.csv`, toCsv([['Path', 'Profile', 'Status', 'Runs', ...METRICS], ...rows.map((row) => [row.path, row.profile, row.status, row.runs, ...METRICS.map((key) => row[key])])]));
await writeFile(`${root}/summary.json`, JSON.stringify({ buildId: primary.buildId, generatedAt: new Date().toISOString(), planned: rows.length, measured: rows.length - unmeasured.length, failed: failed.length, unverifiedOrBlocked: unmeasured.length, recoveredErrors, rows }, null, 2));
await writeFile('docs/marketing-growth/22-media-performance-and-indexability-audit.md', (text + notes).replaceAll('seo-final/', '../../reports/performance/2026-10-29/seo-final/'));
console.log(JSON.stringify({ measured: rows.length - unmeasured.length, planned: rows.length, failed: failed.map((row) => [row.path, row.profile, row.performance]), unmeasured: unmeasured.length }));
