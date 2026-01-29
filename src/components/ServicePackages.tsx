"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";

interface Package {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
  popular?: boolean;
  icon: string;
  color?: string;
}

export default function ServicePackages() {
  const { t } = useTranslation("packages");
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  const packages: Package[] = [
    {
      id: "basic",
      name: t("basic.name"),
      price: 5000,
      duration: "2 hafta",
      features: [
        t("basic.features.concept"),
        t("basic.features.2dDrawings"),
        t("basic.features.consultation"),
        t("basic.features.revisions")
      ],
      icon: "🏠",
      color: "gray"
    },
    {
      id: "starter",
      name: t("starter.name"),
      price: 8000,
      duration: "3 hafta",
      features: [
        t("starter.features.concept"),
        t("starter.features.2dDrawings"),
        t("starter.features.basic3d"),
        t("starter.features.consultation"),
        t("starter.features.revisions")
      ],
      icon: "🏡",
      color: "blue"
    },
    {
      id: "professional",
      name: t("professional.name"),
      price: 15000,
      duration: "4 hafta",
      features: [
        t("professional.features.concept"),
        t("professional.features.3dModeling"),
        t("professional.features.renderings"),
        t("professional.features.technicalDrawings"),
        t("professional.features.consultation"),
        t("professional.features.unlimitedRevisions")
      ],
      popular: true,
      icon: "🏢",
      color: "indigo"
    },
    {
      id: "business",
      name: t("business.name"),
      price: 22000,
      duration: "6 hafta",
      features: [
        t("business.features.concept"),
        t("business.features.3dModeling"),
        t("business.features.premiumRenderings"),
        t("business.features.technicalDrawings"),
        t("business.features.materialSelection"),
        t("business.features.consultation"),
        t("business.features.unlimitedRevisions")
      ],
      icon: "🏬",
      color: "purple"
    },
    {
      id: "enterprise",
      name: t("enterprise.name"),
      price: 30000,
      duration: "8 hafta",
      features: [
        t("enterprise.features.concept"),
        t("enterprise.features.3dModeling"),
        t("enterprise.features.vrTour"),
        t("enterprise.features.premiumRenderings"),
        t("enterprise.features.technicalDrawings"),
        t("enterprise.features.materialSelection"),
        t("enterprise.features.consultation"),
        t("enterprise.features.unlimitedRevisions")
      ],
      icon: "🏰",
      color: "orange"
    },
    {
      id: "premium",
      name: t("premium.name"),
      price: 45000,
      duration: "12 hafta",
      features: [
        t("premium.features.concept"),
        t("premium.features.3dModeling"),
        t("premium.features.vrTour"),
        t("premium.features.ultraRenderings"),
        t("premium.features.technicalDrawings"),
        t("premium.features.materialSelection"),
        t("premium.features.consultation"),
        t("premium.features.unlimitedRevisions"),
        t("premium.features.projectManagement"),
        t("premium.features.support")
      ],
      icon: "�️",
      color: "red"
    }
  ];

  const handlePurchase = (packageId: string) => {
    setSelectedPackage(packageId);
    // TODO: Navigate to purchase page
    window.location.href = `/purchase?package=${packageId}`;
  };

  const getButtonColor = (pkg: Package) => {
    if (pkg.popular) {
      return 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl';
    }
    return 'bg-gray-100 text-gray-900 hover:bg-gray-200';
  };

  return (
     <section id="services">
    <div className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t("title")}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 ${
                pkg.popular ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              {pkg.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-1 text-sm font-semibold">
                  {t("popular")}
                </div>
              )}

              <div className="p-6 h-full flex flex-col">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-3">{pkg.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {pkg.name}
                  </h3>
                  <div className="text-gray-500 mb-3 text-sm">{pkg.duration}</div>
                  <div className="text-3xl font-bold text-gray-900">
                    ₺{pkg.price.toLocaleString()}
                    <span className="text-sm font-normal text-gray-500">/{t("project")}</span>
                  </div>
                </div>

                <div className="flex-grow">
                  <ul className="space-y-2 mb-6">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto">
                  <button
                    onClick={() => handlePurchase(pkg.id)}
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${getButtonColor(pkg)}`}
                  >
                    {t("purchase")}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {t("customPackage.title")}
            </h3>
            <p className="text-gray-600 mb-6">
              {t("customPackage.description")}
            </p>
            <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-full hover:from-blue-600 hover:to-indigo-700 transition-all duration-300">
              {t("customPackage.contact")}
            </button>
          </div>
        </div>
      </div>
    </div>
    </section>
  );
}
