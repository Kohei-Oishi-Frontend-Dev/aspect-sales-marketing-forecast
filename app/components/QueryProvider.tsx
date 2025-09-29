"use client"
import { useState, useEffect } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

type Option = { id: string; label: string };

interface InitialLookups {
  sectors?: Option[];
  services?: Option[];
  regions?: Option[];
}
interface Props {
  children: React.ReactNode;
  initialLookups?: InitialLookups;
}

export default function QueryProvider({ children, initialLookups }: Props) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: Infinity },
        },
      })
  );

  // Only seed cache from server-provided lookups.
  useEffect(() => {
    if (!initialLookups) return;

    if (initialLookups.sectors) {
      queryClient.setQueryData(["sectors"], initialLookups.sectors);
    }
    if (initialLookups.services) {
      queryClient.setQueryData(["services"], initialLookups.services);
    }
    if (initialLookups.regions) {
      queryClient.setQueryData(["regions"], initialLookups.regions);
    }
  }, [queryClient, initialLookups]);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}