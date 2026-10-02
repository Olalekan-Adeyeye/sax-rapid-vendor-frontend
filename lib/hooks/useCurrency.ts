"use client";
import { useMemo } from "react";

import { useAuth } from "@/lib/context/AuthContext";
import {
  deriveCurrencyFromPhoneCode,
  formatCurrency,
  getCurrencySymbol,
  getLocaleForCurrency,
} from "@/lib/utils/currency";

export function useCurrency() {
  const { user, vendorProfile } = useAuth();

  const region = useMemo(
    () => deriveCurrencyFromPhoneCode(user?.countryCode),
    [user?.countryCode],
  );

  const vendorCurrency = vendorProfile?.currency?.trim() || undefined;

  const info = useMemo(() => {
    const currency = vendorCurrency || region.currency;
    return {
      currency,
      currencySymbol: vendorCurrency
        ? getCurrencySymbol(vendorCurrency)
        : region.currencySymbol,
    };
  }, [vendorCurrency, region.currency, region.currencySymbol]);

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