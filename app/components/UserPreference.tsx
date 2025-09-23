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

// Static data - you can move this to a separate file or fetch from API
const SECTORS = [
  "Food and Beverage",
  "Home Owner",
  "Healthcare",
  "Office",
  "Property",
  "Retail",
  "Sports and Fitness",
  "Education",
  "Hotels",
  "Charity",
  "Foreign government",
  "Private Landlord",
  "Entertainment",
  "Religious Buildings",
  "Manufacturing",
  "Agriculture",
  "Council offices",
  "Housing",
  "Services",
  "NHS",
].map((s) => ({
  id: s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, ""),
  label: s,
}));

const SERVICES = [
  "Heating & Hot Water (Domestic)",
  "Plastering",
  "Bathroom Refurbishment",
  "Access",
  "Brickwork & Paving",
  "Leak Detection",
  "Pest Control",
  "Project Management Refurbishment",
  "Air Con, Ventilation & Refrigeration",
  "Wallpapering",
  "Drainage (Soil Water)",
  "Windows & Doors",
  "Locksmithing",
  "Insurance - Waste Services (Excluding waste disposal charges)",
  "Leak Detection Commercial Gas & Heating",
  "Roofing",
  "Plumbing & Cold Water",
  "Pest Proofing",
  "Insurance - Leak Detection",
  "Drainage (Tanker)",
  "Drainage (Wastewater)",
  "Fire Safety",
  "Electrical",
  "Heating & Hot Water (Commercial)",
  "Gardening",
  "Glazing",
  "Roofing/Leak Detection",
  "Decorating",
  "Carpentry",
  "Handyman",
  "Drainage (Septic Tanks)",
  "Drainage Restoration",
  "Roof Window & Gutter Cleaning",
  "Damp & Mould",
  "Leak Detection Restoration",
  "Flooring Trade",
  "Tiling",
  "Leak Detection Restoration Plumbing",
  "Fencing",
  "Rubbish Removal",
  "Utilities - Blended - Heating & Hot Water (Domestic)",
  "Vent Hygiene and Safety",
  "Leak Detection Restoration Drainage",
  "Partition Walls & Ceilings",
  "Leak Detection Restoration Central Heating",
  "Sanitisation & specialist cleaning",
  "Commercial Pumps",
  "Fire Safety Consultation",
  "Leak Detection Building Fabric",
  "Leak Detection Domestic Plumbing",
  "Leak Detection Industrial Plumbing",
  "Leak Detection Domestic Gas & Heating",
  "Damp Proofing",
  "Drainage Leak Detection",
  "Damp Survey",
  "LD Damp Restoration",
  "Mould Survey",
].map((s) => ({
  id: s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, ""),
  label: s,
}));

const REGIONS = [
  { id: "chessington", label: "Chessington" },
  { id: "south-west", label: "South West" },
  { id: "london", label: "London" },
  { id: "south-east", label: "South East" },
  { id: "north-west", label: "North West" },
  { id: "north-east", label: "North East" },
  { id: "midlands", label: "Midlands" },
  { id: "wales", label: "Wales" },
  { id: "scotland", label: "Scotland" },
  { id: "northern-ireland", label: "Northern Ireland" },
];

type UserPreferences = {
  sectors: string[];
  regions: string[];
  services: string[];
};

export default function UserPreference() {
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
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sorted.map((item) => (
              <div key={item.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`${category}-${item.id}`}
                  checked={preferences[category].includes(item.id)}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(category, item.id, checked as boolean)
                  }
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
            SECTORS,
            "sectors"
          )}

          {renderSection(
            "Services",
            "Choose the services you provide or need",
            SERVICES,
            "services"
          )}

          {renderSection(
            "Regions",
            "Select the regions where you operate or are interested in",
            REGIONS,
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
