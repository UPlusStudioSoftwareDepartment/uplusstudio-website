"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { locales, defaultLocale } from "./i18n";

// Import locale files statically
import enCommon from "../../public/locales/en/common.json";
import trCommon from "../../public/locales/tr/common.json";
import enHome from "../../public/locales/en/home.json";
import trHome from "../../public/locales/tr/home.json";
import enNavigation from "../../public/locales/en/navigation.json";
import trNavigation from "../../public/locales/tr/navigation.json";
import enAppointment from "../../public/locales/en/appointment.json";
import trAppointment from "../../public/locales/tr/appointment.json";
import enPackages from "../../public/locales/en/packages.json";
import trPackages from "../../public/locales/tr/packages.json";
import enPurchase from "../../public/locales/en/purchase.json";
import trPurchase from "../../public/locales/tr/purchase.json";

const resources = {
  en: {
    common: enCommon,
    home: enHome,
    navigation: enNavigation,
    appointment: enAppointment,
    packages: enPackages,
    purchase: enPurchase,
  },
  tr: {
    common: trCommon,
    home: trHome,
    navigation: trNavigation,
    appointment: trAppointment,
    packages: trPackages,
    purchase: trPurchase,
  },
};

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: defaultLocale,
      supportedLngs: locales,
      defaultNS: "common",
      interpolation: {
        escapeValue: false,
      },
    });
}

export function useLanguage() {
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return { changeLanguage };
}

export default i18n;
