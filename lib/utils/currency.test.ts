import { describe, expect, it } from "vitest";

import { formatCurrency, resolveCurrency } from "./currency";

describe("resolveCurrency", () => {
  it("prefers the server currency when present", () => {
    expect(resolveCurrency("ZAR", "NGN")).toBe("ZAR");
  });

  it("falls back to the next candidate when server currency is missing", () => {
    expect(resolveCurrency(null, "KES")).toBe("KES");
    expect(resolveCurrency(undefined, "KES")).toBe("KES");
    expect(resolveCurrency("", "KES")).toBe("KES");
    expect(resolveCurrency("   ", "KES")).toBe("KES");
  });

  it("trims whitespace from the winning candidate", () => {
    expect(resolveCurrency(" KES ", "NGN")).toBe("KES");
  });

  it("defaults to NGN when every candidate is empty", () => {
    expect(resolveCurrency()).toBe("NGN");
    expect(resolveCurrency(null, undefined, "")).toBe("NGN");
  });
});

describe("formatCurrency", () => {
  it("groups digits comma-thousands and dot-decimal for every currency", () => {
    expect(formatCurrency(34793.75, "NGN")).toBe("₦34,793.75");
    expect(formatCurrency(34793.75, "ZAR")).toBe("R34,793.75");
    expect(formatCurrency(34793.75, "USD")).toBe("$34,793.75");
    expect(formatCurrency(34793.75, "GBP")).toBe("£34,793.75");
    expect(formatCurrency(34793.75, "EUR")).toBe("€34,793.75");
    expect(formatCurrency(34793.75, "KES")).toBe("KSh34,793.75");
    expect(formatCurrency(34793.75, "GHS")).toBe("GH₵34,793.75");
    expect(formatCurrency(34793.75, "XOF")).toBe("CFA34,793.75");
    expect(formatCurrency(34793.75, "XAF")).toBe("FCFA34,793.75");
  });

  it("omits decimals for whole amounts and keeps the sign in front", () => {
    expect(formatCurrency(34793, "NGN")).toBe("₦34,793");
    expect(formatCurrency(-1500.5, "ZAR")).toBe("-R1,500.5");
  });

  it("falls back to NGN for blank currency codes", () => {
    expect(formatCurrency(100)).toBe("₦100");
    expect(formatCurrency(100, "  ")).toBe("₦100");
  });
});
