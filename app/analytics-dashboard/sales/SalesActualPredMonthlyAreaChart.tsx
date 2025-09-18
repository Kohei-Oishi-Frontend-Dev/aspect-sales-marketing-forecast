import SalesActualPredMonthlyAreaChartClient from "@/components/ui/SalesActualPredMonthlyAreaChartClient";

type TimeRange = "3m" | "6m" | "12m";
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
  const timeRange: TimeRange = "6m";
  return (
    <SalesActualPredMonthlyAreaChartClient
      data={items}
      initialTimeRange={timeRange}
    />
  );
}
