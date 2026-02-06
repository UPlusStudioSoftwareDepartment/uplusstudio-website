'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import JumpingGame from '@/components/JumpingGame';
import ArchitectureAnimation from './ArchitectureAnimation';
import ProfessionalCard from './ProfessionalCard';
import CompanyLocation from './CompanyLocation';
import ServicesModal from './ServicesModal';
import FounderModal from './FounderModal';
import { useState, useEffect } from 'react';
import { Metadata } from 'next';

// SEO Meta Verileri
export const metadata: Metadata = {
  title: 'UPlus Studio - Yakında | Mimarlık & Tasarım & Mühendislik',
  description: 'UPlus Studio olarak web sitemiz yenileniyor. En kısa sürede daha iyi hizmetle yanınızda olacağız. Mimarlık, tasarım ve mühendislik hizmetleri.',
  keywords: ['UPlus Studio', 'Mimarlık', 'Tasarım', 'Mühendislik', 'Yakında', 'Maintenance'],
  openGraph: {
    title: 'UPlus Studio - Yakında',
    description: 'Mimarlık & Tasarım & Mühendislik hizmetleri için sitemiz yakında hizmetinizde!',
    url: 'https://uplusstudio.com.tr',
    siteName: 'UPlus Studio',
    images: [
      {
        url: '/images/general_black_cuted.jpeg',
        width: 1200,
        height: 630,
        alt: 'UPlus Studio Logo',
      },
    ],
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UPlus Studio - Yakında',
    description: 'Mimarlık & Tasarım & Mühendislik hizmetleri için sitemiz yakında hizmetinizde!',
    images: ['/images/general_black_cuted.jpeg'],
  },
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function MaintenancePage() {
  const [isSharing, setIsSharing] = useState(false);
  const [showServices, setShowServices] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [selectedFounder, setSelectedFounder] = useState<any>(null);
  const [showFounderModal, setShowFounderModal] = useState(false);

  // Kurucu verileri
  const founders = [
    {
      name: 'Hacer UYAR',
      title: 'Mimar',
      role: 'Kurucu Ortak',
      image: '/images/persons/founders/hacer_uyar/haceruyar_face_2.png',
      description: 'UPlus Studio\'nun kurucu ortağı olarak mimari projelerin tasarım ve uygulama süreçlerinde liderlik yapmaktadır. Yaratıcı çözümleri ve detaylara olan hassasiyeti ile projelere estetik ve işlevsellik katmaktadır.'
    },
    {
      name: 'Rıdvan UYAR',
      title: 'İnşaat Mühendisi',
      role: 'Kurucu Ortak',
      image: '/images/persons/founders/ridvan_uyar/ridvanuyar_face.jpeg',
      description: 'İnşaat mühendisi olarak projelerin teknik altyapısını ve yapısal güvenliğini sağlamaktadır. Modern mühendislik çözümleri ve proje yönetimi uzmanlığı ile projelerin zamanında ve kaliteli tamamlanmasını garantilemektedir.'
    }
  ];

  // Loading state management
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Error boundary için
  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error('MaintenancePage error:', error);
      setHasError(true);
    };
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Bir Hata Oluştu</h1>
          <p className="text-gray-300 mb-4">Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-white text-black px-6 py-2 rounded hover:bg-gray-100 transition-colors"
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
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 overflow-x-hidden">
      <div className="w-full mx-auto text-center mt-8 md:mt-12 max-w-6xl">
        {/* Logo with Bounce Animation */}
        <motion.div
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
            alt="UPlus Studio - Mimarlık & Tasarım & Mühendislik"
            width={120}
            height={120}
            className="mx-auto rounded-lg shadow-xl"
            priority
            sizes="(max-width: 768px) 80px, 120px"
          />
          <div className="mt-3">
            <p className="text-gray-400 italic text-sm md:text-base font-light">Mimarlık & Tasarım & Mühendislik</p>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
            <span className="text-white bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">YAKINDA</span>
          </h1>
          {/* Services Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.8 }}
            className="flex justify-center mb-4"
          >
          </motion.div>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-6 md:mb-8 leading-relaxed px-4">
            Sitemiz şu anda yenileniyor.
            <br className="hidden sm:block" />
            En kısa sürede daha iyi hizmetle yanınızda olacağız.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowServices(true)}
            className="flex items-center gap-1 sm:gap-1.5 bg-white hover:bg-gray-100 text-black border border-black hover:border-gray-800 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md text-xs sm:text-sm mx-auto relative group"
            aria-label="Hizmetlerimizi görüntüle"
          >
            <motion.svg 
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
            </motion.svg>
            <span className="text-xs sm:text-sm font-bold">
              {"Hizmetlerimiz".split("").map((char, index) => (
                <motion.span
                  key={index}
                  className="inline-block"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: 0.05,
                    delay: index * 0.08,
                    repeat: Infinity,
                    repeatDelay: 2
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </span>
          </motion.button>
        </motion.div>

        {/* Game Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="mb-2"
        >
          <JumpingGame />
        </motion.div>

        {/* Contact Section */}
        <motion.div
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
        </motion.div>
        {/* Professional Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-8"
        >
          <ProfessionalCard />
        </motion.div>
        {/* Founders Section */}
        <motion.div
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
          <motion.h2 
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
            className="text-xl md:text-2xl font-bold mb-8 text-center bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent"
          >
            Kurucularımız
          </motion.h2>
          
          <div className="flex justify-center gap-6 md:gap-12 flex-wrap">
            <motion.div
              initial={{ scale: 0.8, opacity: 0, rotateY: -15 }}
              whileInView={{ 
                scale: 1, 
                opacity: 1,
                rotateY: 0,
                transition: {
                  delay: 0.4,
                  duration: 0.8,
                  type: "spring",
                  stiffness: 100,
                  damping: 20
                }
              }}
              viewport={{ once: true }}
              whileHover={{ 
                y: -10,
                scale: 1.05,
                rotateY: 5,
                transition: { duration: 0.3, type: "spring" }
              }}
              className="group relative text-center px-8 py-6 rounded-2xl bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-md border border-white/10 shadow-2xl hover:shadow-white/10 transition-all duration-300 overflow-hidden cursor-pointer"
              onClick={() => {
                setSelectedFounder(founders[0]);
                setShowFounderModal(true);
              }}
            >
              {/* Animated Background Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
              
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-15 blur-lg transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                {/* Avatar Placeholder */}
            <motion.div 
  initial={{ scale: 0.9, opacity: 0 }}
  whileInView={{ scale: 1, opacity: 1 }}
  transition={{ delay: 0.2, duration: 0.3, type: "spring", stiffness: 100, damping: 10 }}
  viewport={{ once: true, margin: "-20% 0px" }}
  className="w-[100px] h-[100px] mx-auto mb-4 relative rounded-full overflow-hidden cursor-pointer group"
  onClick={() => {
    setSelectedFounder(founders[0]);
    setShowFounderModal(true);
  }}
  whileHover={{ scale: 1.05 }}
>
  <Image 
    src="/images/persons/founders/hacer_uyar/haceruyar_face_2.png" 
    alt="Hacer UYAR" 
    fill
    className="object-cover object-center"
    quality={100}
    priority
    loading="eager"
    fetchPriority="high"
    sizes="100px"
  />
  {/* Hover overlay */}
  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
    <motion.div
      initial={{ scale: 0 }}
      whileHover={{ scale: 1 }}
      className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"
    >
      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    </motion.div>
  </div>
</motion.div>

                
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  className="text-white font-bold text-lg md:text-xl mb-2 group-hover:text-blue-300 transition-colors"
                >
                  Hacer UYAR
                </motion.p>
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.3 }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  className="text-blue-300 text-sm md:text-base mb-1 font-medium"
                >
                  Mimar
                </motion.p>
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="text-gray-400 text-sm md:text-base"
                >
                  Kurucu Ortak
                </motion.p>
                
                {/* Decorative Elements */}
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  transition={{ delay: 1.0, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent mt-4"
                ></motion.div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ scale: 0.8, opacity: 0, rotateY: 15 }}
              whileInView={{ 
                scale: 1, 
                opacity: 1,
                rotateY: 0,
                transition: {
                  delay: 0.6,
                  duration: 0.8,
                  type: "spring",
                  stiffness: 100,
                  damping: 20
                }
              }}
              viewport={{ once: true }}
              whileHover={{ 
                y: -10,
                scale: 1.05,
                rotateY: -5,
                transition: { duration: 0.3, type: "spring" }
              }}
              className="group relative text-center px-8 py-6 rounded-2xl bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-md border border-white/10 shadow-2xl hover:shadow-white/10 transition-all duration-300 overflow-hidden cursor-pointer"
              onClick={() => {
                setSelectedFounder(founders[1]);
                setShowFounderModal(true);
              }}
            >
              {/* Animated Background Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-blue-500/10 opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
              
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl opacity-0 group-hover:opacity-15 blur-lg transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                {/* Avatar Placeholder */}
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.3, type: "spring", stiffness: 100, damping: 10 }}
                  viewport={{ once: true, margin: "-20% 0px" }}
                  className="w-[100px] h-[100px] mx-auto mb-4 relative rounded-full overflow-hidden cursor-pointer group"
                  onClick={() => {
                    setSelectedFounder(founders[1]);
                    setShowFounderModal(true);
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Image 
                    src="/images/persons/founders/ridvan_uyar/ridvanuyar_face.jpeg" 
                    alt="Rıdvan UYAR" 
                    fill
                    className="object-cover object-center"
                    quality={100}
                    priority
                    loading="eager"
                    fetchPriority="high"
                    sizes="100px"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileHover={{ scale: 1 }}
                      className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"
                    >
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </motion.div>
                  </div>
                </motion.div>
                
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  className="text-white font-bold text-lg md:text-xl mb-2 group-hover:text-green-300 transition-colors"
                >
                  Rıdvan UYAR
                </motion.p>
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.3 }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  className="text-green-300 text-sm md:text-base mb-1 font-medium"
                >
                  İnşaat Mühendisi
                </motion.p>
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  className="text-gray-400 text-sm md:text-base"
                >
                  Kurucu Ortak
                </motion.p>
                
                {/* Decorative Elements */}
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent mt-4"
                ></motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Company Location Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mb-8 md:mb-12"
        >
          <CompanyLocation />
        </motion.div>
      
        {/* Services Modal */}
        <ServicesModal isOpen={showServices} onClose={() => setShowServices(false)} />

        {/* Founder Modal */}
        <FounderModal 
          isOpen={showFounderModal} 
          onClose={() => setShowFounderModal(false)} 
          founder={selectedFounder}
        />

        {/* Copyright */}
        <motion.footer
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
              Mimarlık & Tasarım & Mühendislik Hizmetleri
            </p>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}