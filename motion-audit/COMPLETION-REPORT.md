# Yarım kalan mobil işlerin doğrulama raporu

29 Ekim 2026. Çalışma dizini: `uplusstudio-website`.

## Oturumlardan devralınan işler

| Claude oturumu | Devralınan iş | Durum |
| --- | --- | --- |
| Mobil menü açılıp kapanması (yerel) | Onaylanan iki katmanlı perde, hamburger/X dönüşümü, daha kısa kapanış, erişilebilirlik | Yerelde uygulandı; açık Chrome ve Chromium/WebKit testleriyle doğrulandı. |
| Mobil ana sayfa yavaş açılması | Kök 404'ün tüm siteyi dinamik yapmasını engellemek; Frankfurt bölgesi | Sayfaların statik üretimi build çıktısında doğrulandı. `fra1` kaynak yapılandırmasına eklendi; canlıda etkin olduğu iddia edilmiyor. |
| UPlus Studio smooth motion transitions | 404 HTML'i, mobil akışlar, telefon kare ölçümleri, eski CI kontrolü | 404, akışlar ve telefon ölçümleri tamamlandı; sonuçların sınırları aşağıda açıkça belirtildi. |
| Mobil menü açılıp kapanması (Cloud) | Yerel menü oturumunun buluta taşınan kopyası | Ayrı bir özellik işi içermiyor. Claude tarafında depo kimlik doğrulaması başarısız; aynı uygulama işi yerel depoda devralındı. Bulut bağlantısı düzeltilmedi. |

## Uygulanan değişiklikler

- Mobil menü, dairesel `clip-path` yerine sade koyu yüzeyle açılıyor. Son kullanıcı talebiyle turuncu ön katman tamamen kaldırıldı. Apple ve Aesop'un resmi mobil menüleri tarayıcıda incelenerek büyük perde yerine kısa mesafeli geçiş seçildi: zemin 240 ms solma; panel 18 px / 420 ms; linkler 16 px / 360 ms ve 28 ms aralık. Kapanış 260 ms; linklerin dönüş hareketi yok. Yalnızca `transform`/`opacity` kullanılıyor. Referanslar: [Apple](https://www.apple.com/), [Aesop](https://www.aesop.com/).
- Açık Chrome'da 375 px genişlikte erken kapatma tıklamasının boşa gittiği gözlendi. Menü başlığı ve kapatma düğmesi hareketli panelin dışına alındı; aynı noktaya hızlı ikinci tıklama Chromium ve WebKit'te ayrıca test edildi.
- Menü UI'ı `MobileMenu.tsx`, ikon `MenuIcon.tsx`, saf hareket tanımları `mobileMenuMotion.ts` içinde ayrıldı. Gereksiz ekran yarıçapı state'i ve resize dinleyicisi kaldırıldı.
- Azaltılmış hareket ayarında büyük paneller kaymıyor; menü kısa bir solmayla açılıp kapanıyor.
- Menüdeki orijinal maskot çizimleri toplam yaklaşık 8 KB'lık SVG görsellerine aktarıldı. El sallama SVG içinde bir kez çalışıyor ve reduced-motion ayarına uyuyor. Ana sayfa ve diğer bölümlerdeki maskotlar değiştirilmedi. Çizimler `scripts/generate-menu-mascots.mjs` ile asıl component kaynağından tekrar üretilebilir.
- Menü açılışında gözlenen 10 toplu rota ön yükleme isteği kaldırıldı. Son profilde 0 istek gözlendi ve bunun için ağ isteğini kontrol eden bir E2E testi eklendi. Seçilen sayfa tıklanınca yükleniyor.
- Kök 404 statik kaldı. Tam 404 belgesi, yerelleştirilmiş routing-level `global-not-found.tsx` üzerinden sunuluyor. Önceki catch-all çözümünün boş HTML kabuğu döndürdüğü HTTP ile gözlendi ve o çözüm kaldırıldı.
- Geçersiz proje/hizmet/video adresleri ve kapalı bakım sayfası global 404'e gönderiliyor. Bakım modu yönlendirmesi öncelikli; URL kodlamalı slug'lar güvenli biçimde çözülüyor.
- Son tarayıcı kontrolünde global 404'ten ayrılırken URL'nin değişip 404 içeriğinin kalabildiği doğrulandı. `NotFoundNavigation` yalnızca bu hata belgesinden ayrılırken tam belge navigasyonu yapıyor; dil değiştirme ve ana sayfaya dönüş Chromium/WebKit'te test edildi. Normal sayfalardaki istemci geçişleri korunuyor.
- WebKit maskot testindeki sabit 500 ms bekleme, gerçekten gözlenen animasyon başlangıcını bekleyen assertion ile değiştirildi.
- Telefon ölçümünün kaydedicisi, belge değişimi ve back/forward cache dönüşünde kareleri kaybetmeyecek şekilde düzeltildi. Kaydırıcı sürüklemesi merkezde bitmek yerine sağda bitiyor ve gerçekten hareket edip etmediği kontrol ediliyor.

## Tamamlanan kontroller

| Kontrol | Gözlenen sonuç |
| --- | --- |
| `npm test` | 11 dosyada 115 test geçti. |
| TypeScript | `tsc --noEmit --incremental false` ve production build typecheck başarılı. |
| `npm run build` | Başarılı; TR/EN ana sayfa, hakkımızda, hizmetler ve proje sayfaları statik üretildi. |
| Mobil menü / hareket / 404 E2E | Chromium phone + WebKit iPhone: 68 ayrı senaryo geçti. Ana çalışma 66 test; eklenen 2 dönüş senaryosu dahil son 404 tekrarı 26 test geçti. |
| Ekran matrisi | 320, 360, 375, 384, 390, 393, 412, 430 px ve 844×390 yatay görünüm. |
| Açık Chrome | Menü, Escape, odak dönüşü, kaydırma kilidi, menüden hizmetlere geçiş, İngilizce 404; ayrıca 360/384/393/412 px son sürümde taşma ve kesilen kontroller kontrol edildi. |
| Ham 404 HTML | TR/EN bilinmeyen sayfa, proje, hizmet, videosuz proje ve bakım adresleri: 404, doğru dil, header/footer ve noindex doğrulandı. |
| Önceki CI | `227e7cac4c07c0498f94a72f1992d4482ef2035a`: CI ve Production smoke test başarılı. Bu sonuç yeni yerel değişikliklerin CI sonucu değildir. |

Önceki CI kanıtları: [CI](https://github.com/UPlusStudioSoftwareDepartment/uplusstudio-website/actions/runs/40899628944), [Production smoke test](https://github.com/UPlusStudioSoftwareDepartment/uplusstudio-website/actions/runs/40899629019).

## Telefon kare ölçümleri

Kullanıcının son talebi doğrultusunda öncelik iPhone/Safari ve Samsung Galaxy–Xiaomi/Redmi/Chrome ekran sınıflarıdır. Bunlar fiziksel model testi değildir. [Statcounter Türkiye verisi](https://gs.statcounter.com/vendor-market-share/mobile/turkey), tanımlanabilen markalarda Apple/Samsung/Xiaomi'yi öne çıkarır; veride büyük bir Unknown grubu bulunduğundan model bazında kesin kullanım sıralaması iddia edilmiyor.

`completed-phones.json`: iyileştirme öncesindeki 5 ekran × 2 CPU yavaşlatma seviyesinde 130 kayıt; 0 uygulama hatası. `turkey-common-final.json`: son sürümde 360/390/430 px, 4× CPU; 39 kayıt ve 0 uygulama hatası. Üç sürükleme de kaydırıcıyı 50'den 90'a taşıdı. İlk, belge dönüşünde tek kare kaydeden eski çalışma geçerli sonuç sayılmadı.

`aa9f79d` sürümü (son tek yüzeyli animasyon ayarından önce), headless Chromium; süreler milisaniyedir:

| Genişlik | Açılış ortalama / p95 | Kapanış ortalama / p95 | Menüden sayfaya en uzun aralık |
| --- | --- | --- | --- |
| 360 | 20,6 / 33,4 | 17,3 / 16,8 | 516,6 |
| 390 | 25,5 / 66,7 | 17,6 / 16,8 | 616,7 |
| 430 | 19,9 / 33,3 | 17,9 / 16,8 | 600,0 |

Kaydırma testlerinin p95 değeri yaklaşık 16,7–16,8 ms'dir. Bunlar yazılımsal raster ve 4× CPU altında ölçüldü; fiziksel telefonda FPS karşılığı olarak sunulmaz. Soğuk sayfa geçişlerinde hâlâ uzun aralıklar vardır; "her işlem 60 FPS" veya "her model kusursuz" sonucu çıkarılmadı. Örnek sayısı 20'nin altındaki Geri ölçümleri düzenli kare dağılımını değerlendirmek için kullanılmadı. 6× CPU sonuçları kabul ölçütü değildir.

Menü CPU profilleri: orijinal inline SVG sürümünde 85 layout; son profilde 19 layout. Ön yükleme istekleri 10'dan 0'a indi. Tek koşudaki toplam CPU süresi ve en kötü kare iyileşmesi garanti edilmiyor; ham profiller bu sınırla saklandı.

## Sınırlar ve yayın durumu

- Fiziksel iPhone veya Android cihaz kullanılmadı. Açık masaüstü Chrome'daki responsive kontrol ile CPU yavaşlatmalı headless emülasyon farklı kontrollerdir.
- `globalNotFound`, kullanılan Next.js sürümünde experimental bir özelliktir. [Resmi dokümanda](https://nextjs.org/docs/app/api-reference/file-conventions/not-found) dinamik kök layout'lar için açıklanan routing-level 404 mekanizması kullanıldı; ham HTML ve tarayıcı regresyon testleri eklendi.
- İlk yayın `aa9f79d` canlı `X-Release` başlığında ve `fra1` bölgesinde doğrulandı; bu sürümün CI ve production smoke işleri başarılı. Aşağıdaki son tasarım değişiklikleri ayrıca doğrulandı; yeni yayın kendi commit kimliğiyle kontrol edilir.
- Başlangıçta mevcut `seo-audit/` çıktıları, `.claude/` oturum dosyaları ve `motion-audit/final-2.json` bu çalışma tarafından sahiplenilmedi veya commit edilmedi.

## Son tasarım ve iki dilde yerleşim doğrulaması

- Turuncu menü perdesi kaldırıldı. Tek koyu yüzey, 18 px kısa hareket, 0,42 sn panel açılışı ve 0,26 sn kapanış kullanılıyor; bağlantılar küçük hareketle sırayla beliriyor. Azaltılmış hareket tercihi korunuyor.
- İngilizce mobil menüde yalnızca `Glossary` gösteriliyor. Ana sayfadaki disiplin yazısının boyutu, ağırlığı ve kontrastı artırıldı.
- İngilizce disiplin ifadesi görünür UI, kart ve ilgili metadata kaynaklarında `Architecture, Interiors & Engineering` olarak sadeleştirildi.
- Hakkımızda iletişim alanı kurucuların yanında kaldı. E-posta adresinin tamamı korunuyor; gerektiğinde yalnızca `@` sonrasında satır kırılabiliyor, `uplusstudio.com.tr` bölünmüyor. Ayrı satıra alma denemesi kullanıcı geri bildirimiyle kaldırıldı.
- Açık Work Chrome profilinde iki dilde Hakkımızda, İngilizce Hizmetler ve İletişim bannerları, form ve iletişim bilgileri kontrol edildi. 393 px Hakkımızda başlığının iki dilde üst/alt koordinatları eşit ölçüldü: 437,45 / 528,63 px. Son production menüsü aynı profilde açılıp Escape ile kapatıldı; odak menü düğmesine döndü.
- 60 statik TR/EN adresin ilk ekran görüntüsü alınıp görsel olarak incelendi. Chromium'da 320, 393, 768, 844×390, 1440 ve 2560 px; WebKit'te 12 ana adres için 320, 393 ve 844×390 px: **396 kontrol, 0 uygulama hatası, 0 yatay/metin taşması, 0 kesilen görünür başlık** (`layout-audit.json`). Kapalı bakım adreslerinin 404 olması beklendiği gibidir. Bu tarama otomatik geometri kontrolü ile görsel incelemenin kapsamını kaydeder; fiziksel cihaz testi değildir.
- Son menü/404 dosyasında 46 Chromium/WebKit E2E geçti. Yeni e-posta/sütun/Glossary regresyon dosyasında 12 test geçti. Yatay ekran testinde e-posta aşağı kaydırılarak görünür hale getirilir; ilk ekranın dışında olmak hata sayılmaz.
- Son unit: 115 test geçti. TypeScript ve production build başarılı. Lint: 0 hata; mevcut `ContactContent.tsx:153` React Hook Form `watch` uyarısı devam ediyor.
- Son menü videosu `menu-motion-final.webm`; son production önizleme kaydında 0 hata ve 0 unload/Permissions-Policy uyarısı var (`release-final.json`).

## `inspector.b9415ea5.js` uyarısının kesin kaynağı

Açık Chrome DevTools Console bağlantısının erişilebilirlik açıklamasında şu kaynak doğrudan okundu:

`chrome-extension://mbnbehikldjhnfehhnaidhjhoofhpehk/inspector.b9415ea5.js:406`

Bu kimlik [CSS Peeper](https://chromewebstore.google.com/detail/css-peeper/mbnbehikldjhnfehhnaidhjhoofhpehk) Chrome eklentisine aittir. Site kaynaklarında `unload` kaydı veya bu inspector dosyası yoktur. Eklentisiz canlı tarayıcı kaydında aynı uyarı görülmedi (`live-unload-check.json`). Site güvenlik başlıkları bu eklentinin eski olay dinleyicisini çalıştırmak için gevşetilmedi. Üçüncü taraf eklenti kodunun kalıcı düzeltmesi yayıncısına aittir; mevcut tarayıcıda uyarıyı kaldırmak için eklentinin güncellenmesi veya kullanıcı tarafından devre dışı bırakılması gerekir. Uyarının kaynağı artık belirsiz değildir; eklenti kodunun düzeltildiği iddia edilmez.
