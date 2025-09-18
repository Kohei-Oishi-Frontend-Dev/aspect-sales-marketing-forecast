import SalesPredictionAreaChartClient from "@/components/ui/SalesPredictionAreaChartClient";
import { join } from "path";
import { readFileSync } from "fs";

export type SalesPrediction = {
  date: string;
  pred_sale: number;
  upper_bound: number;
  lower_bound: number;
};

type TimeRange = "7d" | "14d" | "30d" | "90d";

export default async function SalesPredictionAreaChart() {
    const filePath = join(process.cwd(), "public", "predicted_sales_data.json");
    const fileContents = readFileSync(filePath, "utf8");
    const data = JSON.parse(fileContents);
  const timeRange: TimeRange = "90d";
  return (
    <SalesPredictionAreaChartClient data={data} initialTimeRange={timeRange} />
  );
}
