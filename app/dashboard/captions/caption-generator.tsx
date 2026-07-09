"use client";

import { useState } from "react";
import { FeatureEmptyState } from "@/app/dashboard/components/feature-empty-state";
import { useToast } from "@/app/dashboard/components/toast-provider";

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
    <div className="captions-fade-in relative z-10 flex-1 overflow-y-auto px-6 pb-16 pt-8 sm:px-10 sm:pb-20 sm:pt-10">
      <div className="mx-auto w-full max-w-2xl">
        <section className="space-y-8">
          <div>
            <label
              htmlFor="topic"
              className="text-xs font-semibold uppercase tracking-[0.1em] text-white/35"
            >
              Post topic
            </label>
            <textarea
              id="topic"
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
              placeholder="What's your post about? Be specific — topic, angle, audience..."
              rows={5}
              disabled={isLoading}
              className="captions-textarea mt-3 w-full resize-none disabled:opacity-50"
            />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-white/35">
              Tone
            </p>
            <div className="mt-3 flex flex-wrap gap-2 sm:gap-2.5">
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

          <button
            type="button"
            onClick={() => void generateCaptions()}
            disabled={!topic.trim() || isLoading}
            className="captions-generate-btn"
          >
            <span className="relative z-[1] flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Generating...
                </>
              ) : (
                "Generate 5 captions"
              )}
            </span>
          </button>
        </section>

        {error && (
          <p className="mt-8 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm leading-relaxed text-red-300">
            {error}
          </p>
        )}

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
            cta="Fill in the form above and hit Generate"
          />
        )}

        {captions.length > 0 && (
          <section className="mt-16">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <h2 className="font-heading text-lg font-bold tracking-[-0.02em] text-white">
                  Your captions
                </h2>
                <p className="mt-1 text-sm text-white/40">
                  {captions.length} options ready to copy
                </p>
              </div>
            </div>

            <ul className="space-y-3">
              {captions.map((caption, index) => (
                <li
                  key={index}
                  className="captions-glass-card"
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  <span className="captions-num-badge">{index + 1}</span>
                  <p className="min-w-0 flex-1 text-[0.9375rem] leading-[1.75] tracking-[-0.014em] text-white/85 sm:text-base">
                    {caption}
                  </p>
                  <button
                    type="button"
                    onClick={() => void copyCaption(caption, index)}
                    className="captions-copy-btn"
                  >
                    {copiedIndex === index ? "Copied!" : "Copy"}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
