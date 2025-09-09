import { ChartAreaInteractive } from "@/components/ui/ChartAreaInteractive";
// import { RadarCharts } form "@/components/ui/Radar"
import KpiCard from "./KpiCard";
import SalesForecastNarrative from "./SalesForecastNarrative";

export default function SalesForecast() {
  return (
    <div className="flex flex-col gap-4">
      {/* KPI row: each KPI has a max width so at least 3 cards fit per row on typical screens */}
      <div className="flex flex-row justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-[220px] max-w-[360px]">
          <KpiCard
            title="Monthly Revenue"
            description="vs last month"
            value="£123,456"
          />
        </div>
        <div className="flex-1 min-w-[220px] max-w-[360px]">
          <KpiCard
            title="New Customers"
            description="last 30 days"
            value="1,234"
          />
        </div>
        <div className="flex-1 min-w-[220px] max-w-[360px]">
          <KpiCard
            title="Conversion Rate"
            description="trial → paid"
            value="4.3%"
          />
        </div>
      </div>
      <SalesForecastNarrative />
      <div className="">
        <ChartAreaInteractive />
        {/* <RadarCharts /> */}
      </div>
    </div>
  );
}
