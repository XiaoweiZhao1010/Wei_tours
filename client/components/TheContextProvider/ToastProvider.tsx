"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, X } from "lucide-react";

const DEFAULT_DURATION = 3000;

type ToastContextType = {
  showToast: (message: string, duration?: number) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);
type Toast = {
  id: string;
  message: string;
  duration: number;
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const showToast = useCallback(
    (message: string, duration = DEFAULT_DURATION) => {
      const id = crypto.randomUUID();
      setToasts((prev) => [{ id, message, duration }, ...prev]);
    },
    [],
  );

  const handleDismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toastContent = (
    <div
      className="pointer-events-none fixed left-1/2 top-20 z-[9999] flex w-full max-w-md -translate-x-1/2 flex-col gap-2 px-4 sm:max-w-sm"
      aria-live="polite"
      aria-relevant="additions"
      aria-atomic="true"
    >
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          {...toast}
          onDismiss={() => handleDismiss(toast.id)}
        />
      ))}
    </div>
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {mounted && createPortal(toastContent, document.body)}
    </ToastContext.Provider>
  );
}

function ToastItem({
  message,
  duration,
  onDismiss,
}: {
  message: string;
  duration: number;
  onDismiss: () => void;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let removeTimer: ReturnType<typeof setTimeout> | undefined;
    const enter = requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true));
    });

    const hideTimer = setTimeout(() => {
      setVisible(false);
      removeTimer = setTimeout(onDismiss, 280);
    }, duration);

    return () => {
      cancelAnimationFrame(enter);
      clearTimeout(hideTimer);
      if (removeTimer) clearTimeout(removeTimer);
    };
  }, [duration, onDismiss]);

  function dismissNow() {
    setVisible(false);
    window.setTimeout(onDismiss, 280);
  }

  return (
    <div
      role="alert"
      className={`pointer-events-auto flex max-w-full items-start gap-3 rounded-2xl border border-emerald-200/90 bg-white/95 px-3.5 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.08)] backdrop-blur-md transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] dark:border-emerald-500/20 dark:bg-gray-900/92 dark:shadow-[0_12px_40px_rgb(0,0,0,0.45)] ${
        visible
          ? "translate-y-0 scale-100 opacity-100"
          : "pointer-events-none -translate-y-2 scale-[0.97] opacity-0"
      }`}
    >
      <span
        className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/12 text-emerald-600 ring-1 ring-emerald-500/15 dark:bg-emerald-400/12 dark:text-emerald-400 dark:ring-emerald-400/20"
        aria-hidden
      >
        <CheckCircle2 className="h-4.5 w-4.5" strokeWidth={2.25} />
      </span>
      <p className="min-w-0 flex-1 pt-2 text-[13px] font-medium leading-snug tracking-tight text-gray-800 dark:text-gray-100">
        {message}
      </p>
      <button
        type="button"
        onClick={dismissNow}
        className="-mr-0.5 -mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-500 dark:hover:bg-white/10 dark:hover:text-gray-200"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" strokeWidth={2} />
      </button>
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
