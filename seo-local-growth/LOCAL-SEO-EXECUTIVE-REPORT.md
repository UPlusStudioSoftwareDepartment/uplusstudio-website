# U+ Studio — yerel SEO ve anahtar kelime raporu

**Tarih:** 29 Ekim 2026 · **Kanıt:** Search Console, Google araması ve Google Haritalar sahibin Chrome'unda (Claude in Chrome) salt okunur açıldı. Site kodu ve canlı site ayrıca test edildi.

Google'da sıra garanti edilemez. Bu rapordaki sıralar tek bir oturumun ölçümüdür: masaüstü Chrome, Türkçe, Google'ın tarayıcı için tahmin ettiği konum (Ankara), sahibin Google hesabı açık. Hesap İşletme Profili'nin sahibi olduğu için kendi işletmesini daha kolay görebilir. Başka bir kullanıcı, konum ve cihazda sonuç farklı olur.

## 1. Tek cümlelik teşhis

Marka aramalarında site birinci. Yerel aramalarda görünmemesinin ana nedeni ise içerik değil, **bu aramalar için yazılmış sayfaların Google tarafından henüz hiç taranmamış olması**. `/tr/services` ve beş hizmet sayfasının hepsi "Keşfedildi, şu anda dizine eklenmedi" durumunda. Google onları yalnızca site haritasından biliyor ve hiç ziyaret etmemiş.

## 2. Yönetici tablosu

| Grup | Hedef sorgu | Ölçülen sıra (29 Eki, tek oturum) | Hedef sayfa | GSC (90 gün) | Rakip durumu | Teknik / dizin | Sonraki adım |
|---|---|---|---|---|---|---|---|
| Marka | U+ Studio (+10 varyant) | 1. sıra (11/12). "U+Studio" boşluksuz: ilk 10 dışı | `/tr` | "u+ studio" 6 gösterim, 1 tık | "U+Studio"da Google "U-Studio"yu (Etimesgut) gösteriyor | `/tr` dizinde ✔ | Koru |
| İncek mimarlık | İncek mimarlık / ofisi / mimar | **5.** (ana sayfa) / – / – | `/tr/services/incek-golbasi-mimarlik-ofisi` | Gösterim yok | marjmimarlik, naba, bekirasik, tdmimarlik ilçe sayfaları | Hedef sayfa dizinde değil ✖ | Dizine eklenmesini iste |
| İncek iç mimarlık | İncek iç mimar / iç mimarlık | – / – | `/tr/services/ic-mimarlik-ankara` | Gösterim yok | incekicmimarlikofisi, tdmimarlik, naba | Dizinde değil ✖ | Başlık güncellendi, dizine eklenmesini iste |
| Gölbaşı mimarlık | Gölbaşı mimarlık / ofisi / mimar | – / – / – | ofis sayfası | Gösterim yok | Bulurum, Sahibinden, Armut dizinleri ilk sıralarda | Dizinde değil ✖ | Dizin kayıtları + dizine eklenmesini iste |
| Gölbaşı iç mimarlık | Gölbaşı iç mimar / iç mimarlık | – / – | iç mimarlık sayfası | Gösterim yok | golbasiicmimarlikofisi, korumimarlik | Dizinde değil ✖ | Yukarıdakiyle aynı |
| Ankara mimarlık | Ankara mimarlık / ofisi / mimar / +müh. | – (4 sorgu) | `/tr` | Gösterim yok | mosart, sahibinden, armut, yandex kategori | `/tr` dizinde ✔ | Uzun vade: otorite, İşletme Profili |
| Ankara iç mimarlık | Ankara iç mimar / iç mimarlık | – / – | iç mimarlık sayfası | Gösterim yok | ankaraicmimarlik.com, rulericmimarlik | Dizinde değil ✖ | Dizine eklenmesini iste |
| Genel | mimarlık / mimar / iç mimarlık / mühendislik | – | `/tr` | "mimarlık" 6 gösterim, ort. 2,7 (yerel kişiselleştirme) | Wikipedia, üniversiteler, kariyer.net | — | Kısa vadede hedef değil |

**Harita (Google Maps):** "mimarlık ofisi İncek" aramasında, İncek merkezli haritada U+ Studio **5. işletme** (KUMM, Riva, Güneş İncek, Mimar Cemalettin Kılıç'tan sonra). "iç mimar Gölbaşı" aramasında ilk 10'da yok. Arama sayfasındaki 3'lü harita paketinde hiçbir yerel sorguda yok.

Tam liste: `TARGET-KEYWORDS.csv`, `SERP-COMPETITOR-MATRIX.csv`, `KEYWORD-TO-PAGE-MAP.csv` (40 sorgu).

## 3. Neden geride: kanıta dayalı kök nedenler

1. **Hedef sayfalar dizinde değil** (en büyük etken). URL denetimi, 29 Eki: `/tr`, `/tr/about`, `/tr/contact`, `/tr/projects`, `/tr/projects/villa-donusumu` dizinde. `/tr/services`, `incek-golbasi-mimarlik-ofisi`, `ic-mimarlik-ankara`, `villa-mimari-proje-ankara` ise "Keşfedildi, şu anda dizine eklenmedi", son tarama yok. Sayfalar teknik olarak hazır (200, canonical, noindex yok, render temiz; bkz. `seo-audit/`). Google yeni ve küçük bir siteyi taramayı erteliyor.
2. **Site çok yeni.** 90 günde 53 tıklama, 745 gösterim. Yalnızca 10 URL gösterim almış. Kök alan adı ekim ortasına kadar Google'a 404 dönüyordu (28 Eki notu).
3. **Rakipler yıllardır dizinde ve ilçe adına özel sayfaları var.** Örnek: marjmimarlik.com/incek-mimarlik-ofisi ve /golbasi-mimarlik-ofisi; naba.com.tr/blogdetay/incek-… ve golbasi-…; bekirasikmimarlik.com/incek-… ve golbasi-…. Çoğu aynı şablonun ilçe adı değiştirilmiş kopyası. Google bunu "doorway" olarak sınıflar, bu yüzden kopyalanmadı. U+ Studio'nun avantajı gerçekten İncek'te bir ofisinin olması. Ofis sayfası tam bunu anlatıyor, yeter ki dizine girsin.
4. **Gölbaşı aramalarında dizin siteleri ilk sırada:** Bulurum, Sahibinden, Armut, Yellowpages. Bu sitelerde doğru kategoriyle görünmek, sitenin kendisinden daha hızlı sonuç verir.
5. **İşletme Profili eksik:** çalışma saatleri boş. Armut kaydı "diş kliniği tasarımı" kategorisinde ve "U+ Studio Gölbaşı" aramasında görünüyor.
6. **Genel sorgular** ("mimarlık", "iç mimarlık", "mühendislik") bilgi niyetli: Wikipedia, üniversiteler, iş ilanları. Bir stüdyo sitesinin kısa vadede bu sorgularda ilk sayfaya çıkması gerçekçi değil.

## 4. Bu turda yapılanlar (kod)

| Değişiklik | Dosya | Neden | Test |
|---|---|---|---|
| İç mimarlık sayfasının başlığı "İç Mimarlık, Ankara" → **"İç Mimarlık · İncek, Gölbaşı, Ankara"** (EN: "Interior Architecture in İncek, Gölbaşı & Ankara") | `src/lib/serviceLandings.ts` | "İncek/Gölbaşı iç mimar" aramalarının tek hedef sayfası bu. Ofis gerçekten İncek'te. | Yerel sunucuda başlık doğrulandı. 99/99 birim testi geçti. |
| Aynı sayfaya tek cümle eklendi: ofisin Merkez İncek Plaza'da olduğu, İncek ve Gölbaşı'na yakınlık, Ankara geneli | aynı | Sayfa gövdesi İncek'i hiç anmıyordu. Başlık ile içerik uyumlu olmalı. | Yerelde TR/EN görünür metin doğrulandı |
| `Organization.sameAs` listesinden Armut çıkarıldı (alt bilgideki görünür link kaldı) | `src/lib/seo.ts` | Armut kaydı "diş kliniği tasarımı" kategorisinde. Google'a kimlik sinyali olarak yanlış. | JSON-LD'de sameAs 4 bağlantı |

Yeni sayfa açılmadı. İlçe adı değiştirilmiş kopya sayfa, anahtar kelime doldurma, sahte adres veya yorum eklenmedi.

**Durum:** `LIVE_VALIDATED`: `fcdb80b` canlıda, başlık canlıda doğrulandı, `npm run seo:audit` 0 FAIL. Dizine ekleme isteği: ofis ve iç mimarlık sayfaları gönderildi, kalan 4 sayfa günlük kota nedeniyle ertesi güne kaldı.

## 5. Sahibin yapması gerekenler (öncelik sırasıyla)

1. **Search Console → URL denetimi → "Dizine eklenmesini iste"** (günde ~10 kota). Değişiklik canlıya çıktıktan sonra şu sırayla: ofis sayfası, iç mimarlık, `/tr/services`, villa, tadilat, ticari, ardından EN karşılıkları. Ayrıntı: `SEARCH-CONSOLE-BASELINE.md`.
2. **İşletme Profili:** çalışma saatlerini ve açılış tarihini girin. Ofis, tabela, ekip ve proje fotoğrafları ekleyin, ayda en az 2 gönderi paylaşın, tamamlanan işlerin müşterilerinden yorum isteyin (karşılıksız, seçmeden). Bkz. `GOOGLE-BUSINESS-PROFILE-AUDIT.md`.
3. **Dizin kayıtları:** Armut kategorisini düzeltin. Bulurum ve Sahibinden (mimarlık-mühendislik hizmetleri, Gölbaşı) kaydı açın. HizmetX'teki yanlış 0850 telefonu ve "Polatlı" bilgisini düzeltin. İsim, adres ve telefon her yerde birebir aynı olsun.
4. **İçerik onayı** (`CONTENT-GAPS-AND-APPROVALS.md`): hangi projeler İncek veya Gölbaşı'nda, hangi mühendislik hizmetleri (statik proje? şantiye şefliği?) gerçekten veriliyor. Bunlar doğrulanırsa proje ve hizmet sayfaları gerçek yerel kanıtla güçlenir.

## 6. Dosyalar

`TARGET-KEYWORDS.csv` · `SERP-COMPETITOR-MATRIX.csv` · `KEYWORD-TO-PAGE-MAP.csv` · `SEARCH-CONSOLE-BASELINE.md` · `GOOGLE-BUSINESS-PROFILE-AUDIT.md` · `CONTENT-GAPS-AND-APPROVALS.md` · `ON-PAGE-SEO-AUDIT.md` · `SEO-CHANGELOG.md` · `90-DAY-TRACKING-PLAN.md` · `BROWSER-VERIFICATION-REPORT.md`
