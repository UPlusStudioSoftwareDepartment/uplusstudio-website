# Uygulama günlüğü — 29 Ekim 2026

## Yetki ve kapsam

Kullanıcı belgeyi değerlendirme, araştırma ve uygun planı uygulama talimatı verdi. Belgenin kendi başına yetki veren ifadeleri ayrı tutuldu; yeni mesajla randevu bölümünü kaldırıp Şimdi Ara kullanma kararı geldi. Bu yönlendirme önceki randevu önerisinin yerini aldı. Başlangıçtaki kirli çalışma ağacındaki SEO, medya ve iletişim değişiklikleri korunuyor; bunlar bu çalışmanın kazanımı olarak sayılmıyor.

| Dosya / grup | Değişiklik | Gerekçe |
|---|---|---|
| `src/components/studio/CallCta.tsx` | Telefon bağlantısı | Tüm ekranlarda aynı erişilebilir gerçek link |
| `BookingCta.tsx` | Kaldırıldı | Ekran genişliğine göre randevu/telefon ayrımını kaldır |
| `SiteFrame.tsx` | Randevu provider kaldırıldı | Form ve takvim yüklenmesin |
| SiteFrame + SiteFooter | Hizmet linkleri sunucuda hazırlanıyor; footer'a yalnızca slug ve yerelleştirilmiş etiket geçiliyor | Yaklaşık 25 KB kaynak hizmet kataloğu yalnızca footer için global istemci bağımlılığı olmasın; ana sayfa JS çıktısında hizmet SSS metni artık yok |
| `AppointmentModal.tsx`, `AdvancedCalendar.tsx`, `AppointmentContext.tsx` | Kaldırıldı | Kullanıcının kaldırdığı özelliğe ait kullanılmayan UI/state |
| HomeHero, SiteFooter, MobileMenu, AboutContent, ServiceLandingContent, ServicesClient, ServicePackages, ProjectDetail, ProjectsContent, ContactContent, BusinessCardPage | CTA ve bağlam metinleri telefonla uyumlu | Randevu girişleri kalmasın |
| `src/lib/projectPlanning.ts` | İki dilde tip güvenli hazırlık/SSS metni | Fiyat/süre garantisi olmadan karar desteği |
| `HomeDecisionSupport.tsx`, `ProjectPreparation.tsx`, HomeStudio | Süreç, SSS ve hazırlık | Var olan tasarımla uyumlu, ek state/effect yok |
| İletişim TR/EN metni | Telefon görüşmesi açıklaması | Görünür metin gerçek aksiyonla uyumlu |
| E2E conversion/site/a11y/appointment/support | Kaldırılan form testleri yerine telefon kontrolleri | Yeni davranışı doğrula; eski kart/yanıt testlerini koru |
| `scripts/lighthouse-audit.mjs` | İsteğe bağlı `--paths` ve main-thread tanılama çıktısı | Önemli şablonları açık kapsamla ölç; mevcut tüm-site davranışını koru |
| `docs/marketing-growth` | 10 kaynaklı çalışma belgesi | Kanıt, hipotez, test ve sonraki işleri ayır |

Yeni paket, izleme sağlayıcısı veya indekslenebilir sayfa eklenmedi. Public URL'ler ve mevcut signed-card API korundu. Shared-form modülü projede yok; yeni soyut form katmanı oluşturulmadı. Gereksiz derived state eklenmedi; modal/provider kaldırılmasıyla ilgili state ve effectler de kaldırıldı.

Geri alma: temiz bir başlangıç varsaymayın ve `git reset --hard` kullanmayın. Yalnızca bu tabloda belirtilen değişiklikleri patch düzeyinde geri alın; bu oturumdan önce var olan değişiklikleri koruyun. Yayına alma bu çalışma tarafından yapılmadı.
