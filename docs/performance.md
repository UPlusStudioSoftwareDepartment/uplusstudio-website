# Performans denetimini yeniden üretme

Paket yöneticisi npm; repository package-lock.json kullanıyor. Node 24 ile doğrulandı. Lighthouse proje bağımlılığına eklenmedi; mevcut kurulum kullanıldı. İnternet olmadan yeni araç varmış gibi davranılmaz.

PowerShell'de açık geliştirme sunucusuyla çakışmayan production QA ortamı:

```powershell
$env:NEXT_DIST_DIR = '.next-qa'
npm run build
npm run start -- --port 3300
```

Ayrı terminalde aynı NEXT_DIST_DIR değerini ayarlayın. Lighthouse kurulu değilse resmi npm paketini test ortamına kurun veya var olan kurulumun core/index.js yolunu LIGHTHOUSE_MODULE değişkenine verin. Bu makinede 13.6.0 kurulumuyla tam tarama ve eski sürümle ayrı tanılama yapıldı; farklı sürümlerin sonuçlarını doğrudan iyileşme yüzdesine çevirmeyin.

```powershell
$env:NEXT_DIST_DIR = '.next-qa'
$env:LIGHTHOUSE_MODULE = 'C:\path\to\node_modules\lighthouse\core\index.js'
npm run performance:audit -- --base http://localhost:3300 --runs 3 --phase final --out reports/performance/manual/final
```

Varsayılan: sitemap'teki her URL, mobile + desktop, üç koşu. --paths /tr,/en gibi virgüllü listeyle hedefli ölçüm, --profiles mobile ile tek profil seçilir. --runs 1 tam ilk tarama için daha kısa kapsama izin verir; tek ölçüm kararlı medyan kanıtı sayılmaz. --resume yalnızca aynı buildId/URL/profil/koşu sayısına sahip rapora devam eder; bir yeni build eski örneklerle karıştırılmaz.

Her örnekten sonra results.json, medyan results.csv ve raw/ altına gerçek JSON + HTML kaydedilir. Çalıştırılmamış satırlar UNVERIFIED, eksik/trace hatalı koşular BLOCKED; tamamlanmış medyanlar eşiklere göre PASS/FAIL. --assert kategori hedefleri altında da çıkış kodu 1 üretir; varsayılan yalnızca çalıştırılamayan ölçümde hata kodu döner. Hedefler P≥90, A/BP/SEO≥95. Birçok oynak performans ölçümünü tek koşuda CI deploy engeline çevirmeyin.

```powershell
npm run test:audits
npm run marketing:inventory
$env:BASE_URL = 'http://localhost:3300'
node scripts/seo-audit.mjs --out reports/performance/manual/seo
```

Cold cache ifadesi Lighthouse'un tarayıcı storage reset politikasını anlatır; sunucu/CDN image cache'inin boş olduğunu kanıtlamaz. Paylaşılan Windows makinesindeki diğer iş yükleri ve ağ koşulları skorları etkiler. Warm-cache karşılaştırması ve gerçek cihaz/saha INP ayrı görevlerdir; burada otomatik olarak ölçülmüş sayılmaz. INP yerine TBT yazmayın. Yerel sonuçlar Vercel production TTFB/cache performansını kanıtlamaz.

Ham JSON/HTML ve ekran görüntüleri yerelde saklanır; raw/ git dışında. Özetler ile orijinal kötü koşular silinmeden incelenebilir. Rapor kökü: reports/performance/2026-10-29. Tüm dış hesap okuması şirket profilinde; otomatik yerel E2E/Lighthouse geçici izole profiller kullanır ve gerçek e-posta göndermez.

Sitemap dışında, herkese açık fakat noindex olan bir yardımcı URL'yi ölçmek için --extra-paths /tr/kartvizit,/en/kartvizit kullanın; --paths ile aynı listeden seçim yapılabilir. Bilinçli noindex sayfasının SEO eşiği altında kalması indekslenebilir sayfa hatası olarak yorumlanmamalı. İmzalı özel randevu bağlantıları için gerçek müşteri token'ı üretilmez.

Özet üretimi: node scripts/performance-summary.mjs reports/performance/2026-10-29. all-pages, varsa repeats/retries/supplemental klasörlerini aynı build/sürüm koşuluyla birleştirir. Trace hatasının toparlandığı durumlarda ilk hata all-pages kanıtında ve summary.json recoveredErrors içinde kalır; başarılı ayrı retry olmadan hata PASS'a dönüşmez.

Derin tanılama: --throttling-method devtools gerçek CPU/ağ kısıtlaması kullanır; varsayılan simulate skorlarıyla aynı veri gibi birleştirilmez. Özetleyici yöntem karışımını reddeder. --trace verilirse Lighthouse'un döndürdüğü gerçek Trace verisi raw/ altında .trace.json olarak da saklanır; yoksa trace varmış gibi üretilmez.
