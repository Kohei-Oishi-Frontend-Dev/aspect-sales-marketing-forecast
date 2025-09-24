import UserPreference from "../../components/UserPreference";
import { getServerBaseUrl } from "@/lib/utils";

export default async function UserPreferencePage() {
  const base = getServerBaseUrl(); // throws if not configured

  // fetch lookup lists server-side
  const [sectorsRes, servicesRes, regionsRes, prefRes] = await Promise.all([
    fetch(new URL("/api/sector", base).toString(), { cache: "no-store" }),
    fetch(new URL("/api/service", base).toString(), { cache: "no-store" }),
    fetch(new URL("/api/region", base).toString(), { cache: "no-store" }),
    fetch(new URL("/api/user/preferences", base).toString(), {
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

  // API may return { preferences } or preferences directly
  const prefJson = await prefRes.json().catch(() => null);
  const initialPreferences = prefJson ? prefJson.preferences ?? prefJson : null;

  return (
    <UserPreference
      initialLookups={{ sectors, services, regions }}
      initialPreferences={initialPreferences}
    />
  );
}
