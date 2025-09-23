import { useQuery } from "@tanstack/react-query";

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export type Option = { id: string; label: string };

export function useRegions() {
  return useQuery<Option[]>({
    queryKey: ["regions"],
    queryFn: async () => {
      const res = await fetch("/api/region", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load regions");
      const data: Array<{ region: string }> = await res.json();
      return data.map((d) => ({ id: slugify(d.region), label: d.region }));
    },
    staleTime: Infinity,
    cacheTime: Infinity,
  });
}