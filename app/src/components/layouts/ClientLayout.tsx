"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { Toaster } from "@/components/ui/toast";

export function ClientLayout({ children }: PropsWithChildren) {
  const queryClient = new QueryClient();
  return (
    <Toaster>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Toaster>
  );
}
