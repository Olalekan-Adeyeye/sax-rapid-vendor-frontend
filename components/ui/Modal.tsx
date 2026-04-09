"use client";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, LucideIcon } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  size?: "md" | "lg" | "xl";
}

export function Modal({ 
  isOpen, 
  onClose, 
  title, 
  subtitle, 
  icon: Icon, 
  children,
  size = "md"
}: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Handle hydration properly to avoid cascading render warnings
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
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

  if (!isOpen || !mounted) return null;

  const sizeClasses = {
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl"
  };

  const modalContent = (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-6 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      
      <div className={`bg-white rounded w-full ${sizeClasses[size]} relative z-10000 overflow-hidden animate-in fade-in zoom-in duration-200 shadow-2xl shadow-black/20`}>
        {/* Header */}
        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-4">
             {Icon && (
               <div className="w-10 h-10 rounded bg-gray-50 flex items-center justify-center text-black border border-gray-100">
                  <Icon size={20} />
               </div>
             )}
             <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-black">{title}</h3>
                {subtitle && <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mt-0.5">{subtitle}</p>}
             </div>
          </div>
          <button onClick={onClose} className="text-gray-300 hover:text-black transition-colors p-2">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
