"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Loading from "@/app/loading";

export function PageLoaderSimulation({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
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
