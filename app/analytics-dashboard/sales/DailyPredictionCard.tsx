import KpiCard from "./KpiCard";
import { abbreviateNumber, getCurrentDay } from "@/lib/utils";
import type { dailyPredictionData } from "@/lib/types/sales";

type Props = {
  dailyForecastData?: dailyPredictionData[];
};

export default function DailyPredictionCard({ dailyForecastData }: Props) {
  const today = getCurrentDay();

  // Find data for today
  const todayData = dailyForecastData?.find((d) => d.date === today);

  // Get predicted sales for today
  const todayPredictedSales = todayData?.predicted_sales;

  // Calculate values for display
  const value =
    todayPredictedSales != null && !Number.isNaN(Number(todayPredictedSales))
      ? `£${abbreviateNumber(Number(todayPredictedSales), 2)}`
      : "N/A";

  const description = (() => {
    if (
      todayPredictedSales == null ||
      Number.isNaN(Number(todayPredictedSales))
    ) {
      return "today's forecast";
    }

    return `predicted for ${new Date(today).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })}`;
  })();

  return (
    <KpiCard
      title="Today's Sales Prediction"
      description={description}
      value={value}
    />
  );
}
