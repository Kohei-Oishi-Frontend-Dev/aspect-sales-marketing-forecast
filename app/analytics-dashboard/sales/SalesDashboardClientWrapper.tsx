"use client";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SalesDashboardClient from "./SalesDashboardClient";
import type { AllChartsData, salesNarrativeData } from "@/lib/types/sales";

type Option = { id: string; label: string };
type Filters = {
  sector?: string | null;
  region?: string | null;
  service?: string | null;
};

interface Props {
  initialAllChartsData: AllChartsData;
  initialNarrativeData: salesNarrativeData;
  initialFilters?: Filters;
  sectorOptions?: Option[];
  regionOptions?: Option[];
  serviceOptions?: Option[];
}

export default function SalesDashboardClientWrapper(props: Props) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: Infinity },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <SalesDashboardClient {...props} />
    </QueryClientProvider>
  );
}