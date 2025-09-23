import KpiCard from "./KpiCard";
import { abbreviateNumber, getCurrentMonth } from "@/lib/utils";
import { monthlyPredictionData } from "@/lib/types/sales";

type Props = {
  nextMonthForecastData?: monthlyPredictionData[];
};

function getMonthAgo(): string {
  const now = new Date();
  now.setMonth(now.getMonth() - 1);
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export default function NextMonthSalesPredictionCard({
  nextMonthForecastData,
}: Props) {
  const currentMonth = getCurrentMonth();
  const monthAgo = getMonthAgo();

  // Find data for current month and month ago
  const currentMonthData = nextMonthForecastData?.find(
    (d) => d.date === currentMonth
  );
  const monthAgoData = nextMonthForecastData?.find((d) => d.date === monthAgo);

  // Get predicted sales for current month
  const currentMonthPredictedSales = currentMonthData?.predicted_sales;

  // Get actual sales from month ago
  const monthAgoActualSales = monthAgoData?.actual_sales;

  // Calculate values for display
  const value =
    currentMonthPredictedSales != null &&
    !Number.isNaN(Number(currentMonthPredictedSales))
      ? `£${abbreviateNumber(Number(currentMonthPredictedSales), 2)}`
      : "N/A";

  const description = (() => {
    if (
      currentMonthPredictedSales == null ||
      monthAgoActualSales == null ||
      Number.isNaN(Number(currentMonthPredictedSales)) ||
      Number.isNaN(Number(monthAgoActualSales))
    ) {
      return "vs last month";
    }

    const difference =
      Number(currentMonthPredictedSales) - Number(monthAgoActualSales);
    const isIncrease = difference > 0;
    const trendText = isIncrease ? "up by" : "down by";
    const changeValue = abbreviateNumber(Math.abs(difference), 2);

    return `${trendText} £${changeValue}`;
  })();

  return (
    <KpiCard
      title="Next Month Revenue Prediction"
      description={description}
      value={value}
    />
  );
}
