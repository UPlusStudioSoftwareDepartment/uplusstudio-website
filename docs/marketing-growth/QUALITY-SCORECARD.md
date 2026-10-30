# Kanıta dayalı kalite değerlendirmesi

29 Ekim 2026. Aşağıdaki puanlar **editoryal mühendislik değerlendirmesidir**, ölçülmüş dönüşüm, güvenlik sertifikası, WCAG sertifikası veya bütün işlerin tamamlandığı yüzdesi değildir. Beş puanlık kaba adımlar kullanılır. Kritik sınırlamalar toplam puanla gizlenmez; genel site ortalaması verilmez.

| Alan | Değerlendirme /100 | Dayanak | Kalan sınırlama |
|---|---:|---|---|
| Görsel tasarım / UX | 85 | Mevcut marka korundu, dört ihtiyaç-proje görsel yolu ve süreç şemaları; yedi genişlikte test, seçilmiş manuel görsel inceleme | Tüm sayfalar için insan gözüyle/piksel baseline karşılaştırması yok |
| İşlevsellik / QA | 90 | Geniş 232 geçiş ve final 66 başarılı kontrol; ilk altı hata yeniden doğrulandı; başlangıç iletişim testleri | Gerçek telefon/SMTP teslimi, her legacy özel akış ve tüm cihazlar test edilmedi |
| Kod mimarisi / bakım | 85 | Sunucu bileşeni içerikleri, tek kaynaklı proje modeli, saf rapor hesaplama, üretilebilir envanter, yeni any/effect/state yok | Mevcut büyük istemci bileşenleri topluca refactor edilmedi; kapsam pazarlama/medya |
| Teknik SEO / Search hazırlığı | 90 | 62 canonical URL, sıfır yerel SEO hatası; altı eski404 bugün çalışıyor; /tr Google'da indeksli | Bütün URL'ler için GSC indeks doğrulaması yok; ana sayfa videosu indeksli görünmüyor |
| İçerik / marka tutarlılığı | 85 | TR/EN karar desteği ve iki rehber; yeni fiyat/garanti/sonuç iddiası yok; 19 yerel ofis keşfi ayrı kanıt seviyeleriyle | Müşteri görüşmeleri, mevcut medya telif/render ve bazı eski ticari bilgiler teyit bekliyor |
| Performans | 80 | URL bazlı resmi Lighthouse ham raporları; düşük sonuçlar ve trace hataları korunuyor; önce ölç–deney–geri al döngüsü | 90 hedefi bütün URL'lerde henüz doğrulanmış değil; güncel sayısal sonuç SUMMARY.md içinde |
| Erişilebilirlik | 85 | axe WCAG2.2 AA, klavye/menü testleri, reduced motion, JS kapalı içerik, boş dekoratif alt ve adlandırılmış proje linkleri | Kapsamlı ekran okuyucu ve fiziksel cihaz denetimi yok |
| Güvenlik | 85 | Üretim npm audit sıfır bilinen açık; validation/sanitize/bot/rateLimit/mail testleri; gerçek ileti gönderilmedi | Yetkili penetrasyon testi ve hukuki uygunluk onayı yok |
| Deployment / gözlemlenebilirlik | 60 | Production build geçti; mevcut CI ve deployment yöntemi korundu; rapor testleri CI'ya eklendi | Yeni sürüm bu çalışmada production'a çıkmadı; Vercel ayrıntılı UI kontrolü araç tarafından durduruldu |

Performans puanı bir Lighthouse ortalaması değildir; bu alanın kalan riskine dair kaba değerlendirmedir. Her URL/mod gerçek skor ve metrikleri ayrı performans tablosunda yer alır. Başarısız/engelli bir kontrol bu puanlar nedeniyle PASS sayılmaz. Pazarlama başarısı puanlanmadı: nitelikli görüşme/satış baseline'ı yok.
