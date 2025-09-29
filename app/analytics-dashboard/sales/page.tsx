import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import QueryProvider from "@/app/components/QueryProvider";
import SalesDashboardClient from "./SalesDashboardClient";
import { PrismaClient } from "@/lib/generated/prisma";
import {
  getInitialAllChartsData,
  fetchSectors,
  fetchServices,
  fetchRegions,
} from "@/lib/services/sales.server";

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

  // fetch lookup lists directly from external API via server functions
  const [sectorsData, servicesData, regionsData] = await Promise.all([
    fetchSectors(),
    fetchServices(),
    fetchRegions(),
  ]);

  const sectors = sectorsData.map(({ sector }) => ({
    id: sector,
    label: sector,
  }));
  const services = servicesData.map(({ service }) => ({
    id: service,
    label: service,
  }));
  const regions = regionsData.map(({ region }) => ({
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
