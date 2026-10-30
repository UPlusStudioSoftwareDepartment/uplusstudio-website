import { mkdir, readdir, stat, writeFile } from 'node:fs/promises';
import { projects, screenPoster } from '../src/lib/projects.ts';
import { SERVICE_LANDINGS } from '../src/lib/serviceLandings.ts';
import { guides } from '../src/lib/guides.ts';

const out = 'docs/marketing-growth';
await mkdir(out, { recursive: true });
const rows = [];
for (const locale of ['tr', 'en']) {
  const page = (path, type, title, question, evidence, cta) => rows.push({ path: `/${locale}${path}`, locale, type, title, question, evidence, cta, owner: 'U+ Studio; içerik sorumlusu işletme tarafından atanmalı', measurement: 'PLAN: sayfa → ilgili proje/hizmet → telefon; görüşme niteliği anonim manuel kayıt' });
  page('', 'home', 'U+ Studio', 'Bana uygun hizmet ve benzer proje hangisi?', 'Mevcut kurucu bilgisi, portföy, dört ihtiyaç yolu ve süreç', 'tel:+905453204007');
  page('/about', 'about', 'U+ Studio ekibi', 'Kiminle çalışacağım?', 'Mevcut kurucu tanıtımı; yeni yeterlilik iddiası yok', 'tel:+905453204007');
  page('/services', 'services', 'Hizmetler', 'Tasarım, çizim ve uygulama kapsamı nedir?', 'Mevcut hizmet kataloğu ve süreç metni', 'Hizmet detayı → telefon');
  for (const service of SERVICE_LANDINGS) page(`/services/${service.slug}`, 'service', service.copy[locale].title, service.copy[locale].forWho.join('; '), `${service.copy[locale].scope.join('; ')}; portföy: ${service.projects.join(', ')}`, 'İlgili proje / teklif rehberi → telefon');
  page('/projects', 'portfolio', 'Projeler', 'Benzer ihtiyaca hangi örnek uyuyor?', 'Mevcut proje kategorileri ve kalıcı detay bağlantıları', 'Proje detayı');
  for (const project of projects) {
    page(`/projects/${project.slug}`, 'project', project.title[locale], project.tagline[locale], `${project.description[locale]} Kaynak: src/lib/projects.ts; bağımsız saha/telif doğrulaması yok.`, 'İlgili hizmet → telefon');
    if (project.video) page(`/projects/${project.slug}/video`, 'video', project.title[locale], 'Projeyi hareket halinde nasıl inceleyebilirim?', `${project.video.src}; poster: ${screenPoster(project.video)}; VideoObject mevcut modelden`, 'Proje detayına dön');
  }
  page('/guides', 'guide-index', 'Rehberler', 'Görüşmeye ve teklif karşılaştırmaya nasıl hazırlanırım?', 'İki özgün editoryal rehber; müşteri araştırması sonucu olarak sunulmaz', 'Rehber detayı');
  for (const guide of guides) page(`/guides/${guide.slug}`, 'guide', guide.copy[locale].title, guide.copy[locale].description, guide.copy[locale].sections.map((section) => section.title).join('; '), `Hizmet: ${guide.service}; proje: ${guide.project}; telefon`);
  page('/contact', 'contact', 'İletişim', 'Nasıl başlarım, hangi bilgileri paylaşmalıyım?', 'studio-info.ts, mevcut form ve gizlilik açıklaması', 'Telefon / WhatsApp / e-posta / mesaj formu');
  page('/glossary', 'glossary', 'Sözlük', 'Hizmet terimleri ne anlama gelir?', 'Mevcut sözlük; teknik proje incelemesinin yerine geçmez', 'İlgili hizmet');
  page('/kvkk', 'privacy', 'KVKK', 'Verilerim nasıl işlenir?', 'Mevcut aydınlatma; hukukçu denetimi ayrıca gerekir', 'İletişim');
}
const esc = (text) => String(text).replaceAll('|', '/').replaceAll('\n', ' ');
const table = (headers, lines) => `| ${headers.join(' | ')} |\n|${headers.map(() => '---').join('|')}|\n${lines.map((line) => `| ${line.map(esc).join(' | ')} |`).join('\n')}\n`;
await writeFile(`${out}/content-route-manifest.json`, JSON.stringify({ generatedAt: new Date().toISOString(), source: 'Repository content models; not customer research', rows }, null, 2));
await writeFile(`${out}/11-content-inventory.md`, `# İçerik envanteri\n\nKaynak modellerden yeniden üretim: npm run marketing:inventory (Node 24). ${rows.length} indekslenebilir TR/EN URL. Kartvizit, bakım ve özel imzalı bağlantılar arama hedefi değildir; E2E/route listesinde ayrı kontrol edilir. HTTP kanıtı: reports/performance/2026-10-29/seo-before/URL-INVENTORY.csv.\n\n${table(['URL', 'Tür', 'İçerik / kaynak', 'Eksik doğrulama'], rows.map((row) => [row.path, row.type, row.title, row.type === 'project' || row.type === 'video' ? 'Telif, uygulama/render sınıfı, tarih ve paylaşılabilir konum: işletme teyidi' : 'Gerçek müşteri verisi ve dönüşüm etkisi yok']))}`);
await writeFile(`${out}/14-page-content-briefs.md`, `# Sayfa içerik brifleri\n\nHer satır mevcut görünür içeriğe dayanır. Hizmet/ekip vaadi eklenmez. Sayfa H1/title/description doğrulaması SEO envanterindedir. Sorumlu: U+ Studio tarafından atanacak içerik sahibi; hizmet kapsamı değiştiğinde ve üç ayda bir gözden geçirme önerilir.\n\n${table(['URL / başlık', 'Müşteri sorusu / aşama', 'Kanıt ve içerik sınırı', 'Sonraki adım'], rows.map((row) => [`${row.path} — ${row.title}`, row.question, row.evidence, row.cta]))}`);
await writeFile(`${out}/16-content-seo-conversion-map.md`, `# İçerik → arama niyeti → dönüşüm\n\nKanonik sayfa başına tek niyet. Her dil kendi canonical adresini kullanır; karşı dil hreflang ile bağlıdır. Metrikler PLAN durumundadır; sayfa tıklaması nitelikli görüşme değildir.\n\n${table(['URL', 'Niyet', 'Kanıt', 'CTA', 'Ölçüm'], rows.map((row) => [row.path, row.question, row.type === 'project' || row.type === 'video' ? row.evidence : row.title, row.cta, row.measurement]))}`);

const media = new Map();
function add(src, data) {
  if (!media.has(src)) media.set(src, { src, uses: [], source: 'Mevcut repository varlığı', rights: 'NEEDS_OWNER_CONFIRMATION', mediaKind: 'UNVERIFIED', approval: 'Mevcut kullanım korundu; yeni hak iddiası yok', version: 1 });
  media.get(src).uses.push(data);
}
for (const project of projects) {
  for (const image of [project.cover, ...project.gallery, ...(project.beforeAfter ? [project.beforeAfter.before, project.beforeAfter.after] : [])]) add(image.src, { project: project.slug, width: image.width, height: image.height, alt: image.alt, role: 'project-image' });
  if (project.video) {
    add(project.video.src, { project: project.slug, ...project.video, role: 'project-video' });
    add(screenPoster(project.video), { project: project.slug, role: 'video-poster', alt: project.title });
  }
}
for (const service of SERVICE_LANDINGS) add(service.image, { service: service.slug, role: 'service-image' });
for (const name of ['brief', 'concept', 'detail', 'coordination']) {
  const src = `/media/diagrams/process-${name}.svg`;
  add(src, { page: '/tr and /en', role: 'schematic-process-illustration', alt: '' });
  Object.assign(media.get(src), { source: 'Bu çalışma: özgün SVG çizimi', rights: 'Original project asset; no third-party source', mediaKind: 'diagram', approval: 'Yerel uygulama; müşteri/proje fotoğrafı değildir' });
}
// Keep unused files in the inventory too; presence does not prove display or licensing.
async function walk(folder) {
  for (const entry of await readdir(folder, { withFileTypes: true })) {
    const path = `${folder}/${entry.name}`;
    if (entry.isDirectory()) await walk(path);
    else if (/\.(svg|webp|png|jpe?g|avif|mp4|aac|woff2)$/i.test(entry.name)) {
      const src = path.replace(/^public/, '');
      if (!media.has(src)) add(src, { role: 'repository-asset; usage not established by these content models' });
    }
  }
}
await walk('public');
for (const asset of media.values()) {
  const info = await stat(`public${asset.src}`).catch(() => null);
  asset.bytes = info?.size ?? null;
  asset.fileStatus = info ? 'EXISTS' : 'MISSING';
}
await writeFile(`${out}/media-manifest.json`, JSON.stringify({ generatedAt: new Date().toISOString(), assets: [...media.values()] }, null, 2));
await writeFile(`${out}/17-media-asset-inventory.md`, `# Medya varlık envanteri\n\n${media.size} yerel varlık; tüm dosyalar ve kullanımlar media-manifest.json içinde. Boyutlar gerçek dosyadan okunur. Telif izni ve render/fotoğraf ayrımı dosya isminden tahmin edilmez. Yeni SVG'ler şematik çizimdir, tamamlanmış proje kanıtı değildir. Mevcut fotoğraf/render dosyaları değiştirilmedi.\n\n${table(['Dosya', 'Byte', 'Kaynak / tür', 'İzin / doğrulama'], [...media.values()].map((asset) => [asset.src, asset.bytes ?? 'MISSING', `${asset.source} / ${asset.mediaKind}`, asset.rights]))}`);
await writeFile(`${out}/20-media-content-seo-map.md`, `# Medya, içerik ve SEO eşlemesi\n\nProje dosyaları gerçek içerik modelinden listelenir; proje işinin bağımsız doğrulaması değildir. Caption/alt kaynağı: projects.ts. Arama hedefi, tamamlanmış projeymiş izlenimi vermeden mevcut tasarım içeriğini açıklamaktır.\n\n${table(['TR/EN sayfa', 'Müşteri niyeti', 'Medya ve caption', 'Keşif / CTA'], projects.map((project) => [`/tr/projects/${project.slug} + /en/projects/${project.slug}`, project.tagline.tr, `${project.cover.src} — ${project.cover.alt.tr}; ${project.video ? `video: ${project.video.src}; poster: ${screenPoster(project.video)}` : 'video yok'}`, `HTML Image, CreativeWork, image sitemap; ${project.video ? 'ayrı video URL, VideoObject; ' : ''}ilgili hizmet / telefon`]))}\nAna sayfa ihtiyaç yolları: Modern Villa, Villa İç Mekân, Villa Dönüşümü ve Evox Gym Center mevcut kapakları + görünür ad/alt caption + ilgili hizmet bağlantısı. Dört süreç SVG'si boş alt ile dekoratif destek; aşamalar gerçek HTML başlıkları ve açıklamalarında okunur. Schema'ya proje/fotoğraf olarak eklenmez.\n`);
console.log(JSON.stringify({ pages: rows.length, mediaAssets: media.size, missingFiles: [...media.values()].filter((asset) => asset.fileStatus === 'MISSING').length }));
