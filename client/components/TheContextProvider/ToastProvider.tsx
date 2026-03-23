"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { createPortal } from "react-dom";

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

      setToasts((prev) => [...prev, { id, message, duration }]);
    },
    [],
  );
  const handleDismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toastContent = (
    <div
      className="fixed left-1/2 top-20 z-[9999] flex -translate-x-1/2 flex-col items-center gap-3"
      aria-hidden={toasts.length === 0}
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

    const showFrame = requestAnimationFrame(() => {
      setVisible(true);
    });

    const hideTimer = setTimeout(() => {
      setVisible(false);
      removeTimer = setTimeout(onDismiss, 300);
    }, duration);

    return () => {
      cancelAnimationFrame(showFrame);
      clearTimeout(hideTimer);
      if (removeTimer) clearTimeout(removeTimer);
    };
  }, [duration, onDismiss]);

  return (
    <div
      role="alert"
      className={`fixed left-1/2 top-20 z-[9999] flex w-max max-w-xs -translate-x-1/2 items-center justify-center rounded-lg border-2 border-green-500 bg-white px-5 py-4 text-lg font-medium text-green-600 shadow-lg transition-opacity duration-300 dark:border-green-400 dark:bg-gray-800 dark:text-green-400 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {message}
    </div>
  );
}

// function ToastContainer({
//   message,
//   duration,
//   onDismiss,
// }: {
//   message: string;
//   duration: number;
//   onDismiss: () => void;
// }) {
//   const [isVisible, setIsVisible] = useState(false);

//   useEffect(() => {
//     let removeTimer: ReturnType<typeof setTimeout> | undefined;
//     const showTimer = requestAnimationFrame(() => {
//       setIsVisible(true);
//     });

//     const hideTimer = setTimeout(() => {
//       setIsVisible(false);
//       removeTimer = setTimeout(onDismiss, 300);
//     }, duration);

//     return () => {
//       cancelAnimationFrame(showTimer);
//       clearTimeout(hideTimer);
//       clearTimeout(removeTimer);
//     };
//   }, [duration, message, onDismiss]);

//   return (
//     <div
//       role="alert"
//       aria-live="polite"
//       className={` ${
//         isVisible ? "opacity-100" : "pointer-events-none opacity-0"
//       }`}
//     >
//       {message}
//     </div>
//   );
// }

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
