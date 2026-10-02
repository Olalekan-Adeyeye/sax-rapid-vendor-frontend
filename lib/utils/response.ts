export function unwrapEnvelope(value: unknown): unknown {
  let current = value;
  for (let i = 0; i < 3; i++) {
    if (
      current &&
      typeof current === "object" &&
      !Array.isArray(current) &&
      "data" in (current as Record<string, unknown>)
    ) {
      current = (current as Record<string, unknown>).data;
    } else {
      break;
    }
  }
  return current;
}

export function pickNumber(
  record: Record<string, unknown>,
  keys: string[],
): number | null {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "number" && Number.isFinite(value)) return value;
  }
  return null;
}
