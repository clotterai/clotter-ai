"use client";

import { FileText } from "lucide-react";
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
  premiumPillActiveStyle,
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
};

function ScriptSectionCard({
  label,
  badge,
  content,
  onCopy,
  copied,
}: ScriptSectionCardProps) {
  return (
    <article className="relative rounded-2xl border border-white/[0.06] bg-[#111114] p-5 transition-all duration-200 hover:border-white/[0.12]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/25">
            {label}
          </p>
          {badge && (
            <span className="mt-1 inline-block text-[11px] text-white/35">
              {badge}
            </span>
          )}
        </div>
        <PremiumCopyButton onClick={onCopy} copied={copied} />
      </div>
      <p className="mt-4 whitespace-pre-wrap text-[13px] leading-relaxed text-white/75">
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
    <div className="space-y-8">
        <section className="space-y-6">
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
            <div className="grid gap-2 sm:grid-cols-2">
              {platforms.map((option) => {
                const isActive = platform === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setPlatform(option.id)}
                    disabled={isLoading}
                    aria-pressed={isActive}
                    className={`rounded-2xl border p-4 text-left transition-all duration-200 ${
                      isActive
                        ? "border-pink-500/50"
                        : "border-white/[0.06] bg-white/[0.03] hover:border-white/15"
                    }`}
                    style={isActive ? premiumPillActiveStyle : undefined}
                  >
                    <span className="block text-xs font-medium text-white">
                      {option.label}
                    </span>
                    <span className="mt-1 block text-[11px] text-white/35">
                      {option.description}
                    </span>
                  </button>
                );
              })}
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

        {isLoading && <PremiumLoadingSkeleton />}

        {!isLoading && !script && !error && (
          <FeatureEmptyState
            icon={<FileText size={24} strokeWidth={1.75} />}
            title="Viral video scripts"
            description="Describe your topic, platform, and tone — Clotter AI builds a full script with hook, sections, and CTA optimized for retention."
          />
        )}

        {script && !isLoading && (
          <section className="space-y-6">
            <PremiumResultsHeader
              title="Your script"
              subtitle={`${script.wordCount > 0 ? `${script.wordCount} words` : ""}${script.wordCount > 0 && script.speakingTime ? " · " : ""}${script.speakingTime ? `~${script.speakingTime}` : ""}`}
            />
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void copyText(buildFullScript(script), "full")}
                className="rounded-full border border-pink-500/50 px-4 py-2 text-xs font-medium text-white transition-all duration-150"
                style={premiumPillActiveStyle}
              >
                {copiedKey === "full" ? "Copied!" : "Copy full script"}
              </button>
              <button
                type="button"
                onClick={() => void generateScript()}
                className="rounded-full border border-white/[0.06] bg-white/[0.03] px-4 py-2 text-xs text-white/40 transition-all duration-150 hover:border-white/15 hover:text-white/60"
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
            />

            <ScriptSectionCard
              label="Opening"
              content={script.opening}
              onCopy={() => void copyText(script.opening, "opening")}
              copied={copiedKey === "opening"}
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
              />
            ))}

            <ScriptSectionCard
              label="Call to action"
              badge="CTA"
              content={script.cta}
              onCopy={() => void copyText(script.cta, "cta")}
              copied={copiedKey === "cta"}
            />
          </section>
        )}
    </div>
  );
}
