# Değişiklik ve geri alma kaydı

Başlangıç kodu ve canlı sürüm: `5c17a94344485aed75b2dc51173b96d9719f787d` (`main`). Yerel başlangıç ile uzak main ve canlı `X-Release` başlığının eşleştiği doğrulandı. Kullanıcı 29 Ekim 2026'da son kontroller uygun olduğunda deploy yapılmasına açıkça izin verdi.

## Kapsam

- Native video kaynak/kontrolleri ve reduced-motion senkronizasyonu.
- Tam ekran yedeğinde odak kapanı, Escape ve geri odak.
- Video kartında ayrı proje linki ve çevrilmiş kontrol adları.
- Görünür başlıkların DOM metninde kelime sınırları.
- JSON-LD güvenli serileştirme.
- İletişim taslağı için mevcut form API'siyle subscribe/cleanup.
- Video izleme sayfasında poster önce, MP4 oynatma isteğinde yüklenir.
- Tüm gerçek proje/video/dil yolları için test kapsamı, özel URL noindex testleri ve güvenli e-posta fixture'ları.
- Tekrarlanabilir Lighthouse aracı, typed metadata sözleşmesi ve teknik/Google indeks envanteri.

Bağımlılık sürümleri, public URL'ler, servis/proje gerçekleri, üretim ortam değişkenleri, robots politikası, DNS ve işletme profili ayarları değiştirilmez.

## Yayın işlemi

Kontroller tamamlandığında yalnız bu çalışmanın dosyaları commit edilir. `.claude/`, `motion-audit/final-2.json` ve `seo-audit/` kökündeki önceden var olan üç değişiklik korunur ve commit dışında bırakılır. Çalışma sırasında başka bir işlem randevu akışını arama CTA'larına dönüştürmeye başladı. Kullanıcının son açık talebi bu işi diğer işleme bırakmaktır; bu değişiklikler çalışma dosyalarında korunur ve bu yayın kopyasına alınmaz. Ortak HomeHero/ContactContent dosyaları için yalnız bu görevin doğrulanmış hunkları özel Git index'ine alınmıştır. Kaynak ve derleme çıktısı ayrı yayın klasöründe sabitlenir; diğer işlemin `.next` çıktısını yenilemesi bu ölçümleri etkileyemez. Kaynak blob listesi `RELEASE-SOURCE-FINGERPRINT.txt` dosyasındadır. Mevcut `main` push'u Vercel otomatik üretim yayınını tetikler. Force push ve bağımlılık güncellemesi yapılmaz.

Yayın, yeni commit'i gösteren canlı `X-Release` başlığı ve canlı HTTP/SEO smoke testleri görülmeden başarılı sayılmaz. Google indeks durumunun yayın anında değiştiği varsayılmaz.

## Geri alma

Üretimde beklenmedik sorun görülürse Vercel'deki son sağlıklı `5c17a94` yayınına geri dönülebilir. Kod tarafında yayımlanan commit için normal `git revert` kullanılır; geçmişi yeniden yazan reset/force push uygulanmaz. Yeni veri migrasyonu veya ortam anahtarı olmadığı için özel veri geri alma işlemi gerekmez.

Son yayın commit'i, doğrulama zamanı ve canlı test sonuçları `DEPLOYMENT-RESULT.md` dosyasına yazılır.
