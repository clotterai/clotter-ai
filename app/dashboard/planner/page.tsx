import { FeaturePageShell } from "../components/feature-page-shell";
import { ContentPlanner } from "./content-planner";

export default function PlannerPage() {
  return (
    <FeaturePageShell
      label="Content Planner"
      title="Plan your week. Own your growth."
      subtitle="Map your content across the week — click any day to schedule ideas, track status, and stay consistent."
      wide
    >
      <ContentPlanner />
    </FeaturePageShell>
  );
}
