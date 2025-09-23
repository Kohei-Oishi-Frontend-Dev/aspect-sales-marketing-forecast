import type {
  AllChartsData,
  salesNarrativeData,
  monthlyPredictionData,
  dailyPredictionData,
  SalesMonthOnMonth,
} from "@/lib/types/sales";

const baseURL = process.env.API_BASE_URL ?? "";
if (!baseURL) {
  throw new Error("API_BASE_URL must be set to call external analytics endpoints");
}

async function postJson<T = unknown>(path: string, body: unknown): Promise<T> {
  const url = new URL(path, baseURL).toString();
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`POST ${path} failed ${res.status}: ${txt}`);
  }
  return (await res.json()) as T;
}

export async function getInitialAllChartsData(
  filters?: { sector?: string | null; region?: string | null; service?: string | null }
): Promise<{
  allChartsData: AllChartsData;
  narrative: salesNarrativeData;
}> {
  // prepare KPI payload
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

  // 1) KPI (month-on-month)
  const salesMonthOnMonth = await postJson<SalesMonthOnMonth>("/api/v1/analysis/kpi", payload);

  // 2) Narrative
  const narrative = await postJson<salesNarrativeData>("/api/v1/analytics/narative", {
    current_date: payload.current_date,
    sector: payload.sector,
    region: payload.region,
    service: payload.service,
  });

  // 3) Actual vs Predicted (monthly)
  const now = new Date();
  const startDate = new Date(now);
  startDate.setFullYear(startDate.getFullYear() - 1);
  const endDate = new Date(now);
  endDate.setMonth(endDate.getMonth() + 2);
  const format = (d: Date) => d.toISOString().slice(0, 10);

  const monthlyRes = await postJson<{ data: monthlyPredictionData[] }>(
    "/api/v1/analytics/actual-vs-predicted",
    {
      start_date: format(startDate),
      end_date: format(endDate),
      aggregation: "monthly",
      sector: payload.sector,
      region: payload.region,
    }
  );
  const salesActualsPredMonthComparison = monthlyRes.data;

  // 4) Actual vs Predicted (daily)
  const dailyRes = await postJson<{ data: dailyPredictionData[] }>(
    "/api/v1/analytics/actual-vs-predicted",
    {
      start_date: format(startDate),
      end_date: format(endDate),
      aggregation: "daily",
      sector: payload.sector,
      region: payload.region,
    }
  );
  const salesActualsPredDailyComparison = dailyRes.data;

  // return the strict shape (no local fallback)
  return {
    allChartsData: {
      salesMonthOnMonthData: salesMonthOnMonth,
      salesActualsPredMonthComparison : salesActualsPredMonthComparison,
      salesActualsPredDailyComparison : salesActualsPredDailyComparison,
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
        return {
          allChartsData: payload.allChartsData,
          narrative: payload.narrative ?? (baseData?.narrative ?? (await getInitialAllChartsData()).narrative),
        };
      }
    } catch (err) {
      console.error("Error calling external sales API:", err);
    }
}