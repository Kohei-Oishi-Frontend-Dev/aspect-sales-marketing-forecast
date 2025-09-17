// import { ChartAreaInteractive } from "@/components/ui/ChartAreaInteractive";
import SalesForecastNarrative from "./SalesForecastNarrative";
import KpiList from "./KpiList";
import SalesPredictionAreaChart from "./SalesPredictionAreaChart";
import SalesActualPredDailyAreaChart from "./SalesActualPredDailyAreaChart";
import SalesActualPredMonthlyAreaChart from "./SalesActualPredMonthlyAreaChart";

export default function SalesForecast() {
  return (
    <div className="flex flex-col gap-4">
      <KpiList />
      <SalesForecastNarrative />
      <div className="">
        <SalesPredictionAreaChart />
      </div>
      <div className="">
        <SalesActualPredDailyAreaChart />
      </div>
      <div className="">
        <SalesActualPredMonthlyAreaChart />
      </div>
      {/* <ChartAreaInteractive /> */}
    </div>
  );
}
