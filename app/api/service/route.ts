import { NextRequest, NextResponse } from "next/server";

const BASE = process.env.API_BASE_URL ?? "";

export async function GET(request: NextRequest) {
  try {
    if (!BASE) {
      return NextResponse.json(
        { error: "API_BASE_URL not configured" },
        { status: 500 }
      );
    }

    const url = new URL("/api/v1/analysis/service", BASE).toString();
    const res = await fetch(url, { method: "GET", cache: "no-store" });

    if (!res.ok) {
      const text = await res.text();
      console.error("Failed to fetch services:", res.status, text);
      return NextResponse.json(
        { error: "Failed to fetch services", detail: text },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("service route error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}