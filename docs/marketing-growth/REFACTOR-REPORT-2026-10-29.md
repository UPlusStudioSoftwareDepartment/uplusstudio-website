# Refactor Raporu — bu çalışmanın ekleri

## Özet

Pazarlama ve medya kapsamı için mevcut Next.js mimarisi korundu. Önceki geniş çalışma ağacı korunarak yeni sunucu bileşeni medyası ve test/rapor altyapısı tamamlandı. Bütün React dosyaları topluca yeniden yazılmadı.

## Sadeleştirilen Dosyalar

| Dosya | Yapılan işlem | Neden |
|---|---|---|
| scripts/lighthouse-audit.mjs | Medyan/CSV/eşik mantığı lighthouse-results.mjs saf yardımcılarına alındı | Rapor mantığını tarayıcıdan bağımsız test etmek |
| HomeProjectPaths.tsx | Mevcut getProject modeliyle görsel/alt/caption/link tek kaynaktan | Ayrı görsel veri kopyası ve ilave state oluşmasın |
| HomeDecisionSupport.tsx | Mevcut adım listesine statik SVG desteği | Yeni hook/provider/animasyon bağımlılığı gerekmedi |

## Bölünen Dosyalar

| Eski dosya | Yeni yapı | Neden |
|---|---|---|
| Lighthouse scripti | Tarayıcı orkestrasyonu + lighthouse-results.mjs | Saf hesaplama ve external sistem etkileşimini ayırma |

## Kaldırılan Karmaşıklıklar

- Tek ölçümün kararlı sonuç sayılması yerine açık runsPerUrl ve medyan.
- Çalıştırılmamış/eksik koşuların görünmez kalması yerine UNVERIFIED/BLOCKED.
- İçerik ve medya raporlarının elle kopyalanması yerine kaynak modelden envanter üretimi.
- Geliştirme ve production QA derlemesinin aynı distDir'i paylaşması yerine isteğe bağlı .next-qa.

## Oluşturulan Yeni Dosyalar

Dört süreç SVG'si; marketing-inventory.mjs, lighthouse-results.mjs ve test dosyası; redirect-check.mjs; visual-marketing.spec.ts; ek içerik/medya belgeleri ve docs/performance.md.

## TypeScript İyileştirmeleri

Yeni React mantığında any, as any, assertion veya gereksiz generic yok. Bileşenler mevcut Readonly props ve Locale modellerini kullanıyor. Medya alt/caption değerleri mevcut Project modelinden. Yeni state/useEffect eklenmedi; kaldırılmış derived state iddiası yok. Shared-form, Ant Design veya Module Federation bu projede yok; yeni form soyutlaması oluşturulmadı.

## Test / Build Sonuçları

npm run lint, npm run typecheck, npm run build (NEXT_DIST_DIR=.next-qa), npm run test ve npm run test:audits geçti. Ayrıntılı E2E, SEO ve Lighthouse sonuçları MASTER-EXECUTION-REPORT.md içinde; eski oturum kanıtları yeni çalıştırılmış sayılmadı.

## Riskli Alanlar

Telif/fotoğraf-render teyidi, gerçek müşteri verisi, video mobil LCP ve final raporda belirtilen dış sistem sınırları. Aktif çalışma ağacında bu görev öncesinden ve başka çalışmalardan değişiklikler vardı; topluca reset/commit/push yapılmadı.

## Davranış Değişikliği

Ana sayfada dört yeni görsel proje bağlantısı ve dört süreç diyagramı var. Telefon, hizmet/proje URL'leri ve mevcut iletişim akışları korunuyor. Perde süre deneyi ölçülmüş fayda göstermediği için geri alındı; mevcut süreler korunuyor. Varsayılan Lighthouse komutu artık üç tekrar alır; --runs 1 önceki tek ölçüm kapsamını sağlar. Production dağıtımı yapılmadı.
