import { FeaturePageShell } from "../components/feature-page-shell";
import { ScriptGenerator } from "./script-generator";

export default function ScriptPage() {
  return (
    <FeaturePageShell
      label="Script Generator"
      title="Write scripts that go viral."
      subtitle="Professional, retention-optimized video scripts with hooks, timestamps, and CTAs — tailored to your platform and tone."
    >
      <ScriptGenerator />
    </FeaturePageShell>
  );
}
