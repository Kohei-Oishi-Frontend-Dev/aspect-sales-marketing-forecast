"use server";

import { getInitialAllChartsData } from "@/lib/services/sales.server";

export async function updateSalesData(filters: {
  sector?: string | null;
  region?: string | null;
  service?: string | null;
}) {
  return await getInitialAllChartsData(filters);
}