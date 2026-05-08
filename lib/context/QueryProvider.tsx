"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
	// Create the client once per component mount (not module-level, so SSR is safe)
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 0,
						gcTime: 0,
						retry: 1,
						refetchOnMount: true,
						refetchOnReconnect: true,
						refetchOnWindowFocus: true,
					},
				},
			}),
	);

	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
}
