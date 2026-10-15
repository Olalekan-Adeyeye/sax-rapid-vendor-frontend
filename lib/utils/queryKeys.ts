import type { QueryClient } from "@tanstack/react-query";

const PRODUCT_QUERY_PREFIXES: string[][] = [
  ["product"],
  ["my-products"],
  ["vendor-products"],
  ["vendor-product-stats"],
];

export function invalidateProductQueries(queryClient: QueryClient): void {
  for (const prefix of PRODUCT_QUERY_PREFIXES) {
    void queryClient.invalidateQueries({ queryKey: prefix });
  }
}
