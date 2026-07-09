"use client";

import type { ContentHistoryItem, CreatorProfile } from "@/lib/memory/types";
import { useCallback, useEffect, useMemo, useState } from "react";

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
  { key: "biggest_goal", label: "Biggest goal" },
  { key: "brand_name", label: "Brand name" },
  { key: "unique_angle", label: "Unique angle", type: "textarea" },
];

function CompletionRing({ percent }: { percent: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="memory-completion-ring relative flex h-36 w-36 items-center justify-center">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="rgba(99,102,241,0.15)"
          strokeWidth="8"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="url(#memory-ring-gradient)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="memory-completion-ring-progress"
        />
        <defs>
          <linearGradient id="memory-ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EC4899" />
            <stop offset="100%" stopColor="#F97316" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-heading text-3xl font-bold text-white">{percent}%</span>
        <span className="text-xs text-white/40">Complete</span>
      </div>
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

function isFieldFilled(value: unknown): boolean {
  if (Array.isArray(value)) return value.length > 0;
  return typeof value === "string" && value.trim().length > 0;
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
    return (
      <div className="script-loading-card mx-6 mb-12 mt-8 sm:mx-10">
        <div className="script-loading-dots">
          <span className="script-loading-dot" />
          <span className="script-loading-dot" />
          <span className="script-loading-dot" />
        </div>
        <p className="mt-4 text-sm text-white/45">Loading your Creator Brain...</p>
      </div>
    );
  }

  return (
    <div className="relative z-10 mx-6 mb-16 mt-6 flex flex-1 flex-col sm:mx-10">
      <div className="memory-tabs mb-8 flex flex-wrap gap-2">
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
            className={`memory-tab${tab === id ? " memory-tab--active" : ""}`}
          >
            {label}
          </button>
        ))}
      </div>

      {error && (
        <p className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-300">
          {error}
        </p>
      )}

      {tab === "profile" && (
        <div className="memory-tab-panel captions-fade-in">
          <div className="mb-10 flex flex-col items-start gap-8 lg:flex-row lg:items-center">
            <CompletionRing percent={completion} />
            <div>
              <p className="font-heading text-xl font-bold text-white">
                Your AI gets smarter as you add more
              </p>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-white/45">
                Every field you complete helps Clotter personalize scripts, captions,
                hooks, and ideas to match your voice and audience.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {PROFILE_FIELDS.map(({ key, label, type }) => {
              const value = profile?.[key];
              const filled = isFieldFilled(value);
              const isEditing = editingField === key;

              return (
                <div
                  key={key}
                  className={`memory-field-card${filled ? " memory-field-card--complete" : ""}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-white/35">
                        {label}
                      </p>
                      {isEditing ? (
                        type === "textarea" ? (
                          <textarea
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="captions-textarea mt-2 !min-h-[80px] w-full resize-none !py-3"
                            autoFocus
                          />
                        ) : (
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="captions-textarea mt-2 !min-h-0 w-full !py-3"
                            autoFocus
                          />
                        )
                      ) : (
                        <p className="mt-2 text-[15px] leading-relaxed text-white/85">
                          {Array.isArray(value)
                            ? value.join(", ") || "Not set"
                            : (value as string) || "Not set"}
                        </p>
                      )}
                    </div>
                    {isEditing ? (
                      <div className="flex shrink-0 gap-2">
                        <button
                          type="button"
                          onClick={() => commitEdit(key, type)}
                          disabled={saving}
                          className="script-action-btn script-action-btn--primary !px-3 !py-2 text-xs"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingField(null)}
                          className="script-action-btn !px-3 !py-2 text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => startEdit(key, value)}
                        className="script-action-btn shrink-0 !px-3 !py-2 text-xs"
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
        <div className="memory-tab-panel captions-fade-in">
          {stats && (
            <p className="mb-6 text-sm text-white/50">
              You&apos;ve generated{" "}
              <span className="text-[#EC4899]">{stats.script} scripts</span>,{" "}
              <span className="text-[#EC4899]">{stats.caption} captions</span>,{" "}
              <span className="text-[#EC4899]">{stats.hook} hooks</span>
              {stats.idea > 0 && (
                <>
                  , <span className="text-[#EC4899]">{stats.idea} ideas</span>
                </>
              )}
            </p>
          )}

          {topTopics.length > 0 && (
            <div className="memory-field-card mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-white/35">
                Most used topics
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {topTopics.map(({ topic, count }) => (
                  <span key={topic} className="memory-tag memory-tag--neutral">
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
              className="captions-textarea !min-h-0 flex-1 !py-3.5"
            />
            <div className="flex flex-wrap gap-2">
              {["all", "script", "caption", "hook", "idea", "trend"].map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setHistoryFilter(filter)}
                  className={`captions-tone-pill${
                    historyFilter === filter ? " captions-tone-pill--active" : ""
                  }`}
                >
                  {filter === "all" ? "All" : typeLabel(filter)}
                </button>
              ))}
            </div>
          </div>

          {filteredHistory.length === 0 ? (
            <div className="memory-field-card py-12 text-center">
              <p className="text-white/45">No content history yet.</p>
              <p className="mt-2 text-sm text-white/30">
                Generate scripts, captions, or hooks — they&apos;ll appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedHistory).map(([type, items]) => (
                <section key={type}>
                  <h3 className="font-heading mb-4 text-lg font-bold text-white">
                    {typeLabel(type)}s
                  </h3>
                  <div className="memory-timeline space-y-3">
                    {items.map((item) => (
                      <article key={item.id} className="memory-timeline-item">
                        <div className="memory-timeline-dot" />
                        <div className="memory-field-card flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="memory-tag memory-tag--type">
                                  {typeLabel(item.content_type)}
                                </span>
                                {item.platform && (
                                  <span className="text-xs text-white/35">
                                    {item.platform}
                                  </span>
                                )}
                                <span className="text-xs text-white/30">
                                  {formatDate(item.created_at)}
                                </span>
                              </div>
                              <p className="mt-2 font-medium text-white/90">
                                {item.topic || "Untitled"}
                              </p>
                              <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-white/45">
                                {item.content_text}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => void deleteHistoryItem(item.id)}
                              className="script-action-btn shrink-0 !px-3 !py-2 text-xs text-red-300/80 hover:text-red-300"
                            >
                              Delete
                            </button>
                          </div>
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
        <div className="memory-tab-panel captions-fade-in">
          <p className="mb-8 max-w-xl text-sm leading-relaxed text-white/45">
            These preferences shape every response Clotter gives you.
          </p>

          <section className="mb-10">
            <h3 className="font-heading text-lg font-bold text-white">Things you like</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {likes.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => removeTag("like", tag)}
                  className="memory-tag memory-tag--like"
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
                className="captions-textarea !min-h-0 flex-1 !py-3.5"
              />
              <button
                type="button"
                onClick={() => addTag("like", newLike)}
                className="script-action-btn script-action-btn--primary"
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
                  className="captions-tone-pill text-xs"
                >
                  + {s}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h3 className="font-heading text-lg font-bold text-white">
              Things you dislike
            </h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {dislikes.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => removeTag("dislike", tag)}
                  className="memory-tag memory-tag--dislike"
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
                className="captions-textarea !min-h-0 flex-1 !py-3.5"
              />
              <button
                type="button"
                onClick={() => addTag("dislike", newDislike)}
                className="script-action-btn script-action-btn--primary"
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
                  className="captions-tone-pill text-xs"
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
