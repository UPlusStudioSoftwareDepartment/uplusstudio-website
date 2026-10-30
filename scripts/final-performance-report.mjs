import {readFile,writeFile} from 'node:fs/promises';
import {summarize} from './lighthouse-results.mjs';
const before=JSON.parse(await readFile('reports/performance/2026-10-29/summary.json','utf8'));
const root='reports/performance/2026-10-30';
let samples=[];
let buildId='UNVERIFIED';
for(const folder of ['video-after','video-after-repeat','current-home']) {
 const raw=await readFile(`${root}/${folder}/results.json`,'utf8').catch(()=>null);
 if(!raw)continue;
 const r=JSON.parse(raw);
 if(buildId!=='UNVERIFIED'&&buildId!==r.buildId)throw new Error('Different current builds');
 buildId=r.buildId;
 samples.push(...r.samples.map(s=>({...s,source:folder})));
}
const rows=before.rows.map(old=>{
 const current=samples.filter(s=>s.path===old.path&&s.profile===old.profile);
 const changed=old.path==='/tr'||old.path==='/en'||old.path.endsWith('/video');
 const value=current.length?summarize(current,current.length)[0]:changed?{...old,status:'UNVERIFIED',runs:0}:old;
 return {before:old,after:value,buildId:changed?buildId:before.buildId,scope:changed?'Changed route: current build':'Unchanged source: prior build evidence'};
});
const p=x=>Number.isFinite(x)?Math.round(x*100):'—';
const ms=x=>Number.isFinite(x)?Math.round(x):'—';
const text=`# Son performans kapsamı — 30 Ekim 2026\n\nÖnceki kapsam: 64 public URL × mobil/masaüstü = 128 satır; build ${before.buildId}. Sonradan değişen ana sayfa ve sekiz video URL'si yeni ${buildId} derlemesinde ayrı ölçüldü. Değişmeyen 54 URL'nin önceki kanıtı korunur; bunlar yeni build'de yeniden ölçülmüş sayılmaz. Bütün indekslenebilir URL'ler ayrıca güncel build ve canlı sürümde HTTP/SEO taramasından geçti.\n\nAynı satırın farklı build örnekleri medyana karıştırılmaz. Tek koşu kararlı medyan kanıtı değildir; üç tekrar olan satırlar Koşu sütununda gösterilir. Eski trace hatasının başarılı tekrarları ayrı kayıtta; ilk hata silinmedi.\n\n| URL | Mod | Önce P | Son P/A/BP/SEO | Son LCP ms | Son TBT ms | Koşu | Build / kapsam | Durum |\n|---|---|---:|---|---:|---:|---:|---|---|\n${rows.map(r=>`| ${r.after.path} | ${r.after.profile} | ${p(r.before.performance)} | ${[r.after.performance,r.after.accessibility,r.after.bestPractices,r.after.seo].map(p).join('/')} | ${ms(r.after.lcp)} | ${ms(r.after.tbt)} | ${r.after.runs} | ${r.buildId} / ${r.scope} | ${r.after.status} |`).join('\n')}\n\nKartvizit bilinçli noindex; sayısal SEO skoru saklanır ama indekslenme eşiği NOT_APPLICABLE. DevTools kısıtlaması ayrı video-after-devtools klasöründe; bu tabloya karıştırılmaz. Gerçek cihaz/saha INP ve üretim TTFB kazanımı iddia edilmez.\n\nPoster byte kanıtı: 58.584 → 41.549 byte (yaklaşık %29,1 daha az), 1280×716 boyut korunuyor. Orijinal ve optimize PNG'ler manuel karşılaştırıldı; belirgin kalite farkı görülmedi. Bu, kayıpsız sıkıştırma veya bütün videolarda aynı yüzde kazanım iddiası değildir. JSON: poster-byte-proof.json. AVIF ve WebP yanıtları ve gerçek oynatma E2E testlerinden geçti.\n\nYerel son SEO: 62 URL, 65 görsel, 5 video, 0 hata / 1 mevcut /de uyarısı. Canlı HTTP/SEO aynı sayılarda temiz; live-current-release.json f587dbd sürümünü doğrular. Yeni poster kodu yerel çalışma ağacında, production'a bu çalışma tarafından yayımlanmadı.\n`;
await writeFile(`${root}/FINAL-PERFORMANCE.md`,text);
await writeFile(`${root}/final-performance.json`,JSON.stringify({generatedAt:new Date().toISOString(),currentBuild:buildId,priorBuild:before.buildId,rows},null,2));
console.log({rows:rows.length,currentSamples:samples.length,unverified:rows.filter(r=>r.after.status==='UNVERIFIED').length,failed:rows.filter(r=>r.after.status==='FAIL').map(r=>[r.after.path,r.after.profile,r.after.performance])});
