

import { AnimatePresence, m } from "framer-motion";
import { useEffect, useRef } from "react";

const EASE_STUDIO = [0.76, 0, 0.24, 1] as const;

const SERVICES = [
  { title: 'Mimari Tasarım', desc: 'Konut, ticari ve kamusal projeler için çağdaş çözümler.' },
  { title: 'İç Mekân Tasarımı', desc: 'İşlevsel, estetik ve kullanıcı odaklı mekânlar.' },
  { title: 'Yeniden İşlevlendirme', desc: 'Mevcut yapıların ofis, konut ve ticari alanlara dönüştürülmesi.' },
  { title: 'Anahtar Teslim Projeler', desc: 'Tasarım, mühendislik ve uygulama süreçlerinin tek elden yönetimi.' },
  { title: 'Uygulama Projeleri', desc: 'Detaylı ve uygulanabilir teknik çizimler.' },
  { title: 'Proje Yönetimi & Teknik Koordinasyon', desc: 'Mimari ve statik disiplinlerin birlikte yürütülmesi.' },
  { title: '3D Görselleştirme', desc: 'Gerçekçi ve etkileyici sunum görselleri.' },
];

interface ServicesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ServicesModal({ isOpen, onClose }: Readonly<ServicesModalProps>) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const id = globalThis.setTimeout(() => closeRef.current?.focus(), 50);
    return () => {
      document.removeEventListener('keydown', onKey);
      globalThis.clearTimeout(id);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      const scrollY = globalThis.scrollY;
      
      const html = document.documentElement;
      const body = document.body;
      
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
      const scrollY = document.body.style.top;
      
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
      
      const style = document.getElementById('no-scroll-style');
      if (style) {
        style.remove();
      }
      
      if (scrollY) {
        const targetY = Number.parseInt(scrollY.replace('-', '')) || 0;
        globalThis.scrollTo(0, targetY);
      }
    }
    
    return () => {
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

  return (
    <AnimatePresence>
      {isOpen && (
        <m.div
          key="services-sheet"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-50 flex justify-end bg-night/60"
          onClick={onClose}
        >
          <m.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="services-sheet-title"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.7, ease: EASE_STUDIO }}
            className="relative flex h-full w-full max-w-xl flex-col border-l border-line bg-paper text-ink"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 items-center justify-between border-b border-line px-6 py-5 sm:px-10">
              <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-mute">U+ Studio — Hizmetler</span>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Kapat"
                className="group inline-flex items-center gap-3 font-mono text-[12px] uppercase tracking-[0.14em] text-ink hover:text-clay"
              >
                Kapat
                <svg className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="square" strokeWidth={1} d="M5 19L19 5M5 5l14 14" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain px-6 pb-10 pt-10 sm:px-10">
              <h2
                id="services-sheet-title"
                className="display text-[clamp(2.5rem,8vw,4rem)] text-ink"
              >
                Hizmet<em className="font-serif font-normal italic tracking-normal">lerimiz</em>
              </h2>

              <ol className="mt-10 border-t border-line">
                {SERVICES.map((service, i) => (
                  <m.li
                    key={service.title}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.25 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                    className="group grid grid-cols-[2.5rem_1fr] gap-x-4 border-b border-line py-5"
                  >
                    <span className="pt-1 font-mono text-[12px] tracking-[0.14em] text-mute">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="display text-xl leading-[1.15]! text-ink transition-colors group-hover:text-clay sm:text-2xl">
                        {service.title}
                      </h3>
                      <p className="mt-1.5 text-[14px] leading-relaxed text-mute">{service.desc}</p>
                    </div>
                  </m.li>
                ))}
              </ol>
            </div>

            <div className="shrink-0 border-t border-line px-6 py-6 sm:px-10">
              <p className="font-serif text-xl italic text-ink">“Her detay bilinçli. Her mekân güçlü.”</p>
              <p className="mt-2 text-[13px] text-mute">İhtiyaçlarınıza özel çözümler için bizimle iletişime geçin.</p>
            </div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
