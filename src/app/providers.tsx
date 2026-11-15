"use client";
import { VencimientosProvider } from "@/features/tareas/context/VencimientoContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import type { ReactNode } from "react";

type ProvidersProps = {
  children: ReactNode;
};

export const Providers = ({ children }: ProvidersProps) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <VencimientosProvider>{children}</VencimientosProvider>
    </QueryClientProvider>
  );
};
