"use client";

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import MaintenancePage from '@/components/MaintenancePage';
// Dynamically import the HomeContent component with SSR disabled
const HomeContent = dynamic(
  () => import('@/components/HomeContent'),
  { ssr: false }
);


export default function Home() {
  let maintenanceMode = true;

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  if(maintenanceMode){
    return <MaintenancePage />;
  }

  if (!isMounted ) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return <HomeContent />;
}