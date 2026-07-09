import { FeaturePageShell } from "../components/feature-page-shell";
import { CaptionGenerator } from "./caption-generator";

export default function CaptionsPage() {
  return (
    <FeaturePageShell
      label="Caption Generator"
      title="Write captions that stop the scroll."
      subtitle="Describe your post, choose a tone, and get five scroll-stopping captions crafted for your audience."
    >
      <CaptionGenerator />
    </FeaturePageShell>
  );
}
