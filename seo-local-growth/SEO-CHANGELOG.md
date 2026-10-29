# SEO değişiklik kaydı: yerel SEO turu (29 Ekim 2026)

| Dosya | Değişiklik | Neden | Beklenen etki | Test | Geri alma |
|---|---|---|---|---|---|
| `src/lib/serviceLandings.ts` | `ic-mimarlik-ankara` TR başlık "İç Mimarlık · İncek, Gölbaşı, Ankara", EN "Interior Architecture in İncek, Gölbaşı & Ankara" | "İncek/Gölbaşı iç mimar(lık)" sorgularının hedef sayfası bu. Ofis İncek'te. | Sayfa dizine girdikten sonra bu sorgularla alaka artar. Sıra garantisi yok. | Yerel sunucuda `<title>` doğrulandı. Vitest 99/99. | Satırları eski değerine döndürün |
| `src/lib/serviceLandings.ts` | Aynı sayfanın "Neden U+ Studio" paragrafına TR/EN tek cümle: Merkez İncek Plaza, İncek ve Gölbaşı'na yakınlık, Ankara geneli | Başlık ile görünür içerik uyumlu olsun. Bilgi doğrulanmış (İşletme Profili adresi). | — | Yerelde görünür metin doğrulandı | Cümleyi silin |
| `src/lib/seo.ts` | `Organization.sameAs` listesinden Armut çıkarıldı (yorum satırıyla). Altbilgideki Armut bağlantısı duruyor. | Armut kaydı "diş kliniği tasarımı" kategorisinde | Google'ın işletme kimliğinde yanlış kategori sinyali kalkar | JSON-LD'de sameAs: Instagram, Google Maps, Yandex, Peyzaj Rehber | Satırı geri ekleyin. Armut kategorisi düzelince geri eklenmeli. |

Regresyon: `npx vitest run` 99/99, `npx tsc --noEmit` temiz, eslint `src/lib` temiz. Yerel dev sunucuda `seo-audit` çalıştırıldı. İki EN sayfada görülen 500, dev sunucunun eşzamanlı derlemesinden kaynaklandı (`Unexpected end of JSON input`). Tek tek istendiğinde ikisi de 200, canlıda da 200. Playwright e2e çalıştırılmadı (izin gerekiyor). CI push'ta çalıştırır.
