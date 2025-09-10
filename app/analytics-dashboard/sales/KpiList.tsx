import KpiCard from "./KpiCard";

export default async function KpiList() {
//  const response = await fetch(""); // fetching KPI api endpoints
//  const todos = await response.json(); // converting into json
 // returning it as list of KpiCard
  return (
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
  );
}
