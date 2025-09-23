import { NextResponse } from "next/server";
import { getInitialAllChartsData } from "@/lib/services/sales.server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const filters = body?.filters ?? {};
    // call server service with current filters
    console.log(filters);
    const norm = (v?: string) => (v === "all" ? "" : (v ?? ""));
    const result = await getInitialAllChartsData({
      sector: norm(filters.sector),
      region: norm(filters.region),
      service: norm(filters.service),
    });
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("sales forecast update error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}