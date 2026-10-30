# Ek test keşfi ve kapsam matrisi

29 Ekim 2026. UYGUN değerlendirmesi, testin çalıştırıldığı anlamına gelmez. Durum ve kanıt sütunu gerçek kapsamı belirtir. Sonuçlar MASTER-EXECUTION-REPORT.md ile birlikte okunmalıdır.

| Kategori | Uygunluk | Çalıştırılan / kanıt | Sınır |
|---|---|---|---|
| Birim / saf mantık | UYGUN | 13 dosya / 133 test; validation, SEO, i18n, sanitize, rateLimit, token/email, bot guard, proxy | Bütün olası girdi kombinasyonları değil |
| Rapor doğruluğu | UYGUN | 3 node:test; medyan, eksik koşu, aykırı değer ve eşik | Yeni Lighthouse rapor mantığı için |
| İhtiyaç → hizmet → rehber → proje | UYGUN | marketing-content.spec.ts; final E2E içinde PASS | Gerçek satış sonucu değil |
| İletişim ve olumsuz durumlar | UYGUN | e2e-before.json 34 PASS / 4 cihaz kapsamı atlaması; API çağrıları tarayıcıda yanıtlanır | Gerçek SMTP teslimi bu oturumda denenmedi |
| API e-posta güvenliği | UYGUN | src/app/api/mail.test.ts mocklı testler son birim koşusunda | Gerçek müşteri mesajı gönderilmedi |
| Telefon / menü | UYGUN | call-action.spec.ts, navigation.spec.ts; final ve geniş koşularda PASS | Gerçek telefon hattının yanıt vermesi ölçülmedi |
| SEO / dil / canonical | UYGUN | 62 URL HTTP taraması; seo.spec.ts; sıfır FAIL | Google bütün URL indeksleri ayrı konu |
| Medya dosyaları | UYGUN | 65 görsel + 5 MP4 HTTP; 80 yerel dosya varlık kontrolü | Telif ve render/fotoğraf sınıfı bağımsız doğrulanmadı |
| A11y otomasyon | UYGUN | a11y.spec.ts geniş koşuda tüm public PATHS × TR/EN × masaüstü/telefon | Tam ekran okuyucu değerlendirmesi veya sertifika değil |
| Responsive / orientation | UYGUN | navigation/layout + yedi genişlikte yeni medya testleri | Fiziksel Android/iPhone testi değil |
| Görsel inceleme | UYGUN | 1440px ihtiyaç kartları ve 320px süreç resmi elle incelendi; sekiz PNG | Eski ekranla piksel karşılaştırma baseline'ı yok |
| JS kapalı kritik içerik | UYGUN | visual-marketing.spec.ts içinde PASS | JS gerektiren filtre/modal işlevi beklenmez |
| Reduced motion | UYGUN | seo.spec.ts video autoplay; a11y ve görsel testleri reduce altında | Bütün animasyonlar tek tek manuel taranmadı |
| Chrome/Edge/Firefox/WebKit | UYGUN | Bu oturumdaki otomasyon Chromium desktop/Pixel 7; şirket Chrome'unda GSC incelemesi | Firefox/Safari/Edge çapraz motor bu yeni sürümde UNVERIFIED |
| Geri/ileri, galeri ve hafıza | UYGUN | Mevcut testler repoda; bu oturumda tam uzun oturum/heap takibi yok | UNVERIFIED; yalnızca navigation Lighthouse bunu kanıtlamaz |
| Lighthouse / transfer / main thread | UYGUN | Tarihli raw JSON/HTML + results.csv | Tek tarama/medyan kapsamı ayrı belirtilir; saha INP yok |
| Warm cache / yavaş ağ karşılaştırması | UYGUN | Lighthouse simülasyonu var; ayrı warm-cache deneyi yok | UNVERIFIED |
| Güvenlik / bağımlılık | UYGUN | npm audit --omit=dev, bilinen açık 0; mevcut input/sanitize/bot/token testleri | Penetrasyon testi değil |
| Load / stress | UYGUN DEĞİL (bu kapsamda) | Yetkili ayrı staging ve yük senaryosu yok | Production'a yoğun yük uygulanmadı |
| Ödeme / üyelik / oturum | UYGUN DEĞİL | Yeni site akışında ödeme/üyelik yok | Eski randevu imzalı yardımcı linkleri korunuyor |
| Search Console | UYGUN | Şirket hesabında sitemap, indeks, tarihli Queries/Pages ve ana sayfa URL Inspection | Tüm 62 URL için Google denetimi yapılmış sayılmaz |
| Deployment / rollback | UYGUN | Mevcut Vercel/README yöntemi incelendi, production build geçti | Bu çalışma deploy/push yapmadı; yeni sürümün canlı smoke testi yok |
| Kullanıcı kabulü / telif / hukuki teyit | ENGELLENDİ | Editoryal denetimde açık alanlar kayıtlı | İşletme/uzman bilgisi gerekir; teknik testle doldurulmaz |

Bağımsız son incelemede bulunan ve düzeltilen iki konu: görsel/metin bağlantısının erişilebilir ad çakışması; geçiş sırasında henüz temizlenmeyen canonical etiketine erken test assertion'ı. İkincisinde test artık tek canonical oluşmasını ve doğru URL'yi birlikte bekler; kontrol kaldırılmadı. Eksik/trace hatalı Lighthouse ölçümünün PASS olmasını önleyen ayrı rapor testleri de eklendi.
