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
              className="captions-textarea mt-3 w-full resize-none disabled:opacity-50"
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
                  className={`captions-tone-pill${
                    platform === option.id ? " captions-tone-pill--active" : ""
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
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Analyzing trends...
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

        {trends.length > 0 && (
          <section className="mt-16">
            <div className="mb-6">
              <h2 className="text-lg font-semibold tracking-[-0.03em] text-white">
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
                  className="trends-card captions-glass-card !items-start !gap-0 !p-0"
                  style={{ animationDelay: `${Math.min(index * 0.06, 0.5)}s` }}
                >
                  <div className="flex w-full items-start justify-between gap-4 border-b border-[#7C3AED]/10 px-5 py-4 sm:px-6">
                    <div className="flex min-w-0 items-start gap-3">
                      <span className="captions-num-badge shrink-0">
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
                      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#A855F7]/60">
                        Why it&apos;s trending
                      </p>
                      <p className="mt-1.5 text-sm leading-relaxed text-white/70">
                        {trend.whyTrending}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#A855F7]/60">
                        Content angle
                      </p>
                      <p className="mt-1.5 text-sm leading-relaxed text-white/70">
                        {trend.contentAngle}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end border-t border-[#7C3AED]/10 px-5 py-3 sm:px-6">
                    <button
                      type="button"
                      onClick={() => void copyTrend(trend, index)}
                      className="captions-copy-btn"
                    >
                      {copiedIndex === index ? "Copied!" : "Copy"}
                    </button>
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
