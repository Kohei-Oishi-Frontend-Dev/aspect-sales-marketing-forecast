"use client";
import React, { useState } from "react";
import SalesForecastNarrative from "./SalesForecastNarrative";
import KpiList from "./KpiList";
import SalesChartContainer, { ChartType } from "./SalesChartContainer";
import type { AllChartsData, salesNarrativeData } from "@/lib/types/sales";

type SalesForecastProps = {
  allChartsData: AllChartsData;
  salesNarrativeData: salesNarrativeData;
};

export default function SalesForecast({ allChartsData, salesNarrativeData }: SalesForecastProps) {
  const [selectedChart, setSelectedChart] = useState<ChartType>("dailyForecast");

  // Defensive: if essential pieces are missing or empty, render a loading skeleton
  const isMissing =
    !allChartsData ||
    !Array.isArray(allChartsData.salesPredictionData) ||
    !Array.isArray(allChartsData.salesActualsPredMonthComparison) ||
    !Array.isArray(allChartsData.salesActualsPredDailyComparison);

  if (isMissing) {
    return (
      <div className="flex flex-col gap-4 animate-pulse">
        <div className="h-48 bg-gray-100 rounded-md" />
        <div className="h-24 bg-gray-100 rounded-md" />
        <div className="h-72 bg-gray-100 rounded-md" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <KpiList
        salesData={allChartsData.salesMonthOnMonthData}
        nextMonthForecastData={allChartsData.salesActualsPredMonthComparison}
        dailyForecastData={allChartsData.salesActualsPredDailyComparison}
        selectedChart={selectedChart}
        onChartSelect={setSelectedChart}
      />
      <SalesForecastNarrative salesNarrativeData={salesNarrativeData} />
      <SalesChartContainer selectedChart={selectedChart} allChartsData={allChartsData} />
    </div>
  );
}
