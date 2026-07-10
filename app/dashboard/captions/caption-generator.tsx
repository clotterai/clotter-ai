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

const tones = [
  { id: "funny", label: "Funny" },
  { id: "professional", label: "Professional" },
  { id: "viral", label: "Viral" },
  { id: "emotional", label: "Emotional" },
] as const;

type ToneId = (typeof tones)[number]["id"];

export function CaptionGenerator() {
  const { showToast } = useToast();
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState<ToneId>("viral");
  const [captions, setCaptions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  async function generateCaptions() {
    const trimmed = topic.trim();
    if (!trimmed || isLoading) return;

    setIsLoading(true);
    setError(null);
    setCaptions([]);

    try {
      const response = await fetch("/api/captions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: trimmed, tone }),
      });

      const data = (await response.json()) as {
        captions?: string[];
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate captions.");
      }

      if (!data.captions?.length) {
        throw new Error("No captions were returned.");
      }

      setCaptions(data.captions);
      showToast("Content generated");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  async function copyCaption(caption: string, index: number) {
    await navigator.clipboard.writeText(caption);
    setCopiedIndex(index);
    showToast("Message copied");
    setTimeout(() => setCopiedIndex(null), 2000);
  }

  return (
    <div className="premium-feature-body">
      <div className="mx-auto w-full max-w-2xl">
        <section className="premium-form-section">
          <div>
            <PremiumFieldLabel htmlFor="topic">Post topic</PremiumFieldLabel>
            <PremiumTextarea
              id="topic"
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
              placeholder="What's your post about? Be specific — topic, angle, audience..."
              rows={5}
              disabled={isLoading}
            />
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

          <PremiumGenerateButton
            onClick={() => void generateCaptions()}
            disabled={!topic.trim()}
            loading={isLoading}
            loadingLabel="Generating"
          >
            Generate 5 captions
          </PremiumGenerateButton>
        </section>

        {error && <PremiumError message={error} />}

        {isLoading && <PremiumLoadingSkeleton count={5} />}

        {!isLoading && captions.length === 0 && !error && (
          <FeatureEmptyState
            icon={
              <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" aria-hidden>
                <path
                  d="M4 6h16M4 12h12M4 18h8M20 18l-2 2-4-4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            }
            title="Scroll-stopping captions"
            description="Describe your post topic and tone — Clotter AI will generate five unique captions tailored to your voice."
          />
        )}

        {captions.length > 0 && !isLoading && (
          <section className="mt-12">
            <PremiumResultsHeader
              title="Your captions"
              subtitle={`${captions.length} options ready to copy`}
            />
            <ul className="space-y-3">
              {captions.map((caption, index) => (
                <PremiumResultCard
                  key={index}
                  index={index + 1}
                  onCopy={() => void copyCaption(caption, index)}
                  copied={copiedIndex === index}
                  delay={index * 0.06}
                >
                  <p className="text-[0.9375rem] leading-[1.75] tracking-[-0.014em] text-white/85 sm:text-base">
                    {caption}
                  </p>
                  <div className="mt-3">
                    <AddToPlannerButton contentType="caption" contentText={caption} />
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
