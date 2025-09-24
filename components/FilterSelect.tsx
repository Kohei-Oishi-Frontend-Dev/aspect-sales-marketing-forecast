import React from "react";

export default function FilterSelect({
  label,
  value,
  onChange,
  options,
  width,
}: {
  label: string;
  value?: string | null;
  onChange: (v: string | null) => void;
  options: { value: string; label: string }[];
  // optional: number (px) or CSS width string (e.g. "12rem", "200px")
  width?: number | string;
}) {
  const style =
    width === undefined
      ? undefined
      : typeof width === "number"
      ? { width: `${width}px` }
      : { width: width };

  return (
    <label className="flex items-center gap-2">
      <span className="text-sm">{label}</span>
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || null)}
        // default fixed width (w-48) unless inline style override provided
        className={`ml-2 rounded-md border px-2 py-2 ${style ? "" : "w-48"}`}
        style={style}
      >
        <option value="">All</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
