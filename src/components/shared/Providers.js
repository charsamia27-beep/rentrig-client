"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 30_000, refetchOnWindowFocus: false, retry: 1 },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3500,
          style: {
            borderRadius: "999px",
            background: "var(--color-secondary)",
            color: "var(--color-secondary-content)",
            fontWeight: 600,
            fontSize: 14,
          },
          success: { iconTheme: { primary: "var(--color-primary)", secondary: "var(--color-secondary)" } },
        }}
      />
    </QueryClientProvider>
  );
}
