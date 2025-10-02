import { abbreviateNumber } from "@/lib/utils";

export default function DynamicTable({
  payload,
}: {
  payload: unknown;
}): React.ReactElement | null {
  if (!payload || typeof payload !== "object") return null;

  // defensive path helpers - fix the casting
  const chart = (payload as any).chart ?? null;
  const config = chart?.config ?? null;
  const columns: Array<{ title?: string; dataIndex?: string; key?: string }> =
    Array.isArray(config?.columns) ? config.columns : [];
  const rows: any[] = Array.isArray(chart?.data) ? chart.data : [];

  // helper to read nested keys like "a.b.c" (defensive)
  const getValue = (obj: any, path?: string) => {
    if (!path) return undefined;
    const parts = String(path).split(".");
    let cur = obj;
    for (const p of parts) {
      if (cur == null) return undefined;
      cur = cur[p];
    }
    return cur;
  };

  if (!columns.length) {
    return (
      <div className="text-sm text-gray-500">
        No columns defined in payload.chart.config.columns
      </div>
    );
  }

  return (
    <div className="w-full overflow-auto rounded-lg border bg-white shadow-sm">
      <table className="min-w-full table-fixed border-collapse">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col, idx) => {
              const key = col.dataIndex ?? col.key ?? `col-${idx}`;
              return (
                <th
                  key={key}
                  className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wide"
                >
                  {col.title ?? key}
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody className="divide-y">
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-3 py-4 text-sm text-gray-500"
              >
                No rows
              </td>
            </tr>
          ) : (
            rows.map((row, rIdx) => (
              <tr
                key={rIdx}
                className={rIdx % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                {columns.map((col, cIdx) => {
                  const dataIndex = col.dataIndex ?? col.key ?? String(cIdx);
                  const cell = getValue(row, dataIndex);
                  const isSalesKey = /sales/i.test(String(dataIndex));
                  const formatted =
                    cell === null || typeof cell === "undefined"
                      ? ""
                      : typeof cell === "number"
                      ? isSalesKey
                        ? abbreviateNumber(cell, 2)
                        : String(cell)
                      : typeof cell === "object"
                      ? JSON.stringify(cell)
                      : String(cell);
                  return (
                    <td
                      key={`${rIdx}-${dataIndex}`}
                      className="px-3 py-2 text-sm text-gray-700 align-top"
                    >
                      {formatted}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
