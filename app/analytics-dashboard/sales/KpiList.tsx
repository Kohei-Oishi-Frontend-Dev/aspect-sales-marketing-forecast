import MonthOnMonthCard from "./MonthOnMonthCard";
import KpiCard from "./KpiCard";
import { join } from "path";
import { readFileSync } from "fs";

export type SalesMonthOnMonth = {
  success?: boolean;
  metric?: string;
  current_period?: {
    value?: number;
    period?: string;
    direction?: string | null;
    date?: string | null;
    label?: string;
  };
  comparison_period?: {
    value?: number;
    period?: string;
    direction?: string | null;
    date?: string | null;
    label?: string;
  };
  change?: {
    absolute?: number | null;
    percentage?: number | null;
    direction?: string | null;
  };
  trend?: unknown;
  filters?: Record<string, unknown>;
  execution_timestamp?: string;
};

export default async function KpiList() {
  const filePath = join(process.cwd(), "public", "sales_month_on_month.json");
  const fileContents = readFileSync(filePath, "utf8");
  const salesData = JSON.parse(fileContents);
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
