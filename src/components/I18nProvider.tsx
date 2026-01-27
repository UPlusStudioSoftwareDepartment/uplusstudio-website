// src/components/I18nProvider.tsx
"use client";

import { I18nextProvider } from "react-i18next";
import i18n from "@/lib/i18n-config";
import { useEffect, useState } from "react";

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
}