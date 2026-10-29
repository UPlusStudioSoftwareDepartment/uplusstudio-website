# 90 günlük takip planı

**T0:** 29 Ekim 2026 (bu rapor). Her kontrolde aynı tarih aralığı uzunluğunu karşılaştırın. Search Console verisi 2–3 gün gecikmeli gelir. Değişimi tek bir işe bağlamayın; mevsim, sıra dalgalanması ve arama hacmi de etkiler.

## Ölçütler (üç düzey ayrı tutulur)

| Düzey | Ölçüt | Kaynak | T0 |
|---|---|---|---|
| Teknik | Hedef 6 hizmet sayfasından kaçı "Google'da" | GSC URL denetimi | 0/6 |
| Teknik | `npm run seo:audit` FAIL sayısı | Depo | 0 |
| Görünürlük | 28 günlük tıklama / gösterim | GSC Performans | 7 / 93 |
| Görünürlük | Marka dışı sorgu gösterimi ("studio" geçmeyen; başka firma adları ve kişi adları hariç) | GSC Performans, sorgu filtresi | ≈ 48 / 90 gün (çoğu "architecture", "civil engineer", "mimarlık") |
| Görünürlük | "İncek mimarlık" organik sıra | Tarayıcı, aynı koşul | 5 |
| Görünürlük | Haritada "mimarlık ofisi İncek" sırası | Google Haritalar, İncek merkezli | 5 |
| İş sonucu | Arama, yol tarifi, web sitesi tıklaması | İşletme Profili → Performans | Okunmadı (yetkiyle bakılmalı) |
| İş sonucu | İletişim ve randevu formu talepleri | Stüdyo e-postası (sayı, kişisel veri yok) | Sahip sayar |

## Takvim

| Tarih | Sahip | Ne yapılır | Başarı ölçütü |
|---|---|---|---|
| Push sonrası (T1) | Claude + sahip | `npm run seo:audit` canlıda. Sahip: 6 hizmet sayfası için dizine ekleme isteği. | Audit 0 FAIL. İstekler kabul edildi. |
| 5 Kasım (T+7) | Sahip | URL denetimi: 6 sayfa. İşletme Profili saatleri ve fotoğrafları girildi mi? | ≥ 3/6 sayfa Google'da |
| 12 Kasım (T+14) | Sahip / Claude | GSC sayfalar ve sorgular. Proje sayfaları için dizine ekleme isteği. | Hizmet sayfaları gösterim almaya başladı |
| 28 Kasım (T+30) | Claude | 40 sorguluk SERP tekrar (aynı koşul). GSC 28 gün ↔ T0. | 6/6 hizmet sayfası dizinde. "İncek mimarlık" ilk 5'te kalıyor. En az bir İncek/Gölbaşı sorgusu gösterim alıyor. |
| 28 Aralık (T+60) | Claude + sahip | Dizin kayıtları (Bulurum, Sahibinden, Armut düzeltmesi) yapıldı mı? Proje konumları onaylandı mı? Onaylandıysa proje sayfalarına eklenir. | Marka dışı gösterim T0'ın 3 katı (hedef, garanti değil) |
| 27 Ocak 2027 (T+90) | Claude | Tam karşılaştırma ve yeni öncelikler | Yerel sorgularda ilk sayfa (1–10) en az 2 sorguda. Harita 3'lü pakette en az "İncek" sorgularında. |

Hedefler iddialı ama garanti değil. #1 sıra bir iş hedefidir; ölçüm, her adımın gerçekten olup olmadığını gösterir.
