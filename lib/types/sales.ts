export type SalesPrediction = {
  date: string;
  pred_sale: number;
  upper_bound: number;
  lower_bound: number;
};

export type monthlyPredictionData = {
  date: string | null;
  actual_sales?: number | null;
  predicted_sales?: number | null;
  upper_bound?: number | null;
  lower_bound?: number | null;
};

export type dailyPredictionData = monthlyPredictionData;

export type SalesMonthOnMonth = {
  months: { month: string; value: number }[];
};

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