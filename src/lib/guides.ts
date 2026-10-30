import type { Locale } from "./i18n-config";
import { renovationGuide } from "./renovationGuide";

type GuideSection = Readonly<{ title: string; body: string; points?: readonly string[] }>;
export type GuideCopy = Readonly<{ title: string; description: string; intro: string; sections: readonly GuideSection[]; takeaway: string }>;
export type StudioGuide = Readonly<{ slug: string; service: string; project: string; copy: Record<Locale, GuideCopy> }>;

export const guides: readonly StudioGuide[] = [
  renovationGuide,
  {
    slug: "ilk-mimarlik-gorusmesi", service: "incek-golbasi-mimarlik-ofisi", project: "villa-donusumu",
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
    slug: "mimari-teklif-karsilastirma", service: "ic-mimarlik-ankara", project: "konut-ic-mekan",
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
];

export const getGuide = (slug: string) => guides.find((guide) => guide.slug === slug);

export const guideLabels = {
  tr: { title: "Projenize başlamadan önce", description: "Mimarlık görüşmesine hazırlanmak ve hizmet tekliflerini kapsamlarıyla değerlendirmek için U+ Studio rehberleri.", label: "Proje rehberleri", intro: "Henüz karar aşamasındaysanız önce doğru soruları netleştirin. Bu rehberler, projenizi anlatmanıza ve sunulan hizmetleri karşılaştırmanıza yardımcı olur.", read: "Rehberi okuyun", all: "Tüm rehberler", next: "Bu bilgilerle projenizi konuşalım", service: "İlgili hizmeti inceleyin", project: "İlgili proje örneği", takeaway: "Görüşmede kullanabileceğiniz not", related: "Sıradaki rehber" },
  en: { title: "Before you start your project", description: "U+ Studio guides to preparing for an architecture conversation and comparing service proposals through their scope.", label: "Project guides", intro: "If you are still weighing your options, start with the right questions. These guides help you describe your project and compare the services on offer.", read: "Read the guide", all: "All guides", next: "Let's discuss your project with these questions in mind", service: "Explore the related service", project: "Related project example", takeaway: "A note to use in your conversation", related: "Read next" },
} satisfies Record<Locale, Record<string, string>>;
