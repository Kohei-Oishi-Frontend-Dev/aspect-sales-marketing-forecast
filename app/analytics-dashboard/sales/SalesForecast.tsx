"use client";
import { useState } from "react";
import SalesForecastNarrative from "./SalesForecastNarrative";
import KpiList from "./KpiList";
import SalesChartContainer, { ChartType } from "./SalesChartContainer";
import type { AllChartsData } from "./page";

type SalesForecastProps = {
  allChartsData: AllChartsData;
};

export default function SalesForecast({ allChartsData }: SalesForecastProps) {
  const [selectedChart, setSelectedChart] = useState<ChartType>("lastMonth");

  return (
    <div className="flex flex-col gap-4">
      <KpiList
        salesData={allChartsData.salesMonthOnMonthData}
        nextMonthForecastData={allChartsData.salesActualsPredMonthComparison}
        dailyForecastData={allChartsData.salesActualsPredDailyComparison}
        selectedChart={selectedChart}
        onChartSelect={setSelectedChart}
      />
      <SalesForecastNarrative />
      <SalesChartContainer
        selectedChart={selectedChart}
        allChartsData={allChartsData}
      />
    </div>
  );
}
