import { getCountryByPhoneCode } from "./countries";

export function deriveCurrencyFromPhoneCode(phoneCode?: string | null): {
  currency: string;
  currencySymbol: string;
} {
  if (!phoneCode) return { currency: "NGN", currencySymbol: "₦" };
  const country = getCountryByPhoneCode(phoneCode);
  return country
    ? { currency: country.currency, currencySymbol: country.currencySymbol }
    : { currency: "NGN", currencySymbol: "₦" };
}

const LOCALE_MAP: Record<string, string> = {
  NGN: "en-NG",
  ZAR: "en-ZA",
  USD: "en-US",
  GBP: "en-GB",
  EUR: "de-DE",
  KES: "en-KE",
  GHS: "en-GH",
  XOF: "fr-SN",
  XAF: "fr-CM",
};

export function getLocaleForCurrency(currency: string): string {
  return LOCALE_MAP[currency] || "en-US";
}

export function formatCurrency(
  amount: number,
  currency = "NGN",
): string {
  return new Intl.NumberFormat(getLocaleForCurrency(currency), {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}