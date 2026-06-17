"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  X,
  LayoutDashboard,
  ShoppingBag,
  Package,
  Plus,
  Tags,
  Star,
  Wallet,
  ArrowDownCircle,
  Zap,
  Gift,
  Rocket,
  LineChart,
  Store,
  UserCog,
  Bell,
  MessageSquare,
  ArrowUpRight,
  Headphones,
} from "lucide-react";
import { Logo } from "@/components/common/Logo";

const navGroups = [
  {
    title: "Dashboard",
    items: [
      { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
      { name: "Notifications", href: "/notifications", icon: Bell },
      { name: "Messages", href: "/messages", icon: MessageSquare },
    ],
  },
  {
    title: "Inventory",
    items: [
      { name: "All Products", href: "/products", icon: Package },
      { name: "Add Product", href: "/products/add", icon: Plus },
      { name: "Categories", href: "/products/categories", icon: Tags },
      // {
      // 	name: "Product Features",
      // 	href: "/products/attributes",
      // 	icon: Settings2,
      // },
      // { name: "Variations", href: "/products/variations", icon: Layers },
      // { name: "Stock", href: "/inventory", icon: Database },
    ],
  },
  {
    title: "Sales",
    items: [
      { name: "Orders", href: "/orders", icon: ShoppingBag },
      { name: "Reviews", href: "/reviews", icon: Star },
    ],
  },
  {
    title: "Finance",
    items: [
      { name: "My Wallet", href: "/wallet", icon: Wallet },
      { name: "Payouts", href: "/withdrawals", icon: ArrowDownCircle },
      { name: "Subscriptions", href: "/subscriptions", icon: Zap },
    ],
  },
  {
    title: "Marketing",
    items: [
      { name: "Promotions", href: "/promotions", icon: Gift },
      { name: "Boost My Ads", href: "/ads", icon: Rocket },
    ],
  },
  {
    title: "System",
    items: [
      { name: "Performance", href: "/analytics", icon: LineChart },
      { name: "Store Profile", href: "/store", icon: Store },
      { name: "Account Settings", href: "/settings", icon: UserCog },
    ],
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isDesktopCollapsed?: boolean;
}

export function Sidebar({
  isOpen,
  onClose,
  isDesktopCollapsed = false,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-190 lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 bg-[#0a0a0a] border-r border-white/5 flex flex-col z-200 transition-all duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } ${isDesktopCollapsed ? "w-64 lg:w-18" : "w-64"}`}
      >
        <div
          className={`flex items-center ${isDesktopCollapsed ? "justify-center p-4 lg:p-0 lg:pt-4 lg:pb-4" : "p-8 justify-between"}`}
        >
          <Link
            href="/"
            className="group transition-opacity hover:opacity-80"
            onClick={onClose}
          >
            {isDesktopCollapsed ? (
              <div className="w-8 h-8 rounded bg-gold/20 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-gold" />
              </div>
            ) : (
              <Logo size="sm" showCaption={true} withBackground={false} />
            )}
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden w-8 h-8 rounded bg-white/5 flex items-center justify-center text-gray-500 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 px-4 pb-8 space-y-6 overflow-y-auto premium-scrollbar">
          {navGroups.map((group) => (
            <div key={group.title} className="space-y-2">
              <h3
                className={`px-4 text-[10px] font-bold uppercase tracking-wider text-gray-400 ${
                  isDesktopCollapsed ? "lg:hidden" : ""
                }`}
              >
                {group.title}
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center rounded text-[13px] transition-all duration-200 ${
                        isDesktopCollapsed
                          ? "justify-center py-3"
                          : "gap-4 px-4 py-3"
                      } ${
                        isActive
                          ? "bg-gold text-black font-bold"
                          : "text-gray-400 font-medium hover:text-white hover:bg-white/5"
                      }`}
                      onClick={onClose}
                    >
                      <item.icon
                        size={16}
                        className={`shrink-0 ${
                          isActive ? "text-black font-bold" : "text-gray-500"
                        }`}
                      />
                      {!isDesktopCollapsed && item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <div
            className={`bg-white/5 border border-white/5 rounded ${
              isDesktopCollapsed ? "p-2" : "p-5 flex flex-col gap-4"
            }`}
          >
            <div
              className={`flex items-center ${isDesktopCollapsed ? "justify-center" : "gap-3"}`}
            >
              <div className="w-8 h-8 rounded bg-gold/20 flex items-center justify-center text-gold shrink-0">
                <Headphones size={16} />
              </div>
              {!isDesktopCollapsed && (
                <p className="text-xs font-bold text-white">Support Center</p>
              )}
            </div>
            {!isDesktopCollapsed && (
              <>
                <p className="text-xs font-medium text-gray-500 leading-relaxed">
                  Need help with your store? Our elite support team is here
                  24/7.
                </p>
                <Link
                  href="/support"
                  className="flex items-center justify-between group/btn text-xs font-bold text-gold hover:text-white transition-colors"
                >
                  Get Assistance
                  <ArrowUpRight
                    size={14}
                    className="transition-transform group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5"
                  />
                </Link>
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
