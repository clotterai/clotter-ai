"use client";

import { TrendingUp } from "lucide-react";
import { useState } from "react";
import { FeatureEmptyState } from "@/app/dashboard/components/feature-empty-state";
import {
  PremiumCopyButton,
  PremiumError,
  PremiumFieldLabel,
  PremiumGenerateButton,
  PremiumLoadingSkeleton,
  PremiumPillGroup,
  PremiumResultsHeader,
  PremiumResultText,
  PremiumTextarea,
} from "@/app/dashboard/components/premium-ui";
import { useToast } from "@/app/dashboard/components/toast-provider";

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
  high: "border-white/[0.12] bg-white/[0.06] text-white/60",
  medium: "border-white/[0.12] bg-white/[0.06] text-white/50",
  low: "border-white/[0.06] bg-white/[0.03] text-white/35",
};

export function TrendAnalyzer() {
  const { showToast } = useToast();
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
      showToast("Content generated");
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
    showToast("Message copied");
    setTimeout(() => setCopiedIndex(null), 2000);
  }

  return (
    <div className="space-y-8">
        <section className="space-y-6">
          <div>
            <PremiumFieldLabel htmlFor="trend-niche">Your niche</PremiumFieldLabel>
            <PremiumTextarea
              id="trend-niche"
              value={niche}
              onChange={(event) => setNiche(event.target.value)}
              placeholder="e.g. fitness, fashion, finance, food, personal development..."
              rows={3}
              disabled={isLoading}
            />
          </div>

          <div>
            <PremiumFieldLabel>Platform</PremiumFieldLabel>
            <PremiumPillGroup
              options={platforms}
              value={platform}
              onChange={(id) => setPlatform(id as PlatformId)}
              disabled={isLoading}
            />
          </div>

          <PremiumGenerateButton
            onClick={() => void analyzeTrends()}
            disabled={!niche.trim()}
            loading={isLoading}
            loadingLabel="Analyzing"
          >
            Analyze trends
          </PremiumGenerateButton>
        </section>

        {error && <PremiumError message={error} />}

        {isLoading && <PremiumLoadingSkeleton />}

        {!isLoading && trends.length === 0 && !error && (
          <FeatureEmptyState
            icon={<TrendingUp size={24} strokeWidth={1.75} />}
            title="Trend intelligence"
            description="Enter your niche and platform — Clotter scans what's trending and gives you angles with viral potential scores."
          />
        )}

        {trends.length > 0 && !isLoading && (
          <section>
            <PremiumResultsHeader
              title="Trending now"
              subtitle={`${trends.length} topics analyzed for your niche`}
            />
            <ul className="space-y-3">
              {trends.map((trend, index) => (
                <li
                  key={index}
                  className="relative rounded-2xl border border-white/[0.06] bg-[#111114] transition-all duration-200 hover:border-white/[0.12]"
                >
                  <PremiumCopyButton
                    onClick={() => void copyTrend(trend, index)}
                    copied={copiedIndex === index}
                    className="absolute right-4 top-4"
                  />
                  <div className="flex items-start gap-3 border-b border-white/[0.06] px-5 py-4">
                    <span
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                      style={{
                        background: "linear-gradient(135deg, #EC4899, #F97316)",
                      }}
                    >
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1 pr-8">
                      <h3 className="text-sm font-semibold leading-snug text-white">
                        {trend.topic}
                      </h3>
                      <span
                        className={`mt-2 inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${VIRAL_BADGE[trend.viralScore]}`}
                      >
                        {VIRAL_LABELS[trend.viralScore]} potential
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4 px-5 py-4">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/25">
                        Why it&apos;s trending
                      </p>
                      <div className="mt-1.5">
                        <PremiumResultText>{trend.whyTrending}</PremiumResultText>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/25">
                        Content angle
                      </p>
                      <div className="mt-1.5">
                        <PremiumResultText>{trend.contentAngle}</PremiumResultText>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
    </div>
  );
}
