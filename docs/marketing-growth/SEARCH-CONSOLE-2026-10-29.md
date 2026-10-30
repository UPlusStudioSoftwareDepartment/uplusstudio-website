# Search Console — gerçek hesap gözlemi

29 Ekim 2026, şirket Chrome profili Uplus. Hesap Google Account düğmesinde uplusstudiosoftwaredepartment@gmail.com olarak doğrulandı. İnceleme salt okunurdur; yeni sitemap gönderimi, indeks isteği, kullanıcı/izin veya profil değişikliği yapılmadı.

| Görünüm | Gerçek gözlem | Yorum / sınır |
|---|---|---|
| Domain property | sc-domain:uplusstudio.com.tr | Şirket hesabında mevcut |
| Sitemaps | https://www.uplusstudio.com.tr/sitemap.xml — Success | Google'ın sitemap işleme sonucu; indeks garantisi değildir |
| Sitemap submitted | 29 Ekim 2026 | Arayüzdeki tarih; bu çalışma yeniden göndermedi |
| Sitemap last read | 28 Ekim 2026 | Yeni yerel rehber sürümü için kanıt değildir |
| Discovered pages | 56 | Yerel sürümde 62 URL var; fark yayın/güncelleme gerektirir |
| Discovered videos | 18 | Beş benzersiz yerel MP4 dosyasıyla aynı metrik değildir |
| Overview | 53 total web search clicks | Bu görünümde tarih aralığı doğrulanmadı; baseline dönüşüm sayılmaz |
| Overview indexing | 6 not indexed, 0 indexed | Güncelleme tarihi/ayrıntı doğrulanmadan bugün bütün site indeks dışı sonucu çıkarılmadı |
| Overview recommendation | https://uplusstudio.com.tr/ için homepage isn't indexed | Non-www kök URL önerisi; tercih edilen www/tr canonical ile ayrı incelenmeli |
| Core Web Vitals | Mobile / Desktop No data | Saha LCP/INP/CLS için başarı iddia edilmedi |

Kaynak arayüzler: [Sitemaps](https://search.google.com/search-console/sitemaps?resource_id=sc-domain%3Auplusstudio.com.tr), [Overview](https://search.google.com/search-console?resource_id=sc-domain%3Auplusstudio.com.tr). Browser UI gözlemleri bu sohbetin araç çıktısında kayıtlıdır; özel Gmail içeriği rapora taşınmadı.

Daha önceki 09-validation-report.md içindeki şirket hesabı BLOCKED durumu önceki oturuma aittir; bu çalışmada hesap ve sitemap okunabildi. Güncel sorgu/sayfa ayrıntıları ve URL Inspection sonuçları ayrıca belirtilmeden doğrulanmış sayılmaz.

## Tarihli performans ve indeks ayrıntısı

Şirket profilinde ayrıca Performance → Queries / Pages okundu. Search type Web; grafik aralığı **28 Temmuz 2026–27 Ekim 2026**, arayüz son güncellemesi gözlem sırasında 4 saat önce.

| Metrik | Arayüz değeri |
|---|---:|
| Total clicks | 53 |
| Total impressions | 745 |
| Average CTR | %7,1 |
| Average position | 5,4 |

Ortalama konum tek bir sorgudaki sıra veya Ankara yerel sıralaması değildir. Bu değerler değişikliklerden önceki döneme aittir; yeni içeriğin başarısı olarak sunulmadı. Ülke/cihaz kırılımı uygulanmadı. İlk 10 sorguda mimarlık 2 tıklama/6 gösterim, u+ studio 1/6, u-studio 1/4, us studio mimarlık 0/30 görüldü. Benzer isimli sorguların tamamı U+ markasına ait talep sayılmadı; hacim/rekabet/lead tahmini üretilmedi. Tüm 53 sorgu dışa aktarılmadı; gözlem ilk 10 satırla sınırlı.

Pages görünümünde non-www kök 35 tıklama/191 gösterim, www kök 18/603, GBP UTM'li /tr URL'si 1/40, /tr 0/18 ve Villa Dönüşümü detayında 0/2 görüldü. Arayüz toplamı ve satırlar aynen kaydedildi; satır toplamlarından yeni istatistik türetilmedi. Öncelik: mevcut canonical yönlendirmeleri korumak, hizmet/proje/rehber keşfini güçlendirmek ve yayın sonrası aynı kapsamda yeni dönem ölçmek.

Page indexing raporunun son güncellemesi **23 Ekim 2026**. Altı 404 örneği: https://www.uplusstudio.com.tr/, https://uplusstudio.com.tr/, http://uplusstudio.com.tr/, http://www.uplusstudio.com.tr/, https://uplusstudio.com.tr/en, https://uplusstudio.com.tr/tr. Son taramalar 9 Eylül–16 Ekim arası; doğrulama 28 Ekim'de başlamış. 29 Ekim canlı HTTP denetiminde altısının tamamı 308 zinciri üzerinden doğru https://www.uplusstudio.com.tr/tr veya /en canonical adresine ulaşarak **200** döndü. Kanıt: reports/performance/2026-10-29/live-redirects.json; tekrar üretim: node scripts/redirect-check.mjs. Bu, Google'ın 404 doğrulamasını tamamladığı anlamına gelmez; mevcut doğrulama sürecine müdahale edilmedi.

## Canonical ana sayfa — gerçek URL Inspection sonucu

29 Ekim'de https://www.uplusstudio.com.tr/tr için URL Inspection açıldı: **URL is on Google / Page is indexed**. Son tarama 28 Ekim 2026 22:36:20, Googlebot smartphone; Crawl allowed Yes, Page fetch Successful, Indexing allowed Yes. User-declared canonical https://www.uplusstudio.com.tr/tr; Google-selected canonical Inspected URL. Sitemap olarak mevcut sitemap.xml görünüyor.

Bu URL düzeyindeki sonuç, 23 Ekim tarihli genel indeks raporundaki 0 indexed özetinden daha güncel bir gözlemdir; bütün site indeks dışı denmemelidir. Aynı görünümde video için **No video indexed**, yapılandırılmış video verisi için **1 valid item detected** yazıyor. Geçerli VideoObject tespiti video indekslenmesine eşit değildir. TEST LIVE URL veya REQUEST INDEXING düğmesine basılmadı.

Sonraki Vercel sekmesi kontrolünde bilgisayar kullanımı aracı etkin URL'yi güvenle saptayamadığı için tarayıcı erişimini bu turda durdurdu. Tarayıcıya yeni girdi gönderilmedi. Vercel hesap/proje ayrıntısı bu oturumda BLOCKED; yerel testler ve canlı salt okunur HTTP kontrolleri bundan ayrı yürütüldü.
