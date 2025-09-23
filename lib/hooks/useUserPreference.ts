import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export type UserPreferences = {
  sectors: string[];
  regions: string[];
  services: string[];
};

export function useUserPreference(initialData?: UserPreferences | null) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["userPreference"],
    queryFn: async (): Promise<UserPreferences | null> => {
      const res = await fetch("/api/user/preferences", { cache: "no-store" });
      if (!res.ok) {
        // if 401 or not found, return null
        if (res.status === 401 || res.status === 404) return null;
        throw new Error(await res.text());
      }
      const json = await res.json();
      // route may return { preferences: ... } or preferences directly
      return json?.preferences ?? json ?? null;
    },
    enabled: true,
    // use server-provided data when available to avoid an extra roundtrip
    initialData: initialData ?? undefined,
    staleTime: 1000 * 60, // 1 minute
  });

  const mutation = useMutation({
    mutationFn: async (prefs: UserPreferences) => {
      const res = await fetch("/api/user/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prefs),
      });
      if (!res.ok) throw new Error(await res.text());
      const json = await res.json();
      return json?.preferences ?? json;
    },
    onSuccess: (data: UserPreferences | null) => {
      queryClient.setQueryData(["userPreference"], data);
    },
  });

  return {
    ...query,
    savePreference: (prefs: UserPreferences) => mutation.mutateAsync(prefs),
  };
}