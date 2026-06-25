"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { tokenStorage } from "@/lib/api/apiClient";
import {
  Menu,
  Search,
  ChevronDown,
  User,
  Settings,
  CreditCard,
  LogOut,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
  isDesktopCollapsed?: boolean;
  onDesktopCollapseToggle?: () => void;
}

export function Header({
  onMenuClick,
  isDesktopCollapsed = false,
  onDesktopCollapseToggle,
}: HeaderProps) {
  const router = useRouter();
  const { user, setUser, setTwoFactorVerified } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    tokenStorage.clearTokens();
    setTwoFactorVerified(false);
    setUser(null);
    router.push("/login");
  };

  const menuItems = [
    { label: "My Profile", icon: User, href: "/profile" },
    { label: "Account Settings", icon: Settings, href: "/settings" },
    { label: "Logout", icon: LogOut, action: handleLogout, variant: "danger" },
  ];

  return (
    <header className="h-20 border-b border-gray-100 px-4 lg:px-8 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-100 text-black w-full">
      <div className="flex items-center gap-2 lg:gap-4 flex-1 min-w-0 max-w-xl">
        {/* Mobile hamburger */}
        <button
          onClick={onMenuClick}
          className="lg:hidden w-10 h-10 rounded bg-gray-50 flex items-center justify-center text-black hover:bg-gray-100 transition-colors shrink-0"
        >
          <Menu size={20} />
        </button>

        {/* Desktop collapse toggle */}
        <button
          onClick={onDesktopCollapseToggle}
          className="hidden lg:flex w-10 h-10 rounded bg-gray-50 items-center justify-center text-black hover:bg-gray-100 transition-colors shrink-0"
          aria-label={
            isDesktopCollapsed ? "Expand sidebar" : "Collapse sidebar"
          }
        >
          {isDesktopCollapsed ? (
            <PanelLeft size={20} />
          ) : (
            <PanelLeftClose size={20} />
          )}
        </button>

        {/* Search Bar */}
        {/* <div className="relative flex-1 min-w-0 group">
          <Search
            size={16}
            className="absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gold transition-colors"
          />
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-gray-50 border border-gray-100 rounded pl-9 lg:pl-11 pr-3 lg:pr-4 py-2 lg:py-2.5 text-xs text-black placeholder-gray-400 outline-none focus:bg-white focus:border-gold/50 transition-all font-medium truncate"
          />
        </div> */}
      </div>

      <div
        className="flex items-center gap-2 lg:gap-4 ml-2 lg:ml-4 relative shrink-0"
        ref={dropdownRef}
      >
        {/* User Avatar Dropdown Toggle */}
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`flex items-center gap-2 lg:gap-3 p-1 rounded transition-all group ${
            isDropdownOpen ? "bg-gray-50" : "hover:bg-gray-50"
          }`}
        >
          <div className="w-8 h-8 lg:w-9 lg:h-9 rounded bg-gold/20 border border-gold/20 flex items-center justify-center overflow-hidden shrink-0 relative">
            {user?.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt={user.firstName}
                fill
                className="object-cover"
              />
            ) : (
              <User size={18} className="text-gold" />
            )}
          </div>
          <div className="hidden sm:flex flex-col items-start leading-none gap-1 min-w-0">
            <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-black truncate max-w-20 lg:max-w-none">
              {user?.firstName || "Welcome"} {user?.lastName || ""}
            </span>
            <span className="text-[7px] lg:text-[8px] font-bold uppercase tracking-widest text-gray-400 truncate">
              {user?.role || "Account Member"}
            </span>
          </div>
          <ChevronDown
            size={12}
            className={`text-gray-400 group-hover:text-gold transition-all shrink-0 ${
              isDropdownOpen ? "rotate-180 text-gold" : ""
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-100 rounded p-1.5 z-50">
            <div className="px-3 py-2 border-b border-gray-50 mb-1.5">
              <p className="text-[8px] font-black uppercase tracking-widest text-gray-400">
                Signed in as
              </p>
              <p className="text-[10px] font-bold text-black truncate">
                {user?.email || "guest@example.com"}
              </p>
            </div>
            <div className="space-y-0.5">
              {menuItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    setIsDropdownOpen(false);
                    if ("action" in item && item.action) {
                      item.action();
                    } else if ("href" in item && item.href) {
                      router.push(item.href);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-[10px] font-black uppercase tracking-widest transition-all ${
                    item.variant === "danger"
                      ? "text-red-500 hover:bg-red-50"
                      : "text-gray-600 hover:text-black hover:bg-gray-50"
                  }`}
                >
                  <item.icon size={14} />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
