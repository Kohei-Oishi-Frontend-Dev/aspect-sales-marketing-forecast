"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import SalesForecast from "./SalesForecast";
import type { AllChartsData, salesNarrativeData } from "./page";

type Filters = {
  sector?: string | null;
  region?: string | null;
  service?: string | null;
};

export default function SalesDashboardClient({
  initialAllChartsData,
  initialNarrativeData,
}: {
  initialAllChartsData: AllChartsData;
  initialNarrativeData?: salesNarrativeData;
}) {
  const [filters, setFilters] = useState<Filters>({
    sector: null,
    region: null,
    service: null,
  });

  const shouldFetch = Boolean(
    filters.sector || filters.region || filters.service
  );

  const query = useQuery({
    queryKey: ["sales", "filters", filters],
    queryFn: async (): Promise<{
      allChartsData: AllChartsData;
      narrative?: salesNarrativeData;
    }> => {
      const res = await fetch("/api/sales_forecast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filters }),
        cache: "no-store",
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `${res.status} ${res.statusText}`);
      }
      return (await res.json()) as {
        allChartsData: AllChartsData;
        narrative?: salesNarrativeData;
      };
    },
    enabled: shouldFetch, // only run when at least one filter is selected
    initialData: {
      allChartsData: initialAllChartsData,
      narrative: initialNarrativeData,
    },
    keepPreviousData: true,
  });

  const allChartsData = query.data?.allChartsData ?? initialAllChartsData;
  const narrative = query.data?.narrative ?? initialNarrativeData;

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="flex items-center gap-2">
          <span className="text-sm">Sector</span>
          <select
            value={filters.sector ?? ""}
            onChange={(e) =>
              setFilters((f) => ({ ...f, sector: e.target.value || null }))
            }
            className="ml-2 rounded border px-2 py-1"
          >
            <option value="">All</option>
            <option value="food-and-beverage">Food and Beverage</option>
            <option value="home-owner">Home Owner</option>
            <option value="office">Office</option>
          </select>
        </label>

        <label className="flex items-center gap-2">
          <span className="text-sm">Region</span>
          <select
            value={filters.region ?? ""}
            onChange={(e) =>
              setFilters((f) => ({ ...f, region: e.target.value || null }))
            }
            className="ml-2 rounded border px-2 py-1"
          >
            <option value="">All</option>
            <option value="chessington">Chessington</option>
            <option value="south-west">South West</option>
          </select>
        </label>

        <label className="flex items-center gap-2">
          <span className="text-sm">Service</span>
          <select
            value={filters.service ?? ""}
            onChange={(e) =>
              setFilters((f) => ({ ...f, service: e.target.value || null }))
            }
            className="ml-2 rounded border px-2 py-1"
          >
            <option value="">All</option>
            <option value="heating-hot-water">Heating & Hot Water</option>
            <option value="plastering">Plastering</option>
          </select>
        </label>

        <div className="ml-auto text-sm text-gray-600">
          {!shouldFetch
            ? "Select filters to load"
            : query.isFetching
            ? "Loading…"
            : query.isError
            ? "Failed to load"
            : "Up to date"}
        </div>
      </div>

      {query.isError && shouldFetch && (
        <div className="mb-4 text-sm text-red-600">
          {String((query.error as Error)?.message ?? "Failed to fetch data")}
        </div>
      )}

      <SalesForecast
        allChartsData={allChartsData}
        salesNarrativeData={narrative}
      />
    </div>
  );
}
