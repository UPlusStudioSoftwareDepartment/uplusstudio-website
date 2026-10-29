# Dönüşüm planı

Kullanıcının 29 Ekim 2026 kararı: randevu seçme akışını kaldır, her ekranda Şimdi Ara kullan. Telefon ilk teması kolaylaştırabilir; gerçek performans etkisi DOĞRULANMADI.

Uygulama: `CallCta` tek telefon hedefini `studioInfo.phoneHref` üzerinden alır. Menüde arama bağlantısı menüyü kapatır. Ana sayfa, footer, proje, hizmet, iletişim ve kartvizitte randevu formu açılmaz. `AppointmentProvider`, modal ve takvim kaldırıldı. Eski imzalı randevu kartı/yanıt URL'leri ve API'leri daha önce paylaşılmış bağlantılar için korundu; yeni UI girişi yok.

North Star: stüdyonun kapsamına uyan, gerçek proje hakkında gerçekleşen görüşme veya teklif talebi. Telefon tıklaması görüşme değildir; görüşme satış değildir. Nitelik kriteri önerisi: gerçek proje ihtiyacı + konum + kapsam/aşama + ulaşılabilir ve izinli geri dönüş kanalı. Satış ekibi anonim toplamlarla manuel doğrulayabilir.

| Olay | Tetikleyici | Durum / kişisel veri |
|---|---|---|
| `view_service`, `view_project` | İlgili sayfa açılışı | Plan; yalnızca sayfa kimliği |
| `click_phone`, `click_whatsapp`, `click_email` | İlgili linke tıklama | Plan; konuşma/telefon/e-posta içeriği taşınmaz |
| `start_lead_form` | Mesaj formunda ilk düzenleme | Plan; alan değerleri taşınmaz |
| `submit_lead_form_success` | Sunucunun gerçekten teslimi doğrulaması | Plan; Gmail taslağı açılması başarı sayılmaz |
| `submit_lead_form_error` | İşlem hatası | Plan; yalnızca güvenli hata kategorisi |

Yeni üçüncü taraf izleme eklenmedi. Mevcut Telemetry ortam değişkeniyle kapalı kalabilir; kurulu olmasını etkin ölçüm saymayın. Rıza ve hukuki değerlendirme yapılmadan olay planını üçüncü tarafa bağlamayın. Mevcut mesaj formu doğrulaması, bot guard, rate limit ve gizlilik bağlantısı korunuyor. Yeni veri alanı eklenmedi.

Telefon tercihi düşük trafikte iki haftalık anonim görüşme notlarıyla değerlendirilebilir. Başlangıç verisi oluşmadan A/B üstünlüğü veya yüzdesel artış raporlanmaz. Mesai dışı erişim için mevcut yazılı kanallar alternatif olarak görünür kalır.
