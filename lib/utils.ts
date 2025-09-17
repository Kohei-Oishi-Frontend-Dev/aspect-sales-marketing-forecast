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