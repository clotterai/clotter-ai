"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, type ReactNode } from "react";

const TOTAL_STEPS = 7;

const niches = [
  "Fitness",
  "Fashion",
  "Beauty",
  "Tech",
  "Food",
  "Travel",
  "AI",
  "Entrepreneurship",
  "Comedy",
  "Education",
  "Lifestyle",
  "Gaming",
  "Finance",
  "Music",
  "Dance",
  "Art & Design",
  "Photography",
  "Sports",
  "Health & Wellness",
  "Parenting",
  "Pets",
  "DIY & Crafts",
  "Cooking",
  "Motivation",
  "Relationships",
  "True Crime",
  "News",
  "Real Estate",
  "Crypto",
  "Cars",
  "Architecture",
  "Books",
  "Movies & TV",
  "Skincare",
  "Mental Health",
  "Sustainability",
  "Science",
  "History",
  "Politics",
  "Personal Finance",
  "Other",
];

const platforms = ["Instagram", "YouTube", "TikTok", "LinkedIn"];
const ageRanges = ["13-17", "18-24", "25-34", "35-44", "45+"];
const locations = ["India", "USA", "UK", "Global", "Other"];
const genders = ["Mostly female", "Mostly male", "Mixed"];
const contentStyles = [
  "Educational",
  "Entertaining",
  "Motivational",
  "Storytelling",
  "Funny",
  "Controversial",
];
const goals = [
  "Grow to 10k",
  "Grow to 100k",
  "Get brand deals",
  "Sell my products",
  "Build personal brand",
];
const frequencies = ["Daily", "3-4x week", "1-2x week", "Monthly"];

type StepConfig = {
  title: string;
  subtitle: string;
};

const STEP_CONFIG: StepConfig[] = [
  {
    title: "What's your creator niche?",
    subtitle: "Select all that apply — you can pick more than one.",
  },
  {
    title: "What platforms do you create for?",
    subtitle: "Select every platform you publish on.",
  },
  {
    title: "Who is your audience?",
    subtitle: "Select all age ranges, locations, and genders that fit.",
  },
  {
    title: "What's your content style?",
    subtitle: "Pick every style that sounds like you.",
  },
  {
    title: "What are your biggest goals?",
    subtitle: "Select all goals you're working toward right now.",
  },
  {
    title: "How often do you post?",
    subtitle: "Select all frequencies that match your rhythm.",
  },
  {
    title: "What makes your content unique?",
    subtitle: "Your angle, perspective, or secret sauce — this is your superpower.",
  },
];

function toggleInList(list: string[], value: string): string[] {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];
}

function Confetti() {
  return (
    <div aria-hidden className="memory-confetti pointer-events-none fixed inset-0 z-[200]">
      {Array.from({ length: 48 }).map((_, i) => (
        <span
          key={i}
          className="memory-confetti-piece"
          style={{
            left: `${(i * 17) % 100}%`,
            animationDelay: `${(i % 8) * 0.08}s`,
            background:
              i % 3 === 0 ? "#EC4899" : i % 3 === 1 ? "#F97316" : "#FB923C",
          }}
        />
      ))}
    </div>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 12 12" fill="none" className="h-2.5 w-2.5" aria-hidden>
      <path
        d="M2.5 6l2.5 2.5 4.5-5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function OptionPill({
  label,
  selected,
  onToggle,
}: {
  label: string;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      className={`onboarding-v2-pill${selected ? " onboarding-v2-pill--selected" : ""}`}
    >
      {selected && (
        <span className="onboarding-v2-pill-check" aria-hidden>
          <CheckIcon />
        </span>
      )}
      {label}
    </button>
  );
}

function OptionGrid({
  options,
  selected,
  onToggle,
}: {
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="grid w-full grid-cols-2 gap-3 md:grid-cols-3">
      {options.map((option) => (
        <OptionPill
          key={option}
          label={option}
          selected={selected.includes(option)}
          onToggle={() => onToggle(option)}
        />
      ))}
    </div>
  );
}

function ProgressHeader({ step, progress }: { step: number; progress: number }) {
  return (
    <div className="onboarding-v2-progress-wrap">
      <div className="mx-auto w-full max-w-2xl">
        <div className="onboarding-v2-progress-track">
          <div
            className="onboarding-v2-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="onboarding-v2-step-dots" aria-hidden>
          {Array.from({ length: TOTAL_STEPS }).map((_, index) => (
            <span
              key={index}
              className={`onboarding-v2-step-dot${
                index === step
                  ? " onboarding-v2-step-dot--active"
                  : index < step
                    ? " onboarding-v2-step-dot--done"
                    : ""
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function StepSection({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
        {label}
      </p>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {options.map((option) => (
          <OptionPill
            key={option}
            label={option}
            selected={selected.includes(option)}
            onToggle={() => onToggle(option)}
          />
        ))}
      </div>
    </div>
  );
}

export function OnboardingFlow() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<"next" | "back">("next");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedNiches, setSelectedNiches] = useState<string[]>([]);
  const [subNiche, setSubNiche] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedAudienceAges, setSelectedAudienceAges] = useState<string[]>([]);
  const [selectedAudienceLocations, setSelectedAudienceLocations] = useState<
    string[]
  >([]);
  const [selectedAudienceGenders, setSelectedAudienceGenders] = useState<
    string[]
  >([]);
  const [selectedContentStyles, setSelectedContentStyles] = useState<string[]>(
    [],
  );
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedFrequencies, setSelectedFrequencies] = useState<string[]>([]);
  const [uniqueAngle, setUniqueAngle] = useState("");

  const progress = ((step + 1) / TOTAL_STEPS) * 100;
  const stepConfig = STEP_CONFIG[step];

  const selectionCount = useMemo(() => {
    switch (step) {
      case 0:
        return selectedNiches.length;
      case 1:
        return selectedPlatforms.length;
      case 2:
        return (
          selectedAudienceAges.length +
          selectedAudienceLocations.length +
          selectedAudienceGenders.length
        );
      case 3:
        return selectedContentStyles.length;
      case 4:
        return selectedGoals.length;
      case 5:
        return selectedFrequencies.length;
      case 6:
        return uniqueAngle.trim().length > 10 ? 1 : 0;
      default:
        return 0;
    }
  }, [
    step,
    selectedNiches,
    selectedPlatforms,
    selectedAudienceAges,
    selectedAudienceLocations,
    selectedAudienceGenders,
    selectedContentStyles,
    selectedGoals,
    selectedFrequencies,
    uniqueAngle,
  ]);

  const canContinue = useMemo(() => {
    switch (step) {
      case 0:
        return (
          selectedNiches.length > 0 &&
          (!selectedNiches.includes("Other") || subNiche.trim().length > 0)
        );
      case 1:
        return selectedPlatforms.length > 0;
      case 2:
        return (
          selectedAudienceAges.length > 0 ||
          selectedAudienceLocations.length > 0 ||
          selectedAudienceGenders.length > 0
        );
      case 3:
        return selectedContentStyles.length > 0;
      case 4:
        return selectedGoals.length > 0;
      case 5:
        return selectedFrequencies.length > 0;
      case 6:
        return uniqueAngle.trim().length > 10;
      default:
        return false;
    }
  }, [
    step,
    selectedNiches,
    subNiche,
    selectedPlatforms,
    selectedAudienceAges,
    selectedAudienceLocations,
    selectedAudienceGenders,
    selectedContentStyles,
    selectedGoals,
    selectedFrequencies,
    uniqueAngle,
  ]);

  function goNext() {
    if (!canContinue) return;
    setDirection("next");
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  }

  function goBack() {
    setDirection("back");
    setStep((s) => Math.max(s - 1, 0));
  }

  async function completeOnboarding() {
    if (!canContinue || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/memory/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          niches: selectedNiches,
          subNiche: selectedNiches.includes("Other") ? subNiche : undefined,
          platforms: selectedPlatforms,
          audienceAges: selectedAudienceAges,
          audienceLocations: selectedAudienceLocations,
          audienceGenders: selectedAudienceGenders,
          contentStyles: selectedContentStyles,
          biggestGoals: selectedGoals,
          postingFrequencies: selectedFrequencies,
          uniqueAngle,
        }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Failed to save your profile.");
      }

      setShowConfetti(true);
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 1800);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setIsSubmitting(false);
    }
  }

  function renderStepContent(): ReactNode {
    switch (step) {
      case 0:
        return (
          <>
            <OptionGrid
              options={niches}
              selected={selectedNiches}
              onToggle={(value) =>
                setSelectedNiches((prev) => toggleInList(prev, value))
              }
            />
            {selectedNiches.includes("Other") && (
              <input
                type="text"
                value={subNiche}
                onChange={(e) => setSubNiche(e.target.value)}
                placeholder="Describe your niche..."
                className="onboarding-input mt-5 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-base text-white placeholder-white/30 focus:border-pink-500/50 focus:outline-none focus:shadow-[0_0_20px_-5px_rgba(236,72,153,0.3)]"
              />
            )}
          </>
        );
      case 1:
        return (
          <OptionGrid
            options={platforms}
            selected={selectedPlatforms}
            onToggle={(value) =>
              setSelectedPlatforms((prev) => toggleInList(prev, value))
            }
          />
        );
      case 2:
        return (
          <div className="space-y-8">
            <StepSection
              label="Age range"
              options={ageRanges}
              selected={selectedAudienceAges}
              onToggle={(value) =>
                setSelectedAudienceAges((prev) => toggleInList(prev, value))
              }
            />
            <StepSection
              label="Location"
              options={locations}
              selected={selectedAudienceLocations}
              onToggle={(value) =>
                setSelectedAudienceLocations((prev) => toggleInList(prev, value))
              }
            />
            <StepSection
              label="Gender"
              options={genders}
              selected={selectedAudienceGenders}
              onToggle={(value) =>
                setSelectedAudienceGenders((prev) => toggleInList(prev, value))
              }
            />
          </div>
        );
      case 3:
        return (
          <OptionGrid
            options={contentStyles}
            selected={selectedContentStyles}
            onToggle={(value) =>
              setSelectedContentStyles((prev) => toggleInList(prev, value))
            }
          />
        );
      case 4:
        return (
          <OptionGrid
            options={goals}
            selected={selectedGoals}
            onToggle={(value) =>
              setSelectedGoals((prev) => toggleInList(prev, value))
            }
          />
        );
      case 5:
        return (
          <OptionGrid
            options={frequencies}
            selected={selectedFrequencies}
            onToggle={(value) =>
              setSelectedFrequencies((prev) => toggleInList(prev, value))
            }
          />
        );
      case 6:
        return (
          <textarea
            value={uniqueAngle}
            onChange={(e) => setUniqueAngle(e.target.value)}
            rows={6}
            placeholder="e.g. I break down complex AI tools for non-technical creators in under 60 seconds..."
            className="onboarding-input w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-base text-white placeholder-white/30 focus:border-pink-500/50 focus:outline-none focus:shadow-[0_0_20px_-5px_rgba(236,72,153,0.3)]"
          />
        );
      default:
        return null;
    }
  }

  const continueLabel =
    step < TOTAL_STEPS - 1
      ? selectionCount > 0
        ? `Continue (${selectionCount} selected)`
        : "Continue"
      : isSubmitting
        ? "Building your DNA..."
        : "Complete setup";

  return (
    <div
      className="onboarding-flow relative fixed inset-0 z-[200] flex min-h-screen flex-col overflow-hidden bg-[#0D0D1A] text-white"
      style={{ backgroundColor: "#0D0D1A", color: "#ffffff" }}
    >
      {showConfetti && <Confetti />}

      <ProgressHeader step={step} progress={progress} />

      <div className="relative z-10 flex min-h-0 flex-1 flex-col overflow-y-auto">
        <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 pb-4 pt-6 md:px-6 md:pt-8">
          <div className="mb-8 text-center md:mb-10">
            <h1 className="font-heading text-xl font-bold tracking-[-0.02em] text-white md:text-2xl">
              Let&apos;s build your Creator DNA
            </h1>
            <p className="mt-2 text-sm text-white/40">
              Clotter learns who you are — so every script, caption, and idea
              feels like it came from you.
            </p>
          </div>

          <div
            key={step}
            className={`onboarding-v2-step w-full flex-1 ${
              direction === "next"
                ? "onboarding-v2-step--next"
                : "onboarding-v2-step--back"
            }`}
          >
            <h2 className="font-heading mb-2 text-2xl font-bold tracking-[-0.02em] text-white md:text-3xl">
              {stepConfig.title}
            </h2>
            <p className="mb-6 text-sm text-white/40">{stepConfig.subtitle}</p>
            {renderStepContent()}
          </div>

          {error && (
            <p className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-300">
              {error}
            </p>
          )}
        </div>
      </div>

      <div className="onboarding-v2-sticky-footer">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 0 || isSubmitting}
            className="onboarding-v2-back-btn md:max-w-[140px]"
          >
            Back
          </button>

          {step < TOTAL_STEPS - 1 ? (
            <button
              type="button"
              onClick={goNext}
              disabled={!canContinue}
              className="onboarding-v2-continue-btn md:flex-1"
            >
              {continueLabel}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => void completeOnboarding()}
              disabled={!canContinue || isSubmitting}
              className="onboarding-v2-continue-btn md:flex-1"
            >
              {continueLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
