"use client";

import MonthOnMonthCard from "./MonthOnMonthCard";
import KpiCard from "./KpiCard";
import { ChartType } from "./SalesChartContainer";

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
  selectedChart: ChartType;
  onChartSelect: (chart: ChartType) => void;
};

export default function KpiList({
  salesData,
  selectedChart,
  onChartSelect,
}: KpiListProps) {
  return (
    <div className="flex flex-row justify-between gap-4 flex-wrap">
      <div
        className={`flex-1 min-w-[220px] max-w-[360px] cursor-pointer transition-all duration-200 ${
          selectedChart === "monthly"
            ? "ring-2 ring-blue-500 ring-offset-2"
            : "hover:shadow-lg"
        }`}
        onClick={() => onChartSelect("monthly")}
      >
        <MonthOnMonthCard salesData={salesData} />
      </div>
      <div
        className={`flex-1 min-w-[220px] max-w-[360px] cursor-pointer transition-all duration-200 ${
          selectedChart === "daily"
            ? "ring-2 ring-blue-500 ring-offset-2"
            : "hover:shadow-lg"
        }`}
        onClick={() => onChartSelect("daily")}
      >
        <KpiCard
          title="New Customers"
          description="last 30 days"
          value="1,234"
        />
      </div>
      <div
        className={`flex-1 min-w-[220px] max-w-[360px] cursor-pointer transition-all duration-200 ${
          selectedChart === "daily"
            ? "ring-2 ring-blue-500 ring-offset-2"
            : "hover:shadow-lg"
        }`}
        onClick={() => onChartSelect("daily")}
      >
        <KpiCard
          title="Conversion Rate"
          description="trial → paid"
          value="4.3%"
        />
      </div>
    </div>
  );
}
