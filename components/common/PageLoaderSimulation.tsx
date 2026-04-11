"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Loading from "@/app/loading";

export function PageLoaderSimulation({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // List of dashboard-related path prefixes where we want to DISABLE the loader simulation
  const dashboardPaths = [
    "/dashboard",
    "/products",
    "/orders",
    "/inventory",
    "/wallet",
    "/withdrawals",
    "/promotions",
    "/ads",
    "/analytics",
    "/messages",
    "/notifications",
    "/reviews",
    "/store",
    "/subscriptions",
    "/settings",
    "/profile"
  ];

  const isDashboardPage = dashboardPaths.some(path => pathname?.startsWith(path));

  if (isDashboardPage) {
    return <>{children}</>;
  }

  return (
    <SimulationInner key={pathname}>
      {children}
    </SimulationInner>
  );
}

function SimulationInner({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Reset timer on every mount
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading && <Loading />}
      <div className={loading ? "opacity-0 invisible h-0 overflow-hidden" : "opacity-100 visible transition-opacity duration-1000"}>
        {children}
      </div>
    </>
  );
}
