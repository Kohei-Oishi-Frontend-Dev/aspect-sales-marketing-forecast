export type SalesPrediction = {
  date: string;
  pred_sale: number;
  upper_bound: number;
  lower_bound: number;
};

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

export type monthlyPredictionData = {
  date: string | null;
  actual_sales?: number | null;
  predicted_sales?: number | null;
  upper_bound?: number | null;
  lower_bound?: number | null;
};

export type dailyPredictionData = monthlyPredictionData;

export type AllChartsData = {
  salesMonthOnMonthData: SalesMonthOnMonth;
  salesPredictionData: SalesPrediction[];
  salesActualsPredMonthComparison: monthlyPredictionData[];
  salesActualsPredDailyComparison: dailyPredictionData[];
};

export type salesNarrativeData = {
  narrative: string;
  generated_at: string;
  execution_id: string;
};
