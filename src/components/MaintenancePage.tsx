'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import JumpingGame from '@/components/JumpingGame';
import ArchitectureAnimation from './ArchitectureAnimation';
import ProfessionalCard from './ProfessionalCard';
import { useState } from 'react';

export default function MaintenancePage() {
  const [isSharing, setIsSharing] = useState(false);

  

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-4xl w-full mx-auto text-center">
        {/* Logo with Bounce Animation */}
        <motion.div
          initial={{ y: -20 }}
          animate={{
            y: [0, -40, 0], 
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
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-4">
            Sitemiz şu anda yenileniyor.
            <br />
            En kısa sürede daha iyi hizmetle yanınızda olacağız.
          </p>
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
          <div className="flex justify-center gap-12 flex-wrap">
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

      
        {/* Copyright */}
       
      </div>
    </div>
  );
}