"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  Film,
  Lightbulb,
  MessageSquare,
  RotateCw,
  Search,
  TrendingUp,
  Type,
  Zap,
} from "lucide-react";

const CACHE_KEY = "clotter-daily-brief-v1";
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;
const CHAT_PREFILL_KEY = "clotter-dashboard-chat-prefill";

const COMMAND_PLACEHOLDERS = [
  "Create a viral Instagram Reel...",
  "Generate 5 scroll-stopping hooks...",
  "Write a YouTube script for...",
  "Find what's trending today...",
];

const QUICK_ACTIONS = [
  {
    icon: MessageSquare,
    name: "AI Chat",
    desc: "Your creative co-pilot",
    href: "/dashboard/chat",
  },
  {
    icon: Type,
    name: "Captions",
    desc: "Stop-the-scroll captions",
    href: "/dashboard/captions",
  },
  {
    icon: Zap,
    name: "Hooks",
    desc: "Grab attention instantly",
    href: "/dashboard/hooks",
  },
  {
    icon: Film,
    name: "Scripts",
    desc: "Viral short-form scripts",
    href: "/dashboard/script",
  },
  {
    icon: TrendingUp,
    name: "Trends",
    desc: "Real-time trend data",
    href: "/dashboard/trends",
  },
  {
    icon: Lightbulb,
    name: "Ideas",
    desc: "Never run out of content",
    href: "/dashboard/content-ideas",
  },
] as const;

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
  displayName,
  creatorProfile,
}: DashboardHomeProps) {
  const router = useRouter();
  const [opportunities, setOpportunities] = useState<string[]>([]);
  const [isLoadingOpportunities, setIsLoadingOpportunities] = useState(true);
  const [commandInput, setCommandInput] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isCommandFocused, setIsCommandFocused] = useState(false);

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
    const interval = setInterval(() => {
      setPlaceholderIndex((current) => (current + 1) % COMMAND_PLACEHOLDERS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  function handleAskClotter() {
    const text = commandInput.trim();
    if (text) {
      try {
        sessionStorage.setItem(CHAT_PREFILL_KEY, text);
      } catch {
        // Ignore storage errors.
      }
    }
    router.push("/dashboard/chat");
  }

  function handleCommandKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAskClotter();
    }
  }

  const nicheTags = creatorProfile?.niches ?? [];
  const platformTags = creatorProfile?.platforms ?? [];
  const profileCompletion = creatorProfile?.completion ?? 0;

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#09090B]">
      {/* AMBIENT BACKGROUND */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div
          className="absolute"
          style={{
            bottom: "-10%",
            right: "-5%",
            width: "480px",
            height: "480px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 70%)",
            filter: "blur(48px)",
            animation: "ambientFloat1 15s ease-in-out infinite",
          }}
        />
        <div
          className="absolute"
          style={{
            top: "-10%",
            left: "-5%",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 70%)",
            filter: "blur(48px)",
            animation: "ambientFloat2 20s ease-in-out infinite",
          }}
        />
        <div
          className="absolute"
          style={{
            top: "42%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "360px",
            height: "360px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(236,72,153,0.06) 0%, transparent 70%)",
            filter: "blur(60px)",
            animation: "ambientFloat3 25s ease-in-out infinite",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl space-y-12 px-6 py-10">
        {/* HERO */}
        <section className="space-y-6 pt-4">
          <div className="flex items-center gap-2">
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400"
              style={{ animation: "statusPulse 2s ease-in-out infinite" }}
            />
            <span className="text-[11px] font-medium tracking-wide text-white/40">
              Workspace Ready
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-white md:text-5xl">
              Welcome back,
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #EC4899, #F97316)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {displayName}
              </span>
            </h1>
            <p className="text-sm text-white/30">Your creative OS is ready.</p>
          </div>

          <div
            className={`group flex items-center gap-3 rounded-2xl border bg-white/[0.03] p-2 pl-4 backdrop-blur transition-all duration-200 ease-out ${
              isCommandFocused
                ? "border-pink-500/40 shadow-[0_0_30px_-10px_rgba(236,72,153,0.4)]"
                : "border-white/[0.08]"
            }`}
          >
            <Search className="h-5 w-5 shrink-0 text-white/25" strokeWidth={1.75} />
            <input
              type="text"
              value={commandInput}
              onChange={(event) => setCommandInput(event.target.value)}
              onFocus={() => setIsCommandFocused(true)}
              onBlur={() => setIsCommandFocused(false)}
              onKeyDown={handleCommandKeyDown}
              placeholder={COMMAND_PLACEHOLDERS[placeholderIndex]}
              className="min-w-0 flex-1 bg-transparent py-3 text-[15px] text-white placeholder:text-white/25 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAskClotter}
              className="shrink-0 rounded-xl px-4 py-2.5 text-[13px] font-semibold text-white transition-all duration-200 ease-out hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, #EC4899, #F97316)",
              }}
            >
              Ask Clotter →
            </button>
          </div>
        </section>

        {/* QUICK ACTIONS */}
        <section>
          <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-3">
            {QUICK_ACTIONS.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group relative rounded-2xl border border-white/[0.06] bg-[#111114] p-5 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-white/[0.12] hover:shadow-[0_8px_30px_-10px_rgba(0,0,0,0.5)]"
                >
                  <Icon
                    className="mb-4 h-5 w-5 text-white/40 transition-colors duration-200 group-hover:text-white/55"
                    strokeWidth={1.75}
                  />
                  <p className="mb-1 text-[13px] font-semibold text-white">
                    {item.name}
                  </p>
                  <p className="text-[11px] text-white/30">{item.desc}</p>
                  <span className="absolute bottom-4 right-4 text-sm text-white/15 transition-colors duration-200 group-hover:text-white/40">
                    →
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* DAILY BRIEF */}
        <section>
          <div className="mb-4 flex items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="text-[10px] tracking-[0.2em] text-white/20">
                DAILY INTELLIGENCE
              </p>
              <h2 className="text-xl font-semibold text-white">
                Today&apos;s Opportunities
              </h2>
            </div>
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem(CACHE_KEY);
                void fetchOpportunities(true);
              }}
              className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-white/20 transition-all duration-200 ease-out hover:text-white/60"
              aria-label="Refresh opportunities"
            >
              <RotateCw
                className={`h-3.5 w-3.5 ${isLoadingOpportunities ? "animate-spin" : ""}`}
                strokeWidth={1.75}
              />
            </button>
          </div>

          <div className="space-y-3">
            {!isLoadingOpportunities && opportunities.length > 0
              ? opportunities.map((opp, i) => (
                  <div
                    key={`${opp}-${i}`}
                    className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-[#111114] p-4 transition-all duration-200 ease-out hover:border-white/[0.10]"
                  >
                    <span
                      className="mt-2 h-0.5 w-0.5 shrink-0 rounded-full"
                      style={{
                        background: "linear-gradient(135deg, #EC4899, #F97316)",
                        boxShadow: "0 0 0 2px rgba(236,72,153,0.15)",
                      }}
                    />
                    <p className="text-[13px] leading-relaxed text-white/55">
                      {opp}
                    </p>
                  </div>
                ))
              : [1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-[52px] animate-pulse rounded-xl border border-white/[0.06] bg-[#111114]"
                  />
                ))}
          </div>
        </section>

        {/* CREATOR PROFILE */}
        <section className="pb-8">
          <div className="mb-4 space-y-1">
            <p className="text-[10px] tracking-[0.2em] text-white/20">
              CREATOR PROFILE
            </p>
            <h2 className="text-xl font-semibold text-white">Your Creator DNA</h2>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-[#111114] p-6">
            {creatorProfile ? (
              <div className="space-y-5">
                <div>
                  <p className="mb-2.5 text-[10px] tracking-[0.15em] text-white/20">
                    NICHE
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {nicheTags.length > 0 ? (
                      nicheTags.map((n) => (
                        <span
                          key={n}
                          className="rounded-full border px-3 py-1 text-[11px] font-medium text-white/80"
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(236,72,153,0.12), rgba(249,115,22,0.12))",
                            borderColor: "rgba(236,72,153,0.25)",
                          }}
                        >
                          {n}
                        </span>
                      ))
                    ) : (
                      <span className="text-[13px] text-white/30">
                        No niche set yet
                      </span>
                    )}
                  </div>
                </div>

                {platformTags.length > 0 && (
                  <div>
                    <p className="mb-2.5 text-[10px] tracking-[0.15em] text-white/20">
                      PLATFORMS
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

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-[10px] tracking-[0.15em] text-white/20">
                      PROFILE COMPLETION
                    </p>
                    <span className="text-[11px] tabular-nums text-white/40">
                      {profileCompletion}%
                    </span>
                  </div>
                  <div className="h-1 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className="h-full rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${profileCompletion}%`,
                        background: "linear-gradient(90deg, #EC4899, #F97316)",
                      }}
                    />
                  </div>
                </div>

                <Link
                  href="/dashboard/memory"
                  className="inline-flex items-center text-xs text-pink-400 transition-colors duration-200 hover:text-pink-300"
                >
                  View full profile →
                </Link>
              </div>
            ) : (
              <div className="py-4 text-center">
                <p className="mb-4 text-[13px] text-white/30">
                  Complete your creator profile to unlock personalized intelligence.
                </p>
                <Link
                  href="/dashboard/onboarding"
                  className="inline-flex rounded-xl px-4 py-2 text-xs font-medium text-white transition-all duration-200 hover:opacity-90"
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
        @keyframes ambientFloat1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-18px,-18px)} }
        @keyframes ambientFloat2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(16px,14px)} }
        @keyframes ambientFloat3 { 0%,100%{transform:translate(-50%,0)} 50%{transform:translate(calc(-50% - 12px),18px)} }
        @keyframes statusPulse { 0%,100%{opacity:1;box-shadow:0 0 0 0 rgba(52,211,153,0.4)} 50%{opacity:0.7;box-shadow:0 0 0 4px rgba(52,211,153,0)} }
      `}</style>
    </div>
  );
}
