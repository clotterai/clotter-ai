"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/app/dashboard/components/toast-provider";

export type PlannerContentType =
  | "caption"
  | "hook"
  | "idea"
  | "script"
  | "chat"
  | "trend";

const CONTENT_TYPE_LABELS: Record<PlannerContentType, string> = {
  caption: "Caption",
  hook: "Hook",
  idea: "Content Idea",
  script: "Script",
  chat: "Chat",
  trend: "Trend",
};

type AddToPlannerButtonProps = {
  contentType: PlannerContentType;
  contentText: string;
  className?: string;
};

export function AddToPlannerButton({
  contentType,
  contentText,
  className = "",
}: AddToPlannerButtonProps) {
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const [pinDate, setPinDate] = useState(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  });
  const [pinTime, setPinTime] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function handlePin() {
    if (!contentText.trim() || isSaving) return;

    setIsSaving(true);
    try {
      const response = await fetch("/api/planner/pins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pin_date: pinDate,
          pin_time: pinTime.trim() || null,
          content_type: contentType,
          content_text: contentText.trim(),
        }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Failed to pin to planner.");
      }

      showToast("Pinned to planner");
      setOpen(false);
      setPinTime("");
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Failed to pin to planner.",
        "error",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-1.5 rounded-xl border border-pink-500/25 bg-pink-500/10 px-3 py-1.5 text-xs font-medium text-pink-200 transition-all hover:border-pink-500/40 hover:bg-pink-500/15 ${className}`}
      >
        <span aria-hidden>📅</span>
        Add to Planner
      </button>

      {open && (
        <div
          className="planner-modal-overlay"
          role="presentation"
          onClick={() => setOpen(false)}
        >
          <div
            className="planner-modal captions-fade-in max-w-md"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pin-planner-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#EC4899]/70">
                  Content Planner
                </p>
                <h2
                  id="pin-planner-title"
                  className="mt-1 text-lg font-semibold tracking-[-0.03em] text-white"
                >
                  Pin to Calendar
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
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

            <p className="mt-4 line-clamp-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm leading-relaxed text-white/65">
              {contentText.trim()}
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <label
                  htmlFor="pin-date"
                  className="text-xs font-semibold uppercase tracking-[0.1em] text-white/35"
                >
                  Date
                </label>
                <input
                  id="pin-date"
                  type="date"
                  value={pinDate}
                  onChange={(e) => setPinDate(e.target.value)}
                  className="premium-input mt-2 w-full text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="pin-time"
                  className="text-xs font-semibold uppercase tracking-[0.1em] text-white/35"
                >
                  Time <span className="normal-case text-white/25">(optional)</span>
                </label>
                <input
                  id="pin-time"
                  type="time"
                  value={pinTime}
                  onChange={(e) => setPinTime(e.target.value)}
                  className="premium-input mt-2 w-full text-sm"
                />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-white/35">
                  Content type
                </p>
                <p className="mt-2 rounded-xl border border-pink-500/25 bg-pink-500/10 px-3 py-2 text-sm font-medium text-pink-100">
                  {CONTENT_TYPE_LABELS[contentType]}
                </p>
              </div>

              <button
                type="button"
                onClick={() => void handlePin()}
                disabled={isSaving || !pinDate}
                className="premium-generate-btn disabled:!opacity-50"
              >
                {isSaving ? "Pinning..." : "Pin to Calendar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
