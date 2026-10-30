import type { Locale } from "@/lib/i18n-config";
import type { AppointmentServiceKey } from "@/lib/services";
import type { ExplainerId } from "@/lib/explainers";
import { EXTRA_LANDINGS } from "@/lib/serviceLandingsExtra";

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
  /** What the client gains: [benefit, explanation]. Conditional wording, no measured claims. */
  gains?: [string, string][];
  /** Step-by-step process: [step, what happens]. */
  steps?: [string, string][];
  /** Two options compared side by side, e.g. full vs partial renovation. */
  comparison?: { title: string; options: [{ title: string; points: string[] }, { title: string; points: string[] }] };
  /** What moves the budget, without figures. */
  budgetFactors?: string[];
  /** Common mistakes and how to avoid them. */
  checklist?: string[];
  diagramCaption?: string;
  /** Same information as the drawing, stacked for narrow screens. */
  diagramItems?: [string, string][];
};

export type ServiceLanding = {
  slug: string;
  booking: AppointmentServiceKey;
  image: string;
  /** Optional explanatory drawing shown next to the scope list. */
  diagram?: string;
  /** Animated step-by-step drawings explaining the service's key ideas. */
  explainers?: ExplainerId[];
  /** Project whose real before/after pair is shown as a comparison slider. */
  beforeAfter?: string;
  projects: string[];
  copy: Record<Locale, Copy>;
};

const PERMIT: Record<Locale, [string, string]> = {
  tr: ["Yapı ruhsatı için hangi belgeler gerekir?", "Genellikle tapu, belediyeden alınan imar durumu belgesi, aplikasyon krokisi, zemin etüdü raporu ile mimari, statik, elektrik ve mekanik projeler istenir; yapı denetim sözleşmesi de sürecin parçasıdır. Belgeler belediyeye ve parselin durumuna göre değişebilir; izin ve onay sürecinde destek oluruz."],
  en: ["Which documents does a building permit need?", "Usually the title deed, the zoning status certificate from the municipality, a site plan, a soil survey and the architectural, structural, electrical and mechanical designs; a building inspection contract is also part of the process. Requirements can vary by municipality and plot, and we support you through permits and approvals."],
};

const BASE_LANDINGS: ServiceLanding[] = [
  {
    slug: "incek-golbasi-mimarlik-ofisi",
    booking: "architectural",
    image: "/images/persons/founders/hacer_uyar/hacer-uyar-u-plus-studio-ofis.jpg",
    projects: ["villa-donusumu", "modern-villa", "butik-kafe", "evox-gym-center"],
    copy: {
      tr: {
        title: "İncek Mimarlık Ofisi · Gölbaşı, Ankara",
        description: "U+ Studio, İncek'te Merkez İncek Plaza'daki mimarlık ofisi: villa, konut, iç mimarlık, tadilat ve ticari mekân projeleri; Gölbaşı, Ankara ve Türkiye geneli.",
        crumb: "Mimarlık ve mühendislik ofisimiz",
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
        crumb: "Our architecture & engineering office",
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
    explainers: ["imar", "zemin", "iklim"],
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
    explainers: ["tadilat", "projeler"],
    beforeAfter: "villa-donusumu",
    projects: ["villa-donusumu", "ofis-yenileme", "konut-uygulama"],
    copy: {
      tr: {
        title: "Tadilat ve Dönüşüm, Ankara",
        description: "Ankara İncek ve Gölbaşı'nda daire, ev, villa ve ofis tadilatı: iç mekân ve cephe yenileme, villa ve ofis dönüşümü. Önce/sonra projelerimizi inceleyin.",
        crumb: "Tadilat ve dönüşüm",
        label: "Yenileme & Dönüşüm",
        heading: ["Tadilat ve", "*dönüşüm.*"],
        intro: "Eski bir daireyi mutfağından banyosuna baştan yenilemek, bir villayı yeniden yaşanır hale getirmek, bir evi ofise dönüştürmek ya da cepheyi yenilemek: işe mevcut durumu birlikte inceleyerek başlar, tasarımı ve uygulamayı aynı ekipte yönetiriz.",
        forWhoTitle: "Kimler için",
        forWho: ["Dairesini, evini ya da villasını yenilemek isteyenler", "Yeni aldığı ikinci el daireyi taşınmadan önce elden geçirecekler", "Bir binayı farklı bir işleve, örneğin ofise dönüştürecekler", "Cephe veya iç mekân yenilemesi planlayanlar"],
        scopeTitle: "Hizmet kapsamı",
        scope: ["Mevcut durumun yerinde incelenmesi", "Dönüşüm konsepti ve 3D görselleştirme", "Uygulama projeleri", "Cephe ve iç mekân yenileme", "Şantiye ve bütçe takibi"],
        whyTitle: "Gerçek önce / sonra",
        why: "İncek'teki villadan ofise dönüşüm ve villa dönüşümü projelerimizin önce ve sonra hallerini proje sayfalarında görebilirsiniz.",
        faq: [
          ["Tadilat için ruhsat gerekir mi?", "Taşıyıcı sisteme, cepheye ya da yapının kullanımına dokunan değişiklikler genellikle belediyeden izin veya tadilat ruhsatı gerektirir; taşıyıcı olmayan iç mekân yenilemelerinde çoğu zaman gerekmez. Kapsamı inceleyip hangi iznin gerektiğini baştan belirleriz."],
          ["Duvar kaldırılabilir mi?", "Önce duvarın taşıyıcı olup olmadığını inşaat mühendisi olarak yerinde inceleriz. Taşıyıcı duvar ve kolonlara statik proje ve izin olmadan dokunulmaz."],
          ["Cephe yenilemede nelere dikkat edilir?", "Yalıtım, doğrama ve dış cephe malzemesi birlikte düşünülür. Apartmanlarda kat maliklerinin kararı, müstakil yapılarda belediye onayı gerekebilir."],
        ],
        gains: [
          ["Yıkmadan yenilenen bir yapı", "Mevcut yapıyı korumak, yıkıp yeniden yapmaya göre farklı bir maliyet ve süre dengesi sunar."],
          ["Bugünün yaşamına uyan bir ev", "Yerleşim, ışık ve depolama, ailenizin şimdiki ihtiyaçlarına göre yeniden kurulur."],
          ["Daha çağdaş ve bakımlı bir görünüm", "Yenilenen cephe ve iç mekân, yapının algılanan değerini destekler; piyasa etkisi konum ve koşullara bağlıdır."],
          ["Sürprizi azalan bir süreç", "Mevcut durum ve taşıyıcı sistem baştan incelendiği için kapsam ve izinler önceden netleşir."],
        ],
        comparison: {
          title: "Komple mi, kısmi yenileme mi?",
          options: [
            { title: "Kısmi yenileme", points: ["Mutfak, banyo, zemin veya boya gibi belirli alanlara odaklanır.", "Ev çoğu zaman yaşanırken, odalara bölünerek yapılabilir.", "Taşıyıcı sisteme ve ıslak hacimlerin yerine dokunmuyorsa genellikle izin gerektirmez.", "Bütçe ve süre daha kontrollüdür; ancak eski tesisat ileride yeni iş çıkarabilir."] },
            { title: "Komple yenileme", points: ["Yerleşim, tesisat, cephe ve iç mekân birlikte ele alınır.", "Çoğu zaman evin bir süre boşaltılmasını gerektirir.", "Islak hacimlerin yerinin değişmesi veya taşıyıcıya dokunan işler esaslı tadilattır ve ruhsata tabidir.", "Tek seferde bütüncül bir sonuç verir; söküm sonrası çıkabilecek durumlar için pay bırakmak gerekir."] },
          ],
        },
        steps: [
          ["Ön keşif", "Mevcut yapıyı yerinde inceler, ölçü alır ve fotoğraflarız; varsa onaylı projeleri değerlendiririz."],
          ["İhtiyaç analizi", "Ailenizin yaşam düzenini, önceliklerinizi ve bütçe çerçevenizi konuşuruz."],
          ["Teknik değerlendirme", "Taşıyıcı sistemi, tesisatı ve hangi işlerin izin gerektirdiğini belirleriz."],
          ["Konsept ve alternatifler", "Yerleşim, cephe ve malzeme seçeneklerini 3D görsellerle karşılaştırırsınız."],
          ["Uygulama projeleri", "Seçilen çözüm, ustaların kullanacağı çizim ve detaylara dönüşür."],
          ["Uygulama ve takip", "İş sırasını, bütçeyi ve kaliteyi takip eder; sahadaki kararları projeye işleriz."],
          ["Teslim", "Eksik listesiyle kontrol eder, işi birlikte teslim alırız."],
        ],
        budgetFactors: ["Yenilenecek alanın büyüklüğü ve kapsamı", "Tesisat ve elektriğin yenilenip yenilenmeyeceği", "Islak hacimlerin yerinde kalıp kalmayacağı", "Cephe, doğrama ve yalıtım işlerinin dahil olup olmadığı", "Malzeme ve ürün seçimleri", "Özel üretim mobilya miktarı", "Söküm sonrası ortaya çıkan durumlar", "İzin, harç ve uzmanlık gerektiren işler"],
        checklist: ["Duvar kaldırmadan önce taşıyıcı olup olmadığını öğrenmemek", "Banyo veya mutfağın yerini, gider eğimini ve izin durumunu kontrol etmeden değiştirmek", "Tesisatı yenilemeden yeni yüzey kaplamak", "Malzemeyi yalnızca görselden, numune görmeden seçmek", "Söküm sonrası çıkabilecek işler için bütçede pay bırakmamak", "Kapsamı ve teslim kriterlerini yazılı hale getirmemek"],
      },
      en: {
        title: "Renovation & Conversion in Ankara",
        description: "Flat, home, villa and office renovation in İncek, Gölbaşı and Ankara: interior and façade renewal and conversions, with real before/after work.",
        crumb: "Renovation",
        label: "Renovation & Conversion",
        heading: ["Renovation and", "*conversion.*"],
        intro: "Renewing an old flat from kitchen to bathroom, bringing an old villa back to life, turning a house into an office or renewing a façade: we start by reviewing the existing building together, then run design and construction as one team.",
        forWhoTitle: "Who it is for",
        forWho: ["Owners renewing a flat, house or villa", "Buyers of a second-hand flat who want it renewed before moving in", "Anyone converting a building to a new use, such as an office", "Owners planning a façade or interior renewal"],
        scopeTitle: "Scope",
        scope: ["On-site review of the existing building", "Conversion concept and 3D visualisation", "Construction drawings", "Façade and interior renewal", "Site and budget follow-up"],
        whyTitle: "Real before / after",
        why: "See the before and after of our villa-to-office conversion in İncek and our villa transformation on their project pages.",
        faq: [
          ["Does a renovation need a permit?", "Changes to the structure, the façade or the building's use usually need a municipal permit or an alteration licence; non-structural interior renovations often do not. We check the scope and confirm which permit applies before work starts."],
          ["Can a wall be removed?", "First we check on site, as civil engineers, whether the wall is load-bearing. Load-bearing walls and columns are never touched without a structural design and a permit."],
          ["What matters in a façade renovation?", "Insulation, windows and cladding are considered together. Apartment buildings may need the owners' decision, detached houses a municipal approval."],
        ],
        gains: [
          ["A building renewed without demolition", "Keeping the existing building offers a different cost and time balance from demolishing and rebuilding."],
          ["A home that fits life today", "Layout, light and storage are rebuilt around your family's current needs."],
          ["A more contemporary, well-kept look", "Renewed façades and interiors support perceived value; market effect depends on location and conditions."],
          ["A process with fewer surprises", "The existing building and structure are reviewed first, so scope and permits are clear in advance."],
        ],
        comparison: {
          title: "Full or partial renovation?",
          options: [
            { title: "Partial renovation", points: ["Focuses on specific areas such as kitchen, bathroom, floors or paint.", "Can often be done room by room while you live there.", "Usually needs no permit if it does not touch the structure or move wet rooms.", "Budget and time are easier to control, but old services may cause work later."] },
            { title: "Full renovation", points: ["Layout, services, façade and interior are handled together.", "Often means moving out for a while.", "Moving wet rooms or touching the structure is a substantial alteration and needs a permit.", "Gives a coherent result in one go; leave an allowance for what stripping out reveals."] },
          ],
        },
        steps: [
          ["Site visit", "We inspect, measure and photograph the building and review any approved drawings."],
          ["Needs analysis", "We discuss how your family lives, your priorities and your budget frame."],
          ["Technical review", "We assess the structure, services and which works need permission."],
          ["Concept and options", "You compare layout, façade and material options in 3D."],
          ["Construction drawings", "The chosen solution becomes drawings and details for the trades."],
          ["Construction and follow-up", "We follow sequence, budget and quality and record site decisions in the drawings."],
          ["Handover", "We check against a snagging list and hand over together."],
        ],
        budgetFactors: ["Size and scope of the area renewed", "Whether services and electrics are renewed", "Whether wet rooms stay where they are", "Whether façade, windows and insulation are included", "Material and product choices", "The amount of bespoke joinery", "Conditions revealed by stripping out", "Works needing permits, fees or specialists"],
        checklist: ["Removing a wall without knowing whether it is load-bearing", "Moving a bathroom or kitchen without checking drainage falls and permits", "Laying new finishes over old services", "Choosing materials from images without seeing samples", "Leaving no allowance for what stripping out reveals", "Not putting scope and handover criteria in writing"],
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
  {
    slug: "kafe-restoran-tasarimi-ankara",
    booking: "commercial",
    image: "/media/projects/butik-kafe/interior-hd.jpg",
    diagram: "/media/diagrams/cafe-flow.svg",
    projects: ["butik-kafe", "pastane", "evox-gym-center", "ofis-yenileme"],
    copy: {
      tr: {
        title: "Kafe ve Restoran Tasarımı, Ankara",
        description: "Ankara'da kafe ve restoran iç mimarisi: müşteri akışı, bar ve mutfak yerleşimi, oturma düzeni, aydınlatma ve uygulama çizimleri.",
        crumb: "Kafe & restoran tasarımı",
        label: "Kafe & Restoran",
        heading: ["Kafe ve restoran", "*tasarımı.*"],
        intro: "Bir kafede oturma düzeni kadar servis yolunun, menünün ve ekip hareketinin de çalışması gerekir. Ankara'daki kafe, pastane ve restoran projelerini müşteri akışından mutfak yerleşimine kadar birlikte kurguluyoruz.",
        forWhoTitle: "Kimler için",
        forWho: ["Kafe, pastane veya restoran açacak girişimciler", "Mevcut işletmesini yenileyecek sahipler", "Yeni bir şube için tutarlı mekân kurgusu arayan markalar"],
        scopeTitle: "Hizmet kapsamı",
        scope: ["Konsept ve marka atmosferi", "Müşteri ve servis akışı", "Bar, mutfak ve depo yerleşimi", "Oturma düzeni ve kapasite çalışması", "Aydınlatma ve akustik yaklaşımı", "Teknik çizimler ve uygulama takibi"],
        whyTitle: "Sahadan örnekler",
        why: "Kedili Butik Kafe ve pastane projelerimizde konsepti, oturma düzenini ve servis alanlarını birlikte çözdük; sonuçları proje sayfalarında görebilirsiniz.",
        faq: [
          ["Kaç kişilik oturma düzeni kurulabilir?", "Bu; mekânın alanına, servis barının uzunluğuna, mutfak ve depo ihtiyacına ve geçiş genişliklerine bağlıdır. Ölçüler ve işletme modeliniz netleşince oturma kapasitesini birlikte çalışırız; ölçü görmeden sayı vermeyiz."],
          ["Mutfak tasarımı da kapsamda mı?", "Evet. Menü, ekipman listesi ve servis hızı mutfak yerleşimini belirler. Mutfak, bar ve servis noktası arasındaki mesafeyi müşteri alanını bozmadan kurmak tasarımın parçasıdır."],
          ["Açılış tarihine göre tasarım ne zaman başlamalı?", "Tasarım, tedarik ve uygulama iç içe ilerler. Hedef açılış tarihinizi paylaşın; hangi kararın ne zaman verilmesi gerektiğini birlikte takvime yerleştirelim. Kira ve ruhsat süreçleri takvimi etkileyebilir."],
          ["İşyeri açma ruhsatı için ne gerekiyor?", "Belediyeler kullanım amacına uygun çizimler ve yangın güvenliği gibi koşullar ister; gerekenler işletme türüne ve belediyeye göre değişir. Tasarımı bu koşulları baştan gözeterek hazırlarız; onay mercii belediyedir."],
        ],
        diagramCaption: "Şema, kafede müşteri alanı ile arka alanın (mutfak, depo, servis girişi) nasıl ayrıldığını gösterir; ölçekli bir yerleşim planı değildir.",
        diagramItems: [
          ["Giriş ve sipariş", "Müşteri girişten doğrudan sipariş noktasına yönelir; kuyruk salonun içine taşmaz."],
          ["Salon", "Oturma düzeni, giriş ve servis yolunu kapatmadan yerleşir."],
          ["Bar · servis", "Sipariş ve servis aynı hatta toplanır; mutfakla arasında servis penceresi bulunur."],
          ["Mutfak", "Menü ve ekipman listesine göre servis hattının hemen arkasında konumlanır."],
          ["Müşteri WC", "Salondan ulaşılır; müşteri mutfaktan veya depodan geçmez."],
          ["Depo ve servis girişi", "Mutfağa bitişiktir; mal kabulü müşteri girişinden değil ayrı kapıdan yapılır."],
        ],
      },
      en: {
        title: "Café & Restaurant Design in Ankara",
        description: "Café and restaurant interior design in Ankara: customer flow, bar and kitchen layout, seating, lighting and construction drawings.",
        crumb: "Café & restaurant design",
        label: "Café & Restaurant",
        heading: ["Café and restaurant", "*design.*"],
        intro: "In a café, the service route, the menu and the way the team moves matter as much as the seating. We shape café, bakery and restaurant projects in Ankara from customer flow through to the kitchen layout.",
        forWhoTitle: "Who it is for",
        forWho: ["Founders opening a café, bakery or restaurant", "Owners renewing an existing business", "Brands that need a consistent space for a new branch"],
        scopeTitle: "Scope",
        scope: ["Concept and brand atmosphere", "Customer and service flow", "Bar, kitchen and storage layout", "Seating and capacity study", "Lighting and acoustic approach", "Technical drawings and site follow-up"],
        whyTitle: "From our work",
        why: "In the Cat-themed Boutique Café and the patisserie we resolved concept, seating and service areas together; the project pages show the results.",
        faq: [
          ["How many seats will fit?", "It depends on the floor area, the length of the service bar, kitchen and storage needs, and the circulation widths the regulations allow. Once dimensions and your business model are clear we work out capacity together; we do not quote a number without measuring."],
          ["Is kitchen design included?", "Yes. The menu, equipment list and service speed determine the kitchen layout. Keeping the distance between kitchen, bar and service point short without harming the guest area is part of the design."],
          ["When should design start relative to opening?", "Design, procurement and construction overlap. Share your target opening date and we will place the decisions on a shared timeline. Lease and licensing processes can affect that timeline."],
          ["What does a business licence require?", "Municipalities ask for drawings that match the intended use and for conditions such as fire safety; requirements vary by business type and municipality. We design with those conditions in mind, but the approving authority is the municipality."],
        ],
        diagramCaption: "The diagram shows how the guest area is separated from the back of house (kitchen, store, service entrance) in a café; it is not a scaled layout plan.",
        diagramItems: [
          ["Entrance and ordering", "Guests head straight to the ordering point; the queue does not spill into the seating."],
          ["Guest area", "Seating is arranged without blocking the entrance or the service route."],
          ["Bar · service", "Ordering and service share one line, with a pass-through to the kitchen."],
          ["Kitchen", "Placed directly behind the service line, sized to the menu and equipment list."],
          ["Guest WC", "Reached from the guest area; guests never pass through the kitchen or store."],
          ["Store and service entrance", "Next to the kitchen; deliveries arrive through a separate door, not the guest entrance."],
        ],
      },
    },
  },
  {
    slug: "ofis-ic-mimarlik-ankara",
    booking: "office",
    image: "/media/projects/ofis-yenileme/after.jpg",
    diagram: "/media/diagrams/office-zones.svg",
    projects: ["ofis-yenileme", "yonetici-ofisi", "evox-gym-center", "butik-kafe"],
    copy: {
      tr: {
        title: "Ofis İç Mimarlık ve Tasarımı, Ankara",
        description: "Ankara'da ofis iç mimarisi: çalışma ve toplantı alanları, akustik, aydınlatma, marka kimliği ve uygulama çizimleri.",
        crumb: "Ofis iç mimarlığı",
        label: "Ofis & Klinik",
        heading: ["Ofis iç mimarlığı", "*ve tasarımı.*"],
        intro: "Ofis, ekibin günün büyük bölümünü geçirdiği bir mekân. Ankara'daki ofis projelerinde çalışma düzenini, toplantı ihtiyacını, akustiği ve marka kimliğini aynı planda ele alıyoruz.",
        forWhoTitle: "Kimler için",
        forWho: ["Büyüyen veya taşınacak şirketler", "Mevcut ofisini yenileyecek ekipler", "Yönetici odası ve toplantı alanlarını yeniden kurgulamak isteyenler"],
        scopeTitle: "Hizmet kapsamı",
        scope: ["İhtiyaç programı ve alan hesabı", "Açık çalışma, odak ve toplantı bölgeleri", "Karşılama ve müşteri alanı", "Akustik ve aydınlatma yaklaşımı", "Marka kimliğinin mekâna aktarımı", "Teknik çizimler, metraj ve uygulama takibi"],
        whyTitle: "Sahadan örnekler",
        why: "Villadan ofise dönüşüm projemizde yapıyı ofis kullanımına uyarladık; yönetici odası çalışmasında ise tek bir mekânın nasıl kurgulandığını görebilirsiniz.",
        faq: [
          ["Kaç kişilik çalışma alanı sığar?", "Alan; masa düzeni, toplantı odaları, sirkülasyon ve destek alanlarına göre değişir. Kişi başına sabit bir metrekare varsaymak yerine ekibin çalışma biçimini ve büyüme planını konuşuruz."],
          ["Hibrit çalışma düzenine uygun tasarım yapıyor musunuz?", "Evet. Herkesin aynı anda ofiste olmadığı bir düzende odak alanları, sessiz çalışma odaları ve toplantı kapasitesi yeniden dengelenir. Hangi günlerde kaç kişinin geldiğini bilmek yerleşimi belirler."],
          ["Mevcut ofiste tadilat mümkün mü?", "Taşıyıcı sistem, tesisat ve yangın güvenliği izin verdiği ölçüde mümkündür. Önce mevcut durumu inceler, hangi müdahalelerin ruhsat gerektirdiğini belirleriz."],
          ["Sadece tasarım alabilir miyiz?", "Evet. Tasarım ve çizimleri hazırlayıp uygulamayı kendi ekibinizle yürütebilirsiniz. Sahadaki soruların kime yöneltileceğini başlangıçta netleştiririz."],
        ],
        diagramCaption: "Şema, ofiste ziyaretçiye açık bölgeden ekibin sessiz bölgesine doğru kademeli yerleşimi gösterir; ölçekli bir plan değildir.",
        diagramItems: [
          ["Karşılama ve bekleme", "Dış kapı doğrudan çalışma alanına değil, karşılamaya açılır; ziyaretçi burada karşılanır."],
          ["Toplantı odası", "Karşılamanın yanındadır; ziyaretçi çalışma alanından geçmeden toplantıya ulaşır."],
          ["Açık çalışma", "Gün ışığı alan cephe boyunca yerleşir; koridordan ayrı ama ona bağlıdır."],
          ["Odak ve yönetici odaları", "Koridorun sessiz tarafında, girişten en uzak bölümdedir."],
          ["Destek alanları", "Mutfak, baskı, depo ve WC tesisat çekirdeğinde bir arada toplanır."],
        ],
      },
      en: {
        title: "Office Interior Design in Ankara",
        description: "Office interior design in Ankara: workstations, meeting rooms, acoustics, lighting, brand identity and construction drawings.",
        crumb: "Office interiors",
        label: "Office & Clinic",
        heading: ["Office interior", "*design.*"],
        intro: "An office is where a team spends most of its day. In our Ankara office projects we consider working patterns, meeting needs, acoustics and brand identity on the same plan.",
        forWhoTitle: "Who it is for",
        forWho: ["Companies that are growing or relocating", "Teams renewing their current office", "Anyone rethinking executive and meeting rooms"],
        scopeTitle: "Scope",
        scope: ["Brief and area calculation", "Open work, focus and meeting zones", "Reception and client areas", "Acoustic and lighting approach", "Translating brand identity into space", "Technical drawings, quantities and site follow-up"],
        whyTitle: "From our work",
        why: "Our villa-to-office conversion adapted an existing building for office use, while the executive study shows how a single room can be composed.",
        faq: [
          ["How many workstations will fit?", "The answer depends on desk layout, meeting rooms, circulation and support areas. Rather than assuming a fixed area per person, we discuss how your team works and how it plans to grow."],
          ["Can you design for hybrid working?", "Yes. When not everyone is in at once, focus areas, quiet rooms and meeting capacity need rebalancing. Knowing how many people come in on which days shapes the layout."],
          ["Is renovation possible in our current office?", "To the extent the structure, building services and fire safety allow. We assess existing conditions first and identify which interventions need a permit."],
          ["Can we take design only?", "Yes. We can prepare the design and drawings while your team delivers the build. We agree at the outset who answers questions on site."],
        ],
        diagramCaption: "The diagram shows an office stepping from the area open to visitors towards the team's quiet zone; it is not a scaled plan.",
        diagramItems: [
          ["Reception and waiting", "The front door opens onto reception, not the workspace; visitors are greeted here."],
          ["Meeting room", "Next to reception, so visitors reach meetings without crossing the workspace."],
          ["Open work", "Along the daylit façade; separate from the corridor but connected to it."],
          ["Focus and executive rooms", "On the quiet side of the corridor, furthest from the entrance."],
          ["Support areas", "Kitchen, print, storage and WC grouped together around the services core."],
        ],
      },
    },
  },
];

/** Existing pages first, so the first page per booking option (LANDING_BY_BOOKING) stays the same. */
export const SERVICE_LANDINGS: ServiceLanding[] = [...BASE_LANDINGS, ...EXTRA_LANDINGS];

/** The office page introduces the studio itself rather than a service. */
export const OFFICE_LANDING = "incek-golbasi-mimarlik-ofisi";

/** "What we do" order: the building, its interior, renewal, businesses, details, then technical support and delivery. */
export const SERVICE_ORDER: readonly string[] = [
  "villa-mimari-proje-ankara",
  "apartman-konut-projesi-ankara",
  "ic-mimarlik-ankara",
  "tadilat-donusum-ankara",
  "ofis-ic-mimarlik-ankara",
  "kafe-restoran-tasarimi-ankara",
  "ticari-mekan-tasarimi-ankara",
  "mutfak-tasarimi-ankara",
  "ozel-mobilya-tasarimi-ankara",
  "cephe-tasarimi-yenileme-ankara",
  "peyzaj-bahce-tasarimi-ankara",
  "3d-gorsellestirme-render-ankara",
  "ruhsat-proje-onay-destegi-ankara",
  "muhendislik-danismanligi-ankara",
  "anahtar-teslim-uygulama-ankara",
];

export const getServiceLanding = (slug: string) => SERVICE_LANDINGS.find((s) => s.slug === slug);

/** A booking option can have more than one landing page (e.g. all commercial typologies). */
export const LANDINGS_BY_BOOKING = SERVICE_LANDINGS.reduce<Record<string, string[]>>((acc, landing) => {
  (acc[landing.booking] ??= []).push(landing.slug);
  return acc;
}, {});

/** The landing a service card links to; the first published page for that booking option. */
export const LANDING_BY_BOOKING: Partial<Record<AppointmentServiceKey, string>> = Object.fromEntries(
  Object.entries(LANDINGS_BY_BOOKING).map(([booking, slugs]) => [booking, slugs[0]])
);
