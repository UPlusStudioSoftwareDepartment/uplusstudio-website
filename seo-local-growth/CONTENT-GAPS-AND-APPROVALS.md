# İçerik boşlukları ve sahibin onayı gereken bilgiler

Aşağıdakiler yerel sıralamaya en çok yardım edecek gerçek bilgiler. Hiçbiri tahminle yazılmadı. Her biri `CONTENT_APPROVAL_REQUIRED`: siz doğrulayana kadar sitede yok.

| # | Gereken bilgi | Neden | Nereye girer |
|---|---|---|---|
| 1 | Her projenin **semti ya da ilçesi** (ör. "İncek", "Gölbaşı", "Çankaya"), yılı ve yaklaşık m²'si. Müşteri izniyle, mahremiyet gerekiyorsa yalnızca ilçe. | "Gölbaşı mimarlık" gibi aramalarda en güçlü sinyal, o bölgede yapılmış gerçek iş. Rakipler bunu boş ilçe sayfalarıyla taklit ediyor, sizde gerçeği var. | `src/lib/projects.ts` (proje sayfası, JSON-LD, ofis sayfasındaki proje listesi) |
| 2 | İncek veya Gölbaşı'ndaki hangi projelerin fotoğrafının yayınlanabileceği | Ofis sayfasında "İncek ve Gölbaşı'ndaki işlerimiz" bölümü ancak bununla dürüstçe kurulabilir | `serviceLandings.ts` → `incek-golbasi-mimarlik-ofisi.projects` |
| 3 | Rıdvan Uyar'ın **gerçekte verdiği mühendislik hizmetleri**: statik proje mi, şantiye şefliği mi, yapı denetim koordinasyonu mu, keşif ve metraj mı? | "Ankara mimarlık ve mühendislik", "mimarlık mühendislik" aramalarında mühendislik tarafını anlatan bir sayfa yok. Kapsam doğrulanmadan yazılamaz (ruhsat ve yetki iddiası yasak). | Ya `/services` altında yeni bir bölüm ya da ayrı bir "Mühendislik" hizmet sayfası |
| 4 | Çalışma saatleri | Hem İşletme Profili hem JSON-LD (`openingHoursSpecification`). Sitede yok, çünkü doğrulanmış saat yok. | İşletme Profili ve `src/lib/seo.ts` |
| 5 | Mimarlar Odası ve İç Mimarlar Odası sicil bilgileri ile mesleki üyelikler (varsa, yayınlanmasına izin verilenler) | Güven ve bilinirlik. Kanıtsız eklenmez. | Hakkımızda |
| 6 | icmimarbul kaydının size ait olup olmadığı | Sizinse `sameAs`'a eklenebilir | `src/lib/seo.ts` |

## Bilinçli olarak yapılmayanlar

- `/incek-mimarlik`, `/golbasi-mimarlik`, `/ankara-mimarlik` gibi ilçe adı değiştirilmiş kopya sayfalar. Ofis gerçekten İncek'te (Gölbaşı ilçesi) ve bunu anlatan tek bir sayfa zaten var. Google'ın spam politikası bu tür kopyaları "doorway" sayar.
- Genel "mimarlık nedir", "iç mimar ne yapar" makaleleri. Bu sorgularda Wikipedia, üniversiteler ve kariyer siteleri var. Ziyaretçi müşteri değil, öğrenci. Mevcut 500+ terimli Sözlük bu ihtiyacı zaten karşılıyor.
- Sayfalara yazım hatalı varyant ("içmimar", "miamrlık") koymak. Google bunları doğru yazıma eşliyor; ölçüm bunu gösterdi.
