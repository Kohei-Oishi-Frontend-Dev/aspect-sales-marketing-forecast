import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function trimFloat(value: number, maxDecimals = 2): number {
  if (!Number.isFinite(value) || maxDecimals < 0) return value
  const factor = Math.pow(10, maxDecimals)
  return Math.trunc(value * factor) / factor
}

export function abbreviateNumber(value: number, maxDecimals = 1): string {
  if (!Number.isFinite(value)) return String(value)
  if (maxDecimals < 0) maxDecimals = 0

  const sign = value < 0 ? "-" : ""
  const abs = Math.abs(value)

  const units = [
    { value: 1e12, symbol: "T" },
    { value: 1e9, symbol: "B" },
    { value: 1e6, symbol: "M" },
    { value: 1e3, symbol: "k" },
  ]

  for (const unit of units) {
    if (abs >= unit.value) {
      const scaled = trimFloat(abs / unit.value, maxDecimals)
      return `${sign}${Number.isInteger(scaled) ? scaled.toFixed(0) : String(scaled)}${unit.symbol}`
    }
  }

  const small = trimFloat(abs, maxDecimals)
  return `${sign}${Number.isInteger(small) ? small.toFixed(0) : String(small)}`
}

export function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export function getCurrentDay(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export function isDateBeforeCurrentMonth(dateStr: string): boolean {
  const currentMonth = getCurrentMonth();
  return dateStr < currentMonth;
}