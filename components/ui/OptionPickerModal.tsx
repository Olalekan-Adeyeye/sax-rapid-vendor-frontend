"use client";
import React from "react";
import { Modal } from "@/components/ui/Modal";
import type { LucideIcon } from "lucide-react";

export interface PickerOption<T extends string> {
  key: T;
  title: string;
  desc?: string | null;
  icon: LucideIcon;
  color?: string;
  hover?: string;
}

interface OptionPickerModalProps<T extends string> {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (key: T) => void;
  title: string;
  subtitle: string;
  options: PickerOption<T>[];
}

export function OptionPickerModal<T extends string>({
  isOpen,
  onClose,
  onSelect,
  title,
  subtitle,
  options,
}: OptionPickerModalProps<T>) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      size="md"
    >
      <div className="space-y-4">
        {options.map((opt) => (
          <button
            key={opt.key}
            onClick={() => onSelect(opt.key)}
            className={`w-full p-6 rounded border border-gray-100 flex items-start gap-5 text-left transition-all ${opt.hover || "hover:border-gold hover:bg-gold/5"}`}
          >
            <div
              className={`w-12 h-12 rounded flex items-center justify-center shrink-0 ${opt.color || "bg-gold/20 text-gold"}`}
            >
              <opt.icon size={22} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-black mb-1">{opt.title}</p>
              {opt.desc && (
                <p className="text-xs font-medium text-gray-400 leading-relaxed">
                  {opt.desc}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>
    </Modal>
  );
}
