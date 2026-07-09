import { FeaturePageShell } from "../components/feature-page-shell";
import { HookGenerator } from "./hook-generator";

export default function HooksPage() {
  return (
    <FeaturePageShell
      label="Hook Generator"
      title="Open with a hook they can't skip."
      subtitle="Enter your video topic, pick a platform, and get ten scroll-stopping opening lines in seconds."
    >
      <HookGenerator />
    </FeaturePageShell>
  );
}
