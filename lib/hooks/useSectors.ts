import { useQuery } from "@tanstack/react-query";

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export type Option = { id: string; label: string };

export function useSectors() {
  return useQuery<Option[]>({
    queryKey: ["sectors"],
    queryFn: async () => {
      const res = await fetch("/api/sector", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load sectors");
      const data: Array<{ sector: string }> = await res.json();
      return data.map((d) => ({ id: slugify(d.sector), label: d.sector }));
    },
    staleTime: Infinity,
    cacheTime: Infinity,
  });
}