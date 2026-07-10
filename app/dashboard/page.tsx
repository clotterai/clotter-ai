import { createClient } from "@/lib/supabase/server";
import { calculateProfileCompletion } from "@/lib/memory/getCreatorContext";
import { getDisplayName } from "@/lib/user-display-name";
import { DashboardHome } from "./components/dashboard-home";

function getTimeGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const greeting = getTimeGreeting();
  let displayName = "Creator";
  let creatorProfile = {
    niches: [] as string[],
    platforms: [] as string[],
    completion: 0,
  };

  if (user) {
    const { data: profile } = await supabase
      .from("creator_profiles")
      .select("preferred_name, niche, platforms")
      .eq("user_id", user.id)
      .maybeSingle();

    displayName = getDisplayName(user, profile?.preferred_name);

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
