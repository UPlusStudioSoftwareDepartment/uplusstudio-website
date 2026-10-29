# Sayfa içi SEO denetimi: hedef sayfalar

Teknik kontrol (HTTP, canonical, robots, hreflang, H1, JSON-LD, render) bütün 56 sayfa için `seo-audit/URL-INVENTORY.csv` ve `seo-audit/RENDER-CHECK.csv` dosyalarında: 0 FAIL. Burada yalnızca yerel sorguların hedef sayfaları niyet açısından değerlendiriliyor.

| Sayfa | Önceki başlık | Şimdiki başlık | H1 | Yerel kanıt (görünür metin) | Karar |
|---|---|---|---|---|---|
| `/tr` | U+ Studio \| Ankara Mimarlık, Tasarım ve Mühendislik · İncek, Gölbaşı | aynı | "U+ Studio — Mimarlık & İç Mimarlık & Mühendislik" + slogan | "İncek · Gölbaşı / Ankara" satırı, ofis sayfasına bağlantı | Marka ve "Ankara mimarlık" için doğru. Değişiklik yok. |
| `/tr/services/incek-golbasi-mimarlik-ofisi` | İncek Mimarlık Ofisi · Gölbaşı, Ankara | aynı | "İncek, Gölbaşı'nda mimarlık ofisi." | Tam adres, telefon, ofis fotoğrafı, SSS, 4 gerçek proje | İçerik yeterli. **Sorun dizinde olmaması.** |
| `/tr/services/ic-mimarlik-ankara` | İç Mimarlık, Ankara | **İç Mimarlık · İncek, Gölbaşı, Ankara** | "Daire ve villada iç mimarlık." | Önce yalnızca açıklamada geçiyordu. Şimdi gövdede de ofisin İncek'teki adresi yazıyor. | Değiştirildi |
| `/tr/services/villa-mimari-proje-ankara` | Villa ve Müstakil Ev Mimari Projesi, Ankara | aynı | "Villa ve müstakil ev mimari projesi." | "İncek'teki ofisimiz…" | Değişiklik yok |
| `/tr/services/tadilat-donusum-ankara`, `/ticari-mekan-tasarimi-ankara` | "…, Ankara" | aynı | — | Açıklamada İncek ve Gölbaşı | Değişiklik yok. Her sayfaya ilçe adı eklemek kalıp tekrarı olur. |

## İç bağlantılar

Ana sayfa (dizinde) her hizmet sayfasına açıklayıcı metinle bağlanıyor: "İncek mimarlık ofisi", "İç mimarlık", "Villa mimari proje", "Tadilat ve dönüşüm", "Ticari mekân tasarımı" ve konum satırı "İncek · Gölbaşı / Ankara". Bunlar hem menüde hem altbilgide normal `<a href>` olarak var. Taranabilir bağlantı eksikliği yok. Dizine girememenin nedeni Google'ın tarama önceliği.

## Yamyamlık (cannibalization)

- "İncek mimarlık": şu an ana sayfa 5. sırada, ofis sayfası dizinde değil. İkisi farklı niyete hizmet ediyor (marka ↔ yer). Ofis sayfası dizine girdiğinde Google birini seçecek. Birleştirme ya da canonical değişikliği gerekmiyor.
- GSC'de aynı sorgunun iki sayfaya bölündüğü bir durum yok (yeterli veri yok).
