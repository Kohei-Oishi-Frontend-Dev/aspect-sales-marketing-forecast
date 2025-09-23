import { join } from "path";
import { readFileSync } from "fs";
import type {
  AllChartsData,
  salesNarrativeData,
  monthlyPredictionData,
  dailyPredictionData,
  SalesPrediction,
  SalesMonthOnMonth,
} from "./types/sales";

const baseURL = process.env.API_BASE_URL ?? "";

export async function getInitialAllChartsData(): Promise<{
  allChartsData: AllChartsData;
  narrative: salesNarrativeData;
}> {
  const base = process.cwd();

  const salesMonthOnMonth = JSON.parse(
    readFileSync(join(base, "public", "sales_month_on_month.json"), "utf8")
  ) as SalesMonthOnMonth;

  const salesPredictionData = JSON.parse(
    readFileSync(join(base, "public", "predicted_sales_data.json"), "utf8")
  ) as SalesPrediction[];

  const salesActualsPredMonthComparison = JSON.parse(
    readFileSync(join(base, "public", "sales_actuals_pred_month_comparison.json"), "utf8")
  ).data as monthlyPredictionData[];

  const salesActualsPredDailyComparison = JSON.parse(
    readFileSync(join(base, "public", "sales_actuals_pred_daily_comparison.json"), "utf8")
  ).data as dailyPredictionData[];

  const narrative = JSON.parse(
    readFileSync(join(base, "public", "sales_narrative.json"), "utf8")
  ) as salesNarrativeData;

  return {
    allChartsData: {
      salesMonthOnMonthData: salesMonthOnMonth,
      salesPredictionData,
      salesActualsPredMonthComparison,
      salesActualsPredDailyComparison,
    },
    narrative,
  };
}

// minimal filter function — adapt to real data shape or DB queries
export async function getFilteredChartsData(
  filters: { sector?: string | null; region?: string | null; service?: string | null },
  baseData?: { allChartsData: AllChartsData; narrative: salesNarrativeData }
) {
  // Prefer calling external API for filtered results.
  // The external service is expected to return the same shape:
  // { allChartsData: AllChartsData, narrative?: salesNarrativeData }  
    try {
      const extRes = await fetch(baseURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filters }),
        cache: "no-store",
      });

      if (extRes.ok) {
        const payload = (await extRes.json()) as {
          allChartsData: AllChartsData;
          narrative?: salesNarrativeData;
        };
        // ensure narrative exists in response shape
        return {
          allChartsData: payload.allChartsData,
          narrative: payload.narrative ?? (baseData?.narrative ?? (await getInitialAllChartsData()).narrative),
        };
      }

      // log and fall through to local filtering
      const txt = await extRes.text().catch(() => "");
      console.error("External sales API returned non-ok:", extRes.status, txt);
    } catch (err) {
      console.error("Error calling external sales API:", err);
      // fall back to local filtering below
    }
  return {
    allChartsData: {
      ...allChartsData,
      salesActualsPredMonthComparison: filteredMonthComparison,
    },
    narrative,
  };
}