"use client";

import { useState } from "react";
import { FeatureEmptyState } from "@/app/dashboard/components/feature-empty-state";
import {
  PremiumCopyButton,
  PremiumError,
  PremiumFieldLabel,
  PremiumGenerateButton,
  PremiumInput,
  PremiumLoadingSkeleton,
  PremiumPillGroup,
  PremiumResultsHeader,
  PremiumTextarea,
} from "@/app/dashboard/components/premium-ui";
import { useToast } from "@/app/dashboard/components/toast-provider";
import { AddToPlannerButton } from "@/app/dashboard/components/add-to-planner-button";

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

type ScriptSectionCardProps = {
  label: string;
  badge?: string;
  content: string;
  onCopy: () => void;
  copied: boolean;
  delay?: number;
};

function ScriptSectionCard({
  label,
  badge,
  content,
  onCopy,
  copied,
  delay = 0,
}: ScriptSectionCardProps) {
  return (
    <article
      className="premium-script-section"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="premium-script-section-label">{label}</p>
          {badge && <span className="premium-script-section-badge">{badge}</span>}
        </div>
        <PremiumCopyButton onClick={onCopy} copied={copied} />
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
    <div className="premium-feature-body">
      <div className="mx-auto w-full max-w-3xl">
        <section className="premium-form-section">
          <div>
            <PremiumFieldLabel htmlFor="script-topic">Video topic</PremiumFieldLabel>
            <PremiumTextarea
              id="script-topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={`What's your video about?\n\nExamples:\n• ${topicExamples.join("\n• ")}`}
              rows={6}
              disabled={isLoading}
            />
          </div>

          <div>
            <PremiumFieldLabel>Platform</PremiumFieldLabel>
            <div className="premium-platform-grid">
              {platforms.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setPlatform(option.id)}
                  disabled={isLoading}
                  aria-pressed={platform === option.id}
                  className={`premium-platform-card${
                    platform === option.id ? " premium-platform-card--active" : ""
                  }`}
                >
                  <span className="premium-platform-card-label">{option.label}</span>
                  <span className="premium-platform-card-desc">{option.description}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <PremiumFieldLabel>Tone</PremiumFieldLabel>
            <PremiumPillGroup
              options={tones}
              value={tone}
              onChange={(id) => setTone(id as ToneId)}
              disabled={isLoading}
            />
          </div>

          <div>
            <PremiumFieldLabel>Duration</PremiumFieldLabel>
            <PremiumPillGroup
              options={durations}
              value={duration}
              onChange={(id) => setDuration(id as DurationId)}
              disabled={isLoading}
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <PremiumFieldLabel htmlFor="script-audience">
                Target audience (optional)
              </PremiumFieldLabel>
              <PremiumInput
                id="script-audience"
                type="text"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="e.g. fitness beginners, SaaS founders"
                disabled={isLoading}
              />
            </div>
            <div>
              <PremiumFieldLabel htmlFor="script-keypoints">
                Key points (optional)
              </PremiumFieldLabel>
              <PremiumInput
                id="script-keypoints"
                type="text"
                value={keyPoints}
                onChange={(e) => setKeyPoints(e.target.value)}
                placeholder="e.g. tip 1, myth bust, personal story"
                disabled={isLoading}
              />
            </div>
          </div>

          <PremiumGenerateButton
            onClick={() => void generateScript()}
            disabled={!topic.trim()}
            loading={isLoading}
            loadingLabel="Generating"
          >
            Generate viral script
          </PremiumGenerateButton>
        </section>

        {error && <PremiumError message={error} />}

        {isLoading && <PremiumLoadingSkeleton count={4} />}

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
          />
        )}

        {script && !isLoading && (
          <section className="mt-12 space-y-6">
            <PremiumResultsHeader
              title="Your script"
              subtitle={`${script.wordCount > 0 ? `${script.wordCount} words` : ""}${script.wordCount > 0 && script.speakingTime ? " · " : ""}${script.speakingTime ? `~${script.speakingTime}` : ""}`}
            />
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void copyText(buildFullScript(script), "full")}
                className="premium-pill premium-pill--active"
              >
                {copiedKey === "full" ? "Copied!" : "Copy full script"}
              </button>
              <button
                type="button"
                onClick={() => void generateScript()}
                className="premium-pill"
              >
                Regenerate
              </button>
              <AddToPlannerButton
                contentType="script"
                contentText={buildFullScript(script)}
              />
            </div>

            <ScriptSectionCard
              label="Hook"
              badge="First 3 seconds"
              content={script.hook}
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
