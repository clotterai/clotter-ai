import { hasCreatorProfile } from "@/lib/memory/getCreatorContext";
import { createClient } from "@/lib/supabase/server";
import { getDisplayName, getFirstNameFromUser } from "@/lib/user-display-name";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardParticles } from "./components/particles";
import { DashboardPageContent } from "./components/page-transition";
import {
  DashboardNavigation,
  type SidebarUser,
} from "./components/sidebar";
import { ToastProvider } from "./components/toast-provider";

export const dynamic = "force-dynamic";

const ONBOARDING_PATH = "/dashboard/onboarding";

function getPathname(headerList: Headers): string {
  const pathname = headerList.get("x-pathname");
  if (pathname) return pathname;

  const nextUrl = headerList.get("next-url");
  if (nextUrl) {
    try {
      return new URL(nextUrl).pathname;
    } catch {
      return "";
    }
  }

  return "";
}

function getInitials(name: string, email: string): string {
  const source = name.trim() || email.split("@")[0] || "U";
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return source.slice(0, 2).toUpperCase();
}

function toSidebarUser(
  user: {
    email?: string;
    user_metadata?: Record<string, unknown>;
  },
  preferredName?: string | null,
): SidebarUser {
  const email = user.email ?? "";
  const meta = user.user_metadata ?? {};

  const fullName =
    (typeof meta.full_name === "string" && meta.full_name.trim()) ||
    (typeof meta.name === "string" && meta.name.trim()) ||
    email.split("@")[0] ||
    "Creator";

  const avatarUrl =
    (typeof meta.avatar_url === "string" && meta.avatar_url) ||
    (typeof meta.picture === "string" && meta.picture) ||
    null;

  const displayName = getDisplayName(user, preferredName);
  const fallbackFirstName = getFirstNameFromUser(user);

  return {
    email,
    fullName,
    preferredName: preferredName?.trim() || null,
    displayName,
    fallbackFirstName,
    avatarUrl,
    initials: getInitials(displayName || fullName, email),
  };
}

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const headerList = await headers();
  const pathname = getPathname(headerList);
  const isOnboarding = pathname === ONBOARDING_PATH;

  const profileExists = await hasCreatorProfile(supabase, user.id);

  const { data: creatorProfile } = profileExists
    ? await supabase
        .from("creator_profiles")
        .select("preferred_name")
        .eq("user_id", user.id)
        .maybeSingle()
    : { data: null };

  if (!profileExists && pathname && !isOnboarding) {
    redirect(ONBOARDING_PATH);
  }

  if (profileExists && isOnboarding) {
    redirect("/dashboard");
  }

  const sidebarUser = toSidebarUser(user, creatorProfile?.preferred_name);
  return (
    <ToastProvider>
    <div className="dash-shell relative flex min-h-full overflow-hidden bg-[#0D0D1A] font-sans text-white">
      {/* Top gradient progress bar with shimmer */}
      <div aria-hidden className="dash-top-bar" />

      {/* Animated floating orbs */}
      <div aria-hidden className="dash-orbs">
        <div className="dash-orb dash-orb-1" />
        <div className="dash-orb dash-orb-2" />
        <div className="dash-orb dash-orb-3" />
        <div className="dash-orb dash-orb-4" />
      </div>

      {/* Floating particle dots */}
      <DashboardParticles />

      {/* Global grid texture */}
      <div aria-hidden className="dash-grid" />

      <DashboardNavigation user={sidebarUser}>
        <div className="relative z-[1] flex min-h-full w-full min-w-0 flex-1 flex-col pt-14 transition-opacity duration-150 md:pt-0 md:pl-[17.5rem]">
          <div aria-hidden className="dash-grid-main" />
          <DashboardPageContent>{children}</DashboardPageContent>
        </div>
      </DashboardNavigation>
    </div>
    </ToastProvider>
  );
}
