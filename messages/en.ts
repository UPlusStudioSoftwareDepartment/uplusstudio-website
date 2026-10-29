import { studio_en } from "@/app/[locale]/locales/en_US";
import { glossary_en } from "@/app/[locale]/glossary/locales/en_US";
import { about_en } from "@/app/[locale]/about/locales/en_US";
import { contact_en } from "@/app/[locale]/contact/locales/en_US";

const app_en={
  "packages": {
    "title": "Architectural Packages",
    "subtitle": "Choose from our professional architectural packages tailored to your project's size and needs",
    "popular": "Most Popular",
    "project": "Project",
    "purchase": "Request a quote",
    "requestMessage": "I'd like a quote and an initial meeting for the {name} package ({price} + VAT). My project's location and approximate size: ",
    "customPackage": {
      "title": "Request Custom Package",
      "description": "Let us prepare a custom package for your project's specific needs",
      "contact": "Contact Us"
    },
    "basic": {
      "name": "Basic Package",
      "duration": "2 Weeks",
      "features": {
        "concept": "Concept Design",
        "2dDrawings": "2D Technical Drawings",
        "consultation": "3 Consultation Meetings",
        "revisions": "2 Revision Rights"
      }
    },
    "starter": {
      "name": "Starter Package",
      "duration": "3 Weeks",
      "features": {
        "concept": "Concept Design",
        "2dDrawings": "2D Technical Drawings",
        "basic3d": "Basic 3D Modeling",
        "consultation": "4 Consultation Meetings",
        "revisions": "3 Revision Rights"
      }
    },
    "professional": {
      "name": "Professional Package",
      "duration": "3 Weeks",
      "features": {
        "concept": "Concept Design",
        "3dModeling": "3D Modeling",
        "renderings": "Renderings",
        "technicalDrawings": "Technical Drawings",
        "consultation": "Consultation",
        "unlimitedRevisions": "3 Revision Rounds"
      }
    },
    "business": {
      "name": "Business Package",
      "duration": "4 Weeks",
      "features": {
        "concept": "Concept Design",
        "3dModeling": "3D Modeling",
        "premiumRenderings": "Premium Renderings",
        "technicalDrawings": "Technical Drawings",
        "materialSelection": "Material Selection",
        "consultation": "Consultation",
        "unlimitedRevisions": "3 Revision Rounds"
      }
    },
    "enterprise": {
      "name": "Enterprise Package",
      "duration": "8 Weeks",
      "features": {
        "concept": "Enterprise Concept Design",
        "3dModeling": "Professional 3D Modeling",
        "vrTour": "360° Virtual Tour",
        "premiumRenderings": "Ultra Premium Renderings",
        "technicalDrawings": "Corporate Technical Documentation",
        "materialSelection": "Professional Material Selection",
        "consultation": "Strategic Consultation",
        "unlimitedRevisions": "3 Revision Rounds"
      }
    },
    "cafe": {
      "name": "Cafe Package",
      "duration": "4 Weeks",
      "features": {
        "concept": "Concept Design",
        "layout": "Space Layout",
        "kitchenDesign": "Kitchen Design",
        "seating": "Seating Areas",
        "lighting": "Lighting Design",
        "technicalDrawings": "Technical Drawings",
        "consultation": "Consultation"
      }
    },
    "gym": {
      "name": "Gym Package",
      "duration": "5 Weeks",
      "features": {
        "concept": "Concept Design",
        "equipmentLayout": "Equipment Layout",
        "lockerRooms": "Locker Rooms",
        "reception": "Reception Area",
        "ventilation": "Ventilation System",
        "technicalDrawings": "Technical Drawings",
        "consultation": "Consultation"
      }
    },
    "premium": {
      "name": "Premium Package",
      "duration": "12 Weeks",
      "features": {
        "concept": "Custom Concept Design",
        "3dModeling": "Advanced 3D Modeling",
        "vrTour": "360° Virtual Tour",
        "ultraRenderings": "Ultra HD Renderings",
        "technicalDrawings": "Complete Technical Documentation",
        "materialSelection": "Material Selection Support",
        "consultation": "VIP Consultation",
        "unlimitedRevisions": "3 Revision Rounds",
        "projectManagement": "Project Management",
        "support": "24/7 Support"
      }
    }
  },
  "appointment": {
    "flexibleDate": "Flexible — please suggest a time",
    "flexibleShort": "Flexible",
    "scheduleHint": "Choose the day and time that suit you; your request reaches the studio with this slot.",
    "title": "Book Appointment",
    "subtitle": "Request an appointment for architectural consultation",
    "name": "Your Full Name",
    "email": "Your Email Address",
    "phone": "Your Phone Number",
    "service": "Service Type",
    "selectService": "Select Service",
    "date": "Date",
    "time": "Time",
    "message": "Your Message",
    "submit": "Send Appointment Request",
    "sending": "Sending...",
    "success": "Your appointment request is ready in Gmail. Press Send and your appointment card reaches our studio; you can share or download the card below.",
    "successMessage": "Your email is ready in Gmail — don't forget to send it!",
    "successMobile": "Your appointment request is ready as an email. If your mail app didn't open, tap the button below and press Send.",
    "successSent": "Your appointment request has reached our studio. Once it is confirmed you will receive an email with a calendar link; you can share or download your card below.",
    "successRetry": "Your appointment request is ready. Press the button below to open Gmail; your message is already written, just press Send.",
    "openGmail": "Open Gmail",
    "error": "An error occurred while sending the appointment request.",
    "errorNotConfigured": "Email service is not configured. Please try again later or contact us via the contact page.",
    "personalInfo": "Personal Information",
    "namePlaceholder": "Your full name",
    "emailPlaceholder": "you@example.com",
    "phonePlaceholder": "+90 5XX XXX XX XX",
    "schedule": "Date & Time",
    "messagePlaceholder": "Tell us briefly about your project and what you need (at least 10 characters)",
    "book": "Book Appointment",
    "cancel": "Cancel",
    "selectDate": "Select Date",
    "digitalPass": "Digital Appointment Pass",
    "guest": "Guest",
    "appointmentDate": "Date",
    "fillRequired": "Please fill in all required fields.",
    "validation": {
      "required": "This field is required.",
      "nameMin": "Name must be at least 3 characters.",
      "nameInvalid": "Name must contain only letters.",
      "emailInvalid": "Please enter a valid email address.",
      "phoneInvalid": "Please enter a valid phone number (e.g. +90 532 123 45 67 or +44 20 7946 0000).",
      "dateFuture": "The earliest appointment date is tomorrow.",
      "dateRequired": "Please choose a day.",
      "timeRequired": "Please choose a time.",
      "messageMin": "Message must be at least 10 characters.",
      "messageMax": "Message must be at most 500 characters."
    },
    "services": {
      "architectural": "Architectural Design",
      "interior": "Interior Architecture",
      "renovation": "Renovation & Refurbishment",
      "villa": "Villas & Detached Homes",
      "commercial": "Cafés, Restaurants & Retail",
      "office": "Offices & Clinics",
      "visualization": "3D Visualisation",
      "consulting": "Consultancy",
      "site": "Site Works",
      "project": "Construction & Project Management"
    }
  },
  "common": {
    "errorTitle": "Something went wrong",
    "errorDescription": "A problem occurred while loading the page. Please try again.",
    "retry": "Try again",
    "notFound": "Page not found.",
    "backHome": "Back to home",
    "skipToContent": "Skip to content"
  },
  "contact": contact_en,
  "glossary": glossary_en,
  "studio": studio_en,
  "about": about_en,
};

export default app_en;

