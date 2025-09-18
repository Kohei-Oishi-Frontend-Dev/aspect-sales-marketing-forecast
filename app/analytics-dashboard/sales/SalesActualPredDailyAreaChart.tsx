import SalesActualPredDailyAreaChartClient from "@/components/ui/SalesActualPredDailyAreaChartClient";

type TimeRange = "7d" | "14d" | "30d" | "90d";
export type dailyPredictionData = {
  date: string | null;
  actual_sales?: number | null;
  predicted_sales?: number | null;
  upper_bound?: number | null;
  lower_bound?: number | null;
};

export default async function SalesActualPredDailyAreaChart() {
  const res = await fetch(
    "http://localhost:3000/sales_actuals_pred_daily_comparison.json",
    {
      cache: "no-store",
    }
  );

  const json = res.ok ? await res.json() : null;
  const items = json?.data ?? [];
  const timeRange: TimeRange = "180d";
  
  return (
    <SalesActualPredDailyAreaChartClient
      data={items}
      initialTimeRange={timeRange}
    />
  );
}
