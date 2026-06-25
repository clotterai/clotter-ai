import { PremiumBackground } from "../components/premium-background";
import { OnboardingFlow } from "./onboarding-flow";

export default function OnboardingPage() {
  return (
    <div
      className="fixed inset-0 z-[100] flex min-h-screen flex-col overflow-y-auto bg-[#0D0D1A] text-white"
      style={{ backgroundColor: "#0D0D1A" }}
    >
      <PremiumBackground />
      <div aria-hidden className="captions-top-shimmer" />
      <OnboardingFlow />
    </div>
  );
}
