# Medya uygulama günlüğü

29 Ekim 2026. Bu çalışma öncesinde geniş içerik/test değişiklikleri vardı; bunlar korunmuştur. Önceki çalışmaları bu çalışmada sıfırdan üretilmiş gibi göstermeyin.

| Dosya | Somut işlem | Neden |
|---|---|---|
| src/components/home/HomeProjectPaths.tsx | Dört mevcut kapak; responsive Image; proje linki; lokalize figcaption | Metinle anlatılan ihtiyacı mevcut portföye bağlama |
| src/components/home/HomeDecisionSupport.tsx | Dört SVG süreç resmi; mevcut HTML liste ve başlıklar korunur | Çalışma aşamalarını görsel olarak ayırt etme |
| public/media/diagrams/process-*.svg | Dört gerçek SVG dosyası | Özgün, hafif ve şematik anlatım |
| scripts/marketing-inventory.mjs | Kaynak modellerden 62 sayfa ve 80 varlık envanteri | Yeni proje ve dosyaların bakımda gözden kaçmaması |
| scripts/lighthouse-audit.mjs + lighthouse-results.mjs | Tekrarlı koşu, medyan, ham JSON/HTML, devam etme, kategori eşikleri | Kanıtın tekrarlanabilirliği; eksik koşuya sahte PASS vermeme |
| scripts/lighthouse-results.test.mjs | Eksik/başarısız koşu, sıfır ve aykırı değer regresyonları | Raporun doğruluğu |
| e2e/visual-marketing.spec.ts | Yedi genişlik, TR/EN medya ve link; JS kapalı içerik; ekran görüntüsü | Görsel ve erişim regresyonu |
| next.config.ts | NEXT_DIST_DIR ile ayrı QA build | Açık dev sunucusunun derlemeyi etkilemesini azaltma |

Deney: açılış perdesi süreleri kısaltılıp video sayfası yeniden ölçüldü; doğrulanmış LCP kazanımı görülmedi. Değişiklik geri alındı. Kötü ve trace hatalı sonuçlar reports/performance/2026-10-29/after-video içinde saklandı; hız artışı iddiası yok.

Asset varlık kontrolü: 80 dosyada eksik yok. HTTP, tarayıcı, görsel ve Lighthouse son durumları 22-media-performance-and-indexability-audit.md ile MASTER-EXECUTION-REPORT.md içinde. Yeni schema ticari verisi, takip entegrasyonu, üretim deploy veya sosyal paylaşım yapılmadı.

30 Ekim güncellemesi: video posterleri getImageProps ile mevcut Next format müzakeresine bağlandı; AVIF/WebP uyumu ve native oynatma doğrulandı. Yeni bitmap dosyası üretilip proje görseli diye eklenmedi; kaynak dosyalar aynı, optimize yanıtlar Next cache'inde. Güncel değişiklik/test ve performans sınırları MASTER-EXECUTION-REPORT.md son bölümünde.
