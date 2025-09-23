import type {
  AllChartsData,
  salesNarrativeData,
  monthlyPredictionData,
  dailyPredictionData,
  SalesMonthOnMonth,
} from "@/lib/types/sales";

const baseURL = process.env.API_BASE_URL ?? "";

export async function getInitialAllChartsData(
  filters?: { sector?: string | null; region?: string | null; service?: string | null }
): Promise<{
  allChartsData: AllChartsData;
  narrative: salesNarrativeData;
}> {
  let salesMonthOnMonth: SalesMonthOnMonth | null = null;
  let fetchedNarrative: salesNarrativeData | undefined;
  // prepare placeholders for actual-vs-predicted results
  let salesActualsPredMonthComparison: monthlyPredictionData[] | undefined;
  let salesActualsPredDailyComparison: dailyPredictionData[] | undefined;

  try {
    const url = new URL("/api/v1/analysis/kpi", baseURL).toString();
    const payload = {
      metric: "sales",
      period: "month",
      comparison_type: "sequential",
      current_date: new Date().toISOString().slice(0, 10),
      sector: filters?.sector ?? "",
      region: filters?.region ?? "",
      service: filters?.service ?? "",
      include_trend: false,
    };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (res.ok) {
      salesMonthOnMonth = await res.json();

      // request narrative from backend analytics endpoint
      try {
        const narrativeUrl = new URL("/api/v1/analytics/narative", baseURL).toString();
        const narPayload = {
          current_date: payload.current_date,
          sector: payload.sector,
          region: payload.region,
          service: payload.service,
        };
        const narRes = await fetch(narrativeUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(narPayload),
          cache: "no-store",
        });
        if (narRes.ok) {
          fetchedNarrative = (await narRes.json()) as salesNarrativeData;
        } else {
          const txt = await narRes.text().catch(() => "");
          console.error("Narrative API returned non-ok:", narRes.status, txt);
        }
      } catch (err) {
        console.error("Error calling Narrative API:", err);
      }

      // call actual-vs-predicted endpoint twice: monthly and daily
      try {
        const now = new Date();
        const startDate = new Date(now);
        startDate.setFullYear(startDate.getFullYear() - 1);
        const endDate = new Date(now);
        endDate.setMonth(endDate.getMonth() + 2);

        const format = (d: Date) => d.toISOString().slice(0, 10);

        const avpUrl = new URL("/api/v1/analytics/actual-vs-predicted", baseURL).toString();

        // monthly aggregation
        const monthlyPayload = {
          start_date: format(startDate),
          end_date: format(endDate),
          aggregation: "monthly",
          sector: payload.sector,
          region: payload.region,
        };
        const monthlyRes = await fetch(avpUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(monthlyPayload),
          cache: "no-store",
        });
        if (monthlyRes.ok) {
          salesActualsPredMonthComparison = (await monthlyRes.json().data) as monthlyPredictionData[];
        } else {
          const txt = await monthlyRes.text().catch(() => "");
          console.error("Monthly actual-vs-predicted returned non-ok:", monthlyRes.status, txt);
        }

        // daily aggregation
        const dailyPayload = {
          start_date: format(startDate),
          end_date: format(endDate),
          aggregation: "daily",
          sector: payload.sector,
          region: payload.region,
        };
        const dailyRes = await fetch(avpUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dailyPayload),
          cache: "no-store",
        });
        if (dailyRes.ok) {
          salesActualsPredDailyComparison = (await dailyRes.json().data) as dailyPredictionData[];
        } else {
          const txt = await dailyRes.text().catch(() => "");
          console.error("Daily actual-vs-predicted returned non-ok:", dailyRes.status, txt);
        }
      } catch (err) {
        console.error("Error calling actual-vs-predicted APIs:", err);
      }
    } else {
      const text = await res.text();
      console.error("KPI API error:", res.status, text);
    }
  } catch (err) {
    console.error("Error calling KPI API:", err);
  }

  // ensure we always return a complete shape with sensible defaults
  const defaultMonthOnMonth: SalesMonthOnMonth = {
    success: false,
    metric: "sales",
    current_period: { value: 0, period: "", direction: null, date: null, label: "" },
    comparison_period: { value: 0, period: "", direction: null, date: null, label: "" },
    change: { absolute: 0, percentage: 0, direction: null },
    trend: null,
    filters: {},
    execution_timestamp: new Date().toISOString(),
  };

  return {
    allChartsData: {
      salesMonthOnMonthData: salesMonthOnMonth ?? defaultMonthOnMonth,
      salesActualsPredMonthComparison: salesActualsPredMonthComparison ?? [],
      salesActualsPredDailyComparison: salesActualsPredDailyComparison ?? [],
    },
    narrative:
      fetchedNarrative ??
      (typeof fetchedNarrative === "undefined"
        ? { narrative: "", generated_at: new Date().toISOString(), execution_id: "" }
        : fetchedNarrative),
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
        return {
          allChartsData: payload.allChartsData,
          narrative: payload.narrative ?? (baseData?.narrative ?? (await getInitialAllChartsData()).narrative),
        };
      }
    } catch (err) {
      console.error("Error calling external sales API:", err);
    }
}