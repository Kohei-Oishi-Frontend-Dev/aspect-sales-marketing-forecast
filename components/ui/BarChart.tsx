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

// shape that matches fixture
type ChartDataItem = {
  x?: string;
  y?: number;
  period?: string;
  total_sales?: number;
  y_abbr?: string;
  total_sales_abbr?: string;
};

// accept title, aggregate and incoming chart config (from chat.json)
export function ChartBarDefault({
  data = [],
  title = "Bar Chart",
  aggregate = null,
  config,
}: {
  data?: ChartDataItem[];
  title?: string;
  aggregate?: ChartDataItem | null;
  config?: undefined;
}) {
  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  const xAxisLabel = config?.xAxis?.name ?? "";
  const yAxisLabel = config?.yAxis?.name ?? "";

  // create processedData where each element has abbreviated strings for numeric fields
  const processedData: ChartDataItem[] = (data ?? []).map((d) => {
    const yNum =
      typeof d.y === "number"
        ? d.y
        : typeof d.total_sales === "number"
        ? d.total_sales
        : undefined;
    return {
      ...d,
      y_abbr: typeof yNum === "number" ? abbreviateNumber(yNum, 2) : undefined,
      total_sales_abbr:
        typeof d.total_sales === "number"
          ? abbreviateNumber(d.total_sales, 2)
          : undefined,
    };
  });

  // aggregate abbreviation
  const aggregateLabel =
    aggregate && typeof aggregate.total_sales === "number"
      ? `£${abbreviateNumber(aggregate.total_sales, 2)}`
      : typeof aggregate === "object" && "total_sales" in aggregate
      ? String(aggregate.total_sales ?? "")
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
