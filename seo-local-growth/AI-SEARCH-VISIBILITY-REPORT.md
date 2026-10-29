# Yapay zekâ aramalarında görünürlük

**Tarih:** 29 Ekim 2026, ~15:10–15:20 TSİ · sahibin Chrome'u (Claude in Chrome). Ayrıntılı kayıt: `AI-QUERIES-BY-LANGUAGE.csv`.

Yapay zekâ yanıtları her oturumda, konumda ve dilde değişir. Bir kez görülen bir yanıt, kalıcı bir sıra ya da kaynak garantisi değildir. Bu rapor 5 soruluk kontrollü bir örneklem; toplu sorgu yapılmadı. Üç farklı gözlem ayrı tutuldu: **adı geçmesi** (MENTION), **sitenin kaynak gösterilmesi** (CITATION) ve **resmî rapor** (Search Console / Bing Webmaster).

## Özet

| Platform | Marka sorusu (TR) | "İncek villa ofisleri" (TR) | "Gölbaşı iç mimar" (TR) | EN marka | EN "İncek/Gölbaşı architects" |
|---|---|---|---|---|---|
| Google AI Mode | ✔ Adı geçiyor, **site kaynak**, doğru | ✔ Listede **1.**, doğru | ✖ Yok | ✔ Doğru | ✔ İlk firma, ama "in-house structural engineering" abartısı |
| ChatGPT (oturumsuz, web araması) | ✔ Adı geçiyor, doğru. Kaynak: **Google işletme kaydı ve Armut**, site değil. | ✔ Listede 3. Kaynak: Google işletme kaydı | — | — | — |
| Perplexity | BLOCKED (giriş istiyor) | | | | |
| Microsoft Copilot | BLOCKED (giriş istiyor) | | | | |

## Ne anlama geliyor

1. **Google'ın yapay zekâ yanıtları sizi iyi tanıyor.** Google'a göre AI Overviews ve AI Mode için ek bir işaretleme veya `llms.txt` gerekmiyor; dizine alınmış ve özet gösterilebilir sayfa yeterli (belge, 2025-12-10). Sitenizin dizindeki sayfaları ve İşletme Profili zaten kullanılıyor. Hizmet sayfaları dizine girdikçe (bugün iki sayfa için istek gönderildi) "Gölbaşı iç mimar" gibi sorularda da kaynak olma şansı artar.
2. **ChatGPT siteyi değil, dış kayıtları kaynak gösteriyor.** ChatGPT'nin web araması büyük ölçüde Bing dizinine dayanıyor. Bing'de "U+ Studio mimarlık" aramasında **siteniz organik sonuçlarda yok**: yalnızca harita kartında ve ankaragolbasi.com rehberinde çıkıyor. Bu yüzden ChatGPT Armut profilini (diş kliniği kategorisindeki) okuyup hizmetleri oradan anlatıyor.
3. **Erişim engeli yok.** OAI-SearchBot, PerplexityBot, Bingbot ve Googlebot için robots.txt izinli, Vercel engellemiyor (`AI-CRAWLER-POLICY-MATRIX.csv`). Eğitim botları (GPTBot, ClaudeBot, Google-Extended…) sizin tercihinizle kapalı. OpenAI'ye göre bu, ChatGPT aramasını etkilemez.
4. **Abartı riski:** Google AI Mode İngilizcede "kurum içi statik mühendislik" ve "müşteriler belirtiyor" diyor. Sitede "mühendislik danışmanlığı" ve "taşıyıcı sistem kararları birlikte alınır" yazıyor. Mühendislik kapsamı sitede açıkça yazılırsa yapay zekâ tahmin etmek yerine bunu aktarır (`ENTITY-FACT-SHEET.md`).

## Yapılanlar

- Dil seçici gerçek bağlantı oldu, EN iletişim metinleri tek kaynağa indi (`HREFLANG-CANONICAL-AUDIT.md`).
- `llms.txt` veya yapay zekâya özel gizli metin eklenmedi. Google bunları kullanmıyor; diğer platformlar için de doğrulanmış bir fayda yok.

## Sahibin yapacakları (etki sırasına göre)

1. **Bing Webmaster Tools:** bing.com/webmasters → Microsoft hesabıyla giriş → "Google Search Console'dan içe aktar" (site otomatik doğrulanır, site haritası gelir). Ardından **AI Performance** raporu Copilot ve Bing alıntılarını gösterir. Bing Places'ta işletmeyi sahiplenin.
2. **Armut** kategorisini mimarlık/iç mimarlık olarak düzeltin. Açıklamayı sitedeki hizmetlerle aynı tutun. ChatGPT bu metni okuyor.
3. **IndexNow:** 29 Ekim 2026'da `d964de4` canlıyken, sahibin onayıyla gönderildi: `IndexNow: 200 OK for 56 URLs` (api.indexnow.org → Bing, Yandex). Bu yalnızca bir bildirimdir; dizine alınma garantisi değildir ve Google'a gitmez. Bing'deki durumu Bing Webmaster Tools açıldığında doğrulayın.
4. **Mühendislik kapsamını** yazılı olarak verin. İki dilde hizmet sayfasına eklenir.
5. Search Console'da "Get more details on your site's performance in generative AI features" bağlantısı var. Bu turda açılmadı; bir sonraki kontrolde (5 Kasım) okunacak.
