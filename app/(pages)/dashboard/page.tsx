"use client";
import React from "react";
import {
  TrendingUp,
  ShoppingBag,
  Clock,
  DollarSign,
  Eye,
  Bell,
  ArrowUpRight,
  MoreVertical,
} from "lucide-react";

import Image from "next/image";
import Link from "next/link";

function StatCard({
  title,
  value,
  detail,
  icon: Icon,
  variant = "light",
}: {
  title: string;
  value: string;
  detail: string;
  trend?: string;
  icon: React.ElementType;
  variant?: "light" | "dark";
}) {
  const isDark = variant === "dark";

  return (
    <div
      className={`rounded p-6 transition-all duration-300 group border h-full flex flex-col justify-between ${
        isDark
          ? "bg-black border-black text-white hover:border-gold/40"
          : "bg-white border-gray-100 text-black hover:bg-gold hover:border-gold"
      }`}
    >
      <div>
        <div className="flex items-start justify-between mb-4">
          <div
            className={`w-10 h-10 rounded flex items-center justify-center transition-all duration-300 ${
              isDark
                ? "bg-white/10 text-gold group-hover:bg-gold group-hover:text-black"
                : "bg-gray-50 text-gray-400 group-hover:bg-black/10 group-hover:text-black"
            }`}
          >
            <Icon size={20} />
          </div>
        </div>
        <p
          className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1.5 transition-colors duration-300 ${
            isDark
              ? "text-gray-500 group-hover:text-gold"
              : "text-gray-400 group-hover:text-black/50"
          }`}
        >
          {title}
        </p>
        <h3
          className={`text-2xl lg:text-3xl font-black tracking-tighter mb-2 transition-colors duration-300 ${
            !isDark && "group-hover:text-black"
          }`}
        >
          {value}
        </h3>
      </div>
      <p
        className={`text-[9px] font-bold uppercase tracking-widest transition-colors duration-300 ${
          isDark ? "text-gray-600" : "text-gray-400 group-hover:text-black/40"
        }`}
      >
        {detail}
      </p>
    </div>
  );
}

function ProductViewCard({
  image,
  name,
  views,
  change,
}: {
  image: string;
  name: string;
  views: string;
  change: string;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded overflow-hidden group hover:border-gold/30 transition-all">
      <div className="aspect-square bg-gray-50 overflow-hidden relative flex items-center justify-center">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <div className="w-1/3 h-1/3 relative opacity-20 filter grayscale brightness-0">
            <Image
              src="/assets/icons/SaxRapid-Logo.png"
              alt="Placeholder"
              fill
              className="object-contain"
            />
          </div>
        </div>
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500 relative z-10"
        />
        <div className="absolute top-3 right-3 z-20">
          <div className="bg-white/90 backdrop-blur-sm p-1.5 rounded-full text-black hover:bg-gold transition-colors">
            <ArrowUpRight size={14} />
          </div>
        </div>
      </div>
      <div className="p-4">
        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">
          Product View
        </p>
        <h4 className="text-xs font-black text-black tracking-tight mb-2 truncate">
          {name}
        </h4>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Eye size={12} className="text-gold" />
            <span className="text-xs font-black text-black">{views}</span>
          </div>
          <span className="text-[9px] font-black text-green-600">
            +{change}%
          </span>
        </div>
      </div>
    </div>
  );
}

export default function DashboardOverview() {
  return (
    <div className="space-y-10 lg:space-y-14">
      {/* Welcome Info */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 min-w-0">
        <div className="min-w-0">
          <h2 className="text-2xl lg:text-4xl font-black tracking-tighter text-black truncate sm:whitespace-normal">
            Vendor Performance
          </h2>
          <p className="text-gray-400 mt-2 uppercase tracking-[0.2em] text-[9px] lg:text-[10px] font-black flex items-center gap-2">
            Live Dashboard Overview
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-6 py-3 rounded border border-gray-100 text-[10px] font-black uppercase tracking-widest text-black hover:bg-gray-50 transition-all">
            Generate Report
          </button>
          <button className="px-6 py-3 rounded bg-gold text-[10px] font-black uppercase tracking-widest text-black hover:bg-black hover:text-white transition-all">
            Withdraw Funds
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatCard
          icon={TrendingUp}
          title="Total Sales"
          value="₦14,247,500"
          detail="Lifetime earnings"
          trend="+12.5%"
          variant="dark"
        />
        <StatCard
          icon={ShoppingBag}
          title="Total Orders"
          value="1,284"
          detail="Total items sold"
          trend="+8.2%"
        />
        <StatCard
          icon={Clock}
          title="Pending Orders"
          value="12"
          detail="Needs fulfillment"
        />
        <StatCard
          icon={DollarSign}
          title="Revenue Stats"
          value="₦842,000"
          detail="Net profit this month"
          trend="+15.3%"
        />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 lg:gap-12">
        {/* Product Views Section */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Eye size={18} className="text-gold" />
              <h4 className="text-xs font-black tracking-[0.2em] text-black">
                Top Product Views
              </h4>
            </div>
            <button className="text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-gold transition-colors">
              View Analytics
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ProductViewCard
              image="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop"
              name="Premium Watch 5"
              views="1,204"
              change="12"
            />
            <ProductViewCard
              image="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop"
              name="Studio Headphones"
              views="842"
              change="8"
            />
            <ProductViewCard
              image="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop"
              name="Speed Sneakers"
              views="731"
              change="24"
            />
            <ProductViewCard
              image="https://images.unsplash.com/photo-1585333127302-3f8d9560f63b?w=400&h=400&fit=crop"
              name="Dashed Fragrance"
              views="652"
              change="15"
            />
          </div>
        </div>

        {/* Notifications Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell size={18} className="text-gold" />
              <h4 className="text-xs font-black tracking-[0.2em] text-black">
                Latest Updates
              </h4>
            </div>
            <button className="text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-gold transition-colors">
              Clear All
            </button>
          </div>

          <div className="bg-white border border-gray-100 rounded divide-y divide-gray-50">
            {[
              {
                title: "New Order Received",
                desc: "Order #8291 has been placed for 2 items.",
                time: "10m ago",
                type: "order",
              },
              {
                title: "Payout Completed",
                desc: "₦450,000 was sent to your GTB account.",
                time: "2h ago",
                type: "wallet",
              },
              {
                title: "Stock Alert",
                desc: "Premium Watch 5 is critically low in stock.",
                time: "5h ago",
                type: "warning",
              },
              {
                title: "Customer Review",
                desc: "Sarah gave 5 stars for 'Speed Sneakers'",
                time: "1d ago",
                type: "review",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-5 hover:bg-gray-50/50 transition-colors group cursor-pointer relative overflow-hidden"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                      item.type === "warning"
                        ? "bg-red-500"
                        : item.type === "wallet"
                          ? "bg-green-500"
                          : "bg-gold"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="text-[11px] font-black tracking-tight text-black truncate">
                        {item.title}
                      </h5>
                      <span className="text-[8px] font-bold text-gray-400 uppercase">
                        {item.time}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500 font-medium leading-relaxed line-clamp-2">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black border border-gray-100 rounded transition-all">
            View All Notifications
          </button>
        </div>
      </div>

      {/* Secondary Stats/Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="bg-white border border-gray-100 rounded p-6">
          <div className="flex items-center justify-between mb-8">
            <h4 className="text-[10px] font-black tracking-widest text-black">
              Revenue Performance
            </h4>
            <select className="bg-transparent text-[9px] font-black uppercase tracking-widest text-gray-400 outline-none cursor-pointer hover:text-black transition-colors">
              <option>Last 12 Months</option>
              <option>Last 6 Months</option>
            </select>
          </div>
          <div className="h-48 relative w-full group">
            <svg
              viewBox="0 0 1200 300"
              className="w-full h-full overflow-visible drop-shadow-[0_10px_10px_rgba(239,191,4,0.05)]"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#EFBF04" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#EFBF04" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              <line
                x1="0"
                y1="0"
                x2="1200"
                y2="0"
                stroke="#f1f5f9"
                strokeWidth="1"
              />
              <line
                x1="0"
                y1="100"
                x2="1200"
                y2="100"
                stroke="#f1f5f9"
                strokeWidth="1"
              />
              <line
                x1="0"
                y1="200"
                x2="1200"
                y2="200"
                stroke="#f1f5f9"
                strokeWidth="1"
              />
              <line
                x1="0"
                y1="300"
                x2="1200"
                y2="300"
                stroke="#f1f5f9"
                strokeWidth="1"
              />

              {/* Area Fill */}
              <path
                d="M0,300 L0,220 L100,180 L200,230 L300,140 L400,180 L500,80 L600,140 L700,90 L800,160 L900,40 L1000,100 L1100,60 L1200,120 L1200,300 Z"
                fill="url(#chartGradient)"
              />

              {/* The Line */}
              <path
                d="M0,220 L100,180 L200,230 L300,140 L400,180 L500,80 L600,140 L700,90 L800,160 L900,40 L1000,100 L1100,60 L1200,120"
                fill="none"
                stroke="#EFBF04"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-[LOADING-ANIMATION-OR-STRETCH]"
              />

              {/* Active Marker Points */}
              {[
                { x: 0, y: 220 },
                { x: 500, y: 80 },
                { x: 900, y: 40 },
                { x: 1200, y: 120 },
              ].map((p, i) => (
                <circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r="5"
                  fill="white"
                  stroke="#EFBF04"
                  strokeWidth="2"
                  className="transition-all duration-300"
                />
              ))}
            </svg>

            {/* X-Axis Labels */}
            <div className="absolute -bottom-4 left-0 right-0 flex justify-between text-[8px] font-black uppercase tracking-widest text-gray-300">
              {["Jan", "Mar", "May", "Jul", "Sep", "Nov", "Dec"].map((m) => (
                <span key={m}>{m}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded p-6">
          <div className="flex items-center justify-between mb-8">
            <h4 className="text-[10px] font-black tracking-widest text-black">
              Popular Categories
            </h4>
            <MoreVertical size={14} className="text-gray-400 cursor-pointer" />
          </div>
          <div className="space-y-6">
            {[
              { name: "Electronics", val: 85 },
              { name: "Fast Fashion", val: 65 },
              { name: "Home Living", val: 45 },
              { name: "Beauty", val: 30 },
            ].map((cat, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className="text-black">{cat.name}</span>
                  <span className="text-gray-400">{cat.val}%</span>
                </div>
                <div className="h-1.5 bg-gray-50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold rounded-full transition-all duration-1000"
                    style={{ width: `${cat.val}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Latest Orders Table */}
      <div className="bg-white border border-gray-100 rounded overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-black">
            Latest Orders
          </h4>
          <Link
            href="/orders"
            className="text-[10px] font-black uppercase tracking-widest text-gold hover:text-black transition-colors"
          >
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50">
              <tr>
                {[
                  "Order ID",
                  "Customer",
                  "Product",
                  "Amount",
                  "Date",
                  "Status",
                  "",
                ].map((th) => (
                  <th
                    key={th}
                    className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 whitespace-nowrap"
                  >
                    {th}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[
                {
                  id: "#SR-9102",
                  customer: "Adebayo S.",
                  product: "Premium Watch 5",
                  amount: "₦125,000",
                  date: "Oct 24, 2026",
                  status: "Processing",
                  color: "text-blue-600 bg-blue-50",
                },
                {
                  id: "#SR-9101",
                  customer: "Chinonso O.",
                  product: "Studio Headphones",
                  amount: "₦85,000",
                  date: "Oct 24, 2026",
                  status: "Delivered",
                  color: "text-green-600 bg-green-50",
                },
                {
                  id: "#SR-9100",
                  customer: "Fatima K.",
                  product: "Speed Sneakers",
                  amount: "₦45,000",
                  date: "Oct 23, 2026",
                  status: "Pending",
                  color: "text-gold bg-gold/20",
                },
                {
                  id: "#SR-9099",
                  customer: "Emeka U.",
                  product: "Dashed Fragrance",
                  amount: "₦25,000",
                  date: "Oct 23, 2026",
                  status: "Cancelled",
                  color: "text-red-600 bg-red-50",
                },
              ].map((order, i) => (
                <tr
                  key={i}
                  className="group hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-8 py-5 text-xs font-black text-black">
                    {order.id}
                  </td>
                  <td className="px-8 py-5 text-xs font-bold text-gray-500">
                    {order.customer}
                  </td>
                  <td className="px-8 py-5 text-xs font-black text-black">
                    {order.product}
                  </td>
                  <td className="px-8 py-5 text-xs font-black text-black">
                    {order.amount}
                  </td>
                  <td className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    {order.date}
                  </td>
                  <td className="px-8 py-5">
                    <span
                      className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${order.color}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="text-gray-300 hover:text-black transition-colors px-4">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
