import SalesPredictionAreaChartClient from "@/components/ui/SalesPredictionAreaChartClient";

export type PredPoint = {
  date: string;
  pred_sale: number;
  upper_bound: number;
  lower_bound: number;
};

type TimeRange = "7d" | "14d" | "30d" | "90d";

export default async function SalesPredictionAreaChart() {
  const res = await fetch("http://localhost:3000/predicted_sales_data.json", {
    cache: "no-store",
  });
  const data: PredPoint[] = await res.json();
  // Default time range
  const timeRange: TimeRange = "90d";

  return (
    <SalesPredictionAreaChartClient data={data} initialTimeRange={timeRange} />
  );
}
