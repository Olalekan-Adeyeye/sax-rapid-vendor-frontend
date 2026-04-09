"use client";
import React, { useState } from "react";
import {
  Rocket,
  Star,
  Eye,
  Plus,
  ShoppingBag,
  Clock,
  Wallet,
  CheckCircle,
} from "lucide-react";

export default function BoostAdsPage() {
  const [selectedDays, setSelectedDays] = useState(7);

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <h2 className="text-2xl lg:text-4xl font-black tracking-tighter text-black">
            Boost My Ads
          </h2>
          <p className="text-gray-400 mt-2 uppercase tracking-[0.2em] text-[10px] font-black">
            Promote your products for maximum visibility
          </p>
        </div>
        <button className="px-8 py-4 rounded bg-gold text-[10px] font-black uppercase tracking-widest text-black hover:bg-black hover:text-white transition-all flex items-center justify-center gap-3">
          <Plus size={16} />
          New Promotion
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {[
          {
            title: "Boost Product",
            desc: "Appear at the top of relevant search results.",
            icon: Rocket,
            price: "₦1,500",
            color: "bg-gold",
            type: "Search results",
          },
          {
            title: "Featured Product",
            desc: "Showcase your best product on the store homepage.",
            icon: Star,
            price: "₦5,000",
            color: "bg-black text-white",
            type: "Homepage",
          },
          {
            title: "Category Spotlight",
            desc: "Dominant placement in a specific category page.",
            icon: Eye,
            price: "₦3,500",
            color: "bg-gray-50",
            type: "Category page",
          },
        ].map((ad, i) => (
          <div
            key={i}
            className={`p-8 lg:p-10 rounded border border-gray-100 flex flex-col justify-between group hover:scale-[1.02] transition-all cursor-pointer ${ad.color === "bg-black text-white" ? "bg-black text-white" : "bg-white text-black"}`}
          >
            <div className="mb-10">
              <div
                className={`w-14 h-14 rounded flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${ad.color === "bg-black text-white" ? "bg-white/10 text-gold" : "bg-gold/20 text-gold"}`}
              >
                <ad.icon size={24} />
              </div>
              <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-4">
                {ad.title}
              </h3>
              <p className="text-[10px] font-medium leading-relaxed opacity-60 mb-6">
                {ad.desc}
              </p>
              <div className="flex items-center justify-between py-4 border-y border-gray-100/10">
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">
                  Placement
                </span>
                <span className="text-[9px] font-black uppercase tracking-widest text-gold">
                  {ad.type}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between mb-8">
              <p className="text-2xl font-black tracking-tight">
                {ad.price}
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">
                  /day
                </span>
              </p>
            </div>
            <button
              className={`w-full py-4 rounded text-[9px] font-black uppercase tracking-widest transition-all ${
                ad.color === "bg-black text-white"
                  ? "bg-gold text-black hover:bg-white"
                  : "bg-black text-white hover:bg-gold hover:text-black"
              }`}
            >
              Activate Now
            </button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white border border-gray-100 rounded p-8 lg:p-10 space-y-10">
          <div className="flex items-center gap-4 pb-6 border-b border-gray-50">
            <div className="w-12 h-12 rounded bg-gold/5 flex items-center justify-center text-gold">
              <Clock size={20} />
            </div>
            <div>
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-black">
                Promotion Duration
              </h4>
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mt-1">
                Select how long your ad should run
              </p>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[3, 7, 14, 30].map((days) => (
              <button
                key={days}
                onClick={() => setSelectedDays(days)}
                className={`py-6 rounded border-2 transition-all flex flex-col items-center gap-2 group ${
                  selectedDays === days
                    ? "bg-black text-white border-black"
                    : "bg-white text-black border-gray-100 hover:border-gold hover:text-gold"
                }`}
              >
                <span className="text-xl font-black tracking-tighter">
                  {days}
                </span>
                <span className="text-[9px] font-black uppercase tracking-tighter opacity-60 group-hover:opacity-100">
                  DAYS
                </span>
              </button>
            ))}
          </div>
          <div className="bg-gray-50 p-6 rounded flex items-center justify-between border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black">
                <Wallet size={18} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Total Deduction
                </p>
                <p className="text-sm font-black text-black">
                  ₦{selectedDays * 1500}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[8px] font-black uppercase tracking-widest bg-green-50 text-green-600 px-3 py-1.5 rounded-full">
                Wallet Active
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-black">
              Active Promotions
            </h4>
            <button className="text-[9px] font-black uppercase tracking-widest text-gold whitespace-nowrap">
              Full History →
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {[
              {
                name: "Premium Watch 5",
                type: "Boost Product",
                days: 7,
                spent: "₦10,500",
                status: "Active",
                icon: Rocket,
              },
              {
                name: "Studio Headphones",
                type: "Featured",
                days: 3,
                spent: "₦15,000",
                status: "Expired",
                icon: Star,
              },
            ].map((p, i) => (
              <div
                key={i}
                className="p-8 flex items-center justify-between group hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex items-center gap-6">
                  <div
                    className={`w-12 h-12 rounded flex items-center justify-center shrink-0 ${p.status === "Active" ? "bg-gold/20 text-gold" : "bg-gray-50 text-gray-300"}`}
                  >
                    <p.icon size={20} />
                  </div>
                  <div>
                    <h5 className="text-[11px] font-black uppercase tracking-tight text-black">
                      {p.name}
                    </h5>
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mt-1">
                      {p.type} · {p.days} Days
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-black mb-1">
                    {p.spent}
                  </p>
                  <span
                    className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${p.status === "Active" ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"}`}
                  >
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
