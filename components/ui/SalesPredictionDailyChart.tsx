"use client";
import React, { useMemo, useState } from "react";
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
import { getCurrentDay } from "@/lib/utils";

import type { dailyPredictionData } from "@/app/analytics-dashboard/sales/SalesActualPredDailyAreaChart";

type TimeRange = "7d" | "14d" | "30d" | "90d" | "180d" | "360d";

const chartConfig = {
  actual_sales: { label: "Actual Sales", color: "var(--chart-1)" },
  predicted_sales: { label: "Predicted Sales", color: "var(--chart-2)" },
  upper_bound: { label: "Upper Bound", color: "var(--chart-3)" },
  lower_bound: { label: "Lower Bound", color: "var(--chart-4)" },
} satisfies ChartConfig;

type SalesPredictionDailyChartProps = {
  data: dailyPredictionData[];
  initialTimeRange?: TimeRange;
};

export default function SalesPredictionDailyChart({
  data,
  initialTimeRange = "360d",
}: SalesPredictionDailyChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>(initialTimeRange);
  const handleTimeRangeChange = (value: string) =>
    setTimeRange(value as TimeRange);

  const days =
    timeRange === "7d"
      ? 7
      : timeRange === "14d"
      ? 14
      : timeRange === "30d"
      ? 30
      : timeRange === "90d"
      ? 90
      : timeRange === "180d"
      ? 180
      : 360;

  const filteredData = useMemo(() => {
    const safe = Array.isArray(data) ? data : [];
    const currentDay = getCurrentDay();

    // Filter for dates from current day onwards only
    const fromCurrentDay = safe.filter(
      (d): d is dailyPredictionData & { date: string } =>
        typeof d.date === "string" && d.date.length > 0 && d.date >= currentDay
    );

    if (!fromCurrentDay.length) return [];

    // Use current day as the start anchor and show forward
    const start = new Date(currentDay);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(end.getDate() + days - 1);
    end.setHours(23, 59, 59, 999);

    return fromCurrentDay
      .filter((d) => {
        const dt = new Date(d.date);
        return dt >= start && dt <= end;
      })
      .sort(
        (a, b) =>
          new Date(String(a.date)).getTime() -
          new Date(String(b.date)).getTime()
      );
  }, [data, days]);

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Daily Sales Forecast</CardTitle>
          <CardDescription>
            Daily sales predictions from {getCurrentDay()} onwards
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={handleTimeRangeChange}>
          <SelectTrigger
            className="hidden w-[200px] rounded-lg sm:ml-auto sm:flex"
            aria-label="Select time range"
          >
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="7d">Next 7 days</SelectItem>
            <SelectItem value="14d">Next 14 days</SelectItem>
            <SelectItem value="30d">Next 30 days</SelectItem>
            <SelectItem value="90d">Next 90 days</SelectItem>
            <SelectItem value="180d">Next 6 months</SelectItem>
            <SelectItem value="360d">Next 12 months</SelectItem>
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
                <stop
                  offset="5%"
                  stopColor="var(--color-actual_sales)"
                  stopOpacity={0.25}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-actual_sales)"
                  stopOpacity={0.04}
                />
              </linearGradient>
              <linearGradient id="fillPredicted" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-predicted_sales)"
                  stopOpacity={0.2}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-predicted_sales)"
                  stopOpacity={0.04}
                />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} />
            <YAxis
              tickFormatter={(v: number) =>
                typeof v === "number"
                  ? Intl.NumberFormat().format(Math.round(v))
                  : v
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
                  day: "numeric",
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
                      day: "numeric",
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
              strokeWidth={2}
              dot={false}
              isAnimationActive
              animationDuration={520}
            />
            <Area
              dataKey="lower_bound"
              type="monotone"
              fill="url(#fillPredicted)"
              stroke="var(--color-lower_bound)"
              strokeWidth={2}
              dot={false}
              isAnimationActive
              animationDuration={520}
            />

            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>

      <CardFooter>
        <p className="text-sm text-gray-500">
          Source: daily forecast data (from current day onwards)
        </p>
      </CardFooter>
    </Card>
  );
}
