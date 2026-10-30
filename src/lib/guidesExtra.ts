import type { StudioGuide } from "./guides";

// Guides added from the customer-needs research of 30 Oct 2026
// (docs/marketing-growth/25-customer-needs-research-2026-10-30.md). Legal and procedural points
// cite the regulation they come from; anything that varies by parcel or municipality says so.

const D = "/media/diagrams/guides";

const MEVZUAT = "https://www.mevzuat.gov.tr/mevzuat?MevzuatTertip=5&";
const LAW = {
  zoning: { href: `${MEVZUAT}MevzuatNo=3194&MevzuatTur=1`, label: { tr: "İmar Kanunu (3194)", en: "Zoning Law (3194, Turkish)" } },
  planned: { href: `${MEVZUAT}MevzuatNo=23722&MevzuatTur=7`, label: { tr: "Planlı Alanlar İmar Yönetmeliği", en: "Planned Areas Zoning Regulation (Turkish)" } },
  condominium: { href: `${MEVZUAT}MevzuatNo=634&MevzuatTur=1`, label: { tr: "Kat Mülkiyeti Kanunu (634)", en: "Condominium Law (634, Turkish)" } },
} as const;
const GOLBASI = {
  planning: { href: "https://www.ankaragolbasi.bel.tr/hizmet-birimleri/imar-ve-sehircilik-mudurlugu", label: { tr: "Gölbaşı Belediyesi İmar ve Şehircilik Müdürlüğü", en: "Gölbaşı Municipality planning department (Turkish)" } },
  permitDocs: { href: "https://www.ankaragolbasi.bel.tr/yapi-ruhsati-icin-gerekli-evraklar", label: { tr: "Gölbaşı: yapı ruhsatı için gerekli evraklar", en: "Gölbaşı: building permit documents (Turkish)" } },
  occupancyDocs: { href: "https://www.ankaragolbasi.bel.tr/iskan-icin-istenen-evraklar", label: { tr: "Gölbaşı: iskân için istenen evraklar", en: "Gölbaşı: occupancy documents (Turkish)" } },
  eImar: { href: "https://www.turkiye.gov.tr/golbasi-belediyesi-eimar-8828", label: { tr: "e-Devlet: Gölbaşı Belediyesi e-İmar sorgusu", en: "e-Devlet: Gölbaşı e-İmar query (login required)" } },
  cityGuide: { href: "https://cbs.ankaragolbasi.bel.tr/Golbasieimar/", label: { tr: "Gölbaşı Belediyesi e-İmar haritası", en: "Gölbaşı e-İmar map" } },
  ankaraEImar: { href: "https://eimar.ankara.bel.tr/", label: { tr: "Ankara Büyükşehir Belediyesi e-İmar", en: "Ankara Metropolitan e-İmar" } },
} as const;

export const extraGuides: readonly StudioGuide[] = [
  {
    slug: "incek-golbasi-villa-yenileme",
    service: "tadilat-donusum-ankara",
    alsoServices: ["cephe-tasarimi-yenileme-ankara", "incek-golbasi-mimarlik-ofisi", "peyzaj-bahce-tasarimi-ankara"],
    project: "villa-donusumu",
    topic: "local",
    audiences: ["villa", "investor"],
    card: "/media/projects/villa-donusumu/after.jpg",
    links: [GOLBASI.eImar, GOLBASI.cityGuide, GOLBASI.ankaraEImar, GOLBASI.planning, GOLBASI.permitDocs, GOLBASI.occupancyDocs, LAW.zoning, LAW.planned, LAW.condominium],
    diagram: {
      src: `${D}/villa-yenileme.svg`,
      numbered: true,
      caption: {
        tr: "Mevcut bir villada birbirine bağlı altı başlık. Şema ölçekli değildir; sıra ve kapsam yapının durumuna göre değişir.",
        en: "Six connected headings in an existing villa. The drawing is not to scale; order and scope depend on the building.",
      },
      items: {
        tr: [
          ["Çatı ve ısı yalıtımı", "Çatı örtüsü, su yalıtımı ve yalıtım katmanı cephe kararlarından önce değerlendirilir."],
          ["Cephe ve doğramalar", "Pencere oranları, doğrama değişimi ve dış yüzey; dış görünümü değiştirir."],
          ["İç yerleşim", "Duvar kaldırma, mutfak ve banyo yerleri; taşıyıcı sistem ve izin durumu kontrol edilir."],
          ["Isıtma ve tesisat", "Eski tesisat yeni kaplamanın arkasında kalmamalıdır."],
          ["Teras ve bahçe", "Dış yaşam alanı çoğu zaman ayrı bir kapsam ve ayrı bir bütçe kalemidir."],
          ["Site kuralları ve çevre", "Site içindeki villalarda yönetim planı ve kat maliklerinin kararı dış değişiklikleri etkiler."],
        ],
        en: [
          ["Roof and insulation", "Roof covering, waterproofing and insulation are assessed before façade decisions."],
          ["Façade and windows", "Window proportions, frame replacement and the outer surface change the exterior."],
          ["Interior layout", "Removing walls, moving kitchen and bathrooms; structure and permit status are checked."],
          ["Heating and services", "Old services should not end up hidden behind new finishes."],
          ["Terrace and garden", "Outdoor living is often a separate scope and a separate budget heading."],
          ["Estate rules and surroundings", "In gated estates the management plan and owners' decisions affect exterior changes."],
        ],
      },
    },
    copy: {
      tr: {
        title: "İncek ve Gölbaşı'nda villa yenilemeye nereden başlanır?",
        description: "Villa yenilemeden önce: hangi iş izne tabi, site kuralları neyi etkiler, Gölbaşı'nda hangi belgeler istenir, çatı, cephe ve iç mekân hangi sırayla ele alınır?",
        intro: "Ofisimiz İncek'te; bu yüzden en sık duyduğumuz soru, yıllar önce yapılmış bir villanın nereden ve hangi sırayla yenileneceği. Yeni alınmış bir villa ya da yıllardır yaşanan bir ev olsun, sorular benzer: Ne izne tabi? Site içindeyse kimin onayı gerekir? Bütçeyi en çok ne değiştirir? Bu rehber, bölgede bir villayı yenilemeden önce netleştirmeniz gereken başlıkları sırasıyla anlatır. Hukuki danışmanlık değildir; parsele özgü konular ilgili belediyeden teyit edilmelidir.",
        sections: [
          {
            title: "1. Önce parselin hangi kurala bağlı olduğunu öğrenin",
            body: "“İncek” olarak anılan bölgedeki her parsel aynı plan kararına bağlı olmayabilir. Gölbaşı Belediyesi'nin İmar ve Şehircilik Müdürlüğü sayfasına göre ilçede Özel Çevre Koruma Bölgesi içinde kalan alanlarda planlama yetkisi Bakanlığın ilgili genel müdürlüğünde, diğer alanlarda Ankara Büyükşehir Belediyesi'ndedir. Bu nedenle başvuru yeri ve uygulanacak plan notları parsel bazında teyit edilmelidir. İmar durumunu e-Devlet üzerinden ya da belediyeden öğrenebilirsiniz.",
            points: ["Ada ve parsel numaranızı ve tapu bilginizi hazırlayın.", "Güncel imar durumu (imar çapı) belgesini edinin.", "Villanın onaylı projesi ve yapı kullanma izin belgesi (iskân) varsa bulun."],
          },
          {
            title: "2. Hangi iş izne tabi, hangisi değil?",
            body: "İmar Kanunu'nun 21. maddesine göre boya, sıva, kaplama ve tesisat tamirleri gibi işler ruhsata tabi değildir. Planlı Alanlar İmar Yönetmeliği ise basit tamir ve tadili; taşıyıcı sistemi, dış cepheyi ve ıslak hacimlerin yerini veya sayısını değiştirmeyen işler olarak tanımlar. Bu sınırları aşan işler, örneğin duvar kaldırırken taşıyıcı elemana dokunmak, cephe açıklıklarını değiştirmek ya da banyonun yerini taşımak, esaslı tadilat sayılır ve ruhsat gerektirir.",
            points: ["Kaplama, boya, mutfak dolabı yenileme: genellikle ruhsat gerekmez.", "Cephe açıklığı, ek hacim, taşıyıcıya dokunan değişiklik: ruhsat gerekir.", "Emin olmadığınız işi uygulamadan önce statik ve imar açısından değerlendirtin."],
          },
          {
            title: "3. Site içindeyseniz yönetim planını okuyun",
            body: "Bölgedeki pek çok villa bir site içinde yer alır. Kat Mülkiyeti Kanunu'nun 19. maddesine göre ortak yerlerde inşaat, onarım ve değişiklik yapmak ya da yapının dış kısmını farklı renkte boyatmak için kat maliklerinin beşte dördünün yazılı rızası gerekir. Yönetim planı da cephe rengi, çit, pergola veya havuz gibi konularda ek kurallar getirebilir. Tasarıma başlamadan önce yönetim planını ve site yönetiminin onay sürecini öğrenmek, sonradan değişiklik yapmak zorunda kalmamanızı sağlar.",
          },
          {
            title: "4. Görünen yüzeyden önce yapının durumunu konuşun",
            body: "Villa yenilemesinde en pahalı sürprizler genellikle görünmeyen yerlerden çıkar: çatıdan su alma, bodrumda nem, eski tesisat ya da yetersiz ısı yalıtımı. Ankara'nın soğuk kışları düşünüldüğünde çatı ve cephe yalıtımı, doğramalar ve ısıtma sistemi birlikte ele alınmalıdır. Yeni bir kaplama seçmeden önce bu başlıkların bir uzman gözüyle değerlendirilmesi, kapsamı doğru tarif etmenin ilk adımıdır.",
            points: ["Çatı, bodrum ve ıslak hacimlerde nem izlerini fotoğraflayın.", "Kombi, kazan veya kalorifer sisteminin yaşını not edin.", "Elektrik panosu ve tesisatın en son ne zaman yenilendiğini öğrenin."],
          },
          {
            title: "5. Kapsamı katmanlara ayırın",
            body: "Bir villa yenilemesi tek bir iş değildir. Çatı ve cephe, iç yerleşim, mutfak ve banyolar, tesisat ve ısıtma, teras ve bahçe ayrı kapsamlar olarak tarif edilirse hangi işin önce yapılması gerektiği ve bütçenin nereye gittiği görünür olur. Bahçe, havuz ve peyzajın teklife dahil olup olmadığı en sık karışan konulardan biridir; bunları ayrı satırlar olarak sorun.",
          },
          {
            title: "6. Villada yaşarken mi, boşken mi?",
            body: "Yenileme sırasında villada yaşamaya devam edip etmeyeceğiniz iş sırasını değiştirir. Yaşanırken yapılan işler katlara veya bölümlere ayrılır; mutfak ve banyo gibi tesisatlı alanların ne kadar süre kullanılamayacağı baştan konuşulur. Boş bir villada işler daha toplu ilerleyebilir. Hedef taşınma tarihiniz varsa, hangi kararın ne zaman verilmesi gerektiğini takvime yerleştirmek tarihlerden daha önemlidir.",
          },
          {
            title: "7. Esaslı tadilatta hangi belgeler istenir?",
            body: "Ruhsat gerektiren bir değişiklikte Gölbaşı Belediyesi'nin yayımladığı yapı ruhsatı evrak listesinde bir aydan eski olmayan tapu, bir yıldan eski olmayan imar çapı, aplikasyon krokisi, yol kotu tutanağı, zemin etüdü ve peyzaj projesi gibi belgeler yer alır. Belediyenin sayfasına göre yapı denetimine ilişkin evraklar alan büyüklüğüne göre farklılaşır. İskân aşamasında enerji kimlik belgesi istenir. Listenin güncel halini başvuru öncesinde belediyeden teyit edin; parsele göre değişebilir.",
          },
        ],
        faq: [
          ["Villa yenilemesi ne kadar sürer?", "Kapsama, yapının durumuna, izin gerekip gerekmediğine ve özel üretim ürünlerin teslim süresine bağlıdır. Yalnızca yüzey yenilemesi ile cephe, çatı ve iç yerleşimi kapsayan bir dönüşümün süresi çok farklıdır. Mevcut durumu görmeden süre vermek yerine hangi kararın ne zaman gerektiğini birlikte planlarız."],
          ["Bütçeyi en çok ne değiştirir?", "Taşıyıcı sisteme veya cepheye dokunulup dokunulmadığı, tesisatın yenilenip yenilenmediği, malzeme seviyesi ve özel üretim mobilya en belirleyici başlıklardır. Bahçe ve havuz da ayrı bir kalem olarak düşünülmelidir."],
          ["Yalnızca cepheyi yenileyebilir miyiz?", "Evet; ancak cephe değişikliği dış görünümü etkilediği için izin durumu ve site içindeyseniz kat maliklerinin onayı baştan netleştirilmelidir. Cephe yenilemesi yalıtım ve doğrama kararlarıyla birlikte düşünülmelidir."],
        ],
        takeaway: "Görüşme notu: “İncek/Gölbaşı'nda … yılında yapılmış, … katlı bir villamız var. Site içinde / müstakil. Önceliğimiz …; çatı, cephe ve tesisatın durumunu bilmiyoruz / biliyoruz. Yenileme sırasında evde yaşayacağız / yaşamayacağız. Hangi işlerin izne tabi olduğunu ve kapsamı hangi katmanlara ayıracağımızı konuşmak istiyoruz.”",
      },
      en: {
        title: "Renovating a villa in İncek and Gölbaşı: where to start",
        description: "Before renovating a villa: which work needs a permit, how estate rules apply, what Gölbaşı asks for, and in what order to tackle roof, façade and interior.",
        intro: "Our office is in İncek, and the question we hear most is where and in what order to start renovating a villa built years ago. Whether it is a villa you have just bought or a home you have lived in for years, the questions are similar: What needs a permit? If it is in a gated estate, whose approval is required? What changes the budget most? This guide sets out, in order, the topics to settle before renovating a villa in the area. It is not legal advice; parcel-specific matters should be confirmed with the relevant municipality.",
        sections: [
          {
            title: "1. Find out which rules apply to your parcel",
            body: "Not every parcel in the area known as “İncek” is subject to the same planning decision. According to the Gölbaşı Municipality planning department page, planning authority in the district lies with the relevant directorate of the Ministry within the Special Environmental Protection Area and with Ankara Metropolitan Municipality elsewhere. The application office and the plan notes that apply should therefore be confirmed parcel by parcel. You can obtain the zoning status through e-Devlet or from the municipality.",
            points: ["Have your block and parcel number and title deed details ready.", "Obtain a current zoning status document.", "Find the villa's approved drawings and occupancy certificate, if available."],
          },
          {
            title: "2. Which work needs a permit and which does not?",
            body: "Under Article 21 of the Zoning Law, work such as painting, plastering, finishes and repairs to services does not require a permit. The Planned Areas Zoning Regulation defines minor repair and alteration as work that does not change the structure, the external façade, or the location or number of wet rooms. Work beyond these limits, such as touching a structural element while removing a wall, changing façade openings or moving a bathroom, counts as a major alteration and needs a permit.",
            points: ["Finishes, paint, new kitchen units: usually no permit.", "Façade openings, extra volume, changes touching the structure: permit required.", "If unsure, have the work assessed for structure and zoning before starting."],
          },
          {
            title: "3. In a gated estate, read the management plan",
            body: "Many villas in the area sit within an estate. Under Article 19 of the Condominium Law, building work, repairs and changes to common areas, or painting the exterior a different colour, require the written consent of four-fifths of the owners. The management plan may add rules on façade colour, fences, pergolas or pools. Knowing the management plan and the estate's approval process before design starts avoids changes later.",
          },
          {
            title: "4. Discuss the building's condition before the finishes",
            body: "The most expensive surprises in a villa renovation usually come from what you cannot see: a leaking roof, damp in the basement, old services or poor insulation. With Ankara's cold winters, roof and façade insulation, windows and the heating system should be considered together. Having these assessed by a specialist before choosing new finishes is the first step towards describing the scope correctly.",
            points: ["Photograph signs of damp in the roof, basement and wet rooms.", "Note the age of the boiler or heating system.", "Find out when the electrical panel and wiring were last renewed."],
          },
          {
            title: "5. Split the scope into layers",
            body: "A villa renovation is not a single job. Describing roof and façade, interior layout, kitchen and bathrooms, services and heating, and terrace and garden as separate scopes shows which work must come first and where the budget goes. Whether the garden, pool and landscaping are included in a proposal is one of the most common sources of confusion; ask for them as separate lines.",
          },
          {
            title: "6. Living in the villa during the work, or not?",
            body: "Whether you stay in the villa during the renovation changes the order of work. Work done while living there is split by floor or zone, and how long the kitchen and bathrooms will be out of use is agreed at the start. In an empty villa, work can progress in larger blocks. If you have a moving date, placing each decision on the timeline matters more than the dates themselves.",
          },
          {
            title: "7. Which documents does a major alteration need?",
            body: "For a change that needs a permit, the building permit document list published by Gölbaşı Municipality includes a title deed no older than one month, a zoning plan extract no older than one year, a site plan, a road level record, a soil survey and a landscape design, among others. According to the municipality's page, building inspection documents differ with floor area. An energy performance certificate is requested at the occupancy stage. Confirm the current list with the municipality before applying; it may vary by parcel.",
          },
        ],
        faq: [
          ["How long does a villa renovation take?", "It depends on scope, the building's condition, whether a permit is needed and lead times for bespoke products. A surface refresh and a transformation covering façade, roof and layout take very different times. Rather than quoting a duration unseen, we plan together which decision is needed when."],
          ["What changes the budget most?", "Whether the structure or façade is touched, whether services are renewed, the level of materials and bespoke furniture are the most decisive headings. The garden and pool should also be treated as a separate heading."],
          ["Can we renovate only the façade?", "Yes, but because a façade change affects the exterior, the permit status and, in an estate, the owners' approval must be clarified first. Façade work should be considered together with insulation and window decisions."],
        ],
        takeaway: "Brief: “We have a … storey villa in İncek/Gölbaşı built in … . It is in an estate / detached. Our priority is …; we do / do not know the condition of the roof, façade and services. We will / will not live there during the work. We would like to discuss which work needs a permit and how to split the scope into layers.”",
      },
    },
  },
  {
    slug: "banyo-yenileme-oncesi",
    service: "tadilat-donusum-ankara",
    alsoServices: ["ic-mimarlik-ankara"],
    project: "konut-ic-mekan",
    topic: "interior",
    audiences: ["homeowner", "villa", "investor"],
    card: `${D}/banyo-katmanlari.svg`,
    links: [LAW.planned, LAW.condominium],
    diagram: {
      src: `${D}/banyo-katmanlari.svg`,
      numbered: true,
      caption: {
        tr: "Banyo zeminini ve duvarını oluşturan katmanlar. Şema ölçekli değildir; uygulanacak detay mevcut yapıya göre belirlenir.",
        en: "The layers that make up a bathroom floor and wall. The drawing is not to scale; the detail depends on the existing building.",
      },
      items: {
        tr: [
          ["Tesisat ve gider eğimi", "Temiz su ve pis su hatları; giderin eğimi klozet ve duşun nereye gelebileceğini belirler."],
          ["Su yalıtımı", "Zeminde ve duvarın alt bölümünde, özellikle duş çevresinde kesintisiz uygulanır."],
          ["Eğimli şap", "Suyu gidere yönlendiren eğim, kaplamadan önce şapla verilir."],
          ["Kaplama", "Seramik, taş veya benzeri yüzey; eğimli zeminde ebat ve derz kararını etkiler."],
          ["Armatür ve gider", "Duş, lavabo, klozet ve süzgeç; bakım için erişim noktaları planlanır."],
          ["Havalandırma", "Pencere yoksa mekanik havalandırma nem ve küf riskini azaltır."],
        ],
        en: [
          ["Pipes and drain fall", "Supply and waste lines; the drain fall decides where the WC and shower can go."],
          ["Waterproofing", "Applied continuously on the floor and the lower wall, especially around the shower."],
          ["Sloped screed", "The fall that leads water to the drain is formed in the screed before tiling."],
          ["Finish", "Tile, stone or similar; on a sloped floor this affects tile size and joints."],
          ["Fittings and drain", "Shower, basin, WC and floor drain; access points for maintenance are planned."],
          ["Ventilation", "Without a window, mechanical ventilation reduces damp and mould."],
        ],
      },
    },
    copy: {
      tr: {
        title: "Banyo yenilemeye başlamadan önce: tesisat, su yalıtımı ve yerleşim",
        description: "Banyo tadilatında yüzeyin arkasındaki tesisat ve su yalıtımı, klozet ve duşun yeri, eşiksiz duş, havalandırma, iş sırası ve süreyi etkileyen kararlar.",
        intro: "Banyo yenilemesi çoğu zaman “seramikleri değiştirelim” diye başlar; ancak bir banyonun ömrünü belirleyen şey yüzeyin arkasındaki tesisat, su yalıtımı ve eğimdir. Alt kata su sızdıran bir banyo, ne kadar güzel kaplanmış olursa olsun yeniden sökülür. Bu rehber, banyonuzu yenilemeden önce hangi kararların sırayla verilmesi gerektiğini anlatır.",
        sections: [
          {
            title: "1. Neden yenilediğinizi yazın",
            body: "Sızıntı, eski tesisat, yetersiz depolama, kullanım zorluğu ya da yalnızca eskimiş bir görünüm: Her biri farklı bir kapsam demektir. Sızıntı veya nem varsa kaynağı bulunmadan kaplamaya geçilmez. Görünüm odaklı bir yenilemede bile mevcut tesisatın yaşı ve durumu kapsamı belirler.",
            points: ["Alt katta veya duvarlarda su izi var mı?", "Tesisat en son ne zaman yenilendi?", "Banyoyu kimler kullanıyor: çocuk, yaşlı, misafir?"],
          },
          {
            title: "2. Seramik üstüne seramik mi, söküm mü?",
            body: "Mevcut kaplamanın üzerine yeni kaplama yapmak daha hızlı görünebilir; fakat zemini yükseltir, kapı ve eşik kotlarını değiştirir ve alttaki tesisat ile yalıtım sorunlarını görünmez kılar. Tesisatı ve su yalıtımını yenilemeden yapılan bir kaplama, sorunu ertelemekten öteye geçmeyebilir. Hangi yolun uygun olduğu mevcut durum görülerek karara bağlanmalıdır.",
          },
          {
            title: "3. Klozet ve duşun yeri gidere bağlıdır",
            body: "Klozet, duş ve lavabonun yeri büyük ölçüde mevcut gider hattına ve eğimine bağlıdır. Aynı banyo içinde bir armatürü kaydırmak çoğu zaman mümkündür; ancak eğim yetmezse zemin yükselir. Banyonun kendisini başka bir odaya taşımak ise Planlı Alanlar İmar Yönetmeliği'ne göre ıslak hacmin yerini değiştirdiği için esaslı tadilat sayılır ve ruhsat gerektirir. Apartmanlarda alt komşunun tavanı da bu kararı sınırlar.",
          },
          {
            title: "4. Su yalıtımı ve eğim pazarlık konusu değildir",
            body: "Su yalıtımı zeminde kesintisiz uygulanmalı, duvarlara dönmeli ve duş çevresinde yeterli yüksekliğe çıkmalıdır. Kaplamadan önce yalıtımın su tutularak denenmesi, sorunları seramik döşenmeden görmeyi sağlar. Zemine gömme, eşiksiz bir duş istiyorsanız eğim ve yalıtım detayı baştan çizilmelidir; büyük ebatlı seramik eğimli zeminde ek kesim ve detay gerektirebilir.",
          },
          {
            title: "5. Güvenlik ve erişilebilirlik",
            body: "Kaymaz zemin, ileride tutamak takılabilecek duvarlarda takviye, eşiksiz duş ve yeterli kapı genişliği; çocuklu ya da yaşlı bireylerin yaşadığı evlerde fark yaratır. Islak alandaki aydınlatma ve prizlerin uygunluğu ile kaçak akım koruması yetkili bir elektrikçi tarafından kontrol edilmelidir. Pencere yoksa nemi dışarı atacak mekanik havalandırma planlanmalıdır.",
          },
          {
            title: "6. İş sırası ve süre",
            body: "Tipik sıra söküm, tesisat, su yalıtımı ve deneme, eğimli şap, kaplama, montaj ve son kontrol şeklindedir. Malzemelerin kuruma süreleri ve özel sipariş ürünlerin teslimi süreyi etkiler. Evde tek banyo varsa bu sürenin nasıl geçirileceği baştan planlanmalıdır. Kesin gün sayısı mevcut durum ve seçilen ürünler bilinmeden verilemez; hangi ürünün ne zaman seçilmesi gerektiğini sormak daha doğru bir başlangıçtır.",
          },
        ],
        faq: [
          ["Banyo tadilatı kaç gün sürer?", "Kapsama, söküm sonrası ortaya çıkan duruma, kuruma sürelerine ve ürünlerin teslimine bağlıdır. Yalnızca armatür değişimi ile tesisat ve yalıtımın yenilendiği bir banyo çok farklı sürelerdir. Ölçü ve mevcut durumu görmeden süre vermeyiz."],
          ["Su yalıtımı şart mı?", "Islak alanlarda, özellikle duş çevresinde ve zeminde, su yalıtımı banyonun uzun ömürlü olmasının temel koşuludur. Alt kata sızıntı riskini azaltır ve sonradan yeniden söküm yapılmasının önüne geçer."],
          ["Malzeme fiyata dahil mi?", "Bu, teklifin nasıl hazırlandığına bağlıdır. Seramik, armatür ve vitrifiyenin kim tarafından seçilip alınacağını ve teklifte hangi kalemlerin bulunduğunu yazılı olarak netleştirmek gerekir."],
        ],
        takeaway: "Görüşme notu: “… m² civarında bir banyomuz var. Sorunumuz …; tesisat yaklaşık … yıllık. Banyonun yerini değiştirmeyi düşünüyoruz / düşünmüyoruz. Evde başka banyo var / yok. Yalıtım, gider eğimi ve duş tipini konuşmak istiyoruz.”",
      },
      en: {
        title: "Before renovating a bathroom: plumbing, waterproofing and layout",
        description: "Plumbing and waterproofing behind the tiles, where the WC and shower can go, level-access showers, ventilation and the order of work.",
        intro: "A bathroom renovation often starts with “let's change the tiles”, yet what decides a bathroom's life is the plumbing, waterproofing and fall behind the surface. A bathroom leaking into the flat below will be stripped out again, however well it is tiled. This guide sets out the decisions to make, in order, before you renovate.",
        sections: [
          {
            title: "1. Write down why you are renovating",
            body: "A leak, old pipes, too little storage, difficulty of use or simply a tired look: each means a different scope. If there is a leak or damp, finishes wait until the source is found. Even in a cosmetic renovation, the age and condition of existing plumbing decide the scope.",
            points: ["Are there water marks below or on the walls?", "When was the plumbing last renewed?", "Who uses the bathroom: children, older people, guests?"],
          },
          {
            title: "2. Tile over tile, or strip out?",
            body: "Laying new tiles over existing ones may look quicker, but it raises the floor, changes door and threshold levels and hides plumbing and waterproofing problems underneath. Tiling without renewing the plumbing and waterproofing may only postpone the problem. Which route suits your bathroom should be decided after seeing the existing condition.",
          },
          {
            title: "3. Where the WC and shower go depends on the drain",
            body: "The positions of the WC, shower and basin largely depend on the existing waste line and its fall. Moving a fitting within the same bathroom is often possible, but if the fall is insufficient the floor rises. Moving the bathroom itself to another room changes the location of a wet room and, under the Planned Areas Zoning Regulation, counts as a major alteration requiring a permit. In apartments, the ceiling of the flat below also limits this decision.",
          },
          {
            title: "4. Waterproofing and fall are not negotiable",
            body: "Waterproofing should be continuous across the floor, turn up the walls and rise high enough around the shower. Testing it by holding water before tiling shows problems before the tiles go down. If you want a level-access shower, the fall and waterproofing detail must be drawn first; large-format tiles may need extra cuts and detailing on a sloped floor.",
          },
          {
            title: "5. Safety and accessibility",
            body: "Slip-resistant floors, reinforcement in walls where grab rails may be fitted later, level-access showers and wide enough doors make a difference in homes with children or older people. Lighting and sockets in wet zones and residual-current protection should be checked by a qualified electrician. Without a window, mechanical ventilation should be planned to remove moisture.",
          },
          {
            title: "6. Order of work and duration",
            body: "A typical sequence is strip-out, plumbing, waterproofing and test, sloped screed, tiling, fitting and final check. Drying times and lead times for special-order products affect duration. If the home has only one bathroom, how to manage that period should be planned first. A firm number of days cannot be given without knowing the existing condition and chosen products; asking which product must be chosen when is a better start.",
          },
        ],
        faq: [
          ["How many days does a bathroom renovation take?", "It depends on scope, what is found after strip-out, drying times and product deliveries. Replacing fittings and renewing the plumbing and waterproofing take very different times. We do not quote durations without seeing dimensions and condition."],
          ["Is waterproofing essential?", "In wet areas, especially around the shower and on the floor, waterproofing is the basic condition for a long-lasting bathroom. It reduces the risk of leaks below and avoids stripping out again later."],
          ["Are materials included in the price?", "That depends on how the proposal is prepared. Who selects and buys the tiles, fittings and sanitaryware, and which items the proposal covers, should be agreed in writing."],
        ],
        takeaway: "Brief: “Our bathroom is about … m². The problem is …; the plumbing is about … years old. We are / are not thinking of moving the bathroom. There is / is no other bathroom at home. We would like to discuss waterproofing, drain fall and the type of shower.”",
      },
    },
  },
  {
    slug: "ticari-mekan-kiralamadan-once",
    service: "ticari-mekan-tasarimi-ankara",
    alsoServices: ["kafe-restoran-tasarimi-ankara", "ofis-ic-mimarlik-ankara"],
    project: "butik-kafe",
    topic: "commercial",
    audiences: ["business"],
    card: "/media/projects/butik-kafe/interior.jpg",
    links: [LAW.condominium, LAW.planned],
    diagram: {
      src: `${D}/ticari-mekan-kiralama.svg`,
      numbered: true,
      caption: {
        tr: "Kira sözleşmesinden önce bir dükkânda bakılacak altı nokta. Şema ölçekli değildir; işletme türüne göre başka koşullar da olabilir.",
        en: "Six points to check in a shop before signing a lease. The drawing is not to scale; other conditions may apply depending on the business.",
      },
      items: {
        tr: [
          ["Binanın kullanımı", "Tapudaki nitelik, yönetim planı ve üst katlardaki konutlar işletme türünü sınırlayabilir."],
          ["Elektrik gücü", "Ekipman listesinin istediği güç mevcut abonelikle karşılanıyor mu?"],
          ["Su ve gider", "Mutfak, bar veya lavabo için su ve gider hattının yeri ve kapasitesi."],
          ["Baca ve havalandırma", "Pişirme yapılacaksa egzoz ve havalandırmanın nereden çıkacağı."],
          ["Giriş ve erişim", "Basamak, kapı genişliği, mal kabulü ve engelli erişimi."],
          ["Tabela ve cephe", "Tabela, vitrin ve cephe değişiklikleri için belediye ve bina kuralları."],
        ],
        en: [
          ["Use of the building", "The title deed status, management plan and homes upstairs can limit the type of business."],
          ["Electrical capacity", "Does the existing supply meet what the equipment list needs?"],
          ["Water and drainage", "Location and capacity of supply and waste for a kitchen, bar or basins."],
          ["Flue and ventilation", "If there is cooking, where extraction and ventilation will exit."],
          ["Entrance and access", "Steps, door width, deliveries and step-free access."],
          ["Signage and frontage", "Municipal and building rules for signs, shopfront and façade changes."],
        ],
      },
    },
    copy: {
      tr: {
        title: "Kafe, restoran, mağaza veya ofis kiralamadan önce mekânda nelere bakılır?",
        description: "İşyeri kiralamadan önce tapu niteliği, kat maliklerinin izni, elektrik gücü, baca, ruhsat çizimleri, takvim ve bütçe: açılışa kadar karar rehberi.",
        intro: "Bir işletmenin mekân maliyetlerinin önemli bir kısmı, kira sözleşmesi imzalanmadan önce verilen kararlarla belirlenir. Güzel bir vitrin, yetersiz elektrik gücünü, baca çıkışı olmayan bir mutfağı ya da tapuda mesken olarak görünen bir bağımsız bölümü telafi etmez. Bu rehber; kafe, restoran, pastane, mağaza, ofis veya stüdyo açmadan önce mekânı teknik ve işletme gözüyle değerlendirmenin adımlarını anlatır. Hukuki danışmanlık değildir; işletmenize özgü koşulları ilgili kurumlardan teyit edin.",
        sections: [
          {
            title: "1. Tapudaki niteliği ve yönetim planını kontrol edin",
            body: "Kat Mülkiyeti Kanunu'nun 24. maddesine göre tapuda mesken olarak görünen bağımsız bölümlerde lokanta, pastane, kahvehane gibi gıda ve eğlence yerleri ile dükkân ve imalathane gibi yerler ancak kat malikleri kurulunun oybirliğiyle verilecek kararla açılabilir. Aynı madde klinik ve poliklinik gibi kuruluşların, muayenehaneler dışında, kat mülkiyetindeki bağımsız bölümlerde kurulamayacağını söyler. Yönetim planı da ek kısıtlar getirebilir. Kiralamadan önce tapu niteliğini, yönetim planını ve gerekiyorsa kat maliklerinin kararını görmek, ileride ruhsat aşamasında yaşanabilecek sorunların önüne geçer.",
          },
          {
            title: "2. Altyapıyı ekipman listesiyle birlikte okuyun",
            body: "Kahve makinesi, fırın, soğutucular, davlumbaz veya spor ekipmanı mekânın elektrik gücünü, su ve gider ihtiyacını ve havalandırmasını belirler. Pişirme yapılacak bir işletmede egzozun nereden çıkacağı, üst katlarda konut varsa ayrıca önemlidir. Ekipman tedarikçilerinden teknik föyleri alıp mekânı bu listeyle değerlendirmek, sonradan pahalı altyapı değişikliklerini önler.",
            points: ["Mevcut elektrik aboneliğinin gücünü öğrenin.", "Mutfak ve bar için su ve gider hattının yerini görün.", "Baca veya egzoz çıkışının mümkün olup olmadığını sorun."],
          },
          {
            title: "3. Ruhsat ve kurum onaylarını baştan sorun",
            body: "İşyeri açma ve çalışma ruhsatı belediyeden alınır ve istenen belgeler işletmenin türüne göre değişir. Bazı işletmeler için itfaiye uygunluğu, gıda işletmeleri için ilgili il müdürlüğüne kayıt, sağlık veya eğitim kurumları için ayrı onaylar gerekebilir. Pek çok kurum başvuruda ölçekli bir yerleşim planı ister. Hangi çizimin, hangi ölçekte ve kim tarafından hazırlanıp imzalanacağını kiralamadan önce öğrenmek takvimi gerçekçi kılar.",
          },
          {
            title: "4. Müşteri, ekip ve tedarik akışını çizin",
            body: "Bir mekânda üç ayrı akış vardır: müşterinin girişten siparişe ve oturmaya yolu, ekibin mutfak, bar ve servis arasındaki hareketi, malın depoya girişi ve çöpün çıkışı. Bu akışlar birbirini kesmemelidir. Müşteri tuvaletinin mutfaktan geçmeden ulaşılabilir olması ya da mal kabulünün müşteri girişinden yapılmaması gibi kararlar, mekânın kiralamaya uygun olup olmadığını da gösterir.",
          },
          {
            title: "5. Markanızın mekânda neyi anlatacağını belirleyin",
            body: "Mekânın müşterinin aklında kalacak bir özelliği olmalı; ancak bu özellik işleyişi zorlaştırmamalıdır. Malzemeleri seçerken görünüm kadar temizlik kolaylığı ve yoğun kullanıma dayanıklılık da düşünülmelidir. Kedili Butik Kafe projesinde iç mekân, malzeme paleti ve marka karakteri aynı anlatının parçası olarak ele alındı; benzer bir yaklaşımı kendi işletmenizin ölçeğine göre konuşabiliriz.",
          },
          {
            title: "6. Takvimi kira başlangıcına göre kurun",
            body: "Kira ödenmeye başladığı halde işletmenin kapalı kaldığı her hafta bir maliyettir. Tasarım, ruhsat, tedarik ve uygulama sürelerini kira başlangıcıyla birlikte planlamak; mümkünse sözleşmede hazırlık dönemini konuşmak önemlidir. Özel üretim mobilya, tabela ve ekipman teslim süreleri açılış tarihini belirleyebilir.",
          },
          {
            title: "7. Bütçeyi ayrı başlıklarla düşünün",
            body: "Tasarım hizmeti, inşaat ve tesisat işleri, ekipman, mobilya, tabela ve grafik uygulamaları, ruhsat ve harçlar ayrı kalemlerdir. Bir teklifte hangilerinin bulunduğunu sorun; mevcut işletmeyi kapatmadan yenileme yapılacaksa bunun iş sırasına ve maliyete etkisini ayrıca konuşun.",
          },
        ],
        faq: [
          ["Mekânı kiralamadan önce mimarla görüşmek gerekli mi?", "Zorunlu değildir; ancak altyapı, ruhsat ve yerleşim açısından uygun olmayan bir mekânı fark etmek için en uygun zaman sözleşmeden öncesidir. Kısa bir değerlendirme, mekânın işletmenize uyup uymadığını görmenizi kolaylaştırır."],
          ["Konut olarak kullanılan bir daireyi ofis yapabilir miyim?", "Büro kullanımı Kat Mülkiyeti Kanunu'nun 24. maddesinde sayılan kısıtlı kullanımlar arasında yer almaz; ancak yönetim planı kısıt getirebilir ve ruhsat koşulları ayrıca değerlendirilmelidir. Tapu niteliği ve yönetim planı kontrol edilmeden karar verilmemelidir."],
          ["İşletmeyi kapatmadan yenileme yapılabilir mi?", "Bazı işler bölümlere ayrılarak ya da kapalı saatlerde yapılabilir; ancak mutfak, tesisat ve zemin gibi işler çoğu zaman kısa bir kapanış gerektirir. Bunu iş sırasıyla birlikte baştan planlarız."],
        ],
        takeaway: "Görüşme notu: “Ankara'da … bölgesinde yaklaşık … m² bir mekânda … açmayı düşünüyoruz. Kira sözleşmesini imzaladık / henüz imzalamadık. Ekipman listemiz … . Hedef açılış tarihimiz … . Mekânın altyapı ve ruhsat açısından uygunluğunu ve yerleşim seçeneklerini konuşmak istiyoruz.”",
      },
      en: {
        title: "What to check before leasing a café, restaurant, shop or office",
        description: "Before leasing commercial space: title deed status, owners' consent, power, flue, licence drawings, timeline and budget, all the way to opening.",
        intro: "A large share of a business's premises costs is decided before the lease is signed. A beautiful shopfront does not make up for insufficient electrical capacity, a kitchen with no flue route, or a unit registered as a residence on the title deed. This guide sets out how to assess a space with technical and operational eyes before opening a café, restaurant, patisserie, shop, office or studio. It is not legal advice; confirm the conditions for your business with the relevant authorities.",
        sections: [
          {
            title: "1. Check the title deed status and management plan",
            body: "Under Article 24 of the Condominium Law, food and entertainment uses such as restaurants, patisseries and coffee houses, as well as shops and workshops, may open in units registered as residences only by a unanimous decision of the owners' assembly. The same article says clinics and polyclinics, unlike doctors' consulting rooms, cannot be set up in condominium units at all. The management plan may add further restrictions. Seeing the title deed status, the management plan and, if needed, the owners' decision before leasing avoids problems at the licensing stage.",
          },
          {
            title: "2. Read the infrastructure against your equipment list",
            body: "Coffee machines, ovens, refrigeration, extraction hoods or gym equipment decide the electrical capacity, water and drainage and ventilation a space needs. For a business that cooks, where the extraction exits matters, especially with homes upstairs. Getting technical data sheets from suppliers and assessing the space against that list prevents costly infrastructure changes later.",
            points: ["Find out the capacity of the existing electricity supply.", "See where water and drainage are for the kitchen and bar.", "Ask whether a flue or extraction route is possible."],
          },
          {
            title: "3. Ask about licences and approvals at the start",
            body: "The business opening and operating licence is issued by the municipality, and the documents requested vary with the type of business. Some businesses need fire safety approval, food businesses registration with the relevant provincial directorate, and health or education facilities separate approvals. Many authorities ask for a scaled layout plan. Knowing which drawing is needed, at what scale, and who prepares and signs it before leasing makes the timeline realistic.",
          },
          {
            title: "4. Draw customer, staff and supply flows",
            body: "A space has three flows: the customer's route from entrance to ordering and seating, the staff's movement between kitchen, bar and service, and goods coming into storage with waste going out. These flows should not cross. Decisions such as reaching the customer toilet without passing the kitchen, or receiving deliveries away from the customer entrance, also show whether a space suits the lease.",
          },
          {
            title: "5. Decide what your brand should say in the space",
            body: "The space should have something customers remember, without making operations harder. When choosing materials, ease of cleaning and resistance to heavy use matter as much as appearance. In the Cat-themed Boutique Café, the interior, material palette and brand character were treated as one story; we can discuss a similar approach at your business's scale.",
          },
          {
            title: "6. Build the timeline around the lease start",
            body: "Every week the business stays closed while rent is due is a cost. Plan design, licensing, procurement and construction together with the lease start and, where possible, discuss a fit-out period in the lease. Lead times for bespoke furniture, signage and equipment can set the opening date.",
          },
          {
            title: "7. Treat the budget as separate headings",
            body: "Design services, construction and services work, equipment, furniture, signage and graphics, and licences and fees are separate headings. Ask which ones a proposal covers, and if you will renovate without closing an existing business, discuss its effect on sequence and cost separately.",
          },
        ],
        faq: [
          ["Do I need to speak to an architect before leasing?", "It is not compulsory, but the best time to spot a space unsuitable for infrastructure, licensing or layout reasons is before the contract. A short assessment helps you see whether the space fits your business."],
          ["Can I turn a flat used as a home into an office?", "Office use is not among the restricted uses listed in Article 24 of the Condominium Law, but the management plan may restrict it and licensing conditions must be assessed separately. Do not decide without checking the title deed status and management plan."],
          ["Can we renovate without closing the business?", "Some work can be split into zones or done outside opening hours, but kitchen, services and flooring work often needs a short closure. We plan this with the sequence of work from the start."],
        ],
        takeaway: "Brief: “We plan to open a … in about … m² in …, Ankara. We have / have not signed the lease. Our equipment list is … . Our target opening date is … . We would like to discuss whether the space suits our infrastructure and licensing needs, and the layout options.”",
      },
    },
  },
  {
    slug: "muteahhit-alici-profiline-gore-proje",
    service: "muteahhit-gelistirici-mimari-cozumler",
    alsoServices: ["apartman-konut-projesi-ankara", "3d-gorsellestirme-render-ankara"],
    project: "konut-projeleri",
    topic: "property",
    audiences: ["developer", "landowner"],
    card: "/media/projects/konut-projeleri/apartment.jpg",
    links: [LAW.planned, GOLBASI.ankaraEImar],
    diagram: {
      src: `${D}/alici-profili.svg`,
      numbered: true,
      caption: {
        tr: "Alıcıdan başlayan bir konut projesinin beş kararı. Şema ölçekli değildir ve gerçek bir projeyi göstermez.",
        en: "Five decisions in a housing project that starts from the buyer. The drawing is not to scale and does not show a real project.",
      },
      items: {
        tr: [
          ["Hedef alıcı", "Genç çift, çocuklu aile, yatırımcı: kimin alacağı plan kararlarının çıkış noktasıdır."],
          ["Daire tipi karması", "İmar hakları içinde hangi daire tiplerinin, hangi oranda yapılacağı."],
          ["Gün ışığı ve yön", "Her dairenin gün ışığından ve manzaradan pay alması."],
          ["Islak hacim düzeni", "Banyo ve mutfakların düşeyde ve yatayda gruplanması tesisatı sadeleştirir."],
          ["Satış sunumu", "Temsili görseller ve mobilyalı planlar, onaylı projeyle tutarlı hazırlanır."],
        ],
        en: [
          ["Target buyer", "Young couple, family with children, investor: who will buy is where plan decisions start."],
          ["Unit mix", "Which flat types, in what proportion, within the zoning rights."],
          ["Daylight and orientation", "Every flat getting its share of daylight and view."],
          ["Wet-room arrangement", "Stacking and grouping bathrooms and kitchens simplifies services."],
          ["Sales presentation", "Representative images and furnished plans prepared consistently with the approved design."],
        ],
      },
    },
    copy: {
      tr: {
        title: "Müteahhitler için: alıcı profiline göre daire planı, cephe ve satış sunumu",
        description: "Konut projesinde hedef alıcı, daire tipi karması, satılabilir plan, cephe kimliği, temsili görsellerin doğru kullanımı ve mimari-statik koordinasyon.",
        intro: "Bir konut projesinde imar hakkı kadar o hakkın nasıl kullanıldığı da önemlidir. Aynı emsal, farklı alıcılar için çok farklı daire planlarına dönüşebilir. Bu rehber; yap-sat veya kat karşılığı çalışan müteahhitler ve arsa sahipleri için alıcıdan başlayan bir proje kurgusunun adımlarını anlatır. Satış hızı veya fiyatı için garanti verilemez; amaç kararları gerekçeli ve tutarlı vermektir.",
        sections: [
          {
            title: "1. Önce alıcıyı tanımlayın",
            body: "Projeyi kim alacak? Bölgede ilk evini alan genç çiftler mi, çocuklu aileler mi, kiraya vermek için alan yatırımcılar mı? Her grubun oda sayısı, depolama, otopark ve ortak alan beklentisi farklıdır. Bölgedeki emlak danışmanlarıyla konuşmak ve satıştaki benzer projeleri incelemek, bu tanımı varsayımdan çıkarır.",
          },
          {
            title: "2. Daire tipi karmasını imar haklarıyla birlikte kurun",
            body: "Hangi daire tiplerinin hangi oranda yapılacağı emsal, kat adedi, otopark ve yönetmelikteki asgari oda ölçüleriyle birlikte değerlendirilir. Daire sayısını imar ve otopark hesabı yapılmadan sözleşmeye yazmak, sonradan plan kalitesinden ödün vermeye yol açabilir. Bu hesabın mantığını “Bir arsaya kaç daire sığar?” rehberinde adım adım anlattık.",
          },
          {
            title: "3. Satılabilir planın özellikleri",
            body: "Alıcı bir planı, içinde nasıl yaşayacağını hayal edebildiği ölçüde değerlendirir. Gün ışığı alan yaşam alanları, mobilyanın rahat yerleştiği odalar, yeterli depolama ve kullanılabilir bir balkon çoğu zaman metrekare kadar konuşulur. Banyo ve mutfakların düşeyde üst üste gelmesi tesisatı sadeleştirir ve uygulamayı kolaylaştırır.",
            points: ["Her plana mobilya yerleşimi çizilerek kullanılabilirlik denetlenmeli.", "Kolon yerleri daire planıyla birlikte düşünülmeli.", "Balkonlar ve teraslar gerçekten kullanılabilir ölçüde olmalı."],
          },
          {
            title: "4. Cephe kimliği ve malzeme",
            body: "Cephe, projenin uzaktan tanınan yüzüdür; fakat bakım, uygulanabilirlik ve maliyet de cephe kararının parçasıdır. İki üç cephe alternatifini aynı plan üzerinde karşılaştırmak, hedef alıcıya ve bütçeye uygun dengeyi bulmayı kolaylaştırır. Az sayıda, birbiriyle uyumlu malzeme bütüncül bir görünüm sağlar.",
          },
          {
            title: "5. Satış görselleri ve örnek daire",
            body: "3D görseller ve mobilyalı satış planları, henüz yapılmamış bir projeyi anlatmanın etkili yollarıdır. Bu görsellerin “temsili” olarak etiketlenmesi ve onaylı projeyle tutarlı olması gerekir; satışta gösterilen ile teslim edilen arasındaki fark güveni zedeler. Satış ofisi ve örnek dairenin projenin tasarım diliyle uyumlu olması anlatıyı güçlendirir.",
          },
          {
            title: "6. Mimari ve statik projeyi birlikte hazırlayın",
            body: "Kolon ve kiriş yerleşimi daire planlarını doğrudan etkiler. Mimari ve statik çözüm baştan birlikte ele alındığında hem plan kalitesi korunur hem de ruhsat aşamasındaki düzeltme turları azalır. U+ Studio'da mimar ve inşaat mühendisi aynı ekipte çalışır; diğer disiplinler projenin kapsamına göre koordine edilir.",
          },
        ],
        faq: [
          ["Yalnızca satış görselleri için çalışabilir miyiz?", "Evet. Yerleşim senaryosu, cephe ve görselleştirme ya da ruhsat projeleri gibi belirli bir aşamayı ayrı ayrı üstlenebiliriz. Görsellerin onaylı projeyle tutarlı olması için mevcut çizimleri baştan paylaşmanızı isteriz."],
          ["Kat karşılığı görüşmelerinde neye destek olursunuz?", "Görüşmelere temel oluşturacak yerleşim senaryolarını ve alan hesaplarını hazırlarız. Paylaşım oranları ve sözleşme hukuki ve ticari konulardır; bunlar için ilgili uzmanlarla çalışmanızı öneririz."],
          ["Teklif için hangi bilgiler gerekir?", "Tapu ve imar durumu, parsel bilgisi, hedef alıcı, düşünülen daire tipleri, takvim ve hangi aşamalarda destek istediğiniz ilk değerlendirme için yeterlidir."],
        ],
        takeaway: "Görüşme notu: “… bölgesinde … m² bir arsada konut projesi geliştiriyoruz. İmar durumu … . Hedef alıcımız … . Yerleşim senaryoları / cephe / ruhsat projeleri / satış görselleri için destek arıyoruz; hedef satış başlangıcımız … .”",
      },
      en: {
        title: "For contractors: flat plans, façades and sales presentation by buyer profile",
        description: "Target buyer, unit mix, saleable plans, façade identity, honest use of representative images and architectural-structural coordination in housing.",
        intro: "In a housing project, how zoning rights are used matters as much as the rights themselves. The same floor area ratio can become very different flat plans for different buyers. This guide sets out a buyer-led project process for contractors working on build-to-sell or land-for-flats terms and for landowners. Sales speed or price cannot be guaranteed; the aim is reasoned, consistent decisions.",
        sections: [
          {
            title: "1. Define the buyer first",
            body: "Who will buy? First-time young couples in the area, families with children, investors buying to let? Each group expects different room counts, storage, parking and shared spaces. Talking to local estate agents and looking at similar projects on sale turns this definition from an assumption into evidence.",
          },
          {
            title: "2. Build the unit mix with the zoning rights",
            body: "Which flat types are built, in what proportion, is assessed together with the floor area ratio, number of storeys, parking and the regulation's minimum room sizes. Writing the number of flats into a contract before zoning and parking calculations can force compromises in plan quality later. We explain the logic of this calculation step by step in the guide “How many flats fit on a plot?”.",
          },
          {
            title: "3. What makes a plan saleable",
            body: "Buyers judge a plan by how easily they can imagine living in it. Living areas with daylight, rooms where furniture fits comfortably, enough storage and a usable balcony are often discussed as much as square metres. Stacking bathrooms and kitchens vertically simplifies services and construction.",
            points: ["Draw furniture into every plan to test usability.", "Consider column positions together with flat plans.", "Make balconies and terraces genuinely usable in size."],
          },
          {
            title: "4. Façade identity and materials",
            body: "The façade is the project's face from a distance, but maintenance, buildability and cost are part of the façade decision too. Comparing two or three façade options on the same plan makes it easier to find the right balance for the target buyer and budget. A small number of compatible materials gives a coherent appearance.",
          },
          {
            title: "5. Sales images and the show flat",
            body: "3D images and furnished sales plans are effective ways to explain a project not yet built. These images should be labelled as representative and be consistent with the approved design; a gap between what was shown in sales and what is delivered damages trust. A sales office and show flat in the project's design language strengthen the story.",
          },
          {
            title: "6. Prepare architectural and structural designs together",
            body: "Column and beam layouts directly affect flat plans. When architectural and structural solutions are developed together from the start, plan quality is protected and revision rounds at permit stage are reduced. At U+ Studio the architect and the civil engineer work in the same team, and the other disciplines are coordinated according to the project's scope.",
          },
        ],
        faq: [
          ["Can we work with you only on sales images?", "Yes. We can take on a single stage such as layout scenarios, façade and visualisation, or permit designs. So that images match the approved design, we ask you to share existing drawings at the start."],
          ["How do you support land-for-flats negotiations?", "We prepare layout scenarios and area calculations to base negotiations on. Share ratios and contracts are legal and commercial matters, for which we recommend working with the relevant specialists."],
          ["What information do you need for a proposal?", "The title deed and zoning status, parcel details, target buyer, intended flat types, timeline and the stages where you want support are enough for a first assessment."],
        ],
        takeaway: "Brief: “We are developing housing on a … m² plot in … . The zoning status is … . Our target buyer is … . We are looking for support with layout scenarios / façade / permit designs / sales images; our intended sales start is … .”",
      },
    },
  },
  {
    slug: "kiraya-vermeden-once-yenileme",
    service: "tadilat-donusum-ankara",
    alsoServices: ["emlak-danismanlari-icin-tasarim", "muhendislik-danismanligi-ankara"],
    project: "konut-uygulama",
    topic: "property",
    audiences: ["investor", "agent", "homeowner"],
    card: "/media/projects/konut-uygulama/hall.jpg",
    links: [LAW.planned, LAW.condominium],
    copy: {
      tr: {
        title: "Kiraya vermeden veya satmadan önce yenileme: hangi kapsam, hangi sırayla?",
        description: "Mülk sahibi ve yatırımcılar için: hedef, önce teknik sorunlar, dayanıklı malzeme, hafif-orta-kapsamlı senaryolar, boş kalma süresi ve izinler.",
        intro: "Kiraya verilecek veya satılacak bir mülkte yapılacak yenileme, kendi oturacağınız bir evden farklı düşünülür. Amaç kişisel zevk değil; mülkün hedeflenen kiracıya ya da alıcıya uygun, sorunsuz ve bakımı kolay hale gelmesidir. Bu rehber, kapsamı seçerken izlenecek sırayı anlatır. Yenilemenin kira veya satış fiyatına etkisi önceden kesin olarak bilinemez; bu konuda bölgeyi bilen bir emlak danışmanının veya değerleme uzmanının görüşünü almanızı öneririz.",
        sections: [
          {
            title: "1. Hedefi tek cümleyle yazın",
            body: "“Uzun dönem aile kiracısına vereceğim”, “öğrenciye kiralayacağım”, “altı ay içinde satmak istiyorum” veya “birkaç yıl kiraya verip sonra kendim oturacağım”: Her hedef farklı bir kapsam ve malzeme seviyesi demektir. Hedef netleşmeden yapılan yenileme ya fazla ya da yetersiz kalır.",
          },
          {
            title: "2. Önce görünmeyen sorunları çözün",
            body: "Nem, sızıntı, eski elektrik tesisatı, bozuk doğrama veya yetersiz ısıtma; kiracının da alıcının da ilk fark ettiği ve en çok şikâyet ettiği konulardır. Yeni boya ya da dolap, bu sorunları gizlemez; kısa sürede yeniden ortaya çıkarır. Bütçeyi önce bu başlıklara ayırmak, sonradan çıkacak tamir masraflarını ve anlaşmazlıkları azaltır.",
            points: ["Islak hacimlerde ve dış duvarlarda nem kontrolü yaptırın.", "Elektrik panosu ve tesisatın güncelliğini öğrenin.", "Doğramaların kapanıp kapanmadığını ve ısı kaybını kontrol edin."],
          },
          {
            title: "3. Dayanıklı ve kolay bakımlı malzeme seçin",
            body: "Kiralık bir mülk sık el değiştirebilir. Silinebilir boya, darbeye dayanıklı zemin, yedeği kolay bulunan standart ürünler ve sade renkler bakım maliyetini düşürür. Satışa hazırlanan bir mülkte ise nötr ve ferah bir görünüm, alıcının mekânı kendi eşyalarıyla hayal etmesini kolaylaştırabilir.",
          },
          {
            title: "4. Senaryoları yan yana koyun",
            body: "Kararı kolaylaştırmanın en iyi yolu en az iki senaryoyu karşılaştırmaktır. Her senaryo için kapsamı, maliyet kalemlerini, süreyi, izin gerekip gerekmediğini ve belirsizlikleri ayrı yazın. Mülkün yenileme süresince boş kalacağı süre de, gelir olmadan geçen bir dönem olarak hesaba katılmalıdır.",
            points: ["Hafif: temizlik, boya, küçük onarımlar, aydınlatma.", "Orta: mutfak veya banyo yüzeyleri, zemin, doğrama gibi seçili yenilemeler.", "Kapsamlı: tesisat, yerleşim ve ıslak hacimleri kapsayan dönüşüm."],
          },
          {
            title: "5. İzinleri ve ortak alan kurallarını unutmayın",
            body: "Taşıyıcı sisteme, dış cepheye veya ıslak hacimlerin yerine dokunan işler Planlı Alanlar İmar Yönetmeliği'ne göre esaslı tadilat sayılır ve ruhsat gerektirir. Kat mülkiyetine tabi bir binada ortak alanlarda veya dış görünüşte yapılacak değişiklikler için Kat Mülkiyeti Kanunu'nun 19. maddesi uyarınca kat maliklerinin onayı gerekir. Satışta alıcılar çoğu zaman projeye aykırı değişiklikleri sorar; bu nedenle yapılan işin onaylı projeyle uyumlu olması önemlidir.",
          },
          {
            title: "6. Sunumu yenilemenin parçası olarak planlayın",
            body: "Kiralık mülkte eşyalı mı eşyasız mı verileceği, satılık mülkte boş mu eşyalı mı gösterileceği kapsamı etkiler. Fotoğraf çekiminden önce düzen, ışık ve temizlik sonucu doğrudan etkiler. Yenileme yapılmadan potansiyeli göstermek isteniyorsa 3D konsept görseller kullanılabilir; bunlar mutlaka “konsept” olarak etiketlenmelidir.",
          },
        ],
        faq: [
          ["Yenileme kirayı veya satış fiyatını ne kadar artırır?", "Bunu önceden kesin söylemek mümkün değildir. Bölgedeki benzer mülkler, mülkün mevcut durumu ve piyasa koşulları belirleyicidir. Biz kapsamı, maliyet kalemlerini ve izin durumunu netleştiririz; fiyat beklentisi için bölgeyi bilen bir emlak danışmanı veya değerleme uzmanıyla birlikte değerlendirmenizi öneririz."],
          ["Kiraya vermeden önce boya şart mı?", "Zorunlu değildir; ancak temiz ve bakımlı bir görünüm kiracının mülkü değerlendirmesini kolaylaştırır. Boyadan önce nem ve çatlak gibi sorunların giderilmesi gerekir; aksi halde kısa sürede yeniden ortaya çıkarlar."],
          ["Su baskını veya hasar sonrası yenileme nasıl planlanır?", "Önce hasarın kaynağı bulunur ve giderilir, nemin kuruması beklenir; ardından etkilenen zemin, duvar ve tesisat değerlendirilir. Sigorta süreci varsa hasar tespitinden önce söküm yapılmamalıdır."],
        ],
        takeaway: "Görüşme notu: “… bölgesinde … m² bir dairemiz / villamız var. Hedefimiz kiraya vermek / satmak; hedef kiracı veya alıcı … . Bilinen sorunlar … . Hafif ve kapsamlı iki senaryonun kapsamını, izin durumunu ve maliyet kalemlerini karşılaştırmak istiyoruz.”",
      },
      en: {
        title: "Renovating before letting or selling: which scope, in what order?",
        description: "For owners and investors: setting the goal, fixing technical problems first, durable materials, light-medium-full scenarios, vacancy time and permits.",
        intro: "Renovating a property to let or sell is approached differently from a home you will live in. The aim is not personal taste but making the property suitable, trouble-free and easy to maintain for the intended tenant or buyer. This guide sets out the order to follow when choosing the scope. The effect of renovation on rent or sale price cannot be known for certain in advance; we recommend asking a local estate agent or valuer.",
        sections: [
          {
            title: "1. Write the goal in one sentence",
            body: "“I will let to a long-term family tenant”, “I will let to students”, “I want to sell within six months” or “I will let for a few years and then live there”: each goal means a different scope and material level. Renovation without a clear goal ends up either too much or too little.",
          },
          {
            title: "2. Fix the hidden problems first",
            body: "Damp, leaks, old wiring, faulty windows or poor heating are what tenants and buyers notice first and complain about most. New paint or units do not hide these problems; they soon reappear. Putting the budget into these headings first reduces later repair costs and disputes.",
            points: ["Have wet rooms and external walls checked for damp.", "Find out how up to date the electrical panel and wiring are.", "Check whether windows close properly and how much heat is lost."],
          },
          {
            title: "3. Choose durable, easy-care materials",
            body: "A rental property may change hands often. Washable paint, impact-resistant flooring, standard products with easy-to-find replacements and simple colours lower maintenance costs. For a property prepared for sale, a neutral, airy look can help buyers imagine the space with their own belongings.",
          },
          {
            title: "4. Put scenarios side by side",
            body: "The best way to decide is to compare at least two scenarios. For each, write the scope, cost headings, duration, whether a permit is needed and the uncertainties. The time the property stands empty during the work should also be counted as a period without income.",
            points: ["Light: cleaning, paint, small repairs, lighting.", "Medium: selected renewals such as kitchen or bathroom surfaces, flooring, windows.", "Full: transformation covering services, layout and wet rooms."],
          },
          {
            title: "5. Remember permits and common-area rules",
            body: "Work touching the structure, the external façade or the location of wet rooms counts as a major alteration under the Planned Areas Zoning Regulation and requires a permit. In a condominium building, changes to common areas or the exterior require the owners' approval under Article 19 of the Condominium Law. Buyers often ask about changes that deviate from the approved drawings, so the work should be consistent with them.",
          },
          {
            title: "6. Plan the presentation as part of the renovation",
            body: "Whether a rental is let furnished or unfurnished, or a sale property shown empty or furnished, affects the scope. Before photography, order, light and cleanliness directly affect the result. To show potential without renovating, 3D concept images can be used; they must always be labelled as concepts.",
          },
        ],
        faq: [
          ["How much will renovation raise the rent or sale price?", "It is not possible to say for certain in advance. Comparable properties in the area, the property's current condition and market conditions decide it. We clarify the scope, cost headings and permit status; for price expectations, we recommend assessing them with a local estate agent or valuer."],
          ["Is repainting essential before letting?", "It is not compulsory, but a clean, well-kept appearance makes it easier for tenants to assess the property. Damp and cracks must be dealt with before painting, or they will soon reappear."],
          ["How is renovation planned after a flood or damage?", "First the source of damage is found and fixed and the property is allowed to dry; then affected floors, walls and services are assessed. If there is an insurance claim, nothing should be stripped out before the damage assessment."],
        ],
        takeaway: "Brief: “We have a … m² flat / villa in … . Our goal is to let / sell; the intended tenant or buyer is … . Known problems are … . We would like to compare the scope, permit status and cost headings of a light and a full scenario.”",
      },
    },
  },
  {
    slug: "mimar-ic-mimar-muhendis-farki",
    service: "incek-golbasi-mimarlik-ofisi",
    alsoServices: ["ic-mimarlik-ankara", "muhendislik-danismanligi-ankara"],
    project: "konut-uygulama",
    topic: "start",
    audiences: ["homeowner", "villa", "landowner", "business"],
    card: `${D}/mimar-muhendis-rolleri.svg`,
    diagram: {
      src: `${D}/mimar-muhendis-rolleri.svg`,
      numbered: true,
      caption: {
        tr: "Bir yapının çiziminde yer alan başlıca uzmanlıklar. Şema ölçekli değildir; hangi uzmanlığın gerektiği işin kapsamına bağlıdır.",
        en: "The main disciplines involved in designing a building. The drawing is not to scale; which are needed depends on the scope.",
      },
      items: {
        tr: [
          ["Mimar", "Yapının bütününü, yerleşimi ve cepheyi tasarlar; ruhsata esas mimari projeyi hazırlar."],
          ["İç mimar", "İç mekân kurgusunu, malzeme, aydınlatma, mobilya ve detay kararlarını geliştirir."],
          ["İnşaat mühendisi", "Taşıyıcı sistemi hesaplar ve statik projeyi hazırlar."],
          ["Makine mühendisi", "Isıtma, sıhhi tesisat ve havalandırma projelerini hazırlar."],
          ["Elektrik mühendisi", "Elektrik tesisatı ve aydınlatma devrelerinin projesini hazırlar."],
          ["Harita ve zemin", "Aplikasyon ölçümü harita mühendisliğinin, zemin etüdü ayrı bir uzmanlığın işidir."],
        ],
        en: [
          ["Architect", "Designs the whole building, layout and façade; prepares the architectural design for the permit."],
          ["Interior architect", "Develops the interior arrangement, materials, lighting, furniture and details."],
          ["Civil engineer", "Calculates the structure and prepares the structural design."],
          ["Mechanical engineer", "Designs heating, plumbing and ventilation."],
          ["Electrical engineer", "Designs the electrical installation and lighting circuits."],
          ["Survey and ground", "Setting out is surveying work; the soil survey is a separate specialism."],
        ],
      },
    },
    copy: {
      tr: {
        title: "Mimar mı, iç mimar mı, mühendis mi? Hangi iş için kiminle konuşmalı?",
        description: "Mimar, iç mimar ve mühendislerin rolleri; yeni villa, daire yenileme, duvar kaldırma, ticari mekân ve satın alma öncesi hangi uzmanlık gerekir?",
        intro: "Bir projeye başlarken ilk soru çoğu zaman “kime gitmeliyim?” olur. Mimar, iç mimar, mühendis, dekoratör ve uygulama firması farklı sorumluluklar taşır; yanlış kişiyle başlamak zaman kaybettirebilir ya da gereken bir değerlendirmenin atlanmasına yol açabilir. Bu rehber, hangi işte hangi uzmanlığın devreye girdiğini sade bir dille anlatır.",
        sections: [
          {
            title: "1. Kim neyi çizer?",
            body: "Mimar yapının bütününü, iç ve dış ilişkilerini, yerleşimini ve cephesini tasarlar; yeni bir yapı için ruhsata esas mimari projeyi hazırlar. İç mimar iç mekânın kurgusunu, malzemelerini, aydınlatmasını, mobilyasını ve detaylarını geliştirir. İnşaat mühendisi taşıyıcı sistemi hesaplar ve statik projeyi; makine mühendisi ısıtma, sıhhi tesisat ve havalandırmayı; elektrik mühendisi elektrik tesisatını çizer. Aplikasyon ölçümü harita mühendisliğinin, zemin etüdü ise ayrı bir uzmanlığın işidir.",
          },
          {
            title: "2. İşinize göre kiminle başlamalı?",
            body: "Hangi uzmanlığın gerektiği, işin taşıyıcı sisteme, dış cepheye ve tesisata dokunup dokunmadığına bağlıdır. Aşağıdaki eşleştirme genel bir başlangıç noktasıdır; kesin ihtiyaç mevcut durum görülerek belirlenir.",
            points: [
              "Arsaya yeni ev veya bina: mimar; ruhsat için statik, mekanik ve elektrik projeleriyle birlikte.",
              "Daire veya villada iç mekân yenileme: iç mimar veya mimar; tesisat değişiyorsa ilgili mühendislik.",
              "Duvar kaldırma veya açıklık genişletme: önce inşaat mühendisinin taşıyıcı sistem değerlendirmesi.",
              "Cephe yenileme: mimar; yalıtım ve doğrama kararlarıyla birlikte.",
              "Kafe, restoran veya ofis: iç mimar; havalandırma ve elektrik gücü için mühendislik koordinasyonu.",
              "Satın alma öncesi değerlendirme: mimar ve inşaat mühendisi birlikte.",
            ],
          },
          {
            title: "3. Dekoratör ve uygulama firması nerede durur?",
            body: "Dekorasyon; mobilya, tekstil, renk ve aksesuar seçimiyle mevcut mekânı düzenlemeye odaklanır. Uygulama firması veya ustalar ise tasarımı sahada hayata geçirir. Teknik çizim olmadan yürütülen işlerde kararlar çoğu zaman sahada ve sözlü verilir; bu da kapsamın ve maliyetin takibini zorlaştırabilir. Tasarım, çizim ve uygulamanın kim tarafından yapılacağını ayrı ayrı netleştirmek bu yüzden önemlidir.",
          },
          {
            title: "4. Disiplinler arasındaki uyum",
            body: "Bir mimari plan, kolonların yerini; bir mutfak tasarımı, gider ve havalandırmanın yerini dikkate almadan çizilirse sahada değişiklik kaçınılmaz olur. Ruhsat sürecinde de mimari, statik, mekanik ve elektrik projelerinin birbiriyle çelişmemesi gerekir. U+ Studio'da mimar ve inşaat mühendisi aynı ekipte çalışır; diğer disiplinler projenin kapsamına göre koordine edilir.",
          },
          {
            title: "5. Bir ofisle görüşürken sorulacaklar",
            body: "Ofisin hangi disiplinleri kendi bünyesinde yürüttüğünü, hangilerini dışarıdan koordine ettiğini ve projeyi kimin imzalayacağını sormak, kapsamı baştan netleştirir.",
            points: ["Bu iş için hangi uzmanlıklar gerekiyor?", "Hangileri ekip içinde, hangileri dışarıdan koordine ediliyor?", "Sahadaki sorulara kim cevap verecek?", "Teklifte hangi çizimler ve teslimler yer alıyor?"],
          },
        ],
        faq: [
          ["İç mekân yenilemesi için mimar mı, iç mimar mı?", "Taşıyıcı sisteme ve dış cepheye dokunmayan bir iç mekân yenilemesinde iç mimar ya da iç mekân deneyimi olan bir mimar işi yürütebilir. Duvar kaldırma veya ıslak hacim değişikliği varsa inşaat mühendisi ve izin değerlendirmesi de gerekir."],
          ["Duvar kaldırmak için kime danışmalıyım?", "Önce duvarın taşıyıcı olup olmadığının bir inşaat mühendisi tarafından değerlendirilmesi gerekir. Taşıyıcı elemana dokunan işler esaslı tadilat sayılır ve ruhsata tabidir."],
          ["U+ Studio hangi işleri üstleniyor?", "Mimari tasarım, iç mimarlık, yenileme ve mühendislik danışmanlığı başta olmak üzere hizmet sayfalarımızda yer alan işleri yürütüyoruz. Projenizin hangi uzmanlıkları gerektirdiğini ilk görüşmede birlikte belirleriz."],
        ],
        takeaway: "Görüşme notu: “… için … yapmak istiyoruz. Taşıyıcı sisteme / cepheye / tesisata dokunup dokunmayacağını bilmiyoruz. Hangi uzmanlıkların gerektiğini ve bunların nasıl koordine edileceğini konuşmak istiyoruz.”",
      },
      en: {
        title: "Architect, interior architect or engineer? Who to talk to for which job",
        description: "Roles of architects, interior architects and engineers, and which discipline a new villa, flat renovation, wall removal, shop or pre-purchase review needs.",
        intro: "When starting a project, the first question is often “who should I go to?”. Architects, interior architects, engineers, decorators and contractors carry different responsibilities; starting with the wrong person can waste time or lead to a needed assessment being skipped. This guide explains, in plain language, which discipline comes in for which job.",
        sections: [
          {
            title: "1. Who draws what?",
            body: "The architect designs the whole building, its internal and external relationships, layout and façade, and prepares the architectural design for a permit on a new building. The interior architect develops the interior arrangement, materials, lighting, furniture and details. The civil engineer calculates the structure and prepares the structural design; the mechanical engineer designs heating, plumbing and ventilation; the electrical engineer designs the electrical installation. Setting out is surveying work, and the soil survey is a separate specialism.",
          },
          {
            title: "2. Who to start with, by job",
            body: "Which discipline is needed depends on whether the work touches the structure, the external façade and the services. The pairing below is a general starting point; the exact need is decided after seeing the existing condition.",
            points: [
              "New house or building on a plot: architect, with structural, mechanical and electrical designs for the permit.",
              "Interior renovation of a flat or villa: interior architect or architect; engineering if services change.",
              "Removing a wall or widening an opening: first a civil engineer's structural assessment.",
              "Façade renovation: architect, together with insulation and window decisions.",
              "Café, restaurant or office: interior architect, with engineering coordination for ventilation and power.",
              "Pre-purchase assessment: architect and civil engineer together.",
            ],
          },
          {
            title: "3. Where do decorators and contractors fit?",
            body: "Decoration focuses on arranging an existing space through furniture, textiles, colour and accessories. A contractor or tradespeople bring the design to life on site. Where work proceeds without technical drawings, decisions are often made on site and verbally, which can make scope and cost harder to track. That is why it matters to clarify separately who does the design, the drawings and the construction.",
          },
          {
            title: "4. Coordination between disciplines",
            body: "If an architectural plan ignores column positions, or a kitchen design ignores drainage and ventilation, changes on site become inevitable. In the permit process, architectural, structural, mechanical and electrical designs must not contradict each other. At U+ Studio the architect and the civil engineer work in the same team, and the other disciplines are coordinated according to the project's scope.",
          },
          {
            title: "5. Questions to ask an office",
            body: "Asking which disciplines an office runs in-house, which it coordinates externally and who will sign the design clarifies the scope from the start.",
            points: ["Which disciplines does this job need?", "Which are in-house and which are coordinated externally?", "Who will answer questions on site?", "Which drawings and deliverables does the proposal include?"],
          },
        ],
        faq: [
          ["Architect or interior architect for an interior renovation?", "For an interior renovation that does not touch the structure or external façade, an interior architect or an architect with interior experience can lead the work. If walls are removed or wet rooms change, a civil engineer and a permit assessment are also needed."],
          ["Who should I consult about removing a wall?", "First, a civil engineer needs to assess whether the wall is structural. Work touching a structural element counts as a major alteration and requires a permit."],
          ["Which work does U+ Studio take on?", "We carry out the work described on our service pages, chiefly architectural design, interior architecture, renovation and engineering consultancy. We decide together at the first meeting which disciplines your project needs."],
        ],
        takeaway: "Brief: “We want to … at … . We do not know whether it will touch the structure / façade / services. We would like to discuss which disciplines are needed and how they will be coordinated.”",
      },
    },
  },
];
