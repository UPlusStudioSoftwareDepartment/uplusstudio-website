import type { Locale } from "@/lib/i18n-config";
import type { AppointmentServiceKey } from "@/lib/services";

type Copy = {
  title: string;
  description: string;
  crumb: string;
  label: string;
  heading: string[];
  intro: string;
  forWhoTitle: string;
  forWho: string[];
  scopeTitle: string;
  scope: string[];
  whyTitle: string;
  why: string;
  pricing?: string;
};

export type ServiceLanding = {
  slug: string;
  booking: AppointmentServiceKey;
  image: string;
  projects: string[];
  copy: Record<Locale, Copy>;
};

export const SERVICE_LANDINGS: ServiceLanding[] = [
  {
    slug: "villa-mimari-proje-ankara",
    booking: "villa",
    image: "/media/projects/modern-villa/exterior-dusk.jpg",
    projects: ["modern-villa", "tek-katli-ev", "villa-donusumu", "konut-projeleri"],
    copy: {
      tr: {
        title: "Villa ve Müstakil Ev Mimari Projesi, Ankara",
        description: "İncek, Gölbaşı ve Ankara'da villa ve müstakil ev mimari projesi: konsept, 3D, uygulama projeleri ve şantiye takibi. Mimar ve inşaat mühendisi tek ekipte.",
        crumb: "Villa mimari proje",
        label: "Konut & Villa",
        heading: ["Villa ve müstakil ev", "*mimari projesi.*"],
        intro: "Arsanızdan anahtar teslime kadar villa ve müstakil ev projelerinde Yüksek Mimar ve İnşaat Mühendisi aynı ekipte çalışır. Tasarım ve taşıyıcı sistem kararları baştan birlikte alınır.",
        forWhoTitle: "Kimler için",
        forWho: ["Arsası olan ve kendi evini yaptırmak isteyenler", "Mevcut evini büyütmek ya da yeniden tasarlamak isteyenler", "Proje ve uygulama sürecinde tek muhatap arayanlar"],
        scopeTitle: "Hizmet kapsamı",
        scope: ["Konsept tasarım ve geliştirme", "3D modelleme ve görselleştirme", "Teknik çizimler ve dokümantasyon", "İzin ve onay süreçlerinde destek", "Şantiye takibi"],
        whyTitle: "Neden U+ Studio",
        why: "Kurucularımız Yüksek Mimar Hacer Uyar ve İnşaat Mühendisi Rıdvan Uyar. İncek'teki ofisimiz, Gölbaşı ve çevresindeki projelere yakın; ilk görüşmede arsanızı ve ihtiyacınızı birlikte değerlendiririz.",
      },
      en: {
        title: "Villa & House Architecture in Ankara",
        description: "Villa and house architecture in İncek, Gölbaşı and Ankara: concept, 3D, construction drawings and site follow-up, with architect and engineer on one team.",
        crumb: "Villa architecture",
        label: "Homes & Villas",
        heading: ["Villa and house", "*architecture.*"],
        intro: "From your plot to handover, a master architect and a civil engineer work as one team on villas and detached houses, so design and structural decisions are made together from day one.",
        forWhoTitle: "Who it is for",
        forWho: ["People with a plot who want to build their own home", "Owners who want to extend or redesign their house", "Anyone who wants one point of contact from design to build"],
        scopeTitle: "Scope",
        scope: ["Concept design and development", "3D modelling and visualisation", "Technical drawings and documentation", "Permit and approval support", "Site follow-up"],
        whyTitle: "Why U+ Studio",
        why: "The studio is led by master architect Hacer Uyar and civil engineer Rıdvan Uyar. Our İncek office is close to Gölbaşı projects; at the first meeting we review your plot and brief together.",
      },
    },
  },
  {
    slug: "ic-mimarlik-ankara",
    booking: "interior",
    image: "/media/projects/villa-ic-mekan/living.jpg",
    projects: ["konut-ic-mekan", "villa-ic-mekan", "yonetici-ofisi", "butik-kafe"],
    copy: {
      tr: {
        title: "İç Mimarlık, Ankara",
        description: "Ankara İncek ve Gölbaşı'nda daire, villa ve ofis iç mimarlığı: mekân kurgusu, malzeme, aydınlatma, mekâna özel mobilya ve 3D görselleştirme.",
        crumb: "İç mimarlık",
        label: "İç Mimarlık",
        heading: ["Daire ve villada", "*iç mimarlık.*"],
        intro: "Yeni aldığınız daireyi ya da yıllardır yaşadığınız evi; mekân kurgusu, malzeme, aydınlatma ve mekâna özel mobilyayla birlikte tasarlıyoruz. Kararları uygulamadan önce 3D olarak görürsünüz.",
        forWhoTitle: "Kimler için",
        forWho: ["Yeni daire alıp evini baştan kuracaklar", "Villa ya da müstakil evinin iç mekânını yenileyecekler", "Ofis ve muayenehane gibi çalışma alanlarını düzenleyecekler"],
        scopeTitle: "Hizmet kapsamı",
        scope: ["Mekân kurgusu ve yerleşim planı", "Malzeme ve renk seçimi", "Aydınlatma tasarımı", "Mekâna özel mobilya ve detay çözümleri", "3D görselleştirme", "Uygulama projeleri ve şantiye takibi"],
        whyTitle: "Neden U+ Studio",
        why: "İç mimari kararlar, mimar ve mühendisin aynı masada olduğu bir ekipte tesisat ve taşıyıcı sistemle birlikte düşünülür; böylece uygulamada sürpriz azalır.",
        pricing: "Tasarım paketleri {price} + KDV'den başlar; kapsamı görüşmede birlikte netleştiririz.",
      },
      en: {
        title: "Interior Architecture in Ankara",
        description: "Interior architecture for apartments, villas and offices in İncek, Gölbaşı and Ankara: layout, materials, lighting, bespoke furniture and 3D.",
        crumb: "Interior architecture",
        label: "Interior Architecture",
        heading: ["Interiors for", "*homes and villas.*"],
        intro: "Whether it is a new apartment or a house you have lived in for years, we design the layout, materials, lighting and bespoke furniture together, and you see the decisions in 3D before anything is built.",
        forWhoTitle: "Who it is for",
        forWho: ["New apartment owners setting up their home", "Owners renewing the interior of a villa or house", "Offices and practices reorganising their workspace"],
        scopeTitle: "Scope",
        scope: ["Space planning and layout", "Materials and colour", "Lighting design", "Bespoke furniture and detailing", "3D visualisation", "Construction drawings and site follow-up"],
        whyTitle: "Why U+ Studio",
        why: "Interior decisions are made alongside services and structure, because the architect and the engineer sit at the same table. That means fewer surprises on site.",
        pricing: "Design packages start at {price} + VAT; we agree the exact scope at the first meeting.",
      },
    },
  },
  {
    slug: "tadilat-donusum-ankara",
    booking: "renovation",
    image: "/media/projects/villa-donusumu/after.jpg",
    projects: ["villa-donusumu", "ofis-yenileme", "konut-uygulama"],
    copy: {
      tr: {
        title: "Tadilat ve Dönüşüm, Ankara",
        description: "Ankara İncek ve Gölbaşı'nda ev, villa ve ofis tadilatı: cephe ve iç mekân yenileme, villa dönüşümü, villadan ofise dönüşüm. Önce/sonra projelerimizi inceleyin.",
        crumb: "Tadilat ve dönüşüm",
        label: "Yenileme & Dönüşüm",
        heading: ["Tadilat ve", "*dönüşüm.*"],
        intro: "Eski bir villayı yeniden yaşanır hale getirmek, bir evi ofise dönüştürmek ya da cepheyi yenilemek: işe mevcut durumu birlikte inceleyerek başlar, tasarımı ve uygulamayı aynı ekipte yönetiriz.",
        forWhoTitle: "Kimler için",
        forWho: ["Evini ya da villasını yenilemek isteyenler", "Bir binayı farklı bir işleve, örneğin ofise dönüştürecekler", "Cephe veya iç mekân yenilemesi planlayanlar"],
        scopeTitle: "Hizmet kapsamı",
        scope: ["Mevcut durumun yerinde incelenmesi", "Dönüşüm konsepti ve 3D görselleştirme", "Uygulama projeleri", "Cephe ve iç mekân yenileme", "Şantiye ve bütçe takibi"],
        whyTitle: "Gerçek önce / sonra",
        why: "İncek'teki villadan ofise dönüşüm ve villa dönüşümü projelerimizin önce ve sonra hallerini proje sayfalarında görebilirsiniz.",
      },
      en: {
        title: "Renovation & Conversion in Ankara",
        description: "Home, villa and office renovation in İncek, Gölbaşı and Ankara: façade and interior renewal and villa-to-office conversion, with real before/after work.",
        crumb: "Renovation",
        label: "Renovation & Conversion",
        heading: ["Renovation and", "*conversion.*"],
        intro: "Bringing an old villa back to life, turning a house into an office or renewing a façade: we start by reviewing the existing building together, then run design and construction as one team.",
        forWhoTitle: "Who it is for",
        forWho: ["Owners renewing a house or villa", "Anyone converting a building to a new use, such as an office", "Owners planning a façade or interior renewal"],
        scopeTitle: "Scope",
        scope: ["On-site review of the existing building", "Conversion concept and 3D visualisation", "Construction drawings", "Façade and interior renewal", "Site and budget follow-up"],
        whyTitle: "Real before / after",
        why: "See the before and after of our villa-to-office conversion in İncek and our villa transformation on their project pages.",
      },
    },
  },
  {
    slug: "ticari-mekan-tasarimi-ankara",
    booking: "commercial",
    image: "/media/projects/butik-kafe/interior-hd.jpg",
    projects: ["butik-kafe", "evox-gym-center", "pastane", "ofis-yenileme"],
    copy: {
      tr: {
        title: "Kafe, Ofis ve Mağaza Tasarımı, Ankara",
        description: "Ankara'da kafe, restoran, spor salonu, ofis ve mağaza iç mimarisi: konsept, mekân düzeni, mutfak ve oturma planı, aydınlatma ve teknik çizimler.",
        crumb: "Ticari mekân tasarımı",
        label: "Ticari Mekânlar",
        heading: ["Kafe, ofis ve", "*mağaza tasarımı.*"],
        intro: "Açılış tarihi belli bir işletme için tasarım; markayı, müşteri akışını ve işletme ihtiyaçlarını birlikte çözmelidir. Konseptten teknik çizimlere kadar ticari mekânınızı tek ekipte hazırlıyoruz.",
        forWhoTitle: "Kimler için",
        forWho: ["Kafe, restoran veya pastane açacak işletmeler", "Spor salonu ve stüdyo kuracaklar", "Ofisini ya da mağazasını yenileyecek şirketler"],
        scopeTitle: "Hizmet kapsamı",
        scope: ["Konsept tasarım", "Mekân düzeni ve müşteri akışı", "Mutfak ve oturma alanları", "Aydınlatma tasarımı", "Teknik çizimler", "Uygulama ve proje yönetimi"],
        whyTitle: "Sektör paketleri",
        why: "Kedili butik kafe, Evox Gym Center ve pastane gibi ticari projelerimizi portföyde inceleyebilirsiniz.",
        pricing: "Kafe paketi {cafe}, spor salonu paketi {gym} + KDV; işletmenize özel kapsamı görüşmede netleştiririz.",
      },
      en: {
        title: "Café, Office & Retail Design in Ankara",
        description: "Interior design for cafés, restaurants, gyms, offices and shops in Ankara: concept, layout, kitchen and seating plans, lighting and technical drawings.",
        crumb: "Commercial design",
        label: "Commercial Spaces",
        heading: ["Café, office and", "*retail design.*"],
        intro: "When an opening date is set, design has to solve the brand, the customer flow and the operation at once. We take your commercial space from concept to technical drawings as one team.",
        forWhoTitle: "Who it is for",
        forWho: ["Businesses opening a café, restaurant or bakery", "Founders setting up a gym or studio", "Companies renewing an office or shop"],
        scopeTitle: "Scope",
        scope: ["Concept design", "Layout and customer flow", "Kitchen and seating areas", "Lighting design", "Technical drawings", "Construction and project management"],
        whyTitle: "Sector packages",
        why: "See commercial projects such as the cat café, Evox Gym Center and the bakery in our portfolio.",
        pricing: "Café package {cafe}, gym package {gym} + VAT; we tailor the scope to your business at the first meeting.",
      },
    },
  },
];

export const getServiceLanding = (slug: string) => SERVICE_LANDINGS.find((s) => s.slug === slug);

export const LANDING_BY_BOOKING: Partial<Record<AppointmentServiceKey, string>> = Object.fromEntries(
  SERVICE_LANDINGS.map((s) => [s.booking, s.slug])
);
