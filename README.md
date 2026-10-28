# U+ Studio web sitesi

Next.js 16 (App Router, Turbopack) ve next-intl ile yazılmış, Türkçe/İngilizce stüdyo sitesi. Canlı adres: https://www.uplusstudio.com.tr

## Geliştirme

```bash
npm ci
npm run dev
```

Site http://localhost:3000 adresinde açılır; varsayılan dil Türkçedir (`/tr`).

## Ortam değişkenleri

Gizli değerler yalnızca `.env.local` dosyasında (git'e girmez) ve Vercel → Project → Settings → Environment Variables altında tutulur.

| Değişken | Gerekli mi | Ne işe yarar |
| --- | --- | --- |
| `APPOINTMENT_SECRET` | Önerilir | Randevu kartı ve Onayla/Reddet bağlantılarını imzalar. Yoksa Vercel proje kimliğinden türetilen anahtar kullanılır; anahtar değişirse eski bağlantılar geçersiz olur. |
| `GMAIL_USER`, `GMAIL_PASS` | Önerilir | Gmail adresi ve 16 haneli uygulama şifresi. Tanımlıysa randevu talebi (tasarımlı kart, yalnızca stüdyoya giden imzalı Onayla/Reddet ile), stüdyonun onay/ret yanıtı ve iletişim mesajı site tarafından doğrudan gönderilir. Tanımlı değilse ziyaretçinin Gmail'i ya da e-posta uygulaması, mesaj yazılı halde açılır. |
| `APPOINTMENT_TO` | İsteğe bağlı | Randevu ve iletişim e-postalarının gideceği adres (varsayılan `mimarhaceruyar@gmail.com`, `src/lib/studio-info.ts` → `formInbox`). |
| `NEXT_PUBLIC_SITE_URL` | İsteğe bağlı | Kanonik adres (varsayılan `https://www.uplusstudio.com.tr`). |
| `NEXT_PUBLIC_IS_IN_MAINTENANCE` | İsteğe bağlı | `true` olduğunda tüm site bakım sayfasını gösterir. |

## Testler

```bash
npm run lint
npm run test
npm run build
npm run test:e2e
```

- `npm run test`: Vitest birim testleri (`src/lib/**/*.test.ts`).
- `npm run test:e2e`: Playwright ile masaüstü ve telefon (Pixel 7) tarayıcı testleri. Çalışan bir sunucu yoksa `npm run start` ile kendi sunucusunu açar; önce `npm run build` gerekir. Başka bir adresi test etmek için `BASE_URL=https://... npm run test:e2e`.
- Randevu testleri e-posta göndermez: Gmail penceresi ve pano tarayıcı içinde yakalanır. `BASE_URL` canlı siteyi gösterdiğinde e-posta gönderen iki API de test içinde yanıtlanır; testler stüdyoya posta atamaz.

## Yayına alma

- `main` dalına yapılan her push, Vercel'de otomatik olarak canlıya çıkar. Push'tan önce yukarıdaki dört komutun yerelde geçtiğinden emin olun.
- GitHub Actions (`.github/workflows/ci.yml`) her push ve pull request'te lint, birim testleri, build ve tarayıcı testlerini çalıştırır.
- `.github/workflows/smoke.yml` canlı sitedeki sayfaları, iç bağlantıları, sitemap'in yalnızca dizine eklenebilir ve canonical adresler içerdiğini, video sayfalarını ve 404 yanıtını salt okunur olarak kontrol eder. `main`'e her push'ta, sitenin `X-Release` başlığı o commit'i gösterene kadar (en çok 20 dakika) bekleyip çalışır; ayrıca her gün 08:00'de (TSİ) ve Actions sekmesinden elle çalıştırılabilir.
- Önemli içerik değişikliklerinden sonra `npm run indexnow` canlı sitemap'teki tüm adresleri IndexNow ile Bing ve Yandex'e bildirir (anahtar dosyası `public/` altında).

## Medya lisansları

- Ana sayfa filminin müziği (`public/media/audio/villa-transformation.aac`): "Inspiring Piano", leberch — [Pixabay](https://pixabay.com/music/modern-classical-inspiring-piano-254764/), Pixabay Content License (ticari kullanım serbest, atıf gerekmez). Parça YouTube Content ID'ye kayıtlı; filmi YouTube'a bu müzikle yüklerseniz gelen talebe Pixabay lisansıyla itiraz edilebilir. Film süresine (9,9 sn) kesildi, başına kısa giriş, sonuna 1,8 sn sönme eklendi.

## Geri alma

1. Vercel → Project → Deployments sayfasında son sağlıklı yayını bulun ve **Instant Rollback** (ya da "Promote to Production") seçin. Alan adı birkaç saniye içinde o sürüme döner.
2. Kodu da eşitlemek için hatalı commit'i geri alın ve push edin:

   ```bash
   git revert <commit>
   git push origin main
   ```

3. Smoke testinin yeşil olduğunu GitHub Actions'ta kontrol edin.
