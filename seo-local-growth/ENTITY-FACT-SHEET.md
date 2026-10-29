# U+ Studio: doğrulanmış kimlik bilgileri

Yapay zekâ aramaları ve Google, işletmeyi bu bilgilerin web'de ne kadar tutarlı olduğuna göre tanır. Aşağıdakiler yalnızca kaynağı gösterilebilen bilgilerdir. Bir alan değişirse önce burası, sonra site, İşletme Profili ve dizin kayıtları güncellenmeli.

| Alan | Değer | Kaynak / doğrulama | Sitede nerede |
|---|---|---|---|
| Marka adı | U+ Studio | Logo, site başlığı, `WebSite.name` | Her sayfa |
| Tabeladaki ad | U+ Studio \| Mimarlık & Mühendislik | İşletme Profili, sahip teyidi 28 Eki 2026 | `Organization.alternateName` |
| Web sitesi | https://www.uplusstudio.com.tr (TR: /tr, EN: /en) | Canlı, canonical | — |
| Adres | İncek Mah. Reyhan Cd. No:3, Merkez İncek Plaza Kat:1 D:2, 06830 Gölbaşı / Ankara | İşletme Profili | İletişim, ofis sayfası, JSON-LD |
| Konum türü | Fiziksel ofis (ziyaret edilebilir) | İşletme Profili, ofis fotoğrafı | Ofis sayfası |
| Telefon / WhatsApp | +90 545 320 40 07 | İşletme Profili | İletişim |
| E-posta | info@uplusstudio.com.tr | Site. 28 Eki notu: info@ posta kutusunun DNS'i sahibin işi. | İletişim |
| Kurucular | Hacer Uyar (Yüksek Mimar), Rıdvan Uyar (İnşaat Mühendisi) | Hakkımızda sayfası, LinkedIn (Hacer Uyar) | Hakkımızda, JSON-LD `founder` |
| Hizmetler (sitede yazanlar) | Mimari tasarım (konsept, avan, uygulama projeleri); konut ve villa; iç mimarlık ve mekâna özel mobilya; tadilat ve dönüşüm; ticari mekân (kafe, ofis, spor salonu, mağaza); 3D görselleştirme; mühendislik danışmanlığı, izin ve onay desteği; uygulama ve proje yönetimi, anahtar teslim | `src/lib/serviceLandings.ts`, `services.ts` | Hizmetler |
| Hizmet bölgesi | Ofis İncek'te. Başta İncek, Gölbaşı, Çankaya olmak üzere Ankara ve Türkiye geneli. | Ofis sayfası SSS | Ofis sayfası, JSON-LD `areaServed` |
| Puan | 5,0 / 11 Google yorumu (29 Eki 2026) | Google Haritalar | Sitede rozet. JSON-LD'de puan işaretlemesi yok (bilinçli). |
| Resmî profiller (`sameAs`) | Instagram @u.plusstudio; Google Haritalar (cid 2009045103581452115); Yandex Haritalar; Peyzaj Rehber | `src/lib/seo.ts` | JSON-LD |

## OWNER_VERIFICATION_REQUIRED

- **Mühendislik kapsamı:** Statik proje çiziliyor mu, şantiye şefliği yapılıyor mu? Google AI Mode İngilizce yanıtta "in-house structural engineering" diyor. Sitede böyle bir ifade yok. Doğruysa açıkça yazılmalı, değilse bu boşluk yanlış yorumlara açık.
- **Projelerin konumu ve yılı** (bkz. `CONTENT-GAPS-AND-APPROVALS.md`).
- **Çalışma saatleri ve kuruluş tarihi.**
- **Armut** (diş kliniği kategorisi) ve **HizmetX** (0850 telefon, "Polatlı") kayıtlarındaki yanlışlar. ChatGPT, işletmeyi anlatırken Armut profilini kaynak gösteriyor.
- **icmimarbul** ve **ankaragolbasi.com** kayıtlarının bilgileri. İkincisi Bing'de marka aramasında sitenin önünde çıkıyor.
