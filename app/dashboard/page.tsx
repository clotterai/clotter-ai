import { createClient } from "@/lib/supabase/server";
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

  if (user) {
    const { data: profile } = await supabase
      .from("creator_profiles")
      .select("preferred_name")
      .eq("user_id", user.id)
      .maybeSingle();

    displayName = getDisplayName(user, profile?.preferred_name);
  }

  return <DashboardHome greeting={greeting} displayName={displayName} />;
}
