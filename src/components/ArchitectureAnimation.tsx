"use client";

import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useState, useEffect } from 'react';

const ArchitectureAnimation = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStructure, setCurrentStructure] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 5000); // 5 saniye sonra göster

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isVisible) {
      const structureTimer = setInterval(() => {
        setCurrentStructure((prevStructure) => {
          const next = (prevStructure + 1) % drawingStructures.length;
          console.log('Switching to structure:', next, drawingStructures[next].name);
          return next;
        });
      }, 5000); // Her 5 saniyede bir sonraki yapı

      return () => clearInterval(structureTimer);
    }
  }, [isVisible]);

  const drawingStructures = [
    {
      name: "Modern Villa",
      paths: [
        "M 100 300 L 100 150 L 150 100 L 250 100 L 300 150 L 300 300 Z",
        "M 100 150 L 150 100 L 250 100 L 300 150",
        "M 150 200 L 250 200",
        "M 180 220 L 180 280 L 220 280 L 220 220",
        "M 260 220 L 260 280 L 280 280 L 280 220"
      ],
      windows: [
        { x: 120, y: 170, w: 20, h: 15 },
        { x: 230, y: 170, w: 20, h: 15 },
        { x: 120, y: 240, w: 15, h: 20 },
        { x: 265, y: 240, w: 15, h: 20 }
      ],
      door: { x: 190, y: 270, w: 30, h: 30 }
    },
    {
      name: "Skyscraper",
      paths: [
        "M 350 320 L 350 80 L 380 50 L 420 50 L 450 80 L 450 320 Z",
        "M 350 80 L 380 50 L 420 50 L 450 80",
        "M 370 120 L 370 180 L 430 180 L 430 120",
        "M 370 200 L 370 260 L 430 260 L 430 200",
        "M 370 280 L 370 320 L 430 320 L 430 280"
      ],
      windows: [
        { x: 375, y: 130, w: 10, h: 15 },
        { x: 385, y: 130, w: 10, h: 15 },
        { x: 405, y: 130, w: 10, h: 15 },
        { x: 415, y: 130, w: 10, h: 15 },
        { x: 375, y: 210, w: 10, h: 15 },
        { x: 385, y: 210, w: 10, h: 15 },
        { x: 405, y: 210, w: 10, h: 15 },
        { x: 415, y: 210, w: 10, h: 15 },
        { x: 375, y: 290, w: 10, h: 15 },
        { x: 385, y: 290, w: 10, h: 15 },
        { x: 405, y: 290, w: 10, h: 15 },
        { x: 415, y: 290, w: 10, h: 15 }
      ],
      door: { x: 395, y: 300, w: 20, h: 20 }
    },
    {
      name: "Church",
      paths: [
        "M 550 320 L 550 200 L 570 180 L 580 180 L 590 200 L 590 320 Z",
        "M 550 200 L 570 180 L 580 180 L 590 200",
        "M 560 160 L 560 120 L 570 100 L 580 100 L 590 120 L 590 160",
        "M 540 100 L 600 100",
        "M 545 95 L 595 95"
      ],
      windows: [
        { x: 555, y: 210, w: 20, h: 25 },
        { x: 555, y: 250, w: 20, h: 25 }
      ],
      door: { x: 560, y: 290, w: 30, h: 30 }
    },
    {
      name: "Bridge",
      paths: [
        "M 50 250 L 150 200 L 250 200 L 350 250",
        "M 50 250 L 150 200 L 250 200 L 350 250",
        "M 80 240 L 100 230 L 120 230 L 140 240",
        "M 210 230 L 230 220 L 250 220 L 270 230",
        "M 260 240 L 280 230 L 300 230 L 320 240"
      ],
      windows: [],
      door: null
    },
    {
      name: "Tower",
      paths: [
        "M 650 320 L 650 100 L 670 80 L 680 80 L 690 100 L 690 320 Z",
        "M 650 100 L 670 80 L 680 80 L 690 100",
        "M 660 140 L 660 180 L 680 180 L 680 140",
        "M 660 200 L 660 240 L 680 240 L 680 200",
        "M 660 260 L 660 300 L 680 300 L 680 260"
      ],
      windows: [
        { x: 665, y: 150, w: 10, h: 12 },
        { x: 665, y: 210, w: 10, h: 12 },
        { x: 665, y: 270, w: 10, h: 12 }
      ],
      door: { x: 665, y: 310, w: 20, h: 10 }
    },
    {
      name: "Pyramid",
      paths: [
        "M 150 300 L 250 150 L 350 300 Z",
        "M 150 300 L 250 150 L 350 300",
        "M 200 250 L 250 200 L 300 250",
        "M 220 220 L 250 190 L 280 220"
      ],
      windows: [],
      door: null
    },
    {
      name: "Dome Building",
      paths: [
        "M 450 300 L 450 200 L 500 150 L 550 200 L 550 300 Z",
        "M 450 200 L 500 150 L 550 200",
        "M 470 180 Q 500 140 530 180",
        "M 480 250 L 480 280 L 520 280 L 520 250"
      ],
      windows: [
        { x: 460, y: 210, w: 15, h: 20 },
        { x: 525, y: 210, w: 15, h: 20 }
      ],
      door: { x: 485, y: 270, w: 30, h: 30 }
    },
    {
      name: "Pagoda",
      paths: [
        "M 650 320 L 650 280 L 630 260 L 670 260 L 690 280 L 690 320 Z",
        "M 630 260 L 670 260 L 690 280",
        "M 640 240 L 680 240 L 700 260",
        "M 650 220 L 690 220 L 710 240",
        "M 660 200 L 700 200 L 720 220"
      ],
      windows: [
        { x: 655, y: 290, w: 20, h: 15 },
        { x: 665, y: 250, w: 20, h: 15 },
        { x: 675, y: 210, w: 20, h: 15 }
      ],
      door: null
    },
    {
      name: "Castle Tower",
      paths: [
        "M 100 300 L 100 180 L 90 160 L 110 160 L 120 180 L 120 300 Z",
        "M 100 180 L 90 160 L 110 160 L 120 180",
        "M 85 160 L 85 140 L 95 140 L 95 160",
        "M 125 160 L 125 140 L 135 140 L 135 160"
      ],
      windows: [
        { x: 95, y: 200, w: 15, h: 20 },
        { x: 110, y: 200, w: 15, h: 20 }
      ],
      door: { x: 100, y: 270, w: 20, h: 30 }
    },
    {
      name: "Lighthouse",
      paths: [
        "M 250 300 L 250 100 L 260 80 L 270 80 L 280 100 L 280 300 Z",
        "M 250 100 L 260 80 L 270 80 L 280 100",
        "M 240 80 L 260 60 L 270 60 L 290 80",
        "M 255 60 L 265 40 L 265 60"
      ],
      windows: [
        { x: 255, y: 150, w: 20, h: 15 },
        { x: 255, y: 200, w: 20, h: 15 },
        { x: 255, y: 250, w: 20, h: 15 }
      ],
      door: { x: 260, y: 280, w: 20, h: 20 }
    },
    {
      name: "Windmill",
      paths: [
        "M 400 300 L 400 150 L 410 130 L 420 130 L 430 150 L 430 300 Z",
        "M 400 150 L 410 130 L 420 130 L 430 150",
        "M 380 120 L 415 80 L 450 120",
        "M 415 80 L 415 60 L 420 60 L 420 80"
      ],
      windows: [
        { x: 405, y: 180, w: 20, h: 15 },
        { x: 405, y: 230, w: 20, h: 15 }
      ],
      door: { x: 410, y: 270, w: 20, h: 30 }
    },
    {
      name: "Observatory",
      paths: [
        "M 550 300 L 550 200 L 560 180 L 570 180 L 580 200 L 580 300 Z",
        "M 550 200 L 560 180 L 570 180 L 580 200",
        "M 540 180 Q 565 150 590 180",
        "M 555 160 L 565 140 L 575 160"
      ],
      windows: [
        { x: 555, y: 220, w: 20, h: 15 },
        { x: 555, y: 260, w: 20, h: 15 }
      ],
      door: { x: 560, y: 280, w: 20, h: 20 }
    }
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1,
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const services = [
    {
      icon: "🏛️",
      title: "Mimari Tasarım",
      description: "Modern ve fonksiyonel mimari çözümler",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: "🏗️",
      title: "İnşaat Yönetimi",
      description: "Profesyonel proje yönetimi ve koordinasyon",
      color: "from-green-500 to-green-600"
    },
    {
      icon: "📐",
      title: "3D Görselleştirme",
      description: "Gelişmiş 3D modelleme ve render hizmetleri",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: "🏢",
      title: "İç Mekan Tasarım",
      description: "Estetik ve kullanışlı iç mekan çözümleri",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: "🌍",
      title: "Kentsel Tasarım",
      description: "Sürdürülebilir kentsel gelişim projeleri",
      color: "from-teal-500 to-teal-600"
    },
    {
      icon: "🔧",
      title: "Restorasyon",
      description: "Tarihi yapıların korunması ve restore edilmesi",
      color: "from-red-500 to-red-600"
    }
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={containerVariants}
          className="w-full max-w-6xl mx-auto p-6"
        >
          {/* Başlık */}
          <motion.div
            variants={itemVariants}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Mimarlık Hizmetlerimiz
            </h2>
            <p className="text-gray-300 text-lg">
              Hayallerinizi gerçeğe dönüştüren profesyonel mimari çözümler
            </p>
          </motion.div>

          {/* Sadece Çizim Alanı - Farklı Yapılar */}
          <motion.div
            variants={itemVariants}
            className="mb-12"
          >
            {/* Sadece Çizim Alanı - Transparent Arka Plan */}
            <div className="relative bg-transparent rounded-lg h-96 overflow-hidden">
              <svg
                className="w-full h-full"
                viewBox="0 0 800 400"
                preserveAspectRatio="xMidYMid meet"
              >
                {/* Mevcut Yapı Çizimi */}
                <motion.g
                  key={currentStructure}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Ana Yapı Çizgileri */}
                  {drawingStructures[currentStructure].paths.map((path, pathIndex) => (
                    <motion.path
                      key={pathIndex}
                      d={path}
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ 
                        duration: 1.5, 
                        delay: pathIndex * 0.3,
                        ease: "easeInOut" 
                      }}
                    />
                  ))}
                  
                  {/* Pencereler */}
                  {drawingStructures[currentStructure].windows.map((window, windowIndex) => (
                    <motion.rect
                      key={windowIndex}
                      x={window.x}
                      y={window.y}
                      width={window.w}
                      height={window.h}
                      fill="none"
                      stroke="white"
                      strokeWidth="1"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ 
                        duration: 0.4, 
                        delay: 2 + windowIndex * 0.1,
                        ease: "easeOut" 
                      }}
                    />
                  ))}
                  
                  {/* Kapı */}
                  {drawingStructures[currentStructure].door && (
                    <motion.rect
                      x={drawingStructures[currentStructure].door.x}
                      y={drawingStructures[currentStructure].door.y}
                      width={drawingStructures[currentStructure].door.w}
                      height={drawingStructures[currentStructure].door.h}
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ 
                        duration: 0.5, 
                        delay: 2.5,
                        ease: "easeOut" 
                      }}
                    />
                  )}
                </motion.g>
                
                {/* Kalem İmleci - Beyaz Kalem */}
                <motion.div
                  className="absolute w-4 h-4 bg-white rounded-full pointer-events-none"
                  style={{
                    boxShadow: '0 0 20px rgba(255,255,255,0.8)'
                  }}
                  initial={{ x: 0, y: 0, opacity: 0 }}
                  animate={{
                    x: [
                      // Modern Villa çizimi
                      [100, 150, 200, 250, 300, 250, 200, 150, 100],
                      // Skyscraper çizimi
                      [350, 400, 450, 400, 350, 400, 450, 400, 350],
                      // Church çizimi
                      [550, 580, 570, 560, 550, 580, 570, 560, 550],
                      // Bridge çizimi
                      [50, 150, 200, 250, 300, 250, 200, 150, 50],
                      // Tower çizimi
                      [650, 700, 680, 670, 660, 680, 670, 660, 650],
                      // Pyramid çizimi
                      [150, 200, 250, 300, 350, 300, 250, 200, 150],
                      // Dome Building çizimi
                      [450, 500, 550, 500, 450, 500, 550, 500, 450],
                      // Pagoda çizimi
                      [650, 700, 680, 670, 660, 680, 670, 660, 650],
                      // Castle Tower çizimi
                      [100, 150, 120, 110, 100, 120, 110, 100, 90],
                      // Lighthouse çizimi
                      [250, 300, 280, 270, 260, 280, 270, 260, 250],
                      // Windmill çizimi
                      [400, 450, 430, 420, 410, 430, 420, 410, 400],
                      // Observatory çizimi
                      [550, 600, 580, 570, 560, 580, 570, 560, 550]
                    ][currentStructure],
                    y: [
                      // Modern Villa çizimi
                      [100, 150, 200, 250, 300, 250, 200, 150, 100],
                      // Skyscraper çizimi
                      [80, 120, 160, 200, 250, 200, 160, 120, 80],
                      // Church çizimi
                      [200, 150, 100, 180, 160, 100, 180, 160, 200],
                      // Bridge çizimi
                      [250, 200, 150, 200, 250, 200, 150, 200, 250],
                      // Tower çizimi
                      [150, 100, 120, 140, 160, 120, 140, 160, 150],
                      // Pyramid çizimi
                      [300, 200, 150, 200, 300, 200, 150, 200, 300],
                      // Dome Building çizimi
                      [300, 200, 150, 200, 300, 200, 150, 200, 300],
                      // Pagoda çizimi
                      [320, 280, 260, 240, 220, 240, 260, 280, 320],
                      // Castle Tower çizimi
                      [300, 200, 180, 160, 140, 160, 180, 200, 300],
                      // Lighthouse çizimi
                      [300, 200, 100, 80, 60, 80, 100, 200, 300],
                      // Windmill çizimi
                      [300, 200, 120, 80, 60, 80, 120, 200, 300],
                      // Observatory çizimi
                      [300, 200, 180, 150, 120, 150, 180, 200, 300]
                    ][currentStructure],
                    opacity: [1, 1, 1, 1, 1, 1, 1, 1, 0]
                  }}
                  transition={{
                    duration: 3,
                    delay: 0.5,
                    ease: "easeInOut"
                  }}
                />
                
                {/* Kalem İzleri - Beyaz Kalem Etkisi */}
                {[100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300, 320, 340, 360, 380, 400].map((x, i) => (
                  <motion.circle
                    key={`trail-${i}`}
                    cx={x}
                    cy={120 + Math.sin(i * 0.6) * 60}
                    r="2"
                    fill="white"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0.6, 0] }}
                    transition={{
                      duration: 0.6,
                      delay: 0.5 + i * 0.1,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </svg>
            </div>
          </motion.div>

          {/* Hizmet Kartları */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {services.map((service, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
                }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${service.color} rounded-lg flex items-center justify-center text-2xl mb-4`}>
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-300 text-sm">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Alt Bilgi */}
          <motion.div
            variants={itemVariants}
            className="text-center mt-12"
          >
            <p className="text-gray-400 text-sm">
              UPlusStudio - Mimarlık ve Tasarım Ofisi
            </p>
            <p className="text-gray-500 text-xs mt-2">
              © 2024 Tüm hakları saklıdır
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ArchitectureAnimation;
