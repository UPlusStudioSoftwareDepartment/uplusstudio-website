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
  imageAlt?: string;
  faq?: [string, string][];
};

export type ServiceLanding = {
  slug: string;
  booking: AppointmentServiceKey;
  image: string;
  projects: string[];
  copy: Record<Locale, Copy>;
};

const PERMIT: Record<Locale, [string, string]> = {
  tr: ["Yapı ruhsatı için hangi belgeler gerekir?", "Genellikle tapu, belediyeden alınan imar durumu belgesi, aplikasyon krokisi, zemin etüdü raporu ile mimari, statik, elektrik ve mekanik projeler istenir; yapı denetim sözleşmesi de sürecin parçasıdır. Belgeler belediyeye ve parselin durumuna göre değişebilir; izin ve onay sürecinde destek oluruz."],
  en: ["Which documents does a building permit need?", "Usually the title deed, the zoning status certificate from the municipality, a site plan, a soil survey and the architectural, structural, electrical and mechanical designs; a building inspection contract is also part of the process. Requirements can vary by municipality and plot, and we support you through permits and approvals."],
};

export const SERVICE_LANDINGS: ServiceLanding[] = [
  {
    slug: "incek-golbasi-mimarlik-ofisi",
    booking: "architectural",
    image: "/images/persons/founders/hacer_uyar/hacer-uyar-u-plus-studio-ofis.jpg",
    projects: ["villa-donusumu", "modern-villa", "butik-kafe", "evox-gym-center"],
    copy: {
      tr: {
        title: "İncek Mimarlık Ofisi · Gölbaşı, Ankara",
        description: "U+ Studio, İncek'te Merkez İncek Plaza'daki mimarlık ofisi: villa, konut, iç mimarlık, tadilat ve ticari mekân projeleri; Gölbaşı, Ankara ve Türkiye geneli.",
        crumb: "İncek mimarlık ofisi",
        label: "Mimarlık Ofisi",
        heading: ["İncek, Gölbaşı'nda", "*mimarlık ofisi.*"],
        intro: "U+ Studio, Ankara'nın İncek semtinde, Merkez İncek Plaza'da bulunan bir mimarlık, iç mimarlık ve mühendislik ofisidir. Yüksek Mimar Hacer Uyar ve İnşaat Mühendisi Rıdvan Uyar'ın kurduğu stüdyoda villa, konut, iç mekân, tadilat ve ticari mekân projelerini tasarımdan uygulamaya tek ekip yürütür.",
        forWhoTitle: "Kimler için",
        forWho: ["İncek, Gölbaşı ve çevresinde ev, villa ya da işyeri projesi olanlar", "Arsasına proje çizdirmek ya da mevcut yapısını yenilemek isteyenler", "Mimarlık, iç mimarlık ve mühendisliği tek ofiste toplamak isteyenler"],
        scopeTitle: "Ofisimizde neler yapıyoruz",
        scope: ["Mimari tasarım: konsept, avan ve uygulama projeleri", "Konut ve villa projeleri", "İç mimarlık ve mekâna özel mobilya", "Yenileme, tadilat ve dönüşüm", "Ticari mekânlar: kafe, ofis, spor salonu ve mağaza", "3D görselleştirme", "Mühendislik danışmanlığı, izin ve onay desteği", "Uygulama ve proje yönetimi, anahtar teslim"],
        whyTitle: "Ofisimiz",
        why: "Adresimiz İncek Mah. Reyhan Cd. No:3, Merkez İncek Plaza Kat:1 D:2, 06830 Gölbaşı / Ankara. Telefon ve WhatsApp: +90 545 320 40 07. Ofisimiz İncek'te olduğu için Gölbaşı ve çevresindeki arsa ve şantiyelere yakınız.",
        imageAlt: "U+ Studio'nun İncek'teki mimarlık ofisi; Yüksek Mimar Hacer Uyar çalışma masasında",
        faq: [
          ["İlk görüşmede neler konuşuyoruz?", "Arsanızı ya da mekânınızı, ihtiyaçlarınızı, bütçe aralığınızı ve takviminizi konuşuruz. Tapu, imar durumu, varsa mevcut çizimler ve fotoğraflar değerlendirmeyi hızlandırır. Görüşmenin sonunda kapsamı ve sonraki adımları birlikte belirleriz."],
          ["Sadece İncek ve Gölbaşı'nda mı çalışıyorsunuz?", "Hayır. Ofisimiz İncek'te; başta İncek, Gölbaşı ve Çankaya olmak üzere Ankara'da ve Türkiye genelinde projeler yürütüyoruz."],
          ["Mimari proje ile uygulamayı aynı ekip mi yapıyor?", "Evet. Yüksek Mimar ve İnşaat Mühendisi aynı ekipte olduğu için tasarım, taşıyıcı sistem ve uygulama kararları baştan birlikte alınır. İsterseniz şantiye takibini ve anahtar teslim uygulamayı da üstleniriz."],
          PERMIT.tr,
        ],
      },
      en: {
        title: "Architecture Office in İncek, Gölbaşı, Ankara",
        description: "U+ Studio's architecture office at Merkez İncek Plaza in İncek: villas, homes, interiors, renovation and commercial spaces in Gölbaşı, Ankara and Türkiye.",
        crumb: "İncek architecture office",
        label: "Architecture Office",
        heading: ["An architecture office", "*in İncek, Gölbaşı.*"],
        intro: "U+ Studio is an architecture, interior architecture and engineering office at Merkez İncek Plaza in İncek, Ankara. Founded by master architect Hacer Uyar and civil engineer Rıdvan Uyar, the studio takes villas, homes, interiors, renovations and commercial spaces from design to delivery as one team.",
        forWhoTitle: "Who it is for",
        forWho: ["Anyone with a home, villa or workplace project in İncek, Gölbaşı and nearby", "Owners who want drawings for their plot or to renew an existing building", "Clients who want architecture, interiors and engineering under one roof"],
        scopeTitle: "What we do from the office",
        scope: ["Architectural design: concept, schematic and construction drawings", "Homes and villas", "Interior architecture and bespoke furniture", "Renovation and conversion", "Commercial spaces: cafés, offices, gyms and retail", "3D visualisation", "Engineering consultancy, permits and approvals", "Construction and project management, turnkey"],
        whyTitle: "The office",
        why: "You will find us at İncek Mah. Reyhan Cd. No:3, Merkez İncek Plaza, Floor 1, Unit 2, 06830 Gölbaşı / Ankara. Phone and WhatsApp: +90 545 320 40 07. Being based in İncek keeps us close to plots and sites in Gölbaşı and nearby.",
        imageAlt: "U+ Studio's architecture office in İncek, with master architect Hacer Uyar at her desk",
        faq: [
          ["What do we talk about at the first meeting?", "Your plot or space, your needs, budget range and timeline. Title deed, zoning status and any existing drawings or photos speed up the assessment. We finish by agreeing the scope and next steps together."],
          ["Do you only work in İncek and Gölbaşı?", "No. Our office is in İncek, and we run projects across Ankara, first of all in İncek, Gölbaşı and Çankaya, and elsewhere in Türkiye."],
          ["Does the same team handle design and construction?", "Yes. With a master architect and a civil engineer on one team, design, structure and construction decisions are made together from the start. If you wish, we also take on site supervision and turnkey delivery."],
          PERMIT.en,
        ],
      },
    },
  },
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
        faq: [
          ["Villa projesine nereden başlanır?", "Önce arsanın imar durumu ve yapılaşma koşulları (emsal, çekme mesafeleri, yükseklik) incelenir. İhtiyaç programınızla birlikte konsept tasarıma geçilir; konsept netleşince avan, ruhsat ve uygulama projeleri hazırlanır."],
          ["Evi yapılmadan önce görebilir miyim?", "Evet. Kütle, cephe ve iç mekânları 3D modelde görürsünüz; malzeme ve renk kararlarını uygulamadan önce görselleştirmelerle netleştiririz."],
          ["Mevcut evimi büyütebilir miyim?", "İmar koşulları ve mevcut yapının taşıyıcı sistemi izin veriyorsa ek hacim ya da kat mümkün olabilir. Bunu yerinde inceleme ve statik değerlendirmeyle belirler, gerekiyorsa tadilat ruhsatı sürecini planlarız."],
          PERMIT.tr,
        ],
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
        faq: [
          ["Where does a villa project start?", "With the plot's zoning status and building conditions (floor area ratio, setbacks, height). Together with your brief we move into concept design; once the concept is settled, schematic, permit and construction drawings follow."],
          ["Can I see the house before it is built?", "Yes. You see the massing, façades and interiors in a 3D model, and we settle materials and colours with visualisations before anything is built."],
          ["Can I extend my existing house?", "If zoning and the existing structure allow, an extension or an extra floor may be possible. We confirm it with a site visit and a structural assessment, and plan the alteration permit if one is needed."],
          PERMIT.en,
        ],
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
        title: "İç Mimarlık · İncek, Gölbaşı, Ankara",
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
        why: "İç mimari kararlar, mimar ve mühendisin aynı masada olduğu bir ekipte tesisat ve taşıyıcı sistemle birlikte düşünülür; böylece uygulamada sürpriz azalır. Ofisimiz İncek'te, Merkez İncek Plaza'da; İncek ve Gölbaşı'ndaki ev ve villalara yakınız, Ankara'nın diğer semtlerinde de çalışıyoruz.",
        pricing: "Tasarım paketleri {price} + KDV'den başlar; kapsamı görüşmede birlikte netleştiririz.",
        faq: [
          ["İç mimarlık süreci nasıl ilerler?", "Ölçüm ve ihtiyaç analiziyle başlar. Yerleşim, malzeme ve aydınlatma kararları 3D görsellerle netleşir; ardından uygulama çizimleri ve mekâna özel mobilya detayları hazırlanır."],
          ["Yalnızca tasarım hizmeti alabilir miyim?", "Evet. Tasarım ve uygulama çizimlerini teslim edip uygulamayı kendi ekibinize bırakabilir ya da uygulamayı ve şantiye takibini bize bırakabilirsiniz."],
          ["Ev yaşanırken iç mekân yenilenebilir mi?", "Çoğu zaman evet; işleri odalara bölerek planlarız. Mutfak ve banyo gibi tesisatlı alanlar için süreyi ve kullanım dışı kalacak bölümleri baştan konuşuruz."],
        ],
      },
      en: {
        title: "Interior Architecture in İncek, Gölbaşı & Ankara",
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
        why: "Interior decisions are made alongside services and structure, because the architect and the engineer sit at the same table. That means fewer surprises on site. Our office is at Merkez İncek Plaza in İncek, close to homes and villas in İncek and Gölbaşı, and we work across Ankara.",
        pricing: "Design packages start at {price} + VAT; we agree the exact scope at the first meeting.",
        faq: [
          ["How does the interior design process work?", "It starts with a survey and your brief. Layout, materials and lighting are settled with 3D visuals, then construction drawings and bespoke furniture details are prepared."],
          ["Can I hire you for design only?", "Yes. We can hand over the design and construction drawings for your own team, or take on construction and site supervision as well."],
          ["Can the interior be renewed while we live there?", "Often, yes; we phase the work room by room. For kitchens and bathrooms we agree the timing and which areas will be out of use from the start."],
        ],
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
        faq: [
          ["Tadilat için ruhsat gerekir mi?", "Taşıyıcı sisteme, cepheye ya da yapının kullanımına dokunan değişiklikler genellikle belediyeden izin veya tadilat ruhsatı gerektirir; taşıyıcı olmayan iç mekân yenilemelerinde çoğu zaman gerekmez. Kapsamı inceleyip hangi iznin gerektiğini baştan belirleriz."],
          ["Duvar kaldırılabilir mi?", "Önce duvarın taşıyıcı olup olmadığını inşaat mühendisi olarak yerinde inceleriz. Taşıyıcı duvar ve kolonlara statik proje ve izin olmadan dokunulmaz."],
          ["Cephe yenilemede nelere dikkat edilir?", "Yalıtım, doğrama ve dış cephe malzemesi birlikte düşünülür. Apartmanlarda kat maliklerinin kararı, müstakil yapılarda belediye onayı gerekebilir."],
        ],
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
        faq: [
          ["Does a renovation need a permit?", "Changes to the structure, the façade or the building's use usually need a municipal permit or an alteration licence; non-structural interior renovations often do not. We check the scope and confirm which permit applies before work starts."],
          ["Can a wall be removed?", "First we check on site, as civil engineers, whether the wall is load-bearing. Load-bearing walls and columns are never touched without a structural design and a permit."],
          ["What matters in a façade renovation?", "Insulation, windows and cladding are considered together. Apartment buildings may need the owners' decision, detached houses a municipal approval."],
        ],
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
        faq: [
          ["Kafe veya mağaza projesi nasıl ilerler?", "Markanın kimliği, müşteri akışı, servis ve depo ihtiyaçlarıyla başlarız. Yerleşim, mobilya ve aydınlatma 3D'de netleşir; uygulama çizimleri ustaların aynı detayı uygulamasını sağlar."],
          ["İşyeri ruhsatı için tasarımda neye dikkat edilir?", "Belediyeler işyeri açma ve çalışma ruhsatında çoğu zaman kullanım amacına uygun çizimler ve yangın güvenliği gibi koşullar ister. Gerekenler işletmenin türüne ve belediyeye göre değişir; tasarımı bu koşulları baştan gözeterek hazırlarız."],
        ],
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
        faq: [
          ["How does a café or shop project work?", "We start with the brand, customer flow, service and storage needs. Layout, furniture and lighting are settled in 3D, and construction drawings make sure every trade builds the same detail."],
          ["What does the design need for a business licence?", "Municipalities usually ask for drawings that fit the intended use and for conditions such as fire safety before issuing a business licence. Requirements depend on the type of business and the municipality, so we design with them in mind from the start."],
        ],
      },
    },
  },
];

export const getServiceLanding = (slug: string) => SERVICE_LANDINGS.find((s) => s.slug === slug);

export const LANDING_BY_BOOKING: Partial<Record<AppointmentServiceKey, string>> = Object.fromEntries(
  SERVICE_LANDINGS.map((s) => [s.booking, s.slug])
);
