import { postJson } from "./api-client.server";
import type { salesNarrativeData } from "@/lib/types/sales";

export async function fetchNarrativeData(filters: {
  sector?: string | null;
  region?: string | null;
  service?: string | null;
}): Promise<salesNarrativeData> {
  const payload = {
    current_date: new Date().toISOString().slice(0, 10),
    sector: filters.sector ?? "",
    region: filters.region ?? "",
    service: filters.service ?? "",
  };

  return await postJson<salesNarrativeData>("/api/v1/analytics/narative", payload);
}