import SalesActualPredDailyAreaChartClient from "@/components/ui/SalesActualPredDailyAreaChartClient";
import { join } from "path";
import { readFileSync } from "fs";

type TimeRange = "7d" | "14d" | "30d" | "90d" | "180d" | "360d";
export type dailyPredictionData = {
  date: string | null;
  actual_sales?: number | null;
  predicted_sales?: number | null;
  upper_bound?: number | null;
  lower_bound?: number | null;
};

export default async function SalesActualPredDailyAreaChart() {
  const filePath = join(
    process.cwd(),
    "public",
    "sales_actuals_pred_daily_comparison.json"
  );
  const fileContents = readFileSync(filePath, "utf8");
  const json = JSON.parse(fileContents);
  const items = json?.data ?? [];
  const timeRange: TimeRange = "180d";
  
  return (
    <SalesActualPredDailyAreaChartClient
      data={items}
      initialTimeRange={timeRange}
    />
  );
}
