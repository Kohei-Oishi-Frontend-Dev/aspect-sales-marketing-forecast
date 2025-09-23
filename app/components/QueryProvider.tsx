"use client"
import {useState, useEffect} from "react";
import {QueryClientProvider, QueryClient} from "@tanstack/react-query"

interface Props{
    children : React.ReactNode
}

export default function QueryProvider({children} : Props){
const [queryClient] = useState(() => {
  const qc = new QueryClient();
  // set default options including cacheTime — cast to any because your installed @tanstack/react-query types may not include cacheTime
  (qc as any).setDefaultOptions?.({
    queries: { staleTime: Infinity, cacheTime: 1000 * 60 * 60 }, // 1 hour cache by default
  });
  return qc;
});

// small slug helper reused for all lists
const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// prefetch static lookup lists once on client boot (keeps them global)
useEffect(() => {
  queryClient.prefetchQuery({
    queryKey: ["sectors"],
    queryFn: async () => {
      const res = await fetch("/api/sector");
      if (!res.ok) throw new Error("prefetch sectors failed");
      const data: Array<{ sector: string }> = await res.json();
      return data.map((d) => ({ id: d.sector.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""), label: d.sector }));
    },
    staleTime: Infinity,
  });

  queryClient.prefetchQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const res = await fetch("/api/service");
      if (!res.ok) throw new Error("prefetch services failed");
      const data: Array<{ service: string }> = await res.json();
      return data.map((d) => ({ id: d.service.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""), label: d.service }));
    },
    staleTime: Infinity,
  });

  // prefetch regions and cache globally
  queryClient.prefetchQuery({
    queryKey: ["regions"],
    queryFn: async () => {
      const res = await fetch("/api/region");
      if (!res.ok) throw new Error("prefetch regions failed");
      const data: Array<{ region: string }> = await res.json();
      return data.map((d) => ({ id: slugify(d.region), label: d.region }));
    },
    staleTime: Infinity,
  });
}, [queryClient]);

return <QueryClientProvider client= {queryClient}> {children} </QueryClientProvider>
}