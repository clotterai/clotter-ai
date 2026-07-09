import { createClient } from "@/lib/supabase/server";
import { DashboardHome } from "./components/dashboard-home";

function getTimeGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getFirstName(user: {
  email?: string;
  user_metadata?: Record<string, unknown>;
}) {
  const email = user.email ?? "";
  const meta = user.user_metadata ?? {};

  const fullName =
    typeof meta.full_name === "string" ? meta.full_name.trim() : "";

  if (fullName) {
    return fullName.split(/\s+/)[0];
  }

  const name =
    (typeof meta.name === "string" && meta.name.trim()) ||
    (typeof meta.given_name === "string" && meta.given_name.trim()) ||
    "";

  if (name) {
    return name.split(/\s+/)[0];
  }

  const emailPrefix = email.split("@")[0]?.trim();
  return emailPrefix || "Creator";
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const firstName = user ? getFirstName(user) : "Creator";
  const greeting = getTimeGreeting();

  return <DashboardHome greeting={greeting} firstName={firstName} />;
}
