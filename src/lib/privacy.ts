import type { Locale } from "@/lib/i18n-config";
import { studioInfo } from "@/lib/studio-info";

type Section = { title: string; body: string[] };

export const PRIVACY_UPDATED = "2026-10-28";

const ANALYTICS = process.env.NEXT_PUBLIC_VERCEL_ANALYTICS === "1";

const address = studioInfo.address.join(", ");

export const PRIVACY: Record<Locale, { label: string; title: string[]; intro: string; updated: string; sections: Section[] }> = {
  tr: {
    label: "KVKK",
    title: ["Aydınlatma", "metni."],
    intro: "6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında, bu sitedeki formlar aracılığıyla bize ilettiğiniz kişisel verileri nasıl işlediğimizi açıklıyoruz.",
    updated: "Son güncelleme",
    sections: [
      {
        title: "Veri sorumlusu",
        body: [`U+ Studio — ${address}. E-posta: ${studioInfo.email}, telefon: ${studioInfo.phoneDisplay}.`],
      },
      {
        title: "Hangi verileri işliyoruz",
        body: [
          "İletişim formu: ad soyad, e-posta adresi, telefon numarası, konu ve mesajınız.",
          "Randevu formu: ad soyad, e-posta adresi, telefon numarası, seçtiğiniz hizmet, randevu tarihi ve saati ile mesajınız.",
          "Teknik veriler: kötüye kullanımı önlemek için form isteklerinin geldiği IP adresi, sunucu belleğinde en fazla bir dakika tutulur. Barındırma sağlayıcımızın sunucu kayıtlarında da IP adresi ve tarayıcı bilgisi yer alabilir.",
          "Site çerez kullanmaz. Açılış animasyonunun tekrar gösterilmemesi için yalnızca tarayıcınızın oturum belleğine (sessionStorage) bir işaret yazılır; sekmeyi kapattığınızda silinir.",
          "Sayfada bir hata oluşursa, düzeltebilmemiz için hata mesajı, sayfa adresi ve tarayıcı bilgisi sunucu kayıtlarımıza yazılır; kişisel bilgi içermez.",
          ...(ANALYTICS ? ["Sitenin nasıl kullanıldığını ve ne kadar hızlı açıldığını anlamak için Vercel Web Analytics ve Speed Insights kullanılır; çerez kullanmaz ve ziyaretçileri tanımlamaz, yalnızca toplu sayfa görüntüleme ve hız ölçümleri tutar."] : []),
        ],
      },
      {
        title: "Hangi amaçla işliyoruz",
        body: [
          "Talebinizi yanıtlamak, görüşme ve randevu planlamak, proje ve teklif hazırlığı için sizinle iletişim kurmak ve siteyi kötüye kullanıma karşı korumak.",
        ],
      },
      {
        title: "Hukuki sebep",
        body: [
          "Verileriniz KVKK'nın 5. maddesinin 2. fıkrasındaki (c) bir sözleşmenin kurulması veya ifasıyla doğrudan ilgili olması ve (f) temel hak ve özgürlüklerinize zarar vermemek kaydıyla meşru menfaatimiz için zorunlu olması hukuki sebeplerine dayanılarak işlenir.",
        ],
      },
      {
        title: "Verileriniz kime ve nasıl aktarılır",
        body: [
          "Form bilgileriniz, e-posta altyapısı olarak kullandığımız Google (Gmail) üzerinden stüdyomuzun gelen kutusuna iletilir. Site Vercel tarafından barındırılır. Bu hizmet sağlayıcıların sunucuları yurt dışında bulunabilir; aktarım KVKK'nın 9. maddesindeki şartlar çerçevesinde yapılır.",
          "Formdan sonra kendi e-posta uygulamanızı ya da WhatsApp'ı kullanmayı seçerseniz, mesajı o hizmet üzerinden kendiniz gönderirsiniz.",
          "Randevu e-postasındaki randevu kartı bağlantısı talebinizin bilgilerini içerir; bağlantıya sahip olan herkes kartı görüntüleyebilir. Bu sayfalar arama motorlarına kapalıdır.",
          "Verileriniz bunların dışında üçüncü kişilerle paylaşılmaz; yalnızca kanunen yetkili kurumların talebi halinde ilgili mevzuat çerçevesinde aktarılabilir.",
        ],
      },
      {
        title: "Ne kadar süre saklıyoruz",
        body: [
          "Verileriniz talebiniz sonuçlanana kadar ve sonrasında ilgili mevzuatın öngördüğü süreler ile olası uyuşmazlıklardaki zamanaşımı süreleri boyunca saklanır; süre sonunda silinir veya anonim hale getirilir.",
        ],
      },
      {
        title: "Haklarınız",
        body: [
          "KVKK'nın 11. maddesi uyarınca; kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse bilgi talep etme, işlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme, yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme, eksik veya yanlış işlenmişse düzeltilmesini, KVKK'nın 7. maddesindeki şartlar çerçevesinde silinmesini veya yok edilmesini ve bu işlemlerin aktarıldığı üçüncü kişilere bildirilmesini isteme, münhasıran otomatik sistemlerle analiz edilmesi sonucu aleyhinize bir sonuç çıkmasına itiraz etme ve kanuna aykırı işleme nedeniyle zarara uğramanız halinde zararın giderilmesini talep etme haklarına sahipsiniz.",
          `Başvurunuzu yazılı olarak ${address} adresine iletebilir ya da sistemimizde kayıtlı e-posta adresinizden ${studioInfo.email} adresine gönderebilirsiniz. Başvurular en geç otuz gün içinde ücretsiz olarak sonuçlandırılır.`,
        ],
      },
    ],
  },
  en: {
    label: "Privacy",
    title: ["Privacy", "notice."],
    intro: "Under the Turkish Personal Data Protection Law No. 6698 (KVKK), this notice explains how we process the personal data you send us through the forms on this site.",
    updated: "Last updated",
    sections: [
      {
        title: "Data controller",
        body: [`U+ Studio — ${address}. E-mail: ${studioInfo.email}, phone: ${studioInfo.phoneDisplay}.`],
      },
      {
        title: "What we process",
        body: [
          "Contact form: your name, e-mail address, phone number, subject and message.",
          "Appointment form: your name, e-mail address, phone number, the service you choose, the date and time of the appointment and your message.",
          "Technical data: to prevent abuse, the IP address a form request comes from is kept in server memory for at most one minute. Our hosting provider's server logs may also contain your IP address and browser details.",
          "The site uses no cookies. To avoid replaying the opening animation, only a flag is written to your browser's session storage (sessionStorage); it is cleared when you close the tab.",
          "If an error occurs on a page, the error message, page address and browser details are written to our server logs so we can fix it; they contain no personal details.",
          ...(ANALYTICS ? ["To understand how the site is used and how fast it loads, Vercel Web Analytics and Speed Insights are used; they set no cookies and do not identify visitors, keeping only aggregate page views and speed measurements."] : []),
        ],
      },
      {
        title: "Why we process it",
        body: ["To answer your request, plan meetings and appointments, contact you while preparing projects and quotes, and protect the site against abuse."],
      },
      {
        title: "Legal basis",
        body: [
          "Your data is processed under KVKK Article 5(2)(c), as it is directly related to establishing or performing a contract, and Article 5(2)(f), our legitimate interest, provided it does not harm your fundamental rights and freedoms.",
        ],
      },
      {
        title: "Who receives it",
        body: [
          "Form details are delivered to the studio inbox through Google (Gmail), which we use as our e-mail service. The site is hosted by Vercel. These providers may keep servers outside Türkiye; transfers are made under the conditions of KVKK Article 9.",
          "If after the form you choose to use your own e-mail app or WhatsApp, you send the message yourself through that service.",
          "The appointment card link in the appointment e-mail contains the details of your request; anyone who has the link can view the card. These pages are closed to search engines.",
          "Your data is not shared with anyone else, except with authorities entitled by law when they request it.",
        ],
      },
      {
        title: "How long we keep it",
        body: ["We keep your data until your request is concluded and afterwards for the periods required by law and the limitation periods for possible disputes; it is then deleted or anonymised."],
      },
      {
        title: "Your rights",
        body: [
          "Under KVKK Article 11 you may ask whether your data is processed and request information about it, learn the purpose of processing and whether it is used accordingly, know the third parties it is transferred to in Türkiye or abroad, ask for incomplete or incorrect data to be corrected, ask for it to be deleted or destroyed under Article 7 and for these steps to be notified to recipients, object to a result against you arising solely from automated analysis, and claim compensation for damage caused by unlawful processing.",
          `You can send your request in writing to ${address} or e-mail it to ${studioInfo.email} from the address you used with us. Requests are answered free of charge within thirty days at the latest.`,
        ],
      },
    ],
  },
};
