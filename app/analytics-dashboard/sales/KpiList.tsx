import MonthOnMonthCard from "./MonthOnMonthCard";
import KpiCard from "./KpiCard";

export type SalesDatum = {
  month: string;
  revenue: number;
  orders?: number;
  customers?: number;
  changePercent?: number;
};

export default async function KpiList() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const response = await fetch(`${baseUrl}/sales_month_on_month.json`, {
    cache: "no-store",
  });

  const salesData = await response.json();

  return (
    <div className="flex flex-row justify-between gap-4 flex-wrap">
      <div className="flex-1 min-w-[220px] max-w-[360px]">
        <MonthOnMonthCard salesData={salesData} />
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
