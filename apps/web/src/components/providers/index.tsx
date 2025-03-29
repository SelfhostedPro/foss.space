"use client";
import { AuthQueryProvider } from "@daveyplate/better-auth-tanstack";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useState } from "react";

export function Providers({ children }: { children: ReactNode }) {
  // Create a new QueryClient instance for each component mount
  // to prevent sharing data between users and tests
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <AuthQueryProvider>
        {children}
      </AuthQueryProvider>
    </QueryClientProvider>
  );
}
