import type { Locale } from "@/lib/i18n-config";

export type Localized = Record<Locale, string>;

export type ProjectCategory = "architecture" | "interior" | "renovation" | "build";

export interface ProjectImage {
  src: string;
  width: number;
  height: number;
  alt: Localized;
}

export interface ProjectVideo {
  src: string;
  poster: string;
  width: number;
  height: number;
  uploadDate: string;
}

export interface Project {
  slug: string;
  category: ProjectCategory;
  featured: boolean;
  title: Localized;
  tagline: Localized;
  description: Localized;
  scope: Localized[];
  cover: ProjectImage;
  gallery: ProjectImage[];
  video?: ProjectVideo;
  beforeAfter?: { before: ProjectImage; after: ProjectImage };
  status?: Localized;
  story?: Localized[];
  post?: string;
}

const img = (src: string, width: number, height: number, tr: string, en: string): ProjectImage => ({
  src,
  width,
  height,
  alt: { tr, en },
});

const P = "/media/projects";

export const projects: Project[] = [
  {
    slug: "villa-donusumu",
    category: "renovation",
    featured: true,
    title: { tr: "Villa Dönüşümü", en: "Villa Transformation" },
    tagline: {
      tr: "Villanızı sadece yenilemiyoruz, ona yeni bir yaşam hikâyesi yazıyoruz.",
      en: "We don't just renovate a villa — we write it a new life story.",
    },
    description: {
      tr: "Mevcut iki katlı bir konutun cephesi, oranları ve açıklıkları yeniden ele alındı. Sade beyaz yüzeyler, koyu doğramalar ve sıcak ahşap detaylar, yapıyı bulunduğu bahçeyle yeniden konuşan çağdaş bir kimliğe taşıdı.",
      en: "The façade, proportions and openings of an existing two-storey house were reconsidered. Quiet white surfaces, dark frames and warm timber details give the building a contemporary identity that speaks to its garden again.",
    },
    scope: [
      { tr: "Mimari Tasarım", en: "Architectural Design" },
      { tr: "Cephe Yenileme", en: "Façade Renovation" },
      { tr: "3D Görselleştirme", en: "3D Visualisation" },
    ],
    cover: img(`${P}/villa-donusumu/after.jpg`, 1280, 716, "Yenilenmiş villa cephesi", "Renovated villa façade"),
    gallery: [
      img(`${P}/villa-donusumu/during.jpg`, 1280, 716, "Dönüşüm sürecinde villa", "The villa mid-transformation"),
    ],
    video: {
      src: "/media/video/villa-transformation.mp4",
      poster: "/media/video/villa-transformation.jpg",
      width: 1280,
      height: 716,
      uploadDate: "2026-10-27T22:07:11+03:00",
    },
    beforeAfter: {
      before: img(`${P}/villa-donusumu/before.jpg`, 1280, 716, "Villanın önceki hali", "The villa before"),
      after: img(`${P}/villa-donusumu/after.jpg`, 1280, 716, "Villanın yeni hali", "The villa after"),
    },
    status: {
      tr: "Uygulama büyük ölçüde tamamlandı, peyzaj sürüyor",
      en: "Work nearly complete, landscaping under way",
    },
    story: [
      {
        tr: "Eski bir yapıyı yıkmak kolay; doğru şekilde dönüştürmek ise ayrı bir iş. Yıllar içinde yıpranmış bu villada yıkıp yeniden yapmak yerine mevcut yapıyı koruduk ve onu modern, işlevsel bir eve dönüştürdük.",
        en: "Demolishing an old building is easy; transforming it well is another matter. Instead of tearing down this villa, worn over the years, we kept its existing structure and turned it into a modern, functional home.",
      },
      {
        tr: "Orta ölçekli bir bütçeyle başlayan iş, ilerledikçe kapsamlı bir yenilemeye dönüştü. Süreci üç karar belirledi: neyin korunacağı, neyin değişeceği ve bütçenin en çok fark yaratacağı yer.",
        en: "What began on a medium budget grew into a full renovation. Three decisions shaped it: what to keep, what to replace, and where the budget would make the biggest difference.",
      },
    ],
    post: "https://www.linkedin.com/feed/update/urn:li:activity:7510727589314015232/",
  },
  {
    slug: "evox-gym-center",
    category: "interior",
    featured: true,
    title: { tr: "Evox Gym Center", en: "Evox Gym Center" },
    tagline: {
      tr: "Enerjiyi ışıkla, karakteri malzemeyle kuran bir spor merkezi.",
      en: "A fitness club that builds energy with light and character with material.",
    },
    description: {
      tr: "Antrenman salonu, boks alanı, pilates stüdyosu, soyunma odaları ve lounge'dan oluşan bir spor merkezi. Koyu yüzeyler, lineer LED aydınlatma ve sıcak ahşap dokular; yüksek enerjili ama rafine bir atmosfer oluşturuyor. Her alan kendi grafik diliyle markanın sesini taşıyor.",
      en: "A fitness centre comprising a training floor, boxing area, pilates studio, locker rooms and lounge. Dark surfaces, linear LED lighting and warm timber textures create a high-energy yet refined atmosphere, while each zone carries the brand's voice through its own graphic language.",
    },
    scope: [
      { tr: "İç Mimari Tasarım", en: "Interior Design" },
      { tr: "Aydınlatma Konsepti", en: "Lighting Concept" },
      { tr: "3D Görselleştirme", en: "3D Visualisation" },
    ],
    cover: img(`${P}/evox-gym/training-floor.jpg`, 1439, 959, "Evox Gym antrenman salonu", "Evox Gym training floor"),
    gallery: [
      img(`${P}/evox-gym/strength-zone.jpg`, 1440, 966, "Kuvvet alanı", "Strength zone"),
      img(`${P}/evox-gym/mural.jpg`, 1439, 959, "Duvar resmi ve ekipman alanı", "Mural and equipment area"),
      img(`${P}/evox-gym/lockers.jpg`, 1279, 959, "Soyunma odası", "Locker room"),
      img(`${P}/evox-gym/boxing.jpg`, 1439, 959, "Boks alanı", "Boxing area"),
      img(`${P}/evox-gym/pilates.jpg`, 1440, 967, "Pilates stüdyosu", "Pilates studio"),
      img(`${P}/evox-gym/lounge.jpg`, 1440, 967, "Lounge ve karşılama", "Lounge and reception"),
    ],
  },
  {
    slug: "butik-kafe",
    category: "interior",
    featured: true,
    title: { tr: "Kedili Butik Kafe", en: "Cat-themed Boutique Café" },
    tagline: {
      tr: "Eskizden imzaya: mekân, malzeme ve marka tek bir hikâyede.",
      en: "From sketch to signature: space, material and brand as one story.",
    },
    description: {
      tr: "Sıcak meşe, yumuşak bej, derin lacivert ve fırçalanmış pirinçten oluşan bir malzeme paleti üzerine kurulan butik kafe konsepti. Mekân tasarımıyla birlikte, Van kedisinin eşsiz bakışlarından ilham alan bir maskot ve ürün koleksiyonu da geliştirildi.",
      en: "A boutique café concept built on a palette of warm oak, soft beige, deep navy and brushed brass. Alongside the interior, a mascot inspired by the distinctive gaze of the Van cat and a merchandise collection were developed.",
    },
    scope: [
      { tr: "İç Mimari Tasarım", en: "Interior Design" },
      { tr: "Malzeme Seçimi", en: "Material Selection" },
      { tr: "Marka & Maskot", en: "Brand & Mascot" },
    ],
    cover: img(`${P}/butik-kafe/bar.jpg`, 1440, 1018, "Kedi maskotlu butik kafenin barı", "The bar of the cat-themed boutique café"),
    gallery: [
      img(`${P}/butik-kafe/bar.jpg`, 1440, 1018, "Kedi maskotlu kafenin barı ve oturma alanı", "The cat-themed café: bar and seating"),
      img(`${P}/butik-kafe/moodboard.jpg`, 1440, 1018, "Malzeme moodboard'u", "Material moodboard"),
      img(`${P}/butik-kafe/materials.jpg`, 1440, 1440, "Malzeme numuneleri", "Material samples"),
      img(`${P}/butik-kafe/mascot-sketch.jpg`, 1440, 1018, "Eskizden maskota", "From sketch to mascot"),
      img(`${P}/butik-kafe/merchandise.jpg`, 1440, 1018, "Ürün koleksiyonu", "Merchandise collection"),
    ],
  },
  {
    slug: "modern-villa",
    category: "architecture",
    featured: true,
    title: { tr: "Modern Villa", en: "Modern Villa" },
    tagline: {
      tr: "Akşam ışığında açılan, havuza bakan iki kütle.",
      en: "Two volumes opening onto the pool in the evening light.",
    },
    description: {
      tr: "Beşik çatılı iki kütleden oluşan, geniş cam yüzeylerle bahçeye ve havuz terasına açılan bir konut. Sade beyaz cephe, koyu doğramalar ve sıcak iç aydınlatma, yapıyı günün her saatinde peyzajın bir parçası hâline getiriyor.",
      en: "A house of two gabled volumes that opens onto the garden and pool terrace through generous glazing. A restrained white façade, dark frames and warm interior light make the building part of the landscape at every hour.",
    },
    scope: [
      { tr: "Mimari Tasarım", en: "Architectural Design" },
      { tr: "Peyzaj", en: "Landscape" },
      { tr: "3D Görselleştirme", en: "3D Visualisation" },
    ],
    cover: img(`${P}/modern-villa/exterior-dusk.jpg`, 1440, 960, "Alacakaranlıkta modern villa", "Modern villa at dusk"),
    gallery: [
      img(`${P}/modern-villa/exterior-pool-hd.jpg`, 2000, 1333, "Havuz terasından villa", "The villa from the pool terrace"),
    ],
  },
  {
    slug: "ofis-yenileme",
    category: "renovation",
    featured: false,
    title: { tr: "Villadan Ofise Dönüşüm", en: "Villa-to-Office Conversion" },
    tagline: {
      tr: "Aynı oda, bambaşka bir çalışma hâli.",
      en: "The same room, an entirely different way of working.",
    },
    description: {
      tr: "30 yıllık bir villanın modern bir ofise dönüştürülmesi. Karanlık ve dağınık odalar; açık gri zemin, entegre dolap sistemleri, siyah doğramalı cam bölmeler ve lineer aydınlatmayla ferah, sakin çalışma alanlarına dönüştürüldü. Balkona açılan yeni doğramalar gün ışığını mekânın merkezine taşıyor.",
      en: "A 30-year-old villa converted into a modern office. Dim, cluttered rooms became calm, airy workspaces with light grey flooring, integrated storage, black-framed glass partitions and linear lighting, while new balcony frames bring daylight to the centre of each room.",
    },
    scope: [
      { tr: "İç Mimari Tasarım", en: "Interior Design" },
      { tr: "Uygulama", en: "Implementation" },
    ],
    cover: img(`${P}/ofis-yenileme/after.jpg`, 720, 1280, "Yenilenmiş ofis", "Renovated office"),
    gallery: [
      img(`${P}/ofis-yenileme/after-2.jpg`, 720, 1280, "Balkona açılan yeni doğramalar", "New balcony frames"),
      img(`${P}/ofis-yenileme/after-3.jpg`, 720, 1280, "Çalışma alanı", "Workspace"),
      img(`${P}/ofis-yenileme/before-2.jpg`, 720, 1280, "Ofisin önceki hali", "The office before"),
      img(`${P}/ofis-yenileme/site-banner.jpg`, 1200, 1600, "Şantiye pankartı: 30 yıllık villadan modern ofise", "Site banner: from a 30-year-old villa to a modern office"),
    ],
    video: {
      src: "/media/video/office-before-after.mp4",
      poster: "/media/video/office-before-after.jpg",
      width: 540,
      height: 960,
      uploadDate: "2026-10-27T22:07:11+03:00",
    },
    beforeAfter: {
      before: img(`${P}/ofis-yenileme/before.jpg`, 720, 1280, "Ofisin önceki hali", "The office before"),
      after: img(`${P}/ofis-yenileme/after.jpg`, 720, 1280, "Ofisin yeni hali", "The office after"),
    },
  },
  {
    slug: "konut-uygulama",
    category: "build",
    featured: false,
    title: { tr: "Konut Uygulaması", en: "Residential Fit-out" },
    tagline: {
      tr: "Çizimden şantiyeye, şantiyeden yaşama.",
      en: "From drawing to site, from site to life.",
    },
    description: {
      tr: "Giriş holü ve merdiven için gerçekleştirilen uygulama. Gizli kasa kapılar, cam korkuluklu merdiven, ahşap kaplama paneller ve tavana gömülü lineer aydınlatma; sade, bütüncül ve dayanıklı bir iç mekân oluşturuyor.",
      en: "A completed fit-out of an entrance hall and staircase. Flush concealed doors, a glass-balustrade stair, timber-clad panels and recessed linear lighting create a quiet, coherent and durable interior.",
    },
    scope: [
      { tr: "Uygulama", en: "Implementation" },
      { tr: "Proje Yönetimi", en: "Project Management" },
      { tr: "Detay Tasarımı", en: "Detail Design" },
    ],
    cover: img(`${P}/konut-uygulama/entrance.jpg`, 720, 1280, "Giriş holü", "Entrance hall"),
    gallery: [
      img(`${P}/konut-uygulama/stair.jpg`, 720, 1280, "Cam korkuluklu merdiven", "Glass-balustrade stair"),
      img(`${P}/konut-uygulama/hall.jpg`, 720, 1280, "Ahşap kaplama ve lineer aydınlatma", "Timber cladding and linear light"),
      img(`${P}/konut-uygulama/doors.jpg`, 720, 1280, "Gizli kasa kapılar", "Flush concealed doors"),
      img(`${P}/konut-uygulama/stair-2.jpg`, 720, 1280, "Merdiven boşluğu", "Stairwell"),
    ],
    video: {
      src: "/media/video/residence-walkthrough.mp4",
      poster: "/media/video/residence-walkthrough.jpg",
      width: 540,
      height: 960,
      uploadDate: "2026-10-27T22:07:11+03:00",
    },
  },
  {
    slug: "konut-ic-mekan",
    category: "interior",
    featured: false,
    title: { tr: "Konut İç Mekân", en: "Residential Interior" },
    tagline: {
      tr: "Doğal tonlar, gizli ışık ve sessiz bir lüks.",
      en: "Natural tones, hidden light and a quiet kind of luxury.",
    },
    description: {
      tr: "Salon, yemek alanı ve yatak odası için geliştirilen iç mekân tasarımı. Ahşap ve mermer yüzeyler, gizli LED aydınlatma ve yumuşak dokulu mobilyalar, sıcak ve dingin bir yaşam ortamı kuruyor.",
      en: "An interior scheme for the living room, dining area and bedroom. Timber and marble surfaces, concealed LED lighting and soft-textured furniture create a warm, serene home.",
    },
    scope: [
      { tr: "İç Mimari Tasarım", en: "Interior Design" },
      { tr: "Mobilya Tasarımı", en: "Furniture Design" },
      { tr: "3D Animasyon", en: "3D Animation" },
    ],
    cover: img(`${P}/konut-ic-mekan/living-2.jpg`, 720, 480, "Salon", "Living room"),
    gallery: [
      img(`${P}/konut-ic-mekan/living-1.jpg`, 720, 480, "TV duvarı", "Media wall"),
      img(`${P}/konut-ic-mekan/living-3.jpg`, 720, 480, "Yemek alanı", "Dining area"),
      img(`${P}/konut-ic-mekan/living-4.jpg`, 720, 480, "Salon ve yemek alanı", "Living and dining"),
      img(`${P}/konut-ic-mekan/bedroom-1.jpg`, 720, 540, "Yatak odası", "Bedroom"),
    ],
    video: {
      src: "/media/video/living-room.mp4",
      poster: "/media/video/living-room.jpg",
      width: 720,
      height: 480,
      uploadDate: "2026-10-27T22:07:11+03:00",
    },
  },

  {
    slug: "tek-katli-ev",
    category: "architecture",
    featured: false,
    title: { tr: "Tek Katlı Modern Ev", en: "Single-Storey Modern House" },
    tagline: {
      tr: "Bahçeyle aynı seviyede, sade ve ferah bir yaşam.",
      en: "Simple, airy living on the same level as the garden.",
    },
    description: {
      tr: "Tüm yaşamın tek katta çözüldüğü, kırma çatılı modern bir konut tasarımı. Geniş cam açıklıklar iç mekânı bahçeye bağlıyor; ahşap kaplamalı giriş, beyaz cephe ve doğal taş yürüyüş yolları sıcak ama sade bir karakter oluşturuyor.",
      en: "A modern hipped-roof house where all of daily life happens on one level. Large glazed openings connect the rooms to the garden, while a timber-clad entrance, white façade and natural stone paths give it a warm yet restrained character.",
    },
    scope: [
      { tr: "Mimari Tasarım", en: "Architectural Design" },
      { tr: "Peyzaj", en: "Landscape" },
      { tr: "3D Görselleştirme", en: "3D Visualisation" },
    ],
    cover: img(`${P}/tek-katli-ev/exterior.jpg`, 1536, 1024, "Tek katlı modern ev ve bahçesi", "Single-storey modern house and garden"),
    gallery: [],
  },
  {
    slug: "konut-projeleri",
    category: "architecture",
    featured: false,
    title: { tr: "Konut Projeleri", en: "Residential Buildings" },
    tagline: {
      tr: "Apartmandan siteye, şehirde iyi yaşamak için tasarlanan yapılar.",
      en: "From apartment blocks to complexes — buildings designed for good city living.",
    },
    description: {
      tr: "Çok katlı konut yapıları için geliştirilen mimari tasarımlar: geniş balkonlar, akşam ışığında sıcaklaşan cepheler ve bina çevresinde yeşil, yürünebilir ortak alanlar. Her dairenin gün ışığı ve manzaradan pay alması tasarımın çıkış noktası.",
      en: "Architectural designs for multi-storey housing: generous balconies, façades that glow warmly in the evening light, and green, walkable shared spaces around the buildings. Giving every flat its share of daylight and view is the starting point.",
    },
    scope: [
      { tr: "Mimari Tasarım", en: "Architectural Design" },
      { tr: "Vaziyet Planı & Peyzaj", en: "Site Plan & Landscape" },
      { tr: "3D Görselleştirme", en: "3D Visualisation" },
    ],
    cover: img(`${P}/konut-projeleri/complex.jpg`, 1536, 1024, "Gün batımında konut sitesi", "Residential complex at sunset"),
    gallery: [img(`${P}/konut-projeleri/apartment.jpg`, 1079, 720, "Köşe parselde apartman bloğu", "Apartment block on a corner plot")],
  },
  {
    slug: "villa-ic-mekan",
    category: "interior",
    featured: false,
    title: { tr: "Villa İç Mekânı", en: "Villa Interiors" },
    tagline: {
      tr: "Doğal taş, açık meşe ve bahçeye açılan aydınlık odalar.",
      en: "Natural stone, light oak and bright rooms opening to the garden.",
    },
    description: {
      tr: "Bir villanın salon, mutfak ve yatak odası için hazırlanan iç mekân tasarımı. Taş kaplı şömine duvarı, mermer adalı mutfak ve yere kadar inen pencereler; sıcak ahşap tonlar ve yumuşak dokularla dengelenerek huzurlu bir ev atmosferi kuruyor.",
      en: "An interior scheme for a villa: living room, kitchen and bedroom. A stone-clad fireplace wall, a marble kitchen island and floor-to-ceiling windows are balanced with warm timber tones and soft textures to create a calm home.",
    },
    scope: [
      { tr: "İç Mimari Tasarım", en: "Interior Design" },
      { tr: "Mutfak Tasarımı", en: "Kitchen Design" },
      { tr: "3D Görselleştirme", en: "3D Visualisation" },
    ],
    cover: img(`${P}/villa-ic-mekan/kitchen-island.jpg`, 1536, 1024, "Adalı açık mutfak", "Open kitchen with island"),
    gallery: [
      img(`${P}/villa-ic-mekan/living.jpg`, 1024, 491, "Taş şömine duvarlı salon", "Living room with stone fireplace wall"),
      img(`${P}/villa-ic-mekan/kitchen.jpg`, 1024, 543, "Mermer adalı mutfak", "Kitchen with marble island"),
      img(`${P}/villa-ic-mekan/bedroom.jpg`, 1024, 494, "Bahçeye bakan yatak odası", "Bedroom overlooking the garden"),
    ],
  },
  {
    slug: "pastane",
    category: "interior",
    featured: false,
    title: { tr: "Pastane Konsepti", en: "Patisserie Concept" },
    tagline: {
      tr: "Ürünü sahnenin merkezine alan sıcak bir vitrin.",
      en: "A warm display that puts the product centre stage.",
    },
    description: {
      tr: "Bir pastane için hazırlanan iç mekân konsepti. Ahşap kaplı, ışıklı vitrin tezgâhı ürünleri öne çıkarırken mermer kasa bankosu, raylı spot aydınlatma ve sokağa açılan cam cephe davetkâr bir satış alanı oluşturuyor.",
      en: "An interior concept for a patisserie. A timber-clad, illuminated display counter showcases the products, while a marble till counter, track spotlights and a glass shopfront create an inviting sales space.",
    },
    scope: [
      { tr: "İç Mimari Tasarım", en: "Interior Design" },
      { tr: "Vitrin & Tezgâh Tasarımı", en: "Display & Counter Design" },
      { tr: "3D Görselleştirme", en: "3D Visualisation" },
    ],
    cover: img(`${P}/pastane/interior.jpg`, 1536, 1024, "Pastane iç mekânı ve vitrin tezgâhı", "Patisserie interior and display counter"),
    gallery: [],
  },
  {
    slug: "yonetici-ofisi",
    category: "interior",
    featured: false,
    title: { tr: "Yönetici Odası", en: "Executive Study" },
    tagline: {
      tr: "Koyu tonlar, deri ve sanatla karakterli bir çalışma odası.",
      en: "A study with character: dark tones, leather and art.",
    },
    description: {
      tr: "Klasik dokunuşlarla tasarlanan bir yönetici odası. Koyu duvarlar, Chesterfield deri koltuklar, masif çalışma masası ve sıcak noktasal aydınlatma; ağırbaşlı ama samimi bir görüşme ortamı yaratıyor.",
      en: "An executive study designed with classic touches. Dark walls, Chesterfield leather armchairs, a solid desk and warm accent lighting create a dignified yet welcoming meeting space.",
    },
    scope: [
      { tr: "İç Mimari Tasarım", en: "Interior Design" },
      { tr: "Mobilya Seçimi", en: "Furniture Selection" },
      { tr: "3D Görselleştirme", en: "3D Visualisation" },
    ],
    cover: img(`${P}/yonetici-ofisi/study.jpg`, 1536, 1024, "Chesterfield koltuklu yönetici odası", "Executive study with Chesterfield armchairs"),
    gallery: [],
  },
];

export const projectCategories: ProjectCategory[] = ["architecture", "interior", "renovation", "build"];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getAdjacentProject(slug: string): Project {
  const index = projects.findIndex((p) => p.slug === slug);
  return projects[(index + 1) % projects.length];
}

export function projectNumber(slug: string): string {
  return String(projects.findIndex((p) => p.slug === slug) + 1).padStart(2, "0");
}

export function screenPoster(video: ProjectVideo): string {
  return video.poster.replace(/\.jpg$/, ".webp");
}
