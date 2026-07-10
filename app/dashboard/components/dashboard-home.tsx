"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

const CACHE_KEY = "clotter-daily-brief-v1";
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;
const SLIDE_COUNT = 4;

type CachedBrief = {
  opportunities: string[];
  fetchedAt: number;
};

type CreatorProfileSummary = {
  niches: string[];
  platforms: string[];
  completion: number;
};

type ToolCard = {
  title: string;
  description: string;
  href: string;
  icon: ReactNode;
};

type HeroBubble = {
  label: string;
  href: string;
  duration: number;
  icon: ReactNode;
};

const heroBubbles: HeroBubble[] = [
  {
    label: "AI Chat",
    href: "/dashboard/chat",
    duration: 3,
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
    duration: 4,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden>
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
    duration: 5,
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
];

const backgroundOrbs = [
  {
    size: 480,
    bottom: "-12%",
    right: "-10%",
    color: "rgba(236,72,153,0.05)",
    duration: 28,
  },
  {
    size: 420,
    top: "-8%",
    left: "-12%",
    color: "rgba(249,115,22,0.04)",
    duration: 24,
  },
  {
    size: 360,
    top: "38%",
    left: "38%",
    color: "rgba(236,72,153,0.04)",
    duration: 22,
  },
];

const toolCards: ToolCard[] = [
  {
    title: "AI Chat",
    description: "Brainstorm and refine with your co-pilot.",
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
    title: "Captions",
    description: "Scroll-stopping captions for every post.",
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
    title: "Hooks",
    description: "Grab attention in two seconds.",
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
    title: "Scripts",
    description: "Full scripts built for retention.",
    href: "/dashboard/script",
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
    title: "Trends",
    description: "Spot what's rising before it peaks.",
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
  {
    title: "Content Ideas",
    description: "Fresh concepts for your niche.",
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
];

const PLATFORM_LABELS: Record<string, string> = {
  instagram: "Instagram",
  youtube: "YouTube",
  tiktok: "TikTok",
  linkedin: "LinkedIn",
  twitter: "Twitter/X",
  facebook: "Facebook",
};

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
  localStorage.setItem(
    CACHE_KEY,
    JSON.stringify({ opportunities, fetchedAt: Date.now() }),
  );
}

function CompletionRing({ percent }: { percent: number }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative flex h-28 w-28 shrink-0 items-center justify-center">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="6"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="url(#dash-dna-ring)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
        <defs>
          <linearGradient id="dash-dna-ring" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EC4899" />
            <stop offset="100%" stopColor="#F97316" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold text-white">{percent}%</span>
        <span className="text-[10px] text-white/35">Complete</span>
      </div>
    </div>
  );
}

function OpportunitySkeleton() {
  return (
    <div className="space-y-3">
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className="h-16 animate-pulse rounded-xl border border-white/[0.08] bg-white/[0.03]"
        />
      ))}
    </div>
  );
}

type DashboardHomeProps = {
  greeting: string;
  displayName: string;
  creatorProfile: CreatorProfileSummary;
};

export function DashboardHome({
  greeting,
  displayName,
  creatorProfile,
}: DashboardHomeProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLElement | null)[]>([]);
  const [activeSlide, setActiveSlide] = useState(0);
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
      const data = (await response.json()) as { opportunities?: string[] };

      if (response.ok && data.opportunities?.length) {
        setOpportunities(data.opportunities);
        writeCachedBrief(data.opportunities);
      }
    } catch {
      // Keep existing state on failure.
    } finally {
      setIsLoadingBrief(false);
      setIsRefreshingBrief(false);
    }
  }, []);

  useEffect(() => {
    void fetchBrief();
  }, [fetchBrief]);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) {
          const index = Number(visible.target.getAttribute("data-slide-index"));
          if (!Number.isNaN(index)) {
            setActiveSlide(index);
          }
        }
      },
      { root, threshold: 0.55 },
    );

    slideRefs.current.forEach((slide) => {
      if (slide) observer.observe(slide);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSlide = (index: number) => {
    slideRefs.current[index]?.scrollIntoView({ behavior: "smooth" });
  };

  const handleRefreshBrief = () => {
    localStorage.removeItem(CACHE_KEY);
    void fetchBrief(true);
  };

  const slideClass =
    "relative flex h-screen w-full shrink-0 snap-start snap-always flex-col justify-center px-6 py-8";

  return (
    <div className="fixed inset-x-0 bottom-0 top-14 z-[1] md:left-[17.5rem] md:top-0">
      <style>{`
        @keyframes dash-hero-bubble-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        @keyframes dash-bg-orb-float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, -24px) scale(1.05); }
        }
      `}</style>

      {/* Background orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {backgroundOrbs.map((orb, index) => (
          <div
            key={index}
            className="absolute rounded-full blur-3xl will-change-transform"
            style={{
              width: orb.size,
              height: orb.size,
              top: orb.top,
              bottom: orb.bottom,
              left: orb.left,
              right: orb.right,
              background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
              animation: `dash-bg-orb-float ${orb.duration}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>

      {/* Dot navigation */}
      <nav
        aria-label="Dashboard slides"
        className="fixed right-4 top-1/2 z-20 flex -translate-y-1/2 flex-col gap-2.5 md:right-6"
      >
        {Array.from({ length: SLIDE_COUNT }).map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => scrollToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={activeSlide === index ? "true" : undefined}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              activeSlide === index
                ? "scale-125 bg-white"
                : "bg-white/20 hover:bg-white/40"
            }`}
          />
        ))}
      </nav>

      {/* Scroll container */}
      <div
        ref={scrollRef}
        className="relative h-full snap-y snap-mandatory overflow-y-scroll scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {/* SLIDE 1 — Hero */}
        <section
          ref={(el) => {
            slideRefs.current[0] = el;
          }}
          data-slide-index={0}
          className={slideClass}
        >
          <div className="relative mx-auto flex h-full w-full max-w-xl flex-col">
            <div>
              <h1 className="text-3xl font-bold tracking-[-0.03em] text-white md:text-5xl">
                {greeting}, {displayName}
              </h1>
              <p className="mt-2 text-base text-white/40">
                Your creative OS is ready.
              </p>
            </div>

            <div className="flex flex-1 items-center justify-center gap-8 sm:gap-12">
              {heroBubbles.map((bubble) => (
                <Link
                  key={bubble.label}
                  href={bubble.href}
                  className="group flex flex-col items-center gap-2 will-change-transform"
                  style={{
                    animation: `dash-hero-bubble-float ${bubble.duration}s ease-in-out infinite`,
                  }}
                >
                  <span className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#EC4899] to-[#F97316] text-white shadow-[0_12px_40px_-16px_rgba(236,72,153,0.55)] transition-transform duration-200 group-hover:scale-105">
                    {bubble.icon}
                  </span>
                  <span className="text-xs font-medium text-white/50 group-hover:text-white/75">
                    {bubble.label}
                  </span>
                </Link>
              ))}
            </div>

            <p className="pb-2 text-center text-xs text-white/20 animate-bounce">
              ↓ Explore
            </p>
          </div>
        </section>

        {/* SLIDE 2 — Tools */}
        <section
          ref={(el) => {
            slideRefs.current[1] = el;
          }}
          data-slide-index={1}
          className={slideClass}
        >
          <div className="mx-auto w-full max-w-4xl">
            <h2 className="mb-6 text-2xl font-bold text-white">
              Everything you need.
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
              {toolCards.map((tool) => (
                <Link
                  key={tool.title}
                  href={tool.href}
                  className="rounded-2xl border border-white/[0.08] bg-white/[0.05] p-4 transition-all duration-200 hover:scale-[1.02] hover:border-pink-500/30"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#EC4899] to-[#F97316] text-white">
                    {tool.icon}
                  </div>
                  <h3 className="mt-3 text-sm font-semibold text-white">
                    {tool.title}
                  </h3>
                  <p className="mt-1 text-xs text-white/40">{tool.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* SLIDE 3 — Opportunities */}
        <section
          ref={(el) => {
            slideRefs.current[2] = el;
          }}
          data-slide-index={2}
          className={slideClass}
        >
          <div className="mx-auto w-full max-w-2xl">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="text-2xl font-bold text-white">
                Today&apos;s Opportunities ✦
              </h2>
              <button
                type="button"
                onClick={handleRefreshBrief}
                disabled={isRefreshingBrief}
                className="text-xs text-white/30 transition-colors hover:text-pink-400 disabled:opacity-40"
              >
                {isRefreshingBrief ? "Refreshing..." : "Refresh"}
              </button>
            </div>

            {isLoadingBrief ? (
              <OpportunitySkeleton />
            ) : opportunities.length === 0 ? (
              <p className="text-sm text-white/40">
                Opportunities will appear here once your daily brief is ready.
              </p>
            ) : (
              <div>
                {opportunities.slice(0, 3).map((item, index) => (
                  <div
                    key={`${item}-${index}`}
                    className="mb-3 rounded-xl border border-white/[0.08] bg-white/[0.05] p-4"
                  >
                    <div className="flex items-start gap-3">
                      <span
                        aria-hidden
                        className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#EC4899]"
                      />
                      <p className="text-sm leading-relaxed text-white/80">
                        {item}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* SLIDE 4 — Creator DNA */}
        <section
          ref={(el) => {
            slideRefs.current[3] = el;
          }}
          data-slide-index={3}
          className={slideClass}
        >
          <div className="mx-auto w-full max-w-2xl">
            <h2 className="mb-4 text-2xl font-bold text-white">
              Your Creator DNA
            </h2>

            <div className="flex flex-col gap-8 sm:flex-row sm:items-start">
              <CompletionRing percent={creatorProfile.completion} />

              <div className="min-w-0 flex-1 space-y-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-white/30">
                    Niche
                  </p>
                  {creatorProfile.niches.length > 0 ? (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {creatorProfile.niches.map((niche) => (
                        <span
                          key={niche}
                          className="rounded-full border border-[#EC4899]/30 bg-[#EC4899]/10 px-3 py-1 text-sm font-medium text-pink-100"
                        >
                          {niche}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-white/40">Not set yet</p>
                  )}
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-white/30">
                    Platforms
                  </p>
                  {creatorProfile.platforms.length > 0 ? (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {creatorProfile.platforms.map((platform) => (
                        <span
                          key={platform}
                          className="rounded-full border border-white/[0.08] bg-white/[0.05] px-3 py-1 text-sm text-white/70"
                        >
                          {PLATFORM_LABELS[platform.toLowerCase()] ?? platform}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-white/40">Not set yet</p>
                  )}
                </div>
              </div>
            </div>

            <Link
              href="/dashboard/memory"
              className="mt-8 inline-flex rounded-xl border border-white/[0.08] bg-white/[0.05] px-4 py-2.5 text-sm font-semibold text-white/80 transition-colors hover:border-pink-500/30 hover:text-white"
            >
              Update Profile
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
