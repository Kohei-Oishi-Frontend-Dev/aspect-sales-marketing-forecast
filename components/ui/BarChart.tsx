"use client";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { abbreviateNumber } from "@/lib/utils";

export const description = "A bar chart";

type ChartDataItem = {
  x?: string;
  y?: number;
  period?: string;
  total_sales?: number;
  y_abbr?: string;
  total_sales_abbr?: string;
};

// runtime guard helpers (avoid `any`)
function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function getConfigAxisName(
  cfg: unknown,
  axis: "xAxis" | "yAxis"
): string | undefined {
  if (!isRecord(cfg)) return undefined;
  const axisObj = cfg[axis];
  if (!isRecord(axisObj)) return undefined;
  const name = axisObj["name"];
  return typeof name === "string" ? name : undefined;
}

function getAggregatePeriod(agg: unknown): string | undefined {
  if (!isRecord(agg)) return undefined;
  const candidate = agg["period"] ?? agg["x"] ?? agg["label"];
  return typeof candidate === "string" ? candidate : undefined;
}

function getAggregateTotalSales(agg: unknown): number | undefined {
  if (!isRecord(agg)) return undefined;
  const candidate = agg["total_sales"] ?? agg["y"] ?? agg["value"];
  return typeof candidate === "number" ? candidate : undefined;
}

// accept unknown[] so callers can pass raw JSON safely
export function ChartBarDefault({
  data = [],
  title = "Bar Chart",
  aggregate = null,
  config,
}: {
  data?: unknown[];
  title?: string;
  aggregate?: unknown | null;
  config?: unknown;
}) {
  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  const xAxisLabel = getConfigAxisName(config, "xAxis") ?? "";
  const yAxisLabel = getConfigAxisName(config, "yAxis") ?? "";

  // safely map unknown -> ChartDataItem using runtime checks (no `any`)
  const processedData: ChartDataItem[] = (data ?? []).map((raw) => {
    if (isRecord(raw)) {
      const obj = raw;
      const x =
        typeof obj["x"] === "string"
          ? (obj["x"] as string)
          : typeof obj["period"] === "string"
          ? (obj["period"] as string)
          : String(obj["x"] ?? "");
      const y =
        typeof obj["y"] === "number"
          ? (obj["y"] as number)
          : typeof obj["total_sales"] === "number"
          ? (obj["total_sales"] as number)
          : undefined;
      const total_sales =
        typeof obj["total_sales"] === "number"
          ? (obj["total_sales"] as number)
          : undefined;

      return {
        x,
        y,
        period:
          typeof obj["period"] === "string" ? (obj["period"] as string) : undefined,
        total_sales,
        y_abbr: typeof y === "number" ? abbreviateNumber(y, 2) : undefined,
        total_sales_abbr:
          typeof total_sales === "number"
            ? abbreviateNumber(total_sales, 2)
            : undefined,
      };
    }
    // keep object shape consistent (all fields optional)
    return {};
  });

  const aggTotal = getAggregateTotalSales(aggregate);
  const aggregateLabel =
    typeof aggTotal === "number" ? `£${abbreviateNumber(aggTotal, 2)}` : null;
  const aggPeriod = getAggregatePeriod(aggregate);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="grid flex-1 gap-1">
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            {aggregate
              ? `${aggPeriod ?? String(aggregate ?? "")}${
                  aggregateLabel ? ` — ${aggregateLabel}` : ""
                }`
              : "Bar data"}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="w-full">
          <BarChart accessibilityLayer data={processedData} className="w-full">
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="x"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => String(value)}
              label={
                xAxisLabel
                  ? { value: String(xAxisLabel), position: "bottom" }
                  : undefined
              }
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => {
                const n = typeof v === "number" ? v : Number(v);
                return Number.isFinite(n)
                  ? abbreviateNumber(n, 2)
                  : String(v ?? "");
              }}
              label={
                yAxisLabel
                  ? {
                      value: String(yAxisLabel),
                      angle: -90,
                      position: "insideLeft",
                    }
                  : undefined
              }
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="y" fill="var(--color-desktop)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
export default ChartBarDefault;
