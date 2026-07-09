import { FeaturePageShell } from "../components/feature-page-shell";
import { MemoryDashboard } from "./memory-dashboard";

export default function MemoryPage() {
  return (
    <FeaturePageShell
      label="AI Memory"
      title="Your Creator Brain"
      subtitle="The more Clotter knows you, the better it gets."
    >
      <MemoryDashboard />
    </FeaturePageShell>
  );
}
