import type { StudioGuide } from "./guides";

export const renovationGuide: StudioGuide = {
  slug: "ankara-ev-yenileme-hazirlik",
  service: "tadilat-donusum-ankara",
  project: "villa-donusumu",
  topic: "renovation",
  audiences: ["homeowner", "villa"],
  card: "/media/projects/villa-donusumu/before.jpg",
  copy: {
    tr: {
      title: "Ankara’da ev yenilemeye başlamadan önce 5 karar",
      description: "Ev ve villa yenilemesinde mevcut durum, korunacak alanlar, tasarım ve yapım bütçesi, taşınma takvimi ve uygulama kapsamı için hazırlık rehberi.",
      intro: "Bir evi yenileme kararı çoğu zaman mutfak, banyo ya da salonla başlar. Ancak iyi bir başlangıç, önce hangi sorunu çözeceğinizi ve hangi kararların birbirine bağlı olduğunu görmektir. Ankara’daki daireniz veya villanız için ilk görüşmeye şu beş başlıkla hazırlanabilirsiniz.",
      sections: [
        { title: "1. Korunacakları ve değişecekleri ayırın", body: "Her şeyi değiştirmek zorunda değilsiniz. Günlük kullanımda sizi zorlayan alanları, kalmasını istediğiniz mobilyaları ve korunmasını önemsediğiniz malzemeleri ayrı yazın. Böylece tasarım görüşmesi yalnızca yeni ürün seçimine dönüşmez.", points: ["Depolama, dolaşım ve gün ışığıyla ilgili sorunları not edin.", "Mevcut planı ve güncel fotoğrafları hazırlayın; ölçüsü bilinmeyen alanları tahminle doldurmayın.", "Aynı evde yaşamaya devam edip etmeyeceğinizi belirtin."] },
        { title: "2. Görünen yüzeyin arkasını konuşun", body: "Yeni bir kaplama seçmeden önce mevcut tesisat, nem, havalandırma ve elektrik ihtiyaçlarının değerlendirilmesi gerekebilir. Duvar değişikliği gibi talepleri yalnızca bir fotoğraf üzerinden karara bağlamayın. Mevcut yapının durumu ve gerekli uzmanlıklar proje özelinde değerlendirilmelidir; bu rehber teknik inceleme yerine geçmez." },
        { title: "3. Bütçeyi üç ayrı başlıkla ele alın", body: "Tasarım ve çizim hizmeti, uygulama işleri, mobilya ve ekipman aynı maliyet değildir. Teklif isterken bu başlıkların hangilerinin kapsandığını sorun. Söküm sonrası ortaya çıkabilecek ihtiyaçlar ve sonradan eklenen işler için nasıl karar alınacağını da başlangıçta konuşun.", points: ["Öncelikli işler ile ertelenebilir istekleri ayırın.", "Malzeme seçimi, satın alma ve montaj sorumlularını netleştirin.", "Belirtilmeyen bir kalemi dahil varsaymak yerine sorulacak olarak işaretleyin."] },
        { title: "4. Başlangıç tarihinden önce karar takvimini kurun", body: "Taşınma hedefiniz, binadaki çalışma saatleri, tasarım kararları ve ürün tedariki birlikte düşünülmelidir. Özel üretim mobilya veya seçilen bir ürün, iş sırasını etkileyebilir. Kesin süreyi kapsam ve mevcut durum bilinmeden belirlemek yerine hangi kararın ne zaman gerektiğini sorun." },
        { title: "5. Tasarımdan uygulamaya geçişi tanımlayın", body: "Bir 3D görsel mekânın hissini anlatır; uygulama için gereken çizim ve detayların yerine tek başına geçmez. Hangi dokümanların hazırlanacağını, uygulamayı kimin yürüteceğini ve sahadaki soruların kime yöneltileceğini yazılı kapsamda görünür kılın. U+ Studio ile ilk görüşmede mevcut durumu, ihtiyacınızı ve hangi hizmetlerin değerlendirileceğini konuşabilirsiniz." },
      ],
      takeaway: "Görüşme notu: “Ankara’da … bölgesindeki evimizde … alanlarını yenilemek istiyoruz. Koruyacaklarımız …, en önemli sorunumuz …, taşınma hedefimiz … . Tasarım ve uygulama için kapsamı ayrı konuşmak istiyoruz.”",
    },
    en: {
      title: "Five decisions before renovating your home in Ankara",
      description: "Prepare for a home or villa renovation: existing conditions, what to keep, design and construction budgets, moving dates and construction responsibilities.",
      intro: "A renovation often starts with a kitchen, bathroom or living room. A useful first step is identifying the problem you want to solve and the decisions that depend on one another. Bring these five topics to the first conversation about your Ankara apartment or villa.",
      sections: [
        { title: "1. Separate what to keep from what to change", body: "You do not have to replace everything. List the spaces that cause daily difficulties, furniture you want to keep and materials you value. This keeps the design conversation from becoming only a shopping list.", points: ["Note problems with storage, circulation and daylight.", "Gather existing plans and recent photographs; identify unknown dimensions rather than guessing.", "Explain whether you intend to live in the home during the work."] },
        { title: "2. Discuss what is behind the finishes", body: "Before choosing a new finish, existing plumbing, damp, ventilation and electrical needs may require assessment. Avoid deciding on changes such as removing walls from a photograph alone. Existing conditions and the specialists needed must be assessed for the particular project; this guide does not replace a technical inspection." },
        { title: "3. Discuss three separate budget headings", body: "Design and drawing services, construction work, and furniture and equipment are different costs. Ask which are covered when requesting a proposal. Discuss how decisions will be made about conditions discovered after stripping out and work added later.", points: ["Separate essential work from wishes that could wait.", "Clarify responsibilities for selection, purchasing and installation.", "Mark unspecified items as questions rather than assuming they are included."] },
        { title: "4. Plan decisions before choosing a start date", body: "Your intended moving date, building working hours, design decisions and product lead times need consideration together. Bespoke furniture or a chosen product can affect the order of work. Before expecting a firm duration, ask which decisions are needed at each stage and how existing conditions will be assessed." },
        { title: "5. Define the handover from design to construction", body: "A 3D image communicates the feel of a space; it does not replace construction drawings and details. Make the documentation, construction responsibilities and contact for site questions visible in the written scope. A first conversation with U+ Studio can explore existing conditions, your needs and the services to consider." },
      ],
      takeaway: "Brief: “We want to renovate … in our home in …, Ankara. We want to keep …, our biggest difficulty is …, and our intended moving date is … . We would like to discuss design and construction as separate scopes.”",
    },
  },
};
