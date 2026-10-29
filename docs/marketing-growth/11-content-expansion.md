# Pazarlama içerikleri — ikinci uygulama

29 Ekim 2026. Kullanıcı önceki eklemelerin pazarlama içeriği açısından yetersiz kaldığını belirtti. Bu aşamada teknik skordan önce müşteri sorusunu, hizmetin değerini ve karar yolunu anlatan görünür içerik genişletildi.

## Gerçekte eklenenler

| Alan | Yeni içerik | Müşteriye faydası |
|---|---|---|
| Ana sayfa girişi | Mekânı kullanma ihtiyacından başlayan giriş ve Ankara/ofis bağlamı | Hizmet listesinden önce ziyaretçinin kendi ihtiyacını tarif etmesi |
| Ana sayfa: Projeniz hangi soruyla başlıyor? | Arsa/villa, iç mekân, yenileme, işletme için dört ayrı senaryo; her birinde problem, yaklaşım, hizmet ve mevcut proje bağlantısı | Kişinin kendine uygun başlangıç yolunu seçmesi |
| Ana sayfa: Birlikte vereceğimiz kararlar | Kullanım önceliği, mevcut mimar-mühendis kurucu yapısı, kapsam açıklığı | Genel üstünlük sıfatları yerine değerlendirilebilir çalışma yaklaşımı |
| Beş hizmet sayfası | Her hizmete özel giriş, üç karar konusu, kapsam değerlendirmesi | “Bana uygun mu, önce neyi konuşmalıyım?” sorularının yanıtı |
| Süreç metni | Keşif, tasarım, geliştirme ve uygulama için somut açıklamalar; uygulama kapsam dahilindeyse | Belirsiz pazarlama sıfatlarını azaltmak |
| Evox Gym, Kedili Butik Kafe, Ofis Yenileme | Mevcut proje açıklama ve galerisine dayanan iki ek paragraf; benzer ihtiyacı olan ziyaretçiye sorular | Projeyi sadece görsel beğeniyle değil kendi ihtiyacıyla değerlendirmek |
| Rehber kütüphanesi | İki tam metin rehber, TR/EN, başlıklar ve uygulanabilir soru listeleri | Telefon etmeye hazır olmayan ziyaretçiye yararlı değerlendirme içeriği |

Tüm metinler Türkçe ve İngilizce yazıldı. Yeni fiyat, ücretsiz hizmet, teslim süresi garantisi, referans, ruhsat yetkisi veya proje başarısı eklenmedi. Yeni proje müşteri hikâyesi uydurulmadı; mevcut görsel ve proje açıklamaları sınır olarak kullanıldı. Rehberler editoryal U+ Studio içeriği olarak sunuluyor; kurucunun incelemiş/onaylamış olduğu iddia edilmiyor.

## Yeni sayfalar

- `/tr/guides` ve `/en/guides`
- `/tr/guides/ilk-mimarlik-gorusmesi` ve `/en/guides/ilk-mimarlik-gorusmesi`
- `/tr/guides/mimari-teklif-karsilastirma` ve `/en/guides/mimari-teklif-karsilastirma`

Her rehberin özgün title/description, canonical, karşı dil bağlantısı, H1, sunucuda render edilen tam metni, breadcrumb ve ilgili hizmet/proje bağlantısı var. Rehberler ana sayfadan, hizmet kapsamı alanından ve footer'dan keşfediliyor; sitemap'e eklendi. Article işaretlemesi görünür başlık, açıklama ve U+ Studio byline ile sınırlı. Yeni analytics veya form eklenmedi. Ana CTA Şimdi Ara olarak kaldı.

## Kaynak ve sınırlar

Önceki 15 ofis araştırması `01-market-research.md` içinde. Bu aşamada ayrıca [Architects Registration Board görüşme hazırlığı kontrol listesi](https://arb.org.uk/public-information/before-hiring-an-architect/checklist-before-hiring-an-architect/) ve [RIBA proje brief'i rehberi](https://www.architecture.com/-/media/gathercontent/working-with-an-architect-for-your-development/additional-documents/ribaworkingwithanarchitectforyourdevelopmentpdf.pdf) üzerinden ihtiyaç, kullanım ve kapsam konuşmasının genel ilkeleri incelendi. Erişim: 29 Ekim 2026; RIBA için arama aracının sağladığı bölüm özeti kullanıldı. Bunlar Türkiye müşteri araştırması veya Türk mevzuatı olarak sunulmadı. Metinler kaynaklardan kopyalanmadı; stüdyonun mevcut hizmetleri ve portföyü için özgün soru ve örnekler yazıldı.

Müşterilerin dönüşüm oranı veya psikolojisi hakkında yeni kanıt yok. İçeriğin müşteri kararına yardımcı olması bir pazarlama hipotezidir; kazanılmış talep veya satış artışı olarak raporlanmaz.

## Uygulama ve bakım

`marketingContent.ts` ana sayfa ve hizmet karar metinlerini; `guides.ts` rehberleri taşır. Yeni alanlar statik sunucu bileşenleri; hizmet sayfasına composition ile eklendi, tüm yeni metinler global istemci paketine alınmadı. Proje anlatımları mevcut `projects.ts` modelinin `story` alanını kullanıyor. Hizmet kapsamı değiştiğinde ilişkili metin ve rehberler de gözden geçirilmeli. Bu belgede yayın yapıldığı iddia edilmiyor; yeni içerik yerel çalışma ağacında.

Son doğrulama: `12-content-validation.md`. Önceki `05-content-and-page-map.md` içindeki “yeni URL eklenmedi” ifadesi ilk uygulama aşamasına aittir; bu aşamada yukarıdaki altı URL eklendi.
