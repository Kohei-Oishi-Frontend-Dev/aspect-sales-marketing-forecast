"use client";
import SalesActualPredDailyAreaChartClient from "@/components/ui/SalesActualPredDailyAreaChartClient";
import SalesActualPredMonthlyAreaChartClient from "@/components/ui/SalesActualPredMonthlyAreaChartClient";
import SalesPredictionMonthlyClient from "@/components/ui/SalesPredictionMonthlyClient";
import type { AllChartsData } from "./page";

export type ChartType = "lastMonth" | "nextMonth" | "dailyForecast";

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
      case "lastMonth":
        return (
          <SalesActualPredMonthlyAreaChartClient
            data={allChartsData.salesActualsPredMonthComparison}
            initialTimeRange="12m"
          />
        );
      case "nextMonth":
        return (
          <SalesPredictionMonthlyClient
            data={allChartsData.salesActualsPredMonthComparison}
            initialTimeRange="3m"
          />
        );
      case "dailyForecast":
      default:
        return (
          <SalesActualPredDailyAreaChartClient
            data={allChartsData.salesActualsPredDailyComparison}
            initialTimeRange="7d"
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
