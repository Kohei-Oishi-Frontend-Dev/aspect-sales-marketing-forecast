import { getFilteredChartsData } from "@/lib/services/sales.server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const filters = body.filters ?? {};
    const result = await getFilteredChartsData(filters);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    console.error("sales forecast API error:", err);
    const message = err instanceof Error ? err.message : String(err ?? "Server error");
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

