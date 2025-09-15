import { ChartAreaInteractive } from "@/components/ui/ChartAreaInteractive";
import SalesForecastNarrative from "./SalesForecastNarrative";
import KpiList from "./KpiList";
import { SalesPredictionAreaChart } from "@/components/ui/SalesPredictionAreaChart";


export default function SalesForecast() {
  return (
    <div className="flex flex-col gap-4">
      <KpiList />
      <SalesForecastNarrative />
      <div className="">
        <SalesPredictionAreaChart />
      </div>
      <ChartAreaInteractive />
    </div>
  );
}
