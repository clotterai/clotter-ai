"use client";

import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "clotter-content-planner";

const PLATFORMS = [
  { id: "instagram", label: "Instagram" },
  { id: "youtube", label: "YouTube" },
  { id: "tiktok", label: "TikTok" },
  { id: "linkedin", label: "LinkedIn" },
] as const;

const CONTENT_TYPES = [
  { id: "reel", label: "Reel" },
  { id: "post", label: "Post" },
  { id: "story", label: "Story" },
  { id: "video", label: "Video" },
] as const;

const STATUSES = [
  { id: "idea", label: "Idea" },
  { id: "draft", label: "Draft" },
  { id: "ready", label: "Ready" },
  { id: "posted", label: "Posted" },
] as const;

type Platform = (typeof PLATFORMS)[number]["id"];
type ContentType = (typeof CONTENT_TYPES)[number]["id"];
type Status = (typeof STATUSES)[number]["id"];

type PlannedItem = {
  id: string;
  idea: string;
  platform: Platform;
  contentType: ContentType;
  status: Status;
};

type PlannerPin = {
  id: string;
  pin_date: string;
  pin_time: string | null;
  content_type: string;
  content_text: string;
  created_at: string;
};

type PlannerStore = Record<string, PlannedItem[]>;

const PIN_TYPE_LABELS: Record<string, string> = {
  caption: "Caption",
  hook: "Hook",
  idea: "Content Idea",
  script: "Script",
  chat: "Chat",
  trend: "Trend",
};

function formatPinTime(pinTime: string | null) {
  if (!pinTime) return null;
  const [hours, minutes] = pinTime.split(":");
  if (!hours || !minutes) return pinTime;
  const date = new Date();
  date.setHours(Number(hours), Number(minutes), 0, 0);
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

const PLATFORM_CHIP: Record<Platform, string> = {
  instagram:
    "border-pink-500/35 bg-pink-500/15 text-pink-200 shadow-[0_0_12px_-4px_rgba(236,72,153,0.4)]",
  youtube:
    "border-red-500/35 bg-red-500/15 text-red-200 shadow-[0_0_12px_-4px_rgba(239,68,68,0.35)]",
  tiktok:
    "border-cyan-400/35 bg-cyan-400/10 text-cyan-200 shadow-[0_0_12px_-4px_rgba(34,211,238,0.35)]",
  linkedin:
    "border-blue-500/35 bg-blue-500/15 text-blue-200 shadow-[0_0_12px_-4px_rgba(59,130,246,0.35)]",
};

function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const offset = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + offset);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function isToday(date: Date): boolean {
  return toDateKey(date) === toDateKey(new Date());
}

function formatWeekLabel(weekStart: Date): string {
  const weekEnd = addDays(weekStart, 6);
  const start = weekStart.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const end = weekEnd.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return `${start} – ${end}`;
}

function loadStore(): PlannerStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as PlannerStore;
  } catch {
    return {};
  }
}

function saveStore(store: PlannerStore) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function ContentPlanner() {
  const [weekStart, setWeekStart] = useState(() => getMonday(new Date()));
  const [store, setStore] = useState<PlannerStore>({});
  const [pins, setPins] = useState<PlannerPin[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [modalDateKey, setModalDateKey] = useState<string | null>(null);
  const [viewingPin, setViewingPin] = useState<PlannerPin | null>(null);
  const [idea, setIdea] = useState("");
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [contentType, setContentType] = useState<ContentType>("reel");
  const [status, setStatus] = useState<Status>("idea");

  const weekEndKey = useMemo(
    () => toDateKey(addDays(weekStart, 6)),
    [weekStart],
  );
  const weekStartKey = useMemo(() => toDateKey(weekStart), [weekStart]);

  const loadPins = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/planner/pins?from=${weekStartKey}&to=${weekEndKey}`,
      );
      if (!response.ok) return;

      const data = (await response.json()) as { pins?: PlannerPin[] };
      setPins(Array.isArray(data.pins) ? data.pins : []);
    } catch {
      // Keep existing pins on failure.
    }
  }, [weekStartKey, weekEndKey]);

  useEffect(() => {
    setStore(loadStore());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveStore(store);
  }, [store, hydrated]);

  useEffect(() => {
    void loadPins();
  }, [loadPins]);

  const weekDays = useMemo(
    () => DAY_NAMES.map((name, i) => ({ name, date: addDays(weekStart, i) })),
    [weekStart],
  );

  const modalItems = modalDateKey ? (store[modalDateKey] ?? []) : [];
  const modalPins = modalDateKey
    ? pins.filter((pin) => pin.pin_date === modalDateKey)
    : [];

  const pinsByDate = useMemo(() => {
    const grouped: Record<string, PlannerPin[]> = {};
    for (const pin of pins) {
      if (!grouped[pin.pin_date]) grouped[pin.pin_date] = [];
      grouped[pin.pin_date].push(pin);
    }
    return grouped;
  }, [pins]);

  const goToPrevWeek = () => setWeekStart((w) => addDays(w, -7));
  const goToNextWeek = () => setWeekStart((w) => addDays(w, 7));
  const goToThisWeek = () => setWeekStart(getMonday(new Date()));

  const openDay = useCallback((dateKey: string) => {
    setModalDateKey(dateKey);
    setIdea("");
    setPlatform("instagram");
    setContentType("reel");
    setStatus("idea");
  }, []);

  const closeModal = () => setModalDateKey(null);

  function addItem() {
    if (!modalDateKey || !idea.trim()) return;

    const item: PlannedItem = {
      id: crypto.randomUUID(),
      idea: idea.trim(),
      platform,
      contentType,
      status,
    };

    setStore((prev) => ({
      ...prev,
      [modalDateKey]: [...(prev[modalDateKey] ?? []), item],
    }));

    setIdea("");
    setStatus("idea");
  }

  function removeItem(dateKey: string, itemId: string) {
    setStore((prev) => {
      const next = (prev[dateKey] ?? []).filter((item) => item.id !== itemId);
      if (next.length === 0) {
        const { [dateKey]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [dateKey]: next };
    });
  }

  const modalDate = modalDateKey
    ? weekDays.find((d) => toDateKey(d.date) === modalDateKey)?.date ??
      new Date(modalDateKey + "T12:00:00")
    : null;

  const thisWeekCount = weekDays.reduce((total, { date }) => {
    const key = toDateKey(date);
    return total + (store[key]?.length ?? 0) + (pinsByDate[key]?.length ?? 0);
  }, 0);

  const platformCount = (() => {
    const platforms = new Set<Platform>();
    for (const { date } of weekDays) {
      for (const item of store[toDateKey(date)] ?? []) {
        platforms.add(item.platform);
      }
    }
    return platforms.size;
  })();

  const consistencyLabel =
    thisWeekCount > 0 ? "Keep it up!" : "Start planning";

  const gradientNumberStyle = {
    background: "linear-gradient(135deg, #EC4899, #F97316)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  } as const;

  const todayButtonStyle = {
    background: "linear-gradient(135deg, #EC4899, #F97316)",
  } as const;

  return (
    <>
      <div className="mb-6 mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={goToPrevWeek}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/8 bg-white/5 text-white/50 transition-colors hover:bg-white/10 hover:text-white/80"
          aria-label="Previous week"
        >
          <ChevronLeft size={18} strokeWidth={1.75} />
        </button>

        <span className="text-sm font-medium text-white/50">
          {formatWeekLabel(weekStart)}
        </span>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={goToThisWeek}
            className="rounded-full px-4 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
            style={todayButtonStyle}
          >
            Today
          </button>
          <button
            type="button"
            onClick={goToNextWeek}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/8 bg-white/5 text-white/50 transition-colors hover:bg-white/10 hover:text-white/80"
            aria-label="Next week"
          >
            <ChevronRight size={18} strokeWidth={1.75} />
          </button>
        </div>
      </div>

      <div className="hidden grid-cols-7 gap-3 md:grid">
        {weekDays.map(({ name, date }) => {
          const dateKey = toDateKey(date);
          const items = store[dateKey] ?? [];
          const dayPins = pinsByDate[dateKey] ?? [];
          const today = isToday(date);
          const isEmpty = items.length === 0 && dayPins.length === 0;

          return (
            <div
              key={dateKey}
              role="button"
              tabIndex={0}
              onClick={() => openDay(dateKey)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  openDay(dateKey);
                }
              }}
              className={`group flex min-h-[200px] cursor-pointer flex-col rounded-2xl border p-4 text-left transition-all duration-200 ${
                today
                  ? "border-pink-500/30 bg-pink-500/[0.04]"
                  : "border-white/[0.06] bg-[#111114] hover:border-white/[0.12]"
              }`}
            >
              <span className="text-[9px] font-bold uppercase tracking-widest text-white/25">
                {name}
              </span>

              {today ? (
                <span
                  className="mb-3 mt-1 text-3xl font-bold tabular-nums"
                  style={gradientNumberStyle}
                >
                  {date.getDate()}
                </span>
              ) : (
                <span className="mb-3 mt-1 text-3xl font-bold tabular-nums text-white/80">
                  {date.getDate()}
                </span>
              )}

              <div className="flex flex-1 flex-col">
                {dayPins.map((pin) => (
                  <button
                    key={pin.id}
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      setViewingPin(pin);
                    }}
                    className="mb-1 truncate rounded-lg bg-white/[0.06] px-2 py-1 text-left text-[11px] text-white/60 transition-colors hover:text-white/80"
                    title={pin.content_text}
                  >
                    {PIN_TYPE_LABELS[pin.content_type] ?? pin.content_type}
                  </button>
                ))}
                {items.map((item) => (
                  <span
                    key={item.id}
                    className="mb-1 truncate rounded-lg bg-white/[0.06] px-2 py-1 text-[11px] text-white/60"
                    title={item.idea}
                  >
                    {item.idea}
                  </span>
                ))}
                {isEmpty && (
                  <span className="mt-auto flex cursor-pointer items-center gap-1 text-[11px] text-white/20 transition-colors hover:text-pink-400">
                    <Plus size={12} strokeWidth={2} />
                    Add content
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-3 md:hidden">
        {weekDays.map(({ name, date }) => {
          const dateKey = toDateKey(date);
          const items = store[dateKey] ?? [];
          const dayPins = pinsByDate[dateKey] ?? [];
          const today = isToday(date);
          const isEmpty = items.length === 0 && dayPins.length === 0;

          return (
            <div
              key={dateKey}
              role="button"
              tabIndex={0}
              onClick={() => openDay(dateKey)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  openDay(dateKey);
                }
              }}
              className={`group flex min-h-[80px] cursor-pointer flex-row gap-4 rounded-2xl border p-4 text-left transition-all duration-200 ${
                today
                  ? "border-pink-500/30 bg-pink-500/[0.04]"
                  : "border-white/[0.06] bg-[#111114] hover:border-white/[0.12]"
              }`}
            >
              <div className="flex shrink-0 flex-col">
                <span className="text-[9px] font-bold uppercase tracking-widest text-white/25">
                  {name}
                </span>
                {today ? (
                  <span
                    className="mt-1 text-3xl font-bold tabular-nums"
                    style={gradientNumberStyle}
                  >
                    {date.getDate()}
                  </span>
                ) : (
                  <span className="mt-1 text-3xl font-bold tabular-nums text-white/80">
                    {date.getDate()}
                  </span>
                )}
              </div>

              <div className="flex min-w-0 flex-1 flex-col justify-center">
                {dayPins.map((pin) => (
                  <button
                    key={pin.id}
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      setViewingPin(pin);
                    }}
                    className="mb-1 truncate rounded-lg bg-white/[0.06] px-2 py-1 text-left text-[11px] text-white/60 transition-colors hover:text-white/80"
                    title={pin.content_text}
                  >
                    {PIN_TYPE_LABELS[pin.content_type] ?? pin.content_type}
                  </button>
                ))}
                {items.map((item) => (
                  <span
                    key={item.id}
                    className="mb-1 truncate rounded-lg bg-white/[0.06] px-2 py-1 text-[11px] text-white/60"
                    title={item.idea}
                  >
                    {item.idea}
                  </span>
                ))}
                {isEmpty && (
                  <span className="flex cursor-pointer items-center gap-1 text-[11px] text-white/20 transition-colors hover:text-pink-400">
                    <Plus size={12} strokeWidth={2} />
                    Add content
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-white/[0.06] bg-[#111114] p-4 text-center">
          <p className="text-2xl font-bold text-white">{thisWeekCount}</p>
          <p className="mt-1 text-[11px] text-white/30">This Week</p>
        </div>
        <div className="rounded-2xl border border-white/[0.06] bg-[#111114] p-4 text-center">
          <p className="text-2xl font-bold text-white">{platformCount}</p>
          <p className="mt-1 text-[11px] text-white/30">Platforms</p>
        </div>
        <div className="rounded-2xl border border-white/[0.06] bg-[#111114] p-4 text-center">
          <p className="text-2xl font-bold text-white">{consistencyLabel}</p>
          <p className="mt-1 text-[11px] text-white/30">Consistency</p>
        </div>
      </div>

      {modalDateKey && modalDate && (
        <div
          className="planner-modal-overlay"
          role="presentation"
          onClick={closeModal}
        >
          <div
            className="planner-modal captions-fade-in"
            role="dialog"
            aria-modal="true"
            aria-labelledby="planner-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#EC4899]/70">
                  {modalDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <h2
                  id="planner-modal-title"
                  className="mt-1 text-xl font-semibold tracking-[-0.03em] text-white"
                >
                  Plan content
                </h2>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg border border-white/10 bg-white/5 p-2 text-white/50 transition-colors hover:border-white/20 hover:text-white"
                aria-label="Close"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
                  <path
                    d="M18 6 6 18M6 6l12 12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            {modalPins.length > 0 && (
              <ul className="mt-6 max-h-48 space-y-2 overflow-y-auto">
                {modalPins.map((pin) => (
                  <li
                    key={pin.id}
                    className="flex items-start gap-3 rounded-xl border border-pink-500/35 bg-pink-500/10 p-3"
                  >
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-sm bg-pink-500/50" />
                    <button
                      type="button"
                      onClick={() => setViewingPin(pin)}
                      className="min-w-0 flex-1 text-left"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-pink-200/80">
                        {PIN_TYPE_LABELS[pin.content_type] ?? pin.content_type}
                        {pin.pin_time ? ` · ${formatPinTime(pin.pin_time)}` : ""}
                      </p>
                      <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-white/85">
                        {pin.content_text}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {modalItems.length > 0 && (
              <ul className="mt-6 max-h-48 space-y-2 overflow-y-auto">
                {modalItems.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-start gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] p-3"
                  >
                    <span
                      className={`mt-0.5 shrink-0 rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase ${PLATFORM_CHIP[item.platform]}`}
                    >
                      {item.platform.slice(0, 2)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm leading-relaxed text-white/85">
                        {item.idea}
                      </p>
                      <p className="mt-1 text-[11px] text-white/35">
                        {item.contentType} · {item.status}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(modalDateKey, item.id)}
                      className="shrink-0 text-xs text-white/30 transition-colors hover:text-red-400"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-6 space-y-5 border-t border-white/[0.06] pt-6">
              <div>
                <label htmlFor="planner-idea" className="premium-field-label">
                  Content idea
                </label>
                <textarea
                  id="planner-idea"
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  placeholder="What's the content about?"
                  rows={3}
                  className="premium-input premium-textarea mt-2 w-full text-sm"
                />
              </div>

              <div>
                <p className="premium-field-label">Platform</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {PLATFORMS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPlatform(p.id)}
                      className={`premium-pill${
                        platform === p.id ? " premium-pill--active" : ""
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="premium-field-label">Content type</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {CONTENT_TYPES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setContentType(t.id)}
                      className={`premium-pill${
                        contentType === t.id ? " premium-pill--active" : ""
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="premium-field-label">Status</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {STATUSES.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setStatus(s.id)}
                      className={`premium-pill${
                        status === s.id ? " premium-pill--active" : ""
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={addItem}
                disabled={!idea.trim()}
                className="premium-generate-btn disabled:!opacity-40"
              >
                Add to calendar
              </button>
            </div>
          </div>
        </div>
      )}

      {viewingPin && (
        <div
          className="planner-modal-overlay"
          role="presentation"
          onClick={() => setViewingPin(null)}
        >
          <div
            className="planner-modal captions-fade-in max-w-lg"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pin-view-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#EC4899]/70">
                  {viewingPin.pin_date}
                  {viewingPin.pin_time
                    ? ` · ${formatPinTime(viewingPin.pin_time)}`
                    : ""}
                </p>
                <h2
                  id="pin-view-title"
                  className="mt-1 text-lg font-semibold tracking-[-0.03em] text-white"
                >
                  {PIN_TYPE_LABELS[viewingPin.content_type] ??
                    viewingPin.content_type}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setViewingPin(null)}
                className="rounded-lg border border-white/10 bg-white/5 p-2 text-white/50 transition-colors hover:border-white/20 hover:text-white"
                aria-label="Close"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
                  <path
                    d="M18 6 6 18M6 6l12 12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
            <p className="mt-5 whitespace-pre-wrap text-sm leading-relaxed text-white/80">
              {viewingPin.content_text}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
