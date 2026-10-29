# Çok dillilik: hreflang ve canonical denetimi

**Yayındaki diller:** Türkçe (`/tr`, varsayılan) ve İngilizce (`/en`). Başka dil yok. Dil adres yolunda tutulur, çerez veya tarayıcı diline göre yönlendirme yoktur (`localeDetection: false`). Öneksiz adresler `/tr`'ye 308 ile yönlenir.

## Sonuç: 28 sayfa çifti, 28 PASS (`MULTILINGUAL-SEO-MATRIX.csv`)

Her çift için kontrol edildi:
- İki dil de 200 dönüyor ve canonical kendi adresini gösteriyor. EN, TR'ye bağlanmıyor.
- `hreflang`: `tr`, `en`, `x-default` (→ TR) HTML başlığında ve site haritasında aynı, karşılıklı ve tam adresli.
- `<html lang>` doğru (`tr` / `en`). `og:locale` tr_TR / en_US. JSON-LD `inLanguage` tr-TR / en-US.
- İki dil de site haritasında.
- Canlı EN sayfalarının görünür metni ve alt/aria metinleri çevrilmemiş Türkçe için tarandı: yalnızca özel adlar (İncek, Gölbaşı, Rıdvan), "façade" ve sözlükteki "Ş" harfi çıktı. Çevrilmemiş metin yok.

`hreflang` iki yerde (HTML ve site haritası) aynı fonksiyondan üretiliyor. Google iki yöntemi birlikte kabul ediyor, aynı kaynaktan geldiği için tutarsızlık riski yok. Değiştirilmedi.

## Bulunan ve düzeltilen

| Sorun | Kanıt | Düzeltme | Test |
|---|---|---|---|
| Dil seçici `<button>` ve JavaScript ile çalışıyordu. Diğer dile taranabilir bağlantı yoktu, yeni sekmede açılamıyordu. | `src/components/LanguageSelector.tsx` | Gerçek `<a href="/en/…" hreflang="en">` bağlantıları. Normal tıklamada yine yumuşak geçiş. Ctrl/⌘ ile tıklama yeni sekmede açar. | Yerelde `/tr/services` → EN → `/en/services`, `lang="en"`. 2 e2e testi "link" rolüne göre güncellendi (e2e çalıştırılmadı). |
| İngilizce iletişim metinlerinin iki kaynağı vardı. `messages/en.ts` eski bir kopya taşıyordu (11 anahtar eksik), `contact/locales/en_US.ts` ise kullanılmayan eski form metinleri taşıyordu. Türkçe tek kaynaktan geliyordu. | Yeni test: TR'de olup EN'de olmayan 11 anahtar | `en_US.ts` tek kaynak oldu. Güncel form metinleri oraya taşındı. `messages/en.ts`, Türkçe gibi onu içe aktarıyor. | `src/lib/i18n.test.ts`: TR ve EN anahtar ağaçları birebir aynı. Önce FAIL, sonra PASS. |

## Çeviri tutarlılığı (diller arası çelişki)

Hizmet adları, adres, kurucu unvanları ve hizmet bölgesi TR/EN'de aynı veriden geliyor. EN tarafında TR'de olmayan bir iddia bulunmadı. "Engineering" EN'de de "consultancy, permits and approvals" ile sınırlı. Bkz. `TRANSLATION-APPROVALS.md`.
