import SalesActualPredMonthlyAreaChartClient from "@/components/ui/SalesActualPredMonthlyAreaChartClient";
import { join } from "path";
import { readFileSync } from "fs";

type TimeRange = "3m" | "6m" | "12m";
export type monthlyPredictionData = {
  date: string | null;
  actual_sales?: number | null;
  predicted_sales?: number | null;
  upper_bound?: number | null;
  lower_bound?: number | null;
};

export default async function SalesActualPredMonthlyAreaChart() {
  const filePath = join(
    process.cwd(),
    "public",
    "sales_actuals_pred_month_comparison.json"
  );
  const fileContents = readFileSync(filePath, "utf8");
  const json = JSON.parse(fileContents);
  const items = json.data;
  const timeRange: TimeRange = "6m";
  return (
    <SalesActualPredMonthlyAreaChartClient
      data={items}
      initialTimeRange={timeRange}
    />
  );
}
