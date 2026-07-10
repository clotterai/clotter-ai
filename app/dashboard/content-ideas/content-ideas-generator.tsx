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
  { id: "instagram", label: "Instagram" },
  { id: "youtube", label: "YouTube" },
  { id: "tiktok", label: "TikTok" },
  { id: "linkedin", label: "LinkedIn" },
] as const;

type PlatformId = (typeof platforms)[number]["id"];

export function ContentIdeasGenerator() {
  const { showToast } = useToast();
  const [niche, setNiche] = useState("");
  const [platform, setPlatform] = useState<PlatformId>("instagram");
  const [ideas, setIdeas] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  async function generateIdeas() {
    const trimmed = niche.trim();
    if (!trimmed || isLoading) return;

    setIsLoading(true);
    setError(null);
    setIdeas([]);

    try {
      const response = await fetch("/api/content-ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche: trimmed, platform }),
      });

      const data = (await response.json()) as {
        ideas?: string[];
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate content ideas.");
      }

      if (!data.ideas?.length) {
        throw new Error("No content ideas were returned.");
      }

      setIdeas(data.ideas);
      showToast("Content generated");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  async function copyIdea(idea: string, index: number) {
    await navigator.clipboard.writeText(idea);
    setCopiedIndex(index);
    showToast("Message copied");
    setTimeout(() => setCopiedIndex(null), 2000);
  }

  return (
    <div className="premium-feature-body">
      <div className="mx-auto w-full max-w-2xl">
        <section className="premium-form-section">
          <div>
            <PremiumFieldLabel htmlFor="content-niche">Your niche</PremiumFieldLabel>
            <PremiumTextarea
              id="content-niche"
              value={niche}
              onChange={(event) => setNiche(event.target.value)}
              placeholder="e.g. fitness for busy professionals, personal finance for Gen Z, vegan meal prep..."
              rows={4}
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
            onClick={() => void generateIdeas()}
            disabled={!niche.trim()}
            loading={isLoading}
            loadingLabel="Generating"
          >
            Generate 20 ideas
          </PremiumGenerateButton>
        </section>

        {error && <PremiumError message={error} />}

        {isLoading && <PremiumLoadingSkeleton count={5} />}

        {!isLoading && ideas.length === 0 && !error && (
          <FeatureEmptyState
            icon={
              <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" aria-hidden>
                <path
                  d="M9.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M12 6v6l3 2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            }
            title="Fresh content ideas"
            description="Tell Clotter your niche and platform — get 20 viral content concepts you haven't seen a hundred times before."
          />
        )}

        {ideas.length > 0 && !isLoading && (
          <section className="mt-12">
            <PremiumResultsHeader
              title="Your content ideas"
              subtitle={`${ideas.length} viral concepts ready to copy`}
            />
            <ul className="space-y-3">
              {ideas.map((idea, index) => (
                <PremiumResultCard
                  key={index}
                  index={index + 1}
                  onCopy={() => void copyIdea(idea, index)}
                  copied={copiedIndex === index}
                  delay={Math.min(index * 0.04, 0.6)}
                >
                  <p className="text-[0.9375rem] leading-[1.75] tracking-[-0.014em] text-white/85 sm:text-base">
                    {idea}
                  </p>
                  <div className="mt-3">
                    <AddToPlannerButton contentType="idea" contentText={idea} />
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
