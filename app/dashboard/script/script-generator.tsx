"use client";

import { useState } from "react";
import { FeatureEmptyState } from "@/app/dashboard/components/feature-empty-state";
import { useToast } from "@/app/dashboard/components/toast-provider";

const platforms = [
  {
    id: "instagram_reels",
    label: "Instagram Reels",
    description: "Vertical, fast-paced",
  },
  {
    id: "youtube_shorts",
    label: "YouTube Shorts",
    description: "Hook in 1 second",
  },
  {
    id: "tiktok",
    label: "TikTok",
    description: "Trend-native energy",
  },
  {
    id: "youtube_long",
    label: "YouTube Long Form",
    description: "Deep storytelling",
  },
] as const;

const tones = [
  { id: "educational", label: "Educational" },
  { id: "entertaining", label: "Entertaining" },
  { id: "motivational", label: "Motivational" },
  { id: "storytime", label: "Storytime" },
  { id: "controversial", label: "Controversial" },
] as const;

const durations = [
  { id: "15s", label: "15s" },
  { id: "30s", label: "30s" },
  { id: "60s", label: "60s" },
  { id: "3min", label: "3 min" },
  { id: "5min", label: "5 min" },
  { id: "10min", label: "10 min" },
] as const;

type PlatformId = (typeof platforms)[number]["id"];
type ToneId = (typeof tones)[number]["id"];
type DurationId = (typeof durations)[number]["id"];

export type ScriptSection = {
  timestamp: string;
  title: string;
  content: string;
};

export type ScriptResult = {
  hook: string;
  opening: string;
  sections: ScriptSection[];
  cta: string;
  wordCount: number;
  speakingTime: string;
};

const topicExamples = [
  "How I grew to 100K followers in 90 days without ads",
  "5 productivity hacks every creator needs in 2026",
  "Why most people fail at content creation (and how to fix it)",
];

function buildFullScript(script: ScriptResult) {
  const body = script.sections
    .map(
      (s) =>
        `[${s.timestamp}] ${s.title}\n${s.content}`,
    )
    .join("\n\n");

  return `HOOK (0:00-0:03)\n${script.hook}\n\nOPENING\n${script.opening}\n\n${body}\n\nCTA\n${script.cta}`;
}

function ScriptLoading() {
  return (
    <div className="script-loading-card">
      <div className="script-loading-dots" aria-hidden>
        <span className="script-loading-dot" />
        <span className="script-loading-dot" />
        <span className="script-loading-dot" />
      </div>
      <p className="mt-4 text-sm font-medium text-white/70">
        Crafting your viral script...
      </p>
      <p className="mt-1 text-xs text-white/35">
        Optimizing hook, pacing, and retention
      </p>
    </div>
  );
}

type ScriptSectionCardProps = {
  label: string;
  badge?: string;
  content: string;
  variant?: "default" | "hook" | "cta";
  onCopy: () => void;
  copied: boolean;
  delay?: number;
};

function ScriptSectionCard({
  label,
  badge,
  content,
  variant = "default",
  onCopy,
  copied,
  delay = 0,
}: ScriptSectionCardProps) {
  return (
    <article
      className={`script-section-card script-section-card--${variant}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="script-section-label">{label}</p>
          {badge && <span className="script-section-badge">{badge}</span>}
        </div>
        <button type="button" onClick={onCopy} className="captions-copy-btn">
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <p className="mt-4 whitespace-pre-wrap text-[0.9375rem] leading-[1.8] tracking-[-0.014em] text-white/88 sm:text-base">
        {content}
      </p>
    </article>
  );
}

export function ScriptGenerator() {
  const { showToast } = useToast();
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState<PlatformId>("instagram_reels");
  const [tone, setTone] = useState<ToneId>("entertaining");
  const [duration, setDuration] = useState<DurationId>("60s");
  const [audience, setAudience] = useState("");
  const [keyPoints, setKeyPoints] = useState("");
  const [script, setScript] = useState<ScriptResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  async function generateScript() {
    const trimmed = topic.trim();
    if (!trimmed || isLoading) return;

    setIsLoading(true);
    setError(null);
    setScript(null);

    try {
      const response = await fetch("/api/script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: trimmed,
          platform,
          tone,
          duration,
          audience: audience.trim() || undefined,
          keyPoints: keyPoints.trim() || undefined,
        }),
      });

      const data = (await response.json()) as ScriptResult & { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate script.");
      }

      setScript(data);
      showToast("Content generated");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  async function copyText(text: string, key: string) {
    await navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast("Message copied");
    setTimeout(() => setCopiedKey(null), 2000);
  }

  return (
    <div className="captions-fade-in relative z-10 flex-1 overflow-y-auto px-6 pb-16 pt-8 sm:px-10 sm:pb-20 sm:pt-10">
      <div className="mx-auto w-full max-w-3xl">
        <section className="script-form-card space-y-8 p-6 sm:p-8">
          <div>
            <label
              htmlFor="script-topic"
              className="text-xs font-semibold uppercase tracking-[0.1em] text-white/35"
            >
              Video topic
            </label>
            <textarea
              id="script-topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={`What's your video about?\n\nExamples:\n• ${topicExamples.join("\n• ")}`}
              rows={6}
              disabled={isLoading}
              className="captions-textarea mt-3 w-full resize-none disabled:opacity-50"
            />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-white/35">
              Platform
            </p>
            <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {platforms.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setPlatform(option.id)}
                  disabled={isLoading}
                  aria-pressed={platform === option.id}
                  className={`script-platform-card${
                    platform === option.id ? " script-platform-card--active" : ""
                  }`}
                >
                  <span className="script-platform-card-label">{option.label}</span>
                  <span className="script-platform-card-desc">{option.description}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-white/35">
              Tone
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {tones.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setTone(option.id)}
                  disabled={isLoading}
                  aria-pressed={tone === option.id}
                  className={`captions-tone-pill${
                    tone === option.id ? " captions-tone-pill--active" : ""
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-white/35">
              Duration
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {durations.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setDuration(option.id)}
                  disabled={isLoading}
                  aria-pressed={duration === option.id}
                  className={`captions-tone-pill${
                    duration === option.id ? " captions-tone-pill--active" : ""
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="script-audience"
                className="text-xs font-semibold uppercase tracking-[0.1em] text-white/35"
              >
                Target audience{" "}
                <span className="normal-case tracking-normal text-white/25">
                  (optional)
                </span>
              </label>
              <input
                id="script-audience"
                type="text"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="e.g. fitness beginners, SaaS founders"
                disabled={isLoading}
                className="captions-textarea mt-3 !min-h-0 !py-3.5 text-base sm:text-[1.0625rem]"
              />
            </div>
            <div>
              <label
                htmlFor="script-keypoints"
                className="text-xs font-semibold uppercase tracking-[0.1em] text-white/35"
              >
                Key points{" "}
                <span className="normal-case tracking-normal text-white/25">
                  (optional)
                </span>
              </label>
              <input
                id="script-keypoints"
                type="text"
                value={keyPoints}
                onChange={(e) => setKeyPoints(e.target.value)}
                placeholder="e.g. tip 1, myth bust, personal story"
                disabled={isLoading}
                className="captions-textarea mt-3 !min-h-0 !py-3.5 text-base sm:text-[1.0625rem]"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => void generateScript()}
            disabled={!topic.trim() || isLoading}
            className="captions-generate-btn"
          >
            <span className="relative z-[1] flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Generating script...
                </>
              ) : (
                "Generate viral script"
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
          <div className="mt-10">
            <ScriptLoading />
          </div>
        )}

        {!isLoading && !script && !error && (
          <FeatureEmptyState
            icon={
              <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" aria-hidden>
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
            }
            title="Viral video scripts"
            description="Describe your topic, platform, and tone — Clotter AI builds a full script with hook, sections, and CTA optimized for retention."
            cta="Fill in the form above and hit Generate"
          />
        )}

        {script && !isLoading && (
          <section className="mt-12 space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="font-heading text-xl font-bold tracking-[-0.02em] text-white sm:text-2xl">
                  Your script
                </h2>
                <div className="mt-2 flex flex-wrap gap-3 text-sm text-white/45">
                  {script.wordCount > 0 && (
                    <span className="script-stat-pill">{script.wordCount} words</span>
                  )}
                  {script.speakingTime && (
                    <span className="script-stat-pill">~{script.speakingTime}</span>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => void copyText(buildFullScript(script), "full")}
                  className="script-action-btn script-action-btn--primary"
                >
                  {copiedKey === "full" ? "Copied!" : "Copy full script"}
                </button>
                <button
                  type="button"
                  onClick={() => void generateScript()}
                  className="script-action-btn"
                >
                  Regenerate
                </button>
              </div>
            </div>

            <ScriptSectionCard
              label="Hook"
              badge="First 3 seconds"
              content={script.hook}
              variant="hook"
              onCopy={() => void copyText(script.hook, "hook")}
              copied={copiedKey === "hook"}
              delay={0.05}
            />

            <ScriptSectionCard
              label="Opening"
              content={script.opening}
              onCopy={() => void copyText(script.opening, "opening")}
              copied={copiedKey === "opening"}
              delay={0.1}
            />

            {script.sections.map((section, index) => (
              <ScriptSectionCard
                key={`${section.title}-${index}`}
                label={section.title}
                badge={section.timestamp}
                content={section.content}
                onCopy={() =>
                  void copyText(section.content, `section-${index}`)
                }
                copied={copiedKey === `section-${index}`}
                delay={0.15 + index * 0.05}
              />
            ))}

            <ScriptSectionCard
              label="Call to action"
              badge="CTA"
              content={script.cta}
              variant="cta"
              onCopy={() => void copyText(script.cta, "cta")}
              copied={copiedKey === "cta"}
              delay={0.2 + script.sections.length * 0.05}
            />
          </section>
        )}
      </div>
    </div>
  );
}
