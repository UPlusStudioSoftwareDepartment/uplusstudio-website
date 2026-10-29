# U+ Studio — SEO, keşif ve dizine eklenebilirlik denetimi

**Tarih:** 29 Ekim 2026 · **Canlı sürüm:** `7eb46df` · **Durum:** `LIVE_VALIDATED` (teknik) · `PARTIALLY_COMPLETE` (Google verisi: Search Console erişimi yok)

Google bir sayfayı taramayı, dizine eklemeyi ve sıralamayı kendisi seçer. Bu rapor, sitenin teknik olarak uygun olduğunu ölçer. "Google'da dizinde" bilgisini yalnızca Search Console verir, o veri bu denetimde yoktu.

## 1. Ortam ve kanıt tabanı

| Alan | Değer | Durum |
|---|---|---|
| Alan adı / kanonik host | `https://www.uplusstudio.com.tr` (apex ve http → 308 → www) | CONFIRMED (curl) |
| Depo / dal | `uplusstudio-website`, `main`. Her push Vercel'de canlıya çıkar | CONFIRMED |
| Framework | Next.js 16 App Router + next-intl (`/tr`, `/en`), SSG/ISR, Vercel CDN | CONFIRMED |
| robots.txt | 200 text/plain. `*` için `/api/` dışı açık. Yapay zekâ eğitim botları kapalı (Google Arama'yı etkilemez) | CONFIRMED |
| Site haritası | `/sitemap.xml`, kod ile üretilir (`src/app/sitemap.xml/route.ts`). 56 URL, 94 görsel, 10 video | CONFIRMED |
| Search Console | Tarayıcıda oturum yok | BLOCKED — GSC_NOT_CONNECTED |
| Google araması (TR) | 29 Ekim 2026'da tarayıcıda bakıldı | Bkz. §6 |

## 2. Yönetici özeti

| Alan | Toplam | Hedef | Test edilen | PASS | FAIL | BLOCKED/UNKNOWN | Google tarafından doğrulanan |
|---|---:|---:|---:|---:|---:|---:|---:|
| Sayfalar (tr+en) | 56 | 56 | 56 | 56 | 0 | 0 | UNKNOWN — GSC erişimi yok |
| Proje detayları | 24 (12×2) | 24 | 24 | 24 | 0 | 0 | UNKNOWN — GSC erişimi yok |
| Aramada hedeflenen görseller | 54 benzersiz | 54 | 54 | 54 | 0 | 0 | UNKNOWN — GSC erişimi yok |
| İlgili videolar (izleme sayfalı) | 4 video / 8 izleme sayfası | 4 | 4 | 4 | 0 | 0 | UNKNOWN (28 Ekim: ana sayfa videosu dizinde) |
| Site haritası URL'leri | 56 | 56 | 56 | 56 | 0 | 0 | UNKNOWN (28 Ekim: 56 sayfa okundu) |
| Hız + erişilebilirlik (laboratuvar) | 56 URL × 2 profil | 112 | 112 | 110 | 0 | 2 sınırda (LCP 2,55–2,6 sn) | — |

"PASS", URL-INVENTORY.csv'deki tüm kontrollerin geçtiği anlamına gelir: 200, tek ve kendini gösteren canonical, noindex yok, robots izinli, title + description + tek H1, doğru `lang`, hreflang hedefleri 200, JSON-LD parse oluyor.

**T0 → T1 (aynı tarayıcı, canlı site):** 1 FAIL + 22 WARN → **0 FAIL + 3 WARN** (kalan 3 WARN'ın gerekçesi §5'te).

## 3. Bulunan ve düzeltilen sorunlar

| ID | Öncelik | Sorun → kanıt | Kök neden | Düzeltme (dosya) | Önce / sonra | Durum |
|---|---|---|---|---|---|---|
| V1 | P1 | Site haritası 8 proje sayfasında video bildiriyordu, ama render sonrası (412×5000 görüntü alanı) bu sayfalardaki `<video>`'nun `src`'si yoktu: `RENDER-CHECK.csv` "0/1". | Proje sayfasındaki klip sessiz, döngülü ve kaydırınca yükleniyor (`InViewVideo`). Asıl izleme sayfası `/projects/<slug>/video`. | Videolar artık yalnızca izleme sayfalarında + ana sayfada listeleniyor. Proje `CreativeWork`'ünden iç içe `VideoObject` kaldırıldı (`sitemap.xml/route.ts`, `seo-projects.ts`). | 18 → 10 video kaydı. Uyarı 20 → 2 | FIXED, LIVE |
| V2 | P1 | İzleme sayfasında poster `.webp`, ama `VideoObject.thumbnailUrl` ve site haritası `.jpg` gösteriyordu. | Posterler hafif `.webp`'ye geçerken meta veri güncellenmemişti. Google: küçük resim birden çok yerde verilirse aynı URL kullanılmalı. | Üç yerde de aynı `.webp` (aynı kare, aynı boyut) | Test: `sitemap.test.ts` | FIXED, LIVE |
| V3 | P2 | `VideoObject` ve video site haritasında süre yoktu. | Veri alanı yoktu. | `ProjectVideo.duration`: dosyanın `mvhd` kutusundan okunan saniye (10/18/21/17). `PT10S` ve `<video:duration>`. Test, dosyadaki süreyle karşılaştırır. | — | FIXED, LIVE |
| S1 | P2 | Proje sayfalarındaki önce/sonra fotoğrafları (ör. `ofis-yenileme/before.jpg`) görsel site haritasında yoktu. | Liste yalnızca kapak + galeriden üretiliyordu. | `beforeAfter` görselleri de eklendi. | 90 → 94 görsel | FIXED, LIVE |
| S2 | P2 | `<priority>` etiketi. | Google yok sayıyor (build-sitemap, 8 Tem 2026). | Kaldırıldı. Test, priority/changefreq/lastmod'un geri gelmesini engeller. | — | FIXED, LIVE |
| R1 | P2 | `/TR/projects` ve dil öneksiz adresler **307** (geçici) ile yönleniyordu. | next-intl dil yönlendirmesi 307 döner. Dil algılama kapalı olduğundan sonuç hep aynı. | `proxy.ts`: bu yönlendirmeler 308 (kalıcı). | 307 → 308 | FIXED, LIVE |

Bu düzeltmeler, aynı klasörde çalışan başka bir oturumun `7eb46df` commit'ine (menü düzeltmesiyle birlikte) girdi ve o push ile canlıya çıktı. Canlı doğrulama o sürümde yapıldı.

## 4. Doğrulanan ama değiştirilmeyenler (PASS)

- **Yönlendirmeler:** `/` → `/tr` 308; `/tr/` → `/tr` 308; `/tr/faq` → `/tr/contact` 308; apex → www 308. Apex için iki adımlı zincir (apex → www/ → /tr) Vercel alan adı ayarıdır, sahibin işi.
- **404:** Bilinmeyen proje ve sayfa gerçek 404 döner (soft 404 yok). `/tr/maintenance` 404.
- **Parametre:** `/tr/projects?utm_source=test` → 200, canonical `/tr/projects`.
- **noindex olması gerekenler:** `/tr|en/kartvizit` (`noindex, follow`, site haritasında yok). `randevu-kart` ve `randevu-yanit` için `X-Robots-Tag: noindex, nofollow`.
- **JS render:** 56 sayfanın hepsinde başlık ve canonical JS sonrası değişmiyor. Konsol hatası 0, bozuk görsel 0. Sözlük terimleri HTML'de tam (17–21 bin kelime). `content-visibility:auto` yalnızca çizimi erteler, içerik DOM'da.
- **Görseller:** 60 benzersiz görsel URL'si 200 + `image/*`. Hepsinde `alt` var. Galeriler `next/image` ile gerçek `<img src>` olarak HTML'de, tıklama veya kaydırma gerektirmiyor.
- **Videolar:** 4 MP4 de 200/206 `video/mp4`, byte-range destekli. İzleme sayfalarında `<video src controls>` HTML'de. `VideoObject` zorunlu alanları (name, thumbnailUrl, uploadDate) gerçek veriden geliyor. `uploadDate` = videoların depoya eklendiği commit (`1c9ebac`, 27 Ekim 2026 22:07 +03:00).
- **Yapılandırılmış veri:** `ProfessionalService+Organization`, `WebSite` (name "U+ Studio" + alternateName), `BreadcrumbList`, proje `CreativeWork`, `VideoObject`. Puan, yorum veya SSS işaretlemesi yok, uydurma alan yok.

## 5. Kalan uyarılar (gerekçeli)

| Uyarı | Karar |
|---|---|
| `/tr` ve `/en`: site haritası ana sayfa filmini bildiriyor, ama HTML'deki `<video>`'da `src` yok (JS, ekran genişliğine göre küçük/büyük dosyayı seçiyor). | Bilinçli bırakıldı. Render sonrası `src` var (`RENDER-CHECK.csv` 1/1) ve Search Console 28 Ekim'de bu videoyu dizinde gösterdi. Değiştirmek telefonlarda büyük dosyayı yükletir. |
| `/de` → 308 `/tr/de` → 404 | Sonuç doğru 404. Ek işlem gerekmiyor. |

## 6. Marka araması (Google TR, 29 Ekim 2026, tek oturum; kişiselleştirme ve konum etkiler)

| Sorgu | Sonuç |
|---|---|
| U+ Studio | Sağda İşletme Profili ("U+ Studio \| Mimarlık & Mühendislik", 5,0 / 11 yorum). İlk web sonucu uplusstudio.com.tr (site adı "U+ Studio"). Eski `/faq` sonucu hâlâ listeleniyor (308 ile yönleniyor). |
| uplusstudio | 1. sonuç uplusstudio.com.tr, yerel paket gösteriliyor. |
| U+Studio (boşluksuz) | Google "U-Studio" (Etimesgut'taki başka bir iç mimar) gösteriyor. Sitemiz ilk sırada değil. Site içinde düzeltilemez. |
| İncek mimarlık | Yerel paket ve ilk web sonuçlarında yok (28 Ekim taban çizgisiyle aynı). |

Diğer marka varyantları (U Plus Studio, U+ Studio Ankara vb.) 28 Ekim'de 1. sırada görülmüştü. Bugün yeniden bakılmadı: UNVERIFIED.

## 7. Hız ve erişilebilirlik (laboratuvar)

PageSpeed Insights API anahtarsız 429 (kota) döndü. Lighthouse CLI için yeni paket indirmek gerekirdi. Bu yüzden projedeki Playwright + axe ile **ayrı bir laboratuvar ölçümü** yapıldı. Lighthouse puanı değildir.

- **Telefon profili:** 412×823, DPR 1,75, CPU 4× yavaş, ~1,6 Mbps / 150 ms RTT. **Masaüstü:** 1350×940, kısıtsız. Canlı site, ısınmış CDN, her URL bir kez.
- **Telefon (56 URL):** medyan LCP 1,80 sn, FCP 1,71 sn, TTFB 373 ms, CLS 0. LCP > 2,5 sn olan 2 sayfa var, ikisi de sınırda: `/en/services/ic-mimarlik-ankara` 2,60 sn ve `/en/projects/villa-donusumu/video` 2,55 sn.
- **Masaüstü (56 URL):** medyan LCP 0,59 sn, en kötü 0,80 sn, CLS 0.
- **axe (WCAG 2.0/2.1/2.2 A+AA), 56 sayfa:** 0 ihlal.
- **Saha verisi (Core Web Vitals):** Search Console 28 Ekim'de "veri yok" diyordu (yetersiz Chrome trafiği). INP laboratuvarda ölçülmedi.
- Ayrıntı: `PERFORMANCE-LAB.csv`. Gerçek Lighthouse için: `npx lighthouse https://www.uplusstudio.com.tr/tr --form-factor=mobile` (paket indirir) ya da pagespeed.web.dev.

## 8. Testler (gerçekten çalıştırılanlar)

| Komut | Sonuç |
|---|---|
| `npx vitest run` | 9 dosya, 99 test PASS (yeni `src/lib/sitemap.test.ts`: 12 test) |
| Aynı yeni testler eski kodla (`31b990d`) | 7 FAIL / 5 PASS. Testlerin hatayı yakaladığını gösterir. |
| `npx eslint .` | 0 hata, 1 uyarı (mevcut, ContactContent `react-hooks/incompatible-library`) |
| `npx tsc --noEmit` | Temiz |
| `next build` | Yerelde çalıştırılmadı (aynı klasörde başka oturumun dev sunucusu açıktı). Vercel `7eb46df`'yi başarıyla derleyip yayınladı (`X-Release` başlığı). |
| `npm run seo:audit` (canlı, render dahil) | 0 FAIL, 3 WARN |
| Playwright e2e | Çalıştırılmadı (izinsiz e2e koşulmuyor). GitHub CI push'ta çalıştırır. |

## 9. Değişen dosyalar ve geri alma

- `src/app/sitemap.xml/route.ts`, `src/lib/seo-projects.ts`, `src/lib/projects.ts`, `src/proxy.ts`: canlıda (`7eb46df`). Geri almak için ilgili satırları geri alıp push edin, ya da Vercel → Instant Rollback.
- `src/lib/sitemap.test.ts`, `scripts/seo-audit.mjs`, `package.json` (`seo:audit`), `README.md`, `seo-audit/`: yalnızca test ve araç. Sitenin davranışını değiştirmez.

## 10. Dosyalar

- `URL-INVENTORY.csv`: her URL için sınıf, HTTP, canonical, robots, hreflang, başlık, H1, JSON-LD
- `IMAGE-INVENTORY.csv`: her görsel için kategori, kullanıldığı sayfalar, site haritası, HTTP/MIME, alt
- `VIDEO-INVENTORY.csv`: her video kullanımı, izleme sayfası, poster, VideoObject, site haritası
- `RENDER-CHECK.csv`: HTML ile JS sonrası DOM karşılaştırması
- `PERFORMANCE-LAB.csv`: 112 ölçüm
- `audit.json` (T1, en son çalıştırma), `audit-T0-before.json` (düzeltmeden önce)
- `FOLLOW-UP-SEARCH-CONSOLE.md`: sahibin yapacağı GSC adımları ve 7/14/30 gün takibi
