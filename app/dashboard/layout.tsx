import { hasCreatorProfile } from "@/lib/memory/getCreatorContext";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardParticles } from "./components/particles";
import {
  DashboardNavigation,
  type SidebarUser,
} from "./components/sidebar";

export const dynamic = "force-dynamic";

function getInitials(name: string, email: string): string {
  const source = name.trim() || email.split("@")[0] || "U";
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return source.slice(0, 2).toUpperCase();
}

function toSidebarUser(user: {
  email?: string;
  user_metadata?: Record<string, unknown>;
}): SidebarUser {
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

  return {
    email,
    fullName,
    avatarUrl,
    initials: getInitials(fullName, email),
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

  const profileExists = await hasCreatorProfile(supabase, user.id);

  const sidebarUser = toSidebarUser(user);

  return (
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
        <div className="relative z-[1] flex min-h-full min-w-0 flex-1 flex-col pt-14 md:pt-0 md:pl-[17.5rem]">
          <div aria-hidden className="dash-grid-main" />
          <div className="dash-page-enter relative z-[1] flex min-h-full flex-col">
            {children}
          </div>
        </div>
      </DashboardNavigation>
    </div>
  );
}
