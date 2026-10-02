import { describe, expect, it } from "vitest";

import { resolveCurrency } from "./currency";

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
