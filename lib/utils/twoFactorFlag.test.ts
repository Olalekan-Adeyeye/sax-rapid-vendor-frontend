import { describe, expect, it } from "vitest";

import {
  TWO_FACTOR_MAX_AGE_SEC,
  createTwoFactorFlag,
  fingerprintToken,
  isTwoFactorFlagValid,
} from "./twoFactorFlag";

const NOW = 1_800_000_000;

describe("fingerprintToken", () => {
  it("is deterministic and differs per token", () => {
    expect(fingerprintToken("abc")).toBe(fingerprintToken("abc"));
    expect(fingerprintToken("abc")).not.toBe(fingerprintToken("abd"));
    expect(fingerprintToken("abc")).toMatch(/^[0-9a-f]{8}$/);
  });
});

describe("createTwoFactorFlag", () => {
  it("returns null without a token", () => {
    expect(createTwoFactorFlag(null, NOW)).toBeNull();
    expect(createTwoFactorFlag("", NOW)).toBeNull();
  });

  it("mints a three-part flag", () => {
    const flag = createTwoFactorFlag("tok", NOW);
    expect(flag?.split(".")).toHaveLength(3);
  });
});

describe("isTwoFactorFlagValid", () => {
  it("accepts a fresh flag for the same token", () => {
    const flag = createTwoFactorFlag("tok-1", NOW);
    expect(isTwoFactorFlagValid(flag, "tok-1", NOW)).toBe(true);
  });

  it("rejects the legacy plain true value", () => {
    expect(isTwoFactorFlagValid("true", "tok-1", NOW)).toBe(false);
  });

  it("rejects flags copied to another session", () => {
    const flag = createTwoFactorFlag("tok-1", NOW);
    expect(isTwoFactorFlagValid(flag, "tok-2", NOW)).toBe(false);
  });

  it("rejects expired flags", () => {
    const flag = createTwoFactorFlag("tok-1", NOW);
    expect(
      isTwoFactorFlagValid(flag, "tok-1", NOW + TWO_FACTOR_MAX_AGE_SEC + 1),
    ).toBe(false);
  });

  it("rejects tampered flags", () => {
    const flag = createTwoFactorFlag("tok-1", NOW)!;
    const [fp, ts, sig] = flag.split(".");
    expect(isTwoFactorFlagValid(`${fp}.${ts}X.${sig}`, "tok-1", NOW)).toBe(
      false,
    );
    expect(
      isTwoFactorFlagValid("deadbeef.deadbeef.deadbeef", "tok-1", NOW),
    ).toBe(false);
  });

  it("rejects empty and nullish inputs", () => {
    expect(isTwoFactorFlagValid(null, "tok-1", NOW)).toBe(false);
    expect(isTwoFactorFlagValid("", "tok-1", NOW)).toBe(false);
    expect(isTwoFactorFlagValid(createTwoFactorFlag("t", NOW), null, NOW)).toBe(
      false,
    );
  });
});
