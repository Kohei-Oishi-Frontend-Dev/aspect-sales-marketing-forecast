"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/Checkbox";
import { toast } from "sonner";
import { useUserPreference } from "@/lib/hooks/useUserPreference";
import { useSectors } from "@/lib/hooks/useSectors";
import { useServices } from "@/lib/hooks/useServices";
import { useRegions } from "@/lib/hooks/useRegions";

type UserPreferences = {
  sectors: string[];
  regions: string[];
  services: string[];
};

export default function UserPreference() {
  // fetch static lists from the API (cached globally)
  const { data: sectorOptions = [], isLoading: sectorsLoading } = useSectors();
  const { data: serviceOptions = [], isLoading: servicesLoading } = useServices();
  const { data: regionOptions = [], isLoading: regionsLoading } = useRegions();

  const {
    data: prefFromServer,
    savePreference,
    isLoading: isPrefLoading,
  } = useUserPreference();
  const router = useRouter();

  const [preferences, setPreferences] = useState<UserPreferences>({
    sectors: [],
    regions: [],
    services: [],
  });

  // selectAll flags per category; true -> send [""] for that category
  const [selectAll, setSelectAll] = useState<Record<keyof UserPreferences, boolean>>({
    sectors: false,
    regions: false,
    services: false,
  });

  useEffect(() => {
    // only initialize from server if server data exists and user hasn't interacted yet
    const isEmpty = (obj: UserPreferences) =>
      obj.sectors.length === 0 && obj.regions.length === 0 && obj.services.length === 0;

    if (prefFromServer && isEmpty(preferences)) {
      setPreferences({
        sectors: Array.isArray(prefFromServer.sectors) ? prefFromServer.sectors : [],
        regions: Array.isArray(prefFromServer.regions) ? prefFromServer.regions : [],
        services: Array.isArray(prefFromServer.services) ? prefFromServer.services : [],
      });

      // if server pref includes "" treat that as select-all for UI
      setSelectAll({
        sectors: Array.isArray(prefFromServer.sectors) && prefFromServer.sectors.includes(""),
        regions: Array.isArray(prefFromServer.regions) && prefFromServer.regions.includes(""),
        services: Array.isArray(prefFromServer.services) && prefFromServer.services.includes(""),
      });
    }
  }, [prefFromServer]); // do not depend on preferences to avoid overwriting user edits

  const [isLoading, setIsLoading] = useState(false);

  // track whether user has interacted with each section (for showing validation)
  const [touched, setTouched] = useState<Record<keyof UserPreferences, boolean>>({
    sectors: false,
    regions: false,
    services: false,
  });

  // CURRENT: allow only 1 selection per section (will expand later)
  const handleCheckboxChange = (
    category: keyof UserPreferences,
    value: string,
    checked: boolean
  ) => {
    // mark section as touched
    setTouched((t) => ({ ...t, [category]: true }));

    // if user interacts with an individual checkbox, turn off select-all for that category
    setSelectAll((s) => ({ ...s, [category]: false }));

    setPreferences((prev) => {
      if (checked) {
        // enforce max 1 selection now: replace array with single selected value
        return { ...prev, [category]: [value] } as UserPreferences;
      } else {
        // uncheck: remove value
        return {
          ...prev,
          [category]: prev[category].filter((item) => item !== value),
        } as UserPreferences;
      }
    });
  };

  const handleSelectAllChange = (category: keyof UserPreferences, checked: boolean) => {
    setTouched((t) => ({ ...t, [category]: true }));
    setSelectAll((s) => ({ ...s, [category]: checked }));
    if (checked) {
      // marker for "all" per your request: store empty string in array
      setPreferences((prev) => ({ ...prev, [category]: ["" as string] }));
    } else {
      // clear selection when unchecking select-all
      setPreferences((prev) => ({ ...prev, [category]: [] }));
    }
  };

  // simple validation helper
  const isValid = (): boolean =>
    preferences.sectors.length >= 1 &&
    preferences.regions.length >= 1 &&
    preferences.services.length >= 1;

  const handleSubmit = async () => {
    // mark all as touched on submit to show errors if any
    setTouched({ sectors: true, regions: true, services: true });

    if (!isValid()) {
      toast.error("Please select at least one option from each category");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/user/preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preferences),
      });

      if (!response.ok) {
        throw new Error("Failed to save preferences");
      }

      toast.success("Preferences saved successfully!");
      router.push("/analytics-dashboard");
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast.error("Failed to save preferences. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderSection = (
    title: string,
    description: string,
    items: { id: string; label: string }[],
    category: keyof UserPreferences
  ) => {
    const showError = touched[category] && preferences[category].length === 0;

    // sort items by label (case-insensitive) before rendering
    const sorted = [...items].sort((a, b) =>
      a.label.localeCompare(b.label, undefined, { sensitivity: "base" })
    );

    return (
      <Card key={category}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
          {/* Select All checkbox placed right after description */}
          <div className="mt-2 flex items-center gap-2">
            <Checkbox
              id={`${category}-select-all`}
              checked={selectAll[category]}
              onCheckedChange={(c) => handleSelectAllChange(category, c as boolean)}
            />
            <label htmlFor={`${category}-select-all`} className="text-sm cursor-pointer">
              Select all
            </label>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sorted.map((item) => (
              <div key={item.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`${category}-${item.id}`}
                  // disable individual item when select-all is active
                  checked={!selectAll[category] && preferences[category].includes(item.id)}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(category, item.id, checked as boolean)
                  }
                  disabled={selectAll[category]}
                />
                <label
                  htmlFor={`${category}-${item.id}`}
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  {item.label}
                </label>
              </div>
            ))}
          </div>
          {showError && (
            <p className="mt-3 text-sm text-red-600">
              Please select at least one option for {title.toLowerCase()}.
            </p>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 rounded-md">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Set Your Preferences
          </h1>
          <p className="text-lg text-gray-600">
            Help us personalize your experience by selecting your areas of
            interest
          </p>
        </div>

        <div className="space-y-8">
          {renderSection(
            "Sectors",
            "Select the sectors you're interested in or work with",
            sectorOptions,
            "sectors"
          )}

          {renderSection(
            "Services",
            "Choose the services you provide or need",
            serviceOptions,
            "services"
          )}

          {renderSection(
            "Regions",
            "Select the regions where you operate or are interested in",
            regionOptions,
            "regions"
          )}
        </div>

        {!isValid() && (
          <div className="text-center text-sm text-red-600 mt-4">
            Please choose at least 1 option from each section.
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Back
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !isValid()}
            className="min-w-[200px]"
          >
            {isLoading ? "Saving..." : "Save Preferences & Continue"}
          </Button>
        </div>

        {/* Progress indicator */}
        <div className="text-center text-sm text-gray-500">
          <p>
            Selected: {preferences.sectors.length} sectors,{" "}
            {preferences.services.length} services, {preferences.regions.length}{" "}
            regions
          </p>
        </div>
      </div>
    </div>
  );
}
