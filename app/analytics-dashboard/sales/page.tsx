import { join } from "path";
import { readFileSync } from "fs";
import SalesForecast from "./SalesForecast";
import type { SalesMonthOnMonth } from "./KpiList";
import type { SalesPrediction } from "./SalesPredictionAreaChart";
import type { dailyPredictionData } from "./SalesActualPredDailyAreaChart";
import type { monthlyPredictionData } from "./SalesActualPredMonthlyAreaChart";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export type AllChartsData = {
  salesMonthOnMonthData: SalesMonthOnMonth;
  salesPredictionData: SalesPrediction[];
  salesActualsPredMonthComparison: monthlyPredictionData[];
  salesActualsPredDailyComparison: dailyPredictionData[];
};

export default async function SalesPage() {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      redirect("/login");
    }
  // Fetch sales month-on-month data
  const salesMonthOnMonthFilePath = join(
    process.cwd(),
    "public",
    "sales_month_on_month.json"
  );
  const salesMonthOnMonthFileContents = readFileSync(
    salesMonthOnMonthFilePath,
    "utf8"
  );
  const salesMonthOnMonthData: SalesMonthOnMonth = JSON.parse(salesMonthOnMonthFileContents);

  // Fetch prediction data
  const salesPredictionFilePath = join(
    process.cwd(),
    "public",
    "predicted_sales_data.json"
  );
  const salesPredictionFileContents = readFileSync(salesPredictionFilePath, "utf8");
  const salesPredictionData: SalesPrediction[] = JSON.parse(
    salesPredictionFileContents
  );

  const salesActualPredMonthComparisonFilePath = join(
    process.cwd(),
    "public",
    "sales_actuals_pred_month_comparison.json"
  );
  const salesActualPredMonthComparisonFileContents = readFileSync(salesActualPredMonthComparisonFilePath, "utf8");
  const salesActualsPredMonthComparison: dailyPredictionData[] = JSON.parse(salesActualPredMonthComparisonFileContents).data;

  const salesActualPredDailyComparisonFilePath = join(
    process.cwd(),
    "public",
    "sales_actuals_pred_daily_comparison.json"
  );
  const salesActualPredDailyComparisonFileContents = readFileSync(salesActualPredDailyComparisonFilePath, "utf8");
  const salesActualsPredDailyComparison: monthlyPredictionData[] = JSON.parse(salesActualPredDailyComparisonFileContents).data;

  const allChartsData: AllChartsData = {
    salesMonthOnMonthData: salesMonthOnMonthData,
    salesPredictionData: salesPredictionData,
    salesActualsPredMonthComparison: salesActualsPredMonthComparison,
    salesActualsPredDailyComparison: salesActualsPredDailyComparison,
  };

  return (
    <SalesForecast allChartsData={allChartsData} />
  );
}
