"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  MenuCollapseIcon,
  SaleTag02Icon,
  Target02Icon,
  ArrowExpandIcon,
  LogoutSquare01Icon,
} from "@hugeicons/core-free-icons";
import { logoutAction } from "@/lib/actions/auth-actions";
export default function DashboardSideNav() {
  const pathname = usePathname() || "/analytics-dashboard";
  const [collapsed, setCollapsed] = useState(false);

  const linkClass = (path: string) =>
    pathname === path
      ? "block font-semibold text-blue-600"
      : "block text-gray-700";

  return (
    <aside
      className={`flex flex-col items-stretch rounded-lg bg-white shadow transition-all duration-200 ${
        collapsed ? "w-12" : "w-32"
      }`}
    >
      <div className="flex flex-row justify-end px-2 py-2">
        <button
          aria-label={collapsed ? "Expand side nav" : "Collapse side nav"}
          onClick={() => setCollapsed((s) => !s)}
          className="p-1 rounded hover:bg-gray-100"
          title={collapsed ? "Expand" : "Collapse"}
        >
          {collapsed ? (
            <HugeiconsIcon icon={ArrowExpandIcon} />
          ) : (
            <HugeiconsIcon icon={MenuCollapseIcon} />
          )}
        </button>
      </div>

      <nav className="px-1 py-2">
        <ul className="space-y-2 text-sm">
          <li>
            <Link
              href="/analytics-dashboard/sales"
              className={`${linkClass(
                "/analytics-dashboard/sales"
              )} flex items-center gap-2 px-2 py-1 ${
                collapsed ? "justify-center" : ""
              }`}
              title="Sales"
            >
              <HugeiconsIcon icon={SaleTag02Icon} />
              <span className={`${collapsed ? "hidden" : "block"}`}>Sales</span>
            </Link>
          </li>

          <li>
            <Link
              href="/analytics-dashboard/marketing"
              className={`${linkClass(
                "/analytics-dashboard/marketing"
              )} flex items-center gap-2 px-2 py-1 ${
                collapsed ? "justify-center" : ""
              }`}
              title="Marketing"
            >
              <HugeiconsIcon icon={Target02Icon} />
              <span className={`${collapsed ? "hidden" : "block"}`}>
                Marketing
              </span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* logout button pinned to bottom */}
      <div className="mt-auto px-2 py-2">
        <form
          action={async () => {
            await logoutAction();
          }}
        >
          <button
            type="submit"
            aria-label="Logout"
            className={`w-full rounded-md px-2 py-2 text-sm text-white bg-aspect-blue hover:opacity-90 transition flex flex-row items-center gap-2 ${
              collapsed ? "px-0" : ""
            }`}
          >
            <HugeiconsIcon icon={LogoutSquare01Icon} />
            <span className={`${collapsed ? "hidden" : "inline"}`}>Logout</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
