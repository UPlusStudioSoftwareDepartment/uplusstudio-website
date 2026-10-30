import type { Locale } from "./i18n-config";

// Who the studio works for. Every linked service is a published service page; gains are written
// as what the work aims to provide, never as measured outcomes.

export type Audience = Readonly<{
  key: string;
  services: readonly string[];
  copy: Record<Locale, Readonly<{ title: string; situation: string; gains: readonly string[] }>>;
}>;

export const audienceLabels = {
  tr: { eyebrow: "Kimin için çalışıyoruz", title: "Hangi taraftasınız?", intro: "Bir evin sahibi, bir arsanın sahibi, bir binanın yapımcısı ya da bir mülkün pazarlayıcısı olmanız, mimardan beklediğiniz şeyi değiştirir. Kendinizi bulun; size uygun hizmetlere oradan geçin.", gains: "Size ne kazandırır", services: "İlgili hizmetler" },
  en: { eyebrow: "Who we work for", title: "Which side are you on?", intro: "Whether you own a home, a plot, are building for sale or marketing a property changes what you need from an architect. Find yourself here and go straight to the services that fit.", gains: "What you gain", services: "Related services" },
} satisfies Record<Locale, Record<string, string>>;

export const AUDIENCES: readonly Audience[] = [
  {
    key: "homeowners",
    services: ["ic-mimarlik-ankara", "tadilat-donusum-ankara", "mutfak-tasarimi-ankara", "ozel-mobilya-tasarimi-ankara"],
    copy: {
      tr: {
        title: "Ev sahipleri",
        situation: "Yeni bir daire aldınız ya da yıllardır yaşadığınız evi yenilemek istiyorsunuz; nereden başlayacağınızı, neyin mümkün olduğunu ve bütçenin nereye gideceğini bilmek istiyorsunuz.",
        gains: ["Kararları uygulamadan önce 3D görerek vermek", "Depolama ve yerleşim sorunlarına ölçüye göre çözüm", "Tesisat ve taşıyıcı sistemle uyumlu, sürprizi az bir uygulama"],
      },
      en: {
        title: "Homeowners",
        situation: "You have bought a new flat or want to renew the home you have lived in for years, and want to know where to start, what is possible and where the budget goes.",
        gains: ["Decisions made by seeing them in 3D first", "Made-to-measure answers to storage and layout problems", "Construction in step with services and structure, with fewer surprises"],
      },
    },
  },
  {
    key: "landowners",
    services: ["villa-mimari-proje-ankara", "apartman-konut-projesi-ankara", "ruhsat-proje-onay-destegi-ankara", "peyzaj-bahce-tasarimi-ankara"],
    copy: {
      tr: {
        title: "Arsa sahipleri",
        situation: "Bir arsanız var; üzerine kendi evinizi mi yoksa birden fazla daireli bir bina mı yapılabileceğini, kaç metrekare inşaat hakkı olduğunu ve sürecin nasıl ilerleyeceğini öğrenmek istiyorsunuz.",
        gains: ["İmar durumundan gerçekçi bir yapılaşma çerçevesi", "Arsanın yönüne ve manzarasına göre kurgulanan plan", "Ruhsat için gereken projelerin tek ekipten koordinasyonu"],
      },
      en: {
        title: "Landowners",
        situation: "You own a plot and want to know whether it suits your own house or a building with several flats, how much floor area it allows and how the process unfolds.",
        gains: ["A realistic building frame based on the zoning status", "A plan shaped by the plot's orientation and view", "Permit designs coordinated by one team"],
      },
    },
  },
  {
    key: "developers",
    services: ["muteahhit-gelistirici-mimari-cozumler", "apartman-konut-projesi-ankara", "ruhsat-proje-onay-destegi-ankara", "3d-gorsellestirme-render-ankara", "anahtar-teslim-uygulama-ankara", "muhendislik-danismanligi-ankara"],
    copy: {
      tr: {
        title: "Müteahhitler ve geliştiriciler",
        situation: "Kat karşılığı ya da kendi yatırımınızla konut projesi geliştiriyorsunuz; imar haklarını verimli kullanan, satılabilir daire planları, uyumlu ruhsat projeleri ve tanıtım görselleri istiyorsunuz.",
        gains: ["İmar haklarını mevzuat sınırları içinde verimli kullanan yerleşim", "Daire tiplerinin hedef alıcıya göre planlanması", "Mimari ve statik çözümün baştan uyumlu hazırlanması", "Satış ve tanıtım için 3D görsel seti"],
      },
      en: {
        title: "Contractors and developers",
        situation: "You develop housing, through land-for-flats agreements or your own investment, and need layouts that use zoning rights well, saleable flat plans, consistent permit drawings and marketing images.",
        gains: ["Layouts that use zoning rights efficiently within the regulations", "Flat types planned for the target buyer", "Architectural and structural solutions prepared in step from the start", "A 3D image set for sales and promotion"],
      },
    },
  },
  {
    key: "agents",
    services: ["emlak-danismanlari-icin-tasarim", "3d-gorsellestirme-render-ankara", "tadilat-donusum-ankara", "muhendislik-danismanligi-ankara", "cephe-tasarimi-yenileme-ankara"],
    copy: {
      tr: {
        title: "Emlak danışmanları ve yatırımcılar",
        situation: "Satılacak veya kiralanacak bir mülkün ya da almayı düşündüğünüz bir binanın potansiyelini görmek, teknik durumunu öğrenmek ve yenileme kapsamını tarif etmek istiyorsunuz.",
        gains: ["Mülkün yenilenmiş halini 3D görselle somut göstermek", "Satın alma öncesi teknik değerlendirme", "Yenileme kapsamının ve önceliklerinin netleşmesi"],
      },
      en: {
        title: "Estate agents and investors",
        situation: "You want to see the potential of a property for sale or rent, or a building you are considering buying, understand its technical condition and define the scope of renovation.",
        gains: ["Showing the renewed property concretely in 3D", "A technical assessment before purchase", "A clear renovation scope and priorities"],
      },
    },
  },
  {
    key: "businesses",
    services: ["kafe-restoran-tasarimi-ankara", "ofis-ic-mimarlik-ankara", "ticari-mekan-tasarimi-ankara", "ozel-mobilya-tasarimi-ankara"],
    copy: {
      tr: {
        title: "İşletmeler",
        situation: "Bir kafe, ofis, mağaza veya spor salonu açıyor ya da yeniliyorsunuz; mekânın hem markanızı anlatmasını hem de günlük işleyişinizi kolaylaştırmasını istiyorsunuz.",
        gains: ["Müşteri ve ekip akışına göre kurgulanan yerleşim", "Markanın mekânda tutarlı bir dille görünmesi", "Açılış takvimine göre planlanan tasarım ve uygulama adımları"],
      },
      en: {
        title: "Businesses",
        situation: "You are opening or renewing a café, office, shop or gym and want the space to express your brand while making daily operations easier.",
        gains: ["A layout shaped by customer and staff flow", "The brand expressed consistently in the space", "Design and construction steps planned around your opening date"],
      },
    },
  },
];
