import { FeaturePageShell } from "../components/feature-page-shell";
import { ContentIdeasGenerator } from "./content-ideas-generator";

export default function ContentIdeasPage() {
  return (
    <FeaturePageShell
      label="Content Ideas"
      title="Never run out of content."
      subtitle="Enter your niche, pick a platform, and get twenty viral content ideas tailored to your audience."
    >
      <ContentIdeasGenerator />
    </FeaturePageShell>
  );
}
