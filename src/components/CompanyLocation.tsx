'use client';

import { useEffect, useRef, useState } from 'react';

interface CompanyLocationProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  directionsLabel?: string;
  title?: string;
}

const SIZE_CONFIG = {
  sm: { height: 'h-64', margin: 'mt-2 mb-1' },
  md: { height: 'h-80', margin: 'mt-4 mb-2' },
  lg: { height: 'h-96', margin: 'mt-6 mb-3' },
  xl: { height: 'h-[26rem] sm:h-[32rem]', margin: '' },
} as const;

export default function CompanyLocation({
  size = 'lg',
  directionsLabel = 'Yol Tarifi',
  title = 'U+ Studio Konum Haritası',
}: Readonly<CompanyLocationProps>) {
  const companyAddress = "İncek Mahallesi Reyhan Caddesi No:3, 06830 Gölbaşı/Ankara";
  const encodedAddress = encodeURIComponent(companyAddress);
  const publicMapUrl = `https://maps.google.com/maps?q=${encodedAddress}&t=m&z=16&ie=UTF8&iwloc=&output=embed`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;

  const config = SIZE_CONFIG[size];
  const boxRef = useRef<HTMLDivElement>(null);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setShowMap(true);
        io.disconnect();
      }
    }, { rootMargin: '200px' });
    io.observe(box);
    return () => io.disconnect();
  }, []);

  return (
    <div className={`w-full ${config.margin}`}>
      <div ref={boxRef} className={`relative ${config.height} overflow-hidden border border-line bg-paper-2`}>
        {showMap && <iframe
          src={publicMapUrl}
          width="100%"
          height="100%"
          style={{ border: 0, filter: 'grayscale(1) contrast(0.92) brightness(1.04)' }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-full w-full"
          title={title}
        />}
        <div className="pointer-events-none absolute inset-0 bg-paper mix-blend-multiply opacity-40" aria-hidden />

        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group absolute right-0 top-0 inline-flex items-center gap-3 border-b border-l border-line bg-paper px-5 py-3 font-mono text-[12px] uppercase tracking-[0.14em] text-ink transition-colors hover:bg-night hover:text-bone"
        >
          {directionsLabel}
          <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
        </a>
      </div>
    </div>
  );
}
