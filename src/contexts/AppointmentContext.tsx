"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const AppointmentModal = dynamic(() => import("@/components/AppointmentModal"), { ssr: false });

export interface AppointmentPrefill {
  name?: string;
  email?: string;
  phone?: string;
  service?: string;
  date?: string;
  time?: string;
  message?: string;
}

interface AppointmentContextValue {
  openAppointment: () => void;
  openAppointmentWith: (prefill: AppointmentPrefill) => void;
  closeAppointment: () => void;
}

const AppointmentContext = createContext<AppointmentContextValue | null>(null);

export function AppointmentProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [prefill, setPrefill] = useState<AppointmentPrefill | null>(null);
  const pathname = usePathname();
  const [openedOn, setOpenedOn] = useState(pathname);
  if (openedOn !== pathname) {
    setOpenedOn(pathname);
    setIsOpen(false);
  }

  const openAppointment = useCallback(() => {
    setPrefill(null);
    setHasOpened(true);
    setIsOpen(true);
  }, []);
  const openAppointmentWith = useCallback((next: AppointmentPrefill) => {
    setPrefill(next);
    setHasOpened(true);
    setIsOpen(true);
  }, []);
  const closeAppointment = useCallback(() => setIsOpen(false), []);
  const value = useMemo(
    () => ({ openAppointment, openAppointmentWith, closeAppointment }),
    [openAppointment, openAppointmentWith, closeAppointment]
  );

  return (
    <AppointmentContext.Provider value={value}>
      {children}
      {hasOpened && <AppointmentModal isOpen={isOpen} onClose={closeAppointment} prefill={prefill} />}
    </AppointmentContext.Provider>
  );
}

export function useAppointment(): AppointmentContextValue {
  const ctx = useContext(AppointmentContext);
  if (!ctx) throw new Error("useAppointment must be used within an AppointmentProvider");
  return ctx;
}
