// ...existing code...
import React from "react";

type SalesForecastNarrativeProps = {
  children?: React.ReactNode;
  className?: string;
};

export default function SalesForecastNarrative({
  children,
  className = "",
}: SalesForecastNarrativeProps) {
  return (
    <p
      className={
        "border border-gray-200 rounded-lg p-5 bg-white shadow-sm w-full block text-sm text-gray-700 leading-relaxed max-w-full break-words " +
        className
      }
    >
      {children ?? (
        <>
          This narrative provides a concise summary of the sales forecast and
          key takeaways. It spans the full width of its container so it lines up
          with charts and KPI cards. Add more detail here as needed.
        </>
      )}
    </p>
  );
}
//
