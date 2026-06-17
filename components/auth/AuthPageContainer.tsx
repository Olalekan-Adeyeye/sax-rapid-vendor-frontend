"use client";

import React from "react";
import Link from "next/link";
import { Logo } from "@/components/common/Logo";

interface AuthPageContainerProps {
  children: React.ReactNode;
  leftPanel?: {
    title: React.ReactNode;
    description: string;
    extraContent?: React.ReactNode;
    footerText?: string;
    hideTitleUnderline?: boolean;
    leftPanelClass?: string;
  };
  mainPanel: {
    heading?: string;
    subheading?: string;
    bottomContent?: React.ReactNode;
    gradientClass?: string;
    mobileLogoSize?: "sm" | "md" | "lg" | "xl";
    containerClass?: string;
    maxWidthClass?: string;
    stickyMobileHeader?: boolean;
    showMobileHeaderBorder?: boolean;
    mobileHeaderExtra?: React.ReactNode;
  };
}

/**
 * Standardized container for Authentication pages.
 * Handles the responsive two-column layout with decorative elements.
 */
export function AuthPageContainer({
  children,
  leftPanel,
  mainPanel,
}: AuthPageContainerProps) {
  const defaultCopyright = "© 2026 SAX-RAPID · Official Merchant Hub";

  // Support for default visuals if leftPanel is not provided
  const lp = leftPanel || {
    title: (
      <>
        Welcome <br /> Back.
      </>
    ),
    description: "Log in to your account and manage your shop.",
    footerText: defaultCopyright,
    extraContent: null,
    hideTitleUnderline: false,
    leftPanelClass: "",
  };

  const footerTextValue = lp.footerText || defaultCopyright;

  return (
    <div className="min-h-screen bg-[#fcfcfc] flex font-sans antialiased overflow-hidden text-black">
      {/* ── LEFT PANEL (DESKTOP) ─────────────────────────── */}
      <div
        className={`hidden lg:flex flex-col w-120 shrink-0 bg-[#f8f8f8] border-r border-gray-200/50 p-16 relative overflow-hidden ${lp.leftPanelClass || ""}`}
      >
        {/* Decorative Background Blobs */}
        <div className="absolute top-0 right-0 w-100 h-100 bg-gold/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-vibrant-pink/20 rounded-full -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-100 h-100 bg-vibrant-blue/15 rounded-full -ml-40 -mb-40" />
        <div className="absolute top-1/2 -left-20 w-56 h-56 bg-vibrant-purple/20 rounded-full" />
        <div className="absolute top-1/4 -right-10 w-40 h-40 bg-gold/40 rounded-full" />

        <Link
          href="/"
          className="group w-fit relative z-20 transition-opacity hover:opacity-80"
        >
          <Logo size="md" withBackground />
        </Link>

        <div className="relative z-10 mt-10">
          <div className="w-12 h-1.5 bg-gold rounded-full mb-10" />
          <h2
            className={`text-5xl font-black text-black leading-[1.1] tracking-tighter mb-6 ${!lp.hideTitleUnderline ? "underline decoration-gold/50" : ""}`}
          >
            {lp.title}
          </h2>
          <p className="text-gray-600 text-base leading-relaxed max-w-sm mb-12 font-medium">
            {lp.description}
          </p>

          {lp.extraContent}
        </div>

        <p className="mt-auto pt-16 text-[10px] font-black uppercase tracking-widest text-gray-300 relative z-10">
          {footerTextValue}
        </p>
      </div>

      {/* ── MAIN CONTENT ───────────────────────── */}
      <div
        className={`flex-1 flex flex-col ${
          mainPanel.gradientClass ||
          "bg-[radial-gradient(circle_at_bottom_left,var(--tw-gradient-stops))] from-gold/10 via-white to-white"
        } ${mainPanel.maxWidthClass ? "lg:px-20" : "items-center justify-center p-8 lg:px-20 lg:py-12"} ${
          mainPanel.containerClass || ""
        }`}
      >
        {/* Mobile Header */}
        {(mainPanel.stickyMobileHeader || mainPanel.mobileHeaderExtra) && (
          <div
            className={`lg:hidden w-full flex items-center justify-between py-2 px-4 -mx-4 mb-8 bg-white/90 backdrop-blur-md z-30 transition-all ${mainPanel.stickyMobileHeader ? "sticky top-0" : ""} ${mainPanel.showMobileHeaderBorder ? "border-b border-gray-100" : ""}`}
          >
            <Link
              href="/"
              className="transition-opacity hover:opacity-80 inline-block"
            >
              <Logo
                size={mainPanel.mobileLogoSize || "md"}
                className="items-start"
                withBackground
              />
            </Link>
            {mainPanel.mobileHeaderExtra}
          </div>
        )}

        <div className={`w-full ${mainPanel.maxWidthClass || "max-w-sm"}`}>
          {/* Default Mobile Logo (Non-sticky fallback) */}
          {!mainPanel.stickyMobileHeader && !mainPanel.mobileHeaderExtra && (
            <div className="mb-10 lg:hidden text-left">
              <Link
                href="/"
                className="transition-opacity hover:opacity-80 inline-block"
              >
                <Logo
                  size={mainPanel.mobileLogoSize || "md"}
                  className="items-start"
                  withBackground
                />
              </Link>
            </div>
          )}

          {/* Form Header */}
          {(mainPanel.heading || mainPanel.subheading) && (
            <div className="mb-10">
              {mainPanel.heading && (
                <h1 className="text-4xl font-black text-black tracking-tighter mb-2">
                  {mainPanel.heading}
                </h1>
              )}
              {mainPanel.subheading && (
                <p className="text-gray-500 text-sm font-medium">
                  {mainPanel.subheading}
                </p>
              )}
            </div>
          )}

          {/* Form / Page Content */}
          {children}

          {/* Bottom Links (e.g. "Create Account") */}
          {mainPanel.bottomContent}
        </div>

        {/* Mobile Footer */}
        <p className="mt-auto pt-16 text-[10px] font-black uppercase tracking-widest text-gray-300 lg:hidden text-center">
          {footerTextValue || defaultCopyright}
        </p>
      </div>
    </div>
  );
}
