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

  const xAxisLabel = (config as any)?.xAxis?.name ?? "";
  const yAxisLabel = (config as any)?.yAxis?.name ?? "";

  // safely map unknown -> ChartDataItem using runtime checks (no `any`)
  const processedData: ChartDataItem[] = (data ?? []).map((raw) => {
    if (typeof raw === "object" && raw !== null) {
      const obj = raw as Record<string, unknown>;
      const x =
        typeof obj.x === "string"
          ? obj.x
          : typeof obj.period === "string"
          ? obj.period
          : String(obj.x ?? "");
      const y =
        typeof obj.y === "number"
          ? obj.y
          : typeof obj.total_sales === "number"
          ? obj.total_sales
          : undefined;
      const total_sales =
        typeof obj.total_sales === "number" ? obj.total_sales : undefined;

      return {
        x,
        y,
        period: typeof obj.period === "string" ? obj.period : undefined,
        total_sales,
        y_abbr: typeof y === "number" ? abbreviateNumber(y, 2) : undefined,
        total_sales_abbr:
          typeof total_sales === "number"
            ? abbreviateNumber(total_sales, 2)
            : undefined,
      };
    }
    return {};
  });

  const aggregateLabel =
    aggregate && typeof (aggregate as any)?.total_sales === "number"
      ? `£${abbreviateNumber((aggregate as any).total_sales as number, 2)}`
      : typeof aggregate === "object" && aggregate && "total_sales" in (aggregate as any)
      ? String((aggregate as any).total_sales ?? "")
      : null;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="grid flex-1 gap-1">
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            {aggregate
              ? `${
                  typeof aggregate === "object" &&
                  "period" in aggregate
                    ? aggregate.period
                    : String(aggregate ?? "")
                }${aggregateLabel ? ` — ${aggregateLabel}` : ""}`
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
                // ensure numeric input before abbreviation
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
