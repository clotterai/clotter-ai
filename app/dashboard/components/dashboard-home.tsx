"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const CACHE_KEY = "clotter-daily-brief-v1";
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;

type CreatorProfileData = {
  niches: string[];
  platforms: string[];
  completion: number;
};

type DashboardHomeProps = {
  greeting: string;
  displayName: string;
  creatorProfile: CreatorProfileData | null;
};

export function DashboardHome({
  greeting,
  displayName,
  creatorProfile,
}: DashboardHomeProps) {
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

  const nicheTags = creatorProfile?.niches ?? [];
  const platformTags = creatorProfile?.platforms ?? [];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0D0D1A]">
      {/* AMBIENT BACKGROUND */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          style={{
            position: "absolute",
            bottom: "-10%",
            right: "-5%",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 70%)",
            filter: "blur(40px)",
            animation: "ambientFloat1 15s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "-10%",
            left: "-5%",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)",
            filter: "blur(40px)",
            animation: "ambientFloat2 20s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "40%",
            right: "20%",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(236,72,153,0.06) 0%, transparent 70%)",
            filter: "blur(60px)",
            animation: "ambientFloat3 25s ease-in-out infinite",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl space-y-16 px-6 py-10">
        {/* SECTION 1 - HERO GREETING */}
        <section className="pt-8">
          <div className="mb-3 flex items-center gap-2">
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #EC4899, #F97316)",
                animation: "pulse 2s ease-in-out infinite",
              }}
            />
            <span className="text-xs font-medium uppercase tracking-widest text-white/30">
              Clotter AI
            </span>
          </div>
          <h1 className="mb-3 text-4xl font-bold leading-tight text-white md:text-6xl">
            {greeting},<br />
            <span
              style={{
                background: "linear-gradient(135deg, #EC4899, #F97316)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {displayName}.
            </span>
          </h1>
          <p className="text-base font-normal text-white/30">
            Your creative OS is ready. What are we building today?
          </p>
        </section>

        {/* SECTION 2 - QUICK ACTIONS */}
        <section>
          <p className="mb-4 text-xs font-medium uppercase tracking-widest text-white/20">
            Quick Actions
          </p>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {[
              {
                name: "New Chat",
                desc: "Talk to your AI co-pilot",
                href: "/dashboard/chat",
                gradient: "from-pink-500 to-orange-500",
              },
              {
                name: "Captions",
                desc: "Write scroll-stopping captions",
                href: "/dashboard/captions",
                gradient: "from-pink-600 to-pink-400",
              },
              {
                name: "Hooks",
                desc: "Grab attention in 2 seconds",
                href: "/dashboard/hooks",
                gradient: "from-orange-500 to-pink-500",
              },
              {
                name: "Scripts",
                desc: "Viral short-form scripts",
                href: "/dashboard/script",
                gradient: "from-pink-500 to-rose-500",
              },
              {
                name: "Trends",
                desc: "Real-time trend intelligence",
                href: "/dashboard/trends",
                gradient: "from-orange-400 to-pink-500",
              },
              {
                name: "Ideas",
                desc: "Never run out of content",
                href: "/dashboard/content-ideas",
                gradient: "from-rose-500 to-orange-400",
              },
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.06]"
              >
                <div
                  className={`mb-4 flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br ${item.gradient}`}
                >
                  <div className="h-4 w-4 rounded-sm bg-white/90" />
                </div>
                <p className="mb-1 text-[13px] font-semibold text-white">
                  {item.name}
                </p>
                <p className="text-[11px] leading-relaxed text-white/35">
                  {item.desc}
                </p>
                <div className="absolute bottom-4 right-4 text-lg text-white/10 transition-colors group-hover:text-white/30">
                  →
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* SECTION 3 - TODAY'S OPPORTUNITIES */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="mb-1 text-xs font-medium uppercase tracking-widest text-white/20">
                Daily Intelligence
              </p>
              <h2 className="text-xl font-bold text-white">
                Today&apos;s Opportunities
              </h2>
            </div>
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem(CACHE_KEY);
                void fetchOpportunities(true);
              }}
              className="rounded-lg px-3 py-1.5 text-xs text-white/20 transition-colors hover:bg-white/5 hover:text-pink-400"
            >
              Refresh
            </button>
          </div>
          <div className="space-y-3">
            {!isLoadingOpportunities && opportunities.length > 0
              ? opportunities.map((opp, i) => (
                  <div
                    key={`${opp}-${i}`}
                    className="flex items-start gap-4 rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 transition-all duration-200 hover:border-white/[0.10]"
                  >
                    <div
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{
                        background:
                          "linear-gradient(135deg, #EC4899, #F97316)",
                      }}
                    />
                    <p className="text-[13px] leading-relaxed text-white/65">
                      {opp}
                    </p>
                  </div>
                ))
              : [1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-14 animate-pulse rounded-xl border border-white/[0.06] bg-white/[0.03]"
                  />
                ))}
          </div>
        </section>

        {/* SECTION 4 - CREATOR PROFILE */}
        <section className="pb-10">
          <div className="mb-4">
            <p className="mb-1 text-xs font-medium uppercase tracking-widest text-white/20">
              Your Profile
            </p>
            <h2 className="text-xl font-bold text-white">Creator DNA</h2>
          </div>
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6">
            {creatorProfile ? (
              <div className="space-y-4">
                <div>
                  <p className="mb-2 text-[10px] uppercase tracking-widest text-white/20">
                    Niche
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {nicheTags.length > 0 ? (
                      nicheTags.map((n) => (
                        <span
                          key={n}
                          className="rounded-full px-3 py-1 text-[11px] font-medium text-white"
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(236,72,153,0.3), rgba(249,115,22,0.3))",
                            border: "1px solid rgba(236,72,153,0.3)",
                          }}
                        >
                          {n}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-white/30">
                        No niche set yet
                      </span>
                    )}
                  </div>
                </div>
                {platformTags.length > 0 && (
                  <div>
                    <p className="mb-2 text-[10px] uppercase tracking-widest text-white/20">
                      Platforms
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {platformTags.map((p) => (
                        <span
                          key={p}
                          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-white/50"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <Link
                  href="/dashboard/memory"
                  className="mt-2 inline-flex items-center gap-2 text-xs text-pink-400 transition-colors hover:text-pink-300"
                >
                  View full profile →
                </Link>
              </div>
            ) : (
              <div className="py-6 text-center">
                <p className="mb-3 text-sm text-white/30">
                  Complete your creator profile
                </p>
                <Link
                  href="/dashboard/onboarding"
                  className="rounded-xl px-4 py-2 text-xs font-medium text-white transition-all"
                  style={{
                    background: "linear-gradient(135deg, #EC4899, #F97316)",
                  }}
                >
                  Set up profile →
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>

      <style>{`
        @keyframes ambientFloat1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-20px,-20px)} }
        @keyframes ambientFloat2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(20px,15px)} }
        @keyframes ambientFloat3 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-15px,20px)} }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.5)} }
      `}</style>
    </div>
  );
}
