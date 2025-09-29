import { postJson } from "./api-client.server";
import type { monthlyPredictionData, dailyPredictionData } from "@/lib/types/sales";

export async function fetchMonthlyPredictionData(filters: {
  sector?: string | null;
  region?: string | null;
  service?: string | null;
}): Promise<monthlyPredictionData[]> {
  const now = new Date();
  const startDate = new Date(now);
  startDate.setFullYear(startDate.getFullYear() - 1);
  const endDate = new Date(now);
  endDate.setMonth(endDate.getMonth() + 2);
  const format = (d: Date) => d.toISOString().slice(0, 10);

  const payload = {
    start_date: format(startDate),
    end_date: format(endDate),
    aggregation: "monthly",
    sector: filters.sector ?? "",
    region: filters.region ?? "",
    service: filters.service ?? "",
  };

  const response = await postJson<{ data: monthlyPredictionData[] }>(
    "/api/v1/analytics/actual-vs-predicted",
    payload
  );
  return response.data;
}

export async function fetchDailyPredictionData(filters: {
  sector?: string | null;
  region?: string | null;
  service?: string | null;
}): Promise<dailyPredictionData[]> {
  const now = new Date();
  const startDate = new Date(now);
  startDate.setFullYear(startDate.getFullYear() - 1);
  const endDate = new Date(now);
  endDate.setMonth(endDate.getMonth() + 2);
  const format = (d: Date) => d.toISOString().slice(0, 10);

  const payload = {
    start_date: format(startDate),
    end_date: format(endDate),
    aggregation: "daily",
    sector: filters.sector ?? "",
    region: filters.region ?? "",
    service: filters.service ?? "",
  };

  const response = await postJson<{ data: dailyPredictionData[] }>(
    "/api/v1/analytics/actual-vs-predicted",
    payload
  );
  return response.data;
}