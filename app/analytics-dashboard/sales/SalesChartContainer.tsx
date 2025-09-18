"use client";

import SalesPredictionAreaChartClient from "@/components/ui/SalesPredictionAreaChartClient";
import SalesActualPredDailyAreaChartClient from "@/components/ui/SalesActualPredDailyAreaChartClient";
import SalesActualPredMonthlyAreaChartClient from "@/components/ui/SalesActualPredMonthlyAreaChartClient";
import type { AllChartsData } from "./page";

export type ChartType = "prediction" | "daily" | "monthly";

type SalesChartContainerProps = {
  selectedChart: ChartType;
  allChartsData: AllChartsData;
};

export default function SalesChartContainer({
  selectedChart,
  allChartsData,
}: SalesChartContainerProps) {
  const renderChart = () => {
    switch (selectedChart) {
      case "monthly":
        return (
          <SalesActualPredMonthlyAreaChartClient
            data={allChartsData.salesActualsPredMonthComparison}
            initialTimeRange="12m"
          />
        );
      case "daily":
        return (
          <SalesActualPredDailyAreaChartClient
            data={allChartsData.salesActualsPredDailyComparison}
            initialTimeRange="180d"
          />
        );
      case "prediction":
      default:
        return (
          <SalesPredictionAreaChartClient
            data={allChartsData.salesPredictionData}
            initialTimeRange="90d"
          />
        );
    }
  };

  return (
    <div className="w-full">
      {renderChart()}
    </div>
  );
}
