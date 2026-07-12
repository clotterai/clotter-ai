"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import type { ContentHistoryItem, CreatorProfile } from "@/lib/memory/types";
import {
  getProfileCompletionFieldStatuses,
  type ProfileCompletionFieldStatus,
} from "@/lib/memory/getCreatorContext";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  premiumGradientButtonStyle,
  premiumInputClassName,
  premiumPillActiveStyle,
  PremiumLoadingSkeleton,
} from "@/app/dashboard/components/premium-ui";

type Tab = "profile" | "history" | "preferences";

type HistoryStats = {
  script: number;
  caption: number;
  hook: number;
  idea: number;
  trend: number;
  chat: number;
};

type TopTopic = { topic: string; count: number };

const LIKE_SUGGESTIONS = [
  "Storytelling",
  "Bold hooks",
  "Short captions",
  "Data-driven tips",
  "Personal stories",
  "Controversial takes",
];

const DISLIKE_SUGGESTIONS = [
  "Generic content",
  "Long captions",
  "Clickbait",
  "Corporate tone",
  "Overused phrases",
  "Emoji overload",
];

const PROFILE_FIELDS: {
  key: keyof CreatorProfile;
  label: string;
  type?: "text" | "textarea" | "array";
}[] = [
  { key: "preferred_name", label: "What should Clotter call you?" },
  { key: "name", label: "Name" },
  { key: "niche", label: "Niche" },
  { key: "sub_niche", label: "Sub-niche" },
  { key: "audience_age", label: "Audience age" },
  { key: "audience_location", label: "Audience location" },
  { key: "audience_gender", label: "Audience gender" },
  { key: "platforms", label: "Platforms", type: "array" },
  { key: "content_style", label: "Content style" },
  { key: "posting_frequency", label: "Posting frequency" },
  { key: "current_followers", label: "Followers" },
  { key: "biggest_goal", label: "Goals" },
  { key: "brand_name", label: "Brand name" },
  { key: "unique_angle", label: "Unique angle", type: "textarea" },
];

const gradientTextStyle = {
  background: "linear-gradient(135deg, #EC4899, #F97316)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
} as const;

const gradientBadgeStyle = {
  background: "linear-gradient(135deg, #EC4899, #F97316)",
} as const;

const SPARKLE_POSITIONS = [
  { top: "8%", left: "50%" },
  { top: "18%", left: "88%" },
  { top: "50%", left: "95%" },
  { top: "82%", left: "78%" },
  { top: "92%", left: "42%" },
  { top: "72%", left: "8%" },
  { top: "38%", left: "2%" },
  { top: "12%", left: "14%" },
];

function SparkleAnimation() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      {SPARKLE_POSITIONS.map((position, index) => (
        <span
          key={index}
          className="memory-sparkle absolute h-1.5 w-1.5 rounded-full bg-gradient-to-br from-pink-400 to-orange-400"
          style={{
            ...position,
            animationDelay: `${index * 0.25}s`,
          }}
        />
      ))}
    </div>
  );
}

function CompletionRing({ percent }: { percent: number }) {
  const size = 160;
  const strokeWidth = 8;
  const radius = size / 2 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const [animatedPercent, setAnimatedPercent] = useState(0);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setAnimatedPercent(percent);
    });
    return () => cancelAnimationFrame(frame);
  }, [percent]);

  const offset =
    circumference - (Math.min(Math.max(animatedPercent, 0), 100) / 100) * circumference;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {percent === 100 && <SparkleAnimation />}
      <svg
        className="h-full w-full -rotate-90"
        viewBox={`0 0 ${size} ${size}`}
        aria-hidden
      >
        <defs>
          <linearGradient id="memory-ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EC4899" />
            <stop offset="100%" stopColor="#F97316" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#memory-ring-gradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="memory-completion-ring-progress"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-3xl font-bold tabular-nums"
          style={gradientTextStyle}
        >
          {percent}%
        </span>
        <span className="text-xs text-white/30">Complete</span>
      </div>
    </div>
  );
}

function ProfileCompletionFieldsList({
  fields,
}: {
  fields: ProfileCompletionFieldStatus[];
}) {
  const hasMissing = fields.some((field) => !field.filled);

  return (
    <div className="mt-6 w-full max-w-xs">
      <ul className="space-y-2.5">
        {fields.map((field) => (
          <li key={field.key} className="flex items-center gap-2.5">
            {field.filled ? (
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15">
                <Check size={12} className="text-emerald-400" strokeWidth={2.5} />
              </span>
            ) : (
              <span className="h-2 w-2 shrink-0 rounded-full bg-pink-500" aria-hidden />
            )}
            <span
              className={`text-sm ${
                field.filled ? "text-white/60" : "text-white/45"
              }`}
            >
              {field.label}
            </span>
          </li>
        ))}
      </ul>
      {hasMissing && (
        <Link
          href="/dashboard/onboarding"
          className="mt-4 inline-flex text-sm font-medium transition-opacity hover:opacity-80"
          style={gradientTextStyle}
        >
          Complete your profile
        </Link>
      )}
    </div>
  );
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

function typeLabel(type: string) {
  const labels: Record<string, string> = {
    script: "Script",
    caption: "Caption",
    hook: "Hook",
    idea: "Idea",
    trend: "Trend",
    chat: "Chat",
  };
  return labels[type] ?? type;
}

function formatProfileValue(value: unknown): string {
  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(", ") : "Not set";
  }
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }
  return "Not set";
}

export function MemoryDashboard() {
  const [tab, setTab] = useState<Tab>("profile");
  const [profile, setProfile] = useState<CreatorProfile | null>(null);
  const [completion, setCompletion] = useState(0);
  const [likes, setLikes] = useState<string[]>([]);
  const [dislikes, setDislikes] = useState<string[]>([]);
  const [history, setHistory] = useState<ContentHistoryItem[]>([]);
  const [stats, setStats] = useState<HistoryStats | null>(null);
  const [topTopics, setTopTopics] = useState<TopTopic[]>([]);
  const [search, setSearch] = useState("");
  const [historyFilter, setHistoryFilter] = useState<string>("all");
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [newLike, setNewLike] = useState("");
  const [newDislike, setNewDislike] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    const res = await fetch("/api/memory/profile");
    const data = (await res.json()) as {
      profile: CreatorProfile | null;
      completion: number;
      error?: string;
    };
    if (!res.ok) throw new Error(data.error || "Failed to load profile.");
    setProfile(data.profile);
    setCompletion(data.completion);
  }, []);

  const loadPreferences = useCallback(async () => {
    const res = await fetch("/api/memory/preferences");
    const data = (await res.json()) as {
      preferences: { likes: string[]; dislikes: string[] };
      error?: string;
    };
    if (!res.ok) throw new Error(data.error || "Failed to load preferences.");
    setLikes(data.preferences.likes ?? []);
    setDislikes(data.preferences.dislikes ?? []);
  }, []);

  const loadHistory = useCallback(async (query?: string) => {
    const url = query
      ? `/api/memory/history?search=${encodeURIComponent(query)}`
      : "/api/memory/history";
    const res = await fetch(url);
    const data = (await res.json()) as {
      history: ContentHistoryItem[];
      stats: HistoryStats;
      topTopics: TopTopic[];
      error?: string;
    };
    if (!res.ok) throw new Error(data.error || "Failed to load history.");
    setHistory(data.history);
    setStats(data.stats);
    setTopTopics(data.topTopics);
  }, []);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        await Promise.all([loadProfile(), loadPreferences(), loadHistory()]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load memory.");
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [loadProfile, loadPreferences, loadHistory]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadHistory(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, loadHistory]);

  const filteredHistory = useMemo(() => {
    if (historyFilter === "all") return history;
    return history.filter((item) => item.content_type === historyFilter);
  }, [history, historyFilter]);

  const groupedHistory = useMemo(() => {
    const groups: Record<string, ContentHistoryItem[]> = {};
    filteredHistory.forEach((item) => {
      const key = item.content_type;
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    });
    return groups;
  }, [filteredHistory]);

  const fieldStatuses = useMemo(
    () =>
      getProfileCompletionFieldStatuses(profile as Record<string, unknown> | null),
    [profile],
  );

  const missingFields = useMemo(
    () => fieldStatuses.filter((field) => !field.filled),
    [fieldStatuses],
  );

  async function saveProfileField(key: string, value: unknown) {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/memory/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [key]: value }),
      });
      const data = (await res.json()) as {
        profile: CreatorProfile;
        completion: number;
        error?: string;
      };
      if (!res.ok) throw new Error(data.error || "Failed to save.");
      setProfile(data.profile);
      setCompletion(data.completion);
      setEditingField(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  function startEdit(key: string, current: unknown) {
    setEditingField(key);
    if (Array.isArray(current)) {
      setEditValue(current.join(", "));
    } else {
      setEditValue(typeof current === "string" ? current : "");
    }
  }

  function commitEdit(key: string, type?: string) {
    const value =
      type === "array"
        ? editValue
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : editValue.trim();
    void saveProfileField(key, value);
  }

  async function savePreferences(nextLikes: string[], nextDislikes: string[]) {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/memory/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ likes: nextLikes, dislikes: nextDislikes }),
      });
      const data = (await res.json()) as {
        preferences: { likes: string[]; dislikes: string[] };
        error?: string;
      };
      if (!res.ok) throw new Error(data.error || "Failed to save preferences.");
      setLikes(data.preferences.likes ?? []);
      setDislikes(data.preferences.dislikes ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  function addTag(type: "like" | "dislike", value: string) {
    const trimmed = value.trim();
    if (!trimmed) return;
    if (type === "like") {
      if (likes.includes(trimmed)) return;
      void savePreferences([...likes, trimmed], dislikes);
      setNewLike("");
    } else {
      if (dislikes.includes(trimmed)) return;
      void savePreferences(likes, [...dislikes, trimmed]);
      setNewDislike("");
    }
  }

  function removeTag(type: "like" | "dislike", value: string) {
    if (type === "like") {
      void savePreferences(
        likes.filter((l) => l !== value),
        dislikes,
      );
    } else {
      void savePreferences(
        likes,
        dislikes.filter((d) => d !== value),
      );
    }
  }

  async function deleteHistoryItem(id: string) {
    const res = await fetch(`/api/memory/history?id=${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      setError(data.error || "Failed to delete.");
      return;
    }
    await loadHistory(search);
  }

  if (loading) {
    return <PremiumLoadingSkeleton count={3} />;
  }

  const cardClassName =
    "rounded-2xl border border-white/[0.06] bg-[#111114] p-4 transition-all duration-200 hover:border-white/[0.12]";

  const pillDefaultClassName =
    "rounded-full border border-white/[0.06] bg-white/[0.03] px-4 py-2 text-xs text-white/40 transition-all duration-150 hover:border-white/15 hover:text-white/60";

  const pillActiveClassName =
    "rounded-full border border-pink-500/50 px-4 py-2 text-xs font-medium text-white transition-all duration-150";

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2">
        {(
          [
            ["profile", "Creator Profile"],
            ["history", "Content History"],
            ["preferences", "Preferences"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={tab === id ? pillActiveClassName : pillDefaultClassName}
            style={tab === id ? premiumPillActiveStyle : undefined}
          >
            {label}
          </button>
        ))}
      </div>

      {error && (
        <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      {tab === "profile" && (
        <div>
          <div className="mb-10 flex flex-col gap-10 lg:flex-row lg:items-start">
            <div className="flex flex-col items-center lg:items-start">
              <CompletionRing percent={completion} />
              <ProfileCompletionFieldsList fields={fieldStatuses} />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-xl font-bold text-white">
                  Your AI gets smarter as you add more
                </p>
                {completion === 100 && (
                  <span
                    className="rounded-full px-3 py-1 text-xs font-semibold text-white"
                    style={gradientBadgeStyle}
                  >
                    Profile Complete
                  </span>
                )}
              </div>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-white/35">
                Every field you complete helps Clotter personalize scripts, captions,
                hooks, and ideas to match your voice and audience.
              </p>
              {missingFields.length > 0 && (
                <div className="mt-5 rounded-2xl border border-white/[0.06] bg-[#111114] p-4">
                  <p className="text-sm font-semibold text-white">
                    Complete your profile to unlock personalized AI
                  </p>
                  <p className="mt-1 text-xs text-white/35">
                    {missingFields.length} field{missingFields.length !== 1 ? "s" : ""}{" "}
                    remaining for 100% AI memory
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {PROFILE_FIELDS.map(({ key, label, type }) => {
              const value = profile?.[key];
              const filled =
                Array.isArray(value)
                  ? value.length > 0
                  : typeof value === "string" && value.trim().length > 0;
              const isEditing = editingField === key;

              return (
                <div
                  key={key}
                  className={`${cardClassName}${filled ? " border-white/[0.10]" : ""}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/25">
                        {label}
                      </p>
                      {isEditing ? (
                        type === "textarea" ? (
                          <textarea
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className={`${premiumInputClassName} mt-2 !min-h-[80px]`}
                            autoFocus
                          />
                        ) : (
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className={`${premiumInputClassName} mt-2 !min-h-0 !py-3`}
                            autoFocus
                          />
                        )
                      ) : (
                        <p className="mt-2 text-sm leading-relaxed text-white/75">
                          {formatProfileValue(value)}
                        </p>
                      )}
                    </div>
                    {isEditing ? (
                      <div className="flex shrink-0 gap-2">
                        <button
                          type="button"
                          onClick={() => commitEdit(key, type)}
                          disabled={saving}
                          className="rounded-full px-3 py-2 text-xs font-semibold text-white transition-all duration-150 hover:brightness-110 disabled:opacity-70"
                          style={premiumGradientButtonStyle}
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingField(null)}
                          className={pillDefaultClassName}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => startEdit(key, value)}
                        className={`${pillDefaultClassName} shrink-0 !px-3 !py-2`}
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === "history" && (
        <div>
          {stats && (
            <p className="mb-6 text-sm text-white/35">
              You&apos;ve generated{" "}
              <span className="text-white/60">{stats.script} scripts</span>,{" "}
              <span className="text-white/60">{stats.caption} captions</span>,{" "}
              <span className="text-white/60">{stats.hook} hooks</span>
              {stats.idea > 0 && (
                <>
                  , <span className="text-white/60">{stats.idea} ideas</span>
                </>
              )}
            </p>
          )}

          {topTopics.length > 0 && (
            <div className={`${cardClassName} mb-6`}>
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/25">
                Most used topics
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {topTopics.map(({ topic, count }) => (
                  <span
                    key={topic}
                    className="rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1 text-xs text-white/50"
                  >
                    {topic} ({count})
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search history..."
              className={`${premiumInputClassName} !min-h-0 flex-1 !py-3.5`}
            />
            <div className="flex flex-wrap gap-2">
              {["all", "script", "caption", "hook", "idea", "trend"].map((filter) => {
                const isActive = historyFilter === filter;
                return (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setHistoryFilter(filter)}
                    className={isActive ? pillActiveClassName : pillDefaultClassName}
                    style={isActive ? premiumPillActiveStyle : undefined}
                  >
                    {filter === "all" ? "All" : typeLabel(filter)}
                  </button>
                );
              })}
            </div>
          </div>

          {filteredHistory.length === 0 ? (
            <div className={`${cardClassName} py-12 text-center`}>
              <p className="text-sm font-semibold text-white">No content history yet</p>
              <p className="mt-1 text-xs text-white/30">
                Generate scripts, captions, or hooks — they&apos;ll appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedHistory).map(([type, items]) => (
                <section key={type}>
                  <h3 className="mb-4 text-base font-semibold text-white">
                    {typeLabel(type)}s
                  </h3>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <article key={item.id} className={cardClassName}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="rounded-full border border-white/[0.06] bg-white/[0.03] px-2.5 py-0.5 text-[11px] text-white/50">
                                {typeLabel(item.content_type)}
                              </span>
                              {item.platform && (
                                <span className="text-xs text-white/30">
                                  {item.platform}
                                </span>
                              )}
                              <span className="text-xs text-white/25">
                                {formatDate(item.created_at)}
                              </span>
                            </div>
                            <p className="mt-2 text-sm font-medium text-white/80">
                              {item.topic || "Untitled"}
                            </p>
                            <p className="mt-2 line-clamp-3 text-[13px] leading-relaxed text-white/50">
                              {item.content_text}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => void deleteHistoryItem(item.id)}
                            className="shrink-0 rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-xs text-white/40 transition-all duration-150 hover:border-white/15 hover:text-white/60"
                          >
                            Delete
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "preferences" && (
        <div>
          <p className="mb-8 max-w-xl text-sm leading-relaxed text-white/35">
            These preferences shape every response Clotter gives you.
          </p>

          <section className="mb-10">
            <h3 className="text-base font-semibold text-white">Things you like</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {likes.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => removeTag("like", tag)}
                  className="rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1 text-xs text-white/50 transition-all duration-150 hover:border-white/15 hover:text-white/60"
                >
                  {tag} ×
                </button>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={newLike}
                onChange={(e) => setNewLike(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTag("like", newLike)}
                placeholder="Add something you like..."
                className={`${premiumInputClassName} !min-h-0 flex-1 !py-3.5`}
              />
              <button
                type="button"
                onClick={() => addTag("like", newLike)}
                className="shrink-0 rounded-2xl px-4 py-3 text-xs font-semibold text-white transition-all duration-150 hover:brightness-110"
                style={premiumGradientButtonStyle}
              >
                Add
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {LIKE_SUGGESTIONS.filter((s) => !likes.includes(s)).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => addTag("like", s)}
                  className={pillDefaultClassName}
                >
                  + {s}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-base font-semibold text-white">
              Things you dislike
            </h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {dislikes.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => removeTag("dislike", tag)}
                  className="rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1 text-xs text-white/50 transition-all duration-150 hover:border-white/15 hover:text-white/60"
                >
                  {tag} ×
                </button>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={newDislike}
                onChange={(e) => setNewDislike(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTag("dislike", newDislike)}
                placeholder="Add something you dislike..."
                className={`${premiumInputClassName} !min-h-0 flex-1 !py-3.5`}
              />
              <button
                type="button"
                onClick={() => addTag("dislike", newDislike)}
                className="shrink-0 rounded-2xl px-4 py-3 text-xs font-semibold text-white transition-all duration-150 hover:brightness-110"
                style={premiumGradientButtonStyle}
              >
                Add
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {DISLIKE_SUGGESTIONS.filter((s) => !dislikes.includes(s)).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => addTag("dislike", s)}
                  className={pillDefaultClassName}
                >
                  + {s}
                </button>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
