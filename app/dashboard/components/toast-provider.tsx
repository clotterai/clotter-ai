"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

type ToastVariant = "success" | "error";

type Toast = {
  id: number;
  message: string;
  variant: ToastVariant;
};

type ToastContextValue = {
  showToast: (message: string, variant?: ToastVariant) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idRef = useRef(0);

  const showToast = useCallback(
    (message: string, variant: ToastVariant = "success") => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      idRef.current += 1;
      const id = idRef.current;
      setToast({ id, message, variant });

      timeoutRef.current = setTimeout(() => {
        setToast((current) => (current?.id === id ? null : current));
      }, 2000);
    },
    [],
  );

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="pointer-events-none fixed inset-x-0 bottom-6 z-[500] flex justify-center px-4"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <div
            className={`pointer-events-auto rounded-full border border-white/10 bg-[#13131f]/90 px-5 py-2.5 text-sm font-medium tracking-[-0.01em] text-white/90 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.6)] backdrop-blur-xl ${
              toast.variant === "success"
                ? "border-l-[3px] border-l-emerald-400"
                : "border-l-[3px] border-l-red-400"
            }`}
          >
            {toast.message}
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
