import { FeaturePageShell } from "../components/feature-page-shell";
import { TrendAnalyzer } from "./trend-analyzer";

export default function TrendsPage() {
  return (
    <FeaturePageShell
      label="Trend Analyzer"
      title="Catch trends before they peak."
      subtitle="Enter your niche, pick a platform, and get ten trending topics with angles and viral potential scores."
    >
      <TrendAnalyzer />
    </FeaturePageShell>
  );
}
