'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { toPng } from 'html-to-image';
import ServicesModal from './ServicesModal';

interface ProfessionalCardProps {
  className?: string;
}

export default function ProfessionalCard({ className = "" }: ProfessionalCardProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const [canCall, setCanCall] = useState(false);
  const [instagramHref, setInstagramHref] = useState('https://www.instagram.com/u.plusstudio/');
  const [isMounted, setIsMounted] = useState(false);
  const [showServices, setShowServices] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

     useEffect(() => {
    setIsMounted(true);
    
    if (typeof window === 'undefined') return;

    const ua = navigator.userAgent;

    const isMobilePhone = /Android|iPhone|iPod/i.test(ua);
    setCanCall(isMobilePhone);

    // Instagram href'ini cihaza göre ayarla
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    setInstagramHref(isMobile ? "instagram://user?username=u.plusstudio" : "https://www.instagram.com/u.plusstudio/");

    
    const hasNativeShare =
      typeof navigator.share === 'function' &&
      typeof navigator.canShare === 'function';

    setCanShare(hasNativeShare);

    // Listen for openServices event from MaintenancePage
    const handleOpenServices = () => setShowServices(true);
    window.addEventListener('openServices', handleOpenServices);

    return () => {
      window.removeEventListener('openServices', handleOpenServices);
    };
  }, []);


  const handleShare = async () => {
    setIsSharing(true);
    
    try {
      // Modal açıksa direkt paylaş, değilse aç ve paylaş
      if (!showCard) {
        setShowCard(true);
        
        // Modal render olana kadar bekle
        setTimeout(async () => {
          await shareContent();
        }, 500);
      } else {
        await shareContent();
      }
    } catch (error) {
      console.error('Error sharing:', error);
      setIsSharing(false);
    }
  };

  const shareContent = async () => {
    try {
      // Modal açıksa direkt paylaş, değilse aç ve paylaş
      if (!showCard) {
        setShowCard(true);
        
        // Modal render olana kadar bekle
        await new Promise(requestAnimationFrame);
        await new Promise(requestAnimationFrame);
        
        // Paylaşım için butonları gizle
        const hiddenElements = document.querySelectorAll('[data-share-hidden="true"]');
        hiddenElements.forEach(el => {
          (el as HTMLElement).style.display = 'none';
        });
        
        // Modal içeriğini resim olarak paylaş
        const node = modalRef.current;
        if (!node) {
          throw new Error('Modal not found');
        }
        
        const dataUrl = await toPng(node, { pixelRatio: 2, backgroundColor: '#000000' });
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], 'uplus-studio.png', { type: 'image/png' });
        
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: 'UPlus Studio',
            text: 'UPlus Studio - Mimarlık & Tasarım Hizmetleri'
          });
        } else {
          // Fallback: linki kopyala
          await navigator.clipboard.writeText(window.location.href);
          alert('Bağlantı panoya kopyalandı!');
        }
        
        // Butonları geri göster
        hiddenElements.forEach(el => {
          (el as HTMLElement).style.display = '';
        });
        
      } else {
        // Modal zaten açık, direkt paylaş
        // Paylaşım için butonları gizle
        const hiddenElements = document.querySelectorAll('[data-share-hidden="true"]');
        hiddenElements.forEach(el => {
          (el as HTMLElement).style.display = 'none';
        });
        
        const node = modalRef.current;
        if (!node) {
          throw new Error('Modal not found');
        }
        
        const dataUrl = await toPng(node, { pixelRatio: 2, backgroundColor: '#000000' });
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], 'uplus-studio.png', { type: 'image/png' });
        
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: 'UPlus Studio',
            text: 'UPlus Studio - Mimarlık & Tasarım Hizmetleri'
          });
        } else {
          await navigator.clipboard.writeText(window.location.href);
          alert('Bağlantı panoya kopyalandı!');
        }
        
        // Butonları geri göster
        hiddenElements.forEach(el => {
          (el as HTMLElement).style.display = '';
        });
      }
      
    } catch (error) {
      console.error('Share error:', error);
      // Hata durumunda butonları geri göster
      const hiddenElements = document.querySelectorAll('[data-share-hidden="true"]');
      hiddenElements.forEach(el => {
        (el as HTMLElement).style.display = '';
      });
    } finally {
      setIsSharing(false);
    }
  };

  const handlePhoneCall = () => {
    window.location.href = 'tel:05453204007';
  };

const handleEmail = () => {
  const ua = navigator.userAgent;
  const isIOS = /iPhone|iPad|iPod/i.test(ua);
  const isAndroid = /Android/i.test(ua);
  const isWindows = /Win/i.test(ua);

  const gmailUrl =
    'https://mail.google.com/mail/?view=cm&fs=1&to=info@uplusstudio.com.tr';

  const mailtoUrl = 'mailto:info@uplusstudio.com.tr';

  if (isWindows) {
    window.open(gmailUrl, '_blank', 'noopener,noreferrer');
    return;
  }else{
  window.open(mailtoUrl, '_blank', 'noopener,noreferrer');
  }

};

const handleLocation = () => {
  const address = 'İncek, Reyhan Cd. No:3, 06830 Gölbaşı/Ankara';
  const encodedAddress = encodeURIComponent(address);
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
  window.open(googleMapsUrl, '_blank', 'noopener,noreferrer');
};


  const handleDownload = async () => {
    setIsDownloading(true);
    
    try {
      // Modal açıksa direkt indir, değilse aç ve indir
      if (!showCard) {
        setShowCard(true);
        
        // Modal render olana kadar bekle
        await new Promise(requestAnimationFrame);
        await new Promise(requestAnimationFrame);
        
        // İndirme için butonları gizle
        const hiddenElements = document.querySelectorAll('[data-share-hidden="true"]');
        hiddenElements.forEach(el => {
          (el as HTMLElement).style.display = 'none';
        });
        
        // Modal içeriğini resim olarak indir
        const node = modalRef.current;
        if (!node) {
          throw new Error('Modal not found');
        }
        
        const dataUrl = await toPng(node, { pixelRatio: 2, backgroundColor: '#000000' });
        
        // Resmi indir
        const link = document.createElement('a');
        link.download = 'uplus-studio-professional.png';
        link.href = dataUrl;
        link.click();
        
        // Butonları geri göster
        hiddenElements.forEach(el => {
          (el as HTMLElement).style.display = '';
        });
        
      } else {
        // Modal zaten açık, direkt indir
        // İndirme için butonları gizle
        const hiddenElements = document.querySelectorAll('[data-share-hidden="true"]');
        hiddenElements.forEach(el => {
          (el as HTMLElement).style.display = 'none';
        });
        
        const node = modalRef.current;
        if (!node) {
          throw new Error('Modal not found');
        }
        
        const dataUrl = await toPng(node, { pixelRatio: 2, backgroundColor: '#000000' });
        
        // Resmi indir
        const link = document.createElement('a');
        link.download = 'uplus-studio-professional.png';
        link.href = dataUrl;
        link.click();
        
        // Butonları geri göster
        hiddenElements.forEach(el => {
          (el as HTMLElement).style.display = '';
        });
      }
      
    } catch (error) {
      console.error('Download error:', error);
      alert('İndirme başarısız oldu! Lütfen tekrar deneyin.');
      // Hata durumunda butonları geri göster
      const hiddenElements = document.querySelectorAll('[data-share-hidden="true"]');
      hiddenElements.forEach(el => {
        (el as HTMLElement).style.display = '';
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      {/* Instagram Icon with Share */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-center gap-3 mb-2"
      >
        {/* Instagram Icon */}
        {isMounted ? (
          <button
            onClick={() => {
              // Desktop: direct to web, Mobile: try app then fallback to web
              if (typeof window !== 'undefined' && /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                // Mobile: try Instagram app first
                window.location.href = "instagram://user?username=u.plusstudio";
                setTimeout(() => {
                  window.open('https://www.instagram.com/u.plusstudio/', '_blank', 'noopener,noreferrer');
                }, 100);
              } else {
                // Desktop: direct to web
                window.open('https://www.instagram.com/u.plusstudio/', '_blank', 'noopener,noreferrer');
              }
            }}
            className="text-gray-300 hover:text-white transition-colors bg-transparent border-none cursor-pointer"
          >
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683-.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"/>
            </svg>
          </button>
        ) : (
          <a
            href="https://www.instagram.com/u.plusstudio/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-white transition-colors"
          >
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683-.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"/>
            </svg>
          </a>
        )}

        {/* Services Icon */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowServices(true)}
          className="text-gray-300 hover:text-white transition-colors p-1"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
          </svg>
        </motion.button>

        {/* Location Icon */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleLocation}
          className="text-gray-300 hover:text-white transition-colors p-1"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
        </motion.button>

        {/* Share Icon - Only show on devices that can share */}
        {canShare && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowCard(true)}
            className="text-gray-300 hover:text-white transition-colors p-1"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
            </svg>
          </motion.button>
        )}

        {/* Email Icon - Always visible */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleEmail}
          className="text-gray-300 hover:text-white transition-colors p-1"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
        </motion.button>

        {/* Phone Icon - Only on devices that can make calls */}
        {canCall && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePhoneCall}
            className="text-gray-300 hover:text-white transition-colors p-1 md:hidden"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
            </svg>
          </motion.button>
        )}
      </motion.div>

      {/* Professional Card Modal */}
      {showCard && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black  flex items-center justify-center p-4 z-50"
          onClick={() => setShowCard(false)}
        >
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-black border-2 border-white text-white p-6 rounded-lg shadow-2xl relative max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
            data-modal-content="true"
          >
            {/* Close Button */}
            <button
              onClick={() => setShowCard(false)}
              className="absolute top-1 right-2 text-white hover:text-gray-300"
              style={{ top: '8px' }}
              data-share-hidden="true"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>

            {/* Share Icon - Top Left - Only show on devices that can share */}
            {canShare && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleShare}
                disabled={isSharing}
                className="absolute z-50 top-1 left-1 p-2 text-white hover:text-gray-300 transition-colors disabled:opacity-50"
                style={{ top: '4px' }}
                data-share-hidden="true"
              >
                {isSharing ? (
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                ) : (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
                  </svg>
                )}
              </motion.button>
            )}

            {/* Card Content */}
            <div className="text-center space-y-4">
              {/* Logo Image */}
              <div className=" mx-auto relative">
                <Image
                  src="/images/general_black_cuted.jpeg"
                  width={300}
                  height={120}
                  alt="UPlus Studio"
                  className='mx-auto'
                />
              </div>

              <div>
                <p className="text-gray-400 italic text-sm mt-1">Mimarlık & Tasarım  & Mühendislik</p>
              </div>

              {/* Decorative Elements */}
              <div className="flex justify-center items-center gap-6">
                <div className="w-16 h-px bg-white"></div>
                <div className="w-3 h-3 bg-white rounded-full"></div>
                <div className="w-16 h-px bg-white"></div>
              </div>

              {/* Services */}
              {/* <div className="space-y-3">
                <p className="font-semibold text-sm tracking-wider uppercase">Hizmetlerimiz</p>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
                  <p>• Modern Mimari</p>
                  <p>• Konut Projeleri</p>
                  <p>• Ticari Yapılar</p>
                  <p>• Proje Yönetimi</p>
                  <p>• Dekorasyon</p>
                  <p>• Danışmanlık</p>
                  <p>• Restorasyon</p>
                  <p>• 3D Görselleştirme</p>
                </div>
              </div> */}

              {/* Contact */}
              <div className="space-y-3">
                <p className="font-semibold text-sm tracking-wider uppercase">İletişim</p>
                <div className="space-y-2 text-xs text-gray-300">
                  <div className="flex items-center justify-center gap-2">
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                    <span className="font-medium">info@uplusstudio.com.tr</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                    <span className="font-medium">+90 545 320 40 07</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
                    </svg>
                    <span>www.uplusstudio.com.tr</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"/>
                    </svg>
                    <span className="font-medium">@u.plussstudio</span>
                  </div>
                  <div className="flex items-start justify-center gap-2">
                    <svg className="h-3 w-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    <span className="font-medium">İncek Mahallesi Reyhan caddesi Merkez İncek Plaza No:3 Kat:1 Daire No:2 Gölbaşı/ Ankara</span>
                  </div>
                </div>
              </div>

              {/* Founders */}
              <div className="space-y-3">
                <p className="font-semibold text-sm tracking-wider uppercase">Kurucular</p>
                <div className="flex justify-center gap-8">
                  <div className="text-center">
                    <p className="text-white font-medium text-sm">Hacer UYAR</p>
                    <p className="text-gray-400 text-xs">Mimar</p>
                    <p className="text-gray-400 text-xs">Kurucu Ortak</p>
                  </div>
                  <div className="text-center">
                    <p className="text-white font-medium text-sm">Rıdvan UYAR</p>
                    <p className="text-gray-400 text-xs">İnşaat Mühendisi</p>
                    <p className="text-gray-400 text-xs">Kurucu Ortak</p>
                  </div>
                </div>
              </div>

              {/* Bottom Decoration */}
              <div className="pt-3 flex justify-center">
                <div className="w-16 h-1 bg-gradient-to-r from-transparent via-white to-transparent"></div>
              </div>

              {/* Download Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDownload}
                disabled={isDownloading}
                className="flex items-center justify-center gap-2 mx-auto p-2 text-white hover:text-gray-300 transition-colors disabled:opacity-50"
                data-share-hidden="true"
              >
                {isDownloading ? (
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                    </svg>
                    <span className="text-xs">İndir</span>
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Services Modal */}
      <ServicesModal isOpen={showServices} onClose={() => setShowServices(false)} />
    </>
  );
}
