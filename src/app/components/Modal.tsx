"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
}: ModalProps) {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-[#14281D]/60 backdrop-blur-sm"
          aria-hidden="true"
          onClick={onClose}
        ></div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        {/* Modal Content */}
        <div className="inline-block align-bottom bg-[#F2F0EA] rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full relative z-10 border border-white/50">
          <div className="px-6 py-5 border-b border-[#1A2118]/10 flex items-center justify-between bg-white/50 backdrop-blur-md">
            <h3 className="text-xl font-serif font-bold text-[#1A2118]">{title}</h3>
            <button
              onClick={onClose}
              className="text-[#1A2118]/40 hover:text-[#BC5633] transition-colors p-1 rounded-full hover:bg-[#1A2118]/5"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="px-6 py-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
