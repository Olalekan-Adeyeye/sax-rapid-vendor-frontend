"use client";
import { useMemo } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import {
  deriveCurrencyFromPhoneCode,
  formatCurrency,
  getLocaleForCurrency,
} from "@/lib/utils/currency";

export function useCurrency() {
  const { user } = useAuth();

  const info = useMemo(
    () => deriveCurrencyFromPhoneCode(user?.countryCode),
    [user?.countryCode],
  );

  const locale = useMemo(
    () => getLocaleForCurrency(info.currency),
    [info.currency],
  );

  return {
    currency: info.currency,
    currencySymbol: info.currencySymbol,
    format: (amount: number) => formatCurrency(amount, info.currency),
    formatNumber: (amount: number) =>
      new Intl.NumberFormat(locale, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(amount),
    locale,
  };
}