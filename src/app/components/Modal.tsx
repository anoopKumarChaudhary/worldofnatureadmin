"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
}: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div 
      // Offset by sidebar width (w-72 = 18rem) on large screens where sidebar is visible
      className="fixed inset-0 lg:left-72 z-[9999] overflow-y-auto bg-[#14281D]/60 backdrop-blur-md transition-opacity"
      onClick={onClose}
    >
      <div className="flex min-h-screen items-center justify-center py-24 px-4 text-center">
        <div 
          className="relative w-full max-w-2xl sm:max-w-5xl transform overflow-hidden rounded-2xl bg-[#F2F0EA] text-left shadow-2xl transition-all border border-white/50 flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-5 py-3 border-b border-[#1A2118]/10 flex items-center justify-between bg-white/50 backdrop-blur-md shrink-0">
            <h3 className="text-base font-serif font-bold text-[#1A2118]">{title}</h3>
            <button
              onClick={onClose}
              className="text-[#1A2118]/40 hover:text-[#BC5633] transition-colors p-1 rounded-full hover:bg-[#1A2118]/5"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          {/* Content */}
          <div 
            className="px-5 py-5"
            data-lenis-prevent
          >
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="px-5 py-3 border-t border-[#1A2118]/10 bg-white/50 backdrop-blur-md shrink-0 flex justify-end gap-2">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}