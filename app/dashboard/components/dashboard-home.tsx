"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const CACHE_KEY = "clotter-daily-brief-v1";
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;

type CreatorProfileSummary = {
  niches: string[];
  platforms: string[];
  completion: number;
};

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
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [opportunities, setOpportunities] = useState<string[]>([]);
  const [isLoadingOpportunities, setIsLoadingOpportunities] = useState(true);

  const fetchOpportunities = useCallback(async (skipCache = false) => {
    if (!skipCache) {
      try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as {
            opportunities?: string[];
            fetchedAt?: number;
          };
          if (
            Array.isArray(parsed.opportunities) &&
            typeof parsed.fetchedAt === "number" &&
            Date.now() - parsed.fetchedAt <= CACHE_TTL_MS &&
            parsed.opportunities.length > 0
          ) {
            setOpportunities(parsed.opportunities);
            setIsLoadingOpportunities(false);
            return;
          }
        }
      } catch {
        // Ignore cache errors.
      }
    }

    setIsLoadingOpportunities(true);

    try {
      const response = await fetch("/api/daily-brief");
      const data = (await response.json()) as { opportunities?: string[] };

      if (response.ok && data.opportunities?.length) {
        setOpportunities(data.opportunities);
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            opportunities: data.opportunities,
            fetchedAt: Date.now(),
          }),
        );
      } else {
        setOpportunities([]);
      }
    } catch {
      setOpportunities([]);
    } finally {
      setIsLoadingOpportunities(false);
    }
  }, []);

  useEffect(() => {
    void fetchOpportunities();
  }, [fetchOpportunities]);

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

  const slideSnapStyle = { scrollSnapAlign: "start" as const };

  return (
    <div
      ref={scrollRef}
      className="relative h-screen overflow-y-scroll scroll-smooth"
      style={{ scrollSnapType: "y mandatory" }}
    >
      {/* Background orbs - fixed behind everything */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div
          className="absolute bottom-0 right-0 h-96 w-96 rounded-full opacity-[0.04]"
          style={{
            background: "radial-gradient(circle, #EC4899, #F97316)",
            filter: "blur(80px)",
            animation: "float1 20s ease-in-out infinite",
          }}
        />
        <div
          className="absolute left-0 top-0 h-80 w-80 rounded-full opacity-[0.04]"
          style={{
            background: "radial-gradient(circle, #F97316, #EC4899)",
            filter: "blur(80px)",
            animation: "float2 25s ease-in-out infinite",
          }}
        />
      </div>

      {/* SLIDE 1 - HERO */}
      <div
        ref={(el) => {
          slideRefs.current[0] = el;
        }}
        data-slide-index={0}
        className="relative z-10 flex h-screen flex-col justify-center px-6 py-8"
        style={slideSnapStyle}
      >
        <p className="mb-2 text-sm font-medium text-white/40">{greeting}</p>
        <h1 className="mb-4 text-4xl font-bold text-white md:text-6xl">
          {displayName} 👋
        </h1>
        <p className="mb-12 text-base text-white/30">Your creative OS is ready.</p>

        {/* 3 floating feature bubbles */}
        <div className="mb-12 flex justify-center gap-6">
          {[
            { name: "AI Chat", href: "/dashboard/chat", icon: "💬" },
            { name: "Captions", href: "/dashboard/captions", icon: "✍️" },
            { name: "Hooks", href: "/dashboard/hooks", icon: "🎣" },
          ].map((item, i) => (
            <Link
              key={item.name}
              href={item.href}
              className="group flex flex-col items-center gap-2"
              style={{
                animation: `float${i + 1} ${3 + i}s ease-in-out infinite`,
              }}
            >
              <div
                className="flex h-20 w-20 items-center justify-center rounded-full text-2xl"
                style={{
                  background: "linear-gradient(135deg, #EC4899, #F97316)",
                }}
              >
                {item.icon}
              </div>
              <span className="text-xs text-white/50 transition-colors group-hover:text-white/80">
                {item.name}
              </span>
            </Link>
          ))}
        </div>

        <p className="animate-bounce text-center text-xs text-white/20">
          ↓ Explore
        </p>
      </div>

      {/* SLIDE 2 - TOOLS */}
      <div
        ref={(el) => {
          slideRefs.current[1] = el;
        }}
        data-slide-index={1}
        className="relative z-10 flex h-screen flex-col justify-center px-6 py-8"
        style={slideSnapStyle}
      >
        <h2 className="mb-2 text-2xl font-bold text-white">
          Everything you need.
        </h2>
        <p className="mb-8 text-sm text-white/30">
          All your creator tools in one place.
        </p>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {[
            {
              name: "AI Chat",
              desc: "Your creative co-pilot",
              href: "/dashboard/chat",
              icon: "💬",
            },
            {
              name: "Captions",
              desc: "Stop-the-scroll captions",
              href: "/dashboard/captions",
              icon: "✍️",
            },
            {
              name: "Hooks",
              desc: "Grab attention instantly",
              href: "/dashboard/hooks",
              icon: "🎣",
            },
            {
              name: "Scripts",
              desc: "Viral video scripts",
              href: "/dashboard/script",
              icon: "🎬",
            },
            {
              name: "Trends",
              desc: "Real-time trend data",
              href: "/dashboard/trends",
              icon: "📈",
            },
            {
              name: "Ideas",
              desc: "Never run out of ideas",
              href: "/dashboard/content-ideas",
              icon: "💡",
            },
          ].map((tool) => (
            <Link
              key={tool.name}
              href={tool.href}
              className="cursor-pointer rounded-2xl border border-white/8 bg-white/5 p-4 transition-all duration-200 hover:scale-[1.02] hover:border-pink-500/30 hover:bg-white/8"
            >
              <div
                className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl text-lg"
                style={{
                  background: "linear-gradient(135deg, #EC4899, #F97316)",
                }}
              >
                {tool.icon}
              </div>
              <p className="text-sm font-semibold text-white">{tool.name}</p>
              <p className="mt-1 text-xs text-white/40">{tool.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* SLIDE 3 - TODAY'S OPPORTUNITIES */}
      <div
        ref={(el) => {
          slideRefs.current[2] = el;
        }}
        data-slide-index={2}
        className="relative z-10 flex h-screen flex-col justify-center px-6 py-8"
        style={slideSnapStyle}
      >
        <h2 className="mb-2 text-2xl font-bold text-white">
          Today&apos;s Opportunities ✦
        </h2>
        <p className="mb-6 text-sm text-white/30">AI-generated just for you.</p>
        <div className="space-y-3">
          {isLoadingOpportunities ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-16 animate-pulse rounded-xl border border-white/8 bg-white/5 p-4"
                />
              ))}
            </div>
          ) : opportunities.length > 0 ? (
            opportunities.slice(0, 3).map((opp, i) => (
              <div
                key={`${opp}-${i}`}
                className="flex items-start gap-3 rounded-xl border border-white/8 bg-white/5 p-4"
              >
                <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-pink-400" />
                <p className="text-sm text-white/80">{opp}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-white/40">
              Opportunities will appear here once your daily brief is ready.
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => {
            localStorage.removeItem(CACHE_KEY);
            void fetchOpportunities(true);
          }}
          className="mt-4 text-xs text-white/30 transition-colors hover:text-pink-400"
        >
          ↻ Refresh
        </button>
      </div>

      {/* SLIDE 4 - CREATOR DNA */}
      <div
        ref={(el) => {
          slideRefs.current[3] = el;
        }}
        data-slide-index={3}
        className="relative z-10 flex h-screen flex-col justify-center px-6 py-8"
        style={slideSnapStyle}
      >
        <h2 className="mb-2 text-2xl font-bold text-white">Your Creator DNA</h2>
        <p className="mb-6 text-sm text-white/30">What Clotter knows about you.</p>
        <div className="rounded-2xl border border-white/8 bg-white/5 p-6">
          <div className="mb-4 flex flex-wrap gap-2">
            {creatorProfile.niches.length > 0 ? (
              creatorProfile.niches.map((n) => (
                <span
                  key={n}
                  className="rounded-full px-3 py-1 text-xs font-medium text-white"
                  style={{
                    background: "linear-gradient(135deg, #EC4899, #F97316)",
                  }}
                >
                  {n}
                </span>
              ))
            ) : (
              <span className="text-sm text-white/30">No niche set yet</span>
            )}
          </div>
          <div className="mb-6 flex flex-wrap gap-2">
            {creatorProfile.platforms.length > 0
              ? creatorProfile.platforms.map((p) => (
                  <span
                    key={p}
                    className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/60"
                  >
                    {p}
                  </span>
                ))
              : null}
          </div>
          <Link
            href="/dashboard/memory"
            className="text-xs font-medium text-pink-400 transition-colors hover:text-pink-300"
          >
            Update Profile →
          </Link>
        </div>
      </div>

      {/* DOT NAVIGATION */}
      <div className="fixed right-4 top-1/2 z-50 flex -translate-y-1/2 flex-col gap-2">
        {[0, 1, 2, 3].map((i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => scrollToSlide(i)}
            className={`h-2 w-2 rounded-full transition-all duration-200 ${
              activeSlide === i ? "scale-125 bg-white" : "bg-white/20"
            }`}
          />
        ))}
      </div>

      <style>{`
        @keyframes float1 { 0%,100% { transform: translateY(0px) } 50% { transform: translateY(-20px) } }
        @keyframes float2 { 0%,100% { transform: translateY(0px) } 50% { transform: translateY(-15px) } }
        @keyframes float3 { 0%,100% { transform: translateY(0px) } 50% { transform: translateY(-25px) } }
      `}</style>
    </div>
  );
}
