import type { Locale } from "./i18n-config";
import type { ExplainerId } from "./explainers";
import { renovationGuide } from "./renovationGuide";
import { extraGuides } from "./guidesExtra";

/** Topic shelves on the guides hub, in display order. */
export const GUIDE_TOPICS = ["start", "build", "renovation", "interior", "property", "commercial", "local"] as const;
export type GuideTopic = (typeof GUIDE_TOPICS)[number];

/** Who each guide is written for; each reader type points to the service page written for them. */
export const GUIDE_AUDIENCES = ["homeowner", "villa", "landowner", "agent", "developer", "investor", "business"] as const;
export type GuideAudience = (typeof GUIDE_AUDIENCES)[number];
export const AUDIENCE_SERVICE: Record<GuideAudience, string> = {
  homeowner: "ic-mimarlik-ankara",
  villa: "tadilat-donusum-ankara",
  landowner: "villa-mimari-proje-ankara",
  agent: "emlak-danismanlari-icin-tasarim",
  developer: "muteahhit-gelistirici-mimari-cozumler",
  investor: "muhendislik-danismanligi-ankara",
  business: "ticari-mekan-tasarimi-ankara",
};

type GuideSection = Readonly<{ title: string; body: string; points?: readonly string[] }>;
export type GuideCopy = Readonly<{
  title: string;
  description: string;
  intro: string;
  sections: readonly GuideSection[];
  /** Short questions customers actually ask, answered without promises. */
  faq?: readonly (readonly [question: string, answer: string])[];
  takeaway: string;
}>;
export type StudioGuide = Readonly<{
  slug: string;
  service: string;
  /** Further service pages that list this guide among their related reading. */
  alsoServices?: readonly string[];
  project: string;
  topic: GuideTopic;
  audiences: readonly GuideAudience[];
  /** Card image on the hub: a real project photo or the guide's own drawing. */
  card: string;
  /** Optional explanatory drawing rendered above the sections. */
  diagram?: Readonly<{
    src: string;
    /** Drawing carries number badges only; the legend below explains them in every language. */
    numbered?: boolean;
    caption: Record<Locale, string>;
    /** Same information as the drawing, stacked for narrow screens. */
    items: Record<Locale, readonly (readonly [string, string])[]>;
  }>;
  /**
   * Official pages the reader can open directly: regulations, municipal document lists and query
   * services (some need an e-Devlet login, so the guide links to them instead of quoting them).
   */
  links?: readonly Readonly<{ href: string; label: Record<Locale, string> }>[];
  /** Animated step-by-step drawings rendered above the sections. */
  explainers?: readonly ExplainerId[];
  copy: Record<Locale, GuideCopy>;
}>;

export const guides: readonly StudioGuide[] = [
  renovationGuide,
  {
    slug: "ilk-mimarlik-gorusmesi", service: "incek-golbasi-mimarlik-ofisi", project: "villa-donusumu", topic: "start", audiences: ["homeowner", "villa", "landowner", "business"], card: "/images/persons/founders/hacer_uyar/hacer-uyar-u-plus-studio-ofis.jpg",
    copy: {
      tr: {
        title: "İlk mimarlık görüşmesine nasıl hazırlanılır?",
        description: "Arsa, ev veya işyeri projenizi anlatmak için ihtiyaç listesi, mevcut bilgiler, bütçe ve takvim üzerine somut bir görüşme hazırlığı rehberi.",
        intro: "İlk görüşmeye bitmiş bir fikirle gelmek zorunda değilsiniz. Asıl amaç, beğendiğiniz görsellerden önce neyi değiştirmek istediğinizi anlatabilmek. Birkaç somut not; arsanız, eviniz ya da işletmeniz için doğru soruları sormayı kolaylaştırır.",
        sections: [
          { title: "1. Görünümü değil, ihtiyacı tarif ederek başlayın", body: "“Modern bir ev istiyorum” iyi bir başlangıç olabilir; fakat tek başına günlük yaşamınızı anlatmaz. Aynı evde çalışan iki kişi, sık misafir ağırlayan bir aile veya depolama sorunu yaşayan bir ev sahibi farklı yerleşim kararlarına ihtiyaç duyar. Önce mevcut durumun hangi noktada yetersiz kaldığını yazın.", points: ["Bugün sizi zorlayan üç durum nedir?", "Yeni mekânda mutlaka olmasını istediğiniz üç şey nedir?", "Neyi değiştirmek istemiyorsunuz?"] },
          { title: "2. Elinizdeki bilgileri bir araya getirin", body: "Konum, yaklaşık alan, mevcut fotoğraflar ve varsa çizimler konuşmayı somutlaştırır. Arsa için yeni yapı düşünüyorsanız arsayla ilgili mevcut belgelerinizi; yenileme düşünüyorsanız korunacak ve değişecek alanların fotoğraflarını not edin. Elinizde olmayan bilgileri tahminle tamamlamak yerine eksik olarak belirtin. İlk görüşmede kişisel belgelerin tamamını göndermek yerine hangi bilginin gerektiğini sorabilirsiniz." },
          { title: "3. Görsel referansın nedenini açıklayın", body: "Bir görseli yalnızca “bunu beğendim” diye paylaşmak yerine neyi beğendiğinizi yazın: sıcak malzeme, gün ışığı, sade depolama, renk veya bahçeyle bağlantı. Beğenmediğiniz örnekler de sınırları gösterir. Başka bir evde iyi çalışan bir çözümün sizin alanınıza aynı şekilde uymayabileceğini konuşmaya açık olun." },
          { title: "4. Öncelikleri bütçe ve takvimle birlikte konuşun", body: "Bütçe aralığınız kesin değilse bile hangi kararların öncelikli olduğunu söyleyin. Tasarım hizmeti için düşündüğünüz çerçeve ile yapım, mobilya ve ekipman için düşündüğünüz çerçeveyi ayırın. Hedef tarihin bir taşınmaya, işletme açılışına veya başka bir ihtiyaca bağlı olup olmadığını belirtin. Böylece takvimin hangi adımlarının ayrıca değerlendirilmesi gerektiği görünür olur." },
          { title: "5. Görüşmeden hangi soruların cevabıyla ayrılmalısınız?", body: "İlk konuşmanın değeri, bütün kararları bitirmekten çok bir sonraki adımı netleştirmesidir. Kapsamı henüz bilinmeyen bir proje için kesin fiyat veya tarih beklemek yerine hangi bilgilerin tamamlanacağını ve hangi hizmetlerin değerlendirileceğini sorun.", points: ["Bu ihtiyaç için tasarım, görselleştirme ve uygulamadan hangileri gerekli?", "Hangi bilgiler veya yerinde değerlendirmeler eksik?", "Bir teklif hazırlanacaksa hangi teslimler ayrı belirtilecek?", "Bir sonraki görüşmeye kadar kim, hangi bilgiyi hazırlayacak?"] },
        ],
        takeaway: "Kısa proje notunuz şu cümleyle başlayabilir: “Ankara'daki evimizde/arsamızda/işyerimizde … yapmak istiyoruz. Mevcut durum …, önceliğimiz …, düşündüğümüz takvim …” Cevapların bir kısmı belirsiz kalabilir; onları birlikte konuşabiliriz.",
      },
      en: {
        title: "How to prepare for your first architecture conversation",
        description: "A practical guide to describing your plot, home or business project through your needs, available information, budget and intended timeline.",
        intro: "You do not need a finished idea before your first conversation. The aim is to describe the change you want to make before discussing favourite images. A few concrete notes make it easier to ask useful questions about your plot, home or business.",
        sections: [
          { title: "1. Start with the need, rather than the look", body: "“I want a modern home” can start the conversation, but it says little about daily life. Two people working from home, a family hosting guests and an owner struggling with storage may need different layouts. Describe where the current situation falls short.", points: ["Which three things cause the most difficulty today?", "What are the three most important things the new space should offer?", "What would you prefer to keep?"] },
          { title: "2. Gather the information you already have", body: "Location, approximate area, photographs and existing drawings make the discussion more specific. For a new building, note which plot documents are available. For a renovation, photograph the areas to keep and change. Identify missing information rather than filling the gaps with guesses. Ask which information is needed before sending complete personal documents." },
          { title: "3. Explain why a reference appeals to you", body: "Instead of sharing an image with only “I like this”, explain the appeal: warm materials, daylight, discreet storage, a colour or the relationship with a garden. Examples you dislike can clarify boundaries too. Be ready to discuss why a solution from another home may need adapting to yours." },
          { title: "4. Discuss priorities alongside budget and timing", body: "Even if your budget is still open, explain which decisions matter most. Separate your expectations for design services from construction, furniture and equipment. Say whether the target date is linked to moving in, opening a business or another event. That makes the parts of the schedule needing further assessment visible." },
          { title: "5. Leave with a clearer next step", body: "The first conversation does not have to settle every decision. For a project whose scope is still open, ask what information needs completing and which services need assessment before expecting a firm fee or date.", points: ["Which design, visualisation and construction services may be needed?", "What information or on-site assessment is missing?", "Which deliverables should be listed separately in a proposal?", "Who will prepare what before the next conversation?"] },
        ],
        takeaway: "Your short brief could begin: “We want to … in our home, plot or workplace in Ankara. The existing situation is …, our priority is …, and our intended timeline is …” Some answers can remain open; we can discuss them together.",
      },
    },
  },
  {
    slug: "mimari-teklif-karsilastirma", service: "ic-mimarlik-ankara", project: "konut-ic-mekan", topic: "start", audiences: ["homeowner", "villa", "landowner", "business", "developer"], card: "/media/projects/butik-kafe/moodboard.jpg",
    copy: {
      tr: {
        title: "Mimarlık tekliflerini aynı kapsamda nasıl karşılaştırırsınız?",
        description: "Konsept, 3D görsel, uygulama çizimi, revizyon ve saha takibi: mimarlık tekliflerinde fiyatın yanında sorulması gereken kapsam soruları.",
        intro: "İki mimarlık teklifinin toplam tutarına bakmak kolaydır. Aynı işi tarif edip etmediklerini anlamak ise teslimleri, karar aşamalarını ve uygulama sorumluluklarını ayrı okumayı gerektirir. Bu rehber bir fiyat listesi değil; teklif görüşmesinde kullanabileceğiniz bir kapsam kontrolüdür.",
        sections: [
          { title: "1. Önce aynı proje tarifini paylaşın", body: "Bir ofise yalnızca salon tasarımını, diğerine bütün evin yenilenmesini anlattıysanız iki farklı hizmeti karşılaştırıyor olabilirsiniz. Projenin konumunu, yaklaşık alanını, ele alınacak bölümleri ve mevcut durumunu aynı kısa notla paylaşın. Henüz belli olmayan ihtiyaçları da açık bırakın; belirsizliği görünmez kılmayın." },
          { title: "2. “Tasarım” başlığının içini açın", body: "Konsept tasarım, yerleşim planı, malzeme çalışması, 3D görselleştirme ve uygulama çizimi aynı teslim değildir. Görsel bir fikri anlatırken uygulama çizimi o fikrin ölçü ve detay ilişkilerini tarif eder. Teklifin yalnızca sunum görsellerini mi yoksa uygulamaya yönelik dokümantasyonu da mı içerdiğini sorun.", points: ["Hangi alanlar ve hangi çizimler teslim edilecek?", "Görselleştirme hangi mekânları kapsıyor?", "Özel mobilya veya aydınlatma detayları ayrıca ele alınıyor mu?"] },
          { title: "3. Tasarım bedelini yapım bütçesinden ayırın", body: "Bir hizmet bedelinin malzeme, mobilya, ekipman veya uygulama işçiliğini de içerdiğini varsaymayın. Tasarım hizmeti ile satın alma ve uygulama işlerinin hangi kalemlerde ayrıldığını sorun. “Anahtar teslim” gibi geniş bir başlık kullanılıyorsa bile hangi işlerin, alanların ve ürünlerin kapsandığını tek tek konuşun." },
          { title: "4. Revizyonu ve yeni ihtiyacı birbirinden ayırın", body: "Bir yerleşimi geliştirmek ile projeye yeni bir oda veya yeni bir kullanım eklemek aynı değişiklik olmayabilir. Hangi aşamalarda görüş alınacağını, kapsam içindeki düzenlemelerin nasıl ele alınacağını ve sonradan gelen bir isteğin takvime etkisinin nasıl konuşulacağını sorun. Sayı veya süreç belirtilmemişse kendiliğinden dahil kabul etmeyin." },
          { title: "5. Saha hizmetinin ne anlama geldiğini sorun", body: "Çizim teslimi, şantiyede tasarım kararlarını açıklamak ve uygulamayı yönetmek farklı sorumluluklardır. Hangi hizmeti istediğinizi tanımlayın. Saha ziyareti, tedarikçiyle görüşme veya uygulama koordinasyonu teklifin konusuysa bunların kapsamını ayrıca konuşun.", points: ["Uygulamayı kim yürütecek, tasarım sorularını kim yanıtlayacak?", "Hangi teknik disiplinler veya diğer uzmanlıklar ayrıca değerlendirilecek?", "Malzeme seçiminden satın alma ve montaja kadar kim, hangi aşamada yer alacak?"] },
          { title: "6. Kararınızı tek bir rakama sıkıştırmayın", body: "Karşılaştırma notunuzda her teklif için aynı dört başlığı açın: kapsam, teslimler, uygulama sorumlulukları ve açık sorular. Bir kalem belirtilmemişse “dahil” veya “hariç” diye tahmin etmek yerine “sorulacak” yazın. Benzer bir proje örneğini inceleyin ve o projede sunulan hizmetle sizin ihtiyacınız arasındaki farkı konuşun." },
        ],
        takeaway: "Teklif görüşmesinde şu soruyu kullanabilirsiniz: “Bu bedelle hangi alanlar için hangi tasarım ve çizimleri alacağım; görselleştirme, revizyon ve uygulama takibi bunun neresinde?” Net bir cevap, seçenekleri aynı çerçevede değerlendirmenize yardımcı olur.",
      },
      en: {
        title: "How to compare architecture proposals on the same scope",
        description: "Concepts, 3D visuals, construction drawings, revisions and site follow-up: the scope questions to ask alongside an architecture proposal's fee.",
        intro: "Comparing the total fees in two architecture proposals is straightforward. Establishing whether they describe the same work means looking separately at deliverables, decision stages and construction responsibilities. This guide is a scope checklist for that conversation, rather than a price list.",
        sections: [
          { title: "1. Share the same project description", body: "If one practice heard about a living room design and another about a whole-home renovation, you may be comparing different services. Share the same brief covering location, approximate area, spaces involved and existing conditions. Identify needs that are still uncertain rather than making them disappear from the description." },
          { title: "2. Unpack the word “design”", body: "A concept, layout, material study, 3D visualisation and construction drawing are different deliverables. An image communicates an idea; a construction drawing describes dimensions and details. Ask whether a proposal covers presentation visuals alone or documentation intended for construction too.", points: ["Which spaces and drawings will be covered?", "Which areas will be visualised?", "Are bespoke furniture and lighting details included separately?"] },
          { title: "3. Separate design fees from construction costs", body: "Do not assume a service fee includes materials, furniture, equipment or construction labour. Ask how design, purchasing and construction are separated. Even when a broad description such as “turnkey” is used, discuss which works, areas and products it covers." },
          { title: "4. Distinguish revisions from new requirements", body: "Developing a layout and adding another room or use may represent different changes. Ask when feedback is gathered, how adjustments within scope are handled and how later requests affect the schedule. If a process or allowance is not described, do not assume it is included." },
          { title: "5. Ask what site services mean", body: "Delivering drawings, explaining design decisions on site and managing construction are different responsibilities. Identify which you need. If site visits, supplier discussions or coordination form part of a proposal, discuss their scope explicitly.", points: ["Who will carry out the work and answer design questions?", "Which technical disciplines or other specialists need separate assessment?", "Who is involved in selection, purchasing and installation?"] },
          { title: "6. Compare more than one number", body: "Use four headings for each proposal: scope, deliverables, construction responsibilities and open questions. If something is unspecified, mark it “to ask” rather than assuming it is included or excluded. Explore a related project and discuss how its service scope differs from your needs." },
        ],
        takeaway: "Try asking: “For this fee, which spaces, designs and drawings will I receive, and where do visualisation, revisions and site follow-up fit?” A clear answer helps you assess options within the same framework.",
      },
    },
  },
  {
    slug: "mimarlik-ucreti-ve-butce", service: "incek-golbasi-mimarlik-ofisi", project: "villa-donusumu", topic: "start", audiences: ["homeowner", "villa", "landowner", "business"], card: "/media/diagrams/budget-structure.svg",
    diagram: {
      src: "/media/diagrams/budget-structure.svg",
      caption: {
        tr: "Tasarım hizmeti, uygulama, mobilya–ekipman ve izinler ayrı kalemlerdir; şema oran değil, ayrım gösterir.",
        en: "Design services, construction, furniture–equipment and permits are separate headings; the diagram shows the split, not proportions.",
      },
      items: {
        tr: [
          ["Tasarım & çizim hizmeti", "Konsept, 3D görselleştirme ve teknik çizimler."],
          ["Uygulama & işçilik", "Söküm, imalat, tesisat ve montaj işleri."],
          ["Mobilya & ekipman", "Özel üretim mobilya, satın alınan ürünler, ekipman."],
          ["İzin, harç & danışmanlık", "Belediye süreçleri, denetim, statik ve diğer uzmanlıklar."],
        ],
        en: [
          ["Design & drawings", "Concept, 3D visualisation and technical drawings."],
          ["Construction & labour", "Stripping out, building work, services and installation."],
          ["Furniture & equipment", "Bespoke joinery, purchased items and equipment."],
          ["Permits, fees & consultancy", "Municipal processes, inspection, structural and other specialists."],
        ],
      },
    },
    copy: {
      tr: {
        title: "Mimarlık ücreti ve proje bütçesi nasıl oluşur?",
        description: "Mimarlık hizmet bedeli, yapım, mobilya ve izin kalemlerini ayırarak bütçe kurma ve teklifte hangi kapsamı soracağınıza dair rehber.",
        intro: "“Bu iş ne kadar tutar?” sorusunun tek bir cevabı yok; çünkü tasarım hizmeti, yapım işleri, mobilya ve izinler farklı kalemlerdir. Bütçeyi konuşurken bu kalemleri ayırmak, hem karşılaştırılabilir teklif almanızı hem de sürprizleri baştan görmenizi sağlar.",
        sections: [
          { title: "1. Tek rakam yerine dört kalem", body: "Bir projenin toplam maliyeti genellikle dört başlığa ayrılır: tasarım ve çizim hizmeti, uygulama ve işçilik, mobilya–ekipman, izin–harç–uzmanlık. Bu başlıkların hangisinin hangi teklifin içinde olduğunu bilmeden toplamları karşılaştırmak yanıltıcı olur. Görüşmeye bu dört başlığı ayrı ayrı yazarak gidin.", points: ["Tasarım bedeli ile yapım bedelini aynı satırda birleştirmeyin.", "Mobilya ve ekipmanın satın alma mı, özel üretim mi olduğunu belirtin.", "Harç, denetim ve danışmanlık gibi kalemleri ayrı sorun."] },
          { title: "2. Hizmet bedelini ne belirler?", body: "Mimarlık hizmet bedeli tek bir metrekare çarpanıyla açıklanamaz. Ele alınan alanın büyüklüğü, teslim edilecek çizim ve görsel sayısı, tasarımın hangi aşamaya kadar süreceği, revizyon beklentisi ve sahada ne kadar bulunulacağı bedeli birlikte belirler. Aynı büyüklükteki iki mekân, biri yalnızca konsept diğeri uygulama çizimleriyle istendiğinde aynı iş değildir." },
          { title: "3. Yayımladığımız paketler neyi kapsar?", body: "Hizmetler sayfamızda tasarım paketlerini ve başlangıç bedellerini açık olarak yayımlıyoruz. Bu paketler tasarım, görselleştirme ve teknik çizim teslimlerini tanımlar; yapım işlerini, mobilya satın alımını veya belediye harçlarını kapsamaz. Paketlerin kapsamı ve güncel bedelleri hizmetler sayfasındadır; projenize özel kapsam ilk görüşmede netleşir.", points: ["Paket adı bir kapsam vaadi değil, bir başlangıç noktasıdır.", "Kapsam dışı işlerin nasıl fiyatlanacağını sorun.", "KDV ve ödeme planını teklifte ayrı satır olarak isteyin."] },
          { title: "4. Yapım bütçesini tasarımdan bağımsız kurun", body: "Uygulama bütçesi; söküm, altyapı, yüzey, doğrama, tesisat ve işçilik kalemlerinden oluşur. Tasarım ilerledikçe metraj ve keşif netleşir. Mevcut bir yapıda söküm sonrası ortaya çıkan ihtiyaçlar bütçeyi değiştirebilir; bu nedenle belirsizlik payı bırakmak ve yeni bir ihtiyaç çıktığında nasıl karar alınacağını baştan konuşmak gerekir." },
          { title: "5. Mobilya, ekipman ve izinleri unutmayın", body: "Mekâna özel üretilen mobilya ile satın alınan ürün farklı süreçlerdir: biri üretim ve montaj, diğeri tedarik süresi gerektirir. Ticari bir mekânda mutfak ekipmanı, aydınlatma ve ses sistemi bütçenin önemli bir bölümünü oluşturabilir. İzin, harç ve yapı denetimi gibi kalemler ise çoğu zaman tasarım bedelinden ayrıdır." },
          { title: "6. Teklifleri aynı çerçevede karşılaştırın", body: "İki teklifin toplamına bakmak yerine her biri için aynı dört başlığı açın: kapsam, teslimler, uygulama sorumlulukları ve açık sorular. Belirtilmemiş bir kalemi “dahil” varsaymak yerine “sorulacak” olarak işaretleyin. Teklif karşılaştırma rehberimiz bu çerçeveyi adım adım anlatıyor." },
        ],
        takeaway: "Görüşme notu: “Tasarım hizmeti için düşündüğümüz çerçeve …, yapım için …, mobilya ve ekipman için … . Bu bedellerin hangi teslimleri kapsadığını, kapsam dışı işlerin nasıl fiyatlanacağını ve ödeme planını ayrı ayrı görmek istiyoruz.”",
      },
      en: {
        title: "How architecture fees and a project budget are built",
        description: "A guide to separating design fees, construction, furniture and permits when budgeting, and to the scope questions worth asking about a proposal.",
        intro: "“What will this cost?” rarely has a single answer, because design services, construction work, furniture and permits are different headings. Separating them lets you compare proposals on equal terms and see the risks early.",
        sections: [
          { title: "1. Four headings instead of one number", body: "A project budget usually splits into design and drawing services, construction and labour, furniture and equipment, and permits, fees and specialist input. Comparing totals without knowing which heading a proposal covers is misleading. Bring these four headings to the conversation as separate lines.", points: ["Do not merge the design fee and the construction cost into one line.", "State whether furniture and equipment will be purchased or made bespoke.", "Ask about permits, inspection and consultancy as separate items."] },
          { title: "2. What sets the design fee?", body: "An architecture fee cannot be explained by a single price per square metre. The area involved, the number of drawings and visuals delivered, how far the design runs, the expected revisions and how much time is spent on site all shape the fee. Two spaces of the same size are not the same job when one is a concept and the other includes construction drawings." },
          { title: "3. What do our published packages cover?", body: "Our services page lists design packages and their starting fees openly. Those packages define design, visualisation and technical drawing deliverables; they do not include construction work, furniture purchasing or municipal fees. The package scope and current fees live on the services page, and the scope for your project is agreed at the first meeting.", points: ["A package name is a starting point, not a promise of scope.", "Ask how work outside the package would be priced.", "Request VAT and the payment schedule as separate lines in a proposal."] },
          { title: "4. Build the construction budget separately", body: "A construction budget covers stripping out, services, finishes, joinery, mechanical and electrical work and labour. Quantities and estimates firm up as the design develops. In an existing building, conditions found after stripping out can change the budget, so leave an allowance and agree in advance how new requirements will be decided." },
          { title: "5. Remember furniture, equipment and permits", body: "Bespoke joinery and purchased furniture are different processes: one needs production and installation, the other lead time. In a commercial space, kitchen equipment, lighting and audio can form a significant part of the budget. Permits, fees and building inspection are usually separate from the design fee." },
          { title: "6. Compare proposals within one framework", body: "Rather than looking at two totals, open the same four headings for each: scope, deliverables, construction responsibilities and open questions. Mark anything unspecified as “to ask” instead of assuming it is included. Our proposal comparison guide walks through that framework." },
        ],
        takeaway: "Brief: “Our framework for design services is …, for construction …, and for furniture and equipment … . We would like to see which deliverables each fee covers, how work outside the scope is priced, and the payment schedule.”",
      },
    },
  },
  {
    slug: "ankara-yapi-ruhsati-sureci", service: "villa-mimari-proje-ankara", project: "modern-villa", topic: "local", audiences: ["landowner", "developer", "villa"], card: "/media/diagrams/permit-timeline.svg",
    diagram: {
      src: "/media/diagrams/permit-timeline.svg",
      caption: {
        tr: "Arsa incelemesinden iskâna uzanan başlıklar; sıra ve süreler belediyeye ve parsele göre değişir.",
        en: "The headings from plot review to occupancy; order and duration vary by municipality and plot.",
      },
      items: {
        tr: [
          ["Arsa & imar durumu", "Kullanım amacı, emsal, çekme mesafeleri ve kısıtlar incelenir."],
          ["Konsept & avan proje", "İhtiyaç programı yerleşim ve kütle kararlarına dönüşür."],
          ["Ruhsat başvurusu", "Mimari, statik, elektrik ve mekanik projelerle belediye onayı."],
          ["Uygulama projeleri", "Detay, metraj ve malzeme kararları sahaya taşınır."],
          ["Şantiye & iskân", "Uygulama takibi ve yapının ruhsata uygunluğunun değerlendirilmesi."],
        ],
        en: [
          ["Plot & zoning status", "Permitted use, floor area ratios, setbacks and restrictions are reviewed."],
          ["Concept & schematic design", "The brief becomes layout and massing decisions."],
          ["Permit application", "Municipal approval with architectural, structural, electrical and mechanical designs."],
          ["Construction drawings", "Details, quantities and material decisions reach the site."],
          ["Site & occupancy", "Construction follow-up and assessment of the building against its permit."],
        ],
      },
    },
    copy: {
      tr: {
        title: "Ankara'da yapı ruhsatı ve proje süreci: yol haritası",
        description: "Arsa incelemesinden iskâna kadar yapı ruhsatı sürecinin aşamaları, istenen belgeler ve tasarımın bu süreçte nerede durduğuna dair rehber.",
        intro: "Yapı ruhsatı, tek bir başvuru değil birbirine bağlı adımlardan oluşan bir süreçtir. Hangi adımın ne zaman geldiğini bilmek, tasarımı ve takvimi buna göre kurmayı kolaylaştırır. Bu rehber genel bir yol haritasıdır; kesin liste ve süreler belediyeye ve parselin durumuna göre değişir.",
        sections: [
          { title: "1. Önce arsanın izin verdiğini öğrenin", body: "Tasarıma başlamadan önce parselin imar durumu incelenir: kullanım amacı, emsal ve taban alanı katsayıları, çekme mesafeleri, yükseklik sınırları ve varsa koruma veya jeolojik kısıtlar. Bu bilgiler olmadan çizilen bir kütle, beğenilse bile uygulanamayabilir. İmar durumu belgesi ve aplikasyon krokisi bu adımın temel belgeleridir." },
          { title: "2. Konsept ve avan proje", body: "İhtiyaç programınız arsanın koşullarıyla birleştiğinde konsept ortaya çıkar: yerleşim, kütle, cephe yaklaşımı ve bahçeyle ilişki. Konsept netleştikten sonra avan proje, ölçüleri ve mekân ilişkilerini belirginleştirir. Bu aşamada 3D görseller kararları konuşmayı kolaylaştırır; ancak ruhsat için gereken teknik çizimlerin yerini tutmaz." },
          { title: "3. Ruhsat için hazırlanan projeler", body: "Yapı ruhsatı başvurusunda mimari proje tek başına yeterli değildir. Genellikle statik, elektrik ve mekanik projeler, zemin etüdü raporu ve yapı denetim sözleşmesi gibi belgeler istenir. Bu disiplinlerin birbiriyle çelişmemesi gerekir; mimar ve mühendisin aynı ekipte olması bu koordinasyonu kolaylaştırır.", points: ["Belge listesini başvuru öncesi belediyeden teyit edin.", "Zemin etüdü ve statik çözüm, tasarımı geriye dönük değiştirebilir.", "Yapı denetim kuruluşuyla sözleşme sürecin parçasıdır."] },
          { title: "4. Belediye onayı ve harçlar", body: "Başvuru sonrası belediye incelemesi, eksik belge tamamlama ve harç ödemeleri gündeme gelir. Onay süresi belediyenin iş yüküne ve projenin kapsamına göre değişir. Bu nedenle hedef tarihinizi konuşurken ruhsat süresini takvimin içine bir belirsizlik payıyla yerleştirmek gerekir." },
          { title: "5. Uygulama projeleri ve şantiye", body: "Ruhsat alındıktan sonra uygulama projeleri ve detaylar sahada işi yürütecek ekibe rehberlik eder. Metraj, malzeme seçimi ve imalat sırası bu aşamada netleşir. Şantiye takibi, tasarım kararlarının uygulamada doğru yorumlanmasını sağlar; kapsamı ve sıklığı baştan yazılı olarak belirlenmelidir." },
          { title: "6. İskân ve sonrası", body: "Yapı tamamlandığında iskân süreci, yapının ruhsata ve projeye uygunluğunun değerlendirilmesini içerir. Sonradan yapılan ve projeye işlenmeyen değişiklikler bu aşamada sorun çıkarabilir. Bu yüzden sahada alınan kararların projeye yansıtılması, işin sonunda değil süreç boyunca takip edilmelidir." },
        ],
        takeaway: "Görüşme notu: “Arsamız … adresinde; imar durumu ve mevcut belgeler elimizde … . Hangi belgelerin eksik olduğunu, ruhsat için hangi disiplinlerin gerektiğini ve tasarımın hangi aşamada hangi teslimi üreteceğini konuşmak istiyoruz.”",
      },
      en: {
        title: "Building permits and the design process in Ankara",
        description: "A guide to the stages of a building permit from plot review to occupancy, the documents usually requested and where design fits in.",
        intro: "A building permit is not a single application but a chain of connected steps. Knowing which step comes when makes it easier to plan the design and the programme around it. This is a general roadmap; the exact list and durations vary by municipality and plot.",
        sections: [
          { title: "1. Start with what the plot allows", body: "Before design begins, the plot's zoning status is reviewed: permitted use, floor area and footprint ratios, setback distances, height limits and any conservation or geological restrictions. A massing drawn without that information may be attractive but unbuildable. The zoning status certificate and site plan are the core documents at this stage." },
          { title: "2. Concept and schematic design", body: "Your brief meets the plot conditions to produce a concept: layout, massing, façade approach and the relationship to the garden. Once the concept is settled, schematic design sharpens dimensions and spatial relationships. 3D visuals help the discussion at this stage, but they do not replace the technical drawings a permit requires." },
          { title: "3. The designs a permit needs", body: "An architectural design alone is usually not enough for a permit application. Structural, electrical and mechanical designs, a soil survey report and a building inspection contract are typically requested. These disciplines must not contradict each other, which is easier when architect and engineer sit in the same team.", points: ["Confirm the document list with the municipality before applying.", "Soil survey and structural solutions can change the design retroactively.", "A building inspection contract is part of the process."] },
          { title: "4. Municipal review and fees", body: "After submission come municipal review, completing missing documents and paying fees. Approval time depends on the municipality's workload and the scope of the project. When discussing your target date, the permit period belongs in the programme with an allowance for uncertainty." },
          { title: "5. Construction drawings and site", body: "Once the permit is issued, construction drawings and details guide the team building the work. Quantities, material selection and the sequence of trades become clear at this stage. Site follow-up keeps design decisions correctly interpreted, and its scope and frequency should be agreed in writing." },
          { title: "6. Occupancy and afterwards", body: "When the building is complete, the occupancy process assesses whether it matches the permit and the approved design. Changes made later and not reflected in the project can cause problems at this stage. Decisions taken on site should therefore be recorded in the drawings throughout, not only at the end." },
        ],
        takeaway: "Brief: “Our plot is at …; we hold the zoning status and these documents … . We would like to discuss which documents are missing, which disciplines the permit needs, and which deliverable the design produces at each stage.”",
      },
    },
  },
  {
    slug: "ankara-ev-yaptirma-adim-adim", service: "villa-mimari-proje-ankara", project: "modern-villa", topic: "build", audiences: ["landowner"], card: "/media/projects/modern-villa/exterior-dusk.jpg",
    explainers: ["imar", "zemin", "iklim", "projeler", "surec", "tadilat"],
    copy: {
      tr: {
        title: "Ankara'da ev yaptırmak: altı resimle, en baştan",
        description: "Arsa, zemin, Ankara iklimi, projeler, ruhsat ve tadilat: ev yaptırmanın temel kavramlarını hareketli çizimler ve günlük örneklerle anlatan rehber.",
        intro: "İmar durumu, emsal, zemin etüdü, iskân… Mimarla ilk kez konuşacak biri için bu kelimeler yabancı bir dil gibi gelebilir. Bu rehber, her kavramı tek bir resim ve günlük hayattan bir benzetmeyle anlatır. Resimlerdeki numaralar, yanındaki açıklamalarla aynıdır.",
        sections: [
          { title: "Bu rehberi nasıl okumalı?", body: "Adımlar, bir evin gerçekte ilerlediği sıraya göre dizildi: önce arsanın izin verdikleri, sonra toprağın kendisi, ardından iklim, çizimler ve izinler. Son resim, mevcut bir evi yenileyecekler içindir. Hepsini bir kerede okumanız gerekmez; hangi aşamadaysanız oradan başlayın.", points: ["Arsa almayı düşünüyorsanız: Adım 1 ve 2.", "Projeye başlamak üzereyseniz: Adım 3 ve 4.", "Ruhsat ve şantiye aşamasındaysanız: Adım 5.", "Mevcut evinizi yenileyecekseniz: Tadilat."] },
          { title: "Kim, hangi adımda yer alır?", body: "Mimar ihtiyaçlarınızı ve arsanın kurallarını bir plana dönüştürür; inşaat mühendisi taşıyıcı sistemi hesaplar; elektrik ve makine mühendisleri tesisatı çizer; zemin etüdü ayrı bir uzmanlıktır. Belediye projeleri onaylar, yapı denetim kuruluşu şantiyeyi kontrol eder. U+ Studio'da mimar ve inşaat mühendisi aynı ekipte çalışır; diğer disiplinler projenin kapsamına göre koordine edilir." },
          { title: "İlk görüşmeye ne getirmeli?", body: "Elinizde ne varsa getirin; eksikleri birlikte tamamlarız. Tapu veya parsel bilgisi, varsa imar durumu belgesi, arsanın ya da mevcut evin fotoğrafları, yaşam düzeninizi anlatan kısa bir not ve aklınızdaki bütçe çerçevesi ilk konuşmayı çok daha verimli kılar.", points: ["Ada ve parsel numarası veya tapu fotokopisi.", "Varsa imar durumu ve aplikasyon krokisi.", "Arsa ya da mevcut yapıdan güncel fotoğraflar.", "Kaç kişi yaşayacağı ve vazgeçilmez ihtiyaçlar."] },
        ],
        takeaway: "Görüşme notu: “Arsamız … ada … parselde. İmar durumunu öğrendik / henüz öğrenmedik. Zemin etüdü, ısı yalıtımı ve ruhsat için gereken projelerin hangi sırayla hazırlanacağını ve hangisinin ne zaman kesinleşmesi gerektiğini konuşmak istiyoruz.”",
      },
      en: {
        title: "Building a house in Ankara: six pictures, from the start",
        description: "Plot, ground, Ankara's climate, drawings, permits and renovation: the basics of building a house explained with animated drawings and everyday comparisons.",
        intro: "Zoning status, floor area ratio, soil survey, occupancy… To someone talking to an architect for the first time these words can sound like a foreign language. This guide explains each idea with one picture and one everyday comparison. The numbers in each picture match the notes beside it.",
        sections: [
          { title: "How to read this guide", body: "The steps follow the order a house really goes through: first what the plot allows, then the ground itself, then climate, drawings and permits. The last picture is for those renovating an existing home. There is no need to read everything at once; start from the stage you are at.", points: ["Thinking of buying a plot: Steps 1 and 2.", "About to start a design: Steps 3 and 4.", "At permit or construction stage: Step 5.", "Renovating your current home: Renovation."] },
          { title: "Who takes part at each step?", body: "The architect turns your needs and the plot's rules into a plan; the civil engineer calculates the structure; electrical and mechanical engineers design the services; the soil survey is a separate specialism. The municipality approves the designs and a building inspection firm checks the site. At U+ Studio the architect and the civil engineer work in the same team, and the other disciplines are coordinated according to the project's scope." },
          { title: "What to bring to the first meeting", body: "Bring whatever you have and we will fill the gaps together. The title deed or parcel details, a zoning status certificate if you have one, photos of the plot or existing home, a short note on how you live and the budget you have in mind make the first conversation far more useful.", points: ["Block and parcel number or a copy of the title deed.", "Zoning status and site plan, if available.", "Recent photos of the plot or existing building.", "How many people will live there and the must-haves."] },
        ],
        takeaway: "Brief: “Our plot is block … parcel … . We have / have not obtained the zoning status. We would like to discuss the order in which the soil survey, thermal insulation and permit designs are prepared, and when each needs to be settled.”",
      },
    },
  },
  {
    slug: "arsaya-kac-daire-sigar", service: "apartman-konut-projesi-ankara", project: "konut-projeleri", topic: "build", audiences: ["landowner", "developer"], card: "/media/projects/konut-projeleri/complex.jpg",
    explainers: ["imar", "projeler", "surec"],
    copy: {
      tr: {
        title: "Bir arsaya kaç daire sığar? Arsa sahipleri ve müteahhitler için yol haritası",
        description: "Emsal, TAKS, bahçe mesafeleri, emsal harici alanlar, oda ölçüleri ve 1+0 sınırı: bir arsada kaç daire yapılabileceğini mevzuatla, adım adım anlatan rehber.",
        intro: "“Bu arsaya kaç daire çıkar?” arsa sahiplerinin ve müteahhitlerin ilk sorusudur. Cevap tek bir çarpma işlemi değildir; imar planı, yönetmelik, otopark, daire tipleri ve satılabilirlik birlikte belirler. Bu rehber, Planlı Alanlar İmar Yönetmeliği'ndeki temel kuralları sırasıyla anlatır. Plan notları ve ilgili belediyenin yönetmelikleri bu kurallardan farklı hükümler getirebilir; kesin hesap her parsel için ayrı yapılır.",
        sections: [
          { title: "1. Önce net parsel alanını ve imar durumunu öğrenin", body: "Yönetmeliğe göre taban alanı ve emsal hesabı net imar parseli alanı üzerinden yapılır; yani yola veya kamuya terk edilen kısımlar düşüldükten sonra kalan alan esas alınır. İmar durum belgesi; kullanım kararını, TAKS ve KAKS (emsal) değerlerini, kat adedini veya bina yüksekliğini ve yapı nizamını gösterir. Hesap bu belgeyle başlar.", points: ["Tapu ve güncel imar durum belgesini edinin.", "Parselin net alanını aplikasyon krokisiyle doğrulayın.", "Plan notlarını okuyun; özel hükümler genel kuralların önüne geçebilir."] },
          { title: "2. Emsal toplam inşaat hakkını, TAKS oturumu belirler", body: "KAKS (emsal), yapının tüm katlarındaki emsale konu alanların parsel alanına oranıdır. TAKS ise binanın zemine oturan izdüşümünün parsele oranıdır. Ayrık veya blok nizamda imar planında açıkça belirtilmemişse TAKS %40'ı geçemez. Örneğin 1.000 m² net parselde KAKS 1,50 ise emsale esas toplam alan 1.500 m²'dir; TAKS 0,30 ise binanın zemindeki izdüşümü en fazla 300 m² olur." },
          { title: "3. Bahçe mesafeleri bina kütlesini sınırlar", body: "Planda aksine bir hüküm yoksa ön bahçe en az 5 metre, yan ve arka bahçe en az 3 metredir. Dörtten fazla katlı binalarda yan ve arka bahçe mesafeleri 4 katın üzerindeki her kat için 0,50 metre artar. Dar veya köşe parsellerde bu mesafeler, TAKS'ın izin verdiği oturumu fiilen kullanılamaz hale getirebilir; bu yüzden kütle çalışması emsal hesabıyla birlikte yapılır." },
          { title: "4. Emsal harici alanlar, yapı inşaat alanını büyütür ama sınırlıdır", body: "Bazı alanlar emsale dahil edilmez: bağımsız bölüm net alanının %20'sini geçmeyen açık çıkma şartlı balkonlar, kat ve ara sahanlıklarıyla merdiven evi, asansör boşlukları, sığınak, tesisat alanları ve belirli koşullarda otoparklar bunlardandır. Yönetmeliğe göre emsal harici tüm alanların toplamı, belirli istisnalar dışında, emsale esas alanın %30'unu aşamaz. Bu yüzden satılabilir alan ile toplam inşaat alanı farklı rakamlardır.", points: ["Emsal alanı: daire brüt alanlarının büyük bölümü.", "Emsal harici: balkon, merdiven, asansör, sığınak, tesisat ve koşullu otopark.", "Toplam yapı inşaat alanı, maliyet hesabının esasıdır."] },
          { title: "5. Daire sayısı, ortalama daire büyüklüğüne bölünerek tahmin edilir", body: "İlk tahmin, emsale esas alanın hedeflenen ortalama daire büyüklüğüne bölünmesiyle yapılır. 1.500 m² emsal alanı 125 m² brüt dairelerle yaklaşık 12, 100 m² dairelerle yaklaşık 15 daire eder. Bu yalnızca başlangıç tahminidir: kat planında merdiven ve asansör çekirdeğinin yeri, cephe uzunluğu ve her dairenin gün ışığı alması gereği gerçek sayıyı belirler." },
          { title: "6. Küçük daire yaparken yönetmelikteki alt sınırlar", body: "Her konutta en az bir oturma odası (dar kenar 3,00 m, net 12 m²), bir yatak odası (dar kenar 2,50 m, net 9 m²), mutfak veya yemek pişirme yeri (net 3,30 m²), banyo (net 3,00 m²) ve tuvalet (net 1,20 m²) bulunmalıdır; hol ve koridorlar 1,20 metreden dar olamaz. 2025 değişikliğiyle, parseldeki bağımsız bölüm sayısının %20'sini geçmemek üzere, oturma odası içinde en az 9 m² ve dar kenarı 2,50 m olan yatak nişi yapılan dairelerde ayrı yatak odası şartı aranmaz. Yani 1+0 tipindeki dairelerin oranı sınırlıdır." },
          { title: "7. Daire sayısı arttıkça ihtiyaçlar da artar", body: "Daha çok daire; daha çok otopark, daha büyük sığınak ve daha fazla ortak alan demektir. Otopark sayısı Otopark Yönetmeliği ve belediyenin otopark yönetmeliğine göre belirlenir ve bodrum katların büyüklüğünü doğrudan etkiler. Bodrum dahil kat adedi 3 olan binalarda asansör yeri bırakılması, 4 ve daha fazla olanlarda asansör tesisi zorunludur. İskân edilen katların iç yüksekliği de 2,60 metreden az olamaz.", points: ["Otopark ihtiyacını belediyenin yönetmeliğinden teyit edin.", "Bodrum kat maliyetini daire sayısıyla birlikte hesaplayın.", "Asansör ve sığınak alanlarını kat planına baştan yerleştirin."] },
          { title: "8. En çok daire her zaman en iyi sonuç değildir", body: "Daire sayısını artırmak toplam satılabilir birim sayısını artırır; fakat her dairenin küçülmesi, otopark ve ortak alan maliyetinin artması ve bölgedeki talebe uymayan daire tipleri projenin ticari başarısını zayıflatabilir. Doğru daire karışımı; bölgedeki talep, hedef alıcı ve sizin satış deneyiminizle birlikte belirlenir. Biz bu kararı imar ve yönetmelik sınırları içinde, farklı senaryoları karşılaştırarak birlikte vermenize yardımcı oluruz." },
          { title: "9. Kararı senaryolarla verin", body: "Aynı parsel için iki veya üç yerleşim senaryosu hazırlamak, daire sayısı, daire büyüklüğü, otopark ve ortak alan dengesini yan yana görmenizi sağlar. Senaryo karşılaştırması, kat karşılığı görüşmelerinde arsa sahibi ile müteahhit arasında ortak ve somut bir zemin de oluşturur." },
        ],
        takeaway: "Görüşme notu: “Parselimiz … ada … parsel, net alanı … m². İmar durumunda KAKS …, TAKS …, kat adedi … yazıyor. Hedeflediğimiz daire tipleri … . Bu arsada hangi yerleşim senaryolarının mümkün olduğunu, otopark ve ortak alan ihtiyacıyla birlikte görmek istiyoruz.”",
      },
      en: {
        title: "How many flats fit on a plot? A roadmap for landowners and developers",
        description: "Floor area ratio, footprint, setbacks, uncounted areas, room sizes and the studio-flat cap: how many flats a plot allows under the regulations.",
        intro: "“How many flats will this plot give?” is the first question landowners and developers ask. The answer is not a single multiplication: the zoning plan, regulations, parking, flat types and saleability decide it together. This guide walks through the core rules of Türkiye's Planned Areas Zoning Regulation in order. Plan notes and the municipality's own regulations can set different rules, and the exact calculation is made for each plot.",
        sections: [
          { title: "1. Start with the net plot area and zoning status", body: "Under the regulation, footprint and floor area are calculated on the net zoning plot, that is, after land ceded to roads or public use. The zoning status certificate shows the permitted use, the footprint ratio (TAKS), floor area ratio (KAKS), the number of floors or building height and the building arrangement. The calculation starts there.", points: ["Obtain the title deed and a current zoning status certificate.", "Confirm the net plot area with the site plan.", "Read the plan notes; special provisions can override general rules."] },
          { title: "2. KAKS sets the total, TAKS the footprint", body: "KAKS (floor area ratio) is the ratio of the countable floor area on all floors to the plot area. TAKS is the ratio of the building's ground footprint to the plot. In detached or block arrangements, unless the plan says otherwise, TAKS cannot exceed 40%. On a 1,000 m² net plot with KAKS 1.50, the countable total is 1,500 m²; with TAKS 0.30 the footprint is at most 300 m²." },
          { title: "3. Setbacks limit the building mass", body: "Unless the plan says otherwise, the front setback is at least 5 metres and side and rear setbacks at least 3 metres. For buildings with more than four floors, side and rear setbacks grow by 0.50 metres for each floor above the fourth. On narrow or corner plots these distances can make the footprint TAKS allows unusable, so a massing study is done alongside the area calculation." },
          { title: "4. Areas outside the ratio enlarge the building, within limits", body: "Some areas are not counted in KAKS: balconies meeting open-projection rules up to 20% of a unit's net area, stair cores with their landings, lift shafts, shelters, plant areas and, under conditions, parking. Under the regulation the total of these areas cannot exceed 30% of the countable area, apart from specific exceptions. Saleable area and total construction area are therefore different figures.", points: ["Countable area: most of the flats' gross area.", "Not counted: balconies, stairs, lifts, shelter, plant and conditional parking.", "Total construction area is the basis of the cost estimate."] },
          { title: "5. Estimate flats by dividing by the average flat size", body: "A first estimate divides the countable area by the intended average flat size. 1,500 m² gives roughly 12 flats of 125 m² gross, or about 15 flats of 100 m². This is only a starting point: the position of the stair and lift core, the façade length and the need for every flat to receive daylight decide the real number." },
          { title: "6. Minimums when designing small flats", body: "Every dwelling must have at least a living room (short side 3.00 m, 12 m² net), a bedroom (short side 2.50 m, 9 m² net), a kitchen or cooking area (3.30 m² net), a bathroom (3.00 m² net) and a WC (1.20 m² net); halls and corridors cannot be narrower than 1.20 m. Since the 2025 amendment, up to 20% of the units on a plot may have a sleeping niche of at least 9 m² with a 2.50 m short side inside the living room instead of a separate bedroom. Studio-type flats are therefore capped." },
          { title: "7. More flats mean more requirements", body: "More flats mean more parking, a larger shelter and more shared space. Parking numbers follow the Parking Regulation and the municipality's parking rules and directly affect the size of the basement. Buildings of three floors including the basement must leave space for a lift, and those of four or more must install one. Habitable floors must have an internal height of at least 2.60 metres.", points: ["Confirm parking requirements with the municipality.", "Cost the basement together with the number of flats.", "Place lift and shelter areas in the floor plan from the start."] },
          { title: "8. The most flats is not always the best result", body: "More flats mean more saleable units, but smaller flats, higher parking and shared-space costs and flat types that do not match local demand can weaken a project commercially. The right mix is set with local demand, the target buyer and your sales experience. We help you decide within zoning and regulatory limits by comparing different scenarios." },
          { title: "9. Decide with scenarios", body: "Preparing two or three layout scenarios for the same plot shows the balance of flat numbers, flat sizes, parking and shared space side by side. In land-for-flats negotiations, a scenario comparison also gives the landowner and contractor a shared, concrete basis." },
        ],
        takeaway: "Brief: “Our plot is block … parcel …, net area … m². The zoning status gives KAKS …, TAKS …, floors … . Our target flat types are … . We would like to see which layout scenarios are possible on this plot, together with parking and shared space needs.”",
      },
    },
  },
  {
    slug: "ic-mekan-tasarimina-nasil-baslanir", service: "ic-mimarlik-ankara", project: "konut-ic-mekan", topic: "interior", audiences: ["homeowner", "villa"], card: "/media/projects/konut-ic-mekan/living-2.jpg",
    explainers: ["tadilat", "iklim"],
    copy: {
      tr: {
        title: "İç mekân tasarımına nasıl başlanır? Adım adım rehber",
        description: "İhtiyaç listesi, ölçüm, bütçe, tesisat sınırları, yerleşim, ışık, malzeme, depolama, 3D ve uygulama sırası: iç mekân tasarımına baştan sona yol haritası.",
        intro: "İç mekân tasarımı mobilya ve renk seçmekle başlamaz; nasıl yaşadığınızı anlatmakla başlar. Bu rehber, yeni bir daireyi kuracak ya da mevcut evini yenileyecek biri için adımları uygulamadaki sırasıyla anlatır. Her adımda neye karar verdiğinizi ve neyin sonradan değiştirilmesinin zor olduğunu bilirseniz süreç hem daha keyifli hem daha az sürprizli olur.",
        sections: [
          { title: "1. Nasıl yaşadığınızı yazın", body: "Kaç kişi yaşıyor, kim evden çalışıyor, misafir ne sıklıkla geliyor, yemek ne kadar pişiriliyor, neler saklanmalı? Bir haftanızı anlatan kısa bir not, beğendiğiniz görsellerden daha değerli bir başlangıçtır. Beğendiğiniz görselleri de ekleyin; ama neyi sevdiğinizi (renk mi, ışık mı, düzen mi) yanına yazın.", points: ["Vazgeçilmez ihtiyaçlar ile ‘olsa iyi olur’ listesini ayırın.", "Mevcut evinizde sizi en çok rahatsız eden üç şeyi yazın."] },
          { title: "2. Mekânı ölçün ve belgeleyin", body: "Doğru tasarım doğru ölçüyle başlar. Duvarlar, pencere ve kapı açıklıkları, tavan yüksekliği, kolonlar, priz ve tesisat noktaları ölçülüp fotoğraflanır. Mevcut onaylı projeleriniz varsa bunlar taşıyıcı sistemi ve tesisatı anlamayı hızlandırır." },
          { title: "3. Bütçeyi kalemlere ayırın", body: "Tasarım hizmeti, uygulama ve işçilik, mobilya ve aydınlatma ürünleri ayrı kalemlerdir. Bütçeyi baştan bu başlıklara ayırmak ve önceliği belirlemek, paranın en çok fark yaratacağı yere gitmesini sağlar. Mevcut bir evde söküm sonrası ortaya çıkabilecek durumlar için pay bırakın." },
          { title: "4. Neye dokunulabileceğini öğrenin", body: "Kolon, kiriş ve perde duvarlar taşıyıcıdır ve kesilmez. Planlı Alanlar İmar Yönetmeliği'ne göre taşıyıcı sistemi, dış cepheyi ve ıslak hacimlerin yerini ya da sayısını değiştirmeyen işler basit tamir ve tadil kapsamındadır; banyo veya mutfağın yerini değiştirmek gibi bu sınırları aşan işler esaslı tadilat sayılır ve ruhsata tabidir. Apartmanlarda gider eğimi ve alt komşunun tavanı da ıslak hacimlerin yer değiştirmesini sınırlar.", points: ["Duvar kaldırmadan önce taşıyıcı olup olmadığını belirleyin.", "Banyo ve mutfağın yerini değiştirmeyi düşünüyorsanız önce izin durumunu öğrenin."] },
          { title: "5. Yerleşimi dolaşımla birlikte kurun", body: "Yerleşim planı, odaların değil hareketin planıdır: girişten mutfağa, yatak odasından banyoya, salondan balkona nasıl yürüdüğünüz. Yönetmelik konutlarda hol ve koridorların 1,20 metreden dar olamayacağını söyler; bu ölçü günlük rahatlık için de iyi bir alt sınırdır. Mobilyayı yerleştirirken kapı açılışlarını ve geçiş boşluklarını unutmayın." },
          { title: "6. Işığı katmanlarla düşünün", body: "Gün ışığının nereden geldiği, salonun ve çalışma köşesinin yerini belirler. Yapay ışık ise genellikle üç katmanda planlanır: genel aydınlatma, tezgâh veya masa gibi görev aydınlatması ve atmosfer yaratan vurgu ya da gizli aydınlatma. Ankara'nın uzun ve kısa günlü kışında iç mekân aydınlatması ayrıca önem kazanır.", points: ["Priz ve anahtar yerlerini mobilya planıyla birlikte belirleyin.", "Gizli aydınlatmanın trafo ve kablo yerlerini tasarım aşamasında çözün."] },
          { title: "7. Az sayıda, uyumlu malzeme seçin", body: "Sakin ve bütüncül bir iç mekân için az sayıda, birbiriyle konuşan malzeme yeterlidir. Ahşap, taş veya mermer gibi doğal yüzeyler ve gizli aydınlatma, son yıllarda sık talep edilen yaklaşımlardandır; Konut İç Mekân ve Villa İç Mekânı projelerimizde de ahşap ve mermer yüzeyler ile gizli LED aydınlatma bir arada kullanıldı. Malzemeyi numuneyle, gün ışığında ve yapay ışıkta görerek seçin." },
          { title: "8. Depolamayı ölçüye göre çözün", body: "Dağınıklığın çoğu yetersiz depolamadan gelir. Gömme dolaplar, TV duvarları ve niş çözümleri ölçüye göre tasarlandığında köşe ve boşlukları değerlendirir; mobilya ile duvar aynı detay diliyle çözüldüğünde mekân daha sade görünür." },
          { title: "9. Kararları 3D ile kontrol edin", body: "Yerleşim, malzeme ve ışık kararlarını uygulamadan önce 3D görselle görmek, en pahalı hatayı, yani uygulamadan sonra değiştirmeyi önler. Alternatifleri yan yana görmek aile içinde karar vermeyi de kolaylaştırır." },
          { title: "10. Uygulamayı doğru sırayla yapın", body: "Uygulama genellikle söküm, tesisat ve elektrik altyapısı, duvar ve tavan işleri, zemin ve yüzey kaplamaları, mobilya montajı ve son olarak aydınlatma ile aksesuar sırasıyla ilerler. Uygulama çizimleri, ustaların aynı belgeye bakarak çalışmasını sağlar; teslimde bir eksik listesiyle kontrol yapılır." },
        ],
        takeaway: "Görüşme notu: “Evimiz … m², … oda. Burada … kişi yaşıyor ve en çok … ile zorlanıyoruz. Islak hacimlerin yerini değiştirmeyi düşünüyoruz / düşünmüyoruz. Bütçemizi tasarım, uygulama ve mobilya olarak ayrı konuşmak ve kararları 3D'de görmek istiyoruz.”",
      },
      en: {
        title: "How to start an interior design project: a step-by-step guide",
        description: "Needs list, survey, budget, service limits, layout, light, materials, storage, 3D and construction order: a start-to-finish roadmap for your home's interior.",
        intro: "Interior design does not start with furniture and colour; it starts with describing how you live. This guide walks through the steps in the order they happen for anyone fitting out a new flat or renewing their home. Knowing what you decide at each step, and what is hard to change later, makes the process more enjoyable and less surprising.",
        sections: [
          { title: "1. Write down how you live", body: "How many people live there, who works from home, how often guests come, how much you cook, what needs storing? A short note describing your week is a more valuable start than images you like. Add those images too, but note what you like about them: the colour, the light or the layout.", points: ["Separate must-haves from nice-to-haves.", "List the three things that bother you most in your current home."] },
          { title: "2. Measure and document the space", body: "Good design starts with accurate measurements. Walls, window and door openings, ceiling height, columns, sockets and service points are measured and photographed. Any approved drawings you have speed up understanding the structure and services." },
          { title: "3. Break the budget into headings", body: "Design services, construction and labour, and furniture and lighting products are separate headings. Splitting the budget this way and setting priorities sends the money where it makes the most difference. In an existing home, leave an allowance for conditions found after stripping out." },
          { title: "4. Find out what can be touched", body: "Columns, beams and shear walls are load-bearing and are never cut. Under Türkiye's Planned Areas Zoning Regulation, work that does not change the structure, the external façade or the position or number of wet rooms counts as simple repair and alteration; work beyond that, such as moving a bathroom or kitchen, counts as a substantial alteration and needs a permit. In apartments, drainage falls and the neighbour's ceiling below also limit moving wet rooms.", points: ["Establish whether a wall is load-bearing before removing it.", "If you plan to move a bathroom or kitchen, check the permit position first."] },
          { title: "5. Plan the layout around movement", body: "A layout plan is a plan of movement rather than rooms: how you walk from the entrance to the kitchen, from the bedroom to the bathroom, from the living room to the balcony. The regulation says halls and corridors in dwellings cannot be narrower than 1.20 metres, which is also a good minimum for everyday comfort. Remember door swings and clearances when placing furniture." },
          { title: "6. Think of light in layers", body: "Where daylight comes from decides where the living room and work corner go. Artificial light is usually planned in three layers: general lighting, task lighting at worktops or desks, and accent or concealed lighting for atmosphere. In Ankara's long winters with short days, interior lighting matters even more.", points: ["Place sockets and switches together with the furniture plan.", "Resolve drivers and cables for concealed lighting at design stage."] },
          { title: "7. Choose a few compatible materials", body: "A small number of materials that work together is enough for a calm, coherent interior. Natural surfaces such as timber, stone or marble and concealed lighting are among the frequently requested approaches of recent years; our Residential Interior and Villa Interiors projects combine timber and marble surfaces with concealed LED lighting. Choose materials from samples, seen in daylight and artificial light." },
          { title: "8. Solve storage to measure", body: "Most clutter comes from too little storage. Built-in wardrobes, media walls and niches designed to measure make use of corners and gaps, and when furniture and walls share one detail language the space looks simpler." },
          { title: "9. Check decisions in 3D", body: "Seeing layout, material and lighting decisions in 3D before building prevents the most expensive mistake: changing things after construction. Seeing alternatives side by side also makes family decisions easier." },
          { title: "10. Build in the right order", body: "Construction usually runs from stripping out, services and electrical infrastructure, walls and ceilings, floors and finishes, furniture installation and finally lighting and accessories. Construction drawings let every trade work from the same document, and handover is checked against a snagging list." },
        ],
        takeaway: "Brief: “Our home is … m² with … rooms. … people live here and we struggle most with … . We are / are not considering moving the wet rooms. We would like to discuss the budget for design, construction and furniture separately and see the decisions in 3D.”",
      },
    },
  },
  {
    slug: "villa-almadan-once-tadilat-fizibilitesi", service: "muhendislik-danismanligi-ankara", project: "villa-donusumu", topic: "renovation", audiences: ["villa", "investor", "agent"], card: "/media/projects/villa-donusumu/during.jpg",
    explainers: ["tadilat", "zemin"],
    copy: {
      tr: {
        title: "Villa veya ev almadan önce tadilat fizibilitesi nasıl yapılır?",
        description: "Satın almadan önce belgeler, taşıyıcı sistem, tesisat, imar hakları ve projeye uygunluk: eski bir villanın yenileme potansiyelini ve risklerini görme rehberi.",
        intro: "Eski bir villa ya da daire, doğru yenilemeyle iyi bir yatırım olabilir; ama satın aldıktan sonra fark edilen bir yapısal sorun ya da projeye aykırı bir bölüm, bütçeyi ve takvimi tamamen değiştirebilir. Bu rehber, imza atmadan önce hangi soruların sorulması gerektiğini sırasıyla anlatır. Kesin teknik hüküm her zaman yerinde inceleme ve gerektiğinde ayrıntılı analizle verilir.",
        sections: [
          { title: "1. Neden satın almadan önce?", body: "Fiyat pazarlığı ve karar, mülkün bugünkü haline değil, yenilendikten sonraki toplam maliyetine göre verilmelidir. Satın alma öncesi teknik değerlendirme, sürprizleri sözleşmeden önce görünür kılar ve yenileme bütçesini gerçekçi bir çerçeveye oturtur." },
          { title: "2. Belgeleri isteyin", body: "Tapu, onaylı mimari proje ve yapı kullanma izin belgesi (iskân) ilk bakılacak belgelerdir. Yapı kullanma izin belgesi, Planlı Alanlar İmar Yönetmeliği'ndeki tanımıyla yapının ruhsat eki projelerine uygun olarak tamamlandığını gösterir. Belgelerin eksik olması tek başına satın almamak için sebep değildir, ama riskin ve ek işlerin işaretidir.", points: ["Tapu ve varsa şerhler.", "Onaylı mimari proje ve varsa statik proje.", "Yapı kullanma izin belgesi (iskân).", "Varsa önceki tadilat ruhsatları."] },
          { title: "3. Projeyle mevcut durumu karşılaştırın", body: "Kapatılmış balkonlar, sonradan eklenmiş katlar veya hacimler, yeri değişmiş ıslak hacimler projeye aykırılık oluşturabilir. Bu aykırılıklar ileride tadilat ruhsatı alırken, satarken veya kredi kullanırken sorun çıkarabilir. Onaylı proje ile yerindeki yapıyı karşılaştırmak, değerlendirmenin en önemli adımlarından biridir." },
          { title: "4. Taşıyıcı sisteme bakın", body: "Yapım yılı, kullanılan taşıyıcı sistem, görünür çatlaklar, nem ve korozyon izleri ilk incelemede değerlendirilir. Depreme dayanıklılık konusunda kesin bir sonuç, gerektiğinde malzeme testleri ve ayrıntılı analizle verilebilir; bu durumda hangi çalışmanın gerektiğini ve kimin yapabileceğini netleştiririz.", points: ["Kolon ve kirişlerde çatlak veya donatı korozyonu.", "Bodrum ve temelde nem izleri.", "Sonradan yapılmış taşıyıcı müdahaleleri."] },
          { title: "5. Tesisat, çatı ve yalıtımı değerlendirin", body: "Elektrik ve sıhhi tesisatın yaşı, çatı ve su yalıtımının durumu, doğrama ve ısı yalıtımı yenileme kapsamını doğrudan belirler. Ankara'nın soğuk kışında yalıtımı zayıf bir yapı, yenileme bütçesine ısı yalıtımını da eklemeyi gerektirebilir." },
          { title: "6. İmar haklarını öğrenin", body: "Mülkü büyütmeyi veya kat eklemeyi düşünüyorsanız, parselin imar durumundaki emsalin mevcut yapıda ne kadar kullanıldığına bakılmalıdır. Emsal dolmuşsa ek alan mümkün olmayabilir; dolmamışsa taşıyıcı sistemin ek yükü taşıyıp taşıyamayacağı ayrıca değerlendirilir." },
          { title: "7. Senaryoları ve kapsamı yazın", body: "İnceleme sonunda en az iki senaryo hazırlamak kararı kolaylaştırır: kısmi yenileme ve kapsamlı yenileme. Her senaryo için kapsam, izin gerekliliği ve belirsizlikler ayrı ayrı yazılır. Taşıyıcıya dokunan veya ıslak hacim yerini değiştiren işler esaslı tadilat sayılır ve ruhsata tabidir." },
          { title: "8. Belirsizlikleri görünür kılın", body: "Her şey satın almadan önce kesinleşmez; söküm sonrası ortaya çıkabilecek durumlar vardır. Önemli olan, bilinmeyenleri listelemek ve bütçede bunlar için pay bırakmaktır. Belirsizlikleri yazılı görmek, pazarlıkta da somut bir dayanak sağlar." },
        ],
        takeaway: "Görüşme notu: “… adresindeki … yılında yapılmış bir villayı almayı düşünüyoruz. Elimizde tapu ve … var. Satın almadan önce yapının teknik durumunu, projeye uygunluğunu ve kısmi ile kapsamlı yenileme senaryolarının kapsamını görmek istiyoruz.”",
      },
      en: {
        title: "Assessing renovation feasibility before buying a villa or home",
        description: "Documents, structure, services, zoning rights and compliance with approved drawings: seeing an older villa's renovation potential and risks before you buy.",
        intro: "An older villa or flat can be a good investment with the right renovation, but a structural problem or an unauthorised part discovered after purchase can change the budget and programme entirely. This guide sets out, in order, the questions to ask before signing. A definitive technical judgement always needs a site inspection and, where necessary, detailed analysis.",
        sections: [
          { title: "1. Why before buying?", body: "Negotiation and the decision should rest on the total cost after renovation, not on the property as it stands. A pre-purchase technical review makes surprises visible before the contract and puts the renovation budget on a realistic footing." },
          { title: "2. Ask for the documents", body: "The title deed, approved architectural drawings and the occupancy certificate come first. Under the Planned Areas Zoning Regulation, the occupancy certificate shows that the building was completed in line with its permit drawings. Missing documents are not on their own a reason not to buy, but they signal risk and extra work.", points: ["Title deed and any annotations.", "Approved architectural and, if available, structural drawings.", "Occupancy certificate.", "Any earlier alteration permits."] },
          { title: "3. Compare the drawings with reality", body: "Enclosed balconies, added floors or volumes and relocated wet rooms can breach the approved drawings. Such breaches can cause problems later when seeking an alteration permit, selling or taking a mortgage. Comparing the approved drawings with the building on site is one of the most important steps." },
          { title: "4. Look at the structure", body: "Construction year, structural system, visible cracks, damp and corrosion are assessed at the first inspection. A definitive answer on earthquake resistance may need material tests and detailed analysis; in that case we clarify which studies are needed and who can carry them out.", points: ["Cracks or exposed reinforcement in columns and beams.", "Damp in basements and foundations.", "Later interventions in the structure."] },
          { title: "5. Assess services, roof and insulation", body: "The age of electrical and plumbing services, the condition of the roof and waterproofing, windows and thermal insulation directly set the scope of renovation. In Ankara's cold winters, a poorly insulated building may need thermal insulation added to the budget." },
          { title: "6. Find out the zoning rights", body: "If you plan to extend or add a floor, check how much of the plot's floor area ratio the existing building already uses. If it is used up, more area may not be possible; if not, whether the structure can carry the extra load is assessed separately." },
          { title: "7. Write scenarios and scope", body: "Preparing at least two scenarios after the inspection makes the decision easier: partial and full renovation. For each, scope, permit needs and uncertainties are written separately. Work affecting the structure or moving wet rooms counts as a substantial alteration and needs a permit." },
          { title: "8. Make uncertainties visible", body: "Not everything can be settled before buying; some conditions only appear after stripping out. What matters is listing the unknowns and leaving an allowance for them. Seeing uncertainties in writing also gives a concrete basis in negotiation." },
        ],
        takeaway: "Brief: “We are considering a villa at … built in … . We have the title deed and … . Before buying we would like to see the building's technical condition, its compliance with the approved drawings and the scope of partial and full renovation scenarios.”",
      },
    },
  },
  {
    slug: "mutfak-salon-birlestirme", service: "mutfak-tasarimi-ankara", project: "villa-ic-mekan", topic: "interior", audiences: ["homeowner", "villa"], card: "/media/projects/villa-ic-mekan/kitchen.jpg",
    explainers: ["tadilat"],
    copy: {
      tr: {
        title: "Mutfak ve salonu birleştirmek: tasarım ve teknik kontrol listesi",
        description: "Açık mutfağa geçmeden önce taşıyıcı duvar, doğalgaz ve havalandırma, koku, zemin geçişi, ada, depolama ve aydınlatma: adım adım karar rehberi.",
        intro: "Mutfak ile salonu birleştirmek, evi daha ferah ve sosyal hale getiren en sık istenen dönüşümlerden biridir. Ama duvarı kaldırmak işin yalnızca başlangıcıdır; teknik sınırlar, koku ve havalandırma, malzeme geçişi ve depolama doğru çözülmezse sonuç beklendiği kadar keyifli olmaz. Bu rehber kararı adım adım verir.",
        sections: [
          { title: "1. Duvar taşıyıcı mı?", body: "İlk soru her zaman budur. Kolon, kiriş ve perde duvarlar kesilmez. Ara duvar olsa bile içinden tesisat geçebilir. Duvarın durumunu yerinde inceleyip, gerekiyorsa statik değerlendirmeyle netleştiririz.", points: ["Duvarın içindeki tesisat ve elektrik hatları.", "Apartmanlarda ortak alanı etkileyen bir değişiklik olup olmadığı."] },
          { title: "2. Doğalgaz ve havalandırma", body: "Doğalgazlı ocak, kombi veya şofben bulunan mutfaklarda açık mutfak kararı, gaz dağıtım şirketinin teknik esaslarına uygunluk açısından ayrıca kontrol edilmelidir; Ankara'da dağıtım şirketi Başkentgaz'dır. Havalandırma ve hacim şartları bu kararda belirleyicidir. Yönetmelik ayrıca bağımsız bölüm mutfaklarında aspiratör bacası öngörür; aspiratörün egzozunun bu bacaya nasıl bağlanacağı tasarımda çözülür." },
          { title: "3. Koku ve ses", body: "Açık mutfakta yemek kokusu ve cihaz sesleri doğrudan salona yayılır. Güçlü ve sessiz bir davlumbaz, iyi yerleştirilmiş bir ada ve gerektiğinde cam bölme ya da sürgülü panel, açıklığı korurken bu etkiyi azaltabilir." },
          { title: "4. Mutfağın yerini değiştirecek misiniz?", body: "Mutfağı yalnızca açmak ile yerini taşımak farklı işlerdir. Planlı Alanlar İmar Yönetmeliği'ne göre ıslak hacimlerin yerini değiştiren işler basit tadil kapsamında değildir; esaslı tadilat sayılır ve ruhsata tabidir. Apartmanlarda gider eğimi ve alt komşunun tavanı da yer değişikliğini sınırlar." },
          { title: "5. Ada mı, yarımada mı, tek duvar mı?", body: "Ada, hem hazırlık hem buluşma alanı olarak salonla mutfak arasında doğal bir geçiş oluşturur; ancak çevresinde rahat geçiş ve dolap kapaklarının açılması için yeterli boşluk ister. Dar planlarda yarımada veya tek duvar mutfak daha verimli olabilir." },
          { title: "6. Zemin ve malzeme geçişi", body: "Mutfak ve salonda aynı zemin kaplaması mekânı bütün gösterir; mutfakta suya ve lekeye dayanıklı bir yüzey ise kullanım kolaylığı sağlar. Geçişin nerede ve nasıl yapılacağı, ada veya tezgâh hattıyla birlikte planlanır." },
          { title: "7. Depolama kaybını telafi edin", body: "Duvar kalkınca üst dolap alanı da azalabilir. Kiler dolabı, ada altı depolama ve boy dolapları bu kaybı telafi etmenin yollarıdır. Mutfak dolaplarının salondan görünen yüzleri, salon mobilyasıyla aynı dilde tasarlanabilir." },
          { title: "8. Aydınlatmayı iki mekân için planlayın", body: "Tezgâh üzerinde güçlü görev aydınlatması, salonda ise daha yumuşak bir atmosfer gerekir. Aydınlatmayı ayrı devrelerle planlamak, aynı mekânda hem çalışmayı hem dinlenmeyi mümkün kılar." },
        ],
        takeaway: "Görüşme notu: “Mutfak ile salon arasındaki duvarı kaldırmak istiyoruz. Mutfakta doğalgazlı … var. Mutfağın yerini değiştirmeyi düşünüyoruz / düşünmüyoruz. Duvarın durumunu, gaz ve havalandırma şartlarını ve ada ile depolama seçeneklerini konuşmak istiyoruz.”",
      },
      en: {
        title: "Joining the kitchen and living room: a design and technical checklist",
        description: "Before opening up the kitchen: load-bearing walls, gas and ventilation, smells, floor transitions, islands, storage and lighting, decided step by step.",
        intro: "Joining the kitchen and living room is one of the most requested changes for a brighter, more sociable home. But removing a wall is only the start; if technical limits, smell and ventilation, material transitions and storage are not resolved, the result is less enjoyable than expected. This guide walks through the decision step by step.",
        sections: [
          { title: "1. Is the wall load-bearing?", body: "This is always the first question. Columns, beams and shear walls are never cut. Even a partition may carry services. We inspect the wall on site and, where necessary, confirm with a structural assessment.", points: ["Services and electrical lines inside the wall.", "In apartments, whether the change affects common areas."] },
          { title: "2. Gas and ventilation", body: "Where a kitchen has a gas hob, boiler or water heater, an open kitchen must also be checked against the gas distribution company's technical rules; in Ankara the distributor is Başkentgaz. Ventilation and volume requirements are decisive. The regulation also provides for an extract duct in apartment kitchens, and connecting the cooker hood to it is resolved in the design." },
          { title: "3. Smell and noise", body: "In an open kitchen, cooking smells and appliance noise reach the living room directly. A powerful, quiet hood, a well-placed island and, where needed, a glass screen or sliding panel can reduce this while keeping the openness." },
          { title: "4. Will the kitchen move?", body: "Opening the kitchen and relocating it are different jobs. Under the Planned Areas Zoning Regulation, work that moves wet rooms is not simple alteration; it counts as a substantial alteration and needs a permit. In apartments, drainage falls and the neighbour's ceiling below also limit relocation." },
          { title: "5. Island, peninsula or single wall?", body: "An island creates a natural link between kitchen and living room as a place to prepare and gather, but needs enough clearance for movement and cabinet doors. In tight plans a peninsula or single-wall kitchen can work better." },
          { title: "6. Floors and material transitions", body: "The same floor in kitchen and living room makes the space read as one; a water- and stain-resistant surface in the kitchen makes it easier to live with. Where and how the transition happens is planned together with the island or worktop line." },
          { title: "7. Make up for lost storage", body: "Removing a wall can also remove wall-cabinet space. A larder unit, storage under the island and tall cabinets are ways to compensate. The kitchen fronts seen from the living room can share the living room furniture's language." },
          { title: "8. Light both spaces", body: "Worktops need strong task lighting; the living room needs a softer atmosphere. Planning lighting on separate circuits lets one space serve both working and relaxing." },
        ],
        takeaway: "Brief: “We want to remove the wall between kitchen and living room. The kitchen has a gas … . We are / are not planning to move the kitchen. We would like to discuss the wall, the gas and ventilation requirements, and island and storage options.”",
      },
    },
  },
  {
    slug: "emlak-danismanlari-satisa-hazirlik", service: "emlak-danismanlari-icin-tasarim", project: "villa-donusumu", topic: "property", audiences: ["agent", "investor"], card: "/media/projects/tek-katli-ev/exterior.jpg",
    explainers: ["tadilat"],
    copy: {
      tr: {
        title: "Emlak danışmanları için satışa hazırlık ve 3D görsel anlatım",
        description: "Mülkü alıcı gözüyle okumak, hazırlık seviyeleri, konsept görsellerin doğru etiketlenmesi, teknik sorular ve onaylar: satış öncesi sunuma yol haritası.",
        intro: "Bazı mülkler alıcının hayal gücüne fazla iş bırakır: eski, boş ya da işlevi anlaşılmayan mekânlar bugünkü halleriyle değerlendirilir. Bu rehber, satış veya kiralama öncesinde mülkün potansiyelini dürüst ve anlaşılır biçimde anlatmanın adımlarını; danışman, mülk sahibi ve mimarlık ofisinin rollerini açıklar. Satış süresi veya fiyat için garanti verilemez; amaç alıcının değerlendirmesini kolaylaştırmaktır.",
        sections: [
          { title: "1. Mülkü alıcı gözüyle okuyun", body: "Alıcı hangi soruları soracak? Hangi oda işlevsiz görünüyor, hangi alan karanlık, hangi bölüm yenileme isteyecek gibi duruyor? Bu soruların listesi, hangi hazırlığın anlamlı olduğunu belirler." },
          { title: "2. Hazırlık seviyesini seçin", body: "Hazırlık her zaman tadilat demek değildir. Seçenekler genellikle üç seviyede düşünülür: temizlik, düzen ve küçük onarımlar; boya, aydınlatma ve bazı yüzeylerin yenilenmesi; kapsamlı yenileme. Hangi seviyenin anlamlı olduğu mülkün durumuna, hedef alıcıya ve mülk sahibinin bütçesine göre değişir.", points: ["Hafif: düzen, temizlik, küçük onarım.", "Orta: boya, aydınlatma, yüzey yenileme.", "Kapsamlı: yerleşim, tesisat ve mekân dönüşümü."] },
          { title: "3. Potansiyeli 3D konseptle anlatın", body: "Yenileme yapılmadan, mekânın olası halini 3D konsept görsellerle göstermek, alıcının olasılıkları görmesini kolaylaştırabilir. Bu görseller mutlaka “konsept” veya “temsili” olarak etiketlenmeli ve uygulanmış iş gibi sunulmamalıdır." },
          { title: "4. Teknik sorulara önceden hazırlanın", body: "Alıcılar çoğu zaman “bu duvar kalkar mı”, “mutfak taşınabilir mi”, “iskân var mı” diye sorar. Mülkün yapı kullanma izin belgesi, onaylı projeyle uyumu ve hangi değişikliklerin izin gerektirdiği önceden bilinirse bu sorulara net cevap verilir. Taşıyıcıya dokunan veya ıslak hacim yerini değiştiren işler ruhsata tabidir." },
          { title: "5. Rolleri ve onayları yazın", body: "Mülk üzerindeki her çalışma ve her görselin kullanımı mülk sahibinin onayını gerektirir. Danışman, mülk sahibi ve mimarlık ofisi arasında kimin neyi onaylayacağı, görsellerin nerede ve nasıl kullanılacağı işin başında yazılı hale getirilmelidir." },
          { title: "6. Çekim ve ilan öncesi kontrol", body: "Fotoğraf ve video çekiminden önce mekânın düzeni, ışığı ve temizliği sonucu doğrudan etkiler. Konsept görseller kullanılacaksa ilanın içinde mevcut durum fotoğraflarıyla birlikte ve açık etiketle sunulması, alıcıyla güvene dayalı bir ilişki kurar." },
        ],
        takeaway: "Görüşme notu: “Portföyümüzde … bölgesinde, … durumunda bir … var. Hedef alıcı … . Mülk sahibinin onayıyla hazırlık seçeneklerini, teknik soruların cevaplarını ve konsept görsel ihtiyacını konuşmak istiyoruz.”",
      },
      en: {
        title: "Pre-sale preparation and 3D presentation for estate agents",
        description: "Reading a property as a buyer, preparation levels, labelling concept images properly, technical questions and approvals: a roadmap for pre-sale presentation.",
        intro: "Some properties leave too much to the buyer's imagination: old, empty or hard-to-read spaces are judged as they stand. This guide sets out the steps to explain a property's potential honestly and clearly before sale or letting, and the roles of agent, owner and architecture office. Sale time or price cannot be guaranteed; the aim is to make the buyer's assessment easier.",
        sections: [
          { title: "1. Read the property as a buyer", body: "What will buyers ask? Which room looks purposeless, which area is dark, which part looks as if it needs renovation? Listing these questions decides which preparation makes sense." },
          { title: "2. Choose a preparation level", body: "Preparation does not always mean renovation. Options are usually considered at three levels: cleaning, order and small repairs; paint, lighting and renewing some surfaces; and full renovation. Which level makes sense depends on the property's condition, the target buyer and the owner's budget.", points: ["Light: order, cleaning, small repairs.", "Medium: paint, lighting, surface renewal.", "Full: layout, services and spatial transformation."] },
          { title: "3. Explain potential with a 3D concept", body: "Showing a possible future state through 3D concept images, without renovating, can make it easier for buyers to see the possibilities. These images must always be labelled as concepts and never presented as completed work." },
          { title: "4. Prepare for technical questions", body: "Buyers often ask whether a wall can go, whether the kitchen can move, or whether there is an occupancy certificate. Knowing in advance the occupancy certificate, compliance with the approved drawings and which changes need permission allows clear answers. Work touching the structure or moving wet rooms needs a permit." },
          { title: "5. Put roles and approvals in writing", body: "Any work on the property and any use of images needs the owner's approval. Who approves what between agent, owner and architecture office, and where and how images are used, should be put in writing at the start." },
          { title: "6. Before shooting and listing", body: "Order, light and cleanliness directly affect photos and video. If concept images are used, presenting them alongside photos of the current state and with clear labels builds trust with buyers." },
        ],
        takeaway: "Brief: “Our portfolio includes a … in … in … condition. The target buyer is … . With the owner's approval we would like to discuss preparation options, answers to technical questions and the need for concept images.”",
      },
    },
  },
  ...extraGuides,
];

export const getGuide = (slug: string) => guides.find((guide) => guide.slug === slug);

/** Guides worth reading next: same topic first, then shared readers; never the guide itself. */
export function relatedGuides(guide: StudioGuide, limit = 3): StudioGuide[] {
  const score = (other: StudioGuide) =>
    (other.topic === guide.topic ? 2 : 0) + other.audiences.filter((a) => guide.audiences.includes(a)).length;
  return guides
    .filter((other) => other.slug !== guide.slug)
    .map((other) => ({ other, s: score(other) }))
    .filter(({ s }) => s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map(({ other }) => other);
}

export const guidesForService = (service: string) =>
  guides.filter((guide) => guide.service === service || guide.alsoServices?.includes(service));

export const guidesForProject = (project: string) => guides.filter((guide) => guide.project === project);

export const guideLabels = {
  tr: { title: "Projenize başlamadan önce", description: "Mimarlık görüşmesine hazırlanmak, teklifleri kapsamlarıyla karşılaştırmak, bütçe ve yapı ruhsatı sürecini anlamak için U+ Studio rehberleri.", label: "Proje rehberleri", intro: "Henüz karar aşamasındaysanız önce doğru soruları netleştirin. Bu rehberler; projenizi anlatmanıza, sunulan hizmetleri karşılaştırmanıza, bütçeyi kalemlere ayırmanıza ve ruhsat sürecini planlamanıza yardımcı olur.", read: "Rehberi okuyun", all: "Tüm rehberler", next: "Bu bilgilerle projenizi konuşalım", service: "İlgili hizmeti inceleyin", project: "İlgili proje örneği", takeaway: "Görüşmede kullanabileceğiniz not", related: "İlgili rehberler" },
  en: { title: "Before you start your project", description: "U+ Studio guides to preparing for an architecture conversation, comparing proposals by scope, and understanding budgets and building permits.", label: "Project guides", intro: "If you are still weighing your options, start with the right questions. These guides help you describe your project, compare the services on offer, break a budget into headings and plan the permit process.", read: "Read the guide", all: "All guides", next: "Let's discuss your project with these questions in mind", service: "Explore the related service", project: "Related project example", takeaway: "A note to use in your conversation", related: "Related guides" },
} satisfies Record<Locale, Record<string, string>>;

export const guideTaxonomy: Record<Locale, { topics: Record<GuideTopic, string>; audiences: Record<GuideAudience, string>; readers: string; faq: string }> = {
  tr: {
    topics: {
      start: "Başlamadan önce: görüşme, teklif, bütçe",
      build: "Arsa ve yeni yapı",
      renovation: "Ev ve villa yenileme",
      interior: "İç mekân, mutfak ve banyo",
      property: "Emlak, müteahhit ve yatırım",
      commercial: "Ticari mekân",
      local: "İncek, Gölbaşı ve Ankara",
    },
    audiences: {
      homeowner: "Ev sahibiyim",
      villa: "Villa sahibiyim",
      landowner: "Arsa sahibiyim",
      agent: "Emlak danışmanıyım",
      developer: "Müteahhit / geliştiriciyim",
      investor: "Yatırımcı / kiraya verenim",
      business: "İşletme sahibiyim",
    },
    readers: "Bu rehber kimler için",
    faq: "Sık sorulan sorular",
  },
  en: {
    topics: {
      start: "Before you start: meetings, proposals, budget",
      build: "Plots and new buildings",
      renovation: "Home and villa renovation",
      interior: "Interiors, kitchens and bathrooms",
      property: "Property, developers and investment",
      commercial: "Commercial spaces",
      local: "İncek, Gölbaşı and Ankara",
    },
    audiences: {
      homeowner: "I own a home",
      villa: "I own a villa",
      landowner: "I own a plot",
      agent: "I am an estate agent",
      developer: "I am a contractor / developer",
      investor: "I invest / let property",
      business: "I run a business",
    },
    readers: "Who this guide is for",
    faq: "Frequently asked questions",
  },
};
