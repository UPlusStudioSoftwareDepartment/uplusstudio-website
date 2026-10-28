const ROUTE_ADDRESS = "İncek Mahallesi Reyhan Caddesi No:3, 06830 Gölbaşı/Ankara";

export const studioInfo = {
  email: "info@uplusstudio.com.tr",
  formInbox: "mimarhaceruyar@gmail.com",
  address: ["Merkez İncek Plaza, Reyhan Cd. No:3 Kat:1 D:2", "06830 İncek, Gölbaşı / Ankara"],
  routeAddress: ROUTE_ADDRESS,
  phoneDisplay: "+90 545 320 40 07",
  phoneHref: "tel:+905453204007",
  whatsappUrl: "https://wa.me/905453204007",
  instagramHandle: "@u.plusstudio",
  instagramUrl: "https://www.instagram.com/u.plusstudio/",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=U%2B+Studio+Mimarl%C4%B1k+%26+M%C3%BChendislik+Reyhan+Cd.+No%3A3+%C4%B0ncek+G%C3%B6lba%C5%9F%C4%B1+Ankara",
  directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(ROUTE_ADDRESS),
  yandexMapsUrl: "https://yandex.com.tr/maps/org/u_studio_mimarlik_muhendislik/39813977608/",
  armutUrl: "https://armut.com/hizmetveren/uplus-studio-ankara-golbasi-dis-klinigi-tasarimi_81440764",
  peyzajRehberUrl: "https://peyzajrehber.com.tr/firma/u-studio-mimarlik-tasarim-muhendislik-6578",
  founderLinkedIn: {
    hacer: "https://www.linkedin.com/in/hacer-uyar-architect/",
    ridvan: "https://www.linkedin.com/in/r%C4%B1dvan-uyar-269abb149/",
  },
  googleRating: "5.0",
  googleReviewCount: 11,
} as const;
