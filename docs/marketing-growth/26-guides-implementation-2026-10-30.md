# Rehberler merkezi ve yeni müşteri rehberleri — 30 Ekim 2026

Araştırma kaynağı: `25-customer-needs-research-2026-10-30.md` (Armut kamuya açık sayfaları, Gölbaşı Belediyesi sayfaları, mevzuat.gov.tr, rakip rehberleri). Kat Mülkiyeti Kanunu md. 19 ve 24 metni mevzuat.gov.tr üzerinden ayrıca okundu.

## Yapılanlar

- **6 yeni rehber (TR + EN):** İncek–Gölbaşı villa yenileme, banyo yenileme, ticari mekân kiralamadan önce, müteahhit için alıcı profiline göre proje, kiraya vermeden/satmadan önce yenileme, mimar–iç mimar–mühendis farkı. Toplam 17 rehber. (`src/lib/guidesExtra.ts`)
- **Veri modeli:** her rehberde konu (7 raf), okuyucu (7 segment), kart görseli, ek hizmet sayfaları, SSS ve resmî kaynak bağlantıları. (`src/lib/guides.ts`)
- **Segment filtreli kütüphane:** `/guides` sayfasında "Ben kimim?" düğmeleri; bütün kartlar sunucuda render edilir, filtre yalnızca gizler; seçim `#kim-…` adresinde tutulur. (`src/components/GuideLibrary.tsx`)
- **Rehber sayfası:** "Bu rehber kimler için" bağlantıları, SSS, resmî kaynak düğmeleri (yeni sekme, `noopener`), numaralı şema lejantı, konu/okuyucuya göre ilgili rehberler.
- **Çekilemeyen sayfalar:** e-Devlet Gölbaşı e-İmar (giriş gerekli) ve Ankara BB e-İmar okunamadı; içerikleri aktarılmadı, düğme olarak bağlandı.
- **5 özgün SVG şema** (`public/media/diagrams/guides/`), dil bağımsız, numaralı; çok sayıda kartta sonsuz animasyon mobil TBT'yi artırdığı için hareketsiz üretildi.
- **İç bağlantılar:** hizmet sayfaları `alsoServices` ile ilgili rehberleri listeler; proje sayfaları ilgili rehberlere bağlanır; ana sayfa 17 rehber yerine her segmentten 6 rehber + tümü bağlantısı gösterir.
- **Ölçüm:** Vercel Analytics açıksa telefon/WhatsApp/e-posta tıklamaları sayfa yoluyla `click_phone`, `click_whatsapp`, `click_email` olarak gönderilir; kişisel veri yok. Production'da `NEXT_PUBLIC_VERCEL_ANALYTICS` değeri ve plan desteği UNVERIFIED.

## Testler (yerel production build, `NEXT_DIST_DIR=.next-guides`, port 3100)

| Kontrol | Sonuç |
|---|---|
| `tsc --noEmit`, ilgili dosyalarda ESLint | PASS |
| Vitest 15 dosya / 148 test (yeni `guides.test.ts` dahil) | PASS |
| `next build` | PASS |
| `e2e/guide-library.spec.ts` (chrome, TR+EN, 10 test) | PASS |
| `e2e/marketing-content.spec.ts` (chrome, 38 test) | 32 PASS, 6 FAIL → aşağıdaki mevcut hata; tek başına tekrarlandığında 6/6 PASS |
| 320 / 390 / 1440 px yatay taşma | PASS (ekran görüntüleri `reports/marketing-execution/hub-*.png`, `incek-320.png`) |
| Lighthouse mobil (tek koşu, makine başka işlerle yüklüyken) | /tr/guides 0.91, ticari 0.91, banyo 0.89, İncek 0.92; A11y/SEO/BP 1.00 |
| Lighthouse masaüstü | 1.00 (ölçülen tüm sayfalar) |

## Bilinen sorun (önceden var, bu çalışmadan bağımsız)

Sayfa henüz hidratlanmadan bir iç bağlantıya tıklanırsa önceki sayfanın `canonical` etiketi DOM'da kalıyor (projeler → proje, hizmetler → hizmet, rehberler → rehber; CPU 6× yavaşlatmayla tekrar üretildi). Doğrudan açılan HTML'de tek canonical var; tarayıcı botlarını etkilemez, e2e'de paralel yük altında aralıklı hataya yol açar. Next.js metadata davranışı ayrıca incelenmeli.

## Hizmet bölgesi

30 Ekim 2026: kullanıcı Türkiye geneli hizmeti onayladı. Site metinleri (ana sayfa, hakkımızda, hizmet sayfaları) ve yapılandırılmış veri (`areaServed`: İncek, Gölbaşı, Çankaya, Ankara, Türkiye) zaten bu kapsamla tutarlı; değişiklik gerekmedi.

## Search Console ve dönüşüm verisi

- Bu oturumda tarayıcı denetim aracı yoktu. Şirket profili (Chrome "Profile 7", uplusstudiosoftwaredepartment@gmail.com) kopyalanarak açılmayı denendi; oturum taşınmadı (Search Console `/about` sayfasına yönlendi). Kopya hemen silindi. Güncel GSC verisi: BLOCKED.
- Son gerçek GSC gözlemi `SEARCH-CONSOLE-2026-10-29.md`: 28 Tem–27 Eki 2026, 53 tıklama, 745 gösterim, CTR %7,1, ortalama konum 5,4; /tr indeksli.
- Canlı sitede Vercel Web Analytics isteği gözlenmedi (`/tr` yüklemesinde `/_vercel/insights` çağrısı yok). `NEXT_PUBLIC_VERCEL_ANALYTICS=1` production'da tanımlı değil; bu nedenle tıklama/dönüşüm verisi hiç toplanmamış. Açmak için Vercel ortam değişkeni ve yeniden yayın gerekir (onay gerekli).
