import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import QueryProvider from "@/app/components/QueryProvider";
import SalesDashboardClient from "./SalesDashboardClient";
import { PrismaClient } from "@/lib/generated/prisma";
import { getInitialAllChartsData } from "@/lib/services/sales.server";

const prisma = new PrismaClient();

export default async function SalesPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  // load user's saved preferences (if any) so we can pass sector/region into the KPI call
  const pref = await prisma.userPreference.findUnique({
    where: { userId: session.user.id },
  });

  const initialFilters = {
    sector: pref?.sectors?.[0] ?? null,
    region: pref?.regions?.[0] ?? null,
    service: pref?.services?.[0] ?? null,
  };

  // fetch lookup lists server-side (call your internal API routes)
  const [sectorsRes, servicesRes, regionsRes] = await Promise.all([
    fetch(
      new URL("/api/v1/analysis/sector", process.env.API_BASE_URL).toString(),
      { cache: "no-store" }
    ),
    fetch(
      new URL(
        "/api/v1/analysis/service",
        process.env.API_BASE_URL
      ).toString(),
      {
        cache: "no-store",
      }
    ),
    fetch(new URL("/api/v1/analysis/region", process.env.API_BASE_URL).toString(), {
      cache: "no-store",
    }),
  ]);

  console.log(sectorsRes);
  console.log(typeof servicesRes);
  console.log(typeof regionsRes);

  type SectorRow = { sector: string };
  type ServiceRow = { service: string };
  type RegionRow = { region: string };
  
  const sectors = (await sectorsRes.json() as SectorRow[]).map(({ sector }) => ({
    id: sector,
    label: sector,
  }));
  const services = (await servicesRes.json() as ServiceRow[]).map(({ service }) => ({
    id: service,
    label: service,
  }));
  const regions = (await regionsRes.json() as RegionRow[]).map(({ region }) => ({
    id: region,
    label: region,
  }));

  // pass initialFilters into the initial-data loader so the server can request KPI data
  const { allChartsData, narrative } = await getInitialAllChartsData({
    sector: initialFilters.sector,
    region: initialFilters.region,
    service: initialFilters.service,
  });

  return (
    <QueryProvider initialLookups={{ sectors, services, regions }}>
      <SalesDashboardClient
        initialAllChartsData={allChartsData}
        initialNarrativeData={narrative}
        initialFilters={initialFilters}
      />
    </QueryProvider>
  );
}
