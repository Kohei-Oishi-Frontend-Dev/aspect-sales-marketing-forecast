import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { PrismaClient } from "@/lib/generated/prisma";
import UserPreference from "../components/UserPreference";
import QueryProvider from "@/app/components/QueryProvider";

const prisma = new PrismaClient();

export default async function OnboardingPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  // fetch lookup lists server-side (call internal API routes)
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const [sectorsRes, servicesRes, regionsRes] = await Promise.all([
    fetch(new URL("/api/sector", base).toString(), { cache: "no-store" }),
    fetch(new URL("/api/service", base).toString(), { cache: "no-store" }),
    fetch(new URL("/api/region", base).toString(), { cache: "no-store" }),
  ]);

  const sectors = (await sectorsRes.json()).map((d: any) => ({ id: d.sector, label: d.sector }));
  const services = (await servicesRes.json()).map((d: any) => ({ id: d.service, label: d.service }));
  const regions = (await regionsRes.json()).map((d: any) => ({ id: d.region, label: d.region }));

  return (
    <QueryProvider initialLookups={{ sectors, services, regions }}>
      <UserPreference />
    </QueryProvider>
  );
}
