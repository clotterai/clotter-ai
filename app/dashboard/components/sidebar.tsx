"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { LogoutButton } from "./logout-button";
import { ClotterLogo } from "./clotter-logo";

export type SidebarUser = {
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  initials: string;
};

const dashboardNavItem = {
  label: "Dashboard",
  href: "/dashboard",
  icon: (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
      <path
        d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V9.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

const navGroups = [
  {
    label: "CREATE",
    items: [
      {
        label: "AI Chat",
        href: "/dashboard/chat",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
            <path
              d="M8 10h8M8 14h5M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 0 1-4-.8L3 21l1.8-4.2A8.8 8.8 0 0 1 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
      },
      {
        label: "Bubble",
        href: "/dashboard/bubble",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
            <circle
              cx="12"
              cy="12"
              r="8"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <circle cx="9" cy="10" r="1.5" fill="currentColor" opacity="0.5" />
            <circle cx="14" cy="14" r="1" fill="currentColor" opacity="0.35" />
          </svg>
        ),
      },
      {
        label: "Caption Generator",
        href: "/dashboard/captions",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
            <path
              d="M4 6h16M4 12h12M4 18h8M20 18l-2 2-4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
      },
      {
        label: "Hook Generator",
        href: "/dashboard/hooks",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
            <path
              d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
      },
      {
        label: "Script Generator",
        href: "/dashboard/script",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
            <path
              d="M8 4h8a2 2 0 0 1 2 2v14l-3-2-3 2-3-2-3 2V6a2 2 0 0 1 2-2Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M10 8h4M10 12h4M10 16h2"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        ),
      },
    ],
  },
  {
    label: "PLAN",
    items: [
      {
        label: "Content Ideas",
        href: "/dashboard/content-ideas",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
            <path
              d="M9.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M12 6v6l3 2"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        ),
      },
      {
        label: "Content Planner",
        href: "/dashboard/planner",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
            <path
              d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
      },
    ],
  },
  {
    label: "GROW",
    items: [
      {
        label: "Trend Analyzer",
        href: "/dashboard/trends",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
            <path
              d="M3 17l6-6 4 4 8-10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14 5h7v7"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
      },
    ],
  },
  {
    label: "ME",
    items: [
      {
        label: "AI Memory",
        href: "/dashboard/memory",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
            <path
              d="M9.5 2A2.5 2.5 0 0 0 7 4.5v.5A2.5 2.5 0 0 0 5 7.5 2.5 2.5 0 0 0 2.5 10v1A2.5 2.5 0 0 0 5 13.5 2.5 2.5 0 0 0 7 15.5v.5A2.5 2.5 0 0 0 9.5 18h1A2.5 2.5 0 0 0 13 15.5v-.5a2.5 2.5 0 0 0 2-2.45V12a2.5 2.5 0 0 0-2-2.45V9A2.5 2.5 0 0 0 13 6.5V6A2.5 2.5 0 0 0 10.5 3.5h-1Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M12 6v12M9 9.5c.5-.5 1.5-.75 3-.75s2.5.25 3 .75M9 14.5c.5.5 1.5.75 3 .75s2.5-.25 3-.75"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        ),
      },
    ],
  },
];

type NavItem = {
  label: string;
  href: string;
  icon: ReactNode;
};

function SidebarNavLink({
  item,
  pathname,
  onClose,
}: {
  item: NavItem;
  pathname: string;
  onClose: () => void;
}) {
  const active =
    item.href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(item.href) && item.href !== "#";

  return (
    <Link
      href={item.href}
      onClick={onClose}
      className={`dash-nav-item group relative flex items-center gap-3.5 overflow-hidden rounded-xl px-3.5 py-3 text-[15px] font-medium tracking-[-0.02em] ${
        active
          ? "bg-gradient-to-r from-[#EC4899]/15 to-[#F97316]/10 text-[#FECDD3] shadow-[0_0_40px_-8px_#EC4899] ring-1 ring-[#EC4899]/35"
          : "text-white/45 hover:text-white/90"
      }`}
      aria-current={active ? "page" : undefined}
    >
      {active && (
        <>
          <span
            aria-hidden
            className="absolute inset-0 bg-gradient-to-r from-[#EC4899]/25 via-[#F97316]/12 to-transparent"
          />
          <span aria-hidden className="dash-nav-glow-bar" />
        </>
      )}
      <span
        className={`relative z-[1] transition-all duration-300 ${
          active
            ? "text-[#FB923C] drop-shadow-[0_0_8px_rgba(236,72,153,0.6)]"
            : "text-white/30 group-hover:text-[#EC4899]/70"
        }`}
      >
        {item.icon}
      </span>
      <span className="relative z-[1]">{item.label}</span>
    </Link>
  );
}

type DashboardSidebarProps = {
  user: SidebarUser;
  isMobileOpen: boolean;
  onClose: () => void;
};

export function DashboardSidebar({
  user,
  isMobileOpen,
  onClose,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex h-full w-[17.5rem] flex-col border-r border-[#EC4899]/10 bg-[#0D0D1A]/95 backdrop-blur-2xl transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] md:translate-x-0 ${
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Glowing right edge */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-[#EC4899]/40 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -right-px w-px bg-[#EC4899]/15"
      />

      {/* Logo */}
      <div className="relative shrink-0 border-b border-[#EC4899]/10 px-6 py-7">
        <div className="flex items-center gap-3.5">
          <ClotterLogo size={32} />
          <div>
            <p className="font-heading text-base font-bold tracking-[-0.02em] text-white">
              Clotter AI
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav
        className="min-h-0 flex-1 overflow-y-auto px-4 py-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <SidebarNavLink
          item={dashboardNavItem}
          pathname={pathname}
          onClose={onClose}
        />

        {navGroups.map((group) => (
          <div key={group.label} className="mt-6">
            <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/25">
              {group.label}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => (
                <SidebarNavLink
                  key={item.label}
                  item={item}
                  pathname={pathname}
                  onClose={onClose}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Profile */}
      <div className="shrink-0 border-t border-[#EC4899]/10 p-5">
        <div className="dash-glass-v2 !rounded-2xl !p-4">
          <div className="flex items-center gap-3.5">
            {user.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatarUrl}
                alt=""
                className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-[#EC4899]/30"
              />
            ) : (
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#EC4899]/40 to-[#F97316]/20 text-sm font-semibold text-[#FECDD3] ring-1 ring-[#EC4899]/30">
                {user.initials}
                <div
                  aria-hidden
                  className="absolute inset-0 rounded-full bg-[#EC4899]/20 blur-sm"
                />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-[15px] font-medium tracking-[-0.02em] text-white/95">
                {user.fullName}
              </p>
              <p className="truncate text-xs text-white/40">{user.email}</p>
            </div>
          </div>
          <LogoutButton />
        </div>
      </div>
    </aside>
  );
}

type DashboardMobileHeaderProps = {
  isMobileOpen: boolean;
  onToggle: () => void;
};

function DashboardMobileHeader({
  isMobileOpen,
  onToggle,
}: DashboardMobileHeaderProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center gap-3 border-b border-[#EC4899]/10 bg-[#0D0D1A]/85 px-4 backdrop-blur-xl md:hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#EC4899]/60 to-transparent"
      />
      <button
        type="button"
        onClick={onToggle}
        aria-label={isMobileOpen ? "Close menu" : "Open menu"}
        aria-expanded={isMobileOpen}
        className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-xl text-white/90 transition-all duration-300 hover:border-[#EC4899]/35 hover:bg-[#EC4899]/10 active:scale-95"
      >
        {isMobileOpen ? (
          <span className="text-lg leading-none">✕</span>
        ) : (
          <span className="leading-none">☰</span>
        )}
      </button>
      <div className="flex min-w-0 flex-1 items-center gap-2.5">
        <ClotterLogo size={32} />
        <p className="truncate font-heading text-[15px] font-bold tracking-[-0.02em] text-white">
          Clotter AI
        </p>
      </div>
    </header>
  );
}

type DashboardSidebarBackdropProps = {
  isMobileOpen: boolean;
  onClose: () => void;
};

function DashboardSidebarBackdrop({
  isMobileOpen,
  onClose,
}: DashboardSidebarBackdropProps) {
  return (
    <button
      type="button"
      aria-label="Close menu"
      onClick={onClose}
      className={`fixed inset-0 z-40 bg-[#05050f]/70 backdrop-blur-[2px] transition-opacity duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] md:hidden ${
        isMobileOpen
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      }`}
    />
  );
}

type DashboardNavigationProps = {
  user: SidebarUser;
  children: ReactNode;
};

export function DashboardNavigation({
  user,
  children,
}: DashboardNavigationProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isMobileOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileOpen]);

  const closeSidebar = () => setIsMobileOpen(false);
  const toggleSidebar = () => setIsMobileOpen((open) => !open);

  return (
    <>
      <DashboardSidebarBackdrop
        isMobileOpen={isMobileOpen}
        onClose={closeSidebar}
      />
      <DashboardSidebar
        user={user}
        isMobileOpen={isMobileOpen}
        onClose={closeSidebar}
      />
      <DashboardMobileHeader
        isMobileOpen={isMobileOpen}
        onToggle={toggleSidebar}
      />
      {children}
    </>
  );
}
