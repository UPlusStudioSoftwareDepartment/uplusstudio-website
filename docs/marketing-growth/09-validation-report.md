# Doğrulama raporu

29 Ekim 2026. İlk kapsamlı koşu `http://localhost:3200`, son production build `http://localhost:3201`. PASS yalnızca çalıştırılmış kontrol içindir. Önceki audit dosyaları bu çalışmanın sonucu sayılmaz.

| Kontrol | Durum | Kanıt |
|---|---|---|
| Birim testleri | PASS | `pnpm test`: 12 dosya, 119 test |
| Typecheck | PASS | `pnpm typecheck` |
| Üretim derlemesi | PASS | `pnpm build`: 74 statik sayfa üretildi |
| Lint | PASS | `pnpm lint`: uyarı ve hata yok |
| E2E ana grup | PASS (altyapı tekrarı sonrası) | İlk koşu: 310 geçti, 6 cihaz kapsamı nedeniyle atlandı, 2 artifact dosya hatası; aynı 2 kontrol izole klasörde geçti |
| E2E etkileşim/düzen | PASS | 25 geçti, 3 cihaz kapsamı nedeniyle atlandı |
| Son footer optimizasyonu regresyonu | PASS | 13 geçti, 1 cihaz kapsamı atlandı; `final-regression-results.json`; iki dilde tüm public route metadata, footer hizmet linkleri ve telefon etkileşimi |
| Telefon aksiyonu | PASS | TR/EN, masaüstü/telefon; doğru tel hedefi, randevu UI/API yok, menü ve showcase kapanıyor |
| Erişilebilirlik otomasyonu | PASS | Ana E2E grubunda TR/EN 58 sayfa × masaüstü/telefon + dialog kontrolleri; axe WCAG 2.2 AA etiketleri |
| Yerel SEO/medya taraması | PASS, 1 uyarı | İlk ve son derlemede 56 indekslenebilir sayfa, 61 görsel ve 5 video erişilebilir; 0 hata; `/de` 404 öncesi 308 yönleniyor; son kanıt `seo-final/` |
| Yeni içerik görünümü | PASS | 320px ve 1440px: yatay taşma yok, 4 SSS; süreç alanı ve hero görsel olarak incelendi |
| Üretim bağımlılık denetimi | PASS | npm lockfile ile `npm audit --omit=dev --json`: bilinen açık 0; `security-audit.json` |
| Lighthouse A / BP / SEO | PASS | İlk 10 URL × 2 profil ve son örnek ölçümlerinde 100/100/100; ham raporlar `lighthouse*/` altında |
| Lighthouse Performance 90 hedefi | FAIL (kısmi) | Ana sayfa ve hizmetlerde ölçüm değişkenliği var; video izleme sayfasının mobil skoru 90 altında; ayrıntı aşağıda |
| Şirket hesabı / Search Console | BLOCKED | Bağlı profilde doğru hesap yok; otomatik onay denetimi şirket doğrulaması olmadan GSC penceresi incelemesini reddetti |
| Mevcut Google sıralaması / talep artışı | UNVERIFIED | Yeni baseline veya gerçek müşteri verisi yok |
| Alan verisi INP | UNVERIFIED | Laboratuvar testi saha metriği değildir |
| Ticari kapsam/yıl/konum/render-fotoğraf doğrulaması | UNVERIFIED | Yeni varsayımla tamamlanmadı |

Windows sandbox ilk testte `spawn EPERM`, ilk derlemede SWC önbellek erişim hatası verdi. Aynı komutlar izinli yürütmeyle geçti; uygulama hatası olarak raporlanmadı.

İki eşzamanlı Playwright koşusu varsayılan `test-results` klasörünü paylaştığı için ana koşuda iki testin context-close/trace dosyası kayboldu (`ENOENT`). Ürün assertion hatası görülmedi. `en/about` ve `en/contact` telefon kontrolleri `--output=test-results/marketing-retry` ile ayrı klasörde tekrar çalıştırıldı ve geçti. Bu altyapı sorunu ve ilk başarısız sonuçlar ham JSON'da korundu. İlk kapsamlı gruplarda 337 test kontrolü geçti, 9 cihaz kapsamı atlaması var. Son footer değişikliğinden sonra ayrıca 13 regresyon kontrolü geçti, 1 cihaz kapsamı atlaması oldu. Tekrarlar ayrı koşulardır; bunlar 350 farklı senaryo olduğu anlamına gelmez. Ham JSON dosyaları gerçek koşuları içerir.

`pnpm audit` bu repoda pnpm lockfile olmadığı için çalışmadı. Mevcut `package-lock.json` kullanılarak npm audit tamamlandı; yeni lockfile veya bağımlılık güncellemesi yapılmadı. Denetimin sıfır sonucu penetrasyon testi veya tüm güvenlik açıklarının bulunmadığı garantisi değildir.

Arama testinde gerçek telefon uygulaması açılmadan protokol hedefi yakalandı. Gerçek telefon hattının cevap vermesi ölçülmedi. E-posta/WhatsApp akışları dışarı mesaj göndermeden test edildi. Otomatik axe denetimi tam WCAG uygunluk sertifikası veya kapsamlı ekran okuyucu testi değildir.

## Çalıştırılan komutlar

```text
pnpm lint
pnpm typecheck
pnpm build
pnpm test
BASE_URL=http://localhost:3200 pnpm exec playwright test e2e/conversion.spec.ts e2e/contact.spec.ts e2e/appointment.spec.ts e2e/seo.spec.ts e2e/a11y.spec.ts e2e/navigation.spec.ts --project=desktop --project=phone
BASE_URL=http://localhost:3200 pnpm exec playwright test e2e/call-action.spec.ts e2e/layout.spec.ts e2e/site.spec.ts --project=desktop --project=phone --grep='primary call action|primary actions|about keeps|English menu|home continues|founders|project pages link|footer links'
BASE_URL=http://localhost:3200 pnpm exec playwright test e2e/conversion.spec.ts --project=phone --grep='en/about:|en/contact:' --output=test-results/marketing-retry
BASE_URL=http://localhost:3200 node scripts/seo-audit.mjs --out docs/marketing-growth/seo-validation
npm audit --omit=dev --json
BASE_URL=http://localhost:3201 node node_modules/@playwright/test/cli.js test e2e/call-action.spec.ts e2e/site.spec.ts e2e/seo.spec.ts --project=desktop --project=phone --grep='primary call action|footer links|every public route|private helper' --output=test-results/marketing-final
BASE_URL=http://localhost:3201 node scripts/seo-audit.mjs --out docs/marketing-growth/seo-final
node node_modules/vitest/vitest.mjs run
node node_modules/eslint/bin/eslint.js .
node node_modules/typescript/bin/tsc --noEmit
```

Ortam değişkenleri burada platformdan bağımsız gösterildi; gerçek yürütme PowerShell ile yapıldı. Son kontrollerde sandbox içindeki Corepack pnpm indirmeye çalışınca hazır yerel araçlar doğrudan Node ile çalıştırıldı; yeni paket yüklenmedi. Tüm tarayıcı projeleri/Firefox/Safari bu çalışmada çalıştırılmadı; kapsam desktop Chromium ve Pixel 7 Chromium. Önceki raporların farklı tarayıcı sonuçları bu sonuca eklenmedi.

## Lighthouse yöntemi ve sonuçları

Lighthouse 13.6.0, yerel production build, resmi desktop-config ve varsayılan mobil simülasyon. Paylaşılan Windows bilgisayarında laboratuvar ölçümü; gerçek kullanıcı CWV veya dönüşüm ölçümü değildir. `lighthouse/` ilk 10 URL × mobil/desktop = 20 ölçüm; `lighthouse-repeat-2/` ve `lighthouse-repeat-3/` dört düşük mobil URL'nin ek koşuları; `lighthouse-video-diagnostic/` LCP tanılamasıdır. Son footer optimizasyonu sonrası `lighthouse-final/` dört URL × iki profil = 8 ölçüm. Ham kötü sonuçlar silinmedi veya başarılı diye etiketlenmedi.

Footer optimizasyonundan önceki üç mobil koşu:

| URL | Skorlar | Medyan |
|---|---|---:|
| `/tr` | 83, 97, 98 | 97 |
| `/en` | 89, 98, 94 | 94 |
| `/tr/services` | 84, 98, 99 | 98 |
| `/tr/projects/villa-donusumu/video` | 85, 83, 86 | 85 |

Bu yayılım TBT'nin koşudan koşuya değiştiğini gösteriyor; nedenin yalnızca makine yükü olduğu kanıtlanmadı. Kaynak incelemesinde footer'ın tüm hizmet kataloğunu istemci bağımlılığı yaptığı görüldü; yalnızca link verisi sunucuda hazırlanacak şekilde sadeleştirildi. Son ana sayfa JavaScript dosyalarında hizmet SSS metinlerinin bulunmadığı doğrulandı. İstemci bağımlılığı azaldı; bundan ölçülmüş bir hız artışı veya dönüşüm kazancı çıkarılmadı.

Son build kimliği: `8jlFwrtA_-MuIUEyKzAiD`. İlk son-derleme koşusunda TR ana sayfa mobil 95 / desktop 99; EN ana sayfa mobil 98 / desktop 98; hizmetler mobil 88 / desktop 99; video mobil 85 / desktop 99. Hepsinde A/BP/SEO 100 ve CLS 0. Hizmetlerin son build'deki iki ek koşusu 99 ve 95: üç koşunun medyanı 95. Ham sonuçlar `lighthouse-final-services-2/` ve `lighthouse-final-services-3/` altında.

| Son derleme örneği | Mobil performans | Masaüstü performans | A / BP / SEO | CLS |
|---|---:|---:|---|---:|
| TR ana sayfa | 95 (tek koşu) | 99 | 100 / 100 / 100 | 0 |
| EN ana sayfa | 98 (tek koşu) | 98 | 100 / 100 / 100 | 0 |
| Hizmetler | 95 (88, 99, 95 medyanı) | 99 | 100 / 100 / 100 | 0 |
| Villa video sayfası | 85 (tek son koşu; önceki koşularda da 90 altında) | 99 | 100 / 100 / 100 | 0 |

Video izleme sayfasının mobil simüle LCP'si son koşuda yaklaşık 4,28 saniye; 90 puan ve LCP 2,5 saniye hedefleri bu sayfada sağlanmadı. LCP tanılaması öğenin native video posteri olduğunu, ilk HTML'de keşfedildiğini, yüksek öncelik verildiğini ve lazy olmadığını doğruluyor. Ağ isteği, posterin kaldırılması veya bir yükleme önceliği hilesiyle gizlenmedi. Video ve native kontroller korunuyor; bu sonuç performans için kalan iş olarak açık bırakıldı.

Bu değişikliklere özgü, temiz ve eş koşullu bir uygulama-öncesi baseline alınmadı; eski SEO raporlarından yüzde iyileşme hesaplanmadı. Footer optimizasyonundan önce/sonra sonuçlar yukarıda ayrı tutuldu. Saha INP, gerçek görüşme ve gelir etkisi UNVERIFIED.

Yeni değişiklikler yerel çalışma ağacında. Canlıya çıkış ve production sonuçları bu raporun parçası olarak doğrulanmadı.
