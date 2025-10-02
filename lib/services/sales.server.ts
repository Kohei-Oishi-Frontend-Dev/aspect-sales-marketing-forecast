import { fetchKpiData } from "./kpi.server";
import { fetchNarrativeData } from "./narratives.server";
import { fetchMonthlyPredictionData, fetchDailyPredictionData } from "./predictions.server";
import type { AllChartsData, salesNarrativeData } from "@/lib/types/sales";

export async function getInitialAllChartsData(
  filters?: { sector?: string | null; region?: string | null; service?: string | null }
): Promise<{
  allChartsData: AllChartsData;
  narrative: salesNarrativeData;
}> {
  const filterParams = {
    sector: filters?.sector ?? null,
    region: filters?.region ?? null,
    service: filters?.service ?? null,
  };

  console.log("filter params is ", filterParams);
  
  try {
    // Fetch all data in parallel
    const [
      salesMonthOnMonth,
      narrative,
      salesActualsPredMonthComparison,
      salesActualsPredDailyComparison,
    ] = await Promise.all([
      fetchKpiData(filterParams),
      fetchNarrativeData(filterParams),
      fetchMonthlyPredictionData(filterParams),
      fetchDailyPredictionData(filterParams),
    ]);

    console.log("fetching is complete");
    
    // Add detailed logging of what we got back
    console.log("📊 KPI Data:", JSON.stringify(salesMonthOnMonth, null, 2));
    console.log("📝 Narrative:", JSON.stringify(narrative, null, 2));
    console.log("📈 Monthly Data:", JSON.stringify(salesActualsPredMonthComparison?.slice(0, 3), null, 2)); // first 3 items
    console.log("📅 Daily Data:", JSON.stringify(salesActualsPredDailyComparison?.slice(0, 3), null, 2)); // first 3 items

    const result = {
      allChartsData: {
        salesMonthOnMonthData: salesMonthOnMonth,
        salesActualsPredMonthComparison,
        salesActualsPredDailyComparison,
      },
      narrative,
    };

    console.log("🎯 Final result structure:", {
      hasMonthOnMonth: !!result.allChartsData.salesMonthOnMonthData,
      hasMonthlyComparison: Array.isArray(result.allChartsData.salesActualsPredMonthComparison) && result.allChartsData.salesActualsPredMonthComparison.length > 0,
      hasDailyComparison: Array.isArray(result.allChartsData.salesActualsPredDailyComparison) && result.allChartsData.salesActualsPredDailyComparison.length > 0,
      hasNarrative: !!result.narrative,
    });

    return result;
  } catch (error) {
    console.error("❌ Error in getInitialAllChartsData:", error);
    throw error;
  }
}

// Re-export commonly used functions
export { fetchKpiData } from "./kpi.server";
export { fetchNarrativeData } from "./narratives.server";
export { fetchMonthlyPredictionData, fetchDailyPredictionData } from "./predictions.server";