import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import UserPreference from "../components/UserPreference";
import { PrismaClient } from "@/lib/generated/prisma";
import type { UserPreference as UserPreferenceType } from "@/lib/types/userPreference";

export default async function OnboardingPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  // fetch user's saved preferences server-side to avoid client flash
  const prisma = new PrismaClient();
  const userPref = (await prisma.userPreference.findUnique({
    where: { userId: session.user.id },
  })) as UserPreferenceType | null;

  // ensure all fields are concrete string[] so the client component's required shape is satisfied
  const initialPreferences =
    userPref !== null && userPref !== undefined
      ? {
          sectors: userPref.sectors ?? [],
          regions: userPref.regions ?? [],
          services: userPref.services ?? [],
        }
      : null;

  // fetch lookup lists server-side (call internal API routes)
  const base = process.env.API_BASE_URL ?? "http://localhost:3000";
  const [sectorsRes, servicesRes, regionsRes] = await Promise.all([
    fetch(new URL("/api/sector", base).toString(), { cache: "no-store" }),
    fetch(new URL("/api/service", base).toString(), { cache: "no-store" }),
    fetch(new URL("/api/region", base).toString(), { cache: "no-store" }),
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
