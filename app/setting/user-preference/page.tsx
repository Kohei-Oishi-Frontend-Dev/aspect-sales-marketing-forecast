import UserPreference from "../../components/UserPreference";
import { getServerBaseUrl } from "@/lib/utils";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { PrismaClient } from "@/lib/generated/prisma";

export default async function UserPreferencePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const prisma = new PrismaClient();

  // Get preferences directly from DB instead of HTTP call
  const userPref = session
    ? await prisma.userPreference.findUnique({
        where: { userId: session.user.id },
      })
    : null;

  const initialPreferences = userPref
    ? {
        sectors: userPref.sectors ?? [],
        regions: userPref.regions ?? [],
        services: userPref.services ?? [],
      }
    : null;

  const base = getServerBaseUrl();

  // fetch lookup lists server-side (no preferences fetch needed)
  const [sectorsRes, servicesRes, regionsRes] = await Promise.all([
    fetch(new URL("/api/v1/analysis/sector", base).toString(), {
      cache: "no-store",
    }),
    fetch(new URL("/api/v1/analysis/service", base).toString(), {
      cache: "no-store",
    }),
    fetch(new URL("/api/v1/analysis/region", base).toString(), {
      cache: "no-store",
    }),
  ]);

  type SectorRow = { sector: string };
  type ServiceRow = { service: string };
  type RegionRow = { region: string };
  const sectors = ((await sectorsRes.json()) as SectorRow[]).map(
    ({ sector }) => ({
      id: sector,
      label: sector,
    })
  );
  const services = ((await servicesRes.json()) as ServiceRow[]).map(
    ({ service }) => ({
      id: service,
      label: service,
    })
  );
  const regions = ((await regionsRes.json()) as RegionRow[]).map(
    ({ region }) => ({
      id: region,
      label: region,
    })
  );

  return (
    <UserPreference
      initialLookups={{ sectors, services, regions }}
      initialPreferences={initialPreferences}
    />
  );
}
