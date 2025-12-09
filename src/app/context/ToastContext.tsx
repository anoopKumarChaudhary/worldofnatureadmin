"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  addToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto remove after 5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[10000] flex flex-col gap-2 pointer-events-none items-center">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border backdrop-blur-md transition-all animate-fade-in-up min-w-[300px] max-w-md
              ${
                toast.type === "success"
                  ? "bg-[#14281D]/90 border-[#5A7D6B]/30 text-[#F2F0EA]"
                  : toast.type === "error"
                  ? "bg-[#4A2820]/90 border-[#8F4F3D]/30 text-[#F2F0EA]"
                  : toast.type === "warning"
                  ? "bg-[#9C7C36]/90 border-[#C4A052]/30 text-[#F2F0EA]"
                  : "bg-[#1A2118]/90 border-[#1A2118]/10 text-[#F2F0EA]"
              }
            `}
          >
            <div className="shrink-0">
              {toast.type === "success" && <CheckCircle className="w-5 h-5 text-[#5A7D6B]" />}
              {toast.type === "error" && <AlertCircle className="w-5 h-5 text-[#BC5633]" />}
              {toast.type === "warning" && <AlertTriangle className="w-5 h-5 text-[#C4A052]" />}
              {toast.type === "info" && <Info className="w-5 h-5 text-[#7B9C8B]" />}
            </div>
            <p className="text-sm font-medium flex-1">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4 opacity-70" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
