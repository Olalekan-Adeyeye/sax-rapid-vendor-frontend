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
 *
 * Desktop:
 * - Left sidebar stays fixed (doesn't scroll)
 * - Right panel scrolls independently
 *
 * Mobile:
 * - Entire page scrolls normally
 */
export function AuthPageContainer({
  children,
  leftPanel,
  mainPanel,
}: AuthPageContainerProps) {
  const defaultCopyright = "© 2026 SAX-RAPID · Official Merchant Hub";

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
    <main className="flex h-screen overflow-hidden bg-[#fcfcfc] font-sans antialiased text-black">
      {/* ======================================================
          DESKTOP SIDEBAR (Never Scrolls)
      ====================================================== */}
      <aside
        className={`hidden lg:flex h-full w-96 shrink-0 flex-col border-r border-white/10 bg-black p-12 ${lp.leftPanelClass ?? ""}`}
      >
        <Link
          href="/"
          className="relative z-20 w-fit transition-opacity hover:opacity-80"
        >
          <Logo size="md" withBackground />
        </Link>

        <div className="relative z-10 mt-10">
          <div className="mb-10 h-1.5 w-12 rounded-full bg-gold" />

          <h2
            className={`mb-6 text-5xl font-black leading-[1.1] tracking-tighter text-white ${
              !lp.hideTitleUnderline ? "underline decoration-gold/50" : ""
            }`}
          >
            {lp.title}
          </h2>

          <p className="mb-12 max-w-sm text-base font-medium leading-relaxed text-gray-400">
            {lp.description}
          </p>

          {lp.extraContent}
        </div>

        {/* <p className="mt-auto pt-16 text-[10px] font-black uppercase tracking-widest text-gray-600">
          {footerTextValue}
        </p> */}
      </aside>

      {/* ======================================================
          RIGHT PANEL (Scrollable)
      ====================================================== */}
      <section
        className={`flex min-h-0 flex-1 flex-col overflow-y-auto ${
          mainPanel.gradientClass ||
          "bg-[radial-gradient(circle_at_bottom_left,var(--tw-gradient-stops))] from-gold/10 via-white to-white"
        } ${mainPanel.containerClass ?? ""}`}
      >
        {/* ==========================
            MOBILE HEADER
        ========================== */}
        {(mainPanel.stickyMobileHeader || mainPanel.mobileHeaderExtra) && (
          <div
            className={`w-full lg:hidden ${
              mainPanel.stickyMobileHeader ? "sticky top-0 z-30" : ""
            } ${
              mainPanel.showMobileHeaderBorder ? "border-b border-white/10" : ""
            }`}
          >
            <div className="flex items-center justify-between bg-black px-6 py-3">
              <Link href="/" className="transition-opacity hover:opacity-80">
                <Logo
                  size={mainPanel.mobileLogoSize || "md"}
                  className="items-start"
                  withBackground
                />
              </Link>

              {mainPanel.mobileHeaderExtra}
            </div>
          </div>
        )}

        {/* ==========================
            PAGE CONTENT
        ========================== */}
        <div
          className={` ${
            mainPanel.maxWidthClass
              ? "p-8 lg:px-20 lg:py-12"
              : "flex flex-col items-center justify-center p-8 lg:px-20 lg:py-12"
          }`}
        >
          <div className={`w-full ${mainPanel.maxWidthClass || "max-w-sm"}`}>
            {/* Mobile Logo */}
            {!mainPanel.stickyMobileHeader && !mainPanel.mobileHeaderExtra && (
              <div className="mb-10 lg:hidden">
                <Link
                  href="/"
                  className="inline-block transition-opacity hover:opacity-80"
                >
                  <Logo
                    size={mainPanel.mobileLogoSize || "md"}
                    className="items-start"
                    withBackground
                  />
                </Link>
              </div>
            )}

            {/* Heading */}
            {(mainPanel.heading || mainPanel.subheading) && (
              <div className="mb-10">
                {mainPanel.heading && (
                  <h1 className="mb-2 text-4xl font-black tracking-tighter text-black">
                    {mainPanel.heading}
                  </h1>
                )}

                {mainPanel.subheading && (
                  <p className="text-sm font-medium text-gray-500">
                    {mainPanel.subheading}
                  </p>
                )}
              </div>
            )}

            {/* Main Content */}
            {children}

            {/* Bottom Content */}
            {mainPanel.bottomContent}
          </div>

          {/* Mobile Footer */}
          <p className="mt-auto pt-16 text-center text-[10px] font-black uppercase tracking-widest text-gray-300 lg:hidden">
            {footerTextValue}
          </p>
        </div>
      </section>
    </main>
  );
}
