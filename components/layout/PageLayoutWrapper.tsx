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

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#fcfcfc] flex font-sans antialiased text-black ">
        {/* Sidebar Component */}
        <Sidebar
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col lg:ml-64 transition-all duration-300 min-w-0 max-w-full ">
          <Header onMenuClick={() => setIsMobileMenuOpen(true)} />
          <main className="flex-1 p-4 lg:p-10 w-full max-w-full overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
}
