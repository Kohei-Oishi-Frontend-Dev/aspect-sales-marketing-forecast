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
import { getCurrentMonth, abbreviateNumber } from "@/lib/utils";

// Import the type with a type-only alias to avoid the value/type collision
import type { monthlyPredictionData } from "@/lib/types/sales";
// Use months instead of days
type TimeRange = "3m" | "6m" | "12m";

// Show predicted sales with bounds (no actual sales)
const chartConfig = {
  predicted_sales: { label: "Predicted Sales", color: "var(--chart-1)" },
  upper_bound: { label: "Upper Bound", color: "var(--chart-2)" },
  lower_bound: { label: "Lower Bound", color: "var(--chart-3)" },
} satisfies ChartConfig;

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

// Type guard for prediction data from current month onwards
function hasPredictionFromCurrentMonth(
  d: monthlyPredictionData
): d is monthlyPredictionData & {
  date: string;
  predicted_sales: number;
} {
  const currentMonth = getCurrentMonth();
  return (
    typeof d.date === "string" &&
    d.date.length > 0 &&
    d.date >= currentMonth &&
    typeof d.predicted_sales === "number" &&
    d.predicted_sales !== null
  );
}

interface NextMonthSalesPredictionChartProps {
  data?: monthlyPredictionData[];
  initialTimeRange?: TimeRange;
}

export default function NextMonthSalesPredictionChart({
  data,
  initialTimeRange = "12m",
}: NextMonthSalesPredictionChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>(initialTimeRange);
  const handleTimeRangeChange = (value: string) =>
    setTimeRange(value as TimeRange);

  const months = timeRange === "3m" ? 3 : timeRange === "6m" ? 6 : 12;

  // Filter for prediction data from current month onwards
  const filteredData = (() => {
    const safe = Array.isArray(data) ? data : [];

    // Keep only items with predictions from current month onwards
    const predictionData = safe.filter(hasPredictionFromCurrentMonth);

    if (!predictionData.length) return [];

    // Get the earliest prediction month as the anchor (current month)
    const minTs = Math.min(
      ...predictionData
        .map((d) => {
          const t = new Date(d.date + "-01").getTime(); // Add day to make valid date
          return Number.isFinite(t) ? t : NaN;
        })
        .filter(Number.isFinite)
    );

    const start = startOfMonth(
      Number.isFinite(minTs) ? new Date(minTs) : new Date()
    );
    // Include months going forward
    const end = endOfMonth(new Date(start));
    end.setMonth(end.getMonth() + (months - 1));

    return predictionData
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
          <CardTitle>Monthly Sales Prediction</CardTitle>
          <CardDescription>
            Predicted monthly sales from {getCurrentMonth()} onwards
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={handleTimeRangeChange}>
          <SelectTrigger
            className="hidden w-[200px] rounded-lg sm:ml-auto sm:flex"
            aria-label="Select time range"
          >
            <SelectValue placeholder="Next 12 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="3m">Next 3 months</SelectItem>
            <SelectItem value="6m">Next 6 months</SelectItem>
            <SelectItem value="12m">Next 12 months</SelectItem>
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
              <linearGradient id="fillPredicted" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-predicted_sales)"
                  stopOpacity={0.25}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-predicted_sales)"
                  stopOpacity={0.04}
                />
              </linearGradient>
              <linearGradient id="fillUpper" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-upper_bound)"
                  stopOpacity={0.2}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-upper_bound)"
                  stopOpacity={0.04}
                />
              </linearGradient>
              <linearGradient id="fillLower" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-lower_bound)"
                  stopOpacity={0.2}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-lower_bound)"
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
            {/* Render bounds first, then prediction on top */}
            <Area
              dataKey="upper_bound"
              type="monotone"
              fill="url(#fillUpper)"
              stroke="var(--color-upper_bound)"
              strokeWidth={1}
              dot={false}
              isAnimationActive
              animationDuration={480}
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
              dataKey="lower_bound"
              type="monotone"
              fill="url(#fillLower)"
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
        <p className="text-sm text-gray-500">
          Source: monthly data (predictions only, from current month onwards)
        </p>
      </CardFooter>
    </Card>
  );
}
