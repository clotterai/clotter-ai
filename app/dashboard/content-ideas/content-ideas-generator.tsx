"use client";

import { useState } from "react";

const platforms = [
  { id: "instagram", label: "Instagram" },
  { id: "youtube", label: "YouTube" },
  { id: "tiktok", label: "TikTok" },
  { id: "linkedin", label: "LinkedIn" },
] as const;

type PlatformId = (typeof platforms)[number]["id"];

export function ContentIdeasGenerator() {
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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  async function copyIdea(idea: string, index: number) {
    await navigator.clipboard.writeText(idea);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  }

  return (
    <div className="captions-fade-in relative z-10 flex-1 overflow-y-auto px-6 pb-16 pt-8 sm:px-10 sm:pb-20 sm:pt-10">
      <div className="mx-auto w-full max-w-2xl">
        <section className="space-y-8">
          <div>
            <label
              htmlFor="content-niche"
              className="text-xs font-semibold uppercase tracking-[0.1em] text-white/35"
            >
              Your niche
            </label>
            <textarea
              id="content-niche"
              value={niche}
              onChange={(event) => setNiche(event.target.value)}
              placeholder="e.g. fitness for busy professionals, personal finance for Gen Z, vegan meal prep..."
              rows={4}
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
            onClick={() => void generateIdeas()}
            disabled={!niche.trim() || isLoading}
            className="captions-generate-btn"
          >
            <span className="relative z-[1] flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Generating...
                </>
              ) : (
                "Generate 20 ideas"
              )}
            </span>
          </button>
        </section>

        {error && (
          <p className="mt-8 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm leading-relaxed text-red-300">
            {error}
          </p>
        )}

        {ideas.length > 0 && (
          <section className="mt-16">
            <div className="mb-6">
              <h2 className="text-lg font-semibold tracking-[-0.03em] text-white">
                Your content ideas
              </h2>
              <p className="mt-1 text-sm text-white/40">
                {ideas.length} viral concepts ready to copy
              </p>
            </div>

            <ul className="space-y-3">
              {ideas.map((idea, index) => (
                <li
                  key={index}
                  className="captions-glass-card"
                  style={{ animationDelay: `${Math.min(index * 0.04, 0.6)}s` }}
                >
                  <span className="captions-num-badge">{index + 1}</span>
                  <p className="min-w-0 flex-1 text-[0.9375rem] leading-[1.75] tracking-[-0.014em] text-white/85 sm:text-base">
                    {idea}
                  </p>
                  <button
                    type="button"
                    onClick={() => void copyIdea(idea, index)}
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
