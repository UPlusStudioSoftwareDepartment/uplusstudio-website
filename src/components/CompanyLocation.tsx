'use client';

import { motion } from 'framer-motion';

interface CompanyLocationProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function CompanyLocation({ size = 'lg' }: CompanyLocationProps) {
  const companyAddress = "İncek, Reyhan Cd. No:3, 06830 Gölbaşı/Ankara";
  const encodedAddress = encodeURIComponent(companyAddress);
  
  // Google Maps embed URL with place marker
  const googleMapsEmbedUrl = `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodedAddress}&zoom=16&maptype=roadmap`;
  
  // Simple Google Maps embed URL that shows pin marker
  const publicMapUrl = `https://maps.google.com/maps?q=${encodedAddress}&t=m&z=16&ie=UTF8&iwloc=&output=embed`;

  const handleViewLargerMap = () => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank', 'noopener,noreferrer');
  };

  const handleDirections = () => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`, '_blank', 'noopener,noreferrer');
  };

  // Size configurations
  const sizeConfig = {
    sm: { container: 'w-full', height: 'h-64', margin: 'mt-8 mb-4' },
    md: { container: 'w-full', height: 'h-80', margin: 'mt-10 mb-6' },
    lg: { container: 'w-full', height: 'h-96', margin: 'mt-12 mb-8' },
    xl: { container: 'w-full', height: 'h-[32rem]', margin: 'mt-16 mb-10' }
  };

  const config = sizeConfig[size];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className={`${config.container} mx-auto ${config.margin}`}
    >
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Map Container */}
        <div className={`relative ${config.height} bg-gray-100`}>
          <iframe
            src={publicMapUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full"
            title="U+ Studio Konum Haritası"
          />
          
          {/* Company Info Card - Top Left */}
      

          {/* Directions Button - Bottom Right */}
          <div className="absolute top-3 right-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDirections}
            className="bg-black hover:bg-white text-white hover:text-black px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Yol Tarifi
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
