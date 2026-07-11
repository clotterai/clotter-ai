import { PremiumBackground } from "../components/premium-background";
import { ContentPlanner } from "./content-planner";

export default function PlannerPage() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#09090B]">
      <PremiumBackground variant="feature" />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-6 sm:px-6 sm:py-8">
        <header className="shrink-0">
          <p className="premium-feature-label">Content Planner</p>
          <div
            aria-hidden
            className="mt-2 h-[2px] w-8 rounded-full"
            style={{
              background: "linear-gradient(135deg, #EC4899, #F97316)",
            }}
          />
          <h1 className="mt-4 text-3xl font-bold leading-tight tracking-[-0.02em] text-white">
            Plan your week.
          </h1>
          <p className="mt-1 max-w-sm text-sm text-white/35">
            Map your content, stay consistent, grow faster.
          </p>
        </header>

        <div className="mt-8 flex min-h-0 flex-1 flex-col">
          <ContentPlanner />
        </div>
      </div>
    </div>
  );
}
