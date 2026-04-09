import React from "react";

interface StepItemProps {
  number: string;
  title: string;
  desc: string;
  active: boolean;
  onClick: () => void;
}

export function StepItem({
  number,
  title,
  desc,
  active,
  onClick,
}: StepItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-start gap-6 p-6 rounded text-left transition-all duration-300 ${
        active
          ? "bg-gold shadow-2xl shadow-gold/40"
          : "bg-gray-50 hover:bg-gray-100"
      }`}
    >
      <span
        className={`shrink-0 w-12 h-12 rounded flex items-center justify-center font-black text-sm ${
          active
            ? "bg-black text-gold"
            : "bg-white text-black border border-gray-100"
        }`}
      >
        {number}
      </span>
      <div>
        <h4 className="font-black text-base uppercase tracking-tight mb-1 text-black">
          {title}
        </h4>
        <p className={`text-sm ${active ? "text-black/70" : "text-gray-500"}`}>
          {desc}
        </p>
      </div>
    </button>
  );
}
