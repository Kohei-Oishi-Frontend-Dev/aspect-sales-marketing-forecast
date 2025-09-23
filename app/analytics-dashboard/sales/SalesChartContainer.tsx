"use client";
import SalesPredictionDailyChart from "@/components/ui/SalesPredictionDailyChart";
import LastMonthSalesChart from "@/components/ui/LastMonthSalesChart";
import NextMonthSalesPredictionChart from "@/components/ui/NextMonthSalesPredictionChart";
import type { AllChartsData } from "@/lib/types/sales";

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
          <LastMonthSalesChart
            data={allChartsData.salesActualsPredMonthComparison}
            initialTimeRange="3m"
          />
        );
      case "nextMonth":
        return (
          <NextMonthSalesPredictionChart
            data={allChartsData.salesActualsPredMonthComparison}
            initialTimeRange="3m"
          />
        );
      case "dailyForecast":
      default:
        return (
          <SalesPredictionDailyChart
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
