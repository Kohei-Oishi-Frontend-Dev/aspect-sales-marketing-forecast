"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import SalesForecast from "./SalesForecast";
import type { AllChartsData, salesNarrativeData } from "@/lib/types/sales";
import FilterSelect from "@/components/FilterSelect";
import { Button } from "@/components/ui/Button";
import { updateSalesData } from "@/lib/actions/sales.actions";

type Filters = {
  sector?: string | null;
  region?: string | null;
  service?: string | null;
};

type Option = { id: string; label: string };
type QueryData = {
  allChartsData: AllChartsData;
  narrative: salesNarrativeData;
};

export default function SalesDashboardClient({
  initialAllChartsData,
  initialNarrativeData,
  initialFilters,
  sectorOptions = [],
  regionOptions = [],
  serviceOptions = [],
}: {
  initialAllChartsData: AllChartsData;
  initialNarrativeData: salesNarrativeData;
  initialFilters?: Filters;
  sectorOptions?: Option[];
  regionOptions?: Option[];
  serviceOptions?: Option[];
}) {
  // initialize filters from server-provided user preference (may be null)
  const [filters, setFilters] = useState<Filters>(
    initialFilters ?? { sector: null, region: null, service: null }
  );

  // adapt Option shape { id,label } -> FilterSelect expects { value,label }
  const sectorSelectOptions = sectorOptions.map((s) => ({ value: s.id, label: s.label }));
  const regionSelectOptions = regionOptions.map((r) => ({ value: r.id, label: r.label }));
  const serviceSelectOptions = serviceOptions.map((s) => ({ value: s.id, label: s.label }));

  // only trigger fetch when user manually changes a filter
  const [userTriggered, setUserTriggered] = useState(false);
  const shouldFetch = userTriggered && Boolean(filters.sector || filters.region || filters.service);

  const queryOptions = {
    queryKey: ["sales", filters.sector ?? null, filters.region ?? null, filters.service ?? null],
    queryFn: async () => {
      console.log("useQuery.serverAction: queryKey values ->", { filters });
      // Call server action directly instead of HTTP request
      return await updateSalesData({
        sector: filters.sector,
        region: filters.region,
        service: filters.service,
      });
    },
    // disabled until user interacts
    enabled: shouldFetch,
    placeholderData: { allChartsData: initialAllChartsData, narrative: initialNarrativeData },
    keepPreviousData: true,
    staleTime: 3000,
  } as any;

  const query = useQuery(queryOptions);

  // cast query.data to the expected shape and use that to avoid '{}' typing issues
  const queryData = (query.data ?? undefined) as QueryData | undefined;
  const allChartsData = queryData?.allChartsData ?? initialAllChartsData;
  const narrative = queryData?.narrative ?? initialNarrativeData;

  const handleChange = (k: keyof Filters, v: string | null) => {
    // mark that user explicitly changed a filter, so query will run
    setUserTriggered(true);
    setFilters((f) => ({ ...f, [k]: v }));
  };

  const router = useRouter(); // { added }

  return (
    <div>
      <div className="w-full mb-4 flex flex-col gap-3 sm:flex-row sm:items-center py-2">
        <div className="w-full flex flex-col md:flex-row md:items-center gap-2 flex-wrap">
          <FilterSelect label="Sector" value={filters.sector} onChange={(v) => handleChange("sector", v)} options={sectorSelectOptions} />
          <FilterSelect label="Region" value={filters.region} onChange={(v) => handleChange("region", v)} options={regionSelectOptions} />
          <FilterSelect label="Service" value={filters.service} onChange={(v) => handleChange("service", v)} options={serviceSelectOptions} />
        </div>
        <div className="ml-4 flex items-center gap-3">
          {/* navigate to settings to edit saved preferences */}
          <Button variant="outline" onClick={() => router.push("/setting/user-preference")}>
            Edit preferences
          </Button>

          {/* status area: show fetching indicator when refetching */}
          <div className="ml-4 flex items-center gap-3">
            {query.isFetching ? (
              <div className="flex items-center gap-2 text-sm text-blue-600" aria-live="polite">
                {/* simple inline spinner */}
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                <span>Refreshing…</span>
              </div>
            ) : (
              <div className="text-sm text-gray-600">
                {!userTriggered
                  ? "Using saved preferences"
                  : !shouldFetch
                  ? "Select filters to load"
                  : query.isError
                  ? "Failed to load"
                  : "Up to date"}
              </div>
            )}
          </div>
        </div>
      </div>

      {query.isError && shouldFetch && <div className="mb-4 text-sm text-red-600">{String((query.error as Error)?.message ?? "Failed to fetch data")}</div>}

      <SalesForecast allChartsData={allChartsData} salesNarrativeData={narrative} />
    </div>
  );
}
