# Video performansı — tanı ve sınırlar

30 Ekim 2026. Lighthouse13.6.0, Chrome156.0.8078.73, yerel production QA. Önce AbUZ6_Aazt9t7vOKYONrc; sonra 091H0EFQ44AZ3MrTmlqQ9. Farklı yöntemler tek medyana karıştırılmadı. Paylaşılan Windows makinesinde farklı zamanlarda yapılan koşular; kazancın tamamının tek satır koda atfedildiği kontrollü saha A/B testi değildir.

| Yöntem / üç mobil koşu medyanı | Önce P → sonra P | LCP ms önce → sonra | TBT ms önce → sonra |
|---|---|---|---|
| Varsayılan simulate | 84 → 80 | 4437 → 4794 | 87 → 167 |
| DevTools CPU/ağ kısıtlaması | 65 → 83 | 3084 → 2742 | 1118 → 399 |

Varsayılan simülasyon hedefi karşılanmadı; bu veri hız iyileşmesi kanıtı sayılmaz. DevTools deneyi farklı sonuç veriyor; fark tek başına araç hatası veya bütün gerçek cihazlarda aynı deneyim kanıtı değildir. [Resmî Lighthouse throttling rehberi](https://github.com/GoogleChrome/lighthouse/blob/main/docs/throttling.md), simülasyonun sınır durumlarında gerçek kısıtlamayla derin inceleme öneriyor. Erişim: 30 Ekim 2026.

İlk simülasyon ham raporunda kısıtlamasız gözlenen LCP234ms, hesaplanan mobil LCP4431ms. Poster High öncelikli ve ilk HTML'de; yalnızca lazy/preload değişikliği kök çözüm sayılmadı. Perde sürelerini kısaltma deneyi fayda göstermediği için geri alındı.

Uygulanan hedefli değişiklik: native video posterini mevcut next/image getImageProps çıktısıyla servis etmek ve aynı URL'yi preload etmek. Yeni state/hook/paket yok. Orijinal dosya ve schema/sitemap thumbnail URL'si korunuyor. AVIF destekleyen istemciye AVIF, diğerlerine mevcut WebP formatı; iki yanıt da HTTP200 ve doğru MIME olarak test edildi.

Byte kanıtı: 58.584 → 41.549 (yaklaşık %29,1 azalma); 1280×716 korunuyor. Özgün/optimize görseller manuel karşılaştırıldı; belirgin kalite farkı görülmedi. Bu kayıpsızlık iddiası değildir. Karşılaştırma PNG ve poster-byte-proof.json 2026-10-30 kanıt dizininde. Standart aktarım ölçümü var; saha INP, satış veya üretim LCP kazanımı iddiası yok.

Gerçek Trace dosyaları before/after DevTools raw klasörlerinde .trace.json; JSON/HTML raporları ve tekil kötü örnekler saklandı. Sonraki iş: düşük güçlü fiziksel cihazda trace/etkileşim ölçümü ve hizmetler sayfasının istemci hydration maliyeti. Native video, görünür poster veya kontroller skoru yükseltmek için kaldırılmadı.
