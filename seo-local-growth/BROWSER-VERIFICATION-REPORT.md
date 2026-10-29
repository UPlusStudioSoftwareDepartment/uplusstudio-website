# Tarayıcı doğrulama raporu

**Bağlantı:** Claude in Chrome eklentisi bu oturumdan çalıştı (sahibin Chrome'u, kendi Google oturumu). Ayrı bir sekme grubunda çalışıldı; sahibin sekmelerine dokunulmadı. Uygulamanın kendi tarayıcı panelinde Google oturumu yok, bu yüzden Search Console oradan açılamadı. Sonuç: Chrome üzerinden **erişim var**.

Tarih: 29 Ekim 2026, ~14:30–15:05 TSİ. Masaüstü Chrome, ekran 2560×1271. CAPTCHA veya engel görülmedi.

| Kapsam | Ne yapıldı | Beklenen | Görülen | Sonuç |
|---|---|---|---|---|
| GSC Performans | 3 ay, sorgular (53 satır) ve sayfalar (10 satır) okundu | Veri | 53 tık, 745 gösterim, ort. konum 5,4 | PASS (okundu) |
| GSC Sayfalar | Rapor okundu | Güncel dizin sayısı | 0 dizinde / 6 dizinde değil (grafik gecikmeli) | PASS (okundu) |
| GSC URL denetimi | 9 URL Google kaydına göre denetlendi. Canlı test ve dizine ekleme isteği yapılmadı. | Dizin durumu | 5 dizinde, 4 dizinde değil | PASS (okundu) |
| GSC dizine ekleme isteği | Sahibin onayıyla, fcdb80b canlıyken | 6 hizmet sayfası | 2 kabul edildi (ofis, iç mimarlık), 3.de "Quota Exceeded" | PARTIAL: kalan 4 ertesi gün |
| Google arama | 39 sorgu tek tek (u+studio = U+Studio) | Organik ilk 10, harita paketi | `SERP-COMPETITOR-MATRIX.csv` | PASS |
| Google Haritalar | "mimarlık ofisi İncek" (İncek merkezli), "iç mimar Gölbaşı" | Liste sırası | U+ 5. / ilk 10'da yok | PASS |
| İşletme Profili | Herkese açık profil okundu | Ad, kategori, saat | Saatler boş | PASS (okundu). Yönetim ekranında işlem yapılmadı. |
| Canlı site | 56 URL'nin tamamı ayrı bir otomatik tarayıcıda (Playwright) mobil ve masaüstü açıldı, JS sonrası DOM karşılaştırıldı (`seo-audit/RENDER-CHECK.csv`) | 200, içerik görünür | 56/56 | PASS |
| Değişen sayfa | Yerel geliştirme sunucusunda `/tr/services/ic-mimarlik-ankara` ve `/en/services/ic-mimarlik-ankara` uygulama tarayıcısında açıldı | Yeni başlık ve cümle | Doğrulandı | PASS (yerel). Canlı: push sonrası. |

Ekran görüntüleri rapora eklenmedi: Search Console ekranlarında hesap bilgisi var. Bulgular yalnızca sayı ve URL olarak aktarıldı.

Sınırlar: tek konum, tek cihaz, oturumu açık sahip hesabı. Başka bir kullanıcının gördüğü sıra farklı olabilir. Mobil SERP ayrıca ölçülmedi.
