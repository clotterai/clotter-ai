"use client";

import { useState } from "react";
import { FeatureEmptyState } from "@/app/dashboard/components/feature-empty-state";
import {
  PremiumError,
  PremiumFieldLabel,
  PremiumGenerateButton,
  PremiumLoadingSkeleton,
  PremiumPillGroup,
  PremiumResultCard,
  PremiumResultsHeader,
  PremiumTextarea,
} from "@/app/dashboard/components/premium-ui";
import { useToast } from "@/app/dashboard/components/toast-provider";
import { AddToPlannerButton } from "@/app/dashboard/components/add-to-planner-button";

const platforms = [
  { id: "reels", label: "Reels" },
  { id: "tiktok", label: "TikTok" },
  { id: "youtube_shorts", label: "YouTube Shorts" },
  { id: "linkedin", label: "LinkedIn" },
] as const;

type PlatformId = (typeof platforms)[number]["id"];

export function HookGenerator() {
  const { showToast } = useToast();
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState<PlatformId>("reels");
  const [hooks, setHooks] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  async function generateHooks() {
    const trimmed = topic.trim();
    if (!trimmed || isLoading) return;

    setIsLoading(true);
    setError(null);
    setHooks([]);

    try {
      const response = await fetch("/api/hooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: trimmed, platform }),
      });

      const data = (await response.json()) as {
        hooks?: string[];
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate hooks.");
      }

      if (!data.hooks?.length) {
        throw new Error("No hooks were returned.");
      }

      setHooks(data.hooks);
      showToast("Content generated");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  async function copyHook(hook: string, index: number) {
    await navigator.clipboard.writeText(hook);
    setCopiedIndex(index);
    showToast("Message copied");
    setTimeout(() => setCopiedIndex(null), 2000);
  }

  return (
    <div className="premium-feature-body">
      <div className="mx-auto w-full max-w-2xl">
        <section className="premium-form-section">
          <div>
            <PremiumFieldLabel htmlFor="hook-topic">Video topic</PremiumFieldLabel>
            <PremiumTextarea
              id="hook-topic"
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
              placeholder="What's your video about? e.g. 5 habits that changed my productivity..."
              rows={5}
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
            onClick={() => void generateHooks()}
            disabled={!topic.trim()}
            loading={isLoading}
            loadingLabel="Generating"
          >
            Generate 10 hooks
          </PremiumGenerateButton>
        </section>

        {error && <PremiumError message={error} />}

        {isLoading && <PremiumLoadingSkeleton count={5} />}

        {!isLoading && hooks.length === 0 && !error && (
          <FeatureEmptyState
            icon={
              <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" aria-hidden>
                <path
                  d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            }
            title="Attention-grabbing hooks"
            description="Enter your video topic and platform — get scroll-stopping openers that grab viewers in the first two seconds."
          />
        )}

        {hooks.length > 0 && !isLoading && (
          <section className="mt-12">
            <PremiumResultsHeader
              title="Your hooks"
              subtitle={`${hooks.length} scroll-stopping openers ready to copy`}
            />
            <ul className="space-y-3">
              {hooks.map((hook, index) => (
                <PremiumResultCard
                  key={index}
                  index={index + 1}
                  onCopy={() => void copyHook(hook, index)}
                  copied={copiedIndex === index}
                  delay={index * 0.06}
                >
                  <p className="text-[0.9375rem] leading-[1.75] tracking-[-0.014em] text-white/85 sm:text-base">
                    {hook}
                  </p>
                  <div className="mt-3">
                    <AddToPlannerButton contentType="hook" contentText={hook} />
                  </div>
                </PremiumResultCard>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
