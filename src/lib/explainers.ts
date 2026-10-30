import type { Locale } from "./i18n-config";

export type ExplainerId = "imar" | "zemin" | "iklim" | "projeler" | "surec" | "tadilat";

export type ExplainerCopy = Readonly<{
  step: string;
  title: string;
  /** One-sentence version for cards. */
  short: string;
  /** The idea explained with an everyday comparison. */
  simple: string;
  /** Numbered keys matching the numbers in the drawing. */
  legend: readonly string[];
  example: string;
  ankara: string;
}>;

export const explainerLabels = {
  tr: { example: "Örnekle", ankara: "Ankara'da", note: "Genel bilgilendirmedir; kesin koşullar parsele, belediyeye ve projeye göre değişir." },
  en: { example: "For example", ankara: "In Ankara", note: "General guidance; exact conditions vary by plot, municipality and project." },
} satisfies Record<Locale, Record<string, string>>;

export const explainers: Record<ExplainerId, Record<Locale, ExplainerCopy>> = {
  imar: {
    tr: {
      step: "Adım 1 · Arsa",
      title: "Arsanız ne kadar bina taşır?",
      short: "Belediye, arsanın ne kadarına bina oturabileceğini ve toplam kaç metrekare yapılabileceğini önceden belirler.",
      simple: "Arsayı bir masa örtüsü gibi düşünün. Belediye, örtünün ne kadarına tabak koyabileceğinizi ve tabakları kaç kat üst üste dizebileceğinizi önceden yazar. Bu kurallar imar durumu belgesinde bulunur; tasarım bu sınırların içinde başlar.",
      legend: [
        "Arsa: tapudaki toprak parçanız.",
        "Çekme mesafesi: yola ve komşuya bırakılan boşluk. Bina bu kesikli çizginin içinde kalır.",
        "TAKS: binanın zemine oturan kısmı. TAKS 0,30 ise arsanın en fazla %30'u.",
        "KAKS (emsal): bütün katların toplamı. KAKS 0,60 ise arsa alanının 0,60 katı kadar inşaat.",
      ],
      example: "500 m² arsa, TAKS 0,30 ve KAKS 0,60 olsun: zemine 500 × 0,30 = 150 m² oturur, toplamda 500 × 0,60 = 300 m² yapılır. Yani kabaca 150 m²'lik iki kat. Bodrum ve otopark gibi bazı alanlar hesaba farklı katılabilir; kesin hesap projede yapılır.",
      ankara: "İmar durumu, parselin bağlı olduğu belediyeden alınır; İncek, Gölbaşı Belediyesi sınırlarındadır. Gölbaşı'ndaki bazı alanlar Özel Çevre Koruma Bölgesi kapsamında olduğu için ek kurallar ve onaylar gerekebilir.",
    },
    en: {
      step: "Step 1 · Plot",
      title: "How much building can your plot carry?",
      short: "The municipality decides in advance how much of the plot a building may cover and how many square metres may be built in total.",
      simple: "Think of the plot as a tablecloth. The municipality writes down how much of the cloth you may cover with plates and how high you may stack them. These rules are in the zoning status certificate, and design starts inside them.",
      legend: [
        "Plot: the land on your title deed.",
        "Setback: the gap left to the road and neighbours. The building stays inside the dashed line.",
        "TAKS (footprint ratio): the part of the building touching the ground. TAKS 0.30 means at most 30% of the plot.",
        "KAKS (floor area ratio): all floors added together. KAKS 0.60 means 0.60 times the plot area.",
      ],
      example: "Take a 500 m² plot with TAKS 0.30 and KAKS 0.60: 500 × 0.30 = 150 m² on the ground and 500 × 0.60 = 300 m² in total, roughly two floors of 150 m². Some areas such as basements and parking may be counted differently; the exact figure is worked out in the design.",
      ankara: "The zoning status comes from the municipality the plot belongs to; İncek lies within Gölbaşı Municipality. Parts of Gölbaşı fall within a Special Environmental Protection Area, which can add rules and approvals.",
    },
  },
  zemin: {
    tr: {
      step: "Adım 2 · Zemin",
      title: "Toprağı tanımadan temel atılmaz.",
      short: "Arsada sondaj yapılır, zemin raporu hazırlanır; temel ve taşıyıcı sistem bu rapora ve deprem kurallarına göre çizilir.",
      simple: "Kumdan kale yaparken ıslak kumun daha sağlam olduğunu bilirsiniz. Binalar için de toprağın ne kadar sağlam olduğunu bilmek gerekir. Bu yüzden arsada sondaj yapılır, toprak örnekleri incelenir ve zemin etüdü raporu hazırlanır.",
      legend: [
        "Sondaj: toprağın derinlerinden örnek alınır.",
        "Temel: binanın toprağa basan ayağı. Şekli ve derinliği zemin raporuna göre belirlenir.",
        "Deprem: kolon, kiriş ve perdeler sarsıntıyı karşılayacak şekilde hesaplanır.",
      ],
      example: "Aynı ev planı iki farklı arsada iki farklı temel isteyebilir. Zemin etüdü tasarımın sonunda değil başında yapılırsa sonradan değişiklik ve maliyet sürprizi azalır.",
      ankara: "Türkiye'de yeni binalar Türkiye Bina Deprem Yönetmeliği'ne (2018) göre tasarlanır. Zemin etüdü raporu, Ankara'da da yapı ruhsatı dosyasının parçasıdır.",
    },
    en: {
      step: "Step 2 · Ground",
      title: "No foundation before you know the soil.",
      short: "The plot is drilled and a soil report prepared; foundations and structure are designed to that report and to earthquake rules.",
      simple: "When building a sandcastle you know wet sand holds better. Buildings also need to know how firm the ground is, so the plot is drilled, soil samples are tested and a soil survey report is prepared.",
      legend: [
        "Drilling: samples are taken from deep in the ground.",
        "Foundation: the building's feet. Its type and depth follow the soil report.",
        "Earthquake: columns, beams and shear walls are calculated to resist shaking.",
      ],
      example: "The same house plan can need two different foundations on two different plots. A soil survey done at the start rather than the end reduces later changes and cost surprises.",
      ankara: "New buildings in Türkiye are designed to the Turkish Building Earthquake Code (2018). The soil survey report is part of the building permit file in Ankara as well.",
    },
  },
  iklim: {
    tr: {
      step: "Adım 3 · İklim",
      title: "Ankara'nın kışı uzun: ısıyı içeride tutmak.",
      short: "Yalıtım evin montudur; doğru yöne bakan pencereler kış güneşini içeri alır.",
      simple: "Kışın kalın bir mont giydiğinizde vücut ısınız içeride kalır. Duvarlara ve çatıya yapılan yalıtım da evin montudur. Pencereler doğru yöne bakarsa alçak kış güneşi evi kendiliğinden ısıtır.",
      legend: [
        "Yalıtımsız duvar: ısı dışarı kaçar, kombi daha çok çalışır.",
        "Yalıtımlı duvar ve çatı: ısı içeride kalır.",
        "Güney cephe: kışın alçak güneş içeri girer; yazın doğru bir saçak gölge yapar.",
      ],
      example: "Geniş camlar güzeldir, ama yönü ve camın cinsi doğru seçilmezse kışın ısı kaybına, yazın aşırı ısınmaya yol açar. Pencere boyutu planla birlikte düşünülür.",
      ankara: "Ankara karasal iklimdedir; kışlar soğuk ve karlı geçer. Yeni binalarda ısı yalıtımı TS 825 standardına göre hesaplanır ve bu hesap ruhsat dosyasında yer alır.",
    },
    en: {
      step: "Step 3 · Climate",
      title: "Ankara winters are long: keeping the heat in.",
      short: "Insulation is the house's coat; windows facing the right way let winter sun in.",
      simple: "A thick coat keeps your body heat in during winter. Insulation on the walls and roof is the house's coat. When windows face the right way, the low winter sun warms the house on its own.",
      legend: [
        "Uninsulated wall: heat escapes and the boiler works harder.",
        "Insulated walls and roof: the heat stays inside.",
        "South façade: low winter sun comes in; a well-sized eave shades it in summer.",
      ],
      example: "Large windows are lovely, but with the wrong orientation or glass they cause heat loss in winter and overheating in summer. Window sizes are decided together with the plan.",
      ankara: "Ankara has a continental climate with cold, snowy winters. Thermal insulation in new buildings is calculated to the TS 825 standard, and that calculation is part of the permit file.",
    },
  },
  projeler: {
    tr: {
      step: "Adım 4 · Projeler",
      title: "Bir bina önce kâğıt üstünde yapılır.",
      short: "Mimari, statik, elektrik ve mekanik projeler aynı binayı farklı ustalar için anlatır ve birbirini tutmalıdır.",
      simple: "Bir pasta tarifini düşünün: hamur ayrı, krema ayrı yazılır ama hepsi aynı pasta içindir. Bina da böyle çizilir. Her usta kendi sayfasını okur; sayfalar birbirini tutmazsa şantiyede sorun çıkar.",
      legend: [
        "Mimari proje: odalar, ölçüler, cephe ve malzeme.",
        "Statik proje: temel, kolon, kiriş ve döşeme.",
        "Elektrik projesi: priz, aydınlatma, pano ve hatlar.",
        "Mekanik proje: su, ısıtma, havalandırma ve gider.",
      ],
      example: "Mimari planda bir duvarın yeri değişirse statik, elektrik ve mekanik projelerin de değişmesi gerekebilir. Ekipler baştan birlikte çalışırsa şantiyede yıkıp yeniden yapmak azalır.",
      ankara: "Ruhsat başvurusunda bu projelere ek olarak genellikle zemin etüdü raporu, ısı yalıtım hesabı ve yapı denetim sözleşmesi istenir. Kesin liste ilgili belediyeden teyit edilir.",
    },
    en: {
      step: "Step 4 · Drawings",
      title: "A building is built on paper first.",
      short: "Architectural, structural, electrical and mechanical designs describe the same building for different trades and must agree.",
      simple: "Think of a cake recipe: the dough and the cream are written separately, but they are for the same cake. A building is drawn the same way. Each trade reads its own pages, and if the pages disagree the site runs into trouble.",
      legend: [
        "Architectural design: rooms, dimensions, façade and materials.",
        "Structural design: foundations, columns, beams and slabs.",
        "Electrical design: sockets, lighting, distribution board and circuits.",
        "Mechanical design: water, heating, ventilation and drainage.",
      ],
      example: "If a wall moves on the architectural plan, the structural, electrical and mechanical designs may need to change too. When the teams work together from the start, less is torn out on site.",
      ankara: "Alongside these designs, a permit application usually requires a soil survey report, a thermal insulation calculation and a building inspection contract. The exact list is confirmed with the municipality.",
    },
  },
  surec: {
    tr: {
      step: "Adım 5 · İzinler",
      title: "Ruhsattan anahtara giden yol.",
      short: "Belgeler, belediye onayı, ruhsat, denetimli şantiye ve iskân: her durak bir sonrakinin ön koşuludur.",
      simple: "Bir otobüs yolculuğundaki duraklar gibi: her durakta bir onay alınır, sonra bir sonrakine geçilir. Bir durağı atlamak, yolun sonunda geri dönmek zorunda kalmak demektir.",
      legend: [
        "Belgeler hazırlanır: projeler, raporlar ve sözleşmeler.",
        "Belediye inceler; eksikler tamamlanır, harçlar ödenir.",
        "Yapı ruhsatı alınır; inşaat resmen başlayabilir.",
        "Şantiye: yapı denetim kuruluşu işi aşama aşama kontrol eder.",
        "İskân (yapı kullanma izin belgesi): bina oturmaya hazırdır.",
      ],
      example: "Şantiyede yapılan ama projeye işlenmeyen değişiklikler iskân aşamasında sorun çıkarabilir. Sahada alınan kararların projeye zamanında yansıtılması bu yüzden önemlidir.",
      ankara: "Türkiye'de yapı denetimi 4708 sayılı Kanun ile zorunludur. İskân belgesi, kalıcı elektrik, su ve doğalgaz abonelikleri gibi işlemlerde de genellikle istenir.",
    },
    en: {
      step: "Step 5 · Permits",
      title: "The road from permit to keys.",
      short: "Documents, municipal approval, permit, inspected construction and occupancy: each stop is a condition for the next.",
      simple: "Like stops on a bus journey: at each stop an approval is collected before moving on. Skipping a stop means having to come back at the end of the road.",
      legend: [
        "Documents are prepared: designs, reports and contracts.",
        "The municipality reviews; gaps are filled and fees paid.",
        "The building permit is issued and construction can officially start.",
        "Site: a building inspection firm checks the work stage by stage.",
        "Occupancy certificate: the building is ready to live in.",
      ],
      example: "Changes made on site but not recorded in the drawings can cause trouble at the occupancy stage, so decisions taken on site need to reach the drawings in time.",
      ankara: "Building inspection is mandatory in Türkiye under Law No. 4708. The occupancy certificate is usually also required for permanent electricity, water and gas connections.",
    },
  },
  tadilat: {
    tr: {
      step: "Tadilat",
      title: "Tadilatta neye dokunulur, neye dokunulmaz?",
      short: "Ara duvarlar çoğu zaman değişebilir; kolon, kiriş ve perde duvarlar binanın iskeletidir ve kesilmez.",
      simple: "Binayı bir insan gibi düşünün: kolon ve kirişler kemiklerdir, ara duvarlar ise kıyafet. Kıyafet değiştirilebilir, kemik değiştirilmez. Banyo ve mutfak ise damarlara, yani tesisata bağlıdır.",
      legend: [
        "Ara duvar: taşıyıcı olmadığı doğrulanırsa kaldırılabilir veya taşınabilir.",
        "Kolon, kiriş ve perde duvar: taşıyıcıdır; kesilmez, delinmez, inceltilmez.",
        "Islak hacim ve tesisat şaftı: banyo ve mutfağı taşımak, gider eğimi ve alt komşunun tavanı nedeniyle sınırlıdır.",
      ],
      example: "Bir duvarı kaldırmadan önce statik kontrol yaptırmak hem güvenlik hem de apartmanla yaşanabilecek anlaşmazlıklar için en ucuz önlemdir.",
      ankara: "Taşıyıcı sisteme izinsiz müdahale yasaktır. Apartmanlarda ortak alanı veya dış cepheyi etkileyen değişiklikler için Kat Mülkiyeti Kanunu gereği kat maliklerinin onayı gerekebilir.",
    },
    en: {
      step: "Renovation",
      title: "What can a renovation touch, and what not?",
      short: "Partition walls can often change; columns, beams and shear walls are the skeleton and are never cut.",
      simple: "Think of the building as a person: columns and beams are the bones, partition walls are the clothes. Clothes can change, bones cannot. Bathrooms and kitchens are tied to the veins, the pipework.",
      legend: [
        "Partition wall: can be removed or moved once it is confirmed not to be load-bearing.",
        "Columns, beams and shear walls: load-bearing; never cut, drilled or thinned.",
        "Wet rooms and service shafts: moving a bathroom or kitchen is limited by drainage falls and the neighbour's ceiling below.",
      ],
      example: "A structural check before removing a wall is the cheapest safeguard, both for safety and against disputes with the building's other owners.",
      ankara: "Unauthorised work on the load-bearing structure is prohibited. In apartment buildings, changes affecting common areas or the façade may need the other owners' consent under the Condominium Law.",
    },
  },
};
