import { abbreviateNumber } from "@/lib/utils";

export default function DynamicTable({
  payload,
}: {
  payload: unknown;
}): React.ReactElement | null {
  if (!payload || typeof payload !== "object") return null;

  // small runtime type-helpers to avoid `any`
  function isRecord(v: unknown): v is Record<string, unknown> {
    return v !== null && typeof v === "object" && !Array.isArray(v);
  }

  // extract chart/config defensively
  const chartRaw = isRecord(payload)
    ? (payload as Record<string, unknown>)["chart"]
    : undefined;
  const chart = isRecord(chartRaw) ? chartRaw : undefined;
  const configRaw = chart ? chart["config"] : undefined;
  const config = isRecord(configRaw) ? configRaw : undefined;

  type Column = { title?: string; dataIndex?: string; key?: string };
  const columns: Column[] = Array.isArray(config?.["columns"])
    ? (config!["columns"] as unknown[]).filter(isRecord).map((c) => ({
        title: String((c as Record<string, unknown>)["title"] ?? undefined),
        dataIndex: (c as Record<string, unknown>)["dataIndex"] as
          | string
          | undefined,
        key: (c as Record<string, unknown>)["key"] as string | undefined,
      }))
    : [];

  const rows: unknown[] = Array.isArray(chart?.["data"])
    ? (chart!["data"] as unknown[])
    : [];

  // helper to read nested keys like "a.b.c" (defensive)
  const getValue = (obj: unknown, path?: string) => {
    if (!path) return undefined;
    let cur: unknown = obj;
    for (const p of String(path).split(".")) {
      if (cur == null) return undefined;
      if (isRecord(cur)) {
        cur = cur[p];
      } else if (Array.isArray(cur)) {
        const idx = Number(p);
        cur = Number.isFinite(idx) ? cur[idx] : undefined;
      } else {
        return undefined;
      }
    }
    return cur;
  };
  // end of defensive parsing

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
