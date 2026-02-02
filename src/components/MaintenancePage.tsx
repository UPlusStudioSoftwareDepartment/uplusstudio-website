'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import JumpingGame from '@/components/JumpingGame';
import ArchitectureAnimation from './ArchitectureAnimation';
import ProfessionalCard from './ProfessionalCard';
import CompanyLocation from './CompanyLocation';
import ServicesModal from './ServicesModal';
import { useState } from 'react';

export default function MaintenancePage() {
  const [isSharing, setIsSharing] = useState(false);
  const [showServices, setShowServices] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full mx-auto text-center mt-12">
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
        >
          <Image
            src="/images/general_black_cuted.jpeg"
            alt="UPlus Studio"
            width={100}
            height={100}
            className="mx-auto"
            priority
          />
           <div>
                <p className="text-gray-400 italic text-sm mt-1">Mimarlık & Tasarım  & Mühendislik</p>
              </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
             
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            <span className="text-white">YAKINDA</span>
          </h1>
          {/* Services Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.8 }}
            className="flex justify-center mb-4"
          >
         
          </motion.div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-4">
            Sitemiz şu anda yenileniyor.
            <br />
            En kısa sürede daha iyi hizmetle yanınızda olacağız.
          </p>
             <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowServices(true)}
              className="flex items-center gap-1 sm:gap-1.5 bg-white hover:bg-gray-100 text-black border border-black hover:border-gray-800 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-sm transition-all duration-300 shadow-sm hover:shadow-md text-xs sm:text-sm mx-auto relative group"
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
          className="space-y-6"
        >
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Bize Ulaşın</h3>
            <p className="text-gray-300">info@uplusstudio.com.tr</p>
            <p className="text-gray-300">0545 320 40 07</p>
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
              staggerChildren: 0.2
            }
          }}
          viewport={{ once: true }}
          className=" pt-2"
        >
          <div className="flex justify-center gap-4 flex-wrap">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ 
                scale: 1, 
                opacity: 1,
                transition: {
                  delay: 0.2,
                  duration: 0.6,
                  type: "spring",
                  stiffness: 100
                }
              }}
              viewport={{ once: true }}
              whileHover={{ 
                y: -5,
                transition: { duration: 0.2 }
              }}
              className="text-center px-6 py-4 rounded-lg backdrop-blur-sm"
            >
              <p className="text-white font-medium text-lg">Hacer UYAR</p>
              <p className="text-gray-400 text-sm">Mimar</p>
              <p className="text-gray-400 text-sm">Kurucu Ortak</p>
            </motion.div>
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ 
                scale: 1, 
                opacity: 1,
                transition: {
                  delay: 0.4,
                  duration: 0.6,
                  type: "spring",
                  stiffness: 100
                }
              }}
              viewport={{ once: true }}
              whileHover={{ 
                y: -5,
                transition: { duration: 0.2 }
              }}
              className="text-center px-6 py-4 rounded-lg backdrop-blur-sm"
            >
              <p className="text-white font-medium text-lg">Rıdvan UYAR</p>
              <p className="text-gray-400 text-sm">İnşaat Mühendisi</p>
              <p className="text-gray-400 text-sm">Kurucu Ortak</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Company Location Map */}
        <CompanyLocation />
      
        {/* Services Modal */}
        <ServicesModal isOpen={showServices} onClose={() => setShowServices(false)} />

        {/* Copyright */}
       
      </div>
    </div>
  );
}