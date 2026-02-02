'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface ServicesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ServicesModal({ isOpen, onClose }: ServicesModalProps) {
  // Prevent body scroll when popup is open
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      
      // Apply aggressive scroll prevention
      const html = document.documentElement;
      const body = document.body;
      
      // Save original styles
      html.style.setProperty('--scroll-y', `-${scrollY}px`, 'important');
      body.style.setProperty('position', 'fixed', 'important');
      body.style.setProperty('top', `-${scrollY}px`, 'important');
      body.style.setProperty('left', '0', 'important');
      body.style.setProperty('right', '0', 'important');
      body.style.setProperty('width', '100%', 'important');
      body.style.setProperty('overflow', 'hidden', 'important');
      body.style.setProperty('overscroll-behavior', 'none', 'important');
      body.style.setProperty('touch-action', 'none', 'important');
      
      html.style.setProperty('overflow', 'hidden', 'important');
      html.style.setProperty('overscroll-behavior', 'none', 'important');
      
      // Add CSS to prevent scroll
      const style = document.createElement('style');
      style.id = 'no-scroll-style';
      style.textContent = `
        body, html {
          overflow: hidden !important;
          position: fixed !important;
          width: 100% !important;
          height: 100% !important;
          overscroll-behavior: none !important;
          touch-action: none !important;
          -webkit-overflow-scrolling: touch !important;
        }
        * {
          -webkit-overflow-scrolling: touch !important;
        }
      `;
      document.head.appendChild(style);
      
    } else {
      // Remove aggressive scroll prevention
      const scrollY = document.body.style.top;
      
      // Remove inline styles
      const html = document.documentElement;
      const body = document.body;
      
      body.style.removeProperty('position');
      body.style.removeProperty('top');
      body.style.removeProperty('left');
      body.style.removeProperty('right');
      body.style.removeProperty('width');
      body.style.removeProperty('overflow');
      body.style.removeProperty('overscroll-behavior');
      body.style.removeProperty('touch-action');
      
      html.style.removeProperty('overflow');
      html.style.removeProperty('overscroll-behavior');
      
      // Remove CSS style tag
      const style = document.getElementById('no-scroll-style');
      if (style) {
        style.remove();
      }
      
      // Restore scroll position
      if (scrollY) {
        const targetY = parseInt(scrollY.replace('-', '')) || 0;
        window.scrollTo(0, targetY);
      }
    }
    
    return () => {
      // Cleanup on unmount
      const style = document.getElementById('no-scroll-style');
      if (style) {
        style.remove();
      }
      
      const html = document.documentElement;
      const body = document.body;
      
      body.style.removeProperty('position');
      body.style.removeProperty('top');
      body.style.removeProperty('left');
      body.style.removeProperty('right');
      body.style.removeProperty('width');
      body.style.removeProperty('overflow');
      body.style.removeProperty('overscroll-behavior');
      body.style.removeProperty('touch-action');
      
      html.style.removeProperty('overflow');
      html.style.removeProperty('overscroll-behavior');
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-black border-2 border-white text-white p-3 sm:p-6 rounded-lg shadow-2xl relative w-[95vw] sm:w-full sm:max-w-lg max-h-[90vh] sm:max-h-[85vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white hover:text-gray-300 z-10"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>

        {/* Services Content */}
        <div className="flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="text-center flex-shrink-0">
            <h2 className="text-xl sm:text-3xl font-light text-white mb-2 tracking-wider">HİZMETLERİMİZ</h2>
            <div className="flex items-center justify-center gap-2 sm:gap-4">
              <div className="h-px bg-gray-600 w-12 sm:w-20"></div>
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <div className="h-px bg-gray-600 w-12 sm:w-20"></div>
            </div>
          </div>

          {/* Services List */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden mt-2 sm:mt-6 space-y-1 sm:space-y-2 pr-1 sm:pr-2">
            {[
              { icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', title: 'Mimari Tasarım', desc: 'Konut, ticari ve kamusal projeler için çağdaş çözümler.' },
              { icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', title: 'İç Mekân Tasarımı', desc: 'İşlevsel, estetik ve kullanıcı odaklı mekânlar.' },
              { icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4', title: 'Yeniden İşlevlendirme', desc: 'Mevcut yapıların ofis, konut ve ticari alanlara dönüştürülmesi.' },
              { icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z', title: 'Anahtar Teslim Projeler', desc: 'Tasarım, mühendislik ve uygulama süreçlerinin tek elden yönetimi.' },
              { icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', title: 'Uygulama Projeleri', desc: 'Detaylı ve uygulanabilir teknik çizimler.' },
              { icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01', title: 'Proje Yönetimi & Teknik Koordinasyon', desc: 'Mimari ve statik disiplinlerin birlikte yürütülmesi.' },
              { icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z', title: '3D Görselleştirme', desc: 'Gerçekçi ve etkileyici sunum görselleri.' }
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  delay: index * 0.05, 
                  duration: 0.3,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  scale: 1.01,
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  transition: { duration: 0.2 }
                }}
                className="group hover:bg-gray-900 hover:bg-opacity-50 pl-2 sm:pl-4 py-1 sm:py-2 transition-all duration-300 cursor-pointer rounded-lg"
              >
                <div className="flex flex-col gap-1 sm:gap-2 items-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={service.icon} />
                  </svg>
                  <div className="flex-1 min-w-0 text-center">
                    <h3 className="text-white font-medium text-xs sm:text-sm mb-0.5 group-hover:text-gray-200 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-gray-400 text-xs sm:text-xs group-hover:text-gray-300 transition-colors leading-relaxed">
                      {service.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Footer */}
          <div className="text-center pt-2 sm:pt-4 border-t border-gray-800 flex-shrink-0">
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-gray-400 italic text-xs sm:text-sm"
            >
              "Her detay bilinçli. Her mekân güçlü."
            </motion.p>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="text-gray-500 text-xs mt-1 sm:mt-2"
            >
              İhtiyaçlarınıza özel çözümler için bizimle iletişime geçin.
            </motion.p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
