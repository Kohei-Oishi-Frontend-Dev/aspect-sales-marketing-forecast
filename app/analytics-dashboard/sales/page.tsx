import SalesDashboardClient from "./SalesDashboardClient";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getInitialAllChartsData } from "@/lib/services/sales.server";
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

export default async function SalesPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  // server service returns both initial charts and narrative
  const { allChartsData, narrative } = await getInitialAllChartsData();

  // load user's saved preferences (if any) and derive initial filter values
  const pref = await prisma.userPreference.findUnique({
    where: { userId: session.user.id },
  });

  const initialFilters = {
    sector: pref?.sectors?.[0] ?? null,
    region: pref?.regions?.[0] ?? null,
    service: pref?.services?.[0] ?? null,
  };

  return (
    <SalesDashboardClient
      initialAllChartsData={allChartsData}
      initialNarrativeData={narrative}
      initialFilters={initialFilters}
    />
  );
}
