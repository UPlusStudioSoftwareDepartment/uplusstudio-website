import type { Locale } from "./i18n-config";

type ScopeCopy = Readonly<{
  title: string;
  intro: string;
  caption: string;
  note: string;
  contact: string;
  guide: string;
  stages: readonly Readonly<{ title: string; summary: string; detail: string }>[];
}>;

export const projectScope = {
  tr: {
    title: "Görselden uygulamaya: neye ihtiyacınız var?",
    intro: "Yeni bir ev, yenilenecek bir oda veya açılacak bir işletme. Aynı fikir, farklı aşamalarda farklı hizmetlere ihtiyaç duyar. Başlangıç noktanızı seçin.",
    caption: "İhtiyaç → yerleşim → detay. Süreci anlatan şematik çizimdir; tamamlanmış bir proje değildir.",
    note: "Tasarım hizmeti; yapım, mobilya ve ekipman bütçesinden ayrı değerlendirilir. Teslimler, revizyonlar ve saha hizmetleri teklifin kapsamıyla netleşir.",
    contact: "İhtiyacınızı birlikte netleştirelim",
    guide: "Ev yenileme hazırlık rehberi",
    stages: [
      { title: "Henüz fikrimi netleştiriyorum", summary: "Önce ihtiyaç ve yerleşim", detail: "Mekânın mevcut durumunu, kullanıcı sayısını ve günlük akışı konuşarak başlayın. Yerleşim ve konsept seçenekleri, hangi alanların değişmesi gerektiğini görmenize yardımcı olur. Görüşmeye konum, yaklaşık alan ve birkaç güncel fotoğrafla gelebilirsiniz." },
      { title: "Nasıl görüneceğine karar vermek istiyorum", summary: "Malzeme, ışık ve 3D anlatım", detail: "Yerleşim kararıyla birlikte renk, malzeme, aydınlatma ve mobilya ilişkisini değerlendirin. Görselleştirme, alternatifleri anlamayı kolaylaştırır. Hangi mekânların görselleştirileceğini ve hangi kararların ayrıca detaylandırılacağını sorun." },
      { title: "Uygulamaya hazırlanıyorum", summary: "Teknik detay ve sorumluluklar", detail: "Uygulama çizimleri, özel imalat detayları ve diğer disiplinlerle koordinasyon ihtiyacını konuşun. Satın alma, şantiye takibi ve uygulama yönetiminin kimde olduğunu belirleyin. Bu hizmetlerin tasarım teslimine kendiliğinden dahil olduğunu varsaymayın." },
    ],
  },
  en: {
    title: "From visual to construction: what do you need?",
    intro: "A new home, a room to renovate or a business to open. The same idea needs different services at different stages. Choose your starting point.",
    caption: "Brief → layout → detail. A schematic illustration of the process, not a completed project.",
    note: "Design services are considered separately from construction, furniture and equipment budgets. Deliverables, revisions and site services are defined by the proposal scope.",
    contact: "Let's clarify what your project needs",
    guide: "Home renovation preparation guide",
    stages: [
      { title: "I am still defining the idea", summary: "Start with the brief and layout", detail: "Start with existing conditions, the number of users and daily routines. Layout and concept options help identify which areas need to change. Bring the location, approximate area and a few recent photographs to the conversation." },
      { title: "I want to decide how it will look", summary: "Materials, light and 3D visuals", detail: "Consider colour, materials, lighting and furniture alongside the layout. Visualisation helps you understand alternatives. Ask which spaces will be visualised and which decisions will need further detailing." },
      { title: "I am preparing for construction", summary: "Technical details and responsibilities", detail: "Discuss construction drawings, bespoke details and coordination with other disciplines. Establish who handles purchasing, site follow-up and construction management. Do not assume these services are automatically included in a design delivery." },
    ],
  },
} satisfies Record<Locale, ScopeCopy>;
