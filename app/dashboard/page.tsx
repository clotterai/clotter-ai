import { createClient } from "@/lib/supabase/server";
import { calculateProfileCompletion } from "@/lib/memory/getCreatorContext";
import { DashboardHome } from "./components/dashboard-home";

function getTimeGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function resolveDisplayName(
  user: {
    user_metadata?: Record<string, unknown>;
  } | null,
  preferredName?: string | null,
): string {
  const trimmedPreferred = preferredName?.trim();
  if (trimmedPreferred) return trimmedPreferred;

  const meta = user?.user_metadata ?? {};
  const fullName =
    typeof meta.full_name === "string" ? meta.full_name.trim() : "";
  if (fullName) {
    return fullName.split(/\s+/)[0] || "Creator";
  }

  const name = typeof meta.name === "string" ? meta.name.trim() : "";
  if (name) {
    return name.split(/\s+/)[0] || "Creator";
  }

  return "Creator";
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const greeting = getTimeGreeting();
  let displayName = "Creator";
  let creatorProfile: {
    niches: string[];
    platforms: string[];
    completion: number;
  } | null = null;

  if (user) {
    const { data: profile } = await supabase
      .from("creator_profiles")
      .select("preferred_name, niche, platforms")
      .eq("user_id", user.id)
      .maybeSingle();

    displayName = resolveDisplayName(user, profile?.preferred_name);

    if (profile) {
      creatorProfile = {
        niches: profile.niche
          ? profile.niche
              .split(",")
              .map((item: string) => item.trim())
              .filter(Boolean)
          : [],
        platforms: Array.isArray(profile.platforms) ? profile.platforms : [],
        completion: calculateProfileCompletion(profile),
      };
    }
  }

  return (
    <DashboardHome
      greeting={greeting}
      displayName={displayName}
      creatorProfile={creatorProfile}
    />
  );
}
