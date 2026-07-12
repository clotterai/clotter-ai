import { ContentPlanner } from "./content-planner";

const gradientTextStyle = {
  background: "linear-gradient(135deg, #EC4899, #F97316)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
} as const;

export default function PlannerPage() {
  return (
    <div className="min-h-screen bg-[#09090B]">
      <div className="px-6 py-8 md:px-10">
        <header>
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.2em]"
            style={gradientTextStyle}
          >
            CONTENT PLANNER
          </p>
          <h1 className="mt-2 text-4xl font-bold text-white md:text-5xl">
            Plan your week.
          </h1>
          <p className="mt-2 text-sm text-white/35">
            Schedule your content. Stay consistent. Grow faster.
          </p>
        </header>

        <ContentPlanner />
      </div>
    </div>
  );
}
