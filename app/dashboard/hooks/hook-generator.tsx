"use client";

import { useState } from "react";

const platforms = [
  { id: "reels", label: "Reels" },
  { id: "tiktok", label: "TikTok" },
  { id: "youtube_shorts", label: "YouTube Shorts" },
  { id: "linkedin", label: "LinkedIn" },
] as const;

type PlatformId = (typeof platforms)[number]["id"];

export function HookGenerator() {
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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  async function copyHook(hook: string, index: number) {
    await navigator.clipboard.writeText(hook);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  }

  return (
    <div className="captions-fade-in relative z-10 flex-1 overflow-y-auto px-6 pb-16 pt-8 sm:px-10 sm:pb-20 sm:pt-10">
      <div className="mx-auto w-full max-w-2xl">
        <section className="space-y-8">
          <div>
            <label
              htmlFor="hook-topic"
              className="text-xs font-semibold uppercase tracking-[0.1em] text-white/35"
            >
              Video topic
            </label>
            <textarea
              id="hook-topic"
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
              placeholder="What's your video about? e.g. 5 habits that changed my productivity..."
              rows={5}
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
            onClick={() => void generateHooks()}
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
                "Generate 10 hooks"
              )}
            </span>
          </button>
        </section>

        {error && (
          <p className="mt-8 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm leading-relaxed text-red-300">
            {error}
          </p>
        )}

        {hooks.length > 0 && (
          <section className="mt-16">
            <div className="mb-6">
              <h2 className="text-lg font-semibold tracking-[-0.03em] text-white">
                Your hooks
              </h2>
              <p className="mt-1 text-sm text-white/40">
                {hooks.length} scroll-stopping openers ready to copy
              </p>
            </div>

            <ul className="space-y-3">
              {hooks.map((hook, index) => (
                <li
                  key={index}
                  className="captions-glass-card"
                  style={{ animationDelay: `${index * 0.06}s` }}
                >
                  <span className="captions-num-badge">{index + 1}</span>
                  <p className="min-w-0 flex-1 text-[0.9375rem] leading-[1.75] tracking-[-0.014em] text-white/85 sm:text-base">
                    {hook}
                  </p>
                  <button
                    type="button"
                    onClick={() => void copyHook(hook, index)}
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
