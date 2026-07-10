"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, type ReactNode } from "react";

const CACHE_KEY = "clotter-daily-brief-v1";
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;

type CachedBrief = {
  opportunities: string[];
  fetchedAt: number;
};

type FeatureBubble = {
  label: string;
  href: string;
  size: 120 | 80;
  top: string;
  left: string;
  duration: number;
  opacity: number;
  icon: ReactNode;
};

const featureBubbles: FeatureBubble[] = [
  {
    label: "AI Chat",
    href: "/dashboard/chat",
    size: 120,
    top: "8%",
    left: "6%",
    duration: 3,
    opacity: 0.95,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden>
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
    label: "Captions",
    href: "/dashboard/captions",
    size: 80,
    top: "18%",
    left: "72%",
    duration: 5,
    opacity: 0.75,
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
    label: "Hooks",
    href: "/dashboard/hooks",
    size: 120,
    top: "42%",
    left: "18%",
    duration: 6,
    opacity: 0.85,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden>
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
    label: "Scripts",
    href: "/dashboard/script",
    size: 80,
    top: "55%",
    left: "68%",
    duration: 4,
    opacity: 0.7,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
        <path
          d="M8 4h8a2 2 0 0 1 2 2v14l-3-2-3 2-3-2-3 2V6a2 2 0 0 1 2-2Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Trends",
    href: "/dashboard/trends",
    size: 120,
    top: "62%",
    left: "42%",
    duration: 7,
    opacity: 0.9,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden>
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
  {
    label: "Content Ideas",
    href: "/dashboard/content-ideas",
    size: 80,
    top: "28%",
    left: "44%",
    duration: 8,
    opacity: 0.8,
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
  displayName: string;
};

export function DashboardHome({ greeting, displayName }: DashboardHomeProps) {
  const [opportunities, setOpportunities] = useState<string[]>([]);
  const [isLoadingBrief, setIsLoadingBrief] = useState(true);
  const [isRefreshingBrief, setIsRefreshingBrief] = useState(false);

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

  useEffect(() => {
    void fetchBrief();
  }, [fetchBrief]);

  const handleRefreshBrief = () => {
    localStorage.removeItem(CACHE_KEY);
    void fetchBrief(true);
  };

  return (
    <div className="flex min-h-full flex-col">
      <style>{`
        @keyframes dash-bubble-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `}</style>

      <main className="dash-page-enter flex flex-1 flex-col px-6 py-10 sm:px-10 sm:py-12">
        {/* Hero */}
        <section className="dash-fade-in shrink-0">
          <h1 className="text-3xl font-bold tracking-[-0.02em] text-white">
            {greeting}, {displayName}
          </h1>
          <p className="mt-2 text-sm text-white/40">
            What are you creating today?
          </p>
        </section>

        {/* Floating bubbles */}
        <section className="relative mx-auto mt-10 w-full max-w-4xl flex-1 sm:mt-12">
          <div className="relative min-h-[420px] w-full sm:min-h-[480px]">
            {featureBubbles.map((bubble) => (
              <Link
                key={bubble.label}
                href={bubble.href}
                className="group absolute flex flex-col items-center justify-center will-change-transform"
                style={{
                  top: bubble.top,
                  left: bubble.left,
                  width: bubble.size,
                  height: bubble.size,
                  animation: `dash-bubble-float ${bubble.duration}s ease-in-out infinite`,
                }}
              >
                <span
                  className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-full bg-gradient-to-br from-[#EC4899] to-[#F97316] text-white shadow-[0_8px_40px_-12px_rgba(236,72,153,0.55)] ring-1 ring-white/15 transition-transform duration-200 group-hover:scale-105"
                  style={{ opacity: bubble.opacity }}
                >
                  {bubble.icon}
                  <span
                    className={`text-center font-semibold leading-tight text-white ${
                      bubble.size === 120 ? "text-xs" : "text-[10px]"
                    }`}
                  >
                    {bubble.label}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Today's Opportunities */}
        <section
          className="dash-fade-in mt-auto shrink-0 rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl sm:p-8"
          style={{ animationDelay: "0.15s" }}
        >
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-heading text-lg font-bold tracking-[-0.02em] text-white sm:text-xl">
              Today&apos;s Opportunities
            </h2>
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
          ) : opportunities.length === 0 ? (
            <p className="mt-6 text-sm text-white/40">
              Opportunities will appear here once your daily brief is ready.
            </p>
          ) : (
            <ul className="mt-6 space-y-4">
              {opportunities.map((suggestion, index) => (
                <li
                  key={`${suggestion}-${index}`}
                  className="flex items-start gap-3 text-[15px] leading-relaxed text-white/65"
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
      </main>
    </div>
  );
}
