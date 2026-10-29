# U+ Studio — Kalite ve indeksleme raporu

Tarih: 29 Ekim 2026. Bu rapor kod doğrulaması, yayın durumu ve Google'ın gerçek indeks durumunu ayrı tutar. Yayın sonucu ayrıca `DEPLOYMENT-RESULT.md` dosyasında kaydedilir.

## Özet

- Mevcut Next.js 16.4.3 / React / TypeScript / next-intl mimarisi korundu. Türkçe ve İngilizce 56 indekslenebilir URL mevcut; 12 proje × 2 dil ve 4 video izleme sayfası × 2 dil bu sayıya dahil.
- Canlı başlangıç taramasında 56 URL erişilebilirdi. İki ana sayfa video keşif uyarısı giderildi. Son üretim HTML/DOM taraması: 56 URL, sıfır FAIL; yalnız desteklenmeyen `/de` adresinin nihai 404 öncesi yönlendirilmesi hakkında bir mevcut WARN.
- İlk HTML'den keşfedilen görsel sayısı 60 → 61, video dosyası sayısı 4 → 5. Tüm `public` medya kaynakları ayrıca sayıldı: 70 görsel, 6 MP4 (biri responsive varyant), 1 ses dosyası; 77/77 kaynak HTTP ile erişilebilir.
- Search Console şirket hesabından 56 URL tek tek denetlendi: **12 indeksli, 23 keşfedilmiş ama indekslenmemiş, 21 Google'a henüz bilinmiyor**. Üç URL'de video indeksi doğrulandı. Bu sonuçlar yayımdan önceki Google indeks sürümünü gösterir.
- Kullanıcının açık talebi üzerine sitemap yeniden gönderildi; Google `Sitemap submitted successfully` yanıtı verdi. `/tr/services` tekil indeksleme isteği, Google'ın günlük kotası nedeniyle reddedildi. Kalan 44 URL için başarılı istek gönderildiği iddia edilmez.
- Kullanıcının onayıyla bu sohbete günlük 10.00 indeks takibi kuruldu. Google kota/oturum koşullarına uyulur; anlamlı değişiklik veya kullanıcı işlemi gerektiğinde bildirilir.

## Sadeleştirilen dosyalar

| Dosya | Yapılan işlem | Neden |
|---|---|---|
| `src/components/home/HomeHero.tsx` | Film kaynağı ilk HTML'e eklendi; gerçek media-query değişikliği dinleyicisi ve cleanup eklendi | Keşif uyarısını gidermek; kullanıcı hareket tercihini değiştirince film/müziği durdurmak |
| `src/components/studio/InViewVideo.tsx` | Sabit src/poster, native oynatma kontrolleri, klavye odağı; tek viewport observer; hareket tercihi ve kullanıcı duraklatması korunur | Kaynak keşfi, erişilebilir oynatma ve daha az observer |
| `src/components/studio/Fullscreenable.tsx` | Mevcut odak kapanı hook'u yeniden kullanıldı; kapatma düğmesine ilk odak, Escape ve geri odak; arka plandaki eski video durdurulur | Tam ekran yedeğinin klavyeyle kullanılabilmesi |
| `src/components/studio/MotionReel.tsx` | Video/tuşları saran link kaldırıldı; proje başlığı bağlantısı korundu; ok etiketleri çevrildi; reduced-motion kaydırması | İç içe etkileşimli öğeleri ve kontrol/navigasyon çakışmasını gidermek |
| `src/components/studio/Reveal.tsx` | Satırlar arasına gerçek metin boşluğu eklendi | `behindyour` gibi birleşen kelimeleri DOM ve yardımcı teknolojilerde düzeltmek |
| `src/components/ContactContent.tsx` | `watch` aboneliği yerine mevcut form kütüphanesinin `subscribe` API'si | Oturum taslağını korurken React uyumluluk lint uyarısını gidermek |
| `src/components/seo/JsonLd.tsx`, `src/lib/seo.ts` | `<` karakterini JSON Unicode kaçışıyla serileştiren typed helper | JSON-LD içeriğinin script etiketini sonlandırmasını önlemek; aynı veriyi JSON olarak korumak |
| `src/app/[locale]/projects/[slug]/video/page.tsx` | Kaynak/thumbnail/kontroller korunarak `preload=none` | Oynatma isteği olmadan MP4 indirme/decode işini açılıştan çıkarmak |
| `e2e/pages.ts` | Bütün proje ve video yolları mevcut veriden üretilir | İlk projeyle sınırlı test kapsamını tamamlamak |
| `e2e/support.ts` | E-posta API'leri yerelde de mocklanır | Yerel SMTP bilgileri varken test postası gönderilmesini önlemek |
| `package.json` | `typecheck` komutu | Mevcut TypeScript kontrolünü tekrarlanabilir yapmak |

Büyük dosyalar sırf satır sayısı için bölünmedi. Yeni wrapper/hook, servis sayfası veya bağımlılık eklenmedi. Harici DOM, medya ve sessionStorage senkronizasyonu için gereken effect'ler korundu; poster yükleme observer'ı kaldırıldı. Shared-form/Ant Design modülü bu projede bulunmadığından böyle bir mimari zorlanmadı.

## Davranış ve risk

- Public URL'ler, canonical/hreflang, diller, hizmet/proje içeriği ve bot eğitim tercihleri korunur.
- Bilinçli iyileştirmeler: videolar manuel kontrol edilebilir; video alanına dokunma artık proje sayfasına zorunlu navigasyon yapmaz, başlık bağlantısı bunu sağlar. Video izleme sayfaları MP4'ü kullanıcı oynattığında indirir.
- Ana sayfanın İngilizce Google indeks sürümünde video bulunduğu için mevcut VideoObject/sitemap sinyalleri kaldırılmadı. Destekleyici klipler için yapay izleme sayfaları oluşturulmadı.
- Özel randevu URL'leri ve kartvizit sayfalarının `noindex` politikası korunur ve test edilir. “Bütün sayfaları indeksle” talebi özel verileri arama sonuçlarına açmak olarak yorumlanmadı.
- İlgisiz başlangıç değişiklikleri (`seo-audit/` kökündeki üç dosya, `.claude/`, `motion-audit/final-2.json`) yayın commit'ine dahil edilmez.
- Firefox'un resmî test motoru indirildi; Windows'ta başlatma `spawn UNKNOWN` ile engellendi. Bu motorun yerel tarayıcı kapsamı PASS olarak gösterilmez. Güvenlik ayarı gevşetilmedi.

## Kanıt dosyaları

| Kapsam | Dosya |
|---|---|
| Ortam, ilk bulgu, P1/P2 ve regresyon eşleştirmesi | `ENVIRONMENT-BASELINE.md` |
| Google/sitemap/kota/otomasyon ve resmî kaynaklar | `EXTERNAL-SEARCH-EVIDENCE.md` |
| 56 URL'nin gerçek Google durumu | `GOOGLE-INDEX-STATUS.csv` |
| Kalan 44 URL'nin öncelikli işlem kuyruğu | `INDEXING-REQUEST-QUEUE.csv` |
| 48 hedef sorgunun tamamı | `KEYWORD-AND-SERP-MATRIX.csv` |
| Kaynak route ve bütün public medya envanteri | `SOURCE-ROUTE-INVENTORY.csv`, `SOURCE-MEDIA-INVENTORY.csv` |
| Son HTML/DOM, medya ve canonical sonuçları | `local-after/` |
| Geçerli 56 mobil + 56 masaüstü başlangıç ölçümü | `LIGHTHOUSE-BASELINE.json` |
| Son Lighthouse ölçümleri | `lighthouse-after/` (tamamlandığı ölçüde) |
| Test denemeleri, engeller ve düzeltmeler | `REGRESSION-TEST-RESULTS.json` |

Ham tarayıcı trace/screenshot'ları repoya eklenmez. Yerel ayrıntılı E2E JSON'ları ve ara ölçümler Git dışında tutulur. Google/Bing/AI sıralama, hacim veya citation sonucu uydurulmaz; çalıştırılmayan platform deneyleri NOT_RUN olarak kalır.

## Test / build

`npm run lint`, `npm run typecheck`, `npm test`, `npm run build` izole yayın kopyasında tekrar çalıştırıldı. Unit test: **119/119 PASS**. Nihai tam masaüstü/telefon regresyonu: **407 PASS, 27 uygulanmayan profil testi SKIP, 0 FAIL, 0 flaky**. Önceki geniş koşu 401 PASS idi; eklenen negatif medya ve canlı hareket tercihi testleri nihai koşuya dahildir. Chrome/Edge/iPhone-WebKit hedefli kontroller ve beş profilde gerçek 404 medya senaryosu ayrıca çalıştırıldı. Firefox başlatma engeli ve test kurulumunda düzeltilen denemeler test kaydında ayrı tutulur.

Lighthouse tek koşulu laboratuvar ölçümüdür; saha INP veya bütün fiziksel telefonların sonucu değildir. İlk API çalıştırmasında masaüstü preset'i uygulanmadığı fark edildi; yanlış etiketlenen tekrarlı mobil kayıtlar geçersiz olarak işaretlenip kapsamdan çıkarıldı. Masaüstü başlangıçları resmî desktop config ile tekrar alındı; runner artık gerçek `formFactor` değerini doğrular. İlk son-ölçüm denemesinde eşzamanlı bir görev ortak `.next` çıktısını yeniledi ve chunk yükleme hataları oluştu; bu denemenin tamamı geçersiz sayıldı. Nihai yayın kaynağı ayrı Git index'i ve klasöründe sabitlendi. Geçerli başlangıç ve son ölçümler aynı iş istasyonunda, aynı Node/Lighthouse ayarları ve production modunda; sırasıyla 3100 ve izole 3210 yerel portlarında alınır. Paylaşılan iş istasyonundaki tek ölçümden kesin nedensellik veya sıralama kazancı çıkarılmaz.
