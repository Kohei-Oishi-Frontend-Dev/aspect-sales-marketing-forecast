import SalesActualPredMonthlyAreaChartClient from "@/components/ui/SalesActualPredMonthlyAreaChartClient";

type TimeRange = "7d" | "14d" | "30d" | "90d";
export type monthlyPredictionData = {
  date: string | null;
  actual_sales?: number | null;
  predicted_sales?: number | null;
  upper_bound?: number | null;
  lower_bound?: number | null;
};

export default async function SalesActualPredMonthlyAreaChart() {
  const res = await fetch(
    "http://localhost:3000/sales_actuals_pred_month_comparison.json",
    {
      cache: "no-store",
    }
  );


  const json = res.ok ? await res.json() : [];
  const items = json.data;
  const timeRange: TimeRange = "180d";
  return (
    <SalesActualPredMonthlyAreaChartClient
      data={items}
      initialTimeRange={timeRange}
    />
  );
}
