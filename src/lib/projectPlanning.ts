import type { Locale } from "./i18n-config";

type PlanningCopy = Readonly<{
  processTitle: string;
  processIntro: string;
  preparationTitle: string;
  preparationIntro: string;
  preparation: readonly string[];
  faqTitle: string;
  faq: readonly (readonly [string, string])[];
  contact: string;
  projects: string;
}>;

// General decision support, based on the existing service scope; no price or delivery promises.
export const projectPlanning = {
  tr: {
    processTitle: "İlk fikirden sonraki adıma.",
    processIntro: "Her proje aynı hizmetlerin tamamına ihtiyaç duymaz. Tasarım, teknik projelendirme ve uygulama kapsamını ihtiyacınıza göre birlikte değerlendirelim.",
    preparationTitle: "İlk görüşmeye nasıl hazırlanabilirsiniz?",
    preparationIntro: "Her şeyin netleşmiş olması gerekmez. Elinizdeki bilgilerle başlayabiliriz; ilk değerlendirme için şu başlıklar yardımcı olur:",
    preparation: [
      "Konum ve mevcut durum: arsa mı, mevcut konut mu, ticari mekân mı? Varsa yaklaşık alan ve fotoğraflar.",
      "İhtiyaç ve öncelikler: mekânı kim, nasıl kullanacak; korunmasını veya değişmesini istediğiniz neler var?",
      "Proje aşaması: fikir, tasarım, yenileme veya uygulama. Varsa mevcut plan ve çizimler.",
      "Bütçe aralığı ve hedef takvim: kesinleşmediyse önceliklerinizi ve kısıtlarınızı paylaşabilirsiniz.",
    ],
    faqTitle: "Başlamadan önce aklınızdakiler.",
    faq: [
      ["Henüz ne istediğim tam belli değil. Görüşebilir miyiz?", "Evet. Arsanızı ya da mekânınızı, kullanım ihtiyacınızı ve önceliklerinizi konuşarak başlayabiliriz. Benzer bir proje incelemek isterseniz portföyümüzdeki tasarım ve dönüşüm örneklerine bakabilirsiniz."],
      ["Tasarım hizmeti ile uygulama aynı şey mi?", "Tasarım; mekân kurgusu, görselleştirme ve kapsamına göre teknik çizimleri içerir. Uygulama ise bu kararların sahada hayata geçirilmesidir. İhtiyacınız olan hizmetleri ve teslimleri ilk görüşmede ayrı ayrı değerlendirelim."],
      ["Projenin bedelini neler etkiler?", "Alan, mevcut durum, istenen tasarım ve çizimlerin kapsamı, malzeme kararları ve uygulama ihtiyacı değerlendirmeyi etkiler. Tasarım bedeliyle yapım bütçesini ayrı konuşmak, farklı teklifleri aynı kapsam üzerinden karşılaştırmanıza yardımcı olur."],
      ["Proje ne kadar sürer?", "Süre; proje ölçeğine, mevcut bilgilere, tasarım kararlarına ve seçilen hizmetlere bağlıdır. Teknik değerlendirme, ilgili onaylar ve uygulama ihtiyacı da takvimi etkileyebilir. Projenizi tanımadan kesin bir teslim tarihi vermek doğru olmaz."],
    ],
    contact: "Projenizi anlatın",
    projects: "Önce projeleri inceleyin",
  },
  en: {
    processTitle: "From a first idea to a clear next step.",
    processIntro: "Not every project needs every service. Let's review the design, technical documentation and construction scope around your needs.",
    preparationTitle: "What helps at the first conversation?",
    preparationIntro: "You do not need to have everything settled. We can start with what you know; these details help with the initial discussion:",
    preparation: [
      "Location and current condition: a plot, an existing home or commercial space? Approximate area and photos, if available.",
      "Needs and priorities: who will use the space, how they will use it, and what you want to keep or change.",
      "Project stage: an idea, design, renovation or construction. Any existing plans or drawings.",
      "Budget range and intended timeline: if these are still open, share your priorities and constraints.",
    ],
    faqTitle: "Questions before you begin.",
    faq: [
      ["Can we talk before I have a clear brief?", "Yes. We can start with your plot or space, how it will be used and your priorities. Explore the design and transformation projects in our portfolio if you would like to see related examples first."],
      ["Are design and construction the same service?", "Design includes space planning, visualisation and technical drawings according to the scope. Construction brings those decisions to life on site. We can discuss the services and deliverables you need separately at the first conversation."],
      ["What affects the project fee?", "Area, existing conditions, the scope of design and drawings, material decisions and construction needs affect the assessment. Discussing design fees separately from the construction budget helps you compare proposals on the same basis."],
      ["How long will the project take?", "Timing depends on scale, available information, design decisions and the services selected. Technical assessment, relevant approvals and construction needs can also affect the schedule. A firm delivery date requires an understanding of your project."],
    ],
    contact: "Tell us about your project",
    projects: "Explore the projects first",
  },
} satisfies Record<Locale, PlanningCopy>;
