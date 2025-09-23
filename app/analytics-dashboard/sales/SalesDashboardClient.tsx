"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation"; 
import SalesForecast from "./SalesForecast";
import type { AllChartsData, salesNarrativeData } from "@/lib/types/sales";
import FilterSelect from "@/components/FilterSelect";
import { Button } from "@/components/ui/Button"; 

type Filters = {
  sector?: string | null;
  region?: string | null;
  service?: string | null;
};

export default function SalesDashboardClient({
  initialAllChartsData,
  initialNarrativeData,
  initialFilters,
}: {
  initialAllChartsData: AllChartsData;
  initialNarrativeData: salesNarrativeData;
  initialFilters?: Filters;
}) {
  // initialize filters from server-provided user preference (may be null)
  const [filters, setFilters] = useState<Filters>(
    initialFilters ?? { sector: null, region: null, service: null }
  );

  // only trigger fetch when user manually changes a filter
  const [userTriggered, setUserTriggered] = useState(false);
  const shouldFetch = userTriggered && Boolean(filters.sector || filters.region || filters.service);

  const query = useQuery({
    queryKey: ["sales", filters],
    queryFn: async () => {
      const res = await fetch("/api/sales_forecast/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filters }),
        cache: "no-store",
      });
      if (!res.ok) throw new Error(await res.text());
      return (await res.json()) as { allChartsData: AllChartsData; narrative?: salesNarrativeData };
    },
    // disabled until user interacts
    enabled: shouldFetch,
    placeholderData: { allChartsData: initialAllChartsData, narrative: initialNarrativeData },
    staleTime: 3000,
  });

  const allChartsData = query.data?.allChartsData ?? initialAllChartsData;
  const narrative = query.data?.narrative ?? initialNarrativeData;

  // options could be moved to a constants file
  const sectorOptions = [
    { value: "food-and-beverage", label: "Food and Beverage" },
    { value: "home-owner", label: "Home Owner" },
    { value: "office", label: "Office" },
  ];
  const regionOptions = [
    { value: "chessington", label: "Chessington" },
    { value: "south-west", label: "South West" },
  ];
  const serviceOptions = [
    { value: "heating-hot-water", label: "Heating & Hot Water" },
    { value: "plastering", label: "Plastering" },
  ];

  const handleChange = (k: keyof Filters, v: string | null) => {
    // mark that user explicitly changed a filter, so query will run
    setUserTriggered(true);
    setFilters((f) => ({ ...f, [k]: v }));
  };

  const router = useRouter(); // { added }

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center py-2">
        <FilterSelect label="Sector" value={filters.sector} onChange={(v) => handleChange("sector", v)} options={sectorOptions} />
        <FilterSelect label="Region" value={filters.region} onChange={(v) => handleChange("region", v)} options={regionOptions} />
        <FilterSelect label="Service" value={filters.service} onChange={(v) => handleChange("service", v)} options={serviceOptions} />

        <div className="ml-4 flex items-center gap-3">
          {/* navigate to settings to edit saved preferences */}
          <Button variant="outline" onClick={() => router.push("/setting/user-preference")}>
            Edit preferences
          </Button>
        </div>
      </div>

      {query.isError && shouldFetch && <div className="mb-4 text-sm text-red-600">{String((query.error as Error)?.message ?? "Failed to fetch data")}</div>}

      <SalesForecast allChartsData={allChartsData} salesNarrativeData={narrative} />
    </div>
  );
}
