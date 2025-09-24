import { useQuery } from "@tanstack/react-query";

export type Option = { id: string; label: string };

export function useSectors() {
  return useQuery<Option[]>({
    queryKey: ["sectors"],
    queryFn: async () => {
      const res = await fetch("/api/sector", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load sectors");
      const data: Array<{ sector: string }> = await res.json();
      return data.map((d) => ({ id: d.sector, label: d.sector }));
    },
    staleTime: Infinity,
  });
}