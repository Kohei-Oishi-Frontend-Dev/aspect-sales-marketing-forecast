import { ChartAreaInteractive } from "@/components/ui/ChartAreaInteractive";
// import { RadarCharts } form "@/components/ui/Radar"
import SalesForecastNarrative from "./SalesForecastNarrative";
import KpiList from "./KpiList";

export default function SalesForecast() {
  return (
    <div className="flex flex-col gap-4">
      <KpiList />
      <SalesForecastNarrative />
      <div className="">
        <ChartAreaInteractive />
        {/* <RadarCharts /> */}
      </div>
    </div>
  );
}
