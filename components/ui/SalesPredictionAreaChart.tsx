"use client";

import { useQuery } from "@tanstack/react-query";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
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

type PredPoint = {
  date: string;
  pred_sale: number;
  upper_bound: number;
  lower_bound: number;
};

const chartConfig = {
  pred_sale: { label: "Predicted Sales", color: "var(--chart-1)" },
  upper_bound: { label: "Upper Bound", color: "var(--chart-2)" },
  lower_bound: { label: "Lower Bound", color: "var(--chart-3)" },
} satisfies ChartConfig;

export function SalesPredictionAreaChart() {
  const { data = [], isLoading, error } = useQuery<PredPoint[]>({
    queryKey: ["predicted-sales"],
    queryFn: async () => {
      const res = await fetch("/predicted_sales_data.json", { cache: "no-store" });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const json = (await res.json()) as Array<Record<string, unknown>>;
      return json
        .map((d) => ({
          date: d.date,
          pred_sale: d.pred_sale,
          upper_bound: d.upper_bound,
          lower_bound: d.lower_bound,
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    },
    // staleTime: 5 * 60 * 1000,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Prediction</CardTitle>
        <CardDescription>Predicted sales with confidence bounds</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <div className="h-4 w-1/2 bg-gray-100 rounded animate-pulse" />
            <div className="h-64 w-full bg-gray-100 rounded animate-pulse" />
          </div>
        ) : error ? (
          <div className="text-sm text-red-600">Failed to load chart data.</div>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-[260px] w-full">
            <AreaChart data={data} margin={{ left: 12, right: 12 }}>
              <defs>
                <linearGradient id="fillPred" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-pred_sale)" stopOpacity={0.28} />
                  <stop offset="95%" stopColor="var(--color-pred_sale)" stopOpacity={0.06} />
                </linearGradient>
                <linearGradient id="fillUpper" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-upper_bound)" stopOpacity={0.06} />
                  <stop offset="95%" stopColor="var(--color-upper_bound)" stopOpacity={0.01} />
                </linearGradient>
                <linearGradient id="fillLower" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-lower_bound)" stopOpacity={0.06} />
                  <stop offset="95%" stopColor="var(--color-lower_bound)" stopOpacity={0.01} />
                </linearGradient>
              </defs>

              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value: string) =>
                  new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                }
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) =>
                      new Date(value as string).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }
                    indicator="dot"
                  />
                }
              />

              <Area
                dataKey="upper_bound"
                type="monotone"
                fill="url(#fillUpper)"
                stroke="var(--color-upper_bound)"
                strokeWidth={1}
                strokeOpacity={0.40}
                dot={false}
                isAnimationActive={false}
              />
              <Area
                dataKey="pred_sale"
                type="monotone"
                fill="url(#fillPred)"
                stroke="var(--color-pred_sale)"
                strokeWidth={2}
                strokeOpacity={1}
                dot={false}
                isAnimationActive={false}
              />
              <Area
                dataKey="lower_bound"
                type="monotone"
                fill="url(#fillLower)"
                stroke="var(--color-lower_bound)"
                strokeWidth={1}
                strokeOpacity={0.40}
                dot={false}
                isAnimationActive={false}
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter>
        <p className="text-sm text-gray-500">Source: predicted_sales_data.json</p>
      </CardFooter>
    </Card>
  );
}
