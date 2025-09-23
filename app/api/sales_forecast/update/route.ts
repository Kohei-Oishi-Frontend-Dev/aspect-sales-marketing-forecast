import { getFilteredChartsData } from "@/lib/services/sales.server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const filters = body.filters ?? {};
    const result = await getFilteredChartsData(filters);
    return NextResponse.json(result);
  } catch (err: unknown) {
    console.error("sales forecast API error:", err);
    return NextResponse.json({ error: err?.message ?? "Server error" }, { status: 500 });
  }
}

