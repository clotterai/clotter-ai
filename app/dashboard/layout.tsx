import { DashboardParticles } from "./components/particles";
import {
  DashboardNavigation,
  type SidebarUser,
} from "./components/sidebar";
import { createClient } from "@/lib/supabase/server";

const guestUser: SidebarUser = {
  email: "guest@clotter.ai",
  fullName: "Guest",
  avatarUrl: null,
  initials: "G",
};

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
  const fullName =
    typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : null;
  const avatarUrl =
    typeof user.user_metadata?.avatar_url === "string"
      ? user.user_metadata.avatar_url
      : null;

  return {
    email,
    fullName,
    avatarUrl,
    initials: getInitials(fullName ?? "", email),
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

  const sidebarUser = user ? toSidebarUser(user) : guestUser;

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
