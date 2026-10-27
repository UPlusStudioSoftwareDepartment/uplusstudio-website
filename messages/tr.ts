import { studio_tr } from "@/app/[locale]/locales/tr_TR";
import { glossary_tr } from "@/app/[locale]/glossary/locales/tr_TR";
import { about_tr } from "@/app/[locale]/about/locales/tr_TR";
import { contact_tr } from "@/app/[locale]/contact/locales/tr_TR";
import { faq_tr } from "@/app/[locale]/faq/locales/tr_TR";

const app_tr = {
  "packages": {
    "title": "Mimari Paketleri",
    "subtitle": "Projenizin büyüklüğüne ve ihtiyaçlarınıza uygun profesyonel mimari paketlerimizden seçim yapın",
    "popular": "En Popüler",
    "project": "Proje",
    "purchase": "Teklif iste",
    "requestMessage": "{name} paketi ({price} + KDV) için teklif ve ön görüşme talep ediyorum. Projemin konumu ve yaklaşık metrekaresi: ",
    "customPackage": {
      "title": "Özel Paket İsteyin",
      "description": "Projenizin spesifik ihtiyaçları için size özel bir paket hazırlayalım",
      "contact": "İletişime Geç"
    },
    "basic": {
      "name": "Temel Paket",
      "duration": "2 Hafta",
      "features": {
        "concept": "Konsept Tasarım",
        "2dDrawings": "2D Teknik Çizimler",
        "consultation": "3 Danışmanlık Görüşmesi",
        "revisions": "2 Revizyon Hakkı"
      }
    },
    "starter": {
      "name": "Başlangıç Paketi",
      "duration": "3 Hafta",
      "features": {
        "concept": "Konsept Tasarım",
        "2dDrawings": "2D Teknik Çizimler",
        "basic3d": "Temel 3D Modelleme",
        "consultation": "4 Danışmanlık Görüşmesi",
        "revisions": "3 Revizyon Hakkı"
      }
    },
    "professional": {
      "name": "Profesyonel Paket",
      "duration": "3 Hafta",
      "features": {
        "concept": "Konsept Tasarım",
        "3dModeling": "3D Modelleme",
        "renderings": "Renderings",
        "technicalDrawings": "Teknik Çizimler",
        "consultation": "Danışmanlık",
        "unlimitedRevisions": "3 Revizyon Hakkı"
      }
    },
    "business": {
      "name": "İşletme Paketi",
      "duration": "4 Hafta",
      "features": {
        "concept": "Konsept Tasarım",
        "3dModeling": "3D Modelleme",
        "premiumRenderings": "Premium Renderings",
        "technicalDrawings": "Teknik Çizimler",
        "materialSelection": "Malzeme Seçimi",
        "consultation": "Danışmanlık",
        "unlimitedRevisions": "3 Revizyon Hakkı"
      }
    },
    "enterprise": {
      "name": "Kurumsal Paket",
      "duration": "6 Hafta",
      "features": {
        "concept": "Konsept Tasarım",
        "3dModeling": "3D Modelleme",
        "vrTour": "VR Tur",
        "premiumRenderings": "Premium Renderings",
        "technicalDrawings": "Teknik Çizimler",
        "materialSelection": "Malzeme Seçimi",
        "consultation": "Danışmanlık",
        "unlimitedRevisions": "3 Revizyon Hakkı"
      }
    },
    "cafe": {
      "name": "Kafe Paketi",
      "duration": "4 Hafta",
      "features": {
        "concept": "Konsept Tasarım",
        "layout": "Mekan Düzeni",
        "kitchenDesign": "Mutfak Tasarımı",
        "seating": "Oturma Alanları",
        "lighting": "Aydınlatma Tasarımı",
        "technicalDrawings": "Teknik Çizimler",
        "consultation": "Danışmanlık"
      }
    },
    "gym": {
      "name": "Spor Salonu Paketi",
      "duration": "5 Hafta",
      "features": {
        "concept": "Konsept Tasarım",
        "equipmentLayout": "Ekipman Düzeni",
        "lockerRooms": "Soyunma Odaları",
        "reception": "Resepsiyon Alanı",
        "ventilation": "Havalandırma Sistemi",
        "technicalDrawings": "Teknik Çizimler",
        "consultation": "Danışmanlık"
      }
    },
    "premium": {
      "name": "Premium Paket",
      "duration": "12 Hafta",
      "features": {
        "concept": "Özel Konsept Tasarım",
        "3dModeling": "Gelişmiş 3D Modelleme",
        "vrTour": "360° Sanal Gezinti",
        "ultraRenderings": "Ultra HD Görseller",
        "technicalDrawings": "Tam Teknik Dokümantasyon",
        "materialSelection": "Malzeme Seçimi Desteği",
        "consultation": "VIP Danışmanlık",
        "unlimitedRevisions": "3 Revizyon Hakkı",
        "projectManagement": "Proje Yönetimi",
        "support": "7/24 Destek"
      }
    }
  },
  "appointment": {
    "title": "Randevu Al",
    "subtitle": "Mimari danışmanlık için randevu talebinde bulunun",
    "name": "Adınız Soyadınız",
    "email": "E-posta Adresiniz",
    "phone": "Telefon Numaranız",
    "service": "Hizmet Türü",
    "selectService": "Hizmet Seçin",
    "date": "Tarih",
    "time": "Saat",
    "message": "Mesajınız",
    "submit": "Randevu Talebi Gönder",
    "sending": "Gönderiliyor...",
    "success": "Randevu talebiniz Gmail'de hazır. Gönder'e bastığınızda randevu kartınız stüdyomuza ulaşır; kartı aşağıdan paylaşabilir ya da indirebilirsiniz.",
    "successMessage": "Gmail'de e-postanız hazır — göndermeyi unutmayın!",
    "successMobile": "Randevu talebiniz e-posta olarak hazırlandı. E-posta uygulamanız açılmadıysa aşağıdaki butona dokunun ve Gönder'e basın.",
    "successPaste": "Randevu kartı kopyalandı — Gmail'de mesaj alanına Ctrl+V ile yapıştırıp gönderin.",
    "successPasteLong": "Etkileşimli randevu kartınız kopyalandı ve Gmail açıldı. Mesaj alanına tıklayıp Ctrl+V (Mac'te ⌘+V) ile yapıştırın, ardından Gönder'e basın. Kartı aşağıdan paylaşabilir ya da indirebilirsiniz.",
    "error": "Randevu talebi gönderilirken bir hata oluştu.",
    "errorNotConfigured": "E-posta servisi şu an yapılandırılmadı. Lütfen daha sonra tekrar deneyin veya iletişim sayfasından bize yazın.",
    "personalInfo": "Kişisel Bilgiler",
    "namePlaceholder": "Adınız Soyadınız",
    "emailPlaceholder": "ornek@email.com",
    "phonePlaceholder": "05XX XXX XX XX",
    "schedule": "Tarih ve Saat",
    "messagePlaceholder": "Projenizi ve beklentilerinizi kısaca anlatın (en az 10 karakter)",
    "book": "Randevu Al",
    "cancel": "İptal",
    "selectDate": "Tarih Seçin",
    "digitalPass": "Dijital Randevu Kartı",
    "guest": "Misafir",
    "appointmentDate": "Tarih",
    "fillRequired": "Lütfen zorunlu alanları doldurun.",
    "validation": {
      "required": "Bu alan zorunludur.",
      "nameMin": "Ad en az 3 karakter olmalıdır.",
      "nameInvalid": "Ad yalnızca harf içermelidir.",
      "emailInvalid": "Geçerli bir e-posta adresi giriniz.",
      "phoneInvalid": "Geçerli bir cep telefonu numarası girin (örn. 0532 123 45 67).",
      "dateFuture": "Randevu tarihi yarından sonra olmalıdır.",
      "messageMin": "Mesaj en az 10 karakter olmalıdır.",
      "messageMax": "Mesaj en fazla 500 karakter olabilir."
    },
    "services": {
      "architectural": "Mimari Tasarım",
      "interior": "İç Mimarlık",
      "renovation": "Tadilat & Yenileme",
      "villa": "Villa & Müstakil Ev",
      "commercial": "Kafe, Restoran & Mağaza",
      "office": "Ofis & Klinik",
      "visualization": "3D Görselleştirme",
      "consulting": "Danışmanlık",
      "site": "Şantiye İşleri",
      "project": "Uygulama & Proje Yönetimi"
    }
  },
  "common": {
    "loading": "Yükleniyor...",
    "errorTitle": "Bir hata oluştu",
    "errorDescription": "Sayfa yüklenirken bir sorun oluştu. Lütfen tekrar deneyin.",
    "retry": "Tekrar dene",
    "notFound": "Sayfa bulunamadı.",
    "backHome": "Ana sayfaya dön",
    "skipToContent": "İçeriğe atla"
  },
  "about": about_tr,
  "contact": contact_tr,
  "faq": faq_tr,
  "glossary": glossary_tr,
  "studio": studio_tr
}
export default app_tr;