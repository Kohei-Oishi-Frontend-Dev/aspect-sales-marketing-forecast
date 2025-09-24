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
import { getCurrentMonth, isDateBeforeCurrentMonth } from "@/lib/utils";
import { abbreviateNumber } from "@/lib/utils";

// Import the type with a type-only alias to avoid the value/type collision
import type { monthlyPredictionData } from "@/lib/types/sales";
// Use months instead of days
type TimeRange = "3m" | "6m" | "12m";

// Only show actual sales (no predictions)
const chartConfig = {
  actual_sales: { label: "Actual Sales", color: "var(--chart-1)" },
} satisfies ChartConfig;

type LastMonthSalesChartProps = {
  data: monthlyPredictionData[];
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

// Type guard for actual sales data only
function hasActualSalesBeforeCurrentMonth(
  d: monthlyPredictionData
): d is monthlyPredictionData & {
  date: string;
  actual_sales: number;
} {
  return (
    typeof d.date === "string" &&
    d.date.length > 0 &&
    isDateBeforeCurrentMonth(d.date) &&
    typeof d.actual_sales === "number" &&
    d.actual_sales !== null
  );
}

export default function LastMonthSalesChart({
  data,
  initialTimeRange = "12m",
}: LastMonthSalesChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>(initialTimeRange);
  const handleTimeRangeChange = (value: string) =>
    setTimeRange(value as TimeRange);

  const months = timeRange === "3m" ? 3 : timeRange === "6m" ? 6 : 12;

  // Filter for actual sales data before current month only
  const filteredData = (() => {
    const safe = Array.isArray(data) ? data : [];

    // Keep only items with actual sales before current month
    const actualSalesData = safe.filter(hasActualSalesBeforeCurrentMonth);

    if (!actualSalesData.length) return [];

    // Get the latest actual sales month as the anchor
    const maxTs = Math.max(
      ...actualSalesData
        .map((d) => {
          const t = new Date(d.date + "-01").getTime(); // Add day to make valid date
          return Number.isFinite(t) ? t : NaN;
        })
        .filter(Number.isFinite)
    );

    const end = endOfMonth(
      Number.isFinite(maxTs) ? new Date(maxTs) : new Date()
    );
    // Include the end month and go back (months - 1)
    const start = startOfMonth(new Date(end));
    start.setMonth(start.getMonth() - (months - 1));

    return actualSalesData
      .filter((d) => {
        const dt = new Date(d.date + "-01"); // Add day to make valid date
        return dt >= start && dt <= end;
      })
      .sort(
        (a, b) =>
          new Date(a.date + "-01").getTime() -
          new Date(b.date + "-01").getTime()
      );
  })();

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Monthly Sales</CardTitle>
          <CardDescription>
            Actual monthly sales up to {getCurrentMonth()}
          </CardDescription>
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
            </defs>

            <CartesianGrid vertical={false} />
            <YAxis
              tickFormatter={(v: number) => abbreviateNumber(Number(v))}
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
                new Date(String(value) + "-01").toLocaleDateString("en-US", {
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
                    new Date(String(value) + "-01").toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })
                  }
                  indicator="dot"
                  formatter={(val) =>
                    typeof val === "number" ? abbreviateNumber(Number(val)) : String(val)
                  }
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

            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>

      <CardFooter>
        <p className="text-sm text-gray-500">
          Source: monthly data (actual sales only, up to current month)
        </p>
      </CardFooter>
    </Card>
  );
}
