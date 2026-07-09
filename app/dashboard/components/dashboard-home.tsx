"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const CACHE_KEY = "clotter-daily-brief-v1";
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;

type CachedBrief = {
  opportunities: string[];
  fetchedAt: number;
};

type DashboardStats = {
  contentCreated: number;
  toolsUsed: number;
  daysActive: number;
};

const quickActions = [
  {
    title: "AI Chat",
    description: "Brainstorm ideas and refine content with your creative co-pilot.",
    href: "/dashboard/chat",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden>
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
    title: "Captions",
    description: "Write scroll-stopping captions tailored to your brand voice.",
    href: "/dashboard/captions",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden>
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
    title: "Hooks",
    description: "Craft attention-grabbing openers for Reels, TikTok, and Shorts.",
    href: "/dashboard/hooks",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden>
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
    title: "Script",
    description: "Generate full video scripts optimized for retention and virality.",
    href: "/dashboard/script",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden>
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
  {
    title: "Content Ideas",
    description: "Discover fresh content concepts aligned with your niche.",
    href: "/dashboard/content-ideas",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden>
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
    title: "Trend Analyzer",
    description: "Spot rising topics before they peak in your audience.",
    href: "/dashboard/trends",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden>
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
];

function readCachedBrief(): CachedBrief | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as CachedBrief;
    if (
      !Array.isArray(parsed.opportunities) ||
      typeof parsed.fetchedAt !== "number"
    ) {
      return null;
    }

    if (Date.now() - parsed.fetchedAt > CACHE_TTL_MS) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

function writeCachedBrief(opportunities: string[]) {
  const payload: CachedBrief = {
    opportunities,
    fetchedAt: Date.now(),
  };
  localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
}

function StatSkeleton() {
  return (
    <div className="h-7 w-16 animate-pulse rounded-lg bg-white/10" />
  );
}

function OpportunitySkeleton() {
  return (
    <ul className="mt-6 space-y-4">
      {[0, 1, 2].map((index) => (
        <li key={index} className="flex items-start gap-3">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#EC4899]/30" />
          <span className="h-4 flex-1 animate-pulse rounded bg-white/10" />
        </li>
      ))}
    </ul>
  );
}

type DashboardHomeProps = {
  greeting: string;
  firstName: string;
};

export function DashboardHome({ greeting, firstName }: DashboardHomeProps) {
  const [opportunities, setOpportunities] = useState<string[]>([]);
  const [isLoadingBrief, setIsLoadingBrief] = useState(true);
  const [isRefreshingBrief, setIsRefreshingBrief] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  const fetchBrief = useCallback(async (skipCache = false) => {
    if (!skipCache) {
      const cached = readCachedBrief();
      if (cached?.opportunities.length) {
        setOpportunities(cached.opportunities);
        setIsLoadingBrief(false);
        return;
      }
    }

    if (skipCache) {
      setIsRefreshingBrief(true);
    } else {
      setIsLoadingBrief(true);
    }

    try {
      const response = await fetch("/api/daily-brief");
      const data = (await response.json()) as {
        opportunities?: string[];
      };

      if (response.ok && data.opportunities?.length) {
        setOpportunities(data.opportunities);
        writeCachedBrief(data.opportunities);
      }
    } catch {
      // Keep existing or empty state on failure.
    } finally {
      setIsLoadingBrief(false);
      setIsRefreshingBrief(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    setIsLoadingStats(true);

    try {
      const response = await fetch("/api/dashboard-stats");
      const data = (await response.json()) as DashboardStats & { error?: string };

      if (response.ok) {
        setStats({
          contentCreated: data.contentCreated ?? 0,
          toolsUsed: data.toolsUsed ?? 0,
          daysActive: data.daysActive ?? 0,
        });
      }
    } catch {
      setStats({ contentCreated: 0, toolsUsed: 0, daysActive: 0 });
    } finally {
      setIsLoadingStats(false);
    }
  }, []);

  useEffect(() => {
    void fetchBrief();
    void fetchStats();
  }, [fetchBrief, fetchStats]);

  const handleRefreshBrief = () => {
    localStorage.removeItem(CACHE_KEY);
    void fetchBrief(true);
  };

  const hasNoContent = stats?.contentCreated === 0;

  return (
    <div className="flex min-h-full flex-col">
      <header className="dash-fade-in relative shrink-0 border-b border-[#EC4899]/10 bg-[#0D0D1A]/60 px-8 py-7 backdrop-blur-2xl sm:px-10">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#EC4899]/40 to-transparent"
        />
        <div className="flex items-center justify-between gap-6">
          <h1 className="font-heading text-[2rem] font-bold tracking-[-0.02em] text-white sm:text-[2.375rem]">
            Dashboard
          </h1>
          <button
            type="button"
            className="dash-glass-v2 flex h-11 w-11 items-center justify-center !rounded-xl text-white/50 transition-all duration-300 hover:!border-[#EC4899]/40 hover:text-[#FB923C] hover:shadow-[0_0_32px_-8px_#EC4899]"
            aria-label="Notifications"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
              <path
                d="M15 17H9c-2 0-3-.8-3-2.8V10a6 6 0 1 1 12 0v4.2c0 2-1 2.8-3 2.8ZM12 21a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </header>

      <main className="dash-page-enter flex-1 space-y-10 px-8 py-10 sm:space-y-12 sm:px-10 sm:py-12">
        <section className="dash-fade-in">
          <h2 className="font-heading text-[2rem] font-bold leading-[1.12] tracking-[-0.02em] text-white sm:text-[2.75rem] lg:text-[3rem]">
            {greeting}, {firstName}
          </h2>
          <p className="mt-3 max-w-xl text-[1.0625rem] leading-relaxed tracking-[-0.015em] text-white/50">
            Here&apos;s your creative workspace for today.
          </p>
        </section>

        <section
          className="dash-fade-in grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5"
          style={{ animationDelay: "0.08s" }}
        >
          {[
            {
              label: "Content Created",
              value: stats?.contentCreated ?? 0,
            },
            {
              label: "Tools Used",
              value: stats?.toolsUsed ?? 0,
            },
            {
              label: "Days Active",
              value: stats?.daysActive ?? 0,
            },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="dash-fade-in rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md transition-all duration-300 hover:scale-[1.03] hover:border-[#EC4899]/30 hover:shadow-[0_8px_40px_-12px_rgba(236,72,153,0.45)] sm:p-6"
              style={{ animationDelay: `${0.12 + index * 0.07}s` }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/35">
                {stat.label}
              </p>
              <div className="mt-3 text-[1.0625rem] font-semibold tracking-[-0.02em] text-white sm:text-lg">
                {isLoadingStats ? (
                  <StatSkeleton />
                ) : (
                  stat.value
                )}
              </div>
            </div>
          ))}
        </section>

        {!isLoadingStats && hasNoContent && (
          <p className="dash-fade-in text-sm text-white/40">
            Start creating!
          </p>
        )}

        <section
          className="dash-fade-in rounded-2xl border border-white/10 border-l-4 border-l-[#EC4899] bg-white/5 p-6 backdrop-blur-md sm:p-8"
          style={{ animationDelay: "0.28s" }}
        >
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-heading text-xl font-bold tracking-[-0.02em] text-white sm:text-2xl">
              Today&apos;s Opportunities
            </h3>
            <button
              type="button"
              onClick={handleRefreshBrief}
              disabled={isRefreshingBrief}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/50 transition-colors hover:border-[#EC4899]/30 hover:text-[#FB923C] disabled:opacity-40"
              aria-label="Refresh opportunities"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className={`h-4 w-4 ${isRefreshingBrief ? "animate-spin" : ""}`}
                aria-hidden
              >
                <path
                  d="M20 12a8 8 0 1 1-2.34-5.66M20 4v6h-6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {isLoadingBrief ? (
            <OpportunitySkeleton />
          ) : (
            <ul className="mt-6 space-y-4">
              {opportunities.map((suggestion, index) => (
                <li
                  key={`${suggestion}-${index}`}
                  className="dash-fade-in flex items-start gap-3 text-[15px] leading-relaxed tracking-[-0.01em] text-white/65 sm:text-base"
                  style={{ animationDelay: `${0.34 + index * 0.06}s` }}
                >
                  <span
                    aria-hidden
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#EC4899]"
                  />
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="dash-fade-in" style={{ animationDelay: "0.4s" }}>
          <div>
            <h3 className="font-heading text-xl font-bold tracking-[-0.02em] text-white sm:text-2xl">
              Quick actions
            </h3>
            <p className="mt-2 text-[15px] leading-relaxed tracking-[-0.01em] text-white/45">
              Jump into your most-used tools
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:gap-6">
            {quickActions.map((action, index) => (
              <Link
                key={action.title}
                href={action.href}
                className="dash-fade-in group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[#EC4899]/35 hover:bg-white/[0.07] hover:shadow-[0_16px_48px_-16px_rgba(236,72,153,0.55)] sm:p-7"
                style={{ animationDelay: `${0.46 + index * 0.07}s` }}
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#EC4899]/20 via-[#F97316]/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#EC4899]/20 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />

                <div className="relative flex items-start gap-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#EC4899] to-[#F97316] text-white shadow-[0_0_32px_-4px_#EC4899] ring-1 ring-white/15 transition-transform duration-300 group-hover:scale-110">
                    {action.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-[17px] font-semibold tracking-[-0.025em] text-white transition-colors duration-300 group-hover:text-[#FECDD3]">
                      {action.title}
                    </h4>
                    <p className="mt-2 text-[14px] leading-[1.65] tracking-[-0.01em] text-white/40 transition-colors duration-300 group-hover:text-white/60">
                      {action.description}
                    </p>
                    <p className="mt-4 translate-y-1 text-[13px] font-medium text-[#FB923C] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      Open →
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
