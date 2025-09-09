"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardSideNav() {
  const pathname = usePathname() || "/analytics-dashboard";

  const linkClass = (path: string) =>
    pathname === path
      ? "block font-semibold text-blue-600"
      : "block text-gray-700";

  return (
    <div className="w-64 p-4 bg-white border-r">
      <ul className="space-y-2 text-sm">
        <li>
          <Link
            href="/analytics-dashboard/sales"
            className={linkClass("/analytics-dashboard/sales")}
          >
            Sales
          </Link>
        </li>
        <li>
          <Link
            href="/analytics-dashboard/marketing"
            className={linkClass("/analytics-dashboard/marketing")}
          >
            Marketing
          </Link>
        </li>
      </ul>
    </div>
  );
}
