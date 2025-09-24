export default function Loading() {
  return (
    <div className="p-6 space-y-6">
      <div className="animate-pulse space-y-4">
        <div className="flex flex-row justify-center gap-3 ">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-8 bg-gray-200 rounded w-1/3" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-28 bg-gray-200 rounded" />
          <div className="h-28 bg-gray-200 rounded" />
          <div className="h-28 bg-gray-200 rounded" />
        </div>

        <div className="h-96 bg-gray-200 rounded" />
      </div>

      {/* brief status for accessibility / clarity */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600" aria-live="polite">
          Loading analytics… fetching KPIs, forecasts and charts.
        </p>
      </div>
    </div>
  );
}
