"use client";
import React, { useState } from "react";
import { Zap, Check, X, Shield, Star, Rocket, Info } from "lucide-react";

export default function SubscriptionPlansPage() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div className="space-y-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <h2 className="text-2xl lg:text-4xl font-black tracking-tighter text-black">
            Subscription Plans
          </h2>
          <p className="text-gray-400 mt-2 uppercase tracking-[0.2em] text-[10px] font-black">
            Choose the right level for your growing business
          </p>
        </div>
        <div className="bg-gray-50 p-1.5 rounded-full flex items-center border border-gray-100 self-start">
          <button
            onClick={() => setIsYearly(false)}
            className={`px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${!isYearly ? "bg-black text-white" : "text-gray-400"}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setIsYearly(true)}
            className={`px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${isYearly ? "bg-black text-white" : "text-gray-400"}`}
          >
            Yearly
            <span className="ml-2 text-gold">-20%</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            name: "Free Plan",
            priceNGN: "0",
            priceUSD: "0",
            desc: "Perfect for starting your journey",
            icon: Shield,
            color: "bg-gray-50",
            features: [
              { label: "10 Product Listings", active: true },
              { label: "Standard Dashboard", active: true },
              { label: "Community Support", active: true },
              { label: "Marketing Tools", active: false },
              { label: "Priority Support", active: false },
              { label: "Unlimited Storage", active: false },
            ],
          },
          {
            name: "Standard Plan",
            priceNGN: "5,000",
            priceUSD: "10",
            desc: "Scale your business efficiently",
            icon: Star,
            color: "bg-gold/5",
            featured: true,
            features: [
              { label: "50 Product Listings", active: true },
              { label: "Advanced Analytics", active: true },
              { label: "Priority Support", active: true },
              { label: "Custom Domain", active: true },
              { label: "Marketing Tools", active: true },
              { label: "Unlimited Storage", active: false },
            ],
          },
          {
            name: "Premium Plan",
            priceNGN: "15,000",
            priceUSD: "25",
            desc: "Full force marketplace dominance",
            icon: Rocket,
            color: "bg-black",
            features: [
              { label: "Unlimited Product Listings", active: true },
              { label: "AI Marketing Suite", active: true },
              { label: "24/7 Priority Concierge", active: true },
              { label: "Early Access Features", active: true },
              { label: "Wholesale Modules", active: true },
              { label: "Zero Listing Fees", active: true },
            ],
          },
        ].map((plan, i) => (
          <div
            key={i}
            className={`relative flex flex-col p-10 rounded overflow-hidden transition-all hover:scale-[1.02] border border-gray-100 ${plan.color === "bg-black" ? "bg-black text-white border-black" : "bg-white text-black"}`}
          >
            {plan.featured && (
              <div className="absolute top-0 right-0 bg-gold text-black text-[8px] font-black uppercase tracking-[0.2em] px-5 py-2 rounded-bl">
                MOST POPULAR
              </div>
            )}
            <div className="mb-10 flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded flex items-center justify-center ${plan.color === "bg-black" ? "bg-white/10 text-gold" : "bg-gold/20 text-gold"}`}
              >
                <plan.icon size={24} />
              </div>
              <div>
                <h3
                  className={`text-sm font-black uppercase tracking-[0.2em] ${plan.color === "bg-black" ? "text-gold" : "text-black"}`}
                >
                  {plan.name}
                </h3>
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-500">
                  {plan.desc}
                </p>
              </div>
            </div>
            <div className="mb-10">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black tracking-tighter">
                  ₦{plan.priceNGN}
                </span>
                <span
                  className={`text-[10px] font-black uppercase tracking-widest ${plan.color === "bg-black" ? "text-gray-500" : "text-gray-400"}`}
                >
                  {isYearly ? "/Year" : "/Month"}
                </span>
              </div>
              <p
                className={`text-[8px] font-black uppercase tracking-widest mt-2 ${plan.color === "bg-black" ? "text-gold" : "text-black"}`}
              >
                Pay with wallet or card
              </p>
            </div>
            <div className="flex-1 space-y-5 mb-12">
              {plan.features.map((f, j) => (
                <div key={j} className="flex items-center gap-4">
                  {f.active ? (
                    <div className="w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center text-gold shrink-0">
                      <Check size={12} strokeWidth={4} />
                    </div>
                  ) : (
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${plan.color === "bg-black" ? "bg-white/5 text-gray-700" : "bg-gray-50 text-gray-200"}`}
                    >
                      <X size={12} strokeWidth={4} />
                    </div>
                  )}
                  <span
                    className={`text-[11px] font-black uppercase tracking-tight text-nowrap truncate ${!f.active ? "text-gray-400 opacity-50" : ""}`}
                  >
                    {f.label}
                  </span>
                </div>
              ))}
            </div>
            <button
              className={`w-full py-5 rounded text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                plan.color === "bg-black"
                  ? "bg-white text-black border-white hover:bg-gold hover:border-gold"
                  : plan.featured
                    ? "bg-black text-white border-black hover:bg-gold hover:text-black hover:border-gold"
                    : "bg-white text-black border-gray-100 hover:border-gold hover:text-gold"
              }`}
            >
              Get Started
            </button>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 p-10 rounded flex flex-col md:flex-row items-center justify-between gap-8 border border-gray-100">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center text-gold shrink-0">
            <Zap size={24} />
          </div>
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-black">
              Need a custom enterprise solution?
            </h4>
            <p className="text-[10px] font-medium text-gray-400 leading-relaxed mt-1">
              Talk to our accounts team for specialized volume plans and custom
              integrations.
            </p>
          </div>
        </div>
        <button className="px-10 py-4 rounded border-2 border-black text-[10px] font-black uppercase tracking-widest text-black hover:bg-black hover:text-white transition-all shrink-0">
          Contact Sales
        </button>
      </div>
    </div>
  );
}
