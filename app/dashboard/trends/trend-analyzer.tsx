"use client";

import { useState } from "react";

const platforms = [
  { id: "instagram", label: "Instagram" },
  { id: "youtube", label: "YouTube" },
  { id: "tiktok", label: "TikTok" },
  { id: "linkedin", label: "LinkedIn" },
] as const;

type PlatformId = (typeof platforms)[number]["id"];
type ViralScore = "high" | "medium" | "low";

type Trend = {
  topic: string;
  whyTrending: string;
  contentAngle: string;
  viralScore: ViralScore;
};

const VIRAL_LABELS: Record<ViralScore, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

const VIRAL_BADGE: Record<ViralScore, string> = {
  high: "trends-viral-high",
  medium: "trends-viral-medium",
  low: "trends-viral-low",
};

const SKELETON_COUNT = 5;

function CopyTrendButton({
  copied,
  onCopy,
}: {
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onCopy}
      className={`trends-copy-btn${copied ? " trends-copy-btn--copied" : ""}`}
      aria-label={copied ? "Copied" : "Copy trend"}
    >
      {copied ? (
        <>
          <svg
            viewBox="0 0 16 16"
            fill="none"
            className="h-4 w-4"
            aria-hidden
          >
            <path
              d="M3.5 8.5l3 3 6-6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg
            viewBox="0 0 16 16"
            fill="none"
            className="h-4 w-4"
            aria-hidden
          >
            <rect
              x="5"
              y="5"
              width="8"
              height="8"
              rx="1.5"
              stroke="currentColor"
              strokeWidth="1.25"
            />
            <path
              d="M5 11H4a1.5 1.5 0 0 1-1.5-1.5V4A1.5 1.5 0 0 1 4 2.5h5.5A1.5 1.5 0 0 1 11 4v1"
              stroke="currentColor"
              strokeWidth="1.25"
            />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}

function TrendSkeletonCard({ index }: { index: number }) {
  return (
    <li
      className="trends-skeleton-card"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <div className="trends-skeleton-line h-9 w-9 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1 space-y-2.5 pt-1">
            <div className="trends-skeleton-line h-4 w-3/4 max-w-[280px]" />
            <div className="trends-skeleton-line h-3 w-full" />
          </div>
        </div>
        <div className="trends-skeleton-line h-6 w-16 shrink-0 rounded-full" />
      </div>
      <div className="mt-5 space-y-4">
        <div className="space-y-2">
          <div className="trends-skeleton-line h-2.5 w-24" />
          <div className="trends-skeleton-line h-3 w-full" />
          <div className="trends-skeleton-line h-3 w-5/6" />
        </div>
        <div className="space-y-2">
          <div className="trends-skeleton-line h-2.5 w-20" />
          <div className="trends-skeleton-line h-3 w-full" />
          <div className="trends-skeleton-line h-3 w-4/5" />
        </div>
      </div>
    </li>
  );
}

export function TrendAnalyzer() {
  const [niche, setNiche] = useState("");
  const [platform, setPlatform] = useState<PlatformId>("instagram");
  const [trends, setTrends] = useState<Trend[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  async function analyzeTrends() {
    const trimmed = niche.trim();
    if (!trimmed || isLoading) return;

    setIsLoading(true);
    setError(null);
    setTrends([]);

    try {
      const response = await fetch("/api/trends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche: trimmed, platform }),
      });

      const data = (await response.json()) as {
        trends?: Trend[];
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze trends.");
      }

      if (!data.trends?.length) {
        throw new Error("No trends were returned.");
      }

      setTrends(data.trends);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  function formatTrendForCopy(trend: Trend) {
    return [
      `Topic: ${trend.topic}`,
      `Why trending: ${trend.whyTrending}`,
      `Content angle: ${trend.contentAngle}`,
      `Viral potential: ${VIRAL_LABELS[trend.viralScore]}`,
    ].join("\n");
  }

  async function copyTrend(trend: Trend, index: number) {
    await navigator.clipboard.writeText(formatTrendForCopy(trend));
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  }

  return (
    <div className="captions-fade-in relative z-10 flex-1 overflow-y-auto px-6 pb-16 pt-8 sm:px-10 sm:pb-20 sm:pt-10">
      <div className="mx-auto w-full max-w-2xl">
        <section className="space-y-8">
          <div>
            <label
              htmlFor="trend-niche"
              className="text-xs font-semibold uppercase tracking-[0.1em] text-white/35"
            >
              Your niche
            </label>
            <textarea
              id="trend-niche"
              value={niche}
              onChange={(event) => setNiche(event.target.value)}
              placeholder="e.g. fitness, fashion, finance, food, personal development..."
              rows={3}
              disabled={isLoading}
              className="trends-textarea mt-3 w-full resize-none disabled:opacity-50"
            />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-white/35">
              Platform
            </p>
            <div className="mt-3 flex flex-wrap gap-2 sm:gap-2.5">
              {platforms.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setPlatform(option.id)}
                  disabled={isLoading}
                  aria-pressed={platform === option.id}
                  className={`trends-platform-pill${
                    platform === option.id ? " trends-platform-pill--active" : ""
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => void analyzeTrends()}
            disabled={!niche.trim() || isLoading}
            className="captions-generate-btn"
          >
            <span className="relative z-[1] flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  Analyzing trends
                  <span className="trends-loading-dots" aria-hidden>
                    <span>.</span>
                    <span>.</span>
                    <span>.</span>
                  </span>
                </>
              ) : (
                "Analyze trends"
              )}
            </span>
          </button>
        </section>

        {error && (
          <p className="mt-8 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm leading-relaxed text-red-300">
            {error}
          </p>
        )}

        {isLoading && (
          <section className="mt-16">
            <div className="mb-6">
              <h2 className="font-heading text-lg font-bold tracking-[-0.02em] text-white">
                Analyzing trends
                <span className="trends-loading-dots" aria-hidden>
                  <span>.</span>
                  <span>.</span>
                  <span>.</span>
                </span>
              </h2>
              <p className="mt-1 text-sm text-white/40">
                Scanning what&apos;s trending in your niche
              </p>
            </div>

            <ul className="space-y-4">
              {Array.from({ length: SKELETON_COUNT }, (_, index) => (
                <TrendSkeletonCard key={index} index={index} />
              ))}
            </ul>
          </section>
        )}

        {!isLoading && trends.length > 0 && (
          <section className="mt-16">
            <div className="mb-6">
              <h2 className="font-heading text-lg font-bold tracking-[-0.02em] text-white">
                Trending now
              </h2>
              <p className="mt-1 text-sm text-white/40">
                {trends.length} topics analyzed for your niche
              </p>
            </div>

            <ul className="space-y-4">
              {trends.map((trend, index) => (
                <li
                  key={index}
                  className="trends-result-card"
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  <div className="flex w-full items-start justify-between gap-4 border-b border-white/10 px-5 py-4 sm:px-6">
                    <div className="flex min-w-0 items-start gap-3">
                      <span className="trends-num-badge shrink-0">
                        {index + 1}
                      </span>
                      <h3 className="pt-1 text-base font-semibold leading-snug tracking-[-0.02em] text-white sm:text-[1.0625rem]">
                        {trend.topic}
                      </h3>
                    </div>
                    <span
                      className={`trends-viral-badge shrink-0 ${VIRAL_BADGE[trend.viralScore]}`}
                    >
                      {VIRAL_LABELS[trend.viralScore]}
                    </span>
                  </div>

                  <div className="space-y-4 px-5 py-4 sm:px-6">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#EC4899]/60">
                        Why it&apos;s trending
                      </p>
                      <p className="mt-1.5 text-sm leading-relaxed text-white/70">
                        {trend.whyTrending}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#EC4899]/60">
                        Content angle
                      </p>
                      <p className="mt-1.5 text-sm leading-relaxed text-white/70">
                        {trend.contentAngle}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end border-t border-white/10 px-5 py-3 sm:px-6">
                    <CopyTrendButton
                      copied={copiedIndex === index}
                      onCopy={() => void copyTrend(trend, index)}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
