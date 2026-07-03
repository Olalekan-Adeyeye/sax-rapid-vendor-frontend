"use client";
import React from "react";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center py-20 px-8 ${className}`}
    >
      <div className="w-16 h-16 rounded bg-gray-50 flex items-center justify-center text-gray-200 border border-gray-100 mx-auto mb-4">
        <Icon size={32} />
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
        {title}
      </p>
      {description && (
        <p className="text-gray-500 text-sm mt-3 max-w-xs font-medium leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
