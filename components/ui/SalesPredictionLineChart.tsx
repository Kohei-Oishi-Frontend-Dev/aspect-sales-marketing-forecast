"use client";

import { useQuery } from "@tanstack/react-query";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type PredPoint = {
  date: string;
  pred_sales: number;
  upper_bound: number;
  lower_bound: number;
};

const chartConfig = {
  pred_sales: { label: "Predicted Sales", color: "var(--chart-1)" },
  upper_bound: { label: "Upper Bound", color: "var(--chart-2)" },
  lower_bound: { label: "Lower Bound", color: "var(--chart-3)" },
} satisfies ChartConfig;

export function SalesPredictionLineChart() {
  const {
    data = [],
    isLoading,
    error,
  } = useQuery<PredPoint[]>({
    queryKey: ["predicted-sales"],
    queryFn: async () => {
      const res = await fetch("/predicted_sales_data.json", {
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const json = (await res.json()) as PredPoint[];
      console.log(json);
      return json;
      // return json
      //   .slice()
      //   .sort(
      //     (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      //   );
    },
    staleTime: 5 * 60 * 1000,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Prediction</CardTitle>
        <CardDescription>
          Predicted sales with confidence bounds
        </CardDescription>
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
          <ChartContainer config={chartConfig}>
            <LineChart
              accessibilityLayer
              data={data}
              margin={{ left: 12, right: 12 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value: string) =>
                  new Date(value).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Line
                dataKey="pred_sale"
                type="monotone"
                stroke="var(--color-pred_sales)"
                strokeWidth={2}
                dot={true}
              />
              <Line
                dataKey="upper_bound"
                type="monotone"
                stroke="var(--color-upper_bound)"
                strokeWidth={2}
                dot={true}
              />
              <Line
                dataKey="lower_bound"
                type="monotone"
                stroke="var(--color-lower_bound)"
                strokeWidth={2}
                dot={true}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter>
        <p className="text-sm text-gray-500">
          Source: predicted_sales_data.json
        </p>
      </CardFooter>
    </Card>
  );
}
