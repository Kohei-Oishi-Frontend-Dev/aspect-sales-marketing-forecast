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

import type monthlyPredictionData from "@/app/analytics-dashboard/sales/SalesActualPredMonthlyAreaChart";

type TimeRange = "7d" | "14d" | "30d" | "90d";

const chartConfig = {
  pred_sale: { label: "Predicted Sales", color: "var(--chart-1)" },
  upper_bound: { label: "Upper Bound", color: "var(--chart-2)" },
  lower_bound: { label: "Lower Bound", color: "var(--chart-3)" },
} satisfies ChartConfig;

type SalesPredictionAreaChartClientProps = {
  data: monthlyPredictionData[];
  initialTimeRange?: TimeRange;
};

export default function SalesPredictionAreaChartClient({
  data,
  initialTimeRange = "90d",
}: SalesPredictionAreaChartClientProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>(initialTimeRange);

  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value as TimeRange);
  };

  const days =
    timeRange === "7d"
      ? 7
      : timeRange === "14d"
      ? 14
      : timeRange === "30d"
      ? 30
      : 90;

  const filteredData = (() => {
    if (!data || data.length === 0) return [];
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const start = new Date(end);
    start.setDate(end.getDate() - days + 1);

    return data
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
          <CardTitle>Sales Prediction</CardTitle>
          <CardDescription>
            Predicted sales with confidence bounds
          </CardDescription>
        </div>

        <Select value={timeRange} onValueChange={handleTimeRangeChange}>
          <SelectTrigger
            className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
            aria-label="Select time range"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 1 month
            </SelectItem>
            <SelectItem value="14d" className="rounded-lg">
              Last 14 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
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
              <linearGradient id="fillPred" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-pred_sale)"
                  stopOpacity={0.25}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-pred_sale)"
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
            {/* render lower -> pred -> upper to place prediction visually on top */}
            <Area
              dataKey="upper_bound"
              type="monotone"
              fill="url(#fillUpper)"
              stroke="var(--color-upper_bound)"
              strokeWidth={0.5}
              dot={false}
              isAnimationActive={true}
              animationDuration={480}
            />
            <Area
              dataKey="pred_sale"
              type="monotone"
              fill="url(#fillPred)"
              stroke="var(--color-pred_sale)"
              strokeWidth={2}
              dot={false}
              isAnimationActive={true}
              animationDuration={520}
            />
            <Area
              dataKey="lower_bound"
              type="monotone"
              fill="url(#fillLower)"
              stroke="var(--color-lower_bound)"
              strokeWidth={0.5}
              dot={false}
              isAnimationActive={true}
              animationDuration={480}
            />

            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>

      <CardFooter>
        <p className="text-sm text-gray-500">
          Source: predicted_sales_data.json
        </p>
      </CardFooter>
    </Card>
  );
}
