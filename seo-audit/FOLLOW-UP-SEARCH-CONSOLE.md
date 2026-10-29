# Search Console takibi (yalnızca site sahibi yapabilir)

Bu denetimde Search Console'a erişim yoktu (tarayıcıda Google hesabı oturumu açık değildi), bu yüzden aşağıdaki adımlar `BLOCKED — GSC_NOT_CONNECTED` olarak kaldı. Mülk: `sc-domain:uplusstudio.com.tr`.

## T1 — yayından sonra (29 Ekim 2026, `7eb46df` canlıda)

1. **Site haritaları** → `https://www.uplusstudio.com.tr/sitemap.xml` satırına tıklayın. "Başarılı", 56 sayfa görünmeli. Video sayısı bir sonraki okumada 18'den **10**'a düşecek. Bu bilinçli bir değişiklik: videolar artık yalnızca kendi izleme sayfalarında (`/projects/<slug>/video`) ve ana sayfada listeleniyor. Yeniden göndermek zorunlu değil, Google site haritasını kendisi yeniden okur. İsterseniz bir kez "Site haritası ekle" ile aynı adresi yeniden gönderebilirsiniz.
2. **URL denetimi**: Aşağıdaki adreslerde "Canlı URL'yi test et" → "Test edilen sayfayı görüntüle" → **Ekran görüntüsü** ve **HTML** sekmelerine bakın. Videonun ve başlığın göründüğünü doğrulayın. Ardından yalnızca bu sayfalar için **Dizine eklenmesini iste**'ye basın (toplu ya da tekrar tekrar istemeyin):
   - `https://www.uplusstudio.com.tr/tr/projects/villa-donusumu/video`
   - `https://www.uplusstudio.com.tr/tr/projects/ofis-yenileme/video`
   - `https://www.uplusstudio.com.tr/tr/projects/konut-uygulama/video`
   - `https://www.uplusstudio.com.tr/tr/projects/konut-ic-mekan/video`
3. **Video sayfaları** raporu (Dizin oluşturma → Video sayfaları): Proje sayfalarında "Video, sayfanın ana içeriği değil" gibi nedenler görünüyorsa bu beklenen bir durum. O sayfalar artık site haritasında video olarak bildirilmiyor, nedenler zamanla azalmalı.
4. **Kaldırılan eski adresler**: Google'da hâlâ `uplusstudio.com.tr › faq` sonucu görünüyor. Adres kalıcı olarak (308) `/contact` sayfasına yönleniyor. İşlem gerekmez, tarama ile düşecek.

## T+7 gün (5 Kasım 2026)

- Site haritaları: son okuma tarihi 29 Ekim'den sonra mı, hata var mı?
- Sayfalar raporu: "Dizine eklendi" sayısı ve "Neden dizine eklenmiyor" listesi. 28 Ekim'de başlatılan 404 doğrulamasının sonucu.
- Video sayfaları: dizine eklenen video sayısı. 28 Ekim'de 1 videoydu (ana sayfa).

## T+14 / T+30 gün (12 ve 28 Kasım 2026)

- Performans → Arama sonuçları: 28 günlük tıklama/gösterim, aynı uzunluktaki önceki dönemle karşılaştırın. 28 Ekim taban çizgisi: 7 tıklama, 93 gösterim, TO %7,5, ort. konum 5,2. Arama türü filtresini **Video** ve **Görsel** yapıp ayrıca bakın.
- Sorgular: "u+ studio", "uplusstudio", "incek mimarlık", "gölbaşı mimarlık", "ankara mimarlık".
- Search Console verisi 2–3 gün gecikmeli gelir. Google'ın ne zaman tarayacağı bizim elimizde değil.

## Site dışı işler (sıralamaya en çok etki eden kısım)

- Google İşletme Profili: çalışma saatleri ve açılış tarihi boş. Doldurulmazsa haritada "Açık" filtresinde görünmezsiniz. Ofis, tabela, ekip ve proje fotoğrafları ekleyin, düzenli gönderi paylaşın, mutlu müşterilerden yorum isteyin.
- "U+Studio" (boşluksuz) aramasında Google "U-Studio" adlı başka bir firmayı gösteriyor. Bunu yalnızca markanın zamanla ve dış bağlantılarla tanınması düzeltir, sitede yapılacak bir şey yok.
- Armut, HizmetX, Yandex kayıtlarındaki yanlış ad/telefon/kategori düzeltmeleri hâlâ açık.

## Yeniden denetim

```bash
npm run seo:audit
```

Canlı siteyi tarar ve `seo-audit/` altındaki CSV'leri yeniler. FAIL varsa çıkış kodu 1 olur. Yerel bir derlemeyi denetlemek için `BASE_URL=http://localhost:3000 npm run seo:audit`.
