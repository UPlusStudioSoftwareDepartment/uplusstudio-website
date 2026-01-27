// src/app/purchase/PurchaseForm.tsx
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

export default function PurchaseForm() {
  const { t } = useTranslation("purchase");
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [i18nReady, setI18nReady] = useState(false);
  
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
    setIsClient(true);
    // Wait for i18n to be ready
    const timer = setTimeout(() => {
      setI18nReady(true);
    }, 100);
    
    const packageId = searchParams.get('package');
    if (packageId && packages[packageId]) {
      setSelectedPackage(packages[packageId]);
    } else {
      router.push('/#services');
    }
    
    return () => clearTimeout(timer);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Your form submission logic here
    try {
      // Process payment
      setIsProcessing(false);
      router.push('/success');
    } catch (error) {
      console.error('Payment failed:', error);
      setIsProcessing(false);
    }
  };

  if (!isClient || !i18nReady) {
    return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>;
  }

  if (!selectedPackage) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-center mb-8">Ödeme İşlemi</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Paket Detayları</h2>
          <div className="mb-6">
            <h3 className="text-lg font-medium">{selectedPackage.name}</h3>
            <p className="text-2xl font-bold text-blue-600 my-2">{selectedPackage.price} TL</p>
            <p className="text-gray-600 mb-4">{selectedPackage.duration} süre</p>
            <ul className="space-y-2">
              {selectedPackage.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Ödeme Bilgileri</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kart Numarası</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formatCardNumber(formData.cardNumber)}
                    onChange={handleInputChange}
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                    maxLength={19}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kart Üzerindeki İsim</label>
                  <input
                    type="text"
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleInputChange}
                    placeholder="Ad Soyad"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Son Kullanma Tarihi</label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                    <input
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      placeholder="***"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                      maxLength={3}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h2 className="text-xl font-semibold mb-4">İletişim Bilgileri</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">E-posta Adresi</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefon Numarası</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adres</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Şehir</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Posta Kodu</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="agreeTerms"
                name="agreeTerms"
                type="checkbox"
                checked={formData.agreeTerms}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                required
              />
              <label htmlFor="agreeTerms" className="ml-2 block text-sm text-gray-700">
                <a href="/terms" className="text-blue-600 hover:text-blue-500">Kullanım koşullarını</a> ve <a href="/privacy" className="text-blue-600 hover:text-blue-500">gizlilik politikasını</a> okudum ve kabul ediyorum.
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={isProcessing}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isProcessing ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isProcessing ? 'İşleniyor...' : `${selectedPackage.price} TL Öde`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}