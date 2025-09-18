"use client";
import React, { useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ActualPredPoint = {
  date: string;
  actual_sales: number;
  predicted_sales: number;
  upper_bound: number;
  lower_bound: number;
};

// Use months instead of days
type TimeRange = "3m" | "6m" | "12m";

const chartConfig = {
  actual_sales: { label: "Actual Sales", color: "var(--chart-1)" },
  predicted_sales: { label: "Predicted Sales", color: "var(--chart-2)" },
  upper_bound: { label: "Upper Bound", color: "var(--chart-3)" },
  lower_bound: { label: "Lower Bound", color: "var(--chart-4)" },
} satisfies ChartConfig;

type SalesActualPredMonthlyAreaChartClientProps = {
  data: ActualPredPoint[];
  initialTimeRange?: TimeRange;
};

function startOfMonth(d: Date) {
  const x = new Date(d);
  x.setDate(1);
  x.setHours(0, 0, 0, 0);
  return x;
}
function endOfMonth(d: Date) {
  const x = new Date(d);
  x.setMonth(x.getMonth() + 1, 0);
  x.setHours(23, 59, 59, 999);
  return x;
}

export default function SalesActualPredMonthlyAreaChartClient({
  data,
  initialTimeRange = "12m",
}: SalesActualPredMonthlyAreaChartClientProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>(initialTimeRange);
  const handleTimeRangeChange = (value: string) =>
    setTimeRange(value as TimeRange);

  const months = timeRange === "3m" ? 3 : timeRange === "6m" ? 6 : 12;

  const filteredData = (() => {
    const safe = Array.isArray(data) ? data : [];
    if (!safe.length) return [];

    // Anchor to the latest data point (supports future-dated points)
    const maxTs = Math.max(
      ...safe
        .map((d) => new Date(d.date).getTime())
        .filter((t) => Number.isFinite(t))
    );
    const end = endOfMonth(Number.isFinite(maxTs) ? new Date(maxTs) : new Date());
    // Include the end month and go back (months - 1)
    const start = startOfMonth(new Date(end));
    start.setMonth(start.getMonth() - (months - 1));

    return safe
      .filter((d) => {
        const dt = new Date(d.date);
        return dt >= start && dt <= end;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  })();

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Actual vs Predicted Sales (Monthly)</CardTitle>
          <CardDescription>Monthly comparison of actual and predicted sales</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={handleTimeRangeChange}>
          <SelectTrigger
            className="hidden w-[200px] rounded-lg sm:ml-auto sm:flex"
            aria-label="Select time range"
          >
            <SelectValue placeholder="Last 12 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="3m">Last 3 months</SelectItem>
            <SelectItem value="6m">Last 6 months</SelectItem>
            <SelectItem value="12m">Last 12 months</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[300px] w-full"
        >
          <AreaChart
            key={timeRange}
            data={filteredData}
            margin={{ top: 12, right: 20, left: 12, bottom: 8 }}
          >
            <defs>
              <linearGradient id="fillActual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-actual_sales)" stopOpacity={0.25} />
                <stop offset="95%" stopColor="var(--color-actual_sales)" stopOpacity={0.04} />
              </linearGradient>
              <linearGradient id="fillPredicted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-predicted_sales)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="var(--color-predicted_sales)" stopOpacity={0.04} />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} />
            <YAxis
              tickFormatter={(v: number) =>
                typeof v === "number" ? Intl.NumberFormat().format(Math.round(v)) : v
              }
              axisLine={false}
              tickLine={false}
              width={72}
              domain={["dataMin", "dataMax"]}
              allowDataOverflow={false}
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={24}
              tickFormatter={(value) =>
                new Date(String(value)).toLocaleDateString("en-US", {
                  month: "short",
                  year: "2-digit",
                })
              }
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(String(value)).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })
                  }
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="actual_sales"
              type="monotone"
              fill="url(#fillActual)"
              stroke="var(--color-actual_sales)"
              strokeWidth={2}
              dot={false}
              isAnimationActive
              animationDuration={520}
            />
            <Area
              dataKey="predicted_sales"
              type="monotone"
              fill="url(#fillPredicted)"
              stroke="var(--color-predicted_sales)"
              strokeWidth={2}
              dot={false}
              isAnimationActive
              animationDuration={520}
            />
            <Area
              dataKey="upper_bound"
              type="monotone"
              fill="url(#fillPredicted)"
              stroke="var(--color-upper_bound)"
              strokeWidth={1}
              dot={false}
              isAnimationActive
              animationDuration={480}
            />
            <Area
              dataKey="lower_bound"
              type="monotone"
              fill="url(#fillPredicted)"
              stroke="var(--color-lower_bound)"
              strokeWidth={1}
              dot={false}
              isAnimationActive
              animationDuration={480}
            />

            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>

      <CardFooter>
        <p className="text-sm text-gray-500">Source: monthly data</p>
      </CardFooter>
    </Card>
  );
}
