import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    //actual fetching happens
    console.log(request);
    //currently just console.log statement

    const allChartsData = {
      salesMonthOnMonthData: null,
      salesPredictionData: null,
      salesActualsPredMonthComparison: null,
      salesActualsPredDailyComparison: null,
    };
    // return filtered data; client will replace charts
    return NextResponse.json({ allChartsData }, { status: 200 });
  } catch (err: unknown) {
    // narrow the unknown error to extract a message safely
    const message =
      err instanceof Error ? err.message : typeof err === "string" ? err : "Server error";
    console.error("sales filter API error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}