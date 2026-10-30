import type { Locale } from "./i18n-config";

// Project page enrichment. Every statement is derived from the project's own description, story,
// scope or status in projects.ts; nothing is added about size, budget, location or client.
// Benefits describe what the design aims to provide, never measured results.

type Pair = readonly [string, string];

export type ProjectInsightCopy = Readonly<{
  diagramAlt: string;
  /** Legend for the numbered drawing; order matches the numbers in the SVG. */
  items: readonly Pair[];
  gains: readonly Pair[];
  decisions: readonly Pair[];
  goodFor: readonly string[];
  questions: readonly string[];
}>;

export const insightLabels = {
  tr: {
    diagramEyebrow: "Projeyi bir bakışta okuyun",
    diagramNote: "Şematik anlatımdır; gerçek plan, ölçü veya yerleşimi göstermez.",
    gainsEyebrow: "Bu projenin kazandırdıkları",
    gainsTitle: "Tasarımın sahibine sağladıkları.",
    decisionsEyebrow: "Kararlar ve nedenleri",
    goodFor: "Bu proje kimlere fikir verir",
    questions: "Benzer bir proje için ilk görüşmeye getirin",
  },
  en: {
    diagramEyebrow: "Read the project at a glance",
    diagramNote: "A schematic explanation; it does not show the real plan, dimensions or layout.",
    gainsEyebrow: "What this project delivers",
    gainsTitle: "What the design gives its owner.",
    decisionsEyebrow: "Decisions and reasons",
    goodFor: "Who this project can inspire",
    questions: "For a similar project, bring to the first meeting",
  },
} satisfies Record<Locale, Record<string, string>>;

export const projectInsights: Record<string, Record<Locale, ProjectInsightCopy>> = {
  "villa-donusumu": {
    tr: {
      diagramAlt: "Villa Dönüşümü şeması: korunan yapı, yeniden oranlanan açıklıklar, beyaz yüzey ve ahşap detaylar, bahçe",
      items: [["Korunan yapı", "Yıpranmış villa yıkılmadı; mevcut yapı korunarak dönüştürüldü."], ["Yeniden ele alınan açıklıklar", "Cephenin oranları ve pencere açıklıkları yeniden düzenlendi."], ["Sınırlı malzeme paleti", "Sade beyaz yüzeyler, koyu doğramalar ve sıcak ahşap detaylar."], ["Bahçeyle ilişki", "Yeni cephe, yapıyı bulunduğu bahçeyle yeniden konuşturuyor."]],
      gains: [["Yıkmadan yenilenen bir ev", "Mevcut yapıyı korumak, yıkıp sıfırdan inşa etmeye göre farklı bir maliyet ve süre dengesi sunar."], ["Çağdaş ve bakımlı bir görünüm", "Yeniden oranlanan cephe, yapıya bugünün diliyle bir kimlik kazandırdı; bakımlı bir cephe binanın algılanan değerini destekler, piyasa etkisi konum ve koşullara bağlıdır."], ["Bütçenin en çok fark yarattığı yer", "Neyin korunacağı, neyin değişeceği ve bütçenin nereye gideceği baştan karara bağlandı."]],
      decisions: [["Yıkmak yerine dönüştürmek", "Yıllar içinde yıpranmış yapı korundu ve modern, işlevsel bir eve dönüştürüldü."], ["Cepheyi yeniden oranlamak", "Oranlar ve açıklıklar, yapıya çağdaş bir kimlik vermek için yeniden ele alındı."], ["Üç malzeme, tek dil", "Beyaz yüzey, koyu doğrama ve ahşap; az sayıda malzemeyle bütüncül bir görünüm."]],
      goodFor: ["Eski evini yıkmadan yenilemek isteyenler", "Cephesi eskimiş müstakil ev ve villa sahipleri", "Bütçesini önceliklendirmek isteyenler"],
      questions: ["Mevcut yapı hakkında elinizdeki belgeler ve fotoğraflar", "Kesinlikle korumak istediğiniz bölümler", "Bütçenizin önce harcanmasını istediğiniz alan"],
    },
    en: {
      diagramAlt: "Villa Transformation diagram: kept structure, reproportioned openings, white surfaces and timber details, garden",
      items: [["Kept structure", "The worn villa was not demolished; its existing structure was kept and transformed."], ["Reconsidered openings", "The façade's proportions and window openings were rearranged."], ["A limited palette", "Quiet white surfaces, dark frames and warm timber details."], ["Relationship to the garden", "The new façade makes the building speak to its garden again."]],
      gains: [["A home renewed without demolition", "Keeping the existing structure offers a different cost and time balance from demolishing and rebuilding."], ["A contemporary, well-kept look", "The reproportioned façade gives the building a present-day identity; a well-kept façade supports perceived value, while market effect depends on location and conditions."], ["Budget where it counts", "What to keep, what to replace and where the budget would go were decided from the start."]],
      decisions: [["Transform rather than demolish", "The building, worn over the years, was kept and turned into a modern, functional home."], ["Reproportion the façade", "Proportions and openings were reconsidered to give the building a contemporary identity."], ["Three materials, one language", "White surfaces, dark frames and timber: a coherent look with few materials."]],
      goodFor: ["Owners renewing an old house without demolition", "Owners of houses and villas with dated façades", "Clients who need to prioritise their budget"],
      questions: ["Documents and photos of the existing building", "Parts you definitely want to keep", "Where you want the budget spent first"],
    },
  },
  "evox-gym-center": {
    tr: {
      diagramAlt: "Evox Gym Center şeması: antrenman salonu, boks alanı, pilates stüdyosu, soyunma odaları, lounge ve lineer ışık",
      items: [["Antrenman salonu", "Ana ekipman alanı."], ["Boks alanı", "Kendi grafik diliyle ayrışan bölge."], ["Pilates stüdyosu", "Daha sakin kullanım için ayrı alan."], ["Soyunma odaları", "Kullanıcıların hazırlandığı alan."], ["Lounge ve karşılama", "Dinlenme ve karşılama alanı."]],
      gains: [["Farklı kullanıcılar, tek atmosfer", "Farklı ihtiyaçları olan alanlar ortak ışık ve malzeme diliyle tek bir mekân gibi okunur."], ["Mekânda görünen bir marka", "Her alanın kendi grafik dili, markanın sesini mekânın her köşesine taşır."], ["Enerjik ama rafine bir his", "Koyu yüzeyler, lineer LED ve sıcak ahşap; yüksek enerjiyi özenli bir atmosferle dengeler."]],
      decisions: [["Koyu yüzeyler ve lineer LED", "Yüksek enerjili ama rafine bir atmosfer kurmak için."], ["Sıcak ahşap dokular", "Koyu paleti dengeleyip malzemeye sıcaklık katmak için."], ["Alanlara özel grafik dil", "Markanın sesini her bölgede taşımak için."]],
      goodFor: ["Spor salonu veya stüdyo açacaklar", "Mevcut salonunu yenileyecek işletmeler", "Çok alanlı ticari mekân planlayanlar"],
      questions: ["Ekipman listeniz", "Kullanıcı gruplarınız ve yoğun saatler", "Ayrı ve ortak olması gereken alanlar"],
    },
    en: {
      diagramAlt: "Evox Gym Center diagram: training floor, boxing area, pilates studio, locker rooms, lounge and linear light",
      items: [["Training floor", "The main equipment area."], ["Boxing area", "A zone set apart by its own graphic language."], ["Pilates studio", "A separate space for calmer use."], ["Locker rooms", "Where members get ready."], ["Lounge and reception", "Rest and welcome area."]],
      gains: [["Different users, one atmosphere", "Areas with different needs read as one place through shared light and materials."], ["A brand visible in the space", "Each zone's graphic language carries the brand's voice throughout."], ["Energetic yet refined", "Dark surfaces, linear LED and warm timber balance high energy with a considered atmosphere."]],
      decisions: [["Dark surfaces and linear LED", "To create a high-energy yet refined atmosphere."], ["Warm timber textures", "To balance the dark palette and add warmth."], ["A graphic language per zone", "To carry the brand's voice in every area."]],
      goodFor: ["Founders opening a gym or studio", "Businesses renewing an existing club", "Anyone planning a multi-zone commercial space"],
      questions: ["Your equipment list", "User groups and peak hours", "Which areas must be separate and which shared"],
    },
  },
  "butik-kafe": {
    tr: {
      diagramAlt: "Kedili Butik Kafe şeması: meşe, bej, lacivert ve pirinç malzeme paleti ile maskot ve ürün koleksiyonu",
      items: [["Sıcak meşe", "Paletin ana, sıcak yüzeyi."], ["Yumuşak bej", "Sakin, dengeleyici ton."], ["Derin lacivert", "Karakter veren koyu vurgu."], ["Fırçalanmış pirinç", "Detaylarda parıltı."], ["Maskot ve ürünler", "Van kedisinden ilham alan maskot ve ürün koleksiyonu."]],
      gains: [["Akılda kalan bir kimlik", "Mekân ve maskot aynı hikâyeyi anlattığında müşterinin hatırlayacağı bir karakter oluşur."], ["Tutarlı bir marka deneyimi", "İç mekân, maskot ve ürünler aynı renk ve malzeme dilini paylaşır."], ["Markayı mekânın dışına taşıyan ürünler", "Ürün koleksiyonu, kafenin kimliğini masadan ayrıldıktan sonra da görünür kılabilir."]],
      decisions: [["Dört malzemeli palet", "Meşe, bej, lacivert ve pirinç ile tutarlı bir mekân dili."], ["Van kedisinden ilham", "Markaya yerel ve sevimli bir karakter kazandırmak için."], ["Mekân ile ürünü birlikte tasarlamak", "Kafe ve marka aynı anlatının parçası olsun diye."]],
      goodFor: ["Kafe veya pastane açacaklar", "Markasına karakter arayan işletmeler", "Mekân ile ürünü birlikte düşünmek isteyenler"],
      questions: ["Müşterinin aklında ne kalmasını istediğiniz", "Oturma, servis, ekipman ve depolama listeniz", "Varsa marka renkleri ve logo"],
    },
    en: {
      diagramAlt: "Cat-themed Boutique Café diagram: oak, beige, navy and brass palette with mascot and merchandise",
      items: [["Warm oak", "The palette's main, warm surface."], ["Soft beige", "A calm, balancing tone."], ["Deep navy", "A dark accent with character."], ["Brushed brass", "A glint in the details."], ["Mascot and merchandise", "A mascot inspired by the Van cat and a merchandise collection."]],
      gains: [["A memorable identity", "When space and mascot tell one story, customers remember a character."], ["A consistent brand experience", "Interior, mascot and products share one colour and material language."], ["Products that carry the brand beyond the room", "A merchandise collection can keep the café visible after guests leave."]],
      decisions: [["A four-material palette", "Oak, beige, navy and brass for a consistent language."], ["Inspired by the Van cat", "To give the brand a local, endearing character."], ["Designing space and products together", "So café and brand are part of one narrative."]],
      goodFor: ["Founders opening a café or patisserie", "Businesses looking for brand character", "Anyone wanting space and products designed together"],
      questions: ["What customers should remember", "Your seating, service, equipment and storage list", "Existing brand colours and logo"],
    },
  },
  "modern-villa": {
    tr: {
      diagramAlt: "Modern Villa şeması: iki beşik çatılı kütle, geniş cam yüzeyler, havuz terası ve sıcak iç aydınlatma",
      items: [["İki beşik çatılı kütle", "Konut iki ayrı kütleden oluşur."], ["Geniş cam yüzeyler", "Kütleler bahçeye ve terasa camla açılır."], ["Havuz terası", "Yaşam dışarıya, havuz kenarına uzanır."], ["Sıcak iç aydınlatma", "Akşam ışığında yapı peyzajın parçası olur."]],
      gains: [["İçeriyle dışarı arasında bütünlük", "Geniş camlar, bahçeyi ve havuz terasını evin bir parçası gibi hissettirir."], ["Günün her saatinde etkileyici bir görünüm", "Sade beyaz cephe ve sıcak iç ışık, yapıyı akşam saatlerinde de peyzajın parçası yapar."], ["Zamansız bir mimari dil", "Sade cephe ve koyu doğramalar, kısa ömürlü modalardan uzak bir görünüm hedefler."]],
      decisions: [["İki kütleli kurgu", "Konut, bahçeye ve havuz terasına açılan iki beşik çatılı kütleden oluşuyor."], ["Geniş cam yüzeyler", "İç mekânı bahçe ve terasla bağlamak için."], ["Sade beyaz cephe, koyu doğrama", "Yapıyı peyzajın bir parçası haline getirmek için."]],
      goodFor: ["Villa veya müstakil ev yaptıracaklar", "Havuzlu bahçe planlayanlar", "Sade ve zamansız bir mimari arayanlar"],
      questions: ["Arsanın yönü ve manzarası", "Bahçe ve havuzla nasıl bir ilişki istediğiniz", "Evde en çok vakit geçirdiğiniz saatler"],
    },
    en: {
      diagramAlt: "Modern Villa diagram: two gabled volumes, generous glazing, pool terrace and warm interior light",
      items: [["Two gabled volumes", "The house is made of two volumes."], ["Generous glazing", "The volumes open to garden and terrace through glass."], ["Pool terrace", "Life extends outdoors to the pool."], ["Warm interior light", "In the evening light the building becomes part of the landscape."]],
      gains: [["Inside and outside as one", "Large glazing makes the garden and pool terrace feel part of the home."], ["Striking at every hour", "A quiet white façade and warm interior light keep the building part of the landscape into the evening."], ["A timeless architectural language", "A plain façade and dark frames aim for a look beyond short-lived fashion."]],
      decisions: [["Two volumes", "The house consists of two gabled volumes opening to the garden and pool terrace."], ["Generous glazing", "To connect the interior to the garden and terrace."], ["Plain white façade, dark frames", "To make the building part of the landscape."]],
      goodFor: ["Clients building a villa or house", "Anyone planning a garden with a pool", "Clients seeking a calm, timeless architecture"],
      questions: ["The plot's orientation and view", "How you want to relate to garden and pool", "The hours you spend most at home"],
    },
  },
  "ofis-yenileme": {
    tr: {
      diagramAlt: "Villadan ofise dönüşüm şeması: yeni doğramalar, odanın merkezine ulaşan gün ışığı, cam bölme, entegre dolaplar ve lineer aydınlatma",
      items: [["Yeni doğramalar", "Balkona açılan yeni doğramalar."], ["Merkeze ulaşan gün ışığı", "Işık artık odanın ortasına kadar giriyor."], ["Siyah çerçeveli cam bölmeler", "Alanları ayırırken ışığı kesmiyor."], ["Entegre dolap sistemleri", "Depolama duvarın parçası."], ["Açık gri zemin ve lineer ışık", "Ferah ve sakin bir çalışma zemini."]],
      gains: [["Mevcut binaya yeni bir kullanım", "30 yıllık bir villa, yeni bir yapı yerine dönüştürülerek ofis oldu."], ["Daha ferah ve aydınlık çalışma alanları", "Karanlık ve dağınık odalar, gün ışığı alan sakin çalışma alanlarına dönüştü."], ["Daha düzenli ve profesyonel bir ilk izlenim", "Entegre depolama ve cam bölmeler, ziyaretçiye düzenli bir çalışma ortamı gösterir."]],
      decisions: [["Balkona açılan yeni doğramalar", "Gün ışığını mekânın merkezine taşımak için."], ["Cam bölmeler", "Alanları ayırırken ışığı ve ferahlığı korumak için."], ["Entegre dolaplar", "Dağınıklığı gidermek ve sakin bir görünüm sağlamak için."]],
      goodFor: ["Evini veya villasını ofise dönüştürecekler", "Karanlık ofisini yenileyecek ekipler", "Kullanım değişikliği düşünen mülk sahipleri"],
      questions: ["Yeni kullanımın ihtiyaçları: çalışma, görüşme, depolama, karşılama", "Korunabilecek ve değişmesi gereken alanlar", "Mevcut yapının onaylı projeleri"],
    },
    en: {
      diagramAlt: "Villa-to-office diagram: new frames, daylight reaching the centre, glass partitions, integrated storage and linear lighting",
      items: [["New frames", "New frames opening onto the balcony."], ["Daylight to the centre", "Light now reaches the middle of the room."], ["Black-framed glass partitions", "They separate areas without blocking light."], ["Integrated storage", "Storage built into the wall."], ["Light grey floor and linear light", "A calm, airy working ground."]],
      gains: [["A new use for an existing building", "A 30-year-old villa became an office by conversion rather than new construction."], ["Brighter, airier workspaces", "Dim, cluttered rooms became calm workspaces with daylight."], ["A tidier, more professional first impression", "Integrated storage and glass partitions show visitors an orderly workplace."]],
      decisions: [["New balcony frames", "To bring daylight to the centre of the space."], ["Glass partitions", "To separate areas while keeping light and openness."], ["Integrated storage", "To remove clutter and give a calm look."]],
      goodFor: ["Owners converting a house or villa into an office", "Teams renewing a dim office", "Owners considering a change of use"],
      questions: ["Needs of the new use: work, meetings, storage, reception", "Areas worth keeping and areas that must change", "Approved drawings of the existing building"],
    },
  },
  "konut-uygulama": {
    tr: {
      diagramAlt: "Konut uygulaması şeması: gizli kasa kapılar, cam korkuluklu merdiven, ahşap kaplama ve tavana gömülü lineer aydınlatma",
      items: [["Gizli kasa kapılar", "Kapılar duvar yüzeyiyle aynı hizada."], ["Cam korkuluklu merdiven", "Korkuluk görsel olarak geri planda kalır."], ["Ahşap kaplama paneller", "Sıcak ve dayanıklı yüzey."], ["Tavana gömülü lineer aydınlatma", "Armatür yerine bir ışık çizgisi."]],
      gains: [["Tamamlanmış, gerçek bir sonuç", "Giriş holü ve merdiven çizimden sahaya taşınarak uygulandı."], ["Sade ve bütüncül bir iç mekân", "Kapı, korkuluk, kaplama ve ışık aynı detay diliyle çözüldü."], ["Dayanıklılık", "Seçilen yüzeyler ve detaylar sade, bütüncül ve dayanıklı bir iç mekân hedefiyle uygulandı."]],
      decisions: [["Gizli kasa kapı", "Kapıların duvarla bütünleşip holü sade göstermesi için."], ["Cam korkuluk", "Merdivenin görsel olarak hafif kalması için."], ["Gömme lineer aydınlatma", "Tavanı sade bırakıp ışığı bir çizgi olarak kullanmak için."]],
      goodFor: ["İç mekân uygulaması yaptıracaklar", "Detay kalitesini önemseyenler", "Tasarımın sahada korunmasını isteyenler"],
      questions: ["Sizin için önemli detaylar", "Uygulamayı kimin yürüteceği", "Proje yönetimi ve şantiye takibi beklentiniz"],
    },
    en: {
      diagramAlt: "Residential fit-out diagram: flush concealed doors, glass-balustrade stair, timber cladding and recessed linear lighting",
      items: [["Flush concealed doors", "Doors sit flush with the wall."], ["Glass-balustrade stair", "The balustrade stays visually in the background."], ["Timber-clad panels", "A warm, durable surface."], ["Recessed linear lighting", "A line of light instead of fittings."]],
      gains: [["A finished, real result", "The entrance hall and stair were taken from drawing to site and built."], ["A calm, coherent interior", "Doors, balustrade, cladding and light share one detail language."], ["Durability", "Surfaces and details were built for a quiet, coherent and durable interior."]],
      decisions: [["Flush concealed doors", "So doors merge with the wall and the hall looks calm."], ["Glass balustrade", "So the stair stays visually light."], ["Recessed linear lighting", "To keep the ceiling plain and use light as a line."]],
      goodFor: ["Clients commissioning an interior fit-out", "Anyone who values detail quality", "Clients who want the design preserved on site"],
      questions: ["Details that matter to you", "Who will build it", "Your expectations for project management and site follow-up"],
    },
  },
  "konut-ic-mekan": {
    tr: {
      diagramAlt: "Konut iç mekân şeması: salon, yemek alanı, yatak odası, gizli LED aydınlatma, ahşap ve mermer yüzeyler",
      items: [["Salon", "TV duvarıyla birlikte tasarlanan yaşam alanı."], ["Yemek alanı", "Salonla birlikte düşünülen alan."], ["Yatak odası", "Aynı malzeme diliyle tasarlanan dinlenme alanı."], ["Gizli LED aydınlatma", "Işık kaynağı görünmeden atmosfer."], ["Ahşap ve mermer yüzeyler", "Sıcak ve dingin bir malzeme dengesi."]],
      gains: [["Sıcak ve dingin bir yaşam ortamı", "Ahşap, mermer ve yumuşak dokulu mobilyalar sakin bir ev hissi kurar."], ["Bütüncül bir ev", "Salon, yemek alanı ve yatak odası aynı malzeme ve ışık diliyle tasarlandı."], ["Uygulamadan önce görmek", "Tasarım 3D animasyonla da sunuldu; kararlar uygulamadan önce görüldü."]],
      decisions: [["Gizli LED aydınlatma", "Işığı atmosfer olarak kullanmak için."], ["Ahşap ve mermer bir arada", "Sıcaklık ile zarafeti dengelemek için."], ["Mobilya tasarımı", "Mobilyanın mekânla aynı dili konuşması için."]],
      goodFor: ["Yeni dairesini baştan kuracaklar", "Salon ve yatak odasını yenileyecekler", "Sakin ve sıcak bir ev isteyenler"],
      questions: ["Evinizin ölçüleri veya planı", "Nasıl yaşadığınızı anlatan kısa bir not", "Beğendiğiniz görseller ve nedenleri"],
    },
    en: {
      diagramAlt: "Residential interior diagram: living room, dining area, bedroom, concealed LED lighting, timber and marble surfaces",
      items: [["Living room", "Designed together with the media wall."], ["Dining area", "Considered together with the living room."], ["Bedroom", "Designed in the same material language."], ["Concealed LED lighting", "Atmosphere without visible light sources."], ["Timber and marble surfaces", "A warm, serene material balance."]],
      gains: [["A warm, serene home", "Timber, marble and soft-textured furniture create a calm feeling."], ["A coherent home", "Living room, dining area and bedroom share one material and lighting language."], ["See it before building", "The design was also presented as a 3D animation, so decisions were seen first."]],
      decisions: [["Concealed LED lighting", "To use light as atmosphere."], ["Timber and marble together", "To balance warmth and elegance."], ["Furniture design", "So the furniture speaks the same language as the room."]],
      goodFor: ["New flat owners setting up their home", "Owners renewing living room and bedroom", "Anyone wanting a calm, warm home"],
      questions: ["Your home's dimensions or plan", "A short note on how you live", "Images you like and why"],
    },
  },
  "tek-katli-ev": {
    tr: {
      diagramAlt: "Tek katlı modern ev şeması: tek seviyede yaşam, kırma çatı, bahçeye açılan camlar, ahşap giriş ve doğal taş yollar",
      items: [["Tek katta yaşam", "Günlük yaşamın tamamı tek seviyede çözülür."], ["Kırma çatı", "Yapının sakin silueti."], ["Bahçeye açılan geniş camlar", "Odalar bahçeyle bağlantılı."], ["Ahşap kaplamalı giriş", "Sıcak bir karşılama."], ["Doğal taş yürüyüş yolları", "Bahçede yön veren yollar."]],
      gains: [["Merdivensiz bir günlük yaşam", "Tüm yaşamın tek katta çözülmesi, ev içindeki dolaşımı kolaylaştırır."], ["Bahçeyle aynı seviyede yaşamak", "Geniş cam açıklıklar odaları doğrudan bahçeye bağlar."], ["Sıcak ama sade bir karakter", "Ahşap giriş, beyaz cephe ve doğal taş, abartısız bir sıcaklık kurar."]],
      decisions: [["Tek seviyeli plan", "Günlük yaşamı tek katta çözmek için."], ["Geniş cam açıklıklar", "İç mekânı bahçeye bağlamak için."], ["Ahşap, beyaz cephe ve doğal taş", "Sıcak ama sade bir karakter için."]],
      goodFor: ["Tek katlı ev yaptırmak isteyenler", "Bahçeyle iç içe yaşamak isteyenler", "Merdivensiz bir ev arayan aileler"],
      questions: ["Arsanızın büyüklüğü ve imar durumu", "Odalarınızın bahçeyle ilişkisi", "Ailenizin şimdiki ve gelecekteki ihtiyaçları"],
    },
    en: {
      diagramAlt: "Single-storey modern house diagram: life on one level, hipped roof, glazing to the garden, timber entrance and stone paths",
      items: [["Life on one level", "All of daily life happens on one floor."], ["Hipped roof", "The building's calm silhouette."], ["Large glazing to the garden", "Rooms connect to the garden."], ["Timber-clad entrance", "A warm welcome."], ["Natural stone paths", "Paths that guide through the garden."]],
      gains: [["Daily life without stairs", "Living on one level makes moving around the home easier."], ["Living level with the garden", "Large openings connect rooms directly to the garden."], ["Warm yet restrained", "Timber entrance, white façade and natural stone create understated warmth."]],
      decisions: [["A single-level plan", "To resolve daily life on one floor."], ["Large glazed openings", "To connect the interior to the garden."], ["Timber, white façade and stone", "For a warm yet restrained character."]],
      goodFor: ["Clients wanting a single-storey house", "Anyone wanting to live close to the garden", "Families looking for a home without stairs"],
      questions: ["Your plot's size and zoning status", "How rooms should relate to the garden", "Your family's needs now and in future"],
    },
  },
  "konut-projeleri": {
    tr: {
      diagramAlt: "Konut projeleri şeması: çok katlı bloklar, geniş balkonlar, her daireye gün ışığı ve yeşil ortak alanlar",
      items: [["Çok katlı bloklar", "Apartman ve site ölçeğinde konut yapıları."], ["Geniş balkonlar", "Her dairenin dış mekânı."], ["Her daireye gün ışığı ve manzara", "Tasarımın çıkış noktası."], ["Yeşil, yürünebilir ortak alanlar", "Bina çevresinde ortak yaşam."]],
      gains: [["Daireler arasında daha dengeli nitelik", "Her dairenin gün ışığı ve manzara payını gözetmek, nitelik farkını azaltmayı amaçlar."], ["Ortak alanlarla güçlenen bina", "Yeşil, yürünebilir çevre, binayı yalnızca daireleriyle değil çevresiyle de değerli kılar."], ["Akşam ışığında sıcak cepheler", "Cephe tasarımı, binaya şehirde fark edilen bir kimlik kazandırır."]],
      decisions: [["Gün ışığı ve manzara önceliği", "Her dairenin pay alması için."], ["Geniş balkonlar", "Dairelere kullanılabilir dış mekân kazandırmak için."], ["Vaziyet planı ve peyzaj", "Bina çevresini yaşanan bir ortak alana dönüştürmek için."]],
      goodFor: ["Apartman yaptıracak arsa sahipleri", "Konut projesi geliştiren müteahhitler", "Site ölçeğinde proje planlayan yatırımcılar"],
      questions: ["Parselin imar durumu ve net alanı", "Hedeflediğiniz daire tipleri", "Otopark ve ortak alan beklentiniz"],
    },
    en: {
      diagramAlt: "Residential buildings diagram: multi-storey blocks, generous balconies, daylight to every flat and green shared spaces",
      items: [["Multi-storey blocks", "Housing at apartment and complex scale."], ["Generous balconies", "Each flat's outdoor space."], ["Daylight and view for every flat", "The starting point of the design."], ["Green, walkable shared spaces", "Shared life around the buildings."]],
      gains: [["More even quality between flats", "Considering each flat's share of daylight and view aims to reduce quality differences."], ["A building strengthened by its shared spaces", "Green, walkable surroundings add value beyond the flats themselves."], ["Façades that glow in the evening", "The façade design gives the building a recognisable identity in the city."]],
      decisions: [["Daylight and view first", "So every flat gets its share."], ["Generous balconies", "To give flats usable outdoor space."], ["Site plan and landscape", "To turn the surroundings into lived-in shared space."]],
      goodFor: ["Landowners building an apartment block", "Contractors developing housing", "Investors planning a housing complex"],
      questions: ["The plot's zoning status and net area", "Your target flat types", "Your parking and shared space expectations"],
    },
  },
  "villa-ic-mekan": {
    tr: {
      diagramAlt: "Villa iç mekânı şeması: taş kaplı şömine duvarı, mermer adalı mutfak, yere kadar inen pencereler, ahşap tonlar",
      items: [["Taş kaplı şömine duvarı", "Salonun odak noktası."], ["Mermer adalı mutfak", "Hazırlık ve buluşma alanı."], ["Yere kadar inen pencereler", "Gün ışığı ve bahçe manzarası."], ["Ahşap tonlar ve yumuşak dokular", "Huzurlu bir ev atmosferi."]],
      gains: [["Huzurlu bir ev atmosferi", "Doğal taş, açık meşe ve yumuşak dokular sıcak ve sakin bir ortam kurar."], ["Bahçeye açılan aydınlık odalar", "Yere kadar inen pencereler gün ışığını ve manzarayı içeri alır."], ["Güçlü odak noktaları", "Şömine duvarı ve mermer ada, mekânlara karakter veren merkezler oluşturur."]],
      decisions: [["Taş kaplı şömine duvarı", "Salona sıcak bir merkez kazandırmak için."], ["Mermer ada", "Mutfağı hazırlık ve buluşma alanı yapmak için."], ["Ahşap tonlarla dengelemek", "Taş ve mermeri sıcak dokularla yumuşatmak için."]],
      goodFor: ["Villa iç mekânını yenileyecekler", "Açık mutfak ve ada düşünenler", "Doğal malzeme seven ev sahipleri"],
      questions: ["Salon, mutfak ve yatak odası öncelikleriniz", "Gün ışığı ve manzara yönleri", "Sevdiğiniz malzemeler"],
    },
    en: {
      diagramAlt: "Villa interiors diagram: stone-clad fireplace wall, marble kitchen island, floor-to-ceiling windows, timber tones",
      items: [["Stone-clad fireplace wall", "The living room's focal point."], ["Marble kitchen island", "A place to prepare and gather."], ["Floor-to-ceiling windows", "Daylight and garden views."], ["Timber tones and soft textures", "A calm home atmosphere."]],
      gains: [["A calm home atmosphere", "Natural stone, light oak and soft textures create a warm, serene setting."], ["Bright rooms opening to the garden", "Floor-to-ceiling windows bring in daylight and views."], ["Strong focal points", "The fireplace wall and marble island give each space a centre."]],
      decisions: [["Stone-clad fireplace wall", "To give the living room a warm centre."], ["Marble island", "To make the kitchen a place to prepare and gather."], ["Balancing with timber", "To soften stone and marble with warm textures."]],
      goodFor: ["Owners renewing villa interiors", "Anyone considering an open kitchen with an island", "Homeowners who love natural materials"],
      questions: ["Your priorities for living room, kitchen and bedroom", "Directions of daylight and views", "Materials you love"],
    },
  },
  pastane: {
    tr: {
      diagramAlt: "Pastane konsepti şeması: sokağa açılan cam cephe, ışıklı ahşap vitrin, mermer kasa bankosu ve raylı spotlar",
      items: [["Sokağa açılan cam cephe", "İçerisi sokaktan görünür."], ["Işıklı, ahşap kaplı vitrin", "Ürün sahnenin merkezinde."], ["Mermer kasa bankosu", "Ödeme ve karşılama noktası."], ["Raylı spot aydınlatma", "Işık ürüne yönlendirilir."]],
      gains: [["Ürünü sahnenin merkezine almak", "Işıklı vitrin tezgâhı, ürünlerin mekânın en görünür öğesi olmasını sağlar."], ["Sokaktan görünürlük", "Cam cephe, içerideki vitrini ve atmosferi yoldan geçenlere gösterir."], ["Davetkâr bir satış alanı", "Ahşap, mermer ve yönlendirilmiş ışık sıcak bir karşılama kurar."]],
      decisions: [["Işıklı vitrin tezgâhı", "Ürünleri öne çıkarmak için."], ["Raylı spotlar", "Işığı esnek biçimde ürüne yönlendirmek için."], ["Cam cephe", "Sokakla görsel bağ kurmak için."]],
      goodFor: ["Pastane, fırın veya butik dükkân açacaklar", "Vitrinini yenilemek isteyen işletmeler", "Ürününü öne çıkarmak isteyen markalar"],
      questions: ["Ürün çeşitleri ve sergileme ihtiyacı", "Kasa ve paketleme düzeni", "Mekânın ölçüleri ve cephe durumu"],
    },
    en: {
      diagramAlt: "Patisserie concept diagram: glass shopfront, illuminated timber display, marble till counter and track spotlights",
      items: [["Glass shopfront", "The interior is visible from the street."], ["Illuminated, timber-clad display", "The product at centre stage."], ["Marble till counter", "Payment and welcome point."], ["Track spotlights", "Light directed onto the product."]],
      gains: [["The product at centre stage", "The illuminated display counter makes the products the most visible element."], ["Visibility from the street", "The glass shopfront shows the display and atmosphere to passers-by."], ["An inviting sales space", "Timber, marble and directed light create a warm welcome."]],
      decisions: [["Illuminated display counter", "To showcase the products."], ["Track spotlights", "To direct light flexibly onto products."], ["Glass shopfront", "To connect visually with the street."]],
      goodFor: ["Founders opening a patisserie, bakery or boutique", "Businesses renewing their display", "Brands that want their product to stand out"],
      questions: ["Product range and display needs", "Till and packing arrangement", "The unit's dimensions and frontage"],
    },
  },
  "yonetici-ofisi": {
    tr: {
      diagramAlt: "Yönetici odası şeması: koyu duvarlar, masif çalışma masası, Chesterfield deri koltuklar ve sıcak noktasal aydınlatma",
      items: [["Koyu duvarlar", "Ağırbaşlı bir zemin."], ["Masif çalışma masası", "Odanın merkezi."], ["Chesterfield deri koltuklar", "Görüşme için karşılıklı oturma."], ["Sıcak noktasal aydınlatma", "Samimi bir atmosfer."]],
      gains: [["Güven veren bir görüşme ortamı", "Ağırbaşlı ama samimi atmosfer, görüşmelere uygun bir zemin hazırlar."], ["Kurumsal temsil", "Oda, kurumun karakterini ziyaretçiye ilk bakışta anlatır."], ["Karakterli ve kalıcı bir dil", "Klasik dokunuşlar, kısa ömürlü modalardan bağımsız bir görünüm sağlar."]],
      decisions: [["Koyu duvarlar", "Ağırbaşlı bir atmosfer için."], ["Chesterfield koltuklar", "Görüşmeye davet eden, karakterli bir oturma için."], ["Sıcak noktasal ışık", "Ortamı samimi kılmak için."]],
      goodFor: ["Yönetici odası düzenleyecek şirketler", "Avukat, danışman ve muayenehane gibi görüşme odaları", "Kurumsal kimliğini mekâna taşımak isteyenler"],
      questions: ["Odada yapılan görüşmelerin türü ve kişi sayısı", "Kurumsal renkler ve kimlik", "Mevcut mobilyalardan korunacak olanlar"],
    },
    en: {
      diagramAlt: "Executive study diagram: dark walls, solid desk, Chesterfield leather armchairs and warm accent lighting",
      items: [["Dark walls", "A dignified backdrop."], ["Solid desk", "The centre of the room."], ["Chesterfield leather armchairs", "Facing seats for meetings."], ["Warm accent lighting", "A welcoming atmosphere."]],
      gains: [["A meeting space that builds trust", "A dignified yet welcoming atmosphere sets the right ground for conversations."], ["Corporate representation", "The room conveys the organisation's character at first sight."], ["A lasting language with character", "Classic touches give a look independent of short-lived fashions."]],
      decisions: [["Dark walls", "For a dignified atmosphere."], ["Chesterfield armchairs", "For inviting seating with character."], ["Warm accent light", "To make the room welcoming."]],
      goodFor: ["Companies furnishing an executive office", "Meeting rooms for lawyers, consultants and practices", "Anyone bringing a corporate identity into a room"],
      questions: ["The type of meetings and number of people", "Corporate colours and identity", "Existing furniture worth keeping"],
    },
  },
};

export const projectDiagram = (slug: string) => `/media/diagrams/projects/${slug}.svg`;
