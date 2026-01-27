"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import Navigation from "@/components/Navigation";

interface Package {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
}

const packages: Record<string, Package> = {
  basic: {
    id: "basic",
    name: "Temel Paket",
    price: 5000,
    duration: "2 hafta",
    features: ["Konsept Tasarım", "2D Teknik Çizimler", "3 Danışmanlık", "2 Revizyon"]
  },
  starter: {
    id: "starter",
    name: "Başlangıç Paketi",
    price: 8000,
    duration: "3 hafta",
    features: ["Temel Konsept", "2D Çizimler", "Basit 3D", "5 Danışmanlık", "3 Revizyon"]
  },
  professional: {
    id: "professional",
    name: "Profesyonel Paket",
    price: 15000,
    duration: "4 hafta",
    features: ["Detaylı Konsept", "3D Modelleme", "Renderings", "Teknik Çizimler", "Sınırsız Danışmanlık", "Sınırsız Revizyon"]
  },
  business: {
    id: "business",
    name: "İş Paketi",
    price: 22000,
    duration: "6 hafta",
    features: ["İş Konsepti", "Gelişmiş 3D", "Premium Renderings", "Detaylı Teknik", "Malzeme Seçimi", "VIP Danışmanlık"]
  },
  enterprise: {
    id: "enterprise",
    name: "Kurumsal Paket",
    price: 30000,
    duration: "8 hafta",
    features: ["Kurumsal Konsept", "Profesyonel 3D", "360° VR Tur", "Ultra Premium", "Kurumsal Teknik", "Stratejik Danışmanlık"]
  },
  premium: {
    id: "premium",
    name: "Premium Paket",
    price: 45000,
    duration: "12 hafta",
    features: ["Özel Konsept", "Gelişmiş 3D", "360° VR", "Ultra HD", "Tam Teknik", "Malzeme Desteği", "VIP Danışmanlık", "Proje Yönetimi", "7/24 Destek"]
  }
};

export default function PurchasePage() {
  const { t } = useTranslation("purchase");
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    agreeTerms: false
  });

  useEffect(() => {
    const packageId = searchParams.get('package');
    if (packageId && packages[packageId]) {
      setSelectedPackage(packages[packageId]);
    } else {
      router.push('/#services');
    }
  }, [searchParams, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s/g, '');
    const matches = v.match(/\d{1,4}/g);
    return matches ? matches.join(' ') : '';
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + (v.length > 2 ? '/' + v.slice(2, 4) : '');
    }
    return v;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      alert(`Ödeme başarılı! ${selectedPackage?.name} paketi satın alındı. İşlem numarası: ${Date.now()}`);
      setIsProcessing(false);
      router.push('/#contact');
    }, 3000);
  };

  if (!selectedPackage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {t("title")}
            </h1>
            <p className="text-lg text-gray-600">
              {selectedPackage.name} - ₺{selectedPackage.price.toLocaleString()}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-4">{t("orderSummary")}</h2>
                
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-2">{selectedPackage.name}</h3>
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    ₺{selectedPackage.price.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-500">{selectedPackage.duration}</p>
                </div>

                <div className="border-t pt-4 mb-4">
                  <h4 className="font-medium text-gray-900 mb-3">{t("included")}</h4>
                  <ul className="space-y-2">
                    {selectedPackage.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">{t("subtotal")}</span>
                    <span className="font-medium">₺{selectedPackage.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">{t("tax")}</span>
                    <span className="font-medium">₺{(selectedPackage.price * 0.18).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>{t("total")}</span>
                    <span className="text-blue-600">
                      ₺{(selectedPackage.price * 1.18).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-semibold mb-6">{t("paymentInfo")}</h2>
                
                <div className="space-y-6">
                  {/* Card Information */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">{t("cardInfo")}</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t("cardNumber")}
                        </label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={(e) => {
                            const formatted = formatCardNumber(e.target.value);
                            setFormData(prev => ({ ...prev, cardNumber: formatted }));
                          }}
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          maxLength={19}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t("cardName")}
                        </label>
                        <input
                          type="text"
                          name="cardName"
                          value={formData.cardName}
                          onChange={handleInputChange}
                          placeholder="John Doe"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t("expiryDate")}
                        </label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={(e) => {
                            const formatted = formatExpiryDate(e.target.value);
                            setFormData(prev => ({ ...prev, expiryDate: formatted }));
                          }}
                          placeholder="MM/YY"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          maxLength={5}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t("cvv")}
                        </label>
                        <input
                          type="text"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          placeholder="123"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          maxLength={3}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Billing Information */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">{t("billingInfo")}</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t("email")}
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="john@example.com"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t("phone")}
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+90 5XX XXX XX XX"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t("address")}
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="123 Main St"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t("city")}
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            placeholder="İstanbul"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t("postalCode")}
                          </label>
                          <input
                            type="text"
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleInputChange}
                            placeholder="34000"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleInputChange}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      required
                    />
                    <label className="ml-2 text-sm text-gray-600">
                      {t("terms")}
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V4a8 8 0 00-16 0v4"></path>
                        </svg>
                        {t("processing")}
                      </span>
                    ) : (
                      `${t("payNow")} ₺{(selectedPackage.price * 1.18).toLocaleString()}`
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
