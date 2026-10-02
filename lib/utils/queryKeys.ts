import type { QueryClient } from "@tanstack/react-query";

const PRODUCT_QUERY_PREFIXES: string[][] = [
  ["product"],
  ["my-products"],
  ["vendor-products"],
  ["vendor-inventory"],
  ["vendor-product-stats"],
  ["inventory-status"],
];

export function invalidateProductQueries(queryClient: QueryClient): void {
  for (const prefix of PRODUCT_QUERY_PREFIXES) {
    void queryClient.invalidateQueries({ queryKey: prefix });
  }
}
