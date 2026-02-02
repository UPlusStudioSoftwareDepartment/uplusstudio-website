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
        className="bg-black border-2 border-white text-white p-4 sm:p-6 rounded-lg shadow-2xl relative w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col"
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
            <h2 className="text-2xl sm:text-3xl font-light text-white mb-2 tracking-wider">HİZMETLERİMİZ</h2>
            <div className="flex items-center justify-center gap-4">
              <div className="h-px bg-gray-600 w-16 sm:w-20"></div>
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <div className="h-px bg-gray-600 w-16 sm:w-20"></div>
            </div>
          </div>

          {/* Services List */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden mt-4 sm:mt-6 space-y-2 pr-2">
            {[
              { icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', title: 'Mimari Tasarım', desc: 'Konut, ticari ve kamusal alanlarda modern mimari çözümler' },
              { icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', title: 'İç Mekân Tasarımı', desc: 'Fonksiyonel ve estetik iç mekan çözümleri' },
              { icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01', title: 'Proje Yönetimi', desc: 'Profesyonel proje yönetimi ve koordinasyon' },
              { icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', title: 'Uygulama Projeleri', desc: 'Detaylı uygulama projeleri ve teknik çizimler' },
              { icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z', title: 'Konsept Geliştirme', desc: 'Yaratıcı konsept tasarım ve geliştirme' },
              { icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z', title: '3D Görselleştirme', desc: 'Gerçekçi 3D modelleme ve görselleştirme' },
              // { icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z', title: 'Restorasyon', desc: 'Restorasyon ve yenileme' },
              { icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', title: 'Tasarım Danışmanlığı', desc: 'Profesyonel tasarım danışmanlık hizmetleri' },
              // { icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', title: 'Müşteri İlişkileri', desc: 'Profesyonel müşteri iletişimi ve ilişki yönetimi' },
              // { icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', title: 'Zaman Yönetimi', desc: 'Etkin proje zaman planlaması ve takibi' },
              { icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', title: 'Kalite Kontrol', desc: 'Titiz kalite kontrol ve denetim süreçleri' },
              // { icon: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3', title: 'Bütçe Yönetimi', desc: 'Optimal bütçe planlaması ve maliyet kontrolü' },
              { icon: 'M13 10V3L4 14h7v7l9-11h-7z', title: 'Yenilikçi Çözümler', desc: 'Yaratıcı ve yenilikçi mimari çözümler' },
              { icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9', title: 'Sürdürülebilir Tasarım', desc: 'Çevre dostu ve sürdürülebilir mimari yaklaşımlar' }
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
                className="group hover:bg-gray-900 hover:bg-opacity-50 pl-4 py-2 transition-all duration-300 cursor-pointer rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-white flex-shrink-0 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={service.icon} />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium text-sm mb-0.5 group-hover:text-gray-200 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-gray-400 text-xs group-hover:text-gray-300 transition-colors leading-relaxed">
                      {service.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Footer */}
          <div className="text-center pt-4 border-t border-gray-800 flex-shrink-0">
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-gray-400 italic text-sm"
            >
              "Her detay bilinçli. Her mekân güçlü."
            </motion.p>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="text-gray-500 text-xs mt-2"
            >
              İhtiyaçlarınıza özel çözümler için bizimle iletişime geçin.
            </motion.p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
