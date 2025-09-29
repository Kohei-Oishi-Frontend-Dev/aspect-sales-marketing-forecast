import { postJson } from "./api-client.server";
import type { SalesMonthOnMonth } from "@/lib/types/sales";

export async function fetchKpiData(filters: {
  sector?: string | null;
  region?: string | null;
  service?: string | null;
}): Promise<SalesMonthOnMonth> {
  const payload = {
    metric: "sales",
    period: "month",
    comparison_type: "sequential",
    current_date: new Date().toISOString().slice(0, 10),
    sector: filters.sector ?? "",
    region: filters.region ?? "",
    service: filters.service ?? "",
    include_trend: false,
  };

  return await postJson<SalesMonthOnMonth>("/api/v1/analysis/kpi", payload);
}