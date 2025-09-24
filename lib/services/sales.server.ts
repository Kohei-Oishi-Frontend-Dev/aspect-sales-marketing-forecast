import type {
  AllChartsData,
  salesNarrativeData,
  monthlyPredictionData,
  dailyPredictionData,
  SalesMonthOnMonth,
} from "@/lib/types/sales";

const baseURL = process.env.API_BASE_URL;

// validate base at call time so module import never throws and we fail fast when missing
async function postJson<T = unknown>(path: string, body: unknown): Promise<T> {
  if (!baseURL) {
    throw new Error(
      "API_BASE_URL is not configured. Set API_BASE_URL in environment before calling external analytics endpoints."
    );
  }
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
    region: "",
    service: "",
    // service: filters?.service ?? "",
    include_trend: false,
  };

  // 1) KPI (month-on-month)
  const salesMonthOnMonth = await postJson<SalesMonthOnMonth>("/api/v1/analysis/kpi", payload);
  console.log("salesMonth data kpi ", salesMonthOnMonth);
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
      service: payload.service,
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
      service: payload.service,
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
  // Use the validated helper so we never call an empty base that resolves to localhost.
  try {
    const payload = await postJson<{
      allChartsData: AllChartsData;
      narrative?: salesNarrativeData;
    }>("/api/v1/analysis/filtered-charts", { filters });

    return {
      allChartsData: payload.allChartsData,
      narrative: payload.narrative ?? (baseData?.narrative ?? (await getInitialAllChartsData()).narrative),
    };
  } catch (err) {
    console.error("Error calling external sales API:", err);
    throw err; // bubble so caller handles the failure explicitly
  }
 }