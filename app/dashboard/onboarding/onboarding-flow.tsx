"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const TOTAL_STEPS = 7;

const niches = [
  "Fitness",
  "Fashion",
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
  "Other",
];

const platforms = [
  "Instagram",
  "YouTube",
  "TikTok",
  "LinkedIn",
];

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
              i % 3 === 0 ? "#6366F1" : i % 3 === 1 ? "#A855F7" : "#C084FC",
          }}
        />
      ))}
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

  const [niche, setNiche] = useState("");
  const [subNiche, setSubNiche] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [audienceAge, setAudienceAge] = useState("");
  const [audienceLocation, setAudienceLocation] = useState("");
  const [audienceGender, setAudienceGender] = useState("");
  const [contentStyle, setContentStyle] = useState("");
  const [biggestGoal, setBiggestGoal] = useState("");
  const [postingFrequency, setPostingFrequency] = useState("");
  const [uniqueAngle, setUniqueAngle] = useState("");

  const progress = ((step + 1) / TOTAL_STEPS) * 100;

  const canContinue = useMemo(() => {
    switch (step) {
      case 0:
        return niche.length > 0 && (niche !== "Other" || subNiche.trim().length > 0);
      case 1:
        return selectedPlatforms.length > 0;
      case 2:
        return audienceAge && audienceLocation && audienceGender;
      case 3:
        return contentStyle.length > 0;
      case 4:
        return biggestGoal.length > 0;
      case 5:
        return postingFrequency.length > 0;
      case 6:
        return uniqueAngle.trim().length > 10;
      default:
        return false;
    }
  }, [
    step,
    niche,
    subNiche,
    selectedPlatforms,
    audienceAge,
    audienceLocation,
    audienceGender,
    contentStyle,
    biggestGoal,
    postingFrequency,
    uniqueAngle,
  ]);

  function togglePlatform(platform: string) {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform],
    );
  }

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
          niche,
          subNiche: niche === "Other" ? subNiche : undefined,
          platforms: selectedPlatforms,
          audienceAge,
          audienceLocation,
          audienceGender,
          contentStyle,
          biggestGoal,
          postingFrequency,
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

  return (
    <>
      {showConfetti && <Confetti />}

      <div className="relative flex min-h-screen flex-col">
        <div className="memory-onboarding-progress">
          <div
            className="memory-onboarding-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 sm:px-10">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6366F1]">
              Step {step + 1} of {TOTAL_STEPS}
            </p>
            <h1 className="font-heading mt-3 text-[2rem] font-bold tracking-[-0.02em] text-white sm:text-[2.5rem]">
              Let&apos;s build your Creator DNA
            </h1>
            <p className="mt-3 max-w-lg text-base text-white/45">
              Clotter learns who you are — so every script, caption, and idea
              feels like it came from you.
            </p>
          </div>

          <div
            key={step}
            className={`memory-onboarding-step w-full max-w-2xl ${
              direction === "next"
                ? "memory-onboarding-step--next"
                : "memory-onboarding-step--back"
            }`}
          >
            {step === 0 && (
              <section>
                <h2 className="font-heading text-xl font-bold tracking-[-0.02em] text-white">
                  What&apos;s your creator niche?
                </h2>
                <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                  {niches.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setNiche(option)}
                      className={`memory-onboarding-card${
                        niche === option ? " memory-onboarding-card--active" : ""
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                {niche === "Other" && (
                  <input
                    type="text"
                    value={subNiche}
                    onChange={(e) => setSubNiche(e.target.value)}
                    placeholder="Describe your niche..."
                    className="captions-textarea mt-4 !min-h-0 !py-3.5"
                  />
                )}
              </section>
            )}

            {step === 1 && (
              <section>
                <h2 className="font-heading text-xl font-bold tracking-[-0.02em] text-white">
                  What platforms do you create for?
                </h2>
                <p className="mt-2 text-sm text-white/40">Select all that apply</p>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  {platforms.map((platform) => (
                    <button
                      key={platform}
                      type="button"
                      onClick={() => togglePlatform(platform)}
                      className={`memory-onboarding-card memory-onboarding-card--platform${
                        selectedPlatforms.includes(platform)
                          ? " memory-onboarding-card--active"
                          : ""
                      }`}
                    >
                      {platform}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {step === 2 && (
              <section className="space-y-6">
                <div>
                  <h2 className="font-heading text-xl font-bold tracking-[-0.02em] text-white">
                    Who is your audience?
                  </h2>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.1em] text-white/35">
                    Age range
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {ageRanges.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setAudienceAge(option)}
                        className={`captions-tone-pill${
                          audienceAge === option ? " captions-tone-pill--active" : ""
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-white/35">
                    Location
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {locations.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setAudienceLocation(option)}
                        className={`captions-tone-pill${
                          audienceLocation === option
                            ? " captions-tone-pill--active"
                            : ""
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-white/35">
                    Gender
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {genders.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setAudienceGender(option)}
                        className={`captions-tone-pill${
                          audienceGender === option
                            ? " captions-tone-pill--active"
                            : ""
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {step === 3 && (
              <section>
                <h2 className="font-heading text-xl font-bold tracking-[-0.02em] text-white">
                  What&apos;s your content style?
                </h2>
                <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                  {contentStyles.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setContentStyle(option)}
                      className={`memory-onboarding-card${
                        contentStyle === option
                          ? " memory-onboarding-card--active"
                          : ""
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {step === 4 && (
              <section>
                <h2 className="font-heading text-xl font-bold tracking-[-0.02em] text-white">
                  What&apos;s your biggest goal right now?
                </h2>
                <div className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {goals.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setBiggestGoal(option)}
                      className={`memory-onboarding-card${
                        biggestGoal === option
                          ? " memory-onboarding-card--active"
                          : ""
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {step === 5 && (
              <section>
                <h2 className="font-heading text-xl font-bold tracking-[-0.02em] text-white">
                  How often do you post?
                </h2>
                <div className="mt-6 flex flex-wrap gap-2">
                  {frequencies.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setPostingFrequency(option)}
                      className={`captions-tone-pill${
                        postingFrequency === option
                          ? " captions-tone-pill--active"
                          : ""
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {step === 6 && (
              <section>
                <h2 className="font-heading text-xl font-bold tracking-[-0.02em] text-white">
                  What makes your content unique?
                </h2>
                <p className="mt-2 text-sm text-white/40">
                  Your angle, perspective, or secret sauce — this is your superpower.
                </p>
                <textarea
                  value={uniqueAngle}
                  onChange={(e) => setUniqueAngle(e.target.value)}
                  rows={5}
                  placeholder="e.g. I break down complex AI tools for non-technical creators in under 60 seconds..."
                  className="captions-textarea mt-6 w-full resize-none"
                />
              </section>
            )}
          </div>

          {error && (
            <p className="mt-6 max-w-2xl rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-300">
              {error}
            </p>
          )}

          <div className="mt-10 flex w-full max-w-2xl items-center justify-between gap-4">
            <button
              type="button"
              onClick={goBack}
              disabled={step === 0 || isSubmitting}
              className="script-action-btn disabled:opacity-40"
            >
              Back
            </button>

            {step < TOTAL_STEPS - 1 ? (
              <button
                type="button"
                onClick={goNext}
                disabled={!canContinue}
                className="script-action-btn script-action-btn--primary disabled:opacity-40"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={() => void completeOnboarding()}
                disabled={!canContinue || isSubmitting}
                className="script-action-btn script-action-btn--primary disabled:opacity-40"
              >
                {isSubmitting ? "Building your DNA..." : "Complete setup"}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
