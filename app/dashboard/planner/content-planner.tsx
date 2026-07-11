"use client";

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

const PLATFORM_DOT: Record<Platform, string> = {
  instagram: "bg-pink-500",
  youtube: "bg-red-500",
  tiktok: "bg-cyan-400",
  linkedin: "bg-blue-500",
};

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
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  const start = weekStart.toLocaleDateString("en-US", opts);
  const end = weekEnd.toLocaleDateString("en-US", {
    ...opts,
    year: weekStart.getFullYear() !== weekEnd.getFullYear() ? "numeric" : undefined,
  });
  const year =
    weekStart.getFullYear() === weekEnd.getFullYear()
      ? weekStart.getFullYear()
      : `${weekStart.getFullYear()}–${weekEnd.getFullYear()}`;
  return `${start} – ${end}, ${year}`;
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

  return (
    <>
      <div className="premium-feature-body">
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={goToPrevWeek}
            className="premium-pill"
            aria-label="Previous week"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
              <path
                d="m15 18-6-6 6-6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <span className="min-w-[200px] text-center text-sm font-semibold tracking-[-0.02em] text-white/80 sm:text-base">
            {formatWeekLabel(weekStart)}
          </span>
          <button
            type="button"
            onClick={goToNextWeek}
            className="premium-pill"
            aria-label="Next week"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
              <path
                d="m9 18 6-6-6-6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={goToThisWeek}
            className="premium-pill premium-pill--active"
          >
            Today
          </button>
        </div>

      <div className="relative z-10 flex-1 overflow-x-auto pb-8">
        <div className="min-w-[720px]">
          <div className="grid grid-cols-7 gap-3 sm:gap-4">
            {weekDays.map(({ name, date }, index) => {
              const dateKey = toDateKey(date);
              const items = store[dateKey] ?? [];
              const dayPins = pinsByDate[dateKey] ?? [];
              const today = isToday(date);

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
                  className={`planner-day-card group cursor-pointer text-left${
                    today ? " planner-day-card--today" : ""
                  }`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span
                      className={`text-xs font-semibold uppercase tracking-[0.08em] ${
                        today ? "text-[#EC4899]" : "text-white/40"
                      }`}
                    >
                      {name}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {dayPins.length > 0 && (
                        <span className="flex items-center gap-0.5" aria-hidden>
                          {dayPins.slice(0, 3).map((pin) => (
                            <span
                              key={pin.id}
                              className="h-2 w-2 rounded-full bg-[#EC4899] shadow-[0_0_8px_#EC4899]"
                              title={PIN_TYPE_LABELS[pin.content_type] ?? pin.content_type}
                            />
                          ))}
                          {dayPins.length > 3 && (
                            <span className="text-[9px] font-medium text-pink-300/80">
                              +{dayPins.length - 3}
                            </span>
                          )}
                        </span>
                      )}
                      <span
                        className={`text-lg font-bold tabular-nums tracking-[-0.03em] ${
                          today ? "text-white" : "text-white/70"
                        }`}
                      >
                        {date.getDate()}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 flex min-h-[88px] flex-col gap-1.5">
                    {dayPins.map((pin) => (
                      <button
                        key={pin.id}
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setViewingPin(pin);
                        }}
                        className="flex items-center gap-1.5 truncate rounded-md border border-pink-500/35 bg-pink-500/15 px-2 py-1 text-left text-[10px] font-medium leading-tight text-pink-100 sm:text-[11px]"
                        title={pin.content_text}
                      >
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#EC4899]" />
                        <span className="truncate">
                          {PIN_TYPE_LABELS[pin.content_type] ?? pin.content_type}
                        </span>
                      </button>
                    ))}
                    {items.length === 0 && dayPins.length === 0 ? (
                      <span className="mt-auto text-[11px] text-white/25 transition-colors group-hover:text-white/40">
                        + Add content
                      </span>
                    ) : (
                      items.map((item) => (
                        <span
                          key={item.id}
                          className={`truncate rounded-md border px-2 py-1 text-[10px] font-medium leading-tight sm:text-[11px] ${PLATFORM_CHIP[item.platform]}`}
                          title={item.idea}
                        >
                          {item.idea}
                        </span>
                      ))
                    )}
                  </div>

                  {(items.length > 0 || dayPins.length > 0) && (
                    <span className="mt-2 text-[10px] font-medium text-white/30">
                      {items.length + dayPins.length} item
                      {items.length + dayPins.length !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-10 flex flex-wrap gap-4 text-xs text-white/40">
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#EC4899]" />
              AI pinned content
            </span>
            {PLATFORMS.map((p) => (
              <span key={p.id} className="flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${PLATFORM_DOT[p.id]}`}
                />
                {p.label}
              </span>
            ))}
          </div>
        </div>
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
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#EC4899]" />
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
                    className="flex items-start gap-3 rounded-xl border border-pink-500/30 bg-[#0D0D1A]/60 p-3"
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
