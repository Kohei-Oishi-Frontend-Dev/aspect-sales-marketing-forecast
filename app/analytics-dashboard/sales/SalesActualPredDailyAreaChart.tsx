import SalesActualPredDailyAreaChartClient from "@/components/ui/SalesActualPredDailyAreaChartClient";

type ActualPredPoint = { date: string; actual: number; predicted: number };
type TimeRange = "7d" | "14d" | "30d" | "90d";

export default async function SalesActualPredDailyAreaChart() {
  const res = await fetch(
    "http://localhost:3000/sales_actuals_pred_daily_comparison.json",
    {
      cache: "no-store",
    }
  );


  const json = res.ok ? await res.json() : [];
  const items = Array.isArray(json)
    ? json
    : Array.isArray((json as any).data)
    ? (json as any).data
    : [];

  const data: ActualPredPoint[] = items
    .map((d: any) => ({
      date: String(d.date ?? d.Date ?? ""),
      actual_sales: Number(d.actual_sales ?? d.actual_sales ?? 0),
      predicted_sales: Number(d.predicted_sales ?? d.predicted_sales ?? 0),
      upper_bound: Number(d.upper_bound ?? d.upper_bound ?? 0),
      lower_bound: Number(d.lower_bound ?? d.lower_bound ?? 0)
    }))
    .filter((d) => d.date);
  const timeRange: TimeRange = "180d";
  return (
    <SalesActualPredDailyAreaChartClient
      data={data}
      initialTimeRange={timeRange}
    />
  );
}
