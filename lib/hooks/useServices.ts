import { useQuery } from "@tanstack/react-query";

export type Option = { id: string; label: string };

export function useServices() {
  return useQuery<Option[]>({
    queryKey: ["services"],
    queryFn: async () => {
      const res = await fetch("/api/service", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load services");
      const data: Array<{ service: string }> = await res.json();
      return data.map((d) => ({ id: d.service, label: d.service }));
    },
    staleTime: Infinity,
  });
}