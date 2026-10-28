"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { m, AnimatePresence, useReducedMotion } from "framer-motion";

export type ToastType = "success" | "error" | "info";

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  createdAt: number;
}

interface ToastContextValue {
  toasts: ToastItem[];
  addToast: (message: string, type?: ToastType, durationMs?: number) => void;
  removeToast: (id: string) => void;
  success: (message: string, durationMs?: number) => void;
  error: (message: string, durationMs?: number) => void;
  info: (message: string, durationMs?: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const DEFAULT_DURATION_MS = 4000;

function useToastContext(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}

export function useToast(): ToastContextValue {
  return useToastContext();
}

export function ToastProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (message: string, type: ToastType = "info", durationMs = DEFAULT_DURATION_MS) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const item: ToastItem = { id, message, type, createdAt: Date.now() };
      setToasts((prev) => [...prev.slice(-4), item]);

      if (durationMs > 0) {
        setTimeout(() => removeToast(id), durationMs);
      }
    },
    [removeToast]
  );

  const success = useCallback(
    (message: string, durationMs?: number) =>
      addToast(message, "success", durationMs ?? DEFAULT_DURATION_MS),
    [addToast]
  );
  const error = useCallback(
    (message: string, durationMs?: number) =>
      addToast(message, "error", durationMs ?? DEFAULT_DURATION_MS),
    [addToast]
  );
  const info = useCallback(
    (message: string, durationMs?: number) =>
      addToast(message, "info", durationMs ?? DEFAULT_DURATION_MS),
    [addToast]
  );

  const value: ToastContextValue = useMemo(() => ({
    toasts,
    addToast,
    removeToast,
    success,
    error,
    info,
  }), [toasts, addToast, removeToast, success, error, info]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
}

function ToastContainer({
  toasts,
  onDismiss,
}: Readonly<{
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}>) {
  return (
    <section
      className="pointer-events-none fixed bottom-4 left-4 z-[9999] flex w-[min(calc(100vw-2rem),24rem)] flex-col gap-2 sm:bottom-8 sm:left-8"
      aria-live="polite"
      aria-label="Notifications"
    >
      <div className="pointer-events-auto flex flex-col gap-2">
        <AnimatePresence mode="popLayout" initial={false}>
          {toasts.map((toast) => (
            <ToastItem key={toast.id} item={toast} onDismiss={onDismiss} />
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}

const typeLabels: Record<ToastType, { tr: string; en: string }> = {
  success: { tr: "Tamam", en: "Done" },
  error: { tr: "Hata", en: "Error" },
  info: { tr: "Bilgi", en: "Note" },
};

const typeAccent: Record<ToastType, string> = {
  success: "bg-bone/40",
  error: "bg-clay",
  info: "bg-bone/20",
};

function ToastItem({
  item,
  onDismiss,
}: Readonly<{
  item: ToastItem;
  onDismiss: (id: string) => void;
}>) {
  const reduce = useReducedMotion();
  const lang = typeof document !== "undefined" && document.documentElement.lang.startsWith("en") ? "en" : "tr";
  return (
    <m.div
      layout={!reduce}
      role={item.type === "error" ? "alert" : "status"}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, x: -24 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex items-start gap-4 bg-night py-4 pl-5 pr-3 text-bone"
    >
      <span className={`absolute inset-y-0 left-0 w-px ${typeAccent[item.type]}`} aria-hidden />
      <div className="min-w-0 flex-1">
        <p className={`font-mono text-[11px] uppercase tracking-[0.14em] ${item.type === "error" ? "text-clay" : "text-bone/50"}`}>
          {typeLabels[item.type][lang]}
        </p>
        <p className="mt-1.5 text-[14px] leading-snug text-bone">{item.message}</p>
      </div>
      <button
        type="button"
        onClick={() => onDismiss(item.id)}
        className="relative -mr-1 h-8 w-8 shrink-0 text-bone/50 hover:text-clay"
        aria-label={lang === "en" ? "Close" : "Kapat"}
      >
        <span className="absolute left-1/2 top-1/2 h-px w-3.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-current" aria-hidden />
        <span className="absolute left-1/2 top-1/2 h-px w-3.5 -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-current" aria-hidden />
      </button>
    </m.div>
  );
}
