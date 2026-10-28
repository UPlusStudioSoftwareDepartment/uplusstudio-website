'use client';

import { m } from 'framer-motion';
import Image from 'next/image';
import JumpingGame from '@/components/JumpingGame';
import ProfessionalCard from './ProfessionalCard';
import CompanyLocation from './CompanyLocation';
import ServicesModal from './ServicesModal';
import FounderModal from './FounderModal';
import FounderCard, { type Founder } from './FounderCard';
import { useState, useEffect } from 'react';

export default function MaintenancePage() {
  const [showServices, setShowServices] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [selectedFounder, setSelectedFounder] = useState<Founder | null>(null);
  const [showFounderModal, setShowFounderModal] = useState(false);

  const founders = [
    {
      name: 'Hacer UYAR',
      title: 'Mimar',
      role: 'Kurucu Ortak',
      image: '/images/persons/founders/hacer_uyar/haceruyar_face_2.png',
      description: 'UPlus Studio\'nun kurucu ortağı Kıdemli Mimar olarak mimari projelerin tasarım ve uygulama süreçlerinde liderlik yapmaktadır. Yaratıcı çözümleri ve detaylara olan hassasiyeti ile projelere estetik ve işlevsellik katar, proje yönetimi uzmanlığı ile projelerin zamanında ve kaliteli tamamlanmasını sağlamaktadır.'
    },
    {
      name: 'Rıdvan UYAR',
      title: 'İnşaat Mühendisi',
      role: 'Kurucu Ortak',
      image: '/images/persons/founders/ridvan_uyar/ridvanuyar_face.jpeg',
      description: 'UPlus Studio\'nun kurucu ortağı İnşaat mühendisi olarak projenin teknik altyapısını ve yapısal güvenliğini sağlamada teknik liderlik yapmaktadır. Modern mühendislik çözümleri ve teknik altyapı uzmanlığı ile projelerin sorunsuz ve kaliteli tamamlanmasını sağlamaktadır.'
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleError = () => setHasError(true);
    globalThis.addEventListener('error', handleError);
    return () => globalThis.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Bir Hata Oluştu</h1>
          <p className="text-gray-300 mb-4">Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.</p>
          <button 
            onClick={() => globalThis.location.reload()}
            className="bg-white text-black px-6 py-2 rounded hover:bg-black hover:text-white transition-colors"
          >
            Sayfayı Yenile
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-black text-white overflow-y-auto overflow-x-hidden services-modal-scroll">
      <div className="min-h-full flex items-center justify-center p-4">
        <div className="w-full mx-auto text-center mt-8 md:mt-12 max-w-6xl">
        <m.div
          initial={{ y: -20 }}
          animate={{
            y: [0, -30, 0], 
            transition: {
              y: {
                duration: 2,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut"
              }
            }
          }}
          className="mb-6 md:mb-8"
        >
          <Image
            src="/images/general_black_cuted.jpeg"
            alt="UPlus Studio - Mimarlık & İç Mimarlık & Mühendislik"
            width={120}
            height={120}
            className="mx-auto rounded-lg shadow-xl"
            priority
            sizes="(max-width: 768px) 80px, 120px"
          />
          <div className="mt-3">
            <p className="text-gray-400 italic text-sm md:text-base font-light">Mimarlık & İç Mimarlık & Mühendislik</p>
          </div>
        </m.div>

        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
            <span className="bg-linear-to-r from-white to-gray-400 bg-clip-text text-transparent">YAKINDA</span>
          </h1>
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.8 }}
            className="flex justify-center mb-4"
          >
          </m.div>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-6 md:mb-8 leading-relaxed px-4">
            Sitemiz şu anda yenileniyor.
            <br className="hidden sm:block" />
            En kısa sürede daha iyi hizmetle yanınızda olacağız.
          </p>
          <m.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowServices(true)}
            className="flex items-center gap-1 sm:gap-1.5 bg-white hover:bg-black hover:text-white text-black border border-black hover:border-gray-800 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md text-xs sm:text-sm mx-auto relative group"
            aria-label="Hizmetlerimizi görüntüle"
          >
            <m.svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              animate={{
                rotate: [0, 10, -10, 0],
                y: [0, -3, 0],
                scale: [1, 1.15, 1]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
            </m.svg>
            <span className="text-xs sm:text-sm font-bold">
              {"Hizmetlerimiz".split("").map((char, idx) => (
                <m.span
                  key={`hizmet-${idx}-${char}`}
                  className="inline-block"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: 0.05,
                    delay: idx * 0.08,
                    repeat: Infinity,
                    repeatDelay: 2
                  }}
                >
                  {char}
                </m.span>
              ))}
            </span>
          </m.button>
        </m.div>

        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="mb-2"
        >
          <JumpingGame />
        </m.div>

        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="space-y-6 mb-8 md:mb-12"
        >
          <div className="space-y-3">
            <h2 className="text-xl md:text-2xl font-semibold">Bize Ulaşın</h2>
            <div className="space-y-2">
              <a 
                href="mailto:info@uplusstudio.com.tr" 
                className="text-gray-300 hover:text-white transition-colors inline-block"
                aria-label="E-posta gönder: info@uplusstudio.com.tr"
              >
                info@uplusstudio.com.tr
              </a>
              <br />
              <a 
                href="tel:+905453204007" 
                className="text-gray-300 hover:text-white transition-colors inline-block"
                aria-label="Ara: +90 545 320 40 07"
              >
                +90 545 320 40 07
              </a>
            </div>
          </div>
        </m.div>
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-8"
        >
          <ProfessionalCard />
        </m.div>
        <m.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ 
            opacity: 1, 
            y: 0,
            transition: {
              duration: 0.8,
              ease: "easeOut",
              staggerChildren: 0.3
            }
          }}
          viewport={{ once: true }}
          className="pt-4 md:pt-8 mb-8 md:mb-12"
        >
          <m.h2 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ 
              opacity: 1, 
              scale: 1,
              transition: {
                duration: 0.6,
                delay: 0.2,
                type: "spring",
                stiffness: 200
              }
            }}
            viewport={{ once: true }}
            className="text-xl md:text-2xl font-bold mb-8 text-center bg-linear-to-r from-white via-gray-200 to-white bg-clip-text text-transparent"
          >
            Kurucularımız
          </m.h2>
          
          <div className="flex justify-center gap-6 md:gap-12 flex-wrap">
            <FounderCard
              founder={founders[0]}
              variant="left"
              onSelect={() => {
                setSelectedFounder(founders[0]);
                setShowFounderModal(true);
              }}
            />
            <FounderCard
              founder={founders[1]}
              variant="right"
              onSelect={() => {
                setSelectedFounder(founders[1]);
                setShowFounderModal(true);
              }}
            />
          </div>
        </m.div>

        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mb-8 md:mb-12"
        >
          <CompanyLocation />
        </m.div>
      
        <ServicesModal isOpen={showServices} onClose={() => setShowServices(false)} />

        <FounderModal 
          isOpen={showFounderModal} 
          onClose={() => setShowFounderModal(false)} 
          founder={selectedFounder}
        />

        <m.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="pt-8 md:pt-12 border-t border-gray-800"
        >
          <div className="text-center space-y-2">
            <p className="text-gray-400 text-sm">
              {new Date().getFullYear()} UPlus Studio. Tüm hakları saklıdır.
            </p>
            <p className="text-gray-500 text-xs">
              Mimarlık & İç Mimarlık & Mühendislik Hizmetleri
            </p>
          </div>
        </m.footer>
        </div>
      </div>
    </div>
  );
}