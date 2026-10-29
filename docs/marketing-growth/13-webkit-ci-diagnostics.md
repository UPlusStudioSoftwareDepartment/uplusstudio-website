# macOS / iPhone CI hata kaydı

Kullanıcının paylaştığı kayıt `a2ea312` commit'ine ait: 18 iPhone `renders cleanly` testi, yerleşik video denetimlerinden gelen `invalid-placard`, `pip-placard`, `airplay-placard` mesajları nedeniyle başarısız. Vercel deploy durumu ile GitHub Actions macOS job durumu ayrı sistemlerdir; başarılı deploy bütün testlerin geçtiği anlamına gelmez.

Mesaj şablonu [WebKit'in kendi button.js dosyasında](https://github.com/WebKit/WebKit/blob/main/Source/WebCore/Modules/modern-media-controls/controls/button.js) bulunuyor. İkon adları ve PNG türleri [icon-service.js](https://github.com/WebKit/WebKit/blob/main/Source/WebCore/Modules/modern-media-controls/controls/icon-service.js) içinde tanımlı. Erişim: 29 Ekim 2026. Bu kaynaklar mesajın tarayıcı içindeki kaynağını doğruluyor; tek başına bütün videoların çalıştığını kanıtlamıyor.

Uygulanan düzeltme: yalnızca WebKit, üç tam ikon adı, `MacOSLayoutTraits Inline`, mevcut sayfayla aynı origin ve UUID biçimli blob URL'sinin bütün koşulları sağlandığında mesaj ayrı tanılama listesine alınıyor. Bunlar CI test ekinde JSON olarak korunuyor. `pageerror` olayları filtrelenmiyor. Diğer console error, 404, ağ, codec, tanınmayan ikon veya farklı origin hataları başarısızlık oluşturmaya devam ediyor. Ayrıca render denetimi her video için gerçek `HTMLMediaElement.error` durumunu kontrol ediyor.

`e2e/browserConsole.ts` ayrımı yapıyor. `src/lib/browserConsole.test.ts` üç bilinen örnek ve uygulama/ağ/kaynak/engine negatif örnekleriyle sınırı doğruluyor. Toplam birim testi 133 oldu. Bu bir test gözlem düzeltmesidir; production console'a müdahale edilmedi ve native video kontrolleri kaldırılmadı.

Windows üzerindeki Playwright WebKit testi macOS runner ile aynı ortam değildir. Yerel WebKit sonucu ile gerçek macOS GitHub job sonucu raporda ayrı tutulur. İlgisiz hataları veya flakiness'i gizlemek için tüm hata denetimi kapatılmadı, iPhone projesi CI'dan çıkarılmadı.
