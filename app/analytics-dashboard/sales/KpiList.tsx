"use client";

import MonthOnMonthCard from "./MonthOnMonthCard";
import { ChartType } from "./SalesChartContainer";
import { monthlyPredictionData } from "@/lib/types/sales";
import { dailyPredictionData } from "@/lib/types/sales";
import NextMonthSalesPredictionCard from "./NextMonthSalesPredictionCard";
import DailyPredictionCard from "./DailyPredictionCard";

export type SalesMonthOnMonth = {
  success?: boolean;
  metric?: string;
  current_period?: {
    value?: number;
    period?: string;
    direction?: string | null;
    date?: string | null;
    label?: string;
  };
  comparison_period?: {
    value?: number;
    period?: string;
    direction?: string | null;
    date?: string | null;
    label?: string;
  };
  change?: {
    absolute?: number | null;
    percentage?: number | null;
    direction?: string | null;
  };
  trend?: unknown;
  filters?: Record<string, unknown>;
  execution_timestamp?: string;
};

type KpiListProps = {
  salesData: SalesMonthOnMonth;
  nextMonthForecastData?: monthlyPredictionData[];
  dailyForecastData?: dailyPredictionData[];
  selectedChart: ChartType;
  onChartSelect: (chart: ChartType) => void;
};

export default function KpiList({
  salesData,
  nextMonthForecastData,
  dailyForecastData,
  selectedChart,
  onChartSelect,
}: KpiListProps) {
  console.log("props received were ", nextMonthForecastData, dailyForecastData);
  return (
    <div className="flex flex-row justify-between gap-4 flex-wrap">
      <div
        className={`flex-1 min-w-[220px] max-w-[360px] cursor-pointer transition-all duration-200 ${
          selectedChart === "dailyForecast"
            ? "ring-2 ring-blue-500 ring-offset-2"
            : "hover:shadow-lg"
        }`}
        onClick={() => onChartSelect("dailyForecast")}
      >
        <DailyPredictionCard dailyForecastData={dailyForecastData} />
      </div>
      <div
        className={`flex-1 min-w-[220px] max-w-[360px] cursor-pointer transition-all duration-200 ${
          selectedChart === "nextMonth"
            ? "ring-2 ring-blue-500 ring-offset-2"
            : "hover:shadow-lg"
        }`}
        onClick={() => onChartSelect("nextMonth")}
      >
        <NextMonthSalesPredictionCard
          nextMonthForecastData={nextMonthForecastData}
        />
      </div>
      <div
        className={`flex-1 min-w-[220px] max-w-[360px] cursor-pointer transition-all duration-200 ${
          selectedChart === "lastMonth"
            ? "ring-2 ring-blue-500 ring-offset-2"
            : "hover:shadow-lg"
        }`}
        onClick={() => onChartSelect("lastMonth")}
      >
        <MonthOnMonthCard salesData={salesData} />
      </div>
    </div>
  );
}
