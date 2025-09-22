import React from "react";
import type {salesNarrativeData} from "./page";

type SalesForecastNarrativeProps = {
  className?: string;
  salesNarrativeData?: salesNarrativeData;
};

export default async function SalesForecastNarrative({
  className = "",
  salesNarrativeData,
}: SalesForecastNarrativeProps) {
  return (
    <div
      className={
        "border border-gray-200 rounded-lg p-5 bg-white shadow-sm w-full block text-sm text-gray-700 leading-relaxed max-w-full break-words " +
        className
      }
    >
      {salesNarrativeData ? (
        <p>{String(salesNarrativeData.narrative ?? "")}</p>
      ) : null}
    </div>
  );
}
