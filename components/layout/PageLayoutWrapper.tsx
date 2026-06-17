"use client";
import React, { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

export default function PageLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#fcfcfc] flex font-sans antialiased text-black ">
        {/* Sidebar Component */}
        <Sidebar
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          isDesktopCollapsed={isDesktopCollapsed}
        />

        {/* Main Content Area */}
        <div
          className={`flex-1 flex flex-col transition-all duration-300 min-w-0 max-w-full ${
            isDesktopCollapsed ? "lg:ml-20" : "lg:ml-64"
          }`}
        >
          <Header
            onMenuClick={() => setIsMobileMenuOpen(true)}
            isDesktopCollapsed={isDesktopCollapsed}
            onDesktopCollapseToggle={() =>
              setIsDesktopCollapsed((prev) => !prev)
            }
          />
          <main className="flex-1 p-4 lg:p-10 w-full max-w-full overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
}
