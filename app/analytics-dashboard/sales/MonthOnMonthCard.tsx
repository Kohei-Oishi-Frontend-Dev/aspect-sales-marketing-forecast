import KpiCard from "./KpiCard";
import { abbreviateNumber } from "@/lib/utils";
import type {SalesMonthOnMonth} from "./KpiList";

type Props = {
  salesData?: SalesMonthOnMonth;
};

export default function MonthOnMonthCard({ salesData }: Props) {
  const monthlyRevenue =
    salesData?.current_period?.value != null &&
    !Number.isNaN(Number(salesData.current_period.value))
      ? `£${abbreviateNumber(Number(salesData.current_period.value), 2)}`
      : "N/A";
  const revenueTrend = salesData?.change?.direction;
  const change = salesData?.change?.absolute;

  const description = (() => {
    const trendText = revenueTrend === "decrease" ? "up by" : "down by";
    const changeValue =
      change != null && !Number.isNaN(Number(change))
        ? abbreviateNumber(Math.abs(Number(change)), 2)
        : "N/A";
    return `${trendText} £${changeValue}`;
  })();

  return (
    <KpiCard
      title="Last Month Revenue"
      description={description}
      value={monthlyRevenue}
    />
  );
}
