'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect } from 'react';

interface Founder {
  name: string;
  title: string;
  role: string;
  image: string;
  description?: string;
}

interface FounderModalProps {
  founder: Founder | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function FounderModal({ founder, isOpen, onClose }: FounderModalProps) {
  // Scroll'u engelle
  useEffect(() => {
    if (isOpen) {
      // Body scroll'u engelle
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${window.scrollY}px`;
    } else {
      // Scroll'u geri getir
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }

    // Cleanup
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    };
  }, [isOpen]);

  if (!isOpen || !founder) return null;

  // Handle all close actions
  const handleClose = (e: React.MouseEvent | React.TouchEvent) => {
    // Only call preventDefault if the event is cancelable
    if (e.cancelable) {
      e.preventDefault();
    }
    e.stopPropagation();
    onClose();
  };
  
  // Handle backdrop click (click outside modal)
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  // Handle touch start for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    // Mark the event as non-passive
    e.stopPropagation();
    handleClose(e);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-0 bg-black/85 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ 
          type: "spring",
          stiffness: 300,
          damping: 30,
          duration: 0.4
        }}
        className="relative w-full h-full sm:h-auto sm:max-w-2xl bg-gradient-to-br from-gray-900 to-black border border-white/10 shadow-2xl overflow-hidden sm:rounded-2xl sm:mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          onClick={handleClose}
          onTouchStart={handleTouchStart}
          className="absolute top-4 right-4 z-10 w-8 h-8 sm:w-7 sm:h-7 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 border border-white/20 flex items-center justify-center transition-colors touch-manipulation"
          aria-label="Kapat"
          style={{
            WebkitTapHighlightColor: 'transparent',
            WebkitTouchCallout: 'none',
            WebkitUserSelect: 'none',
            userSelect: 'none',
            touchAction: 'manipulation',
            WebkitUserDrag: 'none',
            zIndex: 1000
          } as React.CSSProperties}
        >
          <motion.svg
            whileHover={{ rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </motion.svg>
        </motion.button>

        {/* Content */}
        <div className="relative h-full sm:h-auto sm:p-6 sm:pb-8 md:p-12 flex flex-col justify-center sm:block">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
          
          <div className="relative z-10 px-6 py-8 sm:px-0 sm:py-0">
            {/* Profile Section */}
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-center">
              {/* Avatar */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                  delay: 0.2
                }}
                className="relative w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl flex-shrink-0 mx-auto sm:mx-0"
              >
                <Image
                  src={founder.image}
                  alt={founder.name}
                  fill
                  className="object-cover object-center"
                  quality={100}
                  priority
                  sizes="(max-width: 640px) 144px, (max-width: 768px) 192px, 224px"
                  style={{ objectFit: 'cover', objectPosition: 'center' }}
                />
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20"></div>
              </motion.div>

              {/* Info */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="flex-1 text-center sm:text-left"
              >
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-2 ${founder.name === 'Rıdvan UYAR' ? 'text-white' : 'bg-gradient-to-r from-white to-gray-300'} ${founder.name === 'Rıdvan UYAR' ? '' : 'bg-clip-text text-transparent'}`}
                >
                  {founder.name}
                </motion.h2>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className={`text-lg sm:text-xl md:text-2xl mb-2 font-medium ${founder.name === 'Rıdvan UYAR' ? 'text-green-300' : 'text-blue-300'}`}
                >
                  {founder.title}
                </motion.p>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  className="text-gray-400 text-base sm:text-lg"
                >
                  {founder.role}
                </motion.p>

                {/* Decorative Line */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className={`h-0.5 mt-4 mb-6 ${founder.name === 'Rıdvan UYAR' ? 'bg-gradient-to-r from-transparent via-green-400 to-transparent' : 'bg-gradient-to-r from-transparent via-blue-400 to-transparent'}`}
                />

                {/* Description */}
                {founder.description && (
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.5 }}
                    className="text-gray-300 leading-relaxed text-sm sm:text-base"
                  >
                    {founder.description}
                  </motion.p>
                )}
              </motion.div>
            </div>

            {/* Additional Info */}
            {/* <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.6 }}
              className="mt-8 pt-8 border-t border-white/10"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-4 sm:p-6 rounded-lg bg-white/5 border border-white/10"
                >
                  <div className="text-2xl sm:text-3xl mb-3">🏗️</div>
                  <div className="text-sm sm:text-base text-gray-400 mb-2">Uzmanlık Alanı</div>
                  <div className="text-white font-semibold text-base sm:text-lg mb-2">{founder.title}</div>
                  <div className="text-gray-300 text-sm leading-relaxed">
                    {founder.title === 'Mimar' 
                      ? 'Yaratıcı mimari tasarımlar ve estetik çözümler sunar' 
                      : 'Modern mühendislik çözümleri ve yapısal güvenlik sağlar'}
                  </div>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-4 sm:p-6 rounded-lg bg-white/5 border border-white/10"
                >
                  <div className="text-2xl sm:text-3xl mb-3">👥</div>
                  <div className="text-sm sm:text-base text-gray-400 mb-2">Kurucu Rolü</div>
                  <div className="text-white font-semibold text-base sm:text-lg mb-2">{founder.role}</div>
                  <div className="text-gray-300 text-sm leading-relaxed">
                    {founder.title === 'Mimar' 
                      ? 'Mimari vizyon geliştirme ve yaratıcı tasarım süreçlerinde liderlik' 
                      : 'Teknik strateji ve mühendislik yönetiminde liderlik'}
                  </div>
                </motion.div>
              </div>
            </motion.div> */}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
